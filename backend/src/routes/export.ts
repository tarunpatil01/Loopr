import express from 'express';
import * as csvWriter from 'csv-writer';
import path from 'path';
import fs from 'fs';
import Transaction from '../models/Transaction';
import { authenticateToken, AuthRequest } from '../middleware/auth';

const router = express.Router();

// Export transactions to CSV
router.post('/csv', authenticateToken, async (req: AuthRequest, res) => {
  try {
    const {
      columns = ['id', 'date', 'amount', 'category', 'status', 'user_id'],
      filters = {},
      filename = 'transactions_export'
    } = req.body;

    // Build filter object similar to transactions route
    const filter: any = {};

    if (filters.search) {
      filter.$or = [
        { user_id: { $regex: filters.search, $options: 'i' } },
        { description: { $regex: filters.search, $options: 'i' } }
      ];
    }

    if (filters.category && filters.category !== 'all') {
      filter.category = filters.category;
    }

    if (filters.status && filters.status !== 'all') {
      filter.status = filters.status;
    }

    if (filters.user_id && filters.user_id !== 'all') {
      filter.user_id = filters.user_id;
    }

    if (filters.startDate || filters.endDate) {
      filter.date = {};
      if (filters.startDate) {
        filter.date.$gte = new Date(filters.startDate);
      }
      if (filters.endDate) {
        filter.date.$lte = new Date(filters.endDate);
      }
    }

    if (filters.minAmount || filters.maxAmount) {
      filter.amount = {};
      if (filters.minAmount) {
        filter.amount.$gte = parseFloat(filters.minAmount);
      }
      if (filters.maxAmount) {
        filter.amount.$lte = parseFloat(filters.maxAmount);
      }
    }

    // Get transactions
    const transactions = await Transaction.find(filter)
      .sort({ date: -1 })
      .lean();

    if (transactions.length === 0) {
      return res.status(404).json({
        success: false,
        message: 'No transactions found for the specified criteria'
      });
    }

    // Create CSV headers based on selected columns
    const headerMap: { [key: string]: { id: string; title: string } } = {
      id: { id: 'id', title: 'ID' },
      date: { id: 'date', title: 'Date' },
      amount: { id: 'amount', title: 'Amount' },
      category: { id: 'category', title: 'Category' },
      status: { id: 'status', title: 'Status' },
      user_id: { id: 'user_id', title: 'User ID' },
      user_profile: { id: 'user_profile', title: 'User Profile' },
      description: { id: 'description', title: 'Description' },
      tags: { id: 'tags', title: 'Tags' },
      createdAt: { id: 'createdAt', title: 'Created At' },
      updatedAt: { id: 'updatedAt', title: 'Updated At' }
    };

    const csvHeaders = columns
      .filter((col: string) => headerMap[col])
      .map((col: string) => headerMap[col]);

    // Generate unique filename
    const timestamp = new Date().toISOString().replace(/[:.]/g, '-');
    const csvFilename = `${filename}_${timestamp}.csv`;
    const csvPath = path.join(process.cwd(), 'temp', csvFilename);

    // Ensure temp directory exists
    const tempDir = path.dirname(csvPath);
    if (!fs.existsSync(tempDir)) {
      fs.mkdirSync(tempDir, { recursive: true });
    }

    // Create CSV writer
    const csvWriterInstance = csvWriter.createObjectCsvWriter({
      path: csvPath,
      header: csvHeaders
    });

    // Prepare data for CSV
    const csvData = transactions.map(transaction => {
      const row: { [key: string]: any } = {};
      
      columns.forEach((col: string) => {
        if (col === 'date') {
          row[col] = new Date(transaction.date).toISOString().split('T')[0];
        } else if (col === 'createdAt' || col === 'updatedAt') {
          row[col] = (transaction as any)[col] ? new Date((transaction as any)[col]).toISOString() : '';
        } else if (col === 'tags') {
          row[col] = Array.isArray((transaction as any).tags) ? (transaction as any).tags.join(', ') : '';
        } else {
          row[col] = (transaction as any)[col] || '';
        }
      });
      
      return row;
    });

    // Write CSV file
    await csvWriterInstance.writeRecords(csvData);

    // Read file and send as response
    const fileBuffer = fs.readFileSync(csvPath);
    
    // Set response headers for file download
    res.setHeader('Content-Type', 'text/csv');
    res.setHeader('Content-Disposition', `attachment; filename="${csvFilename}"`);
    res.setHeader('Content-Length', fileBuffer.length);

    // Send file
    res.send(fileBuffer);

    // Clean up temp file after sending
    setTimeout(() => {
      try {
        if (fs.existsSync(csvPath)) {
          fs.unlinkSync(csvPath);
        }
      } catch (error) {
        console.error('Error cleaning up temp file:', error);
      }
    }, 5000); // Delete after 5 seconds

  } catch (error) {
    console.error('CSV export error:', error);
    res.status(500).json({
      success: false,
      message: 'Internal server error'
    });
  }
});

// Get available columns for export
router.get('/columns', authenticateToken, async (req: AuthRequest, res) => {
  try {
    const availableColumns = [
      { id: 'id', label: 'ID', type: 'number' },
      { id: 'date', label: 'Date', type: 'date' },
      { id: 'amount', label: 'Amount', type: 'number' },
      { id: 'category', label: 'Category', type: 'string' },
      { id: 'status', label: 'Status', type: 'string' },
      { id: 'user_id', label: 'User ID', type: 'string' },
      { id: 'user_profile', label: 'User Profile', type: 'string' },
      { id: 'description', label: 'Description', type: 'string' },
      { id: 'tags', label: 'Tags', type: 'array' },
      { id: 'createdAt', label: 'Created At', type: 'date' },
      { id: 'updatedAt', label: 'Updated At', type: 'date' }
    ];

    res.json({
      success: true,
      data: availableColumns
    });
  } catch (error) {
    console.error('Get columns error:', error);
    res.status(500).json({
      success: false,
      message: 'Internal server error'
    });
  }
});

export default router;

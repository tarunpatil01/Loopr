import express from 'express';
import Transaction from '../models/Transaction';
import { authenticateToken, AuthRequest } from '../middleware/auth';

const router = express.Router();

// Get all transactions with filtering, sorting, and pagination
router.get('/', authenticateToken, async (req: AuthRequest, res) => {
  try {
    const {
      page = 1,
      limit = 10,
      search,
      category,
      status,
      user_id,
      startDate,
      endDate,
      sortBy = 'date',
      sortOrder = 'desc',
      minAmount,
      maxAmount
    } = req.query;

    // Build filter object
    const filter: any = {};

    // Search across multiple fields
    if (search) {
      filter.$or = [
        { user_id: { $regex: search, $options: 'i' } },
        { description: { $regex: search, $options: 'i' } }
      ];
    }

    // Category filter
    if (category && category !== 'all') {
      filter.category = category;
    }

    // Status filter
    if (status && status !== 'all') {
      filter.status = status;
    }

    // User ID filter
    if (user_id && user_id !== 'all') {
      filter.user_id = user_id;
    }

    // Date range filter
    if (startDate || endDate) {
      filter.date = {};
      if (startDate) {
        filter.date.$gte = new Date(startDate as string);
      }
      if (endDate) {
        filter.date.$lte = new Date(endDate as string);
      }
    }

    // Amount range filter
    if (minAmount || maxAmount) {
      filter.amount = {};
      if (minAmount) {
        filter.amount.$gte = parseFloat(minAmount as string);
      }
      if (maxAmount) {
        filter.amount.$lte = parseFloat(maxAmount as string);
      }
    }

    // Build sort object
    const sort: any = {};
    sort[sortBy as string] = sortOrder === 'desc' ? -1 : 1;

    // Calculate pagination
    const pageNum = parseInt(page as string);
    const limitNum = parseInt(limit as string);
    const skip = (pageNum - 1) * limitNum;

    // Execute query with pagination
    const [transactions, total] = await Promise.all([
      Transaction.find(filter)
        .sort(sort)
        .skip(skip)
        .limit(limitNum)
        .lean(),
      Transaction.countDocuments(filter)
    ]);

    // Calculate pagination info
    const totalPages = Math.ceil(total / limitNum);
    const hasNextPage = pageNum < totalPages;
    const hasPrevPage = pageNum > 1;

    res.json({
      success: true,
      data: {
        transactions,
        pagination: {
          current: pageNum,
          total: totalPages,
          hasNext: hasNextPage,
          hasPrev: hasPrevPage,
          totalRecords: total
        }
      }
    });
  } catch (error) {
    console.error('Get transactions error:', error);
    res.status(500).json({
      success: false,
      message: 'Internal server error'
    });
  }
});

// Get transaction analytics/summary
router.get('/analytics', authenticateToken, async (req: AuthRequest, res) => {
  try {
    const { startDate, endDate } = req.query;

    // Build date filter
    const dateFilter: any = {};
    if (startDate || endDate) {
      if (startDate) dateFilter.$gte = new Date(startDate as string);
      if (endDate) dateFilter.$lte = new Date(endDate as string);
    }

    // Only match documents where date is a valid date
    const matchStage = Object.keys(dateFilter).length > 0
      ? { date: dateFilter, $expr: { $eq: [ { $type: "$date" }, "date" ] } }
      : { $expr: { $eq: [ { $type: "$date" }, "date" ] } };

    // Aggregation pipeline for analytics
    const [analytics] = await Transaction.aggregate([
      { $match: matchStage },
      {
        $group: {
          _id: null,
          totalRevenue: {
            $sum: {
              $cond: [{ $eq: ['$category', 'Revenue'] }, '$amount', 0]
            }
          },
          totalExpenses: {
            $sum: {
              $cond: [{ $eq: ['$category', 'Expense'] }, '$amount', 0]
            }
          },
          totalTransactions: { $sum: 1 },
          avgTransactionAmount: { $avg: '$amount' },
          paidTransactions: {
            $sum: {
              $cond: [{ $eq: ['$status', 'Paid'] }, 1, 0]
            }
          },
          pendingTransactions: {
            $sum: {
              $cond: [{ $eq: ['$status', 'Pending'] }, 1, 0]
            }
          }
        }
      },
      {
        $project: {
          _id: 0,
          totalRevenue: 1,
          totalExpenses: 1,
          netProfit: { $subtract: ['$totalRevenue', '$totalExpenses'] },
          totalTransactions: 1,
          avgTransactionAmount: { $round: ['$avgTransactionAmount', 2] },
          paidTransactions: 1,
          pendingTransactions: 1
        }
      }
    ]);

    // Category breakdown
    const categoryBreakdown = await Transaction.aggregate([
      { $match: matchStage },
      {
        $group: {
          _id: '$category',
          total: { $sum: '$amount' },
          count: { $sum: 1 }
        }
      }
    ]);

    // Monthly trends
    const monthlyTrends = await Transaction.aggregate([
      { $match: matchStage },
      {
        $group: {
          _id: {
            year: { $year: '$date' },
            month: { $month: '$date' },
            category: '$category'
          },
          total: { $sum: '$amount' },
          count: { $sum: 1 }
        }
      },
      { $sort: { '_id.year': 1, '_id.month': 1 } }
    ]);

    // Status breakdown
    const statusBreakdown = await Transaction.aggregate([
      { $match: matchStage },
      {
        $group: {
          _id: '$status',
          total: { $sum: '$amount' },
          count: { $sum: 1 }
        }
      }
    ]);

    res.json({
      success: true,
      data: {
        summary: analytics || {
          totalRevenue: 0,
          totalExpenses: 0,
          netProfit: 0,
          totalTransactions: 0,
          avgTransactionAmount: 0,
          paidTransactions: 0,
          pendingTransactions: 0
        },
        breakdowns: {
          category: categoryBreakdown,
          status: statusBreakdown
        },
        monthlyTrends
      }
    });
  } catch (error) {
    console.error('Get analytics error:', error);
    res.status(500).json({
      success: false,
      message: 'Internal server error'
    });
  }
});

// Get unique filter values
router.get('/filters', authenticateToken, async (req: AuthRequest, res) => {
  try {
    const [categories, statuses, userIds] = await Promise.all([
      Transaction.distinct('category'),
      Transaction.distinct('status'),
      Transaction.distinct('user_id')
    ]);

    res.json({
      success: true,
      data: {
        categories,
        statuses,
        userIds
      }
    });
  } catch (error) {
    console.error('Get filters error:', error);
    res.status(500).json({
      success: false,
      message: 'Internal server error'
    });
  }
});

// Create new transaction
router.post('/', authenticateToken, async (req: AuthRequest, res) => {
  try {
    const { amount, category, status, user_id, description, tags } = req.body;

    // Validation
    if (!amount || !category || !status || !user_id) {
      return res.status(400).json({
        success: false,
        message: 'Amount, category, status, and user_id are required'
      });
    }

    // Get the next ID
    const lastTransaction = await Transaction.findOne().sort({ id: -1 });
    const nextId = lastTransaction ? lastTransaction.id + 1 : 1;

    const transaction = new Transaction({
      id: nextId,
      date: new Date(),
      amount,
      category,
      status,
      user_id,
      description,
      tags: tags || []
    });

    await transaction.save();

    res.status(201).json({
      success: true,
      message: 'Transaction created successfully',
      data: transaction
    });
  } catch (error) {
    console.error('Create transaction error:', error);
    res.status(500).json({
      success: false,
      message: 'Internal server error'
    });
  }
});

export default router;

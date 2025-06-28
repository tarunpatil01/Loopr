import mongoose from 'mongoose';
import dotenv from 'dotenv';
import fs from 'fs';
import path from 'path';
import User from '../models/User';
import Transaction from '../models/Transaction';

// Load environment variables
dotenv.config();

const seedDatabase = async () => {
  try {
    // Connect to MongoDB
    await mongoose.connect(process.env.MONGODB_URI || 'mongodb://localhost:27017/loopr_financial');
    console.log('✅ Connected to MongoDB');

    // Clear existing data
    await Transaction.deleteMany({});
    await User.deleteMany({});
    console.log('🗑️ Cleared existing data');

    // Create default users
    const defaultUsers = [
      {
        username: 'admin',
        email: 'admin@loopr.com',
        password: 'password123',
        firstName: 'Admin',
        lastName: 'User',
        role: 'admin'
      },
      {
        username: 'analyst',
        email: 'analyst@loopr.com',
        password: 'password123',
        firstName: 'John',
        lastName: 'Analyst',
        role: 'analyst'
      },
      {
        username: 'viewer',
        email: 'viewer@loopr.com',
        password: 'password123',
        firstName: 'Jane',
        lastName: 'Viewer',
        role: 'viewer'
      }
    ];

    for (const userData of defaultUsers) {
      const user = new User(userData);
      await user.save();
      console.log(`👤 Created user: ${userData.username}`);
    }

    // Read and import transaction data
    const transactionsPath = path.join(process.cwd(), '..', 'src', 'transactions.json');
    
    if (fs.existsSync(transactionsPath)) {
      const transactionData = JSON.parse(fs.readFileSync(transactionsPath, 'utf8'));
      
      // Transform and insert transactions
      const transactions = transactionData.map((tx: any) => ({
        ...tx,
        date: new Date(tx.date)
      }));

      await Transaction.insertMany(transactions);
      console.log(`💰 Imported ${transactions.length} transactions`);
    } else {
      console.log('⚠️ Transaction data file not found, creating sample data...');
      
      // Create some sample transactions if file doesn't exist
      const sampleTransactions = [];
      const categories = ['Revenue', 'Expense'];
      const statuses = ['Paid', 'Pending'];
      const userIds = ['user_001', 'user_002', 'user_003', 'user_004'];

      for (let i = 1; i <= 50; i++) {
        sampleTransactions.push({
          id: i,
          date: new Date(Date.now() - Math.random() * 365 * 24 * 60 * 60 * 1000), // Random date within last year
          amount: Math.round((Math.random() * 5000 + 100) * 100) / 100, // Random amount between 100-5000
          category: categories[Math.floor(Math.random() * categories.length)],
          status: statuses[Math.floor(Math.random() * statuses.length)],
          user_id: userIds[Math.floor(Math.random() * userIds.length)],
          user_profile: 'https://thispersondoesnotexist.com/',
          description: `Sample transaction ${i}`
        });
      }

      await Transaction.insertMany(sampleTransactions);
      console.log(`💰 Created ${sampleTransactions.length} sample transactions`);
    }

    console.log('✅ Database seeded successfully!');
    console.log('\n🔐 Default login credentials:');
    console.log('Admin: admin@loopr.com / password123');
    console.log('Analyst: analyst@loopr.com / password123');
    console.log('Viewer: viewer@loopr.com / password123');

  } catch (error) {
    console.error('❌ Error seeding database:', error);
  } finally {
    await mongoose.disconnect();
    console.log('📡 Disconnected from MongoDB');
    process.exit(0);
  }
};

// Run the seed function
seedDatabase();

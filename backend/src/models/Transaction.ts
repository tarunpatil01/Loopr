import mongoose, { Document, Schema } from 'mongoose';

export interface ITransaction extends Document {
  _id: string;
  id: number;
  date: Date;
  amount: number;
  category: 'Revenue' | 'Expense';
  status: 'Paid' | 'Pending' | 'Failed';
  user_id: string;
  user_profile: string;
  description?: string;
  tags?: string[];
  createdAt: Date;
  updatedAt: Date;
}

const TransactionSchema = new Schema<ITransaction>({
  id: {
    type: Number,
    required: true,
    unique: true
  },
  date: {
    type: Date,
    required: true,
    index: true
  },
  amount: {
    type: Number,
    required: true,
    min: 0
  },
  category: {
    type: String,
    required: true,
    enum: ['Revenue', 'Expense'],
    index: true
  },
  status: {
    type: String,
    required: true,
    enum: ['Paid', 'Pending', 'Failed'],
    index: true
  },
  user_id: {
    type: String,
    required: true,
    index: true
  },
  user_profile: {
    type: String,
    default: 'https://thispersondoesnotexist.com/'
  },
  description: {
    type: String,
    trim: true,
    maxlength: 500
  },
  tags: [{
    type: String,
    trim: true
  }]
}, {
  timestamps: true
});

// Compound indexes for better query performance
TransactionSchema.index({ date: -1, category: 1 });
TransactionSchema.index({ user_id: 1, date: -1 });
TransactionSchema.index({ status: 1, date: -1 });
TransactionSchema.index({ amount: -1 });

// Text index for search functionality
TransactionSchema.index({
  description: 'text',
  user_id: 'text',
  tags: 'text'
});

export default mongoose.model<ITransaction>('Transaction', TransactionSchema);

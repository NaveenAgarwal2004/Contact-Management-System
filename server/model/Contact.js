import mongoose from 'mongoose';

const contactSchema = new mongoose.Schema({
  firstName: {
    type: String,
    required: true,
    trim: true,
    maxlength: 50
  },
  lastName: {
    type: String,
    required: true,
    trim: true,
    maxlength: 50
  },
  email: {
    type: String,
    required: true,
    unique: true,
    trim: true,
    lowercase: true,
    match: [/^[^\s@]+@[^\s@]+\.[^\s@]+$/, 'Please enter a valid email address']
  },
  phone: {
    type: String,
    trim: true,
    maxlength: 20
  },
  company: {
    type: String,
    trim: true,
    maxlength: 100
  },
  position: {
    type: String,
    trim: true,
    maxlength: 100
  },
  address: {
    type: String,
    trim: true,
    maxlength: 200
  },
  notes: {
    type: String,
    trim: true,
    maxlength: 500
  }
}, {
  timestamps: true
});

// Create indexes for better search performance
contactSchema.index({ firstName: 'text', lastName: 'text', email: 'text', company: 'text', position: 'text' });

// Transform the output to match our frontend interface
contactSchema.set('toJSON', {
  transform: function(doc, ret) {
    ret.id = ret._id.toString();
    ret.createdAt = ret.createdAt.toISOString();
    ret.updatedAt = ret.updatedAt.toISOString();
    delete ret._id;
    delete ret.__v;
    return ret;
  }
});

export const Contact = mongoose.model('Contact', contactSchema);
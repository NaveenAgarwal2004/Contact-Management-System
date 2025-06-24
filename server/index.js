import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import { connectDatabase } from './config/database.js';
import { Contact } from './model/Contact.js';

dotenv.config();

const app = express();
const PORT = process.env.PORT || 5000;

// Connect to MongoDB
connectDatabase();

// Middleware
app.use(cors());
app.use(express.json());

// Routes
app.get('/api/contacts', async (req, res) => {
  try {
    const { search } = req.query;
    let query = {};
    if (search) {
      query = { $text: { $search: search } };
    }
    const contacts = await Contact.find(query).sort({ createdAt: -1 });
    res.json({
      success: true,
      data: contacts,
      count: contacts.length
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Failed to fetch contacts',
      error: error.message
    });
  }
});

app.get('/api/contacts/:id', async (req, res) => {
  try {
    const { id } = req.params;
    const contact = await Contact.findById(id);
    if (!contact) {
      return res.status(404).json({
        success: false,
        message: 'Contact not found'
      });
    }
    res.json({
      success: true,
      data: contact
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Failed to fetch contact',
      error: error.message
    });
  }
});

app.post('/api/contacts', async (req, res) => {
  try {
    const {
      firstName,
      lastName,
      email,
      phone,
      company,
      position,
      address,
      notes
    } = req.body;

    // Basic validation
    if (!firstName || !lastName || !email) {
      return res.status(400).json({
        success: false,
        message: 'First name, last name, and email are required'
      });
    }

    // Check if email already exists
    const existingContact = await Contact.findOne({ email });
    if (existingContact) {
      return res.status(400).json({
        success: false,
        message: 'Contact with this email already exists'
      });
    }

    const newContact = new Contact({
      firstName,
      lastName,
      email,
      phone: phone || '',
      company: company || '',
      position: position || '',
      address: address || '',
      notes: notes || ''
    });

    await newContact.save();

    res.status(201).json({
      success: true,
      data: newContact,
      message: 'Contact created successfully'
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Failed to create contact',
      error: error.message
    });
  }
});

app.put('/api/contacts/:id', async (req, res) => {
  try {
    const { id } = req.params;
    const {
      firstName,
      lastName,
      email,
      phone,
      company,
      position,
      address,
      notes
    } = req.body;

    // Basic validation
    if (!firstName || !lastName || !email) {
      return res.status(400).json({
        success: false,
        message: 'First name, last name, and email are required'
      });
    }

    // Check if email already exists (excluding current contact)
    const existingContact = await Contact.findOne({ email, _id: { $ne: id } });
    if (existingContact) {
      return res.status(400).json({
        success: false,
        message: 'Contact with this email already exists'
      });
    }

    const updatedContact = await Contact.findByIdAndUpdate(
      id,
      {
        firstName,
        lastName,
        email,
        phone: phone || '',
        company: company || '',
        position: position || '',
        address: address || '',
        notes: notes || ''
      },
      { new: true, runValidators: true }
    );

    if (!updatedContact) {
      return res.status(404).json({
        success: false,
        message: 'Contact not found'
      });
    }

    res.json({
      success: true,
      data: updatedContact,
      message: 'Contact updated successfully'
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Failed to update contact',
      error: error.message
    });
  }
});

app.delete('/api/contacts/:id', async (req, res) => {
  try {
    const { id } = req.params;
    const deletedContact = await Contact.findByIdAndDelete(id);
    if (!deletedContact) {
      return res.status(404).json({
        success: false,
        message: 'Contact not found'
      });
    }
    res.json({
      success: true,
      data: deletedContact,
      message: 'Contact deleted successfully'
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Failed to delete contact',
      error: error.message
    });
  }
});

app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});

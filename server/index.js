import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';

dotenv.config();

const app = express();
const PORT = process.env.PORT || 5000;

// Middleware
app.use(cors());
app.use(express.json());

// In-memory storage for contacts (replace with MongoDB in production)
let contacts = [
  {
    id: '1',
    firstName: 'John',
    lastName: 'Doe',
    email: 'john.doe@example.com',
    phone: '+1 (555) 123-4567',
    company: 'Tech Solutions Inc.',
    position: 'Software Engineer',
    address: '123 Main St, New York, NY 10001',
    notes: 'Great developer with expertise in React and Node.js',
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString()
  },
  {
    id: '2',
    firstName: 'Jane',
    lastName: 'Smith',
    email: 'jane.smith@example.com',
    phone: '+1 (555) 987-6543',
    company: 'Design Studio Pro',
    position: 'UI/UX Designer',
    address: '456 Oak Ave, Los Angeles, CA 90210',
    notes: 'Talented designer with a keen eye for modern interfaces',
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString()
  },
  {
    id: '3',
    firstName: 'Michael',
    lastName: 'Johnson',
    email: 'michael.johnson@example.com',
    phone: '+1 (555) 555-0123',
    company: 'Marketing Experts LLC',
    position: 'Marketing Manager',
    address: '789 Pine Rd, Chicago, IL 60601',
    notes: 'Strategic marketing professional with 10+ years experience',
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString()
  }
];

let nextId = 4;

// Routes
app.get('/api/contacts', (req, res) => {
  const { search } = req.query;
  
  let filteredContacts = contacts;
  
  if (search) {
    const searchLower = search.toLowerCase();
    filteredContacts = contacts.filter(contact =>
      contact.firstName.toLowerCase().includes(searchLower) ||
      contact.lastName.toLowerCase().includes(searchLower) ||
      contact.email.toLowerCase().includes(searchLower) ||
      contact.company.toLowerCase().includes(searchLower) ||
      contact.position.toLowerCase().includes(searchLower)
    );
  }
  
  res.json({
    success: true,
    data: filteredContacts,
    count: filteredContacts.length
  });
});

app.get('/api/contacts/:id', (req, res) => {
  const { id } = req.params;
  const contact = contacts.find(c => c.id === id);
  
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
});

app.post('/api/contacts', (req, res) => {
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
  const existingContact = contacts.find(c => c.email === email);
  if (existingContact) {
    return res.status(400).json({
      success: false,
      message: 'Contact with this email already exists'
    });
  }
  
  const newContact = {
    id: nextId.toString(),
    firstName,
    lastName,
    email,
    phone: phone || '',
    company: company || '',
    position: position || '',
    address: address || '',
    notes: notes || '',
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString()
  };
  
  contacts.push(newContact);
  nextId++;
  
  res.status(201).json({
    success: true,
    data: newContact,
    message: 'Contact created successfully'
  });
});

app.put('/api/contacts/:id', (req, res) => {
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
  
  const contactIndex = contacts.findIndex(c => c.id === id);
  
  if (contactIndex === -1) {
    return res.status(404).json({
      success: false,
      message: 'Contact not found'
    });
  }
  
  // Basic validation
  if (!firstName || !lastName || !email) {
    return res.status(400).json({
      success: false,
      message: 'First name, last name, and email are required'
    });
  }
  
  // Check if email already exists (excluding current contact)
  const existingContact = contacts.find(c => c.email === email && c.id !== id);
  if (existingContact) {
    return res.status(400).json({
      success: false,
      message: 'Contact with this email already exists'
    });
  }
  
  const updatedContact = {
    ...contacts[contactIndex],
    firstName,
    lastName,
    email,
    phone: phone || '',
    company: company || '',
    position: position || '',
    address: address || '',
    notes: notes || '',
    updatedAt: new Date().toISOString()
  };
  
  contacts[contactIndex] = updatedContact;
  
  res.json({
    success: true,
    data: updatedContact,
    message: 'Contact updated successfully'
  });
});

app.delete('/api/contacts/:id', (req, res) => {
  const { id } = req.params;
  const contactIndex = contacts.findIndex(c => c.id === id);
  
  if (contactIndex === -1) {
    return res.status(404).json({
      success: false,
      message: 'Contact not found'
    });
  }
  
  const deletedContact = contacts[contactIndex];
  contacts.splice(contactIndex, 1);
  
  res.json({
    success: true,
    data: deletedContact,
    message: 'Contact deleted successfully'
  });
});

app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
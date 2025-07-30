import { Contact } from '../models/index.js';

// Handle contact form submission
export const contactForm = async (req, res) => {
  try {
    const { name, email, message } = req.body;
    
    // Get client IP and user agent for tracking
    const ipAddress = req.ip || req.connection.remoteAddress;
    const userAgent = req.get('User-Agent');
    
    // Create contact entry
    const contact = new Contact({
      name,
      email,
      message,
      ipAddress,
      userAgent
    });
    
    await contact.save();
    
    res.status(201).json({
      message: 'Contact form submitted successfully',
      contact: {
        id: contact._id,
        name: contact.name,
        email: contact.email,
        message: contact.message,
        status: contact.status,
        createdAt: contact.createdAt
      }
    });
  } catch (error) {
    console.error('Error processing contact form:', error);
    res.status(500).json({ message: 'Server error', error: error.message });
  }
};

// Get all contact submissions (admin only)
export const getContacts = async (req, res) => {
  try {
    const { status } = req.query;
    
    let filter = {};
    if (status) filter.status = status;
    
    const contacts = await Contact.find(filter).sort({ createdAt: -1 });
    
    res.json(contacts);
  } catch (error) {
    console.error('Error fetching contacts:', error);
    res.status(500).json({ message: 'Server error', error: error.message });
  }
};

// Update contact status (admin only)
export const updateContactStatus = async (req, res) => {
  try {
    const { id } = req.params;
    const { status } = req.body;
    
    const contact = await Contact.findByIdAndUpdate(
      id,
      { status },
      { new: true, runValidators: true }
    );
    
    if (!contact) {
      return res.status(404).json({ message: 'Contact not found' });
    }
    
    res.json({ message: 'Contact status updated successfully', contact });
  } catch (error) {
    console.error('Error updating contact status:', error);
    res.status(500).json({ message: 'Server error', error: error.message });
  }
};
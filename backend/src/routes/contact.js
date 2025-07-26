import express from 'express';
import nodemailer from 'nodemailer';
import { Contact } from '../models/index.js';

const router = express.Router();

// Helper function to extract client info
const extractClientInfo = (req) => {
  const userAgent = req.get('User-Agent') || '';
  const ipAddress = req.ip || req.connection.remoteAddress || req.socket.remoteAddress;
  return { userAgent, ipAddress };
};

// Contact form submission with database storage
router.post('/', async (req, res) => {
  try {
    const { name, email, message } = req.body;
    const clientInfo = extractClientInfo(req);
    
    // Save contact to database
    const contact = new Contact({
      name,
      email,
      message,
      ipAddress: clientInfo.ipAddress,
      userAgent: clientInfo.userAgent
    });
    
    await contact.save();
    
    // Send email if configured
    if (process.env.EMAIL_USER && process.env.EMAIL_PASS) {
      const transporter = nodemailer.createTransport({
        service: 'gmail',
        auth: {
          user: process.env.EMAIL_USER,
          pass: process.env.EMAIL_PASS,
        },
      });
      
      const mailOptions = {
        from: email,
        to: process.env.EMAIL_USER,
        subject: `Portfolio Contact: ${name}`,
        html: `
          <h3>New contact form submission</h3>
          <p><strong>Name:</strong> ${name}</p>
          <p><strong>Email:</strong> ${email}</p>
          <p><strong>Message:</strong></p>
          <p>${message}</p>
          <hr>
          <small>Submitted at: ${new Date().toLocaleString()}</small>
        `,
      };
      
      try {
        await transporter.sendMail(mailOptions);
      } catch (emailError) {
        console.error('Error sending email:', emailError);
        // Don't fail the request if email fails
      }
    }
    
    res.status(200).json({ 
      message: 'Message sent successfully',
      contactId: contact._id 
    });
  } catch (error) {
    console.error('Error handling contact submission:', error);
    res.status(500).json({ message: 'Failed to send message' });
  }
});

// Get all contacts (admin only)
router.get('/', async (req, res) => {
  try {
    const { status, limit = 50, page = 1 } = req.query;
    const query = status ? { status } : {};
    
    const skip = (page - 1) * parseInt(limit);
    const contacts = await Contact.find(query)
      .sort({ createdAt: -1 })
      .limit(parseInt(limit))
      .skip(skip);
      
    const total = await Contact.countDocuments(query);
    
    res.json({
      contacts,
      pagination: {
        current: parseInt(page),
        total: Math.ceil(total / parseInt(limit)),
        count: contacts.length,
        totalContacts: total
      }
    });
  } catch (error) {
    console.error('Error fetching contacts:', error);
    res.status(500).json({ message: 'Failed to fetch contacts' });
  }
});

export default router;
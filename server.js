/* ============================================================
   1AI × YPSMA — Express Server
   Registration API, email notifications, live chat, and admin
   ============================================================ */

const express = require('express');
const cors = require('cors');
const helmet = require('helmet');
const rateLimit = require('express-rate-limit');
const nodemailer = require('nodemailer');
const { body, validationResult } = require('express-validator');
const path = require('path');
require('dotenv').config();

const { getWelcomeEmail, getRegistrationEmail, getEventEmail } = require('./email-templates');

const app = express();
const PORT = process.env.PORT || 3000;

// --- Security Middleware ---
app.use(helmet({
  contentSecurityPolicy: {
    directives: {
      defaultSrc: ["'self'"],
      scriptSrc: ["'self'", "'unsafe-inline'", "https://unpkg.com"],
      styleSrc: ["'self'", "'unsafe-inline'", "https://fonts.googleapis.com"],
      fontSrc: ["'self'", "https://fonts.gstatic.com"],
      imgSrc: ["'self'", "data:", "https:"],
    }
  }
}));

app.use(cors({
  origin: process.env.ALLOWED_ORIGINS?.split(',') || ['http://localhost:3000'],
  methods: ['GET', 'POST'],
  allowedHeaders: ['Content-Type', 'Authorization']
}));

// --- Rate Limiting ---
const limiter = rateLimit({
  windowMs: 15 * 60 * 1000,
  max: 100,
  message: 'Too many requests from this IP, please try again later.'
});

app.use('/api/', limiter);

// --- Body Parser ---
app.use(express.json({ limit: '10kb' }));
app.use(express.urlencoded({ extended: true, limit: '10kb' }));

// --- Static Files ---
app.use(express.static(path.join(__dirname, '../public')));

// --- Email Transporter ---
const transporter = nodemailer.createTransport({
  host: process.env.SMTP_HOST || 'smtp.gmail.com',
  port: parseInt(process.env.SMTP_PORT || '587'),
  secure: process.env.SMTP_SECURE === 'true',
  auth: {
    user: process.env.SMTP_USER,
    pass: process.env.SMTP_PASS
  }
});

// --- In-Memory Storage ---
const registrations = [];
const eventRegistrations = [];
const chatMessages = [];
const chatQueue = [];
let dashboardStats = { visitors: 0, messages: 0, events: 0, registrations: 0 };

// --- Admin Auth Middleware ---
const adminAuth = (req, res, next) => {
  const authHeader = req.headers.authorization;
  if (!authHeader || !authHeader.startsWith('Basic ')) {
    return res.status(401).json({ error: 'Unauthorized' });
  }
  const credentials = Buffer.from(authHeader.split(' ')[1], 'base64').toString('ascii');
  const [username, password] = credentials.split(':');
  if (username !== (process.env.ADMIN_USER || 'admin') || password !== (process.env.ADMIN_PASS || 'ypsa2026!')) {
    return res.status(401).json({ error: 'Invalid credentials' });
  }
  next();
};

// --- Validation Rules ---
const registrationValidation = [
  body('name')
    .trim()
    .isLength({ min: 2, max: 100 })
    .withMessage('Name must be 2-100 characters'),
  body('email')
    .isEmail()
    .normalizeEmail()
    .withMessage('Please provide a valid email'),
  body('phone')
    .isMobilePhone()
    .withMessage('Please provide a valid phone number'),
  body('role')
    .isIn(['student', 'teacher', 'professional', 'other'])
    .withMessage('Please select a valid role'),
  body('organization')
    .optional()
    .trim()
    .isLength({ max: 200 })
    .withMessage('Organization name must be less than 200 characters'),
  body('message')
    .optional()
    .trim()
    .isLength({ max: 1000 })
    .withMessage('Message must be less than 1000 characters')
];

const eventRegistrationValidation = [
  body('name')
    .trim()
    .isLength({ min: 2, max: 100 })
    .withMessage('Name must be 2-100 characters'),
  body('email')
    .isEmail()
    .normalizeEmail()
    .withMessage('Please provide a valid email'),
  body('eventId')
    .notEmpty()
    .withMessage('Event ID is required')
];

// --- API Routes ---

// Health check
app.get('/api/health', (req, res) => {
  res.json({ status: 'ok', timestamp: new Date().toISOString() });
});

// Registration endpoint
app.post('/api/register', registrationValidation, async (req, res) => {
  try {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({
        success: false,
        errors: errors.array()
      });
    }

    const { name, email, phone, role, organization, message } = req.body;

    const existingRegistration = registrations.find(r => r.email === email);
    if (existingRegistration) {
      return res.status(409).json({
        success: false,
        message: 'Email already registered'
      });
    }

    const registration = {
      id: Date.now().toString(36) + Math.random().toString(36).substr(2),
      name,
      email,
      phone,
      role,
      organization,
      message,
      status: 'pending',
      createdAt: new Date().toISOString()
    };

    registrations.push(registration);
    dashboardStats.registrations++;

    await transporter.sendMail({
      from: process.env.EMAIL_FROM || '"1AI × YPSMA" <no-reply@ypsa-1ai.org>',
      to: email,
      subject: 'Welcome to 1AI × YPSMA Community',
      html: getWelcomeEmail({ name, email })
    });

    res.status(201).json({
      success: true,
      message: 'Registration successful',
      data: { id: registration.id }
    });

  } catch (error) {
    console.error('Registration error:', error);
    res.status(500).json({
      success: false,
      message: 'Internal server error'
    });
  }
});

// Event registration endpoint
app.post('/api/events/register', eventRegistrationValidation, async (req, res) => {
  try {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({
        success: false,
        errors: errors.array()
      });
    }

    const { name, email, eventId } = req.body;

    const existingRegistration = eventRegistrations.find(
      r => r.email === email && r.eventId === eventId
    );
    if (existingRegistration) {
      return res.status(409).json({
        success: false,
        message: 'Already registered for this event'
      });
    }

    const registration = {
      id: Date.now().toString(36) + Math.random().toString(36).substr(2),
      name,
      email,
      eventId,
      status: 'confirmed',
      createdAt: new Date().toISOString()
    };

    eventRegistrations.push(registration);
    dashboardStats.events++;

    const lang = req.body.lang || 'en';
    const eventData = {
      name,
      email,
      eventName: req.body.eventName || 'Upcoming Event',
      eventDate: req.body.eventDate,
      eventTime: req.body.eventTime,
      eventLocation: req.body.eventLocation
    };

    await transporter.sendMail({
      from: process.env.EMAIL_FROM || '"1AI × YPSMA" <no-reply@ypsa-1ai.org>',
      to: email,
      subject: getEventEmail(eventData, lang).match(/<title>(.*?)<\/title>/)?.[1] || 'Event Registration',
      html: getEventEmail(eventData, lang)
    });

    res.status(201).json({
      success: true,
      message: 'Event registration successful',
      data: { id: registration.id }
    });

  } catch (error) {
    console.error('Event registration error:', error);
    res.status(500).json({
      success: false,
      message: 'Internal server error'
    });
  }
});

// Get registrations (admin only)
app.get('/api/registrations', adminAuth, (req, res) => {
  res.json({
    success: true,
    data: registrations
  });
});

// --- Admin API Routes ---

// Admin login
app.post('/api/admin/login', (req, res) => {
  const { username, password } = req.body;
  if (username !== (process.env.ADMIN_USER || 'admin') || password !== (process.env.ADMIN_PASS || 'ypsa2026!')) {
    return res.status(401).json({ error: 'Invalid credentials' });
  }
  res.json({
    success: true,
    token: Buffer.from(`${username}:${password}`).toString('base64')
  });
});

// Dashboard stats
app.get('/api/admin/dashboard', adminAuth, (req, res) => {
  res.json({
    stats: {
      ...dashboardStats,
      pendingMessages: chatQueue.length,
      onlineUsers: Object.keys(io.sockets.sockets).length
    }
  });
});

// Get all messages
app.get('/api/admin/messages', adminAuth, (req, res) => {
  res.json({ messages: chatMessages, queue: chatQueue });
});

// Broadcast to all
app.post('/api/admin/broadcast', adminAuth, (req, res) => {
  const { message } = req.body;
  if (!message) return res.status(400).json({ error: 'Message required' });
  const broadcastMsg = {
    id: Date.now(),
    sender: 'admin',
    text: message,
    timestamp: new Date()
  };
  chatMessages.push(broadcastMsg);
  io.emit('chat-message', broadcastMsg);
  res.json({ success: true, message: broadcastMsg });
});

// Reply to specific user
app.post('/api/admin/reply', adminAuth, (req, res) => {
  const { socketId, message } = req.body;
  if (!socketId || !message) return res.status(400).json({ error: 'Socket ID and message required' });
  const replyMsg = {
    id: Date.now(),
    sender: 'admin',
    text: message,
    timestamp: new Date()
  };
  chatMessages.push(replyMsg);
  io.to(socketId).emit('chat-message', replyMsg);
  res.json({ success: true, message: replyMsg });
});

// --- Static Pages (SPA fallback) ---
app.get('*', (req, res) => {
  res.sendFile(path.join(__dirname, '../public/index.html'));
});

// --- Error Handler ---
app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(500).json({
    success: false,
    message: 'Internal server error'
  });
});

// --- HTTP + WebSocket Server ---
const http = require('http');
const { Server } = require('socket.io');
const server = http.createServer(app);
const io = new Server(server, {
  cors: { origin: '*', methods: ['GET', 'POST'] }
});

// --- WebSocket Chat ---
io.on('connection', (socket) => {
  console.log(`Chat connected: ${socket.id}`);

  socket.on('visitor-message', (data) => {
    const { text, name } = data;
    const msg = {
      id: Date.now(),
      sender: name || 'Visitor',
      socketId: socket.id,
      text,
      timestamp: new Date()
    };
    chatMessages.push(msg);
    dashboardStats.messages++;
    chatQueue.push({ ...msg, status: 'pending' });
    io.emit('chat-message', msg);

    // Auto-reply
    const autoReply = {
      id: Date.now() + 1,
      sender: 'admin',
      text: `Thanks for reaching out! We'll respond shortly.`,
      timestamp: new Date()
    };
    chatMessages.push(autoReply);
    socket.emit('chat-message', autoReply);
  });

  socket.on('admin-take-ticket', (ticketId) => {
    const ticket = chatQueue.find(t => t.id === ticketId);
    if (ticket) {
      ticket.status = 'active';
      ticket.adminSocketId = socket.id;
    }
  });

  socket.on('disconnect', () => {
    console.log(`Chat disconnected: ${socket.id}`);
    chatQueue.forEach(ticket => {
      if (ticket.adminSocketId === socket.id) {
        ticket.status = 'pending';
        delete ticket.adminSocketId;
      }
    });
  });
});

// --- Start Server ---
server.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
  console.log(`WebSocket enabled for live chat`);
});

module.exports = { app, server, io };

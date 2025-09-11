/* Minimal Express + Socket.IO chat server (dev/demo only, ESM) */
import path from 'path';
import fs from 'fs';
import express from 'express';
import http from 'http';
import cors from 'cors';
import multer from 'multer';
import { v4 as uuidv4 } from 'uuid';
import { Server } from 'socket.io';
import { fileURLToPath } from 'url';
import { dirname } from 'path';
import { MongoClient, GridFSBucket, ObjectId } from 'mongodb';
import { prisma } from './prisma.js';


const PORT = process.env.PORT || 3001;
const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

// Ensure upload directory exists
const uploadDir = path.join(__dirname, 'uploads');
if (!fs.existsSync(uploadDir)) {
  fs.mkdirSync(uploadDir, { recursive: true });
}

// Multer memory storage to stream into GridFS
const uploadMemory = multer({ storage: multer.memoryStorage(), limits: { fileSize: 100 * 1024 * 1024 } });

const app = express();
const server = http.createServer(app);
const io = new Server(server, {
  cors: {
    origin: '*',
    methods: ['GET', 'POST']
  }
});

app.use(cors());
app.use(express.json());
app.use('/uploads', express.static(uploadDir));

// Root status route
app.get('/', (_req, res) => {
  res.json({ status: 'ok', service: 'chat-server', version: '1.0.0' });
});

// In-memory data stores (demo only)
// Users from frontend AuthContext: id '1' (user), '2' (admin)
const chats = new Map(); // chatId -> { id, name, isGroup, members: string[], admins: string[] }
const messages = new Map(); // chatId -> Array<Message>
const userPresence = new Map(); // userId -> { online: boolean, socketIds: Set<string> }
const users = new Map(); // userId -> User object

// Initialize with default users
users.set('1', {
  id: '1',
  email: 'user@company.com',
  name: 'John Doe',
  role: 'user',
  ticketsRemaining: 8,
  contractStartDate: '2024-01-01',
  contractEndDate: '2024-12-31',
  company: 'Tech Corp Ltd',
  phone: '+1 (555) 123-4567'
});

users.set('2', {
  id: '2',
  email: 'admin@support.com',
  name: 'Admin User',
  role: 'admin',
  ticketsRemaining: 0,
  contractStartDate: '2024-01-01',
  contractEndDate: '2024-12-31',
  company: 'Support Team',
  phone: '+1 (555) 987-6543'
});

function ensureDefaultDirectChat() {
  // Default direct chat between user '1' and admin '2'
  let defaultChat = null;
  for (const chat of chats.values()) {
    if (!chat.isGroup && chat.members.includes('1') && chat.members.includes('2')) {
      defaultChat = chat;
      break;
    }
  }
  if (!defaultChat) {
    const id = `c-${uuidv4()}`;
    defaultChat = {
      id,
      name: 'Admin Support',
      isGroup: false,
      members: ['1', '2'],
      admins: ['2']
    };
    chats.set(id, defaultChat);
    messages.set(id, []);
  }
  return defaultChat;
}

ensureDefaultDirectChat();

function getUserChats(userId) {
  return Array.from(chats.values()).filter(c => c.members.includes(userId));
}

function getLastMessageSummary(chatId) {
  const list = messages.get(chatId) || [];
  const last = list[list.length - 1];
  if (!last) return { lastMessage: '', lastMessageTime: null };
  return { lastMessage: last.text || (last.attachments?.length ? 'Attachment' : ''), lastMessageTime: last.timestamp };
}

function joinUserSocketsToRoom(userId, chatId) {
  const entry = userPresence.get(userId);
  if (!entry) return;
  for (const sid of entry.socketIds || []) {
    const sock = io.sockets.sockets.get(sid);
    if (sock) sock.join(chatId);
  }
}

function leaveUserSocketsFromRoom(userId, chatId) {
  const entry = userPresence.get(userId);
  if (!entry) return;
  for (const sid of entry.socketIds || []) {
    const sock = io.sockets.sockets.get(sid);
    if (sock) sock.leave(chatId);
  }
}

// REST APIs
app.get('/api/chats', (req, res) => {
  const userId = String(req.query.userId || '');
  if (!userId) return res.status(400).json({ error: 'userId required' });
  const result = getUserChats(userId).map(c => ({
    id: c.id,
    name: c.name,
    isGroup: c.isGroup,
    members: c.members,
    admins: c.admins,
    ...getLastMessageSummary(c.id),
    unreadCount: 0, // demo: track on client
    isOnline: c.isGroup ? false : c.members.some(m => m !== userId && (userPresence.get(m)?.online))
  }));
  res.json(result);
});

// Registration endpoint
app.post('/api/auth/register', (req, res) => {
  const { name, email, password, company, phone } = req.body || {};
  
  if (!name || !email || !password || !company) {
    return res.status(400).json({ error: 'Missing required fields' });
  }

  // Check if user already exists
  const existingUser = Array.from(users.values()).find(u => u.email === email);
  if (existingUser) {
    return res.status(409).json({ error: 'User with this email already exists' });
  }

  // Create new user
  const newUserId = String(users.size + 1);
  const newUser = {
    id: newUserId,
    email,
    name,
    role: 'user',
    ticketsRemaining: 10, // Default tickets for new users
    contractStartDate: new Date().toISOString().split('T')[0],
    contractEndDate: new Date(Date.now() + 365 * 24 * 60 * 60 * 1000).toISOString().split('T')[0],
    company,
    phone: phone || ''
  };

  users.set(newUserId, newUser);

  // Create default chat with admin for new user
  const adminChatId = `c-${uuidv4()}`;
  const adminChat = {
    id: adminChatId,
    name: 'Admin Support',
    isGroup: false,
    members: [newUserId, '2'], // New user and admin
    admins: ['2']
  };
  chats.set(adminChatId, adminChat);
  messages.set(adminChatId, []);

  res.status(201).json(newUser);
});

// Login endpoint
// app.post('/api/auth/login', (req, res) => {
//   const { email, password, role } = req.body || {};
  
//   if (!email || !password || !role) {
//     return res.status(400).json({ error: 'Missing required fields' });
//   }

//   const user = Array.from(users.values()).find(u => u.email === email && u.role === role);
//   if (!user) {
//     return res.status(401).json({ error: 'Invalid credentials' });
//   }

//   res.json(user);
// });

app.get('/api/chats/:id/messages', (req, res) => {
  const chatId = req.params.id;
  const list = messages.get(chatId) || [];
  res.json(list);
});


app.post('/api/chats', (req, res) => {
  const { name, memberIds, adminIds } = req.body || {};
  if (!name || !Array.isArray(memberIds) || memberIds.length < 2) {
    return res.status(400).json({ error: 'name and at least two memberIds required' });
  }
  const id = `c-${uuidv4()}`;
  const chat = { id, name, isGroup: true, members: Array.from(new Set(memberIds)), admins: Array.isArray(adminIds) ? adminIds : [] };
  chats.set(id, chat);
  messages.set(id, []);
  // Join online members to room and notify
  for (const uid of chat.members) joinUserSocketsToRoom(uid, id);
  io.to(id).emit('chat_created', chat);
  res.json(chat);
});



// Update a group's name and members
app.put('/api/chats/:id', (req, res) => {
  const chatId = req.params.id;
  const { name, memberIds } = req.body || {};
  const chat = chats.get(chatId);
  if (!chat) return res.status(404).json({ error: 'chat not found' });
  if (!chat.isGroup) return res.status(400).json({ error: 'not a group chat' });

  // Update name if provided
  if (typeof name === 'string' && name.trim()) {
    chat.name = name.trim();
  }

  // Update members if provided
  if (Array.isArray(memberIds) && memberIds.length >= 2) {
    const nextMembers = new Set(memberIds.map(String));
    const prevMembers = new Set(chat.members.map(String));
    // Determine additions and removals
    const additions = Array.from(nextMembers).filter(m => !prevMembers.has(m));
    const removals = Array.from(prevMembers).filter(m => !nextMembers.has(m));

    chat.members = Array.from(nextMembers);
    chats.set(chatId, chat);

    // Adjust Socket.IO room membership
    for (const uid of additions) joinUserSocketsToRoom(uid, chatId);
    for (const uid of removals) leaveUserSocketsFromRoom(uid, chatId);
  } else {
    // Persist any name-only update
    chats.set(chatId, chat);
  }

  // Notify members
  io.to(chatId).emit('chat_updated', chat);
  res.json(chat);
});

// Delete a group entirely
app.delete('/api/chats/:id', (req, res) => {
  const chatId = req.params.id;
  const chat = chats.get(chatId);
  if (!chat) return res.status(404).json({ error: 'chat not found' });
  if (!chat.isGroup) return res.status(400).json({ error: 'not a group chat' });

  // Notify room before deletion
  io.to(chatId).emit('chat_deleted', { id: chatId });

  // Remove from in-memory stores
  chats.delete(chatId);
  messages.delete(chatId);

  // Ensure sockets leave the room (best-effort)
  for (const uid of chat.members || []) leaveUserSocketsFromRoom(String(uid), chatId);

  res.json({ ok: true });
});

// Add members to a group
app.post('/api/chats/:id/members', (req, res) => {
  const chatId = req.params.id;
  const { memberIds } = req.body || {};
  const chat = chats.get(chatId);
  if (!chat) return res.status(404).json({ error: 'chat not found' });
  if (!chat.isGroup) return res.status(400).json({ error: 'not a group chat' });
  const additions = Array.isArray(memberIds) ? memberIds : [];
  const before = new Set(chat.members);
  for (const m of additions) before.add(String(m));
  chat.members = Array.from(before);
  chats.set(chatId, chat);
  // Join new members and notify
  for (const uid of additions) joinUserSocketsToRoom(String(uid), chatId);
  io.to(chatId).emit('chat_updated', chat);
  // Also notify added members directly
  for (const uid of additions) {
    const entry = userPresence.get(String(uid));
    if (entry) {
      for (const sid of entry.socketIds || []) {
        const sock = io.sockets.sockets.get(sid);
        if (sock) sock.emit('chat_updated', chat);
      }
    }
  }
  res.json(chat);
});

// Remove a member from a group
app.delete('/api/chats/:id/members/:userId', (req, res) => {
  const chatId = req.params.id;
  const removeUserId = String(req.params.userId);
  const chat = chats.get(chatId);
  if (!chat) return res.status(404).json({ error: 'chat not found' });
  if (!chat.isGroup) return res.status(400).json({ error: 'not a group chat' });
  chat.members = chat.members.filter(m => String(m) !== removeUserId);
  chats.set(chatId, chat);
  // Ensure removed user's sockets leave room and notify
  leaveUserSocketsFromRoom(removeUserId, chatId);
  io.to(chatId).emit('chat_updated', chat);
  const entry = userPresence.get(removeUserId);
  if (entry) {
    for (const sid of entry.socketIds || []) {
      const sock = io.sockets.sockets.get(sid);
      if (sock) sock.emit('chat_updated', chat);
    }
  }
  res.json(chat);
});

// MongoDB / GridFS setup
const MONGO_URI = process.env.MONGO_URI || 'mongodb://127.0.0.1:27017';
const MONGO_DB = process.env.MONGO_DB || 'support_chat';
let mongoClient = null;
let gridfsBucket = null;

async function connectMongo() {
  try {
    const client = new MongoClient(MONGO_URI);
    await client.connect();
    mongoClient = client;
    gridfsBucket = new GridFSBucket(client.db(MONGO_DB), { bucketName: 'uploads' });
    console.log('MongoDB connected for file storage');
  } catch (err) {
    console.error('MongoDB connection failed, uploads will use disk fallback.', err?.message || err);
  }
}

app.post('/api/upload', uploadMemory.single('file'), async (req, res) => {
  try {
    if (!req.file) return res.status(400).json({ error: 'file required' });
    const { originalname, mimetype, size, buffer } = req.file;
    if (gridfsBucket) {
      // Stream buffer into GridFS
      const uploadStream = gridfsBucket.openUploadStream(originalname, { contentType: mimetype, metadata: { size } });
      uploadStream.end(buffer);
      uploadStream.on('finish', () => {
        const id = uploadStream.id.toString();
        return res.json({ url: `/files/${id}`, originalName: originalname, mimeType: mimetype, size });
      });
      uploadStream.on('error', (e) => {
        console.error('GridFS upload error', e);
        return res.status(500).json({ error: 'upload_failed' });
      });
    } else {
      // Fallback: save to disk
      const unique = `${Date.now()}-${uuidv4()}`;
      const ext = path.extname(originalname || '');
      const filename = `${unique}${ext}`;
      const filePath = path.join(uploadDir, filename);
      fs.writeFileSync(filePath, buffer);
      return res.json({ url: `/uploads/${filename}`, originalName: originalname, mimeType: mimetype, size });
    }
  } catch (e) {
    return res.status(500).json({ error: 'upload_failed' });
  }
});

// Stream file from GridFS
app.get('/files/:id', async (req, res) => {
  try {
    if (!gridfsBucket) return res.status(503).json({ error: 'storage_unavailable' });
    const id = new ObjectId(String(req.params.id));
    const filesColl = mongoClient.db(MONGO_DB).collection('uploads.files');
    const fileDoc = await filesColl.findOne({ _id: id });
    if (!fileDoc) return res.status(404).json({ error: 'not_found' });
    res.setHeader('Content-Type', fileDoc.contentType || 'application/octet-stream');
    res.setHeader('Content-Disposition', `inline; filename="${fileDoc.filename}"`);
    const dl = gridfsBucket.openDownloadStream(id);
    dl.on('error', () => res.status(404).end());
    dl.pipe(res);
  } catch (e) {
    return res.status(400).json({ error: 'bad_id' });
  }
});

// app.post('/api/chats/:id/message', (req, res) => {
//   const chatId = req.params.id;
//   const { id, chatId: bodyChatId, text, senderId, attachments, timestamp, status } = req.body || {};
//   if (!chats.has(chatId)) return res.status(404).json({ error: 'chat not found' });
//   const msg = {
//     id: id || `m-${uuidv4()}`,
//     chatId: chatId || bodyChatId,
//     text: text || '',
//     senderId,
//     attachments: Array.isArray(attachments) ? attachments : [],
//     timestamp: timestamp || Date.now(),
//     status: status || 'delivered',
//   };
//   const list = messages.get(chatId) || [];
//   list.push(msg);
//   messages.set(chatId, list);
//   io.to(chatId).emit('message', msg);
//   res.json(msg);
// });


// ...existing code...
app.post('/api/chats/:id/message', async (req, res) => {
  const chatId = req.params.id;
  const { id, chatId: bodyChatId, text, senderId, attachments, timestamp, status } = req.body || {};
  if (!chats.has(chatId)) return res.status(404).json({ error: 'chat not found' });

  const msg = {
    id: id || `m-${uuidv4()}`,
    chatId: chatId || bodyChatId,
    text: text || '',
    senderId: String(senderId || ''),
    attachments: Array.isArray(attachments) ? attachments : [],
    timestamp: timestamp || Date.now(),
    status: status || 'delivered',
  };

  // in-memory store (existing behavior)
  const list = messages.get(chatId) || [];
  list.push(msg);
  messages.set(chatId, list);

  // persist to Prisma DB (light-weight; log errors)
  try {
    const chat = chats.get(chatId);
    const recipient = chat ? chat.members.find(m => String(m) !== String(msg.senderId)) ?? null : null;
    await prisma.message.create({
      data: {
        message: msg.text,
        sender: msg.senderId,
        recipient: recipient ? String(recipient) : null,
      },
    });
  } catch (dbErr) {
    console.error('Prisma save failed (REST):', dbErr);
  }

  io.to(chatId).emit('message', msg);
  res.json(msg);
});
// ...existing code...

app.post('/api/chats/:id/read', (req, res) => {
  const chatId = req.params.id;
  const { userId } = req.body || {};
  io.to(chatId).emit('read', { chatId, userId, readAt: Date.now() });
  res.json({ ok: true });
});

app.get('/api/presence', (_req, res) => {
  const presence = {};
  for (const [uid, p] of userPresence.entries()) presence[uid] = !!p.online;
  res.json(presence);
});

// Socket.IO events
io.on('connection', (socket) => {
  const { userId, name, role } = socket.handshake.auth || {};
  const safeUserId = String(userId || '');

  // track presence
  if (safeUserId) {
    if (!userPresence.has(safeUserId)) userPresence.set(safeUserId, { online: true, socketIds: new Set() });
    const entry = userPresence.get(safeUserId);
    entry.online = true;
    entry.socketIds.add(socket.id);
    userPresence.set(safeUserId, entry);
    io.emit('presence', { userId: safeUserId, online: true });
  }

  // join rooms for user's chats
  if (safeUserId) {
    const myChats = getUserChats(safeUserId);
    for (const c of myChats) {
      socket.join(c.id);
    }
  }

  socket.on('join_chat', (chatId) => {
    if (chats.has(chatId)) socket.join(chatId);
  });

  socket.on('leave_chat', (chatId) => {
    socket.leave(chatId);
  });

  socket.on('typing', ({ chatId }) => {
    if (chatId) socket.to(chatId).emit('typing', { chatId, userId: safeUserId, name });
  });

  // socket.on('send_message', (payload) => {
  //   const { chatId, text, attachments } = payload || {};
  //   if (!chatId || !chats.has(chatId)) return;
  //   const msg = {
  //     id: `m-${uuidv4()}`,
  //     chatId,
  //     text: text || '',
  //     attachments: Array.isArray(attachments) ? attachments : [],
  //     senderId: safeUserId,
  //     timestamp: Date.now(),
  //     status: 'delivered',
  //     reactions: {}
  //   };
  //   const list = messages.get(chatId) || [];
  //   list.push(msg);
  //   messages.set(chatId, list);
  //   io.to(chatId).emit('message', msg);
  // });

// ...existing code...
socket.on('send_message', async (payload) => {
  const { chatId, text, attachments } = payload || {};
  if (!chatId || !chats.has(chatId)) return;

  const msg = {
    id: `m-${uuidv4()}`,
    chatId,
    text: text || '',
    attachments: Array.isArray(attachments) ? attachments : [],
    senderId: safeUserId,
    timestamp: Date.now(),
    status: 'delivered',
    reactions: {}
  };

  // in-memory
  const list = messages.get(chatId) || [];
  list.push(msg);
  messages.set(chatId, list);

  // persist to Prisma
  try {
    const chat = chats.get(chatId);
    const recipient = chat ? chat.members.find(m => String(m) !== String(msg.senderId)) ?? null : null;
    await prisma.message.create({
      data: {
        message: msg.text,
        sender: msg.senderId,
        recipient: recipient ? String(recipient) : null,
      },
    });
  } catch (dbErr) {
    console.error('Prisma save failed (socket):', dbErr);
  }

  io.to(chatId).emit('message', msg);
});
// ...existing code...

  socket.on('reaction', ({ chatId, messageId, emoji }) => {
    if (!chatId || !messageId || !emoji) return;
    const list = messages.get(chatId) || [];
    const msg = list.find(m => m.id === messageId);
    if (!msg) return;
    if (!msg.reactions) msg.reactions = {};
    if (!msg.reactions[emoji]) msg.reactions[emoji] = new Set();
    msg.reactions[emoji].add(safeUserId);
    // serialize sets for emit
    const serialized = {};
    for (const [k, v] of Object.entries(msg.reactions)) {
      serialized[k] = Array.from(v);
    }
    io.to(chatId).emit('reaction', { chatId, messageId, emoji, userId: safeUserId, reactions: serialized });
  });

  socket.on('disconnect', () => {
    if (safeUserId && userPresence.has(safeUserId)) {
      const entry = userPresence.get(safeUserId);
      entry.socketIds.delete(socket.id);
      if (entry.socketIds.size === 0) {
        entry.online = false;
        userPresence.set(safeUserId, entry);
        io.emit('presence', { userId: safeUserId, online: false });
      } else {
        userPresence.set(safeUserId, entry);
      }
    }
  });
});

// Start sequence: connect Mongo and then listen, with port fallback
await connectMongo();

const PREFERRED_PORT = Number(PORT);
let currentPort = PREFERRED_PORT;

function bindServer(port) {
  server.listen(port);
}

server.on('listening', () => {
  const addr = server.address();
  console.log(`Chat server listening on http://localhost:${typeof addr === 'object' && addr ? addr.port : currentPort}`);
});

server.on('error', (err) => {
  if (err && err.code === 'EADDRINUSE') {
    currentPort = currentPort + 1;
    console.warn(`Port in use, retrying on ${currentPort}...`);
    setTimeout(() => bindServer(currentPort), 500);
  } else {
    console.error('Server error:', err);
  }
});

bindServer(currentPort);


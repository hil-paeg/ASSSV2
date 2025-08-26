# ASSS Support Portal

A comprehensive after-sales service support portal with real-time messaging, file sharing, and user management capabilities.

## 🚀 Features

### Enhanced Messaging System
- **Real-time Chat**: Socket.IO-powered instant messaging
- **File Sharing**: Support for PDFs, images, videos, documents, and more
- **File Preview**: In-app preview for supported file types
- **Message Reactions**: React to messages with emojis
- **Typing Indicators**: Real-time typing status
- **Message Status**: Sent, delivered, and read receipts

### User Authentication & Registration
- **Client Registration**: New users can register as clients
- **Role-based Access**: Separate interfaces for clients and admins
- **Real-time Authentication**: Socket.IO integration with user sessions
- **Session Management**: Persistent login with localStorage

### File Management
- **Multiple File Types**: Support for images, videos, PDFs, documents, audio files
- **Inline Preview**: Preview files directly in the chat
- **File Size Display**: Shows file size and type
- **Download Options**: Direct download for unsupported preview types
- **Drag & Drop**: Easy file attachment interface

### Real-time Features
- **Live Presence**: Online/offline status indicators
- **Instant Updates**: New messages appear immediately
- **Real-time Notifications**: Browser notifications for new messages
- **Socket.IO Integration**: WebSocket-based real-time communication

## 🛠️ Technology Stack

### Frontend
- **React 18** with TypeScript
- **Vite** for fast development and building
- **Tailwind CSS** for styling
- **Shadcn/ui** for UI components
- **Socket.IO Client** for real-time communication
- **React Router** for navigation

### Backend
- **Node.js** with Express
- **Socket.IO** for real-time features
- **MongoDB** with GridFS for file storage
- **Multer** for file upload handling
- **CORS** enabled for cross-origin requests

## 📦 Installation

1. **Clone the repository**
   ```bash
   git clone <repository-url>
   cd support-track-portal
   ```

2. **Install dependencies**
   ```bash
   npm install
   ```

3. **Start the development server**
   ```bash
   npm run dev:all
   ```

   This will start both the frontend (Vite) and backend (Node.js) servers concurrently.

## 🔧 Configuration

### Environment Variables
Create a `.env` file in the root directory:

```env
# Server Configuration
PORT=3001
MONGO_URI=mongodb://127.0.0.1:27017
MONGO_DB=support_chat

# Frontend Configuration
VITE_API_URL=http://localhost:3001
```

### MongoDB Setup
1. Install MongoDB locally or use MongoDB Atlas
2. Update the `MONGO_URI` in your `.env` file
3. The application will automatically create the necessary collections

## 🎯 Usage

### For Clients
1. **Register**: Create a new account with your company details
2. **Login**: Access your personalized dashboard
3. **Chat**: Communicate with support team in real-time
4. **File Sharing**: Share documents, images, and other files
5. **Ticket Management**: Create and track support tickets

### For Admins
1. **Login**: Use admin credentials to access admin panel
2. **User Management**: View and manage client accounts
3. **Chat Management**: Handle multiple client conversations
4. **File Access**: Preview and download shared files
5. **Analytics**: View support metrics and reports

## 📁 Project Structure

```
support-track-portal/
├── src/
│   ├── components/
│   │   ├── Auth/
│   │   │   ├── LoginForm.tsx
│   │   │   └── RegisterForm.tsx
│   │   ├── Chat/
│   │   │   ├── ChatInterface.tsx
│   │   │   ├── FilePreview.tsx
│   │   │   └── UserStatus.tsx
│   │   └── ui/          # Shadcn/ui components
│   ├── contexts/
│   │   └── AuthContext.tsx
│   ├── pages/
│   │   ├── Chat.tsx
│   │   └── Dashboard.tsx
│   └── types/
│       └── index.ts
├── server/
│   ├── index.js         # Express + Socket.IO server
│   └── uploads/         # File upload directory
└── package.json
```

## 🔌 API Endpoints

### Authentication
- `POST /api/auth/register` - Register new client
- `POST /api/auth/login` - User login

### Chat
- `GET /api/chats` - Get user's chats
- `GET /api/chats/:id/messages` - Get chat messages
- `POST /api/chats` - Create new group chat
- `POST /api/chats/:id/members` - Add members to group
- `DELETE /api/chats/:id/members/:userId` - Remove member from group

### File Upload
- `POST /api/upload` - Upload file
- `GET /files/:id` - Download file from GridFS

### Presence
- `GET /api/presence` - Get user online status

## 🔄 Real-time Events

### Socket.IO Events
- `message` - New message received
- `typing` - User typing indicator
- `presence` - User online/offline status
- `reaction` - Message reaction
- `chat_created` - New chat created
- `chat_updated` - Chat updated

## 🎨 UI Components

### File Preview
- **Images**: Inline preview with zoom
- **Videos**: HTML5 video player
- **PDFs**: Embedded PDF viewer
- **Audio**: HTML5 audio player
- **Documents**: Download option with file info

### User Status
- **Online Indicator**: Green dot for online users
- **Typing Indicator**: Yellow dot when typing
- **Offline Status**: Gray dot for offline users
- **Role Badges**: Admin/Client role indicators

## 🚀 Deployment

### Frontend (Vite)
```bash
npm run build
npm run preview
```

### Backend (Node.js)
```bash
npm run server
```

### Production Considerations
1. **Environment Variables**: Set production environment variables
2. **MongoDB**: Use production MongoDB instance
3. **File Storage**: Configure production file storage
4. **SSL**: Enable HTTPS for production
5. **PM2**: Use PM2 for process management

## 🔒 Security Features

- **Input Validation**: Server-side validation for all inputs
- **File Type Validation**: Restricted file uploads
- **CORS Configuration**: Proper cross-origin settings
- **Authentication**: Role-based access control
- **Session Management**: Secure session handling

## 🐛 Troubleshooting

### Common Issues
1. **Socket Connection Failed**: Check if server is running on correct port
2. **File Upload Fails**: Verify MongoDB connection and upload directory permissions
3. **Authentication Issues**: Clear localStorage and re-login
4. **Real-time Not Working**: Check browser console for Socket.IO errors

### Development Tips
1. **Hot Reload**: Both frontend and backend support hot reloading
2. **Debug Mode**: Use browser dev tools for frontend debugging
3. **Server Logs**: Check terminal for backend error messages
4. **MongoDB**: Use MongoDB Compass for database inspection

## 📝 License

This project is licensed under the MIT License.

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Add tests if applicable
5. Submit a pull request

## 📞 Support

For support and questions, please contact the development team or create an issue in the repository.

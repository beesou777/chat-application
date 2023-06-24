// Required dependencies
const express = require('express');
const http = require('http');
const socketIO = require('socket.io');

// Create express app
const app = express();
const server = http.createServer(app);
const io = socketIO(server);

// Serve static files from the public folder
app.use(express.static('public'));

// Chatroom route
app.get('/', (req, res) => {
  res.sendFile(__dirname + '/index.html');
});

// Socket.io event handling
io.on('connection', (socket) => {
  // User joins the chat
  socket.on('join', (username) => {
    socket.username = username;
    io.emit('join', `${username} has joined the chat`);
  });

  // New chat message
  socket.on('chat message', (message) => {
    io.emit('chat message', { username: socket.username, message: message });
  });

  // User leaves the chat
  socket.on('disconnect', () => {
    io.emit('leave', `${socket.username} has left the chat`);
  });
});

// Start the server
const PORT = process.env.PORT || 3000;
server.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});

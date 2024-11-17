const io = require('socket.io')(8000, {
    cors: {
      origin: "http://127.0.0.1:5500", // Allow your client domain
      methods: ["GET", "POST"],
      allowedHeaders: ["Content-Type"],
      credentials: true
    }
  });
  
  const users = {};
  
  io.on('connection', (socket) => {
    console.log("A user connected");
  
    // When a new user joins
    socket.on('new-user-joined', (name) => {
      console.log("New user joined:", name);
      users[socket.id] = name;
  
      // Send a confirmation to the new user (welcome message)
      socket.emit('welcome', name);  // Send the 'welcome' event back to the new user
  
      // Broadcast to other users that a new user has joined
      socket.broadcast.emit('user-joined', name);
    });
  
    // When a user sends a message
    socket.on('send', (message) => {
      socket.broadcast.emit('receive', { message: message, name: users[socket.id] });
    });
  
    // When a user disconnects
    socket.on('disconnect', () => {
      socket.broadcast.emit('user-left', users[socket.id]);
      delete users[socket.id];
    });
  });
  
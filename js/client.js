// Establish connection with the server
const socket = io('http://localhost:8000');

const form = document.getElementById('send-container');
const messageInput = document.getElementById('messageInp');
const messageContainer = document.querySelector('.container');
const audio = new Audio('ting.mp3.wav');

// Log the connection status
socket.on('connect', () => {
  console.log("Connected to the Socket.IO server");
});

// Prompt the user for their name
const userName = prompt("Enter your name to join");
socket.emit('new-user-joined', userName);

// Handle the 'user-joined' event to show a message that a user has joined
socket.on('user-joined', (name) => {
  appendMessage(`${name} joined the chat`, 'left');
});

// Listen for incoming messages
socket.on('receive', data => {
  appendMessage(`${data.name}: ${data.message}`, 'left');
});

// Listen for user-left event
socket.on('user-left', name => {
  appendMessage(`${name} left the chat`, 'left');
});

// Send message on form submission
form.addEventListener('submit', (e) => {
  e.preventDefault();
  const message = messageInput.value;
  appendMessage(`You: ${message}`, 'right');
  socket.emit('send', message);
  messageInput.value = '';
});

// Function to append messages to the chat container
function appendMessage(message, position) {
  const messageElement = document.createElement('div');
  messageElement.classList.add('message', position);
  messageElement.textContent = message;
  messageContainer.append(messageElement);

  // Play sound only if the message is from the left side (not the user's own message)
  if (position === 'left') {
    audio.play();
  }
}

socket.on('left', data => {
  appendMessage(`${data.name} left the chat`, 'left');
});

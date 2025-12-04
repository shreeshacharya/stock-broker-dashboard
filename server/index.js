const express = require('express');
const http = require('http');
const { Server } = require('socket.io');
const cors = require('cors');

const app = express();
app.use(cors());

const server = http.createServer(app);

// Setup Socket.io with CORS to allow client connection
const io = new Server(server, {
  cors: {
    origin: "http://localhost:3000", // This will be your React frontend URL
    methods: ["GET", "POST"],
  },
});

// [Source: 5] The supported stocks list
// Expanded list of stocks
const SUPPORTED_STOCKS = [
  'GOOG', 'TSLA', 'AMZN', 'META', 'NVDA', 
  'AAPL', 'MSFT', 'NFLX', 'DIS', 'KO', 
  'PEP', 'SBUX'
];

// Helper to generate random price [Source: 8]
const getRandomPrice = () => (Math.random() * 1000).toFixed(2);

// 1. Generate prices every second
setInterval(() => {
  const stockPrices = {};
  SUPPORTED_STOCKS.forEach(stock => {
    stockPrices[stock] = getRandomPrice();
  });

  // Broadcast the new prices to all connected users
  // [Source: 6] Updates prices without refresh
  io.emit('priceUpdate', stockPrices);
}, 1000);

io.on('connection', (socket) => {
  console.log(`User Connected: ${socket.id}`);

  // Handle user login (Simulated) [Source: 3]
  socket.on('login', (email) => {
    console.log(`User logged in: ${email}`);
    // In a real app, you would save this to a database
  });

  socket.on('disconnect', () => {
    console.log('User Disconnected', socket.id);
  });
});

server.listen(3001, () => {
  console.log('SERVER RUNNING ON PORT 3001');
});
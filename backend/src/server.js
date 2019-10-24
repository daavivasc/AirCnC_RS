const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const path = require('path');

const socketio = require('socket.io');
const http = require('http');

const routes = require('./routes');

const app = express();
const server = http.Server(app);
const io = socketio(server);

mongoose.connect(
  'mongodb+srv://week9:week9@cluster0-ch1m1.mongodb.net/week9?retryWrites=true&w=majority',
  {
    useNewUrlParser: true,
    useUnifiedTopology: true
  }
);
const connectedUsers = {};

io.on('connection', socket => {
  const { user_id } = socket.handshake.query;

  connectedUsers[user_id] = socket.id;
  // socket.emit('hello', 'message');
  // socket.on('omni', data => {
  //   console.log(data);
  // });
});

app.use((req, res, next) => {
  req.io = io;
  req.connectedUsers = connectedUsers;

  return next();
});

app.use(cors());
app.use(express.json());

app.use('/files', express.static(path.resolve(__dirname, '..', 'uploads')));

app.use(routes);
app.post('/users', (req, res) => {
  res.json(req.body);
});
server.listen(3333);

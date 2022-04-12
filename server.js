const express = require('express');
// const useSocked = require('socket.io');

const app = express();
const server = require('http').Server(app);
const io = require('socket.io')(server, {
  cors: {
    origin: '*',
  },
});

var cors = require('cors');
const { default: socked } = require('./src/components/socked');

app.use(cors());
app.use(express.json());

// app.use(function (req, res, next) {
//   res.header('Access-Control-Allow-Origin', '*');
//   res.header(
//     'Access-Control-Allow-Headers',
//     'Origin, X-Requested-With, Content-Type, Accept'
//   );
//   next();
// });

const rooms = new Map();

app.get('/rooms', (req, res) => {
  res.json(rooms);
});

app.post('/rooms', (req, res) => {
  const { roomId, userName } = req.body;
  if (!rooms.has(roomId)) {
    rooms.set(
      roomId,
      new Map([
        ['users', new Map()],
        ['messages', []],
      ])
    );
  }
  // res.json([...rooms.keys()]);
  res.send();
});

io.on('connection', socket => {
  socket.on('ROOM:JOIN', ({ roomId, userName }) => {
    socket.join(roomId);
    rooms.get(roomId).get('users').set(socket.id, userName);
    const users = [...rooms.get(roomId).get('users').values()];
    socket.to(roomId).emit('ROOM:JOINED', users);
  });

  console.log('user connected', socket.id);
});

server.listen(20100, err => {
  if (err) {
    throw Error(err);
  }
  console.log('Сервер запущений!');
});

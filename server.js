const path = require('path');
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
// app.use(express.urlencoded({ extended: true }));

// app.use(function (req, res, next) {
//   res.header('Access-Control-Allow-Origin', '*');
//   res.header(
//     'Access-Control-Allow-Headers',
//     'Origin, X-Requested-With, Content-Type, Accept'
//   );
//   next();
// });

const rooms = new Map();

app.get('/rooms/:id', (req, res) => {
  const { id: roomId } = req.params;
  const obj = rooms.has(roomId)
    ? {
        users: [...rooms.get(roomId).get('users').values()],
        messages: [...rooms.get(roomId).get('messages').values()],
      }
    : { users: [], messages: [] };
  res.json(obj);
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
    socket.to(roomId).emit('ROOM:SET_USERS', users);
  });

  socket.on('ROOM:NEW_MESSAGE', ({ roomId, userName, text }) => {
    const obj = {
      userName,
      text,
    };
    rooms.get(roomId).get('messages').push(obj);
    socket.to(roomId).emit('ROOM:NEW_MESSAGE', obj);
  });

  socket.on('disconnect', () => {
    rooms.forEach((value, roomId) => {
      if (value.get('users').delete(socket.id)) {
        const users = [...value.get('users').values()];
        socket.to(roomId).emit('ROOM:SET_USERS', users);
      }
    });
  });

  console.log('user connected', socket.id);
});

const port = process.env.PORT || 20100;

if (process.env.NODE_ENV === 'production') {
  app.use(express.static('build'));
  app.get('*', (req, res) => {
    req.sendFile(path.resolve(__dirname, 'build', 'index.html'));
  });
}
server.listen(port, err => {
  if (err) {
    throw Error(err);
  }
  console.log('Сервер запущений!', port);
});

// const publickPath = path.join(__dirname, '. .', 'public');
// const port = process.env.PORT || 20100;

// app.use(express.static(publickPath));

// app.get('*', (req, res) => {
//   req.sendFile(path.join(publickPath, 'index.html'));
// });

// server.listen(port, err => {
//   if (err) {
//     throw Error(err);
//   }
//   console.log('Сервер запущений!', port);
// });

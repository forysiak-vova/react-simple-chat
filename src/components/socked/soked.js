import io from 'socket.io-client';
const socket = io('https://git.heroku.com/node-react-simple-chat.git');
export default socket;

import React from 'react';
import axios from 'axios';
import JoinBlock from './JoinBlock';
import reducer from './reduscer/reducer';
// import socked from './socked';
import socket from './socked/soked';
import Chat from './Chat/Chat';
import '../../build/static/css/main.04108082.css';
// import io from 'socket.io-client';
// const socket = io('http://localhost:20100');
axios.defaults.baseURL = 'http://localhost:20100';

export const App = () => {
  const [state, dispatch] = React.useReducer(reducer, {
    joined: false,
    roomId: null,
    userName: null,
    users: [],
    messages: [],
  });

  const onLogin = async obj => {
    dispatch({
      type: 'JOINED',
      payload: obj,
    });
    socket.emit('ROOM:JOIN', obj);
    const { data } = await axios.get(`/rooms/${obj.roomId}`);
    // setUsers(data.users);
    dispatch({
      type: 'SET_DATA',
      payload: data,
    });
  };

  const setUsers = users => {
    dispatch({
      type: 'SET_USERS',
      payload: users,
    });
  };

  const addMessage = message => {
    dispatch({
      type: 'NEW_MESSAGE',
      payload: message,
    });
  };
  React.useEffect(() => {
    // socket.on('ROOM:JOINED', setUsers);
    socket.on('ROOM:SET_USERS', setUsers);
    socket.on('ROOM:NEW_MESSAGE', addMessage);
  }, []);

  // console.log(state);
  // window.socket = socket;

  return (
    <div
      style={{
        height: '100vh',
        display: 'flex',
        justifyContent: 'center',
        // alignItems: 'center',
        fontSize: 40,
        textTransform: 'uppercase',
        color: '#010101',
        marginTop: '50px',
      }}
    >
      {!state.joined ? (
        <JoinBlock onLogin={onLogin} />
      ) : (
        <Chat {...state} onAddMessage={addMessage} />
      )}
    </div>
  );
};

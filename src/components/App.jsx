import React from 'react';
import JoinBlock from './JoinBlock';
import reducer from './reduscer/reducer';
// import socked from './socked';
import socket from './socked/soked';
import Chat from './Chat/Chat';
// import io from 'socket.io-client';
// const socket = io('http://localhost:20100');

export const App = () => {
  const [state, dispatch] = React.useReducer(reducer, {
    joined: false,
    roomId: null,
    userName: null,
  });

  const onLogin = obj => {
    dispatch({
      type: 'JOINED',
      payload: obj,
    });
    socket.emit('ROOM:JOIN', obj);
  };

  React.useEffect(() => {
    socket.on('ROOM:JOINED', users => {
      console.log(users);
    });
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
      {!state.joined ? <JoinBlock onLogin={onLogin} /> : <Chat />}
    </div>
  );
};

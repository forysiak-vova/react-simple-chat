import { Form } from './JoinBlock.styles';
import { useState } from 'react';
import axios from 'axios';
// import socket from '../socked/soked';
// import io from 'socket.io-client';
// const socket = io('http://localhost:20100');

axios.defaults.baseURL = 'http://localhost:20100';

const JoinBlock = ({ onLogin }) => {
  const [roomId, setRoomId] = useState('');
  const [userName, setUserName] = useState('');
  const [isLoading, setLoading] = useState(false);

  const handelChange = e => {
    const { name, value } = e.target;
    switch (name) {
      case 'text':
        setRoomId(value);
        break;
      case 'name':
        setUserName(value);
        break;
      default:
        return;
    }
  };

  const handelSubmit = async e => {
    e.preventDefault();
    if (!roomId || !userName) {
      return alert('enter text');
    }
    console.log(roomId);
    console.log(userName);
    const obj = { roomId, userName };
    setLoading(true);
    await axios.post('/rooms', obj);
    onLogin(obj);

    setRoomId('');
    setUserName('');
  };

  return (
    <>
      <Form className="join-block" onSubmit={handelSubmit}>
        <input
          type="text"
          value={roomId}
          name="text"
          onChange={handelChange}
          placeholder="room Id"
        />
        <input
          type="name"
          value={userName}
          name="name"
          onChange={handelChange}
          placeholder="user name"
        />
        <button disabled={isLoading} type="submit" className="btn btn-success">
          {isLoading ? 'ВХІД' : 'ВВІЙТИ'}
        </button>
      </Form>
    </>
  );
};

export default JoinBlock;

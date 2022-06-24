import React, { useContext, useState } from 'react';
import styled from 'styled-components';
import gameContext from '../../gameContext';
import gameService from '../../services/gameService';
import socketService from '../../services/socketService';
import { useHistory } from 'react-router-dom';

interface IJoinRoomProps {}
interface ICheckboxProps {
  label: string;
  value: boolean;
  onChange: React.ChangeEventHandler<HTMLInputElement>;
}

const JoinRoomContainer = styled.div`
  width: 100%;
  height: 100%;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  margin-top: 2em;
`;

const RoomIdInput = styled.input`
  height: 30px;
  width: 20em;
  font-size: 17px;
  outline: none;
  border: 1px solid #8e44ad;
  border-radius: 3px;
  padding: 0 10px;
`;

const JoinButton = styled.button`
  outline: none;
  background-color: #8e44ad;
  color: #fff;
  font-size: 17px;
  border: 2px solid transparent;
  border-radius: 5px;
  padding: 4px 18px;
  transition: all 230ms ease-in-out;
  margin-top: 1em;
  cursor: pointer;

  &:hover {
    background-color: transparent;
    border: 2px solid #8e44ad;
    color: #8e44ad;
  }
`;

export function JoinRoom(props: IJoinRoomProps) {
  const [roomName, setRoomName] = useState('');
  const [isJoining, setJoining] = useState(false);
  const [username, setUsername] = useState('');
  const [isScrumMaster, setScrumMaster] = useState(false);
  const history = useHistory();

  const { setInRoom, isInRoom, isScrumMasterInRoom, setScrumMasterInRoom } =
    useContext(gameContext);

  const handleRoomNameChange = (e: React.ChangeEvent<any>) => {
    const value = e.target.value;
    setRoomName(value);
  };

  const handleUsernameChange = (e: React.ChangeEvent<any>) => {
    const { value } = e.target;
    setUsername(value);
  };

  const handleScrumMasterChange = () => {
    setScrumMaster(!isScrumMaster);
  };

  const joinRoom = async (e: React.FormEvent) => {
    e.preventDefault();

    const socket = socketService.socket;
    if (!roomName || roomName.trim() === '' || !socket) return;

    setJoining(true);

    const joined = await gameService
      .joinGameRoom(socket, roomName, username, isScrumMaster)
      .catch((err) => {
        alert(err); // { role: 'scrumMaster' }
      });

    if (joined.role === 'scrumMaster') {
      setScrumMasterInRoom(true);
      history.push('/scrum-master');
    } else if (joined.role === 'participant') {
      history.push('/participant');
    }

    setJoining(false);
  };

  const Checkbox = (options: ICheckboxProps) => {
    const { label, onChange, value } = options;
    return (
      <label>
        <input type='checkbox' checked={value} onChange={onChange} />
        {label}
      </label>
    );
  };

  return (
    <form onSubmit={joinRoom}>
      <JoinRoomContainer>
        <h4>Enter Room ID to Join the Game</h4>
        <RoomIdInput
          placeholder='Room ID'
          value={roomName}
          onChange={handleRoomNameChange}
        />
        <RoomIdInput
          placeholder='Username'
          value={username}
          onChange={handleUsernameChange}
        />
        <Checkbox
          label='Join as a scrum master'
          value={isScrumMaster}
          onChange={handleScrumMasterChange}
        />
        <JoinButton type='submit' disabled={isJoining}>
          {isJoining ? 'Joining...' : 'Join'}
        </JoinButton>
      </JoinRoomContainer>
    </form>
  );
}

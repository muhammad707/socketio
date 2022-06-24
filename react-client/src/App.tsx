import React, { useEffect, useState } from 'react';
import styled from 'styled-components';
import './App.css';
import socketService from './services/socketService';
import { JoinRoom } from './components/joinRoom';
import GameContext, { IGameContextProps } from './gameContext';
import { Game } from './components/game';
import { ParticipantPage } from './components/scrumMaster';
import { BrowserRouter as Router, Route, Redirect } from 'react-router-dom';

const AppContainer = styled.div`
  width: 100%;
  height: 100%;
  display: flex;
  flex-direction: column;
  align-items: center;
  padding: 1em;
`;

const WelcomeText = styled.h1`
  margin: 0;
  color: #8e44ad;
`;

const MainContainer = styled.div`
  width: 100%;
  height: 100%;
  display: flex;
  align-items: center;
  justify-content: center;
`;

function App() {
  const [isInRoom, setInRoom] = useState(false);
  const [isScrumMasterInRoom, setScrumMasterInRoom] = useState(false);
  const [playerSymbol, setPlayerSymbol] = useState<'x' | 'o'>('x');
  const [isPlayerTurn, setPlayerTurn] = useState(false);
  const [isGameStarted, setGameStarted] = useState(false);
  // const history = useHistory();
  const connectSocket = async () => {
    const socket = await socketService
      .connect('http://localhost:9000')
      .catch((err) => {
        console.log('Error: ', err);
      });
  };

  useEffect(() => {
    connectSocket();
  }, []);

  const gameContextValue: IGameContextProps = {
    isInRoom,
    setInRoom,
    playerSymbol,
    setPlayerSymbol,
    isPlayerTurn,
    setPlayerTurn,
    isGameStarted,
    setGameStarted,
    isScrumMasterInRoom,
    setScrumMasterInRoom,
  };

  return (
    <GameContext.Provider value={gameContextValue}>
      {/* <WelcomeText>Welcome to Tic-Tac-Toe</WelcomeText> */}
      <Router>
        <Route exact path='/'>
          <Redirect to='/tab' />
        </Route>
        <Route exact path='/tab' component={JoinRoom} />
        <Route exact path='/scrum-master' component={Game} />
        <Route exact path='/participant' component={ParticipantPage} />
      </Router>
    </GameContext.Provider>
  );
}

export default App;

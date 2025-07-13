import React from 'react';
import {  
  View,
  StyleSheet,
} from 'react-native';
import GameUI from './GameUI';
import { useGameState } from './GameStateProvider';
import SplashScreen from './SplashScreen';

const styles = StyleSheet.create({
  container: {
    alignItems: 'center',
    justifyContent: 'center',
    flex:  1,
    // backgroundColor: '#00FF00',
    height: '100%',
  },
});

function Container() {
  const gameState = useGameState();
  return (
    <View style={styles.container}>
      {
        gameState.startupName ?
          <GameUI /> :  
          <SplashScreen/> 
      }
    </View>
  );
}

export default Container;
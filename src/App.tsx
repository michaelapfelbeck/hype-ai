import React from 'react';
import {  
  View,
  SafeAreaView,
  ScrollView,
  StyleSheet,
} from 'react-native';
import { GameStateProvider } from './GameStateProvider';
import Container from './Container';

const styles = StyleSheet.create({
  container: {
    alignItems: 'flex-start',
    justifyContent: 'center',
    flex:  1,
    backgroundColor: '#f8f8f8',
  },
  scrollView: {
    width: '100%',
  }
});

function App() {
  return (
    <SafeAreaView style={styles.container}>
      <ScrollView style={styles.scrollView}>
        <GameStateProvider>
          <Container/>
        </GameStateProvider>
      </ScrollView>
    </SafeAreaView>
  );
}

export default App;
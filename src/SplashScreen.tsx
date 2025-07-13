import React, { useEffect, useState } from 'react';
import {  
  Animated,
  View,
  Text,
  StyleSheet,
  TextInput,
  TouchableOpacity
} from 'react-native';
import { sharedStyles } from './styles';
import { useGameDispatch } from './GameStateProvider';
import Constants from './constants/constants';

const styles = StyleSheet.create({
  container: {
    alignItems: 'center',
    justifyContent: 'center',
    flex:  1,
    // backgroundColor: '#FF0000',
    height: '100%',
    padding: 20,
    margin: 20,
  },
  promptContainer: {
    flexDirection: 'row',
    alignItems: 'flex-start'
  },
  promptInput: {
    flex: 1,
    height: 40,
    borderColor: '#CCCCCC',
    borderWidth: 1,
    borderRadius: 5,
    paddingHorizontal: 10,
    fontSize: 18,
    marginRight: 10,
  },
});

function SplashScreen() {
  let [nameInput, setNameInput] = React.useState('');
  const [fadeAnim] = useState(new Animated.Value(0));
  const { setName } = useGameDispatch();

  React.useEffect(() => {
    Animated.timing(fadeAnim, {
      toValue: 1,
      duration: 1000,
      useNativeDriver: true,
    }).start();
  }, []);

  const handleNameInput = () => {
    if (nameInput.trim() === '') {
      setName(Constants.defaultStartupName);
    } else {
      setName(nameInput.trim());
    }
  }

  return (
    <Animated.View style={[styles.container, { opacity: fadeAnim}
      ]}>
      <Text style={sharedStyles.headlineText}>Name your Startup</Text>
      <View style={styles.promptContainer}>
        <TextInput style={styles.promptInput} onChangeText={setNameInput} value={nameInput} onSubmitEditing={handleNameInput} />
        <Text style={sharedStyles.headlineText}>.AI</Text>
      </View>
      <TouchableOpacity style={sharedStyles.buttonLarge} onPress={() => {
        if (nameInput.trim() !== '') {
          setName(nameInput.trim());
        } else {
          setName(Constants.defaultStartupName);
        }
      }}>
        <Text style={sharedStyles.buttonTextLarge}>Go!</Text>
      </TouchableOpacity>
    </Animated.View>
  );
}

export default SplashScreen;
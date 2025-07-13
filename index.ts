import { registerRootComponent } from 'expo';

import App from './src/App';

// registerRootComponent calls AppRegistry.registerComponent('main', () => App);
// It also ensures that whether you load the app in Expo Go or in a native build,
// the environment is set up appropriately
registerRootComponent(App);

// Extend the global interface to include resetState
declare global {
  // eslint-disable-next-line no-var
  var resetState: () => void;
}

global.resetState = () => {
  // This function is a placeholder for resetting the game state.
  // You can implement the logic to reset your game state here.
  console.log("Game state reset...");
  localStorage.removeItem('gameState');
  console.log("done!");  // .setItem('gameState', JSON.stringify(result));
};
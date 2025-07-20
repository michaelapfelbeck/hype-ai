import React, { useState, useLayoutEffect } from 'react';
import { 
  StyleSheet, 
  Text, 
  View,
  TouchableOpacity,
  Dimensions
} from 'react-native';
import { sharedStyles } from './styles';
import { useGameState, useGameDispatch } from './GameStateProvider';
import { LLMTypes, ResourceType, StoreEntry, LLMs, GPUTypes, GPUs, Researches, ResearchesTable, ResearchEntry} from './constants/resources';
import StoreTileContainer from './components/StoreTileContainer';
import ResearchTileContainer from './components/ResearchTileContainer';

const styles = StyleSheet.create({
  container: {
    alignItems: 'center',
    justifyContent: 'center',
    flex:  1,
    padding: 10,
  },
  blankTile: {
    alignItems: 'flex-start',
    justifyContent: 'center',
    flex:  1,
    borderRadius: 2,
    padding: 4,
    margin: 2,
    borderColor: '#CCCCCC',
    borderWidth: 1,
    opacity: 0,
  }
});

const GameUI = (): React.JSX.Element => {
  const gameState = useGameState();
  const { reset, addCash } = useGameDispatch();

  const [orientation, setOrientation] = useState(
    Dimensions.get('window').height > Dimensions.get('window').width
      ? 'portrait'
      : 'landscape'
  );

  useLayoutEffect(() => {
    function updateOrientation() {
      const { height, width } = Dimensions.get('window');
      setOrientation(height > width ? 'portrait' : 'landscape');
    }
    window.addEventListener('resize', updateOrientation);
    updateOrientation();
    return () => window.removeEventListener('resize', updateOrientation);
  }, []);

  const getLLMStoreData = (llm: LLMTypes): StoreEntry => {
    return LLMs.find((entry) => entry.resource.name === llm) ||   {
      resource: {
        name: LLMTypes.ALEXNET,
        description: 'Placeholder',
        generatesType: ResourceType.CASH,
        productionRate: 1,
        tags: [],
      },
      costType: ResourceType.FLOPS,
      cost: 1,
      costMultiplier: 1,
    }
  }

  const getGPUStoreData = (llm: GPUTypes): StoreEntry => {
    return GPUs.find((entry) => entry.resource.name === llm) ||   {
      resource: {
        name: GPUTypes.RTX3090,
        description: 'Placeholder',
        generatesType: ResourceType.FLOPS,
        productionRate: 1,
        tags: [],
      },
      costType: ResourceType.CASH,
      cost: 1,
      costMultiplier: 1,
    }
  }

  const getResearchData = (research: Researches): ResearchEntry => {
    return ResearchesTable.find((entry) => entry.resource.name === research) || {
      resource: {
        name: research,
        description: 'Placeholder'
      },
      costType: ResourceType.CASH,
      cost: 1,
      unlock: {}
    }
  }

  const getStoreWidth = (): number => {
    if (orientation === 'portrait') {
      return 2;
    } else {
      return 3;
    }
  }

  return (
    <View style={styles.container}>
      <View style={sharedStyles.uiSegmentContainer}>
        <Text style={sharedStyles.headlineText}>{gameState.startupName}.AI</Text>
        <Text style={sharedStyles.subHeadingText}>Total Spent: ${gameState.totalCashSpent.toLocaleString(undefined, {maximumFractionDigits: 2})}</Text>
        <TouchableOpacity 
        style={sharedStyles.buttonLarge}
        onPress={() => {addCash(1)}}>
          <Text style={sharedStyles.buttonTextLarge}>Angel Investment</Text>
        </TouchableOpacity>
      </View>
      <View style={sharedStyles.uiSegmentContainer}>
        <Text style={sharedStyles.segmentHeaderText}>Business</Text>
        <View style={sharedStyles.segmentHeaderSeperator}/>
        <Text>Cash/s: ${gameState.cashRate.toFixed(2)}</Text>
        <Text>Cash: ${gameState.cashTotal.toFixed(2)}</Text>
        <Text>Flops/s: {gameState.flopsRate.toFixed(2)}</Text>
        <Text>Total Flops {gameState.flopsTotal.toFixed(0)}</Text>
      </View>
      {
        gameState.unlockedGPUs.length > 0 &&
        <StoreTileContainer 
          name="IT Hardware"
          columnCount={getStoreWidth()}
          entries={gameState.unlockedGPUs.map((gpu) => getGPUStoreData(gpu))}
        />
      }
      {
        gameState.unlockedLLMs.length > 0 &&
        <StoreTileContainer 
          name="Development"
          columnCount={getStoreWidth()}
          entries={gameState.unlockedLLMs.map((llm) => getLLMStoreData(llm))}
        />
      }
      {
        gameState.availableResearch.length > 0 &&
        <ResearchTileContainer
          name="Research"
          columnCount={2}
          entries={gameState.availableResearch.map((research) => getResearchData(research))}
        />
      }
      <View style={sharedStyles.uiSegmentContainer}>
        <TouchableOpacity 
        style={sharedStyles.buttonLarge} 
        onPress={reset}>
          <Text style={sharedStyles.buttonTextLarge}>Reset</Text>
        </TouchableOpacity>
      </View>
    </View>
  );
}

export default GameUI;
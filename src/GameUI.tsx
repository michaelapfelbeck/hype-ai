import React, { useState, useLayoutEffect } from 'react';
import { 
  StyleSheet, 
  Text, 
  View,
  Dimensions
} from 'react-native';
import { sharedStyles } from './styles';
import { useGameState, useGameDispatch } from './GameStateProvider';
import { 
  LLMTypes, 
  ResourceType, 
  StoreEntry, 
  LlmStore, 
  GPUTypes, 
  GpuStore, 
  Researches, 
  ResearchStore, 
  ResearchStoreEntry,
  FeatureFlag
} from './constants/resources';
import StoreTileContainer from './components/StoreTileContainer';
import ResearchTileContainer from './components/ResearchTileContainer';
import GameButton, { ButtonSize } from './components/GameButton';
import { hasFeature } from './helpers';
import Constants from './constants/constants';

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
    return LlmStore.find((entry) => entry.resource.name === llm) ||   {
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
    return GpuStore.find((entry) => entry.resource.name === llm) ||   {
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

  const getResearchData = (research: Researches): ResearchStoreEntry => {
    return ResearchStore.find((entry) => entry.research.name === research) || {
      research: {
        name: research,
        detailsText: 'Placeholder',
        flavorText: 'Placeholder'
      },
      costType: ResourceType.CASH,
      cost: 1,
      unlockRequirement: {}
    }
  }

  const getStoreWidth = (): number => {
    if (orientation === 'portrait') {
      return Constants.portraitStoreColumns;
    } else {
      return Constants.widescreenStoreColumns;
    }
  }

  return (
    <View style={styles.container}>
      <View style={sharedStyles.uiSegmentContainer}>
        <Text style={sharedStyles.headlineText}>{gameState.startupName}.AI</Text>
        <Text style={sharedStyles.subHeadingText}>Total Spent: ${gameState.totalCashSpent.toLocaleString(undefined, {maximumFractionDigits: 2})}</Text>
        {/* <Text style={sharedStyles.subHeadingText}>Total Compute Spent: {gameState.totalFlopSpent.toLocaleString(undefined, {maximumFractionDigits: 2})}</Text> */}
        <GameButton 
          size={ButtonSize.Large}
          label="Angel Investment"
          onPress={() => {addCash(1)}}
        />
      </View>
      { 
        hasFeature(FeatureFlag.KPIDashboard, gameState.purchasedFeatures) && 
        <View style={sharedStyles.uiSegmentContainer}>
          <Text style={sharedStyles.segmentHeaderText}>Business</Text>
          <View style={sharedStyles.segmentHeaderSeperator}/>
          <View style={{flexDirection: 'row', justifyContent: 'space-between'}}>
            <View style={{flexShrink: 0, paddingRight: 10}}>
              <Text style={{fontWeight: '500'}}>Cash</Text>
              <Text>Total: ${gameState.cashTotal.toFixed(2)}</Text>
              <Text>Income/s: ${gameState.cashRate.toFixed(2)}</Text>
            </View>
            <View style={{flexShrink: 0, paddingLeft: 10}}>
              <Text style={{fontWeight: '500'}}>Compute</Text>
              <Text>Total: {gameState.flopsTotal.toFixed(0)}</Text>
              <Text>Income/s: {gameState.flopsRate.toFixed(2)}</Text>
            </View>
          </View>
        </View>
      }
      
      {
        gameState.unlockedGPUs.length > 0 &&
        <StoreTileContainer 
          name="IT Hardware"
          description="GPUs generate compute power to train AI models."
          columnCount={getStoreWidth()}
          entries={gameState.unlockedGPUs.map((gpu) => getGPUStoreData(gpu))}
        />
      }
      {
        gameState.unlockedLLMs.length > 0 &&
        <StoreTileContainer 
          name="Development"
          description="Large Language Models (LLMs) generate cash to fund your startup."
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
        <GameButton 
          size={ButtonSize.Large}
          label="Reset"
          onPress={reset}
        />
      </View>
    </View>
  );
}

export default GameUI;
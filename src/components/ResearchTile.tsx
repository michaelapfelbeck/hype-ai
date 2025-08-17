import React, { PropsWithChildren } from 'react';
import { 
  StyleSheet, 
  Text, 
  View,
  TouchableOpacity,
} from 'react-native';
import { ResourceType, ResearchStoreEntry } from '../constants/resources';
import { useGameState } from '../GameStateProvider';
import { sharedStyles } from '../styles';

const styles = StyleSheet.create({
  container: {
    alignItems: 'flex-start',
    justifyContent: 'center',
    flex:  1,
    borderRadius: 2,
    padding: 4,
    margin: 2,
    borderColor: '#CCCCCC',
    borderWidth: 1,
    backgroundColor: '#F8F8F8',
  },
  containerDisabled: {
    backgroundColor: '#F4F4F4',
  },
  titleText: {
    fontSize: 20,
  },
  infoText: {
    fontSize: 12,
    fontWeight: 'bold',
    color: '#444444',
    marginBottom: 2,
    textAlign: 'left',
  },
  detailsText: {
    fontSize: 12,
    marginBottom: 4,
    textAlign: 'left',
    maxWidth: 300,
  },
  flavorText: {
    fontSize: 12,
    color: '#444444',
    marginBottom: 10,
    textAlign: 'left',
    maxWidth: 300,
  },
  horizontalButtonContainer: {
    flexDirection: 'row',
    width: '100%',
  }
});

type ResearchTileProps = PropsWithChildren<{
    entry: ResearchStoreEntry;
    onClick: (resource: ResearchStoreEntry) => void;
}>

const ResearchTile = ({entry, onClick}: ResearchTileProps): React.JSX.Element => {
  const { cashTotal, flopsTotal } = useGameState();

  const canBuy = (): boolean => {
    let currAmount = 0;
    switch (entry.costType) {
      case ResourceType.CASH:
        currAmount = cashTotal;
        break;
      case ResourceType.FLOPS:
        currAmount = flopsTotal;
        break;
      default:
        console.log("error: unknown cost type", entry.costType);
        currAmount = 0;
        break;
    }

    return currAmount >= entry.cost;
  }

  const getCostString = (): string => {
    switch (entry.costType) {
      case ResourceType.CASH:
        return `Cost: $${entry.cost.toLocaleString(undefined, {maximumFractionDigits: 2})}`;
      case ResourceType.FLOPS:
        return `Cost: ${entry.cost.toLocaleString(undefined, {maximumFractionDigits: 0})} FLOPS`;
      default:
        return entry.cost.toLocaleString(undefined, {maximumFractionDigits: 2});
    }
    return '';
  }

  return (
    <TouchableOpacity 
      style={[styles.container, !canBuy() && styles.containerDisabled]}
      onPress={() => onClick(entry)}
      disabled={!canBuy()}>
      <Text style={[styles.titleText, canBuy() ? {} : sharedStyles.textDisabled]} numberOfLines={1}>{entry.title ?? entry.research.name}</Text>
      <Text style={[styles.infoText, canBuy() ? {} : sharedStyles.textDisabled]} numberOfLines={1}>{getCostString()}</Text>
      <Text style={[styles.detailsText, canBuy() ? {} : sharedStyles.textDisabled]} numberOfLines={3}>{entry.research.detailsText}</Text>
      <Text style={[styles.flavorText, canBuy() ? {} : sharedStyles.textDisabled]} numberOfLines={3}>{entry.research.flavorText}</Text>
    </TouchableOpacity>
  );
}

export default ResearchTile;
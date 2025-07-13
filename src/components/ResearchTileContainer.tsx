import React, { PropsWithChildren } from 'react';
import { 
  StyleSheet, 
  Text, 
  View,
  FlatList
} from 'react-native';
import { StoreEntry, ResearchEntry } from '../constants/resources';
import { sharedStyles } from '../styles';
import { useGameDispatch } from '../GameStateProvider';
import StoreTile from './StoreTile';
import ResearchTile from './ResearchTile';

const styles = StyleSheet.create({
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

type ResearchTileContainerProps = PropsWithChildren<{
    name: string;
    entries: ResearchEntry[];
    columnCount?: number;
}>

const ResearchTileContainer = ({name, entries, columnCount = 2}: ResearchTileContainerProps): React.JSX.Element => {
  const { buyResearch } = useGameDispatch();
  
  function padData<T>(data: T[], numColumns: number): (T | null)[] {
    if (data.length <= numColumns) {
      return data
    }
    const fullRows = Math.floor(data.length / numColumns);
    const lastRowItems = data.length - (fullRows * numColumns);
    if (lastRowItems === 0) return data;
    return [
      ...data,
      ...Array(numColumns - lastRowItems).fill(null)
    ];
  }

  return (
    <View style={sharedStyles.uiTileContainer}>
      <Text style={sharedStyles.segmentHeaderText}>{name}</Text>
      <View style={sharedStyles.segmentHeaderSeperator}/>
      <View style={sharedStyles.tileContainer}>
        <FlatList
          numColumns={columnCount}
          data={padData(entries, columnCount)}
          keyExtractor={(item, idx) => item ? item.resource.name.toString() : `${name}-${idx}`}
              renderItem={({ item }) => (
                item ? (
                <ResearchTile 
                  entry={item} 
                  onClick={buyResearch }
                />) : <View style={styles.blankTile} />
              )}
        />
      </View>
    </View>
  );
}

export default ResearchTileContainer;
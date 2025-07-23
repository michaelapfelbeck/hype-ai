import React, { PropsWithChildren } from 'react';
import { 
  StyleSheet, 
  Text, 
  View,
  FlatList
} from 'react-native';
import { StoreEntry } from '../constants/resources';
import { sharedStyles } from '../styles';
import { useGameDispatch } from '../GameStateProvider';
import StoreTile from './StoreTile';

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

type StoreTileContainerProps = PropsWithChildren<{
    name: string;
    description?: string;
    entries: StoreEntry[];
    columnCount?: number;
}>

const StoreTileContainer = ({name, description, entries, columnCount = 3}: StoreTileContainerProps): React.JSX.Element => {
  const { buyResource } = useGameDispatch();
  
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

  // all this garbage where column count is everywhere is so react doesn't complain about non-unique keys
  // when the column count changes
  return (
    <View style={sharedStyles.uiTileContainer}>
      <Text style={sharedStyles.segmentHeaderText}>{name}</Text>
      { description && <Text style={sharedStyles.segmentDescriptionText}>{description}</Text> }
      <View style={sharedStyles.segmentHeaderSeperator}/>
      <View style={sharedStyles.tileContainer}>
        <FlatList
        key={`${name} - ${columnCount}`}
          numColumns={columnCount}
          data={padData(entries, columnCount)}
          keyExtractor={(item, idx) => item ? `${JSON.stringify(item)}-${columnCount}` : `${name}-${columnCount}-${idx}`}
          renderItem={({ item }) => (
            item ? (
            <StoreTile 
              entry={item} 
              onClick={buyResource }
            />) : <View style={styles.blankTile} />
          )}
        />
      </View>
    </View>
  );
}

export default StoreTileContainer;
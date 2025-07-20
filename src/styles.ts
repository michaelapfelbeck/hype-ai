import { 
  StyleSheet, 
} from 'react-native';

export const sharedStyles = StyleSheet.create({
  headlineText: {
    fontSize: 30,
    fontWeight: 'bold',
    marginBottom: 20,
  },
  uiSegmentContainer: {
    alignContent: 'flex-start',
    marginBottom: 5,
    marginTop: 5,
    padding: 5,
  },
  uiTileContainer: {
    alignContent: 'flex-start',
    marginBottom: 5,
    marginTop: 5,
    backgroundColor: '#F0F0F0',
    padding: 8,
    borderRadius: 4,
    borderColor: '#e0e0e0',
    borderWidth: 1,
  },
  segmentHeaderText: {
    fontSize: 20,
    fontWeight: 'bold',
  },
  segmentHeaderSeperator: {
    height: 1,
    width: '100%',
    backgroundColor: '#CCCCCC',
    marginBottom: 10,
  },
  subHeadingText: {
    fontSize: 24,
    fontWeight: 'medium',
    marginBottom: 20,
  },
  buttonLarge: {
    alignItems: 'center',
    backgroundColor: '#8888FF',
    paddingVertical: 8,
    paddingHorizontal: 15,
    marginBottom: 10,
    borderRadius: 15,
    elevation: 2,
    boxShadow: '2px 2px 3px rgba(0,0,0,0.5)',
  },
  buttonSmall: {
    alignItems: 'center',
    backgroundColor: '#8888FF',
    paddingVertical: 4,
    paddingHorizontal: 8,
    marginBottom: 10,
    marginHorizontal: 4,
    borderRadius: 5,
    elevation: 2,
    boxShadow: '1px 1px 2px rgba(0,0,0,0.2)',
  },
  buttonDisabled: {
    backgroundColor: '#DDDDDD',
    boxShadow: '0px 0px 0px rgba(0,0,0,0.5)',
    elevation: 0,
  },
  buttonTextLarge: {
    fontSize: 20,
    color: '#FFFFFF',
  },
  buttonTextSmall: {
    color: '#FFFFFF',
    fontSize: 12,
  },
  textDisabled: {
    color: '#666666',
  },
  tileContainer: {
    flex: 3,
  },
});
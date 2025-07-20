import React, { 
  PropsWithChildren, 
  useState 
} from 'react';
import { 
  Text, 
  TouchableOpacity,
} from 'react-native';
import { sharedStyles } from '../styles';

export enum ButtonSize {
  Small = 'small',
  Large = 'large',
}

type GameButtonProps = PropsWithChildren<{
    size: ButtonSize;
    label?: string;
    disabled?: boolean;
    onPress: () => void;
}>

const GameButton = ({size, label = '', disabled = false, onPress}: GameButtonProps): React.JSX.Element => {
  const [hovered, setHovered] = useState(false);

  const buttonStyle = () => {
    let result = {};
    switch (size) {
      case ButtonSize.Small:
        result = sharedStyles.buttonSmall;
        break;
      case ButtonSize.Large:
        result = sharedStyles.buttonLarge;
        break;
      default:
        result = sharedStyles.buttonSmall;
    }
    if (disabled) {
      result = [result, sharedStyles.buttonDisabled];
    } else if (hovered) {
      switch (size) {
        case ButtonSize.Small:
          result = [result, sharedStyles.buttonSmallHover];
          break;
        case ButtonSize.Large:
          result = [result, sharedStyles.buttonLargeHover];
          break;
        default:
          break;
      }
    }
    return result;
  }

  const labelStyle = () => {
    let result = {};
    switch (size) {
      case ButtonSize.Small:
        result = sharedStyles.buttonTextSmall;
        break;
      case ButtonSize.Large:
        result = sharedStyles.buttonTextLarge;
        break;
      default:
        result = sharedStyles.buttonTextSmall;
    }
    if (disabled) {
      result = [result, sharedStyles.textDisabled];
    }
    return result;
  }

  return (
    <div 
      onMouseEnter={() => {setHovered(true)}}
      onMouseLeave={() => {setHovered(false)}}
    >
      <TouchableOpacity 
        style={buttonStyle()}
        onPress={onPress}
        disabled={disabled}
      >
        <Text style={labelStyle()} numberOfLines={1}>{label}</Text>
      </TouchableOpacity>
    </div>
  );
}

export default GameButton;
import React, { PropsWithChildren } from 'react';
import { 
  StyleSheet, 
  Text, 
  View,
} from 'react-native';
import { ResourceType, StoreEntry, FeatureFlag, ResearchData, EfficiencyType } from '../constants/resources';
import { useGameState } from '../GameStateProvider';
import { calcPrice, getResearchThatEffects, hasFeature, getProductionWithMultiplier } from '../helpers';
import { sharedStyles } from '../styles';
import GameButton, { ButtonSize } from './GameButton';

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
  descriptionText: {
    fontSize: 12,
    color: '#444444',
    marginBottom: 10,
    textAlign: 'left',
    maxWidth: 200,
  },
  horizontalButtonContainer: {
    flexDirection: 'row',
    width: '100%',
  }
});

type StoreTileProps = PropsWithChildren<{
    entry: StoreEntry;
    onClick: (resource: StoreEntry, count: number) => void;
}>

const StoreTile = ({entry, onClick}: StoreTileProps): React.JSX.Element => {
  const { cashTotal, flopsTotal, generators, purchasedResearch, purchasedFeatures } = useGameState();

  const getNumberOwned = (): number => {
    const result = generators.find((g) => g.resource.name == entry.resource.name);
    if (!result) {
      return 0;
    } else {
      return result.count;
    }
  }

  const canBuy = (count: number): boolean => {
    let currCount = getNumberOwned();
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

    let totalCost = calcPrice(currCount, entry, count, purchasedResearch);
    return currAmount >= totalCost;
  }

  const getCostString = (cost: number): string => {
    switch (entry.costType) {
      case ResourceType.CASH:
        return `Cost: $${cost.toLocaleString(undefined, {maximumFractionDigits: 2})}`;
      case ResourceType.FLOPS:
        return `Cost: ${cost.toLocaleString(undefined, {maximumFractionDigits: 0})} Compute`;
      default:
        return cost.toLocaleString(undefined, {maximumFractionDigits: 2});
    }
    return '';
  }

  const getIncomeString = (): string => {
    const researchData: ResearchData[] = getResearchThatEffects(purchasedResearch, entry.resource)
      .filter((r) => r.efficiencyUpgrade?.efficiencyType == EfficiencyType.ProductionRate);
    // console.log(`found ${researchData.length} research that effects ${entry.resource.name}`);
    const productionBonus = researchData.reduce((acc, r) => acc + (r.efficiencyUpgrade?.efficiency ?? 0), 0);
    const productionRate = getProductionWithMultiplier(entry.resource.productionRate, productionBonus);
    // console.log(`base production for ${entry.resource.name} is ${entry.resource.productionRate}`);
    // console.log(`production bonus for ${entry.resource.name} is ${productionBonus}`);
    // console.log(`production rate for ${entry.resource.name} is ${productionRate}`);
    switch (entry.resource.generatesType) {
      case ResourceType.CASH:
        return `$${productionRate.toLocaleString(undefined, {maximumFractionDigits: 2})}/s`;
        break;
      case ResourceType.FLOPS:
        return `${productionRate.toLocaleString(undefined, {maximumFractionDigits: 1})} Compute/s`;
      default:
        return productionRate.toLocaleString(undefined, {maximumFractionDigits: 2});
    }
    return '';
  }

  const getCostForCount = (count: number): number => {
    return calcPrice(getNumberOwned(), entry, count, purchasedResearch);
  }

  return (
    <View style={[styles.container, !canBuy(1) && styles.containerDisabled]}>
      <Text style={[styles.titleText, canBuy(1) ? {} : sharedStyles.textDisabled]} numberOfLines={1}>{entry.resource.name}</Text>
      <Text style={[styles.infoText, canBuy(1) ? {} : sharedStyles.textDisabled]} numberOfLines={1}>Owned: {getNumberOwned()}</Text>
      {
        hasFeature(FeatureFlag.StoreInsights, purchasedFeatures) && 
        <Text style={[styles.infoText, canBuy(1) ? {} : sharedStyles.textDisabled]} numberOfLines={1}>Income: {getIncomeString()}</Text>
      }
      <Text style={[styles.infoText, canBuy(1) ? {} : sharedStyles.textDisabled]} numberOfLines={1}>{getCostString(getCostForCount(1))}</Text>
      <Text style={[styles.descriptionText, canBuy(1) ? {} : sharedStyles.textDisabled]} numberOfLines={4}>{entry.resource.description}</Text>
      <View style={styles.horizontalButtonContainer}>
        <GameButton 
          size={ButtonSize.Small}
          label="Buy 1"
          onPress={() => onClick(entry, 1)}
          disabled={!canBuy(1)}
        />
        <GameButton 
          size={ButtonSize.Small}
          label="Buy 10"
          onPress={() => onClick(entry, 10)}
          disabled={!canBuy(10)}
        />
      </View>
    </View>
  );
}

export default StoreTile;
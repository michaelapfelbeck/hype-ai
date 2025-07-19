import { 
  ResearchData, 
  ResourceGenerator, 
  EfficiencyType, 
  Researches, 
  ResearchTypeTable 
} from './constants/resources';

export const calcPrice = (owned: number, baseCost: number, costMultiplier: number, count: number): number => {
  if (count === 0) {
    return baseCost * Math.pow(costMultiplier, owned);
  } else {
    let finalCount = owned + count;
    return baseCost * (finalCount* Math.pow(costMultiplier, finalCount - 1) - owned * Math.pow(costMultiplier, owned - 1));
  }
}

export const researchEffectsGenerator = (research: ResearchData, generator: ResourceGenerator): boolean => {
  if (research.efficiencyUpgrade?.affectedGPU == generator.name || 
      research.efficiencyUpgrade?.affectedLLM == generator.name ||
      (research.efficiencyUpgrade?.affectedTags !== undefined &&
        generator.tags.includes(research.efficiencyUpgrade.affectedTags))) {
    return true;
  }
  return false;
}

export const getProductionWithMultiplier = (base: number, efficiency: number): number => {
  return base * (1 + efficiency);
}

export const getCostReduction = (base: number, efficiency: number): number => {
  return base * (1/(1 + efficiency));
}

export const getEfficiencyResearchesOfType = (efficiencyType: EfficiencyType, purchasedResearch: Researches[]): ResearchData[] => {
  return purchasedResearch
    .map((r) => ResearchTypeTable[r])
    .filter((rd): rd is ResearchData => rd !== undefined)
    .filter((rd) => rd.efficiencyUpgrade && rd.efficiencyUpgrade.efficiencyType == efficiencyType);
}
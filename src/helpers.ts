import { 
  ResearchData, 
  ResourceGenerator, 
  EfficiencyType, 
  Researches, 
  ResearchTypeTable,
  StoreEntry
} from './constants/resources';

export const calcPrice = (owned: number, entry: StoreEntry, count: number, purchasedResearch: Researches[] = []): number => {
  const filteredResearches = getEfficiencyResearchesOfType(EfficiencyType.CostMultiplier, purchasedResearch).filter((r) => researchEffectsGenerator(r, entry.resource));
  let finalMultiplier = entry.costMultiplier;
  if (filteredResearches.length > 0) {
    const costEfficiency: number = filteredResearches.reduce((acc, r) => acc + (r.efficiencyUpgrade?.efficiency ?? 0), 0);
    finalMultiplier = getCostReduction(entry.costMultiplier, costEfficiency);
  }
  if (count === 1) {
    return entry.cost * Math.pow(1 + finalMultiplier, owned);
  } else {
    let finalCount = owned + count;
    return entry.cost * (finalCount * Math.pow(1 + finalMultiplier, finalCount - 1) - owned * Math.pow(1 + finalMultiplier, owned - 1));
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
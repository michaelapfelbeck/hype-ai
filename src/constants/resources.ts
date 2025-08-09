export enum ResourceType {
  CASH = 'CASH',
  FLOPS = "FLOPS",
  HYPE = "HYPE"
}

export enum LLMTypes {
  ALEXNET = 'ALEXNET',  
  GPT1 = 'GPT1',
  GPT2 = 'GPT2',
  CHATGPT = 'CHATGPT'
}

export enum GPUTypes {
  RTX3090 = 'RTX3090',
  RTX4090 = 'RTX4090',
  A6000 = 'A6000',
  B300 = 'B300',
}

export enum FeatureFlag {
  KPIDashboard = 'KPIDashboard',
  StoreInsights = 'StoreInsights',
}

export enum ResourceTypeTags {
  GPU = 'GPU',
  CONSUMER_GPU = 'CONSUMER_GPU',
  INDUSTRIAL_GPU = 'INDUSTRIAL_GPU',
  LLM = 'LLM',
  SMALL_LLM = 'SMALL_LLM',
  LARGE_LLM = 'LARGE_LLM',
}

export enum Researches {
  ScavengeWeb3 = 'ScavengeWeb3',
  FireExtinguishers = 'FireExtinguishers',
  IndustrialGPUs = 'IndustrialGPUs',
  BribeNvidia = 'BribeNvidia',
  CopyAlexNet = 'CopyAlexNet',
  AttentionPaper = 'AttentionPaper',
  CrawlWebText = 'CrawlWebText',
  PirateWholeInternet = 'PirateWholeInternet',
  Overclocking = 'Overclocking',
  BulkDiscounts = 'BulkDiscounts',
  CopyDeepSeeksHomework = 'CopyDeepSeeksHomework',
  AgenticWorkflows = 'AgenticWorkflows',
  KPIDashboard = 'KPIDashboard',
  StoreInsights = 'StoreInsights',
}

export enum EfficiencyType {
  // BaseCost = 'BASE_COST',
  CostMultiplier = 'COST_MULTIPLIER',
  ProductionRate = 'PRODUCTION_RATE',
}

export type ResourceGenerator = {
  name: string;
  description: string;
  generatesType: ResourceType;
  productionRate: number;
  tags: ResourceTypeTags[];
}

export type StoreEntry = {
  resource: ResourceGenerator;
  costType: ResourceType;
  cost: number;
  costMultiplier: number;
}

export type ResearchData = {
  name: Researches;
  detailsText: string;
  flavorText: string;
  featureUnlock?: FeatureFlag;
  gpuUnlock?: GPUTypes;
  llmUnlock?: LLMTypes;
  efficiencyUpgrade?: EfficiencyUpgrade;
}

export type EfficiencyUpgrade = {
  affectedLLM?: LLMTypes;
  affectedGPU?: GPUTypes;
  affectedTags?: ResourceTypeTags;
  efficiencyType: EfficiencyType;
  efficiency: number;
}

export type UnlockRequirement = {
  resourceType?: ResourceType;
  resourceProduction?: number;
  resourceTotal?: number;
  resourceSpent?: number;
  research?: Researches;
}

export type ResearchEntry = {
  resource: ResearchData;
  costType: ResourceType;
  cost: number;
  unlockRequirement: UnlockRequirement;
}

import gpuData from '../../data/gpus.json';
export const GPUTypesTable: { [K in GPUTypes]?: ResourceGenerator } = Object.assign({}, ...gpuData.map((x) => ({[x.name]: x})));
import llmData from '../../data/llms.json';
export const LLMTypeTable: { [K in LLMTypes]?: ResourceGenerator } = Object.assign({}, ...llmData.map((x) => ({[x.name]: x})));
import researchData from '../../data/researches.json'
export const ResearchTypeTable: { [K in Researches]?: ResearchData } = Object.assign({}, ...researchData.map((x) => ({[x.name]: x})));

// Types for JSON data structure
type StoreEntryJSON = {
  type: GPUTypes | LLMTypes;
  costType: ResourceType;
  cost: number;
  costMultiplier: number;
}

// Transformation functions
const transformGPUStoreEntry = (entry: StoreEntryJSON & { type: GPUTypes }): StoreEntry => {
  const resource = GPUTypesTable[entry.type];
  if (!resource) {
    throw new Error(`GPU type ${entry.type} not found in GPUTypesTable`);
  }
  return {
    resource,
    costType: entry.costType,
    cost: entry.cost,
    costMultiplier: entry.costMultiplier
  };
};

const transformLLMStoreEntry = (entry: StoreEntryJSON & { type: LLMTypes }): StoreEntry => {
  const resource = LLMTypeTable[entry.type];
  if (!resource) {
    throw new Error(`LLM type ${entry.type} not found in LLMTypeTable`);
  }
  return {
    resource,
    costType: entry.costType,
    cost: entry.cost,
    costMultiplier: entry.costMultiplier
  };
};

// Load and transform store data
import gpuStoreData from '../../data/gpuStore.json';
export const GpuStore: StoreEntry[] = gpuStoreData.map(entry => 
  transformGPUStoreEntry(entry as StoreEntryJSON & { type: GPUTypes })
);

const defaultResourceGenerator: ResourceGenerator = {
  name: 'placeholder',
  description: 'placeholder description',
  generatesType: ResourceType.CASH,
  productionRate: 1.0,
  tags: [ResourceTypeTags.GPU],
}

export const LlmStore: StoreEntry[] = [
  {
    resource: LLMTypeTable[LLMTypes.ALEXNET] || defaultResourceGenerator,
    costType: ResourceType.FLOPS,
    cost: 40,
    costMultiplier: 0.2,
  },
  {
    resource: LLMTypeTable[LLMTypes.GPT1] || defaultResourceGenerator,
    costType: ResourceType.FLOPS,
    cost: 200,
    costMultiplier: 0.25,
  },
  {
    resource: LLMTypeTable[LLMTypes.GPT2] || defaultResourceGenerator,
    costType: ResourceType.FLOPS,
    cost: 2000,
    costMultiplier: 0.3,
  },
  {
    resource: LLMTypeTable[LLMTypes.CHATGPT] || defaultResourceGenerator,
    costType: ResourceType.FLOPS,
    cost: 10000,
    costMultiplier: 0.4,
  }
]

const defaultResearchEntry: ResearchEntry = {
  resource: {
    name: Researches.ScavengeWeb3,
    detailsText: 'placeholder details',
    flavorText: 'placeholder description',
    gpuUnlock: undefined,
    llmUnlock: undefined,
  },
  costType: ResourceType.CASH,
  cost: 0,
  unlockRequirement: {
    resourceType: undefined,
    resourceProduction: 0,
    resourceTotal: 0,
    research: undefined,
  }
}

const cashTotalUnlock = (total: number): UnlockRequirement => ({
  resourceType: ResourceType.CASH,
  resourceTotal: total
})

const cashSpentUnlock = (total: number): UnlockRequirement => ({
  resourceType: ResourceType.CASH,
  resourceSpent: total
})

const flopsTotalUnlock = (total: number): UnlockRequirement => ({
  resourceType: ResourceType.FLOPS,
  resourceTotal: total
})

const flopsSpentUnlock = (total: number): UnlockRequirement => ({
  resourceType: ResourceType.FLOPS,
  resourceSpent: total
})

const cashIncomeUnlock = (income: number): UnlockRequirement => ({
  resourceType: ResourceType.CASH,
  resourceProduction: income
})

const flopsIncomeUnlock = (income: number): UnlockRequirement => ({
  resourceType: ResourceType.FLOPS,
  resourceProduction: income
})

export const ResearchesTable: ResearchEntry[] = [
  {
    resource: ResearchTypeTable[Researches.ScavengeWeb3] || defaultResearchEntry.resource,
    costType: ResourceType.CASH,
    cost: 2,
    unlockRequirement: cashTotalUnlock(1)
  },
  {
    resource: ResearchTypeTable[Researches.FireExtinguishers] || defaultResearchEntry.resource,
    costType: ResourceType.CASH,
    cost: 100,
    unlockRequirement: cashSpentUnlock(65)
  },
  {
    resource: ResearchTypeTable[Researches.IndustrialGPUs] || defaultResearchEntry.resource,
    costType: ResourceType.CASH,
    cost: 8000,
    unlockRequirement: cashIncomeUnlock(75)
  },
  {
    resource: ResearchTypeTable[Researches.BribeNvidia] || defaultResearchEntry.resource,
    costType: ResourceType.CASH,
    cost: 30000,
    unlockRequirement: cashIncomeUnlock(200)
  },
  {
    resource: ResearchTypeTable[Researches.CopyAlexNet] || defaultResearchEntry.resource,
    costType: ResourceType.FLOPS,
    cost: 20,
    unlockRequirement: flopsTotalUnlock(5)
  },
  {
    resource: ResearchTypeTable[Researches.AttentionPaper] || defaultResearchEntry.resource,
    costType: ResourceType.CASH,
    cost: 200,
    unlockRequirement: flopsSpentUnlock(295)
  },
  {
    resource: ResearchTypeTable[Researches.CrawlWebText] || defaultResearchEntry.resource,
    costType: ResourceType.CASH,
    cost: 10000,
    unlockRequirement: flopsIncomeUnlock(170)
  },
  {
    resource: ResearchTypeTable[Researches.PirateWholeInternet] || defaultResearchEntry.resource,
    costType: ResourceType.CASH,
    cost: 50000,
    unlockRequirement: flopsIncomeUnlock(400)
  },
  {
    resource: ResearchTypeTable[Researches.Overclocking] || defaultResearchEntry.resource,
    costType: ResourceType.CASH,
    cost: 100,
    unlockRequirement: flopsIncomeUnlock(20)
  },
  {
    resource: ResearchTypeTable[Researches.BulkDiscounts] || defaultResearchEntry.resource,
    costType: ResourceType.CASH,
    cost: 200,
    unlockRequirement: cashSpentUnlock(500)
  },
  {
    resource: ResearchTypeTable[Researches.CopyDeepSeeksHomework] || defaultResearchEntry.resource,
    costType: ResourceType.CASH,
    cost: 1000,
    unlockRequirement: flopsSpentUnlock(1000)
  },
  {
    resource: ResearchTypeTable[Researches.AgenticWorkflows] || defaultResearchEntry.resource,
    costType: ResourceType.CASH,
    cost: 1000,
    unlockRequirement: flopsSpentUnlock(2000)
  },
  {
    resource: ResearchTypeTable[Researches.KPIDashboard] || defaultResearchEntry.resource,
    costType: ResourceType.CASH,
    cost: 5,
    unlockRequirement: cashSpentUnlock(1)
  },
  {
    resource: ResearchTypeTable[Researches.StoreInsights] || defaultResearchEntry.resource,
    costType: ResourceType.CASH,
    cost: 10,
    unlockRequirement: cashSpentUnlock(1)
  }
]
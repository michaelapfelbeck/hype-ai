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
  Datacenters = 'Datacenters',
  MarketingDepartment = 'MarketingDepartment'
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
  Phase2 = 'Phase2',
  DeclareAGI = 'DeclareAGI',
  Datacenters = 'Datacenters',
  MarketingDepartment = 'MarketingDepartment'
}

export enum EfficiencyType {
  CostMultiplier = 'CostMultiplier',
  ProductionRate = 'ProductionRate',
}

export type ResourceGenerator = {
  name: string;
  description: string;
  generatesType: ResourceType;
  productionRate: number;
  tags: ResourceTypeTags[];
}

export type StoreEntry = {
  title?: string;
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

export type ResearchStoreEntry = {
  title?: string;
  research: ResearchData;
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

// Types for JSON data structures
type StoreEntryJSON = {
  title?: string;
  type: GPUTypes | LLMTypes;
  costType: ResourceType;
  cost: number;
  costMultiplier: number;
}

type ResearchStoreEntryJSON = {
  title?: string;
  research: Researches;
  costType: ResourceType;
  cost: number;
  unlockRequirement: UnlockRequirement;
}

// Transformation functions
const transformGPUStoreEntry = (entry: StoreEntryJSON & { type: GPUTypes }): StoreEntry => {
  const resource = GPUTypesTable[entry.type];
  if (!resource) {
    throw new Error(`GPU type ${entry.type} not found in GPUTypesTable`);
  }
  return {
    title: entry.title,
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
    title: entry.title,
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

import llmStoreData from '../../data/llmStore.json';
export const LlmStore: StoreEntry[] = llmStoreData.map(entry => 
  transformLLMStoreEntry(entry as StoreEntryJSON & { type: LLMTypes })
);

const transformResearchStoreEntry = (entry: ResearchStoreEntryJSON): ResearchStoreEntry => {
  const research = ResearchTypeTable[entry.research];
  if (!research) {
    throw new Error(`Research type ${entry.research} not found in ResearchTypeTable`);
  }
  return {
    title: entry.title,
    research,
    costType: entry.costType,
    cost: entry.cost,
    unlockRequirement: entry.unlockRequirement
  };
};

import researchStoreData from '../../data/researchStore.json';
export const ResearchStore: ResearchStoreEntry[] = (researchStoreData as ResearchStoreEntryJSON[]).map((entry: ResearchStoreEntryJSON) => 
  transformResearchStoreEntry(entry)
);

export enum ResourceType {
  CASH = 'CASH',
  FLOPS = "FLOPS",
  HYPE = "HYPE"
};

export enum LLMTypes {
  ALEXNET = 'ALEXNET',  
  GPT1 = 'GPT1',
  GPT2 = 'GPT2',
  CHATGPT = 'CHATGPT'}

export enum GPUTypes {
  RTX3090 = 'RTX3090',
  RTX4090 = 'RTX4090',
  A6000 = 'A6000',
  B300 = 'B300',
}

export enum ResourceTypeTags {
  GPU = 'GPU',
  CONSUMER_GPU = 'CONSUMER_GPU',
  INDUSTRIAL_GPU = 'INDUSTRIAL_GPU',
  LLM = 'LLM',
  SMALL_LLM = 'SMALL_LLM',
  LARGE_LLM = 'LARGE_LLM',
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

export const GPUTypesTable: { [K in GPUTypes]?: ResourceGenerator } = {
  [GPUTypes.RTX3090]: {
      name: GPUTypes.RTX3090,
      description: 'Consumer GPU scavenged from a crypto mining rig.',
      generatesType: ResourceType.FLOPS,
      productionRate: 5,
      tags: [ResourceTypeTags.GPU, ResourceTypeTags.CONSUMER_GPU],
  },
  [GPUTypes.RTX4090]: {
      name: GPUTypes.RTX4090,
      description: 'An even more powerful GPU that\'s totally not a fire hazard.',
      generatesType: ResourceType.FLOPS,
      productionRate: 20,
      tags: [ResourceTypeTags.GPU, ResourceTypeTags.CONSUMER_GPU],
  },
  [GPUTypes.A6000]: {
      name: GPUTypes.A6000,
      description: 'A GPU so expensive, you\'ll need a research grant just to look at it.',
      generatesType: ResourceType.FLOPS,
      productionRate: 100,
      tags: [ResourceTypeTags.GPU, ResourceTypeTags.INDUSTRIAL_GPU],
  },
  [GPUTypes.B300]: {
      name: GPUTypes.B300,
      description: 'It burns cash and watts faster than your AI can hallucinate.',
      generatesType: ResourceType.FLOPS,
      productionRate: 400.0,
      tags: [ResourceTypeTags.GPU, ResourceTypeTags.INDUSTRIAL_GPU],
  }
}

const defaultResourceGenerator: ResourceGenerator = {
  name: 'placeholder',
  description: 'placeholder description',
  generatesType: ResourceType.CASH,
  productionRate: 1.0,
  tags: [ResourceTypeTags.GPU],
}

export const GPUs: StoreEntry[] = [
  {
    resource: GPUTypesTable[GPUTypes.RTX3090] || defaultResourceGenerator,
    costType: ResourceType.CASH,
    cost: 8,
    costMultiplier: 0.2,
  },
  {
    resource: GPUTypesTable[GPUTypes.RTX4090] || defaultResourceGenerator,
    costType: ResourceType.CASH,
    cost: 50,
    costMultiplier: 0.25,
  },
  {
    resource: GPUTypesTable[GPUTypes.A6000] || defaultResourceGenerator,
    costType: ResourceType.CASH,
    cost: 500,
    costMultiplier: 0.3,
  },
  {
    resource: GPUTypesTable[GPUTypes.B300] || defaultResourceGenerator,
    costType: ResourceType.CASH,
    cost: 4500,
    costMultiplier: 0.4,
  }
]

export const LLMTypeTable: { [K in LLMTypes]?: ResourceGenerator } = {
  [LLMTypes.ALEXNET]: {
      name: LLMTypes.ALEXNET,
      description: 'You don\'t have to understand it, just git clone it',
      generatesType: ResourceType.CASH,
      productionRate: 1.5,
      tags: [ResourceTypeTags.LLM, ResourceTypeTags.SMALL_LLM],
    },
  [LLMTypes.GPT1]: {
      name: LLMTypes.GPT1,
      description: 'Word salad as a service.',
      generatesType: ResourceType.CASH,
      productionRate: 6,
      tags: [ResourceTypeTags.LLM, ResourceTypeTags.SMALL_LLM],
    },
    [LLMTypes.GPT2]: {
      name: LLMTypes.GPT2,
      description: '10x the parameters of GPT1, same amount of nonsense.',
      generatesType: ResourceType.CASH,
      productionRate: 30,
      tags: [ResourceTypeTags.LLM, ResourceTypeTags.LARGE_LLM],
    },
    [LLMTypes.CHATGPT]: {
      name: LLMTypes.CHATGPT,
      description: 'A chatbot that confidently makes things up while beating Stackoverflow at civility.',
      generatesType: ResourceType.CASH,
      productionRate: 120,
      tags: [ResourceTypeTags.LLM, ResourceTypeTags.LARGE_LLM],
    }
  }

export const LLMs: StoreEntry[] = [
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
}

export type ResearchData = {
  name: Researches;
  description: string;
  gpuUnlock?: GPUTypes;
  llmUnlock?: LLMTypes;
  efficiencyUpgrade?: EfficiencyUpgrade;
}

export enum EfficiencyType {
  // BaseCost = 'BASE_COST',
  CostMultiplier = 'COST_MULTIPLIER',
  ProductionRate = 'PRODUCTION_RATE',
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
  unlock: UnlockRequirement;
}

export const ResearchTypeTable: { [K in Researches]?: ResearchData } = {
  [Researches.ScavengeWeb3]: {
    name: Researches.ScavengeWeb3,
    description: 'Repurpose mining gear from your not-a-scam crypto project',
    gpuUnlock: GPUTypes.RTX3090,
  },
  [Researches.FireExtinguishers]: {
    name: Researches.FireExtinguishers,
    description: 'Those 12VHPWR cables are a fire hazard, makes RTX4090 available',
    gpuUnlock: GPUTypes.RTX4090,
  },
  [Researches.IndustrialGPUs]: {
    name: Researches.IndustrialGPUs,
    description: 'Congrats, you can now buy GPUs by the pallet instead of the piece',
    gpuUnlock: GPUTypes.A6000,
  },
  [Researches.BribeNvidia]: {
    name: Researches.BribeNvidia,
    description: 'Bribe Nvidia for early access to B300',
    gpuUnlock: GPUTypes.B300,
  },
  [Researches.CopyAlexNet]: {
    name: Researches.CopyAlexNet,
    description: 'Clone Alex Krizhevsky\'s github to unlock AlexNet',
    llmUnlock: LLMTypes.ALEXNET,
  },
  [Researches.AttentionPaper]: {
    name: Researches.AttentionPaper,
    description: 'Google did the thinking so we don\'t have to',
    llmUnlock: LLMTypes.GPT1,
  },
  [Researches.CrawlWebText]: {
    name: Researches.CrawlWebText,
    description: 'GPT2 is better than GPT1 mostly because it\'s way bigger',
    llmUnlock: LLMTypes.GPT2,
  },
  [Researches.PirateWholeInternet]: {
    name: Researches.PirateWholeInternet,
    description: 'Stealing from everyone is like stealing from no one',
    llmUnlock: LLMTypes.CHATGPT,
  },
  [Researches.Overclocking]: {
    name: Researches.Overclocking,
    description: 'Push those RTXs till they smoke',
    efficiencyUpgrade: {
      affectedTags: ResourceTypeTags.CONSUMER_GPU,
      efficiencyType: EfficiencyType.ProductionRate,
      efficiency: 0.05,
    }
  },
  [Researches.BulkDiscounts]: {
    name: Researches.BulkDiscounts,
    description: 'Save money on GPUs by buying more GPUs.',
    efficiencyUpgrade: {
      affectedTags: ResourceTypeTags.GPU,
      efficiencyType: EfficiencyType.CostMultiplier,
      efficiency: 0.1,
    }
  },
  [Researches.CopyDeepSeeksHomework]: {
    name: Researches.CopyDeepSeeksHomework,
    description: 'We just happened to figure out everything DeepSeek did, too.',
    efficiencyUpgrade: {
      affectedTags: ResourceTypeTags.LLM,
      efficiencyType: EfficiencyType.CostMultiplier,
      efficiency: 0.15,
    }
  },
  [Researches.AgenticWorkflows]: {
    name: Researches.AgenticWorkflows,
    description: 'Mumble mumble agents mumble',
    efficiencyUpgrade: {
      affectedTags: ResourceTypeTags.LLM,
      efficiencyType: EfficiencyType.ProductionRate,
      efficiency: 0.2,
    }
  }
}

const defaultResearchEntry: ResearchEntry = {
  resource: {
    name: Researches.ScavengeWeb3,
    description: 'placeholder description',
    gpuUnlock: undefined,
    llmUnlock: undefined,
  },
  costType: ResourceType.CASH,
  cost: 0,
  unlock: {
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
    unlock: cashTotalUnlock(1)
  },
  {
    resource: ResearchTypeTable[Researches.FireExtinguishers] || defaultResearchEntry.resource,
    costType: ResourceType.CASH,
    cost: 100,
    unlock: cashSpentUnlock(100)
  },
  {
    resource: ResearchTypeTable[Researches.IndustrialGPUs] || defaultResearchEntry.resource,
    costType: ResourceType.CASH,
    cost: 8000,
    unlock: cashIncomeUnlock(75)
  },
  {
    resource: ResearchTypeTable[Researches.BribeNvidia] || defaultResearchEntry.resource,
    costType: ResourceType.CASH,
    cost: 30000,
    unlock: cashIncomeUnlock(100)
  },
  {
    resource: ResearchTypeTable[Researches.CopyAlexNet] || defaultResearchEntry.resource,
    costType: ResourceType.FLOPS,
    cost: 20,
    unlock: flopsTotalUnlock(5)
  },
  {
    resource: ResearchTypeTable[Researches.AttentionPaper] || defaultResearchEntry.resource,
    costType: ResourceType.CASH,
    cost: 200,
    unlock: flopsSpentUnlock(400)
  },
  {
    resource: ResearchTypeTable[Researches.CrawlWebText] || defaultResearchEntry.resource,
    costType: ResourceType.CASH,
    cost: 10000,
    unlock: flopsIncomeUnlock(250)
  },
  {
    resource: ResearchTypeTable[Researches.PirateWholeInternet] || defaultResearchEntry.resource,
    costType: ResourceType.CASH,
    cost: 50000,
    unlock: flopsIncomeUnlock(300)
  },
  {
    resource: ResearchTypeTable[Researches.Overclocking] || defaultResearchEntry.resource,
    costType: ResourceType.CASH,
    cost: 100,
    unlock: flopsIncomeUnlock(20)
  },
  {
    resource: ResearchTypeTable[Researches.BulkDiscounts] || defaultResearchEntry.resource,
    costType: ResourceType.CASH,
    cost: 200,
    unlock: cashSpentUnlock(500)
  },
  {
    resource: ResearchTypeTable[Researches.CopyDeepSeeksHomework] || defaultResearchEntry.resource,
    costType: ResourceType.CASH,
    cost: 1000,
    unlock: flopsSpentUnlock(1000)
  },
  {
    resource: ResearchTypeTable[Researches.AgenticWorkflows] || defaultResearchEntry.resource,
    costType: ResourceType.CASH,
    cost: 1000,
    unlock: flopsSpentUnlock(2000)
  }
]
import React, { createContext, useReducer, useMemo, useEffect } from 'react';
import Constants from './constants/constants';
import { calcPrice, 
  researchEffectsGenerator, 
  getProductionWithMultiplier, 
  getEfficiencyResearchesOfType 
} from './helpers';
import { 
  ResourceType, 
  StoreEntry, 
  LLMTypes, 
  GPUTypes, 
  Researches, 
  ResearchesTable, 
  ResourceGenerator, 
  ResearchEntry,
  UnlockRequirement,
  ResearchData,
  FeatureFlag,
  EfficiencyType
} from './constants/resources';

const DEBUG: boolean = false;

type OwnedResource = {
  resource: ResourceGenerator;
  count: number;
}

type BuyPayload = {
  entry: StoreEntry;
  count: number;
}

type GameAction = {
  type: string;
  payload?: number | string | BuyPayload | ResearchEntry;
}

type GameState = {
  startupName?: string;
  saveTimer: number;
  cashTotal: number;
  cashRate: number;
  flopsTotal: number;
  flopsRate: number;
  totalCashSpent: number;
  totalFlopSpent: number;
  unlockedGPUs: GPUTypes[];
  unlockedLLMs: LLMTypes[];
  availableResearch: Researches[];
  purchasedResearch: Researches[];
  purchasedFeatures: FeatureFlag[];
  generators: OwnedResource[];
}

const initialState = (): GameState => {
  if (DEBUG) {
    return {
      saveTimer: 0,
      cashTotal: 100000,
      cashRate: 0,
      flopsTotal: 100000,
      flopsRate: 0,
      totalCashSpent: 0,
      totalFlopSpent: 0,
      unlockedGPUs: [],
      unlockedLLMs: [],
      availableResearch: [],
      purchasedResearch: [],
      purchasedFeatures: [],
      generators: [],
    }
  } else {
    return {
      saveTimer: 0,
      cashTotal: Constants.startingCash,
      cashRate: 0,
      flopsTotal: 0,
      flopsRate: 0,
      totalCashSpent: 0,
      totalFlopSpent: 0,
      unlockedGPUs: [],
      unlockedLLMs: [],
      availableResearch: [],
      purchasedResearch: [],
      purchasedFeatures: [],
      generators: [],
    }
  }
}

const ActionTypes = {
  SET_NAME: 'SET_NAME',
  GAME_UPDATE: 'GAME_UPDATE',
  RESET: 'RESET',
  BUY_GPU: 'BUY_GPU',
  BUY_LLM: 'BUY_LLM',
  ADD_CASH: 'ADD_CASH',
  ADD_FLOPS: 'ADD_FLOPS',
  BUY: 'BUY',
  BUY_RESEARCH: 'BUY_RESEARCH',
}

const stateLoader = (initial: GameState): GameState => {
  //console.log("Loading game state from localStorage");
  const savedState = localStorage.getItem('gameState');
  if (savedState) {
    try {
      //console.log('savedState state', savedState);
      return JSON.parse(savedState);
    } catch (error) {
      console.error("Failed to parse saved game state:", error);
    }
  }
  //console.log('initial state', initial);
  return initial;
}

const stateSaver = (state: GameState, action: GameAction): GameState => {
  const result = gameReducer(state, action);
  if (result.saveTimer >= Constants.saveInterval) {
    result.saveTimer -= Constants.saveInterval;
    localStorage.setItem('gameState', JSON.stringify(result));
  }
  return result;
}

const deleteSavedState = () => {
  localStorage.removeItem('gameState');
}

const gameReducer = (state: GameState, action: GameAction): GameState => {
  switch (action.type) {
    case ActionTypes.SET_NAME:
      if (action.payload && typeof action.payload === 'string') {
        return { ...state, startupName: action.payload };
      }
    case ActionTypes.GAME_UPDATE:
      return update(state);
    case ActionTypes.RESET:
      deleteSavedState();
      return { ...initialState() };
    case ActionTypes.ADD_CASH:
      if (action.payload && typeof action.payload === 'number') {
        return { ...state, cashTotal: state.cashTotal + action.payload };
      } else {
        console.log("error: ActionTypes.ADD_FLOPS but no payload or non-number payload");
        return state;
      }
    case ActionTypes.ADD_FLOPS:
      if (action.payload && typeof action.payload === 'number') {
        return { ...state, flopsTotal: state.flopsTotal + action.payload };
      } else {
        console.log("error: ActionTypes.ADD_FLOPS but no payload or non-number payload");
        return state;
      }
    case ActionTypes.BUY:
      if (action.payload && typeof action.payload === 'object' && 'entry' in action.payload && 'count' in action.payload) {
        // console.log(`Purchasing ${action.payload.count} of ${action.payload.entry.resource.name}`);
        return buyResource(state, action.payload.entry, action.payload.count);
      } else {
        console.log("error: ActionTypes.BUY but no payload or non-BuyPayload type");
        return state;
      }
    case ActionTypes.BUY_RESEARCH:
      if (action.payload && typeof action.payload === 'object' && 'cost' in action.payload) {
        return buyResearch(state, action.payload);
      } else {
        console.log("error: ActionTypes.BUY_RESEARCH but no payload or non-ResearchEntry type");
        return state;
      }
    default:
      return state;
  }
}

const setName = (name: string) => ({
  type: ActionTypes.SET_NAME,
  payload: name,
});

const gameUpdate = () => ({
  type: ActionTypes.GAME_UPDATE,
});

const reset = () => ({
  type: ActionTypes.RESET,
});

const addCash = (count: number) => ({
  type: ActionTypes.ADD_CASH,
  payload: count,
});

const addFlops = (count: number) => ({
  type: ActionTypes.ADD_FLOPS,
  payload: count,
});

const buy = (entry: StoreEntry, count: number) => ({
  type: ActionTypes.BUY,
  payload: {
    entry: entry,
    count: count
  },
});

const buyResearchAction = (entry: ResearchEntry) => ({
  type: ActionTypes.BUY_RESEARCH,
  payload: entry
});

const GameStateContext = createContext<GameState>(initialState());
const GameDispatchContext = createContext<React.Dispatch<GameAction>>(() => {});

export const useGameState = () => {
  const context = React.useContext(GameStateContext);
  if (context === undefined) {
    throw new Error('useGameState must be used within a GameStateProvider');
  }
  return context;
}

export const useGameDispatch = () => {
  const dispatch = React.useContext(GameDispatchContext);

  return useMemo(
    () => ({
      setName: (name: string) => dispatch(setName(name)),
      gameUpdate: () => dispatch(gameUpdate()),
      reset: () => dispatch(reset()),
      addCash: (count: number) => dispatch(addCash(count)),
      addFlops: (count: number) => dispatch(addFlops(count)),
      buyResource: (entry: StoreEntry, count: number) => dispatch(buy(entry, count)),
      buyResearch: (entry: ResearchEntry) => dispatch(buyResearchAction(entry)),
    }),
    [dispatch]
  );
}

function update(state: GameState, debugTrace: boolean = false): GameState {
  if (debugTrace) {
    console.log(JSON.stringify(state, null, 2));
  }
  const cashPerTick = state.cashRate * (Constants.tickInterval / 1000);
  const flopsPerTick = state.flopsRate * (Constants.tickInterval / 1000);

  //console.log(`there are ${state.generators.length} generators`);
  const availableResearch: Researches[] = getAvailableResearch(state);

  return {
    ...state,
    saveTimer: state.saveTimer + Constants.tickInterval,
    cashTotal: state.cashTotal + cashPerTick,
    flopsTotal: state.flopsTotal + flopsPerTick,
    availableResearch: availableResearch,
  };
}

// TODO break out different kinds of researches into different functions
const buyResearch = (state: GameState, entry: ResearchEntry): GameState => {
  if (!canAfford(entry.costType, entry.cost, state)) {
    return state;
  }
  let newCash = state.cashTotal;
  let newFlops = state.flopsTotal;
  let cashSpent = state.totalCashSpent;
  let flopsSpent = state.totalFlopSpent;
  switch (entry.costType) {
    case ResourceType.CASH:
      newCash -= entry.cost;
      cashSpent += entry.cost;
      break;
    case ResourceType.FLOPS:
      newFlops -= entry.cost;
      flopsSpent += entry.cost;
      break;
  }
  let researches = state.purchasedResearch;
  researches.push(entry.resource.name);
  let availableResearch = state.availableResearch;
  const index = availableResearch.indexOf(entry.resource.name);
  if (index > -1) {
    availableResearch.splice(index, 1);
  }
  let gpus = state.unlockedGPUs;
  let llms = state.unlockedLLMs;
  if (entry.resource.gpuUnlock) {
    gpus.push(entry.resource.gpuUnlock);
  }
  if (entry.resource.llmUnlock) {
    llms.push(entry.resource.llmUnlock);
  }
  
  let newCashRate = getProductionRate(ResourceType.CASH, state.generators, researches);
  let newFlopsRate = getProductionRate(ResourceType.FLOPS, state.generators, researches);

  let features = state.purchasedFeatures;
  if (entry.resource.featureUnlock) {
    features.push(entry.resource.featureUnlock);
  }

  return {...state, 
    cashTotal: newCash, 
    flopsTotal: newFlops,
    totalCashSpent: cashSpent,
    purchasedResearch: researches, 
    availableResearch: availableResearch, 
    unlockedGPUs: gpus, 
    unlockedLLMs: llms,
    cashRate: newCashRate,
    flopsRate: newFlopsRate,
    purchasedFeatures: features,
  };
}

const canAfford = (costType: ResourceType, cost: number, state: GameState): boolean => {
  switch (costType) {
    case ResourceType.CASH:
      return state.cashTotal >= cost;
    case ResourceType.FLOPS:
      return state.flopsTotal >= cost;
    default:
      console.log("error: unknown cost type", costType);
      return false;
  }
}

const buyResource = (state: GameState, entry: StoreEntry, count: number): GameState => {
  let { cashTotal, flopsTotal, generators, totalCashSpent, totalFlopSpent, purchasedResearch } = state;
  const currCount = getNumberOwned(generators, entry);
  const totalCost = calcPrice(currCount, entry, count, purchasedResearch);

  let newCash = cashTotal;
  let newFlops = flopsTotal;

  switch (entry.costType) {
    case ResourceType.CASH:
      if (cashTotal < totalCost) {
        console.log("error: not enough cash to buy resource");
        return state;
      } else {
        newCash = cashTotal - totalCost;
        totalCashSpent += totalCost;
        // console.log(`spent $${totalCost} cash on ${count} resources, previous count was ${currCount}, new count is ${currCount + count}`);
      }
      break;
    case ResourceType.FLOPS:
      if (flopsTotal < totalCost) {
        console.log("error: not enough flops to buy resource");
        return state;
      } else {
        newFlops = flopsTotal - totalCost;
        totalFlopSpent += totalCost;
      }
      break;
    default:
      console.log("error: unknown cost type", entry.costType);
      return state;
  }

  const result:number = generators.findIndex((g) => g.resource.name == entry.resource.name);
  if (result >= 0) {
    generators[result].count += count;
  } else {
    // console.log("adding new resource to generators");
    generators.push({
      resource: entry.resource,
      count: count,
    });
    // console.log(`generator type count is now ${generators.length}`);
  }

  const newFlopsRate = getProductionRate(ResourceType.FLOPS, generators, purchasedResearch);
  const newCashRate = getProductionRate(ResourceType.CASH, generators, purchasedResearch);
  return { 
        ...state, 
        cashTotal: newCash,
        flopsTotal: newFlops,
        totalCashSpent: totalCashSpent,
        totalFlopSpent: totalFlopSpent,
        cashRate: newCashRate,
        flopsRate: newFlopsRate,
        generators: generators,
      };
}

const getProductionRate = (resourceType: ResourceType, generators: OwnedResource[], purchasedResearch: Researches[]): number => {
  let filteredGenerators = generators.filter((g) => g.resource.generatesType == resourceType);
  let filteredResearch: ResearchData[] = getEfficiencyResearchesOfType(EfficiencyType.ProductionRate, purchasedResearch);

  let totalProduction: number = 0
  for (const generator of filteredGenerators) {
    totalProduction += generator.count * generator.resource.productionRate;
    let productionMultiplier: number = 0;

    productionMultiplier = getProductionMultiplier(generator, filteredResearch);
    totalProduction = getProductionWithMultiplier(totalProduction, productionMultiplier);
  }
  return totalProduction;
}

const getProductionMultiplier = (generator: OwnedResource, filteredResearch: ResearchData[]): number => {
  let productionMultiplier = 0;
  for (const research of filteredResearch) {
    if (researchEffectsGenerator(research, generator.resource) && research.efficiencyUpgrade) {
      productionMultiplier += research.efficiencyUpgrade.efficiency;
    }
  }
  return productionMultiplier;
}

const getNumberOwned = (generators: OwnedResource[], storeEntry: StoreEntry): number => {
  const result = generators.find((g) => g.resource.name == storeEntry.resource.name);
  if (!result) {
    return 0;
  } else {
    return result.count;
  }
}

const getAvailableResearch = (state: GameState): Researches[] => {
  const availableResearch: Researches[] = state.availableResearch;
  for (const research of ResearchesTable) {
    if (availableResearch.includes(research.resource.name)) {
      continue; // already in available research
    }
    if (researchPurchased(research.resource.name, state.purchasedResearch)) {
      continue; // already purchased
    }
    if (!unlockRequirementMet(research.unlockRequirement, state)) {
      continue; // requirements not met
    }
    availableResearch.push(research.resource.name);
  }
  return availableResearch;
};

const researchPurchased = (research: Researches, purchased: Researches[]): boolean => {
  return purchased.includes(research);
}

const hasResources = (resourceType: ResourceType, total: number, state: GameState): boolean => {
  switch (resourceType) {
    case ResourceType.CASH:
      return state.cashTotal >= total;
    case ResourceType.FLOPS:
      return state.flopsTotal >= total;
    default:
      console.log("error: unknown resource type", resourceType);
      return false;
  }
}

const hasProduction = (resourceType: ResourceType, total: number, state: GameState): boolean => {
  switch (resourceType) {
    case ResourceType.CASH:
      return state.cashRate >= total;
    case ResourceType.FLOPS:
      return state.flopsRate >= total;
    default:
      console.log("error: unknown resource type", resourceType);
      return false;
  }
}

const hasSpent = (resourceType: ResourceType, total: number, state: GameState): boolean => {
  switch (resourceType) {
    case ResourceType.CASH:
      return state.totalCashSpent >= total;
    case ResourceType.FLOPS:
      return state.totalFlopSpent >= total;
    default:
      console.log("error: unknown resource type", resourceType);
      return false;
  }
}

const unlockRequirementMet = (requirement: UnlockRequirement, state: GameState): boolean => {
  if (requirement.research && !researchPurchased(requirement.research, state.purchasedResearch)) {
    return false;
  }
  if (requirement.resourceType && requirement.resourceTotal){
    if (!hasResources(requirement.resourceType, requirement.resourceTotal, state)) {
      return false;
    }
  }
  if (requirement.resourceType && requirement.resourceSpent){
    if (!hasSpent(requirement.resourceType, requirement.resourceSpent, state)) {
      return false;
    }
  }
  if (requirement.resourceType && requirement.resourceProduction){
    if (!hasProduction(requirement.resourceType, requirement.resourceProduction, state)) {
      return false;
    }
  }
  return true;
}

type GameStateProps = {
  children: React.ReactNode;
};

export const GameStateProvider = ({ children }: GameStateProps) => {
  const [state, dispatch] = useReducer(stateSaver, initialState(), stateLoader);

  const tick = () => {
    dispatch(gameUpdate());
  }

  useEffect(() => {
    // console.log("hello, world");
  	const updateTimer = setInterval(tick, Constants.tickInterval);
  	return () => {
      clearInterval(updateTimer);
  	};
  }, []);

  return (
    <GameStateContext.Provider value={state}>
      <GameDispatchContext.Provider value={dispatch}>
        {children}
      </GameDispatchContext.Provider>
    </GameStateContext.Provider>
  );
}
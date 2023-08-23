import { Agent, AgentsDictionary, AgentType, NumberAgent, SumAgent } from "./agent"

export type InteractionRule = {
    sourceType: AgentType,
    targetType: AgentType,
    action: (source: Agent, target: Agent, agents: AgentsDictionary) => any
}


export const sumInteractionRule: InteractionRule = {
    sourceType: 'SUM',
    targetType: 'NUMBER',
    action: (source, target, agentsMap) => {
        if (source.type === 'SUM' && target.type === 'NUMBER') {
            const currentValue = (source as SumAgent).value;
            const targetValue = (target as NumberAgent).value;
            const result = currentValue + targetValue;
            const newConnectionsList = source.auxiliaryPorts.filter(s => s === target.id);
            const newSumAget: SumAgent = {
                ...source,
                type: "SUM",
                value: result,
                auxiliaryPorts: newConnectionsList,
            }
            agentsMap[source.id] = newSumAget;
        }
    }
}

export const incrementInteractionRule: InteractionRule = {
    sourceType: 'INC',
    targetType: 'NUMBER',
    action: (source, target, agentsMap) => {
        if (source.type === 'INC' && target.type === 'NUMBER') {
            const result = (target as NumberAgent).value + 1;
        }
    }
}
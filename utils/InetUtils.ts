
import { uniqueId } from "lodash";
import { AgentsDictionary, Agent, AgentType } from "../data/models/agent";
import { Connection } from "../data/models/connection";
import { InteractionRule } from "../data/models/interaction-rule";

export async function applyInteractionRules(rules: InteractionRule[], agentsMap: AgentsDictionary) {

    const agents = { ...agentsMap };
    const steps: AgentsDictionary[] = [agents];

    for (const agentId in agents) {
        const agent = agents[agentId];
        console.log('Agent selected ', agent.id)
        rules.forEach(r => {
            console.log('rule selected', r.sourceType);
            if (r.sourceType === agent.type) {
                console.log('Running rule', r.sourceType);
                console.log('Auxilary ports ', agent.auxiliaryPorts.length)

                agent.auxiliaryPorts.forEach(targetId => {
                    const target = agents[targetId];
                    if (target && r.targetType === target.type) {
                        console.log('Applying rule ', agent.label, target.label)
                        r.action(agent, target, agents);
                    }
                })
            }

        });

    };
    return {agents,steps};
}

function getRandomCordinate() {
    return Math.random() * 500;
}

const MAX_ALLOWED_PORTS: {
    [id: string]: number
} = {
    'ADD': 2,
    'SUB': 2,
    'MUL': 2,
    'DIV': 2,
    'SUM': 100,
    'INC': 1,
    'NUMBER': 1
}

export function generateAgent(type: AgentType, value: number = 0, x: number = getRandomCordinate(), y: number = getRandomCordinate()): Agent {
    return {
        id: uniqueId(),
        value: type === 'NUMBER' ? Math.floor(Math.random() * 100) : type==='MUL'?1:0,
        maxAllowedPorts: MAX_ALLOWED_PORTS[type] || 0,
        label: type,
        x,
        y,
        type,
        auxiliaryPorts: [],
        transformationCount:0
    }
}

export function generateTransformedAgent<T>(type: AgentType, value: number = 0,oldAgent:Agent):T{
    return {
        ...oldAgent,
        type,
        value,
        transformationCount:oldAgent.transformationCount+1
    } as T;
}

export function generateConnections(agents: AgentsDictionary): Connection[] {

    const connections: Connection[] = [];

    for (const agentId in agents) {

        const sourceAgent = agents[agentId];
        if (sourceAgent.auxiliaryPorts.length > 0) {
            for (const targetID of sourceAgent.auxiliaryPorts) {

            }
        }
    }
    return connections;
}
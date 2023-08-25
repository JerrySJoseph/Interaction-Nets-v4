
import { uniqueId } from "lodash";
import { AgentsDictionary, Agent, AgentType } from "../data/models/agent";
import { Connection } from "../data/models/connection";
import { InteractionRule } from "../data/models/interaction-rule";
import { InteractionNetState } from "../data/context/workspace-context";

export async function applyInteractionRules(rules: InteractionRule[], inetState: InteractionNetState) {

    const agents = { ...inetState.agents };
    const steps: InteractionNetState[] = [inetState];


    for (const agentId in agents) {
        const agent = agents[agentId];
        console.log('Agent selected ', agent.id);
        if (agent.type === 'NUMBER')
            continue;

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
                        steps.push({ ...inetState });
                    }
                })
            }

        });

        const principalID=agent.principalPort;
        const principalAgent=principalID?agents[principalID]:undefined;
        if(principalAgent){
            rules.forEach(r=>{
                if(r.sourceType===agent.type && r.targetType===principalAgent.type && r.principalAction){
                    r.principalAction(agent,principalAgent,agents);
                    steps.push({...inetState});
                }
            })
        }
        

    };
    return { agents, steps };
}

function getRandomCordinate() {
    return Math.random() * 500;
}

const MAX_ALLOWED_PORTS: {
    [id: string]: number
} = {
    'ADD': 100,
    'SUB': 200,
    'MUL': 200,
    'DIV': 200,
    'SUM': 100,
    'INC': 1,
    'NUMBER': 1,
    'EQUALS':2,
    'NOT_EQUALS':2,
    'LESS_THAN':2,
    'GREATER_THAN':2,
    'LESS_THAN_EQUALS':2,
    'GREATER_THAN_EQUALS':2
}

const DENIED_CONNECTIONS: {
    [id: string]: AgentType[]|string[]
} = {
    'ADD': [],
    'SUB': [],
    'MUL': [],
    'DIV': [],
    'SUM': [],
    'INC': [],
    'NUMBER': [],
    'COUNT_AUX_PORT': ['ANY']
}

export function generateAgent(type: AgentType, value: number = 0, x: number = getRandomCordinate(), y: number = getRandomCordinate()): Agent {
    return {
        id: uniqueId(),
        value: value || type === 'NUMBER' ? Math.floor(Math.random() * 100) : type === 'MUL' ? 1 : 0,
        maxAllowedPorts: MAX_ALLOWED_PORTS[type] || 0,
        label: type.substring(0,6),
        x,
        y,
        type,
        auxiliaryPorts: [],
        transformationCount: 0,
        deniedAgents: DENIED_CONNECTIONS[type]
    }
}

export function generateTransformedAgent<T extends Agent>(type: AgentType, value: number|boolean =0, oldAgent: Agent): T {
    return {
        ...oldAgent,
        type,
        value,
        transformationCount: oldAgent.transformationCount + 1,
        label:'Result'
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
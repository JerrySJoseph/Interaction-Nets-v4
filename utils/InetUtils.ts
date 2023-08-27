
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
        // console.log('Agent selected ', agent.id);
        if (agent.type === 'NUMBER')
            continue;


        const principalID = agent.principalPort;
        const principalAgent = principalID ? agents[principalID] : undefined;


        if (principalAgent) {


            //rewrite rules for p2p
            rules.forEach(r => {
                let done=false;
                if ((r.sourceType === agent.type && r.targetType === principalAgent.type) && !done) {
                        console.log('applying rewrite rule 1')
                    r.rewrite && r.rewrite(agent, principalAgent, agents);
                    done=true;                   
                }
                else if((r.sourceType === agent.type && r.targetType=='ANY') && !done){
                    console.log('applying rewrite rule 2')
                    r.rewrite && r.rewrite(agent, principalAgent, agents);
                    done=true;
                }
                
                steps.push({ ...inetState });
            })

        }


    };
    return { agents, steps };
}

export async function compute(rules: InteractionRule[], inetState: InteractionNetState) {

    const agents = { ...inetState.agents };
    const steps: InteractionNetState[] = [inetState];

    for (const agentId in agents) {
        const agent = agents[agentId];
        // console.log('Agent selected ', agent.id);
        if (agent.type === 'NUMBER')
            continue;

        const principalID = agent.principalPort;
        const principalAgent = principalID ? agents[principalID] : undefined;

        if (principalAgent) {
            /// rewrite rules for p2any
            rules.forEach(r => {
                if (r.sourceType === agent.type && r.targetType === principalAgent.type && r.principalAction) {
                    r.principalAction(agent, principalAgent, agents);
                    steps.push({ ...inetState });
                }
            });
        }



        rules.forEach(r => {
            // console.log('rule selected', r.sourceType);
            if (r.sourceType === agent.type) {
                //  console.log('Running rule', r.sourceType);
                //  console.log('Auxilary ports ', agent.auxiliaryPorts.length)

                agent.auxiliaryPorts.forEach(targetId => {
                    const target = agents[targetId];
                    if (target && r.targetType === target.type) {
                        //  console.log('Applying rule ', agent.label, target.label)
                        r.action(agent, target, agents);
                        steps.push({ ...inetState });
                    }
                })
            }

        });
    }
    return { agents }
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
    'SUCC': 1,
    'INC': 1,
    'NUMBER': 1,
    'EQUALS': 2,
    'NOT_EQUALS': 2,
    'LESS_THAN': 2,
    'GREATER_THAN': 2,
    'LESS_THAN_EQUALS': 2,
    'GREATER_THAN_EQUALS': 2,
    'DUPLICATE': 2,
    'CONST': 2,
    'ERASE': 1
}
const SYMBOLS: {
    [id: string]: string
} = {
    'ADD': '+',
    'SUB': '-',
    'MUL': '*',
    'DIV': '/',
    'SUCC': 'S',
    'NUMBER': 'N',
    'EQUALS': '=',
    'NOT_EQUALS': '!=',
    'LESS_THAN': '<',
    'GREATER_THAN': '>',
    'LESS_THAN_EQUALS': '<=',
    'GREATER_THAN_EQUALS': '>=',
    'DUPLICATE': 'd',
    'CONST': 'c',
    'ERASE': 'e'
}
const DENIED_CONNECTIONS: {
    [id: string]: AgentType[] | string[]
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

    const id = uniqueId();

    return {
        id,
        value: value || type === 'NUMBER' ? Math.floor(Math.random() * 100) : type === 'MUL' ? 1 : 0,
        arity: MAX_ALLOWED_PORTS[type] || 0,
        label: `${type} #${id}`,
        x,
        y,
        type,
        symbol: SYMBOLS[type],
        auxiliaryPorts: [],
        transformationCount: 0,
        deniedAgents: DENIED_CONNECTIONS[type] || ['ANY']
    }
}

export function generateTransformedAgent<T extends Agent>(type: AgentType, value: number | boolean = 0, oldAgent: Agent): T {
    return {
        ...oldAgent,
        type,
        value,
        transformationCount: oldAgent.transformationCount + 1,
        label: `${type} #${oldAgent.id}`
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
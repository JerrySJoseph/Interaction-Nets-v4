
import { uniqueId } from "lodash";
import { AgentsDictionary, Agent, AgentType } from "../data/models/agent";
import { Connection } from "../data/models/connection";
import { InteractionRule } from "../data/models/interaction-rule";

export function applyInteractionRules(rules: InteractionRule[], agents: AgentsDictionary) {
    for (const agentId in agents) {
        const agent = agents[agentId];

        //check for an interaction partner through the principal port
        const partnerId = agent.principalPort;
        if (!partnerId) continue;

        const partner = agents[partnerId];
        if (!partner) continue;


        // find a matching rule to apply
        const rule = rules.find(r => (
            (r.sourceType === agent.type && r.targetType === partner.type) ||
            (r.sourceType === partner.type && r.targetType === agent.type)
        ));

        if (rule) {
            rule.action(agent, partner, agents);
        }
    }
}

function getRandomCordinate() {
    return Math.random() * 500;
}

export function generateAgent(type: AgentType, value: number = 0, x: number = getRandomCordinate(), y: number = getRandomCordinate()): Agent {
    return {
        id: uniqueId(),
        value,
        label:type,
        x,
        y,
        type,
        auxiliaryPorts: []
    }
}

export function generateConnections(agents:AgentsDictionary):Connection[]{
    
    const connections:Connection[]=[];

    for(const agentId in agents){
        
        const sourceAgent=agents[agentId];
        if(sourceAgent.auxiliaryPorts.length>0){
            for(const targetID of sourceAgent.auxiliaryPorts){

            }
        }
    }
    return connections;
}
import { Agent, AgentsDictionary, AgentType, NumberAgent, SumAgent } from "./agent"

export type InteractionRule = {
    sourceType: AgentType,
    targetType: AgentType,
    action: (source: Agent, target: Agent, agents: AgentsDictionary) => any
}


export const AddInteractionRule: InteractionRule = {
    sourceType: 'ADD',
    targetType: 'NUMBER',
    action: (source, target, agents) => {
        if (source.auxiliaryPorts.includes(target.id)) {
            // Summing the value of the number agent to the sum agent
            source.value += target.value;
            console.log('add value:',source.value,'[',target.value,'/',source.value,']');

            // Removing the number agent from the auxiliary ports list
            source.auxiliaryPorts = source.auxiliaryPorts.filter(id => id !== target.id);

            // Removing the number agent from the dictionary (effectively "consuming" it)
            delete agents[target.id];

            //if all the auxilary ports are deleted, replace the sum agent with a Number agent
            if(source.auxiliaryPorts.length===0){
                console.log('replacing the node with number node')
                const numberAgent:NumberAgent={
                    ...source,
                    type:'NUMBER'
                }
                agents[source.id]=numberAgent;
            }
        }
    }
}

export const MultiplicationInteractionRule: InteractionRule = {
    sourceType: 'MUL',
    targetType: 'NUMBER',
    action: (source, target, agents) => {
        if (source.auxiliaryPorts.includes(target.id)) {
            // Summing the value of the number agent to the sum agent
            source.value *= target.value;
            console.log('smul value:',source.value,'[',target.value,'/',source.value,']');
            // Removing the number agent from the auxiliary ports list
            source.auxiliaryPorts = source.auxiliaryPorts.filter(id => id !== target.id);

            // Removing the number agent from the dictionary (effectively "consuming" it)
            delete agents[target.id];

            //if all the auxilary ports are deleted, replace the sum agent with a Number agent
            if(source.auxiliaryPorts.length===0){
                console.log('replacing the node with number node')
                const numberAgent:NumberAgent={
                    ...source,
                    type:'NUMBER'
                }
                agents[source.id]=numberAgent;
            }
        }
    }
}

export const SubtractInteractionRule: InteractionRule = {
    sourceType: 'SUB',
    targetType: 'NUMBER',
    action: (source, target, agents) => {
        if (source.auxiliaryPorts.includes(target.id)) {
            // Summing the value of the number agent to the sum agent
            source.value -= target.value;
            console.log('sub value:',source.value,'[',target.value,'/',source.value,']');
            // Removing the number agent from the auxiliary ports list
            source.auxiliaryPorts = source.auxiliaryPorts.filter(id => id !== target.id);

            // Removing the number agent from the dictionary (effectively "consuming" it)
            delete agents[target.id];

            //if all the auxilary ports are deleted, replace the sum agent with a Number agent
            if(source.auxiliaryPorts.length===0){
                console.log('replacing the node with number node')
                const numberAgent:NumberAgent={
                    ...source,
                    type:'NUMBER'
                }
                agents[source.id]=numberAgent;
            }
        }
    }
}

export const DivideInteractionRule: InteractionRule = {
    sourceType: 'DIV',
    targetType: 'NUMBER',
    action: (source, target, agents) => {
        // Summing the value of the number agent to the sum agent
        if(source.value===0){
            source.value=target.value;
        }
        else
            source.value=source.value/target.value;
      
        // Removing the number agent from the auxiliary ports list
        source.auxiliaryPorts = source.auxiliaryPorts.filter(id => id !== target.id);

        // Removing the number agent from the dictionary (effectively "consuming" it)
        delete agents[target.id];

        //if all the auxilary ports are deleted, replace the sum agent with a Number agent
        if(source.auxiliaryPorts.length===0){
            console.log('replacing the node with number node')
            const numberAgent:NumberAgent={
                ...source,
                type:'NUMBER'
            }
            agents[source.id]=numberAgent;
        }
    }
}

export const incrementInteractionRule: InteractionRule = {
    sourceType: 'INC',
    targetType: 'NUMBER',
    action: (source, target) => {
        if (source.type === 'INC' && target.type === 'NUMBER') {
            const result = (target as NumberAgent).value + 1;
        }
    }
}
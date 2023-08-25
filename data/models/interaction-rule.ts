import { generateTransformedAgent } from "../../utils/InetUtils";
import { Agent, AgentsDictionary, AgentType, NumberAgent } from "./agent"

export type InteractionRule = {
    sourceType: AgentType,
    targetType: AgentType,
    principalAction?:(source: Agent, target: Agent, agents: AgentsDictionary) => any
    action: (source: Agent, target: Agent, agents: AgentsDictionary) => any
}


export const AddInteractionRule: InteractionRule = {
    sourceType: 'ADD',
    targetType: 'NUMBER',
    action: (source, target, agents) => {
        if (source.auxiliaryPorts.includes(target.id)) {
            // Summing the value of the number agent to the sum agent
            
            source.value += target.value;

            // Removing the number agent from the auxiliary ports list
            source.auxiliaryPorts = source.auxiliaryPorts.filter(id => id !== target.id);

            // Removing the number agent from the dictionary (effectively "consuming" it)
            delete agents[target.id];

            //if all the auxilary ports are deleted, replace the sum agent with a Number agent
            if(source.auxiliaryPorts.length===0){
                const numberAgent:NumberAgent=generateTransformedAgent<NumberAgent>('NUMBER',source.value,source);
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
           
            // Removing the number agent from the auxiliary ports list
            source.auxiliaryPorts = source.auxiliaryPorts.filter(id => id !== target.id);

            // Removing the number agent from the dictionary (effectively "consuming" it)
            delete agents[target.id];

            //if all the auxilary ports are deleted, replace the sum agent with a Number agent
            if(source.auxiliaryPorts.length===0){
               
                const numberAgent:NumberAgent=generateTransformedAgent<NumberAgent>('NUMBER',source.value,source);
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
           
            // Removing the number agent from the auxiliary ports list
            source.auxiliaryPorts = source.auxiliaryPorts.filter(id => id !== target.id);

            // Removing the number agent from the dictionary (effectively "consuming" it)
            delete agents[target.id];

            //if all the auxilary ports are deleted, replace the sum agent with a Number agent
            if(source.auxiliaryPorts.length===0){
              
                const numberAgent:NumberAgent=generateTransformedAgent<NumberAgent>('NUMBER',source.value,source);
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
           
            const numberAgent:NumberAgent=generateTransformedAgent<NumberAgent>('NUMBER',source.value,source);
            agents[source.id]=numberAgent;
        }
    }
}


export const CountAuxPortInteractionRule:InteractionRule={
    sourceType: 'COUNT_AUX_PORT',
    targetType: 'NUMBER',
    principalAction:(source,target,agents)=>{
        if(source.type==='COUNT_AUX_PORT' && source.principalPort && agents[source.principalPort]){
            const targetAgent=agents[source.principalPort];
            const result=targetAgent.auxiliaryPorts.length;
            const resultNode:NumberAgent=generateTransformedAgent('NUMBER',result,{...source});
            agents[resultNode.id]=resultNode;
        }
    },
    action(source, target, agents) {
       //NO operation
    },
}

export const EqualsInteractionRule:InteractionRule={
    sourceType: 'EQUALS',
    targetType: 'NUMBER',
    principalAction:(source,target,agents)=>{
        
    },
    action(source, target, agents) {
       //NO operation
    },
}
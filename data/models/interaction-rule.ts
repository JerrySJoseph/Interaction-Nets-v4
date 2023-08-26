import { generateTransformedAgent } from "../../utils/InetUtils";
import { Agent, AgentsDictionary, AgentType, BooleanAgent, EqualsAgent, NumberAgent } from "./agent"

export type InteractionRule = {
    sourceType: AgentType,
    targetType: AgentType,
    principalAction?: (source: Agent, target: Agent, agents: AgentsDictionary) => any
    action: (source: Agent, target: Agent, agents: AgentsDictionary) => any
}


export const AddInteractionRule: InteractionRule = {
    sourceType: 'ADD',
    targetType: 'NUMBER',
    principalAction:(source,target,agents)=>{
        if(source.type!=='ADD' || !source.principalPort) return;
        const principalAgent=agents[source.principalPort];
        source.value=principalAgent.value;
        agents[source.id]=source;
    },
    action: (source, target, agents) => {
        if(source.type!=='ADD' || target.type!=='NUMBER') return;

        const resultAgent=generateTransformedAgent('NUMBER',source.value+target.value,{...source})
        resultAgent.principalPort=undefined;
        resultAgent.auxiliaryPorts=[];
        delete agents[target.id]
        source.principalPort && delete agents[source.principalPort]
        agents[source.id]=resultAgent;
    }
}

export const MultiplicationInteractionRule: InteractionRule = {
    sourceType: 'MUL',
    targetType: 'NUMBER',
    principalAction:(source,target,agents)=>{
        if(source.type!=='MUL' || !source.principalPort) return;
        const principalAgent=agents[source.principalPort];
        source.value=principalAgent.value;
        agents[source.id]=source;
    },
    action: (source, target, agents) => {
        if(source.type!=='MUL' || target.type!=='NUMBER') return;

        const resultAgent=generateTransformedAgent('NUMBER',source.value*target.value,{...source})
        resultAgent.principalPort=undefined;
        resultAgent.auxiliaryPorts=[];
        delete agents[target.id]
        source.principalPort && delete agents[source.principalPort]
        agents[source.id]=resultAgent;
    }
}

export const SubtractInteractionRule: InteractionRule = {
    sourceType: 'SUB',
    targetType: 'NUMBER',
    principalAction:(source,target,agents)=>{
        if(source.type!=='SUB' || !source.principalPort) return;
        const principalAgent=agents[source.principalPort];
        source.value=principalAgent.value;
        agents[source.id]=source;
    },
    action: (source, target, agents) => {
        if(source.type!=='SUB' || target.type!=='NUMBER') return;

        const resultAgent=generateTransformedAgent('NUMBER',source.value-target.value,{...source})
        resultAgent.principalPort=undefined;
        resultAgent.auxiliaryPorts=[];
        delete agents[target.id]
        source.principalPort && delete agents[source.principalPort]
        agents[source.id]=resultAgent;
    }
}

export const DivideInteractionRule: InteractionRule = {
    sourceType: 'DIV',
    targetType: 'NUMBER',
    principalAction:(source,target,agents)=>{
        if(source.type!=='DIV' || !source.principalPort) return;
        const principalAgent=agents[source.principalPort];
        source.value=principalAgent.value;
        agents[source.id]=source;
    },
    action: (source, target, agents) => {
        if(source.type!=='DIV' || target.type!=='NUMBER') return;

        const resultAgent=generateTransformedAgent('NUMBER',target.value/source.value,{...source})
        resultAgent.principalPort=undefined;
        resultAgent.auxiliaryPorts=[];
        delete agents[target.id]
        source.principalPort && delete agents[source.principalPort]
        agents[source.id]=resultAgent;
    }
}


export const EqualsInteractionRule: InteractionRule = {
    sourceType: 'EQUALS',
    targetType: 'NUMBER',
    principalAction: (source, target, agents) => {
        if(source.type!=='EQUALS' || !source.principalPort) return;
        const principalAgent=agents[source.principalPort];
        source.value=principalAgent.value;
        agents[source.id]=source;
    },
    action(source, target, agents) {
       if(source.type!=='EQUALS' || target.type!=='NUMBER') return;
       const resultAgent=generateTransformedAgent<BooleanAgent>('BOOL',source.value===target.value,{...source});
       resultAgent.boolValue=source.value===target.value;
       resultAgent.principalPort=undefined;
       resultAgent.auxiliaryPorts=[];
       delete agents[target.id];
       source.principalPort && delete agents[source.principalPort];
       agents[source.id]=resultAgent;
    },
}


export const NotEqualsInteractionRule: InteractionRule = {
    sourceType: 'NOT_EQUALS',
    targetType: 'NUMBER',
    principalAction: (source, target, agents) => {
        if(source.type!=='NOT_EQUALS' || !source.principalPort) return;
        const principalAgent=agents[source.principalPort];
        source.value=principalAgent.value;
        agents[source.id]=source;
    },
    action(source, target, agents) {
       if(source.type!=='NOT_EQUALS' || target.type!=='NUMBER') return;
       const resultAgent=generateTransformedAgent<BooleanAgent>('BOOL',source.value!==target.value,{...source});
       resultAgent.boolValue=source.value!==target.value;
       resultAgent.principalPort=undefined;
       resultAgent.auxiliaryPorts=[];
       delete agents[target.id];
       source.principalPort && delete agents[source.principalPort];
       agents[source.id]=resultAgent;
    },
}


export const LessThanInteractionRule: InteractionRule = {
    sourceType: 'LESS_THAN',
    targetType: 'NUMBER',
    principalAction: (source, target, agents) => {
        if(source.type!=='LESS_THAN' || !source.principalPort) return;
        const principalAgent=agents[source.principalPort];
        source.value=principalAgent.value;
        agents[source.id]=source;
    },
    action(source, target, agents) {
       if(source.type!=='LESS_THAN' || target.type!=='NUMBER') return;
       const resultAgent=generateTransformedAgent<BooleanAgent>('BOOL',source.value<target.value,{...source});
       resultAgent.boolValue=source.value<target.value;
       resultAgent.principalPort=undefined;
       resultAgent.auxiliaryPorts=[];
       delete agents[target.id];
       source.principalPort && delete agents[source.principalPort];
       agents[source.id]=resultAgent;
    },
}


export const GreaterThanInteractionRule: InteractionRule = {
    sourceType: 'GREATER_THAN',
    targetType: 'NUMBER',
    principalAction: (source, target, agents) => {
        if(source.type!=='GREATER_THAN' || !source.principalPort) return;
        const principalAgent=agents[source.principalPort];
        source.value=principalAgent.value;
        agents[source.id]=source;
    },
    action(source, target, agents) {
       if(source.type!=='GREATER_THAN' || target.type!=='NUMBER') return;
       const resultAgent=generateTransformedAgent<BooleanAgent>('BOOL',source.value>target.value,{...source});
       resultAgent.boolValue=source.value>target.value;
       resultAgent.principalPort=undefined;
       resultAgent.auxiliaryPorts=[];
       delete agents[target.id];
       source.principalPort && delete agents[source.principalPort];
       agents[source.id]=resultAgent;
    },
}


export const LessThanEqualsInteractionRule: InteractionRule = {
    sourceType: 'LESS_THAN_EQUALS',
    targetType: 'NUMBER',
    principalAction: (source, target, agents) => {
        if(source.type!=='LESS_THAN_EQUALS' || !source.principalPort) return;
        const principalAgent=agents[source.principalPort];
        source.value=principalAgent.value;
        agents[source.id]=source;
    },
    action(source, target, agents) {
       if(source.type!=='LESS_THAN_EQUALS' || target.type!=='NUMBER') return;
       const resultAgent=generateTransformedAgent<BooleanAgent>('BOOL',source.value<=target.value,{...source});
       resultAgent.boolValue=source.value!==target.value;
       resultAgent.principalPort=undefined;
       resultAgent.auxiliaryPorts=[];
       delete agents[target.id];
       source.principalPort && delete agents[source.principalPort];
       agents[source.id]=resultAgent;
    },
}


export const GreaterTHanEqualsInteractionRule: InteractionRule = {
    sourceType: 'GREATER_THAN_EQUALS',
    targetType: 'NUMBER',
    principalAction: (source, target, agents) => {
        if(source.type!=='GREATER_THAN_EQUALS' || !source.principalPort) return;
        const principalAgent=agents[source.principalPort];
        source.value=principalAgent.value;
        agents[source.id]=source;
    },
    action(source, target, agents) {
       if(source.type!=='GREATER_THAN_EQUALS' || target.type!=='NUMBER') return;
       const resultAgent=generateTransformedAgent<BooleanAgent>('BOOL',source.value>=target.value,{...source});
       resultAgent.boolValue=source.value!==target.value;
       resultAgent.principalPort=undefined;
       resultAgent.auxiliaryPorts=[];
       delete agents[target.id];
       source.principalPort && delete agents[source.principalPort];
       agents[source.id]=resultAgent;
    },
}

export const SuccessorInteractionRule: InteractionRule = {
    sourceType: 'SUCC',
    targetType: 'NUMBER',
    principalAction:(source, target, agents)=>{
        const resultAgent=generateTransformedAgent('NUMBER',target.value+1,{...source});
        delete agents[target.id];
        //resultAgent.auxiliaryPorts=[];
        resultAgent.principalPort=undefined;
        agents[source.id]=resultAgent;

    },
    action: (source, target, agents) => {

        // source.value = target.value + 1;

        // source.auxiliaryPorts = []
        // // Removing the number agent from the dictionary (effectively "consuming" it)
        // delete agents[target.id];

        // const numberAgent: NumberAgent = generateTransformedAgent<NumberAgent>('NUMBER', source.value, source);
        // agents[source.id] = numberAgent;
    }
}
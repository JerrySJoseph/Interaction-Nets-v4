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
    action: (source, target, agents) => {
        if (source.auxiliaryPorts.includes(target.id)) {
            // Summing the value of the number agent to the sum agent

            source.value += target.value;

            // Removing the number agent from the auxiliary ports list
            source.auxiliaryPorts = source.auxiliaryPorts.filter(id => id !== target.id);

            // Removing the number agent from the dictionary (effectively "consuming" it)
            delete agents[target.id];

            //if all the auxilary ports are deleted, replace the sum agent with a Number agent
            if (source.auxiliaryPorts.length === 0) {
                const numberAgent: NumberAgent = generateTransformedAgent<NumberAgent>('NUMBER', source.value, source);
                agents[source.id] = numberAgent;
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
            if (source.auxiliaryPorts.length === 0) {

                const numberAgent: NumberAgent = generateTransformedAgent<NumberAgent>('NUMBER', source.value, source);
                agents[source.id] = numberAgent;
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
            if (source.auxiliaryPorts.length === 0) {

                const numberAgent: NumberAgent = generateTransformedAgent<NumberAgent>('NUMBER', source.value, source);
                agents[source.id] = numberAgent;
            }
        }
    }
}

export const DivideInteractionRule: InteractionRule = {
    sourceType: 'DIV',
    targetType: 'NUMBER',
    action: (source, target, agents) => {
        // Summing the value of the number agent to the sum agent
        if (source.value === 0) {
            source.value = target.value;
        }
        else
            source.value = source.value / target.value;

        // Removing the number agent from the auxiliary ports list
        source.auxiliaryPorts = source.auxiliaryPorts.filter(id => id !== target.id);

        // Removing the number agent from the dictionary (effectively "consuming" it)
        delete agents[target.id];

        //if all the auxilary ports are deleted, replace the sum agent with a Number agent
        if (source.auxiliaryPorts.length === 0) {

            const numberAgent: NumberAgent = generateTransformedAgent<NumberAgent>('NUMBER', source.value, source);
            agents[source.id] = numberAgent;
        }
    }
}


export const CountAuxPortInteractionRule: InteractionRule = {
    sourceType: 'COUNT_AUX_PORT',
    targetType: 'NUMBER',
    principalAction: (source, target, agents) => {
        if (source.type === 'COUNT_AUX_PORT' && source.principalPort && agents[source.principalPort]) {
            const targetAgent = agents[source.principalPort];
            const result = targetAgent.auxiliaryPorts.length;
            const resultNode: NumberAgent = generateTransformedAgent('NUMBER', result, { ...source });
            agents[resultNode.id] = resultNode;
        }
    },
    action(source, target, agents) {
        //NO operation
    },
}

export const EqualsInteractionRule: InteractionRule = {
    sourceType: 'EQUALS',
    targetType: 'NUMBER',
    principalAction: (source, target, agents) => {

    },
    action(_source, target, agents) {
        const source = _source as EqualsAgent
        if (source.value === 0) {
            source.boolValue = true;
            source.value = target.value;
        }
        else {
            source.boolValue = target.value === source.value;            
        }
        delete agents[target.id];
        source.auxiliaryPorts=source.auxiliaryPorts.filter(id=>id!=target.id);
        if(source.auxiliaryPorts.length==0){
            const resultAgent=generateTransformedAgent<BooleanAgent>('BOOL',source.boolValue,{...source});
            agents[source.id]=resultAgent;
            console.log(agents[source.id])
        }
    },
}


export const NotEqualsInteractionRule: InteractionRule = {
    sourceType: 'NOT_EQUALS',
    targetType: 'NUMBER',
    principalAction: (source, target, agents) => {

    },
    action(_source, target, agents) {
        const source = _source as EqualsAgent
        if (source.value === 0) {
            source.boolValue = true;
            source.value = target.value;
        }
        else {
            source.boolValue = target.value !== source.value;            
        }
        delete agents[target.id];
        source.auxiliaryPorts=source.auxiliaryPorts.filter(id=>id!=target.id);
        if(source.auxiliaryPorts.length==0){
            const resultAgent=generateTransformedAgent<BooleanAgent>('BOOL',source.boolValue,{...source});
            agents[source.id]=resultAgent;
            console.log(agents[source.id])
        }
    },
}


export const LessThanInteractionRule: InteractionRule = {
    sourceType: 'LESS_THAN',
    targetType: 'NUMBER',
    principalAction: (source, target, agents) => {

    },
    action(_source, target, agents) {
        const source = _source as EqualsAgent
        if (source.value === 0) {
            source.boolValue = true;
            source.value = target.value;
        }
        else {
            source.boolValue = target.value > source.value;            
        }
        delete agents[target.id];
        source.auxiliaryPorts=source.auxiliaryPorts.filter(id=>id!=target.id);
        if(source.auxiliaryPorts.length==0){
            const resultAgent=generateTransformedAgent<BooleanAgent>('BOOL',source.boolValue,{...source});
            agents[source.id]=resultAgent;
            console.log(agents[source.id])
        }
    },
}


export const GreaterThanInteractionRule: InteractionRule = {
    sourceType: 'GREATER_THAN',
    targetType: 'NUMBER',
    principalAction: (source, target, agents) => {

    },
    action(_source, target, agents) {
        const source = _source as EqualsAgent
        if (source.value === 0) {
            source.boolValue = true;
            source.value = target.value;
        }
        else {
            source.boolValue = target.value <source.value;            
        }
        delete agents[target.id];
        source.auxiliaryPorts=source.auxiliaryPorts.filter(id=>id!=target.id);
        if(source.auxiliaryPorts.length==0){
            const resultAgent=generateTransformedAgent<BooleanAgent>('BOOL',source.boolValue,{...source});
            agents[source.id]=resultAgent;
            console.log(agents[source.id])
        }
    },
}


export const LessThanEqualsInteractionRule: InteractionRule = {
    sourceType: 'LESS_THAN_EQUALS',
    targetType: 'NUMBER',
    principalAction: (source, target, agents) => {

    },
    action(_source, target, agents) {
        const source = _source as EqualsAgent
        if (source.value === 0) {
            source.boolValue = true;
            source.value = target.value;
        }
        else {
            source.boolValue = target.value >= source.value;            
        }
        delete agents[target.id];
        source.auxiliaryPorts=source.auxiliaryPorts.filter(id=>id!=target.id);
        if(source.auxiliaryPorts.length==0){
            const resultAgent=generateTransformedAgent<BooleanAgent>('BOOL',source.boolValue,{...source});
            agents[source.id]=resultAgent;
            console.log(agents[source.id])
        }
    },
}


export const GreaterTHanEqualsInteractionRule: InteractionRule = {
    sourceType: 'GREATER_THAN_EQUALS',
    targetType: 'NUMBER',
    principalAction: (source, target, agents) => {

    },
    action(_source, target, agents) {
        const source = _source as EqualsAgent
        if (source.value === 0) {
            source.boolValue = true;
            source.value = target.value;
        }
        else {
            source.boolValue = target.value <= source.value;            
        }
        delete agents[target.id];
        source.auxiliaryPorts=source.auxiliaryPorts.filter(id=>id!=target.id);
        if(source.auxiliaryPorts.length==0){
            const resultAgent=generateTransformedAgent<BooleanAgent>('BOOL',source.boolValue,{...source});
            agents[source.id]=resultAgent;
            console.log(agents[source.id])
        }
    },
}
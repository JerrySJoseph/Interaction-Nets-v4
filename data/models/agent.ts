export interface Agent {
    id: string,
    type: AgentType,
    maxAllowedPorts: number
    principalPort?: string | null
    auxiliaryPorts: string[],
    value: number,
    label: string,
    description?: string
    x: number,
    y: number,
    transformationCount: number,
    deniedAgents: AgentType[]|string[]
}

export interface NumberAgent extends Agent {
    type: 'NUMBER',
    allowEdit?: boolean
};

export interface SumAgent extends Agent {
    type: 'SUM';
}

export interface IncrementAgent extends Agent {
    type: 'INC';
}

export interface BooleanAgent extends Agent {
    type: 'BOOL',
    boolValue:boolean;
}

export type CountAuxPortAgent = {
    type: 'COUNT_AUX_PORT'
}

export type AgentType = 'ANY'|'NUMBER' | 'ADD' | 'SUB' | 'MUL' | 'DIV' | 'SUM' | 'INC' | 'BOOL' | 'COUNT_AUX_PORT'|'EQUALS';

export type AgentsDictionary = {
    [agentId: string]: Agent;
}


export type InteractionNetLibrary = {
    [label: string]: AgentsDictionary
}



export function isAgentType(variable: any): variable is AgentType {
    return (
        variable === 'NUMBER' ||
        variable === 'ADD' ||
        variable === 'SUB' ||
        variable === 'MUL' ||
        variable === 'DIV' ||
        variable === 'SUM' ||
        variable === 'INC' ||
        variable === 'BOOL' ||
        variable === 'COUNT_AUX_PORT'
    );
}
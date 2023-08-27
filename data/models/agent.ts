export interface Agent {
    id: string,
    type: AgentType,
    arity: number
    principalPort?: string | null
    auxiliaryPorts: string[],
    value: number,
    label: string,
    description?: string
    x: number,
    symbol:string,
    y: number,
    transformationCount: number,
    deniedAgents: AgentType[]|string[]
}

export interface NumberAgent extends Agent {
    type: 'NUMBER',
    allowEdit?: boolean
};


export interface BooleanAgent extends Agent {
    type: 'BOOL',
    boolValue:boolean;
}

export interface EqualsAgent extends Agent {
    type: 'BOOL',
    boolValue:boolean;
}
export interface NotEqualsAgent extends Agent {
    type: 'NOT_EQUALS',
    boolValue:boolean;
}

export type CountAuxPortAgent = {
    type: 'COUNT_AUX_PORT'
}

export type ArrayAgent={
    type:'ARRAY'
    dimensions:number
}

type ArrayElement={
    index:number,
    value:number
}

export type AgentType = 'ANY'|'NUMBER' | 'ADD' | 'SUB' | 'MUL' | 'DIV' | 'BOOL' | 'COUNT_AUX_PORT'|'EQUALS'|'NOT_EQUALS'|
'GREATER_THAN'|'LESS_THAN'|'GREATER_THAN_EQUALS'|'LESS_THAN_EQUALS'|'ARRAY'|'SUCC'|'DUPLICATE'|'CONST'|'ERASE';



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
        variable === 'BOOL' ||
        variable === 'COUNT_AUX_PORT'||
        variable === 'EQUALS' ||
        variable === 'NOT_EQUALS' ||
        variable === 'LESS_THAN_EQUALS' ||
        variable === 'GREATER_THAN_EQUALS' ||
        variable === 'LESS_THAN' ||
        variable === 'GREATER_THAN' ||
        variable === 'ARRAY'||
        variable === 'SUCC' ||
        variable === 'DUPLICATE' ||
        variable === 'CONST' ||
        variable === 'ERASE'
        
    );
}
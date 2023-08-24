export interface Agent{
    id: string,
    type: AgentType,
    maxAllowedPorts:number
    principalPort?: string | null
    auxiliaryPorts: string[],
    value:number,
    label:string,
    description?:string
    x:number,
    y:number
}


export interface NumberAgent extends Agent{
    type: 'NUMBER';
};


export interface SumAgent extends Agent{
    type: 'SUM';
}

export interface IncrementAgent extends Agent{
    type: 'INC';    
}

export type AgentType='NUMBER'|'ADD'|'SUB'|'MUL'|'DIV'|'SUM'|'INC'|'COMPARATOR';

export type AgentsDictionary = {
    [agentId: string]: Agent;
}

export function isAgentType(variable: any): variable is AgentType {
    return (
        variable === 'NUMBER' ||
        variable === 'ADD' ||
        variable === 'SUB' ||
        variable === 'MUL' ||
        variable === 'DIV' ||
        variable === 'SUM' ||
        variable === 'INC'
    );
}
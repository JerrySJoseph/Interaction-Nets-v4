export type Agent = {
    id: string,
    type: string,
    principalPort: string | null
    auxiliaryPorts: string[];
} | NumberAgent

type NumberAgent = {
    id: string;
    type: 'Number';
    value: number;
    principalPort: string | null;
};
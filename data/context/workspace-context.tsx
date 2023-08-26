
import { MantineColor } from "@mantine/core";
import { createContext, useContext, useEffect, useState } from "react";
import { applyInteractionRules } from "../../utils/InetUtils";
import { Agent, AgentsDictionary } from "../models/agent";
import { Connection } from "../models/connection";
import { AddInteractionRule, DivideInteractionRule, EqualsInteractionRule, GreaterTHanEqualsInteractionRule, InteractionRule, LessThanEqualsInteractionRule, LessThanInteractionRule, MultiplicationInteractionRule, NotEqualsInteractionRule, SubtractInteractionRule, SuccessorInteractionRule } from "../models/interaction-rule";

export type InteractionNetState = {
    agents: AgentsDictionary,
    connections: Connection[]
}

export type AlertType = { color: MantineColor, message: string }

interface WorkspaceContextProps {
    currentTool: {
        toolID: string,
        setCurrentTool: (string: string) => any
    },
    currentInetState: {
        inetState: InteractionNetState,
        setInetState: (inet: InteractionNetState) => any,
        moveNode: (x: number, y: number, id: string) => any,
        updateAgent: (agent: Agent) => any,
        deleteAgent: (agentId: string) => any,
        connectAgent: (source: string, target: string) => any,
        removeConnection: (source: string, target: string) => any,
        connectPrincipal: (source: string, target: string) => any
    },

    currentInetRules: {
        inetRules: InteractionRule[],
        setInetRules: (inetRules: InteractionRule[]) => any
    },
    history: {
        inetStates: InteractionNetState[],
        allowUndo: boolean,
        performUndo: () => any,
        currentStateIndex: number
    },
    controls: {
        alert: AlertType | null
        reduce: () => any,
        reducing: boolean
    }

}

const defaultWorkspaceContext: WorkspaceContextProps = {
    currentTool: {
        toolID: '',
        setCurrentTool: () => { }
    },
    currentInetState: {
        inetState: {
            agents: {},
            connections: []
        },
        setInetState: () => { },
        moveNode: () => { },
        updateAgent: () => { },
        deleteAgent: () => { },
        connectAgent: () => { },
        removeConnection: () => { },
        connectPrincipal: () => { }
    },
    currentInetRules: {
        inetRules: [],
        setInetRules: () => { }
    },
    history: {
        inetStates: [],
        allowUndo: true,
        performUndo: () => { },
        currentStateIndex: 0
    },
    controls: {
        alert: null,
        reduce: () => { },
        reducing: false
    }
}

export const WorkspaceContext = createContext<WorkspaceContextProps>(defaultWorkspaceContext)

export const useWorkspace = () => useContext(WorkspaceContext)

interface WorkspaceContextProviderProps {
    children?: React.ReactNode
}

export const WorkspaceContextProvider = ({ children }: WorkspaceContextProviderProps) => {

    const [reducing, setReducing] = useState(false);
    const [currentTool, setCurrentTool] = useState<string>('DRAG');
    const [inetRules, setInetRules] = useState<InteractionRule[]>([]);
    const [inetState, setInetState] = useState<InteractionNetState>({
        agents: {},
        connections: []
    })
    const [previousInetStates, setPreviousInetStates] = useState<InteractionNetState[]>([]);
    const [currentStateIndex, setCurrentStateIndex] = useState(-1);
    const [alert, setAlert] = useState<AlertType | null>(null);

    useEffect(() => {
        const timeout = setTimeout(() => setAlert(null), 3000);
        return () => clearTimeout(timeout);
    }, [alert])


    useEffect(() => {
        setInetRules([AddInteractionRule, SubtractInteractionRule, MultiplicationInteractionRule, DivideInteractionRule,
             EqualsInteractionRule, NotEqualsInteractionRule, LessThanEqualsInteractionRule, GreaterTHanEqualsInteractionRule,
            LessThanInteractionRule, GreaterTHanEqualsInteractionRule,
            SuccessorInteractionRule])
    }, []);

  


    function performUndo() {
        setInetState(previousInetStates[currentStateIndex - 1]);
    }



    function connectAgent(source: string, target: string) {
        const inetCopy = { ...inetState };
        const sourceAgent = inetCopy.agents[source];
        const targetAgent = inetCopy.agents[target];

        //if not either of node exists
        if (!targetAgent || !sourceAgent)
            return;


        try {

            // if source is a number type
            if (targetAgent.type === 'NUMBER')
                throw new Error('Cannot connect Number as a target type to Any agent. Try connecting any other Number to this agent');

            if (targetAgent.arity-1 <= targetAgent.auxiliaryPorts.length)
                throw new Error(`${targetAgent.type} has reached max arity limit (${targetAgent.arity-1}).`)

            // connection already exists
            if (targetAgent.auxiliaryPorts.includes(target))
                throw new Error('Connection already exists');

            if (targetAgent.type === 'COUNT_AUX_PORT') {
                throw new Error('COUNT Agent cannot be connected through aux ports to any other agents')
            }

            // if target node doesn't allow this type of node connection
            if (sourceAgent.deniedAgents.length > 0 && !sourceAgent.deniedAgents.includes('ANY') && sourceAgent.deniedAgents.includes(targetAgent.type)) {
                throw new Error('Connection not allowed. ' + sourceAgent.type + ' cannot accepts connections from ' + sourceAgent.deniedAgents.join(', '));
            }

            //save the connection if everything works out.
            targetAgent.auxiliaryPorts.push(source);
           console.log(targetAgent);
            setInetState(inetCopy);
        } catch (error) {
           // throw error;
            setAlert({
                color: 'red',
                message: (error as Error).message
            })
        }

    }

    function removeConnection(source: string, target: string) {
        const inetCopy = { ...inetState };
        let index = -1;
        const sourceAgent = inetCopy.agents[source];
        const targetAgent = inetCopy.agents[target]
        if (sourceAgent && targetAgent) {
            //if it is a principal link
            if (sourceAgent.principalPort === target)
                sourceAgent.principalPort = undefined;
            else if ((index = sourceAgent.auxiliaryPorts.findIndex(item => target === item)) > -1) {
                sourceAgent.auxiliaryPorts.splice(index, 1);
            }

        }
        setInetState(inetCopy);
    }

    function connectPrincipal(source: string, target: string) {

        const inetCopy = { ...inetState };
        const sourceAgent = inetCopy.agents[source];
        const targetAgent = inetCopy.agents[target]

        if (!sourceAgent || !targetAgent)
            return;

        sourceAgent.principalPort = target;
        setInetState(inetCopy);
    }

    async function reduce() {
        try {

            setReducing(true)
            const { agents, steps } = await applyInteractionRules(inetRules, inetState);
            setInetState({ ...inetState, agents: { ...agents } });
            setPreviousInetStates([...previousInetStates, ...steps])
            setCurrentStateIndex(steps.length - 1)

        } catch (e) {
            setAlert({
                color: 'red',
                message: (e as Error).message
            })
        } finally {
            setReducing(false);
        }
    }

    const value: WorkspaceContextProps = {
        currentTool: {
            toolID: currentTool,
            setCurrentTool
        },
        currentInetState: {
            inetState,
            setInetState,
            moveNode: (x, y, id) => {
                setInetState(prevState => ({
                    ...prevState,
                    agents: {
                        ...prevState.agents,
                        [id]: {
                            ...prevState.agents[id],
                            x,
                            y
                        }
                    }
                }))

            },
            updateAgent: (ag) => {
                setInetState(prevState => ({
                    ...prevState,
                    agents: {
                        ...prevState.agents,
                        [ag.id]: {
                            ...ag
                        }
                    }
                }))

            },
            deleteAgent: (id: string) => {
                const inetCopy = { ...inetState };
                delete inetCopy.agents[id];
                setInetState(inetCopy);

            },
            connectAgent,
            removeConnection,
            connectPrincipal
        },
        currentInetRules: {
            inetRules,
            setInetRules
        },
        history: {
            inetStates: previousInetStates,
            allowUndo: true,
            performUndo,
            currentStateIndex
        },
        controls: {
            alert,
            reduce,
            reducing
        }
    };

    return <WorkspaceContext.Provider value={value}>

        {children}
    </WorkspaceContext.Provider>
}

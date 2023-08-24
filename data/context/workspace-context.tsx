
import { createContext, useContext, useEffect, useState } from "react";
import { applyInteractionRules, generateAgent } from "../../utils/InetUtils";
import { Agent, AgentsDictionary } from "../models/agent";
import { Connection } from "../models/connection";
import { AddInteractionRule, DivideInteractionRule, InteractionRule, MultiplicationInteractionRule, SubtractInteractionRule, SumInteractionRule } from "../models/interaction-rule";

type InteractionNetState = {
    agents: AgentsDictionary,
    connections: Connection[]
}

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

    const [connector, setConnector] = useState<{ source: string, target: string }>({
        source: '',
        target: ''
    })


    useEffect(() => {
        setInetRules([SumInteractionRule, AddInteractionRule, SubtractInteractionRule, MultiplicationInteractionRule, DivideInteractionRule])
    }, []);

    useEffect(()=>{
        console.log(previousInetStates);
    },[previousInetStates])


    function performUndo() {
        setInetState(previousInetStates[currentStateIndex-1]);
    }



    function connectAgent(source: string, target: string) {
        const inetCopy = { ...inetState };
        const sourceAgent = inetCopy.agents[source];

        if (!sourceAgent)
            return;

        console

        if (sourceAgent.auxiliaryPorts.length >= sourceAgent.maxAllowedPorts)
            throw new Error(`${sourceAgent.type} can only accept ${sourceAgent.maxAllowedPorts} auxiliary connections.`);

        if (sourceAgent && sourceAgent.type !== 'NUMBER' && !sourceAgent.auxiliaryPorts.includes(target)) {
            sourceAgent.auxiliaryPorts.push(target);
        }

        if (sourceAgent && sourceAgent.type === 'NUMBER' && sourceAgent.principalPort !== target) {
            sourceAgent.principalPort = target;
        }
        setInetState(inetCopy);
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
        if (sourceAgent && targetAgent && targetAgent.type !== 'NUMBER') {
            sourceAgent.principalPort = target;
        }
    }

    async function reduce() {
        try {

            setReducing(true)
            const { agents, steps } = await applyInteractionRules(inetRules, inetState.agents);

            setInetState({ ...inetState, agents: { ...agents } });
            setPreviousInetStates([...steps.map(s=>({agents:s,connections:[]}))]);
            setCurrentStateIndex(steps.length-1)

        } catch (e) {
            alert(e)
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
            reduce,
            reducing
        }
    };

    return <WorkspaceContext.Provider value={value}>
        {children}
    </WorkspaceContext.Provider>
}

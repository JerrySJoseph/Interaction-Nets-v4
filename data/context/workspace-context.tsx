
import { createContext, useContext, useEffect, useState } from "react";
import { generateAgent } from "../../utils/InetUtils";
import { Agent, AgentsDictionary } from "../models/agent";
import { Connection } from "../models/connection";
import { InteractionRule } from "../models/interaction-rule";

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
        connectAgent:(source:string,target:string)=>any,
        removeConnection:(source:string,target:string)=>any
    },

    currentInetRules: {
        inetRules: InteractionRule[],
        setInetRules: (inetRules: InteractionRule[]) => any
    },
    history: {
        inetStates: InteractionNetState[],
        allowUndo: boolean,
        performUndo: () => any
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
        connectAgent:()=>{},
        removeConnection:()=>{}
    },
    currentInetRules: {
        inetRules: [],
        setInetRules: () => { }
    },
    history: {
        inetStates: [],
        allowUndo: true,
        performUndo: () => { }
    }
}

export const WorkspaceContext = createContext<WorkspaceContextProps>(defaultWorkspaceContext)

export const useWorkspace = () => useContext(WorkspaceContext)

interface WorkspaceContextProviderProps {
    children?: React.ReactNode
}

export const WorkspaceContextProvider = ({ children }: WorkspaceContextProviderProps) => {

    const [currentTool, setCurrentTool] = useState<string>('DRAG');
    const [inetRules, setInetRules] = useState<InteractionRule[]>([]);
    const [inetState, setInetState] = useState<InteractionNetState>({
        agents: {},
        connections: []
    })
    const [previousInetStates, setPreviousInetStates] = useState<InteractionNetState[]>([]);

    const [connector, setConnector] = useState<{ source: string, target: string }>({
        source: '',
        target: ''
    })


    useEffect(() => {
        const addAgent = generateAgent('ADD');
        const subAgent = generateAgent('SUB');
        const num1 = generateAgent('NUMBER', 98);
        const num3 = generateAgent('NUMBER', 345);
        const num4 = generateAgent('NUMBER', 234);
        const num5 = generateAgent('NUMBER');

        addAgent.auxiliaryPorts = [num1.id, num3.id, num4.id, num5.id]
        addAgent.principalPort = subAgent.id



        setInetState(prevState => ({
            ...prevState,
            agents: {
                [addAgent.id]: addAgent,
                [num1.id]: num1,
                [num3.id]: num3,
                [num4.id]: num4,
                [num5.id]: num5,
                [subAgent.id]: subAgent
            }
        }))
        if (previousInetStates.length === 0)
            saveInetHistory();
    }, []);


    function performUndo() {
        setInetState(previousInetStates[previousInetStates.length - 1]);
        previousInetStates.pop();
        setPreviousInetStates(previousInetStates);
    }

    function saveInetHistory() {
        setPreviousInetStates([
            ...previousInetStates,
            inetState
        ])
    }

    function connectAgent(source:string,target:string){
        const inetCopy={...inetState};
        const sourceAgent=inetCopy.agents[source];
        if(sourceAgent && sourceAgent.type!=='NUMBER' && !sourceAgent.auxiliaryPorts.includes(target)){
            sourceAgent.auxiliaryPorts.push(target);
        }
        setInetState(inetCopy);
    }

    function removeConnection(source:string,target:string){
        const inetCopy={...inetState};
        let index=-1;
        const sourceAgent=inetCopy.agents[source];
        const targetAgent=inetCopy.agents[target]
        if(sourceAgent && targetAgent ){
            //if it is a principal link
            if(sourceAgent.principalPort===target)
                sourceAgent.principalPort=undefined;
            else if((index=sourceAgent.auxiliaryPorts.findIndex(item=>target===item))>-1){
                sourceAgent.auxiliaryPorts.splice(index,1);
            }

        }
        setInetState(inetCopy);
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
                saveInetHistory();
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
                saveInetHistory();
            },
            deleteAgent: (id: string) => {
                const inetCopy = { ...inetState };
                delete inetCopy.agents[id];
                setInetState(inetCopy);
                saveInetHistory();
            },
            connectAgent,
            removeConnection
        },
        currentInetRules: {
            inetRules,
            setInetRules
        },
        history: {
            inetStates: previousInetStates,
            allowUndo: true,
            performUndo
        }
    };

    return <WorkspaceContext.Provider value={value}>
        {children}
    </WorkspaceContext.Provider>
}

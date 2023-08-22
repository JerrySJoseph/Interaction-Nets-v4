
import { createContext, useContext, useEffect, useState } from "react";
import AppLayout from "../../ui/layouts/applayout/AppLayout"
import { Agent } from "../models/agent";

type AgentsDictionary = {
    [agentId: string]: Agent;
}

interface AppContextProps {
    agents: AgentsDictionary
}

const defaultAppContext: AppContextProps = {
    agents:{}
}

export const AppContext = createContext<AppContextProps>(defaultAppContext)

export const useAppContext = () => useContext(AppContext)

interface AppContextProviderProps {
    children?: React.ReactNode
}

export const AppContextProvider = ({ children }: AppContextProviderProps) => {


    const [agents,setAgents]=useState<AgentsDictionary>({})

    const value: AppContextProps = {
        agents
    };

    return <AppContext.Provider value={value}>
        <AppLayout>
            {children}
        </AppLayout>
    </AppContext.Provider>
}

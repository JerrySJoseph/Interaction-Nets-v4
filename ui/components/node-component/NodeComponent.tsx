import { Button, Divider, Group, Modal, NumberInput, Stack, Text, TextInput, useMantineColorScheme, useMantineTheme } from '@mantine/core';
import { debounce } from 'lodash';
import React, { Ref, RefObject, useState } from 'react';
import { Agent } from '../../../data/models/agent';
import Draggable from '../Draggable/Draggable';
import { IconCheck, IconTrash, IconAbc } from '@tabler/icons-react'
import { useWorkspace } from '../../../data/context/workspace-context';
import { AgentColors } from '../../../utils/theme';

interface NodeComponentProps {
    agent: Agent,
    canvasRef?: RefObject<HTMLDivElement>
    dragDisabled?: boolean,
    thumbnail?: boolean
    debounceMs?: number,
    onMove?: (posX: number, posY: number, agentId: string) => any,
    onClick?:(agent:Agent)=>any,
    enableHighlight?:boolean
}

const NodeComponent = (props: NodeComponentProps) => {

    const { agent, onMove = () => { }, dragDisabled = false, thumbnail = false,onClick=()=>{} } = props;

    const debouncedOnMove = debounce(onMove, props.debounceMs);


    const { colorScheme } = useMantineColorScheme();
    const { toolID } = useWorkspace().currentTool;



    const getClass = () => {
        if (agent.type === 'NUMBER')
            return 'node-constant';
        return 'node-operator';
    }



    if (thumbnail) {
        return <div className={`node ${getClass()} ${props.enableHighlight && 'node-highlighted'} node-thumbnail`} id={agent.id} style={{ backgroundColor: AgentColors[agent.type], borderColor: colorScheme === 'dark' ? 'white' : 'black' }}>
            <Text size='sm' fw={500} truncate>{agent.type === 'NUMBER' ? agent.value : agent.label}</Text>
        </div>
    }

    

    return (
        <>
            <Draggable x={agent.x} y={agent.y} onDrag={(x, y) => debouncedOnMove(x, y, props.agent.id)} containerRef={props.canvasRef} dragDisabled={dragDisabled || thumbnail} >
                
                <div className={`node ${getClass()} ${'node-highlighted'}`} id={agent.id} style={{
                    
                    backgroundColor: AgentColors[agent.type],
                    borderColor: colorScheme === 'dark' ? 'white' : 'black',
                    cursor: toolID === 'DRAG' ? 'move' : ['AUX_LINK','PRINCIPAL_LINK'].includes(toolID)?'pointer':'default'
                
                }} 
                onClick={()=>onClick(agent)}
                >
                    <Text size='sm' fw={500} truncate>{agent.type === 'NUMBER' ? agent.value : `${agent.label}(${agent.value})`}</Text>
                </div>
            </Draggable>

        </>
    );
}

export default NodeComponent
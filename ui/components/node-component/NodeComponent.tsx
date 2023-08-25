import { Button, Divider, Group, Modal, NumberInput, Stack, Text, TextInput, useMantineColorScheme, useMantineTheme } from '@mantine/core';
import { debounce } from 'lodash';
import React, { Ref, RefObject, useEffect, useState } from 'react';
import { Agent } from '../../../data/models/agent';
import Draggable from '../Draggable/Draggable';
import { IconCheck, IconTrash, IconAbc } from '@tabler/icons-react'
import { useWorkspace } from '../../../data/context/workspace-context';
import { AgentColors } from '../../../utils/theme';
import { CSSTransition } from 'react-transition-group'
import { useTimeout } from 'usehooks-ts';

interface NodeComponentProps {
    agent: Agent,
    canvasRef?: RefObject<HTMLDivElement>
    dragDisabled?: boolean,
    thumbnail?: boolean
    debounceMs?: number,
    onMove?: (posX: number, posY: number, agentId: string) => any,
    onClick?: (agent: Agent) => any,
    enableHighlight?: boolean
}

const NodeComponent = (props: NodeComponentProps) => {

    const { agent, onMove = () => { }, dragDisabled = false, thumbnail = false, onClick = () => { } } = props;

    const debouncedOnMove = debounce(onMove, props.debounceMs);


    const { colorScheme } = useMantineColorScheme();
    const { toolID } = useWorkspace().currentTool;

    const [visible, setVisible] = useState(false);
    const [changeCount,setChangeCount]=useState(0);

    useEffect(() => {
        setVisible(true);
        setChangeCount(agent.transformationCount);
    }, [agent.transformationCount])


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
            <CSSTransition in={changeCount===agent.transformationCount} timeout={400} classNames="node" onEntered={() => setVisible(true)} onExited={() => setVisible(false)} mountOnEnter unmountOnExit>
                <Draggable x={agent.x} y={agent.y} onDrag={(x, y) => debouncedOnMove(x, y, props.agent.id)} containerRef={props.canvasRef} dragDisabled={dragDisabled || thumbnail} >

                    <div className={`node ${getClass()} ${'node-highlighted'}`} id={agent.id} style={{

                        backgroundColor: AgentColors[agent.type],
                        borderColor: colorScheme === 'dark' ? 'white' : 'black',
                        cursor: toolID === 'DRAG' ? 'move' : ['AUX_LINK', 'PRINCIPAL_LINK'].includes(toolID) ? 'pointer' : 'default',
                        color:'white'

                    }}
                        onClick={() => onClick(agent)}
                    >
                        <Text size='sm' fw={700} truncate>{agent.type==='NUMBER'?agent.value:agent.label}</Text>
                       
                    </div>

                </Draggable>
            </CSSTransition>


        </>
    );
}

export default NodeComponent
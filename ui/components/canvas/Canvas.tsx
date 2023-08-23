import { Card } from '@mantine/core';
import React, { useEffect, useRef, useState } from 'react';
import { useWorkspace } from '../../../data/context/workspace-context';
import { Agent, isAgentType } from '../../../data/models/agent';
import { generateAgent } from '../../../utils/InetUtils';
import LinkComponent from '../link-component/LinkComponent';
import NodeComponent from '../node-component/NodeComponent';
import PrincipalLinkComponent from '../principal-link-component/PrincipalLinkComponent';

const Canvas = () => {
    const { inetState, moveNode, updateAgent, connectAgent } = useWorkspace().currentInetState;

    const { toolID } = useWorkspace().currentTool;

    const canvasRef = useRef<HTMLDivElement>(null);

    const [connectorSrc, setconnectorSrc] = useState<string>('');

    const [mouseCordinates, setMouseCordinates] = useState<{ x: number, y: number }>({
        x: 0, y: 0
    })

    useEffect(() => {
        if (canvasRef.current) {
            const rect = canvasRef.current.getBoundingClientRect();
            console.log(rect);
        }
    }, [canvasRef]);

    let target;


    function handleOnClick(e: React.MouseEvent) {
        e.stopPropagation();
        e.preventDefault();
        if (toolID == '')
            return;

        //get tbe target element
        const targetElement = e.target as Element;
        const rect = targetElement.getBoundingClientRect();

        const x = e.clientX - rect.left - 20; // x position within the element
        const y = e.clientY - rect.top - 20;  // y position within the element
        if (isAgentType(toolID)) {
            updateAgent(generateAgent(toolID, 0, x, y));
        }
        if (connectorSrc)
            setconnectorSrc('');
    }

    function handleOnNodeClick(agent: Agent) {
        if (toolID === 'AUX_LINK') {
            if (!connectorSrc)
                setconnectorSrc(agent.id)
            else {
                connectAgent(connectorSrc, agent.id);
                setconnectorSrc('')
            }

        }
    }

    function handleMouseMove(e: MouseEvent) {
        //get tbe target element
        if (!canvasRef.current)
            return;
        const targetElement = canvasRef.current;
        const rect = targetElement.getBoundingClientRect();

        const x = e.clientX - rect.left - 20; // x position within the element
        const y = e.clientY - rect.top - 20;
        setMouseCordinates({ x, y });
    }

    useEffect(() => {
        window.addEventListener('mousemove', handleMouseMove);
        return () => {
            window.removeEventListener('mousemove', handleMouseMove);
        }
    }, [])

    return (
        <div className="canvas-container">
            <Card className='canvas-controls' withBorder><></></Card>
            <div className="canvas-spacing"></div>
            <div ref={canvasRef} className="canvas" onClick={handleOnClick}

                style={{
                    cursor: ['NUMBER', 'ADD', 'SUM', 'MUL', 'DIV', 'SUB'].includes(toolID) ? 'crosshair' : 'default'
                }}

            >
                {
                    Object.keys(inetState.agents).map(ak => (
                        <NodeComponent key={ak} agent={inetState.agents[ak]} canvasRef={canvasRef} onMove={moveNode} dragDisabled={toolID !== 'DRAG'} onClick={handleOnNodeClick} />
                    ))

                }
                {
                    Object.keys(inetState.agents).map(ak => (
                        <>
                            {
                                inetState.agents[ak].auxiliaryPorts.map(lk => {
                                    const source = inetState.agents[ak];
                                    const target = inetState.agents[lk];
                                    if (!source || !target)
                                        return <></>
                                    return <LinkComponent key={`${ak}-${lk}`} x1={source.x} y1={source.y} x2={target.x} y2={target.y} source={source.id} target={target.id} />
                                })
                            }
                            {(target = inetState.agents[ak].principalPort) && inetState.agents[target] &&
                                <PrincipalLinkComponent x1={inetState.agents[ak].x} y1={inetState.agents[ak].y} x2={inetState.agents[target].x} y2={inetState.agents[target].y} />
                            }

                        </>
                    ))

                }
                {
                    connectorSrc && <LinkComponent x1={inetState.agents[connectorSrc].x} y1={inetState.agents[connectorSrc].y} x2={mouseCordinates.x} y2={mouseCordinates.y} feedback />
                }
            </div>
        </div>
    )
}

export default Canvas
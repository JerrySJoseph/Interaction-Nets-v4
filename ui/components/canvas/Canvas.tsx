import React, { useEffect, useRef } from 'react';
import { useWorkspace } from '../../../data/context/workspace-context';
import { generateAgent } from '../../../utils/InetUtils';
import LinkComponent from '../link-component/LinkComponent';
import NodeComponent from '../node-component/NodeComponent';
import PrincipalLinkComponent from '../principal-link-component/PrincipalLinkComponent';

const Canvas = () => {
    const { inetState, moveNode, updateAgent } = useWorkspace().currentInetState;

    const { toolID } = useWorkspace().currentTool;

    const canvasRef = useRef<HTMLDivElement>(null);

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
        if (toolID === 'NUMBER') {
            updateAgent(generateAgent('NUMBER', 0, x, y));
        }
    }

    return (
        <div ref={canvasRef} className="canvas" onClick={handleOnClick}>
            {
                Object.keys(inetState.agents).map(ak => (
                    <NodeComponent key={ak} agent={inetState.agents[ak]} canvasRef={canvasRef} onMove={moveNode} />
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
                                return <LinkComponent key={`${ak}-${lk}`} x1={source.x} y1={source.y} x2={target.x} y2={target.y} />
                            })
                        }
                        {(target = inetState.agents[ak].principalPort) && inetState.agents[target] &&
                            <PrincipalLinkComponent x1={inetState.agents[ak].x} y1={inetState.agents[ak].y} x2={inetState.agents[target].x} y2={inetState.agents[target].y} />
                        }

                    </>
                ))

            }
        </div>
    )
}

export default Canvas
import { useMantineTheme } from "@mantine/core";
import { useWorkspace } from "../../../data/context/workspace-context";

interface PrincipalLinkComponentProps {
    x1: number,
    y1: number,
    x2: number,
    y2: number,
    source?: string,
    target?: string,
    onClick?:()=>any
}

const PrincipalLinkComponent = ({ x1, x2, y1, y2 ,source,target,onClick=()=>{}}: PrincipalLinkComponentProps) => {
    const xOffset = 23;
    const yOffset = 20;

    // Calculate the midpoint of the line
    const mx = (x1 + x2) / 2;
    const my = (y1 + y2) / 2;

    const { colorScheme } = useMantineTheme();
    

    // Calculate the direction (angle) of the arrow
    const angle = Math.atan2(y2 - y1, x2 - x1) * (180 / Math.PI);

    return (
        <svg style={{ position: 'absolute', top: 0, left: 0, width: '100%', height: '100%' }} onClick={onClick}>
            <line x1={x1 + xOffset} y1={y1 + yOffset} x2={x2 + xOffset} y2={y2 + yOffset} stroke={colorScheme === 'dark' ? 'white' : 'black'} strokeWidth="3" />

            {/* Draw the arrowhead in the middle of the line */}

            {/* Draw the arrowhead in the middle of the line */}
            <polygon
                points="0,-5 10,0 0,5"
                transform={`translate(${mx + xOffset}, ${my + yOffset}) rotate(${angle})`}
                fill={colorScheme === 'dark' ? 'white' : 'black'}
            />
        </svg>
    )
}

export default PrincipalLinkComponent;

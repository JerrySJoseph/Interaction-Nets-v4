import { useMantineColorScheme, useMantineTheme } from "@mantine/core";

interface LinkComponentProps {
    x1: number,
    y1: number,
    x2: number,
    y2: number,
    index?: number,
    feedback?: boolean,
    source?: string,
    target?: string
}

const LinkComponent = ({ x1, x2, y1, y2, index }: LinkComponentProps) => {

    const xOffset = 30;
    const yOffset = 20;

    // Calculate the midpoint of the line
    const mx = (x1 + x2) / 2;
    const my = (y1 + y2) / 2;

    const { colorScheme, primaryColor } = useMantineTheme();

    // Calculate the direction (angle) of the arrow
    const angle = Math.atan2(y2 - y1, x2 - x1) * (180 / Math.PI);
    const circleX = mx + xOffset;
    const circleY = my + yOffset;

    return (
        <svg style={{ position: 'absolute', top: 0, left: 0, width: '100%', height: '100%', pointerEvents: 'none' }}>
            <line x1={x1 + xOffset} y1={y1 + yOffset} x2={x2 + xOffset} y2={y2 + yOffset} stroke={colorScheme === 'dark' ? 'white' : 'black'} strokeWidth="1" />



            {/* Draw the arrowhead in the middle of the line */}
            <polygon
                points="0,-5 10,0 0,5"
                transform={`translate(${mx + xOffset}, ${my + yOffset}) rotate(${angle})`}
                fill={colorScheme === 'dark' ? 'white' : 'black'}
            />

            {/* Display the circle with the number */}

            {
                index && <>
                    <circle
                        cx={circleX}
                        cy={circleY}
                        r="10" // Adjust the radius as needed
                        fill={colorScheme === "dark" ? "white" : "black"}
                    />
                    <text
                        x={circleX}
                        y={circleY}
                        textAnchor="middle"
                        dominantBaseline="middle"
                        fill={colorScheme === "dark" ? "black" : "white"}
                        fontSize="10"
                    >
                        {index}
                    </text>
                </>
            }


        </svg>
    )
}

export default LinkComponent
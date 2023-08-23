import { useMantineColorScheme } from "@mantine/core";

interface LinkComponentProps {
    x1: number,
    y1: number,
    x2: number,
    y2: number
  }
  
  const LinkComponent = ({ x1, x2, y1, y2 }: LinkComponentProps) => {
  
    const xOffset=20;
    const yOffset=20;  

    const {colorScheme}=useMantineColorScheme();

    return (
      <svg style={{ position: 'absolute', top: 0, left: 0, width: '100%', height: '100%', pointerEvents: 'none' }}>
        <line x1={x1+xOffset} y1={y1+yOffset} x2={x2+xOffset} y2={y2+yOffset} stroke={colorScheme==='dark'?'white':'black'} strokeWidth="2" />
      </svg>
    )
  }
  
  export default LinkComponent
import { ActionIcon, Card, Divider, Grid, Group, Title, Tooltip, useMantineTheme } from '@mantine/core'
import { IconArrowUpRightCircle, IconPlus, IconLine, IconNumber1, IconMinus,IconDivide, IconX,IconCrosshair,IconDragDrop2, IconSum, IconHandMove, IconCircleLetterN, IconCircleLetterC, IconListNumbers } from '@tabler/icons-react'
import React, { ReactNode } from 'react'
import { useWorkspace } from '../../../data/context/workspace-context'
import { AgentType } from '../../../data/models/agent'

export type ToolType='AUX_LINK'|'PRINCIPAL_LINK'|'DRAG'

const toolSetMenuData: { label: string, icon: ReactNode, type: ToolType }[] = [
   
    { label: 'Auxilary Link', icon: <IconLine />, type: 'AUX_LINK' },
    { label: 'Principal Link', icon: <IconArrowUpRightCircle />, type: 'PRINCIPAL_LINK' },
    { label: 'Drag Node', icon: <IconHandMove />, type: 'DRAG' }
]

const arithmeticAgentData: { label: string, icon: ReactNode, type: AgentType }[]=[
    { label: 'Number Node', icon: <IconCircleLetterN />, type: 'NUMBER' },
    { label: 'Addition Node', icon: <IconPlus />, type: 'ADD' },
    { label: 'Multiplication Node', icon: <IconX />, type: 'MUL' },
    { label: 'Subtraction Node', icon: <IconMinus />, type: 'SUB' },
    { label: 'Division Node', icon: <IconDivide />, type: 'DIV' },
]

const logicAgentData: { label: string, icon: ReactNode, type: AgentType }[]=[
    { label: 'Count Aux ports', icon: <IconCircleLetterC />, type: 'COUNT_AUX_PORT' }
]

const AgentSelector = () => {

    const { toolID, setCurrentTool } = useWorkspace().currentTool;

    const {primaryColor}=useMantineTheme();


    function handleOnClick(e:React.MouseEvent,selectedToolId:string){
        e.stopPropagation();
        e.preventDefault();
        setCurrentTool(selectedToolId);
    }

    return (
        <Card h='100%'>
            <Card.Section>
                <Title size='xs' p='xs' ta='center'>Tools</Title>
                <Divider />
            </Card.Section>
            <Grid p='sm'>
                {
                    toolSetMenuData.map(menuItem => (
                        <Grid.Col span={6} key={menuItem.label}>
                            <Group position='center'>
                                <Tooltip label={menuItem.label} position='right' withArrow color={primaryColor} openDelay={500} withinPortal >
                                    <ActionIcon variant={toolID === menuItem.type ? 'filled' : 'light'} size='xl' color={primaryColor} onClick={(e:React.MouseEvent) => handleOnClick(e,menuItem.type)}>
                                        {menuItem.icon}
                                    </ActionIcon>
                                </Tooltip>
                            </Group>
                        </Grid.Col>
                    ))
                }
            </Grid>
            <Card.Section>
                <Title size='xs' p='xs' ta='center'>Arithmetic</Title>
                <Divider />
            </Card.Section>
            <Grid p='sm'>
                {
                    arithmeticAgentData.map(menuItem => (
                        <Grid.Col span={6} key={menuItem.label}>
                            <Group position='center'>
                                <Tooltip label={menuItem.label} position='right' withArrow color={primaryColor} openDelay={500} withinPortal >
                                    <ActionIcon variant={toolID === menuItem.type ? 'filled' : 'light'} size='xl' color={primaryColor} onClick={(e:React.MouseEvent) => handleOnClick(e,menuItem.type)}>
                                        {menuItem.icon}
                                    </ActionIcon>
                                </Tooltip>
                            </Group>
                        </Grid.Col>
                    ))
                }
            </Grid>
            <Card.Section>
                <Title size='xs' p='xs' ta='center'>Logic</Title>
                <Divider />
            </Card.Section>
            <Grid p='sm'>
                {
                    logicAgentData.map(menuItem => (
                        <Grid.Col span={6} key={menuItem.label}>
                            <Group position='center'>
                                <Tooltip label={menuItem.label} position='right' withArrow color={primaryColor} openDelay={500} withinPortal >
                                    <ActionIcon variant={toolID === menuItem.type ? 'filled' : 'light'} size='xl' color={primaryColor} onClick={(e:React.MouseEvent) => handleOnClick(e,menuItem.type)}>
                                        {menuItem.icon}
                                    </ActionIcon>
                                </Tooltip>
                            </Group>
                        </Grid.Col>
                    ))
                }
            </Grid>
        </Card>
    )
}

export default AgentSelector
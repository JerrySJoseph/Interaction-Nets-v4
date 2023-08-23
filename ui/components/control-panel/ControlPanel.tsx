import { ActionIcon, Badge, Button, Card, Collapse, Divider, Group, Modal, NumberInput, Stack, Tabs, Text, TextInput, ThemeIcon, useMantineTheme } from '@mantine/core'
import { IconAbc, IconArrowBadgeDownFilled, IconArrowBadgeUpFilled, IconArrowUpRightCircle, IconCheck, IconCircle, IconLine, IconPencil, IconSettings, IconTrash, IconVariable } from '@tabler/icons-react'
import React, { useState } from 'react'
import { useWorkspace } from '../../../data/context/workspace-context'
import { Agent } from '../../../data/models/agent'
import { AgentColors } from '../../../utils/theme'
import NodeComponent from '../node-component/NodeComponent'

const ControlPanel = () => {

    const { inetState } = useWorkspace().currentInetState;

    return (
        <Card h='100%'>
            <Tabs defaultValue="agents">
                <Tabs.List>
                    <Tabs.Tab value="agents" icon={<IconCircle size="0.8rem" />}>Agents</Tabs.Tab>
                    <Tabs.Tab value="settings" icon={<IconSettings size="0.8rem" />}>Settings</Tabs.Tab>
                </Tabs.List>

                <Tabs.Panel value="agents" pt="xs" style={{
                    overflowY: 'auto',
                    maxHeight: '80vh'
                }}>
                    <Stack spacing='xs'>
                        {
                            Object.keys(inetState.agents).map(ak => (
                                <AgentCard key={ak} agent={inetState.agents[ak]} />
                            ))
                        }
                    </Stack>
                </Tabs.Panel>

                <Tabs.Panel value="settings" pt="xs">
                    Settings tab content
                </Tabs.Panel>
            </Tabs>

        </Card>
    )
}

interface AgentCardProps {
    agent: Agent
}

const AgentCard = ({ agent }: AgentCardProps) => {

    const [expand, setExpand] = useState(false);
    const [editModalOpen, setEditModalOpen] = useState(false);
    const [formData, setFormData] = useState<{ label: string, value: number }>({
        label: agent.label,
        value: agent.value
    })

    const { inetState } = useWorkspace().currentInetState


    const { updateAgent, deleteAgent } = useWorkspace().currentInetState;

    function handleOnEditClick(e: React.MouseEvent) {
        e.stopPropagation();
        e.preventDefault();
        setEditModalOpen(true);
    }


    function handleSave() {
        updateAgent({ ...agent, ...formData })
        setEditModalOpen(false);
    }



    function handleDelete() {
        deleteAgent(agent.id);
    }

    return (
        <>
            <Card p='xs' withBorder>
                <Group position='apart' align='center'>
                    <Group>
                        <NodeComponent agent={agent} thumbnail dragDisabled />
                        <Stack spacing={0}>
                            <Text size='md' fw={700}>{agent.label} <Badge variant='outline' color={AgentColors[agent.type]} size='xs'>{agent.type}</Badge></Text>
                            <Text size='sm' color={useMantineTheme().primaryColor}>Value: {agent.value}</Text>
                        </Stack>
                    </Group>
                    <ActionIcon variant='filled' onClick={() => setExpand(!expand)}>
                        {expand ? <IconArrowBadgeUpFilled size={18} /> : <IconArrowBadgeDownFilled size={18} />}
                    </ActionIcon>
                </Group>
                <Collapse in={expand} transitionDuration={500}>
                    <Divider my='xs' />
                    <Stack spacing='xs'>
                        <Group spacing='xs'>
                            <ThemeIcon variant='filled' size='sm'>
                                <IconArrowUpRightCircle size={12} />
                            </ThemeIcon>
                            <Text size='xs' fw={500}>Principal Port : {agent.principalPort ? inetState.agents[agent.principalPort].label : 'Not specified'}</Text>
                        </Group>
                        <Group spacing='xs' noWrap>
                            <ThemeIcon variant='filled' size='sm'>
                                <IconLine size={12} />
                            </ThemeIcon>
                            <Text size='xs' fw={500} truncate>Aux Ports : {agent.auxiliaryPorts.length>0 ? agent.auxiliaryPorts.map(id=>`${inetState.agents[id].label} (${inetState.agents[id].value})`).join(', ') : 'Not specified'}</Text>
                        </Group>
                        <Group position='right'>
                            <ActionIcon variant='filled' onClick={handleOnEditClick}>
                                <IconPencil size={18} />
                            </ActionIcon>
                            <ActionIcon variant='filled' color='red' >
                                <IconTrash size={18} onClick={handleDelete} />
                            </ActionIcon>

                        </Group>
                    </Stack>

                </Collapse>
            </Card>
            <Modal opened={editModalOpen} onClose={() => setEditModalOpen(false)} title={`Edit Agent ${agent.label}`} size='xs' centered withCloseButton>
                <Stack>
                    <Group align='center'>
                        <div className={`node ${agent.type === 'NUMBER' ? 'node-constant' : 'node-operator'} node-thumbnail`} id={agent.id} style={{ backgroundColor: AgentColors[agent.type] }}>
                            <Text size='sm' fw={500}>{formData.label}</Text>
                        </div>
                        <Stack spacing={0}>
                            <TextInput
                                placeholder="Eg: ADD"
                                label="Name"
                                size="xs"
                                withAsterisk
                                onChange={e => setFormData(prev => ({ ...prev, label: e.target.value }))}
                                value={formData.label}
                                icon={<IconAbc />}
                            />
                            <NumberInput
                                defaultValue={agent.value}
                                placeholder="Eg: 590"
                                label="Value of Agent"
                                size="xs"
                                onChange={e => setFormData(prev => ({ ...prev, value: e || 0 }))}
                                value={formData.value}
                                withAsterisk
                                hideControls
                            />
                        </Stack>
                    </Group>
                    <Divider />
                    <Group position='apart'>
                        <Button size='xs' leftIcon={<IconCheck size={14} />} onClick={handleSave}>Save</Button>
                        <Button size='xs' color='red' leftIcon={<IconTrash size={14} />} onClick={handleDelete}>Delete</Button>
                    </Group>
                </Stack>

            </Modal>
        </>
    )
}

export default ControlPanel
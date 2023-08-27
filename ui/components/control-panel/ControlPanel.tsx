import { ActionIcon, Badge, Button, Card, Collapse, Divider, Group, Image, Modal, NumberInput, Select, Stack, Tabs, Text, TextInput, ThemeIcon, useMantineTheme } from '@mantine/core'
import { IconAbc, IconArrowBadgeDownFilled, IconArrowBadgeUpFilled, IconArrowUpRightCircle, IconCheck, IconCircle, IconLetterR, IconLine, IconPencil, IconPlus, IconSettings, IconTrash, IconVariable } from '@tabler/icons-react'
import React, { useState } from 'react'
import { useWorkspace } from '../../../data/context/workspace-context'
import { Agent, BooleanAgent, NumberAgent } from '../../../data/models/agent'
import { AgentColors } from '../../../utils/theme'
import NodeComponent from '../node-component/NodeComponent'

const ControlPanel = () => {

    const { inetState } = useWorkspace().currentInetState;

    const { primaryColor } = useMantineTheme();

    const [ruleEditorOpen,setruleEditorOpen]=useState(false);

    return (
        <Card h='100%'>
            <Tabs defaultValue="agents">
                <Tabs.List>
                    <Tabs.Tab value="agents" icon={<IconCircle size="0.8rem" />}>Agents</Tabs.Tab>
                    <Tabs.Tab value="rw-rules" icon={<IconLetterR size="0.8rem" />}>Rewrite Rules</Tabs.Tab>
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
                        {
                            Object.keys(inetState.agents).length === 0 &&
                            <>
                                <Group position='center'>
                                    <Image src='/img/empty.svg' p='lg' maw='70%' />

                                </Group>
                                <Text size='lg' fw={700} ta='center'>No Agents</Text>
                                <Text size='xs' ta='center'>You have not added any agents yet. Please design an interaction in the canvas shown on the left side. All your agents will show up here.</Text>
                            </>
                        }
                    </Stack>
                </Tabs.Panel>
                <Tabs.Panel value="rw-rules" pt="xs" style={{
                    overflowY: 'auto',
                    maxHeight: '80vh'
                }}>
                    <Stack spacing='xs' justify='center'>
                        <Button leftIcon={<IconPlus />} onClick={()=>setruleEditorOpen(true)}>Add New Rule</Button>
                    </Stack>
                </Tabs.Panel>


            </Tabs>
            <Modal opened={ruleEditorOpen} onClose={()=>setruleEditorOpen(false)} title="Add rewrite rule" size='lg' centered>
                
            </Modal>

        </Card>
    )
}

interface AgentCardProps {
    agent: Agent
}

const AgentCard = ({ agent }: AgentCardProps) => {

    const [expand, setExpand] = useState(false);
    const [editModalOpen, setEditModalOpen] = useState(false);
    const [formData, setFormData] = useState<{ label: string, value: number, boolValue?: boolean }>({
        label: agent.label,
        value: agent.value,
        boolValue: (agent as BooleanAgent).boolValue || false
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
                            <Text size='sm' color={useMantineTheme().primaryColor}>Value: {agent.type === 'BOOL' ? (agent as BooleanAgent).boolValue.toString() : agent.value}</Text>
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
                            <Text size='xs' fw={500}>Principal Port : {agent.principalPort && inetState.agents[agent.principalPort] ? inetState.agents[agent.principalPort].label : 'Not specified'}</Text>
                        </Group>
                        <Group spacing='xs' noWrap>
                            <ThemeIcon variant='filled' size='sm'>
                                <IconLine size={12} />
                            </ThemeIcon>
                            <Text size='xs' fw={500} truncate>Aux Ports : {agent.auxiliaryPorts.length > 0 ? agent.auxiliaryPorts.map(id => `${inetState.agents[id] && inetState.agents[id].label} (${inetState.agents[id] && inetState.agents[id].value})`).join(', ') : 'Not specified'}</Text>
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
                            {
                                agent.type === 'NUMBER' &&
                                <NumberInput
                                    defaultValue={agent.value}
                                    placeholder="Eg: 590"
                                    label="Value of Agent"
                                    size="xs"
                                    disabled={!!(agent as NumberAgent).allowEdit}
                                    onChange={e => setFormData(prev => ({ ...prev, value: e || 0 }))}
                                    value={formData.value}
                                    withAsterisk
                                    hideControls
                                />
                            }
                            {
                                agent.type === 'BOOL' &&
                                <Select
                                    defaultValue={formData.boolValue ? 'TRUE' : "FALSE"}
                                    placeholder="Eg: TRUE"
                                    label="Boolean Value of Agent"
                                    size="xs"
                                    disabled={!!(agent as NumberAgent).allowEdit}
                                    data={[{ label: 'TRUE', value: 'true' }, { label: 'FALSE', value: 'false' }]}
                                    onChange={e => setFormData(prev => ({ ...prev, boolValue: e === 'true' }))}
                                    value={formData.boolValue ? 'true' : 'false'}
                                    withAsterisk
                                />
                            }
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
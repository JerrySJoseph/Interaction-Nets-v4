import { Grid } from '@mantine/core'
import React from 'react'
import { WorkspaceContextProvider } from '../../../data/context/workspace-context'
import AgentSelector from '../agent-selector/AgentSelector'
import Canvas from '../canvas/Canvas'
import ControlPanel from '../control-panel/ControlPanel'

const Workspace = () => {
  return (
    <WorkspaceContextProvider>
      <Grid h='100%'>
        <Grid.Col span={1}>
          <AgentSelector />
        </Grid.Col>

        <Grid.Col span={8}>
          <Canvas/>
        </Grid.Col>

        <Grid.Col span={3}>
          <ControlPanel/>
        </Grid.Col>
      </Grid>
    </WorkspaceContextProvider>
  )
}

export default Workspace
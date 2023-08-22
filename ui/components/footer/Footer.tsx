import React from 'react'
import { Group, Footer as MantineFooter, FooterProps as MantineFooterProps, Text } from '@mantine/core'

type FooterProps=Omit<MantineFooterProps,'children'>

const Footer = (footerProps:FooterProps) => {
  return (
    <MantineFooter {...footerProps}>
    <Group position='center'>
        <Text size='xs' color='dimmed'>Developed by Jerry S Joseph</Text>
    </Group>
  </MantineFooter>
  )
}

export default Footer
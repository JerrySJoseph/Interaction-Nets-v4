import { AppShell, useMantineTheme } from '@mantine/core'
import React, { useState } from 'react'
import Header from '../../components/header/Header'

interface AppLayoutProps{    
    children?:React.ReactNode
    [key:string]:any
}

const AppLayout2=({children}:AppLayoutProps)=>{
  const theme = useMantineTheme();
  const [opened, setOpened] = useState(false);

  return (
    <AppShell
      styles={{
        main: {
          background: theme.colorScheme === 'dark' ? theme.colors.dark[8] : theme.colors.gray[0],
        },
      }}
      
      navbarOffsetBreakpoint="lg"
      
      // footer={
      //  <Footer height={60} p="md"/>
      // }
      header={
        <Header height={{ base: 70, md: 70 }} p="md" open={opened} toggleopen={()=>setOpened(!opened)}/>
      }
    >
      {children}
    </AppShell>
    
  );
}

export default AppLayout2
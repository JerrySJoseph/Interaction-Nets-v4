import { ActionIcon, Card, Grid, Group, NavbarProps as MantineNavbarProps, Navbar, Text, useMantineTheme } from '@mantine/core';
import { IconDivide, IconMinus, IconPlayerEject, IconPlus, IconX } from '@tabler/icons-react';


type NavbarProps = Omit<MantineNavbarProps, 'children'>

const navlinksData = [
    { label: 'Add', icon: IconPlus },
    { label: 'Subtract', icon: IconMinus },
    { label: 'Multiply', icon: IconX },
    { label: 'Successor', icon: IconPlayerEject }
]

const NavbarLeft = (navbarProps: NavbarProps) => {

    const { primaryColor } = useMantineTheme()

    const navLinkItems = navlinksData.map((item, index) => (
        <Grid.Col span={6} key={item.label}>
            <ActionIcon color={primaryColor} variant='filled' radius='sm'draggable>
                <item.icon size={18} />
            </ActionIcon>
        </Grid.Col>
    ));

    return (<Navbar {...navbarProps} px='md'>
        <Navbar.Section mt='md' ml='md'>
            <Text size="sm" weight={600} color="dimmed">
                Agents
            </Text>
        </Navbar.Section>
        <Navbar.Section grow>
            <Grid mt='sm' >
                {navLinkItems}
            </Grid>
        </Navbar.Section>


    </Navbar>
    )
}

export default NavbarLeft
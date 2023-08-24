import { Avatar, Burger, Group, Header as MantineHeader, HeaderProps as MantineHeaderProps, MediaQuery, Text, useMantineTheme } from '@mantine/core';
import { ColorSchemeToggle } from '../colorschemetoggle/ColorSchemeToggle';

type HeaderProps = Omit<MantineHeaderProps, 'children'> & {
    open: boolean
    toggleopen: () => any
}

const Header = (headerProps: HeaderProps) => {

    const theme = useMantineTheme()

      

    return (
        <MantineHeader {...headerProps}>
            <MediaQuery smallerThan='lg' styles={{ justifyContent: 'start' }}>
                <Group position='apart'>
                    <MediaQuery largerThan="lg" styles={{ display: 'none' }}>
                        <Burger
                            opened={headerProps.open}
                            onClick={headerProps.toggleopen}
                            size="sm"
                            color={theme.colors.gray[6]}
                            mr="xl"
                        />
                    </MediaQuery>

                    <Group >
                        <Avatar src='/img/logo.png' />
                        <Text size='xl' fw='bold'>Interaction Nets</Text>
                    </Group>

                                      
                    <ColorSchemeToggle/>

                </Group>
            </MediaQuery>
        </MantineHeader>
    )
}

export default Header
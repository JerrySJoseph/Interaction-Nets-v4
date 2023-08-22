import { ActionIcon, Group, useMantineColorScheme ,Text, UnstyledButton} from '@mantine/core';
import { IconMoonStars, IconSun } from '@tabler/icons-react';

interface ColorSchemeToggleProps {
  withCaption?: boolean,
}
export function ColorSchemeToggle({ withCaption }: ColorSchemeToggleProps) {

  const { colorScheme, toggleColorScheme } = useMantineColorScheme()

  if (withCaption) {
    return (
      <UnstyledButton>
        <Group position='left' onClick={() => toggleColorScheme()}>
        <ActionIcon
          
          size="lg"
          sx={(theme) => ({
            backgroundColor:
              theme.colorScheme === 'dark' ? theme.colors.dark[6] : theme.colors.gray[0],
            color: theme.colorScheme === 'dark' ? theme.colors.yellow[4] : theme.colors.blue[6],
          })}
        >
          {colorScheme === 'dark' ? <IconSun size="1.2rem" /> : <IconMoonStars size="1.2rem" />}
        </ActionIcon>
        <Text fw='bold' size='xs'>{colorScheme==='dark'?'Light Theme':'Dark Theme'}</Text>
      </Group>
      </UnstyledButton>
    )
  }

  return (
    <Group position="center">
      <ActionIcon
        onClick={() => toggleColorScheme()}
        size="lg"
        sx={(theme) => ({
          backgroundColor:
            theme.colorScheme === 'dark' ? theme.colors.dark[6] : theme.colors.gray[0],
          color: theme.colorScheme === 'dark' ? theme.colors.yellow[4] : theme.colors.blue[6],
        })}
      >
        {colorScheme === 'dark' ? <IconSun size="1.2rem" /> : <IconMoonStars size="1.2rem" />}
      </ActionIcon>
    </Group>
  );
}
import { Container, Title, TextInput, Button, Group } from "@mantine/core";

export default function Home() {
  return (
    <Container size="md" mt="xl">
      <Title order={1} ta="center" mb="md">
        LobbyLens
      </Title>
      <Group align="flex-end">
        <TextInput
          placeholder="Search companies or brands..."
          style={{ flex: 1 }}
        />
        <Button>Search</Button>
      </Group>
    </Container>
  );
}

import {
  Container,
  Title,
  Text,
  Card,
  Grid,
  Group,
  Badge,
} from "@mantine/core";
import { BarChart, DonutChart } from "@mantine/charts";
import { useParams } from "react-router-dom";
import { mockCompanies } from "../data/mockData";

export default function CompanyProfile() {
  const { id } = useParams();
  const company = mockCompanies.find((c) => c.id === id) || mockCompanies[0];

  return (
    <Container size="lg" mt="xl">
      <Group justify="space-between" align="flex-start" mb="xl">
        <div>
          <Title order={1}>{company.name}</Title>
          <Text c="dimmed" mt="sm" maw={600}>
            {company.description}
          </Text>
        </div>
        <Card
          withBorder
          radius="md"
          padding="xl"
          bg="var(--mantine-color-blue-light)"
        >
          <Text tt="uppercase" c="dimmed" fw={700} size="xs">
            Total Spent (2023)
          </Text>
          <Title order={2}>
            ${(company.totalSpent2023 / 1000000).toFixed(1)}M
          </Title>
        </Card>
      </Group>

      <Grid gutter="xl" mt="xl">
        <Grid.Col span={{ base: 12, md: 7 }}>
          <Card withBorder radius="md" padding="xl">
            <Title order={3} mb="xl">
              Spending Over Time
            </Title>
            <BarChart
              h={300}
              data={company.spendingByYear}
              dataKey="year"
              series={[
                { name: "amount", color: "blue.6", label: "Lobbying Spend" },
              ]}
              tickLine="y"
              valueFormatter={(value) => `$${(value / 1000000).toFixed(1)}M`}
              cursorFill="transparent"
              styles={{
                tooltipItemColor: { display: "none" },
              }}
            />
          </Card>
        </Grid.Col>

        <Grid.Col span={{ base: 12, md: 5 }}>
          <Card withBorder radius="md" padding="xl" h="100%">
            <Title order={3} mb="xl">
              Top Issues (2023)
            </Title>
            <Group justify="center">
              <DonutChart
                data={company.topIssues}
                withTooltip
                size={200}
                thickness={30}
                valueFormatter={(value) => `$${(value / 1000000).toFixed(1)}M`}
              />
            </Group>
            <Group mt="xl" justify="center" gap="xs">
              {company.topIssues.map((issue) => (
                <Badge
                  key={issue.name}
                  color={issue.color.split(".")[0]}
                  variant="light"
                >
                  {issue.name}
                </Badge>
              ))}
            </Group>
          </Card>
        </Grid.Col>
      </Grid>
    </Container>
  );
}

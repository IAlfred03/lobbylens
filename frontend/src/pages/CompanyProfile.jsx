import { useEffect, useState } from "react";
import { Container, Title, Text, Card, Grid, Group } from "@mantine/core";
import { BarChart } from "@mantine/charts";
import { useParams } from "react-router-dom";
import { fetchCompany, fetchCompanySpending } from "../services/api";

export default function CompanyProfile() {
  const { id } = useParams();
  const [company, setCompany] = useState(null);
  const [spending, setSpending] = useState(null);
  const [error, setError] = useState("");

  useEffect(() => {
    loadCompanyData();
  }, [id]);

  async function loadCompanyData() {
    try {
      setError("");
      const companyData = await fetchCompany(id);
      const spendingData = await fetchCompanySpending(id);

      setCompany(companyData);
      setSpending(spendingData);
    } catch (err) {
      console.error("Failed to load company profile:", err);
      setError("Could not load company data");
    }
  }

  const formatSpend = (value) => {
    if (value >= 1000000) return `$${(value / 1000000).toFixed(1)}M`;
    if (value >= 1000) return `$${(value / 1000).toFixed(1)}K`;
    return `$${value}`;
  };

  if (error) {
    return (
      <Container size="lg" mt="xl">
        <Text c="red">{error}</Text>
      </Container>
    );
  }

  if (!company || !spending) {
    return (
      <Container size="lg" mt="xl">
        <Text>Loading...</Text>
      </Container>
    );
  }

  return (
    <Container size="lg" mt="xl">
      <Group justify="space-between" align="flex-start" mb="xl">
        <div>
          <Title order={1}>{company.name}</Title>
          <Text c="dimmed" mt="sm" maw={600}>
            Lobbying spending details pulled from the backend API.
          </Text>
        </div>

        <Card
          withBorder
          radius="md"
          padding="xl"
          bg="var(--mantine-color-blue-light)"
        >
          <Text tt="uppercase" c="dimmed" fw={700} size="xs">
            Total Spending
          </Text>
          <Title order={2}>{formatSpend(spending.total_spending)}</Title>
        </Card>
      </Group>

      <Grid gutter="xl" mt="xl">
        <Grid.Col span={{ base: 12, md: 12 }}>
          <Card withBorder radius="md" padding="xl">
            <Title order={3} mb="xl">
              Spending Over Time
            </Title>
            <BarChart
              h={300}
              data={spending.by_year}
              dataKey="year"
              series={[
                { name: "amount", color: "blue.6", label: "Lobbying Spend" },
              ]}
              tickLine="y"
              valueFormatter={formatSpend}
              cursorFill="transparent"
              styles={{
                tooltipItemColor: { display: "none" },
              }}
            />
          </Card>
        </Grid.Col>
      </Grid>
    </Container>
  );
}

import {
  Container,
  Title,
  Text,
  Card,
  Table,
  Badge,
  Group,
} from "@mantine/core";
import { BarChart } from "@mantine/charts";
import { mockCompanies } from "../data/mockData";

export default function IssueBreakdown() {
  const issueMap = {};

  mockCompanies.forEach((company) => {
    company.topIssues.forEach((issue) => {
      if (!issueMap[issue.name]) {
        issueMap[issue.name] = {
          name: issue.name,
          totalValue: 0,
          color: issue.color,
          topSpender: company.name,
        };
      }
      issueMap[issue.name].totalValue += issue.value;

      if (issue.value > (issueMap[issue.name].highestSpend || 0)) {
        issueMap[issue.name].highestSpend = issue.value;
        issueMap[issue.name].topSpender = company.name;
      }
    });
  });

  const aggregatedIssues = Object.values(issueMap).sort(
    (a, b) => b.totalValue - a.totalValue,
  );

  const chartData = aggregatedIssues.map((issue) => ({
    issueName: issue.name,
    amount: issue.totalValue,
    color: issue.color,
  }));

  const rows = aggregatedIssues.map((issue) => (
    <Table.Tr key={issue.name}>
      <Table.Td>
        <Badge color={issue.color.split(".")[0]} variant="light">
          {issue.name}
        </Badge>
      </Table.Td>
      <Table.Td fw={500}>${(issue.totalValue / 1000000).toFixed(1)}M</Table.Td>
      <Table.Td>
        <Text size="sm" c="dimmed">
          {issue.topSpender}
        </Text>
      </Table.Td>
    </Table.Tr>
  ));

  return (
    <Container size="lg" mt="xl">
      <Title order={1} mb="xs">
        Issue Breakdown
      </Title>
      <Text c="dimmed" mb="xl">
        Explore the most heavily funded policy issues across our database.
      </Text>

      <Card withBorder radius="md" padding="xl" mb="xl">
        <Title order={3} mb="xl">
          Total Spending by Policy Issue
        </Title>
        <BarChart
          h={300}
          data={chartData}
          dataKey="issueName"
          series={[{ name: "amount", color: "teal.6", label: "Total Spend" }]}
          tickLine="y"
          valueFormatter={(value) => `$${(value / 1000000).toFixed(1)}M`}
          cursorFill="transparent"
          styles={{ tooltipItemColor: { display: "none" } }}
        />
      </Card>

      <Card withBorder radius="md" padding="xl">
        <Title order={3} mb="md">
          Detailed Issue Report
        </Title>
        <Table striped highlightOnHover verticalSpacing="sm">
          <Table.Thead>
            <Table.Tr>
              <Table.Th>Policy Issue</Table.Th>
              <Table.Th>Total Spent (All Companies)</Table.Th>
              <Table.Th>Top Contributor</Table.Th>
            </Table.Tr>
          </Table.Thead>
          <Table.Tbody>{rows}</Table.Tbody>
        </Table>
      </Card>
    </Container>
  );
}

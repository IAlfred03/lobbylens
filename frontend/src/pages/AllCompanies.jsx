import { useEffect, useState } from "react";
import { Container, Title, Loader, Center, Text, Stack } from "@mantine/core";
import { fetchCompanies } from "../services/api";
import { Link } from "react-router-dom";

export default function AllCompanies() {
  const [companies, setCompanies] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadCompanies();
  }, []);

  async function loadCompanies() {
    try {
      const data = await fetchCompanies("", 1000); // get a lot
      setCompanies(data);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  }

  if (loading) {
    return (
      <Center h={300}>
        <Loader />
      </Center>
    );
  }

  return (
    <Container size="md" mt="xl">
      <Title mb="lg">All Companies</Title>

      <Stack>
        {companies.map((c) => (
          <Link key={c.id} to={`/company/${c.id}`}>
            <Text fw={500}>{c.name}</Text>
          </Link>
        ))}
      </Stack>
    </Container>
  );
}
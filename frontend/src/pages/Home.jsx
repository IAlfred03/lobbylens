import { useEffect, useMemo, useState } from "react";
import {
  Container,
  Title,
  Text,
  Autocomplete,
  Button,
  Group,
} from "@mantine/core";
import { useNavigate } from "react-router-dom";
import { fetchCompanies } from "../services/api";

export default function Home() {
  const [searchValue, setSearchValue] = useState("");
  const [error, setError] = useState("");
  const [companies, setCompanies] = useState([]);
  const navigate = useNavigate();

  useEffect(() => {
    loadCompanies();
  }, []);

  async function loadCompanies(query = "") {
    try {
      const data = await fetchCompanies(query);
      setCompanies(data);
    } catch (err) {
      console.error("Failed to load companies:", err);
      setError("Could not load companies");
    }
  }

  const companyNames = useMemo(() => {
    return companies.map((company) => company.name);
  }, [companies]);

  const handleSearch = () => {
    const selectedCompany = companies.find(
      (c) => c.name.toLowerCase() === searchValue.toLowerCase(),
    );

    if (selectedCompany) {
      setError("");
      navigate(`/company/${selectedCompany.id}`);
    } else {
      setError("Company not found. Try again");
    }
  };

  const handleInputChange = async (value) => {
    setSearchValue(value);
    setError("");

    try {
      const data = await fetchCompanies(value);
      setCompanies(data);
    } catch (err) {
      console.error("Search failed:", err);
      setError("Could not search companies");
    }
  };

  return (
    <Container size="md" mt="xl">
      <Title order={1} ta="center" mb="md">
        LobbyLens
      </Title>
      <Text ta="center" c="dimmed" mb="xl">
        Discover how much companies spend on lobbying and the issues they
        support.
      </Text>

      <Group align="flex-start" justify="center">
        <Autocomplete
          placeholder="Search companies or brands..."
          data={companyNames}
          value={searchValue}
          onChange={handleInputChange}
          style={{ flex: 1, maxWidth: 500 }}
          error={error}
          onKeyDown={(e) => {
            if (e.key === "Enter") handleSearch();
          }}
        />
        <Button onClick={handleSearch}>Search</Button>
      </Group>
    </Container>
  );
}
import { useState } from "react";
import {
  Container,
  Title,
  Text,
  Autocomplete,
  Button,
  Group,
} from "@mantine/core";
import { useNavigate } from "react-router-dom";
import { mockCompanies } from "../data/mockData";

export default function Home() {
  const [searchValue, setSearchValue] = useState("");
  const [error, setError] = useState("");
  const navigate = useNavigate();

  const companyNames = mockCompanies.map((company) => company.name);

  const handleSearch = () => {
    const selectedCompany = mockCompanies.find(
      (c) => c.name.toLowerCase() === searchValue.toLowerCase(),
    );

    if (selectedCompany) {
      setError(""); // Clear any previous errors
      navigate(`/company/${selectedCompany.id}`); // Redirect to the profile
    } else {
      setError("Company not found. Try again");
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
          onChange={setSearchValue}
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

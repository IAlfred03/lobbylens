def normalize_filings(api_payload: dict) -> list[dict]:
    results = api_payload.get("results", [])
    normalized = []

    for item in results:
        company_name = (
            item.get("client", {}).get("name")
            or item.get("registrant", {}).get("name")
            or "Unknown"
        )

        year = item.get("filing_year")
        amount = item.get("income") or item.get("expenses") or 0

        period = str(item.get("filing_period", "")).lower()
        quarter_map = {
            "first_quarter": "Q1",
            "second_quarter": "Q2",
            "third_quarter": "Q3",
            "fourth_quarter": "Q4",
        }
        quarter = quarter_map.get(period, "Q1")

        if year:
            normalized.append(
                {
                    "company": company_name,
                    "year": int(year),
                    "quarter": quarter,
                    "amount": amount,
                }
            )

    return normalized
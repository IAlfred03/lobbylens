def normalize_filings(api_payload: dict) -> list[dict]:
    results = api_payload.get("results", [])
    normalized = []

    for item in results:
        # ✅ ONLY KEEP QUARTERLY REPORTS
        if item.get("filing_type") not in ["Q1", "Q2", "Q3", "Q4"]:
            continue

        company_name = (
            item.get("client", {}).get("name")
            or item.get("registrant", {}).get("name")
            or "Unknown"
        )

        year = item.get("filing_year")

        raw_income = item.get("income")
        raw_expenses = item.get("expenses")

        amount = raw_income if raw_income else raw_expenses

        try:
            if isinstance(amount, str):
                amount = amount.replace(",", "").replace("$", "").strip()
            amount = float(amount)
        except Exception:
            amount = 0.0

        period = str(item.get("filing_period", "")).lower()
        quarter_map = {
            "first_quarter": "Q1",
            "second_quarter": "Q2",
            "third_quarter": "Q3",
            "fourth_quarter": "Q4",
        }
        quarter = quarter_map.get(period, "Q1")

        if year and amount > 0:
            normalized.append(
                {
                    "company": company_name,
                    "year": int(year),
                    "quarter": quarter,
                    "amount": amount,
                }
            )

    return normalized
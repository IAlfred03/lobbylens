import requests

BASE_URL = "https://lda.senate.gov/api/v1"


def fetch_quarterly_reports(page=1, filing_year=None):
    url = f"{BASE_URL}/filings/"
    params = {
        "page": page,
    }

    if filing_year is not None:
        params["filing_year"] = filing_year

    response = requests.get(url, params=params, timeout=30)
    response.raise_for_status()
    return response.json()
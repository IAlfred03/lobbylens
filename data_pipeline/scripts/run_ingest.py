from data_pipeline.scripts.sources.lda_api import fetch_quarterly_reports
from data_pipeline.scripts.transform.normalize_lda import normalize_filings
from data_pipeline.scripts.load.upsert import load_records


def main():
    print("Fetching LDA data...")

    payload = fetch_quarterly_reports(page=1, filing_year=2025)
    records = normalize_filings(payload)

    print(f"Fetched {len(records)} records")

    loaded = load_records(records, source_name="lda_api")
    print(f"Loaded {loaded} filing rows.")


if __name__ == "__main__":
    main()
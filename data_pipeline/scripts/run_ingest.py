from data_pipeline.scripts.sources.sample_source import fetch
from data_pipeline.scripts.load.upsert import load_records

def main():
    records = fetch()
    loaded = load_records(records, source_name="sample")
    print(f"Loaded {loaded} filing rows.")

if __name__ == "__main__":
    main()
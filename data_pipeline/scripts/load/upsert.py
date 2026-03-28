from decimal import Decimal
from data_pipeline.scripts.load.db import get_conn

def upsert_company(cur, name: str) -> int:
    cur.execute(
        """
        INSERT INTO companies (name)
        VALUES (%s)
        ON CONFLICT (name) DO UPDATE SET name = EXCLUDED.name
        RETURNING id;
        """,
        (name.strip(),),
    )
    return cur.fetchone()[0]

def insert_filing(cur, company_id: int, year: int, quarter: str, amount, source: str):
    cur.execute(
        """
        INSERT INTO filings (company_id, year, quarter, amount, source)
        VALUES (%s, %s, %s, %s, %s);
        """,
        (company_id, year, quarter, Decimal(str(amount)), source),
    )

def load_records(records, source_name: str) -> int:
    count = 0
    with get_conn() as conn:
        with conn.cursor() as cur:
            for r in records:
                company_id = upsert_company(cur, r["company"])
                insert_filing(
                    cur,
                    company_id=company_id,
                    year=int(r["year"]),
                    quarter=str(r["quarter"]),
                    amount=r["amount"],
                    source=source_name,
                )
                count += 1
        conn.commit()
    return count
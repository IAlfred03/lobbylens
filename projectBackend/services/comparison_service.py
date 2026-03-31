from sqlalchemy import text
from app.core.db import SessionLocal

class ComparisonService:

    @staticmethod
    def compare_companies(companyA, companyB):
        db = SessionLocal()

        query = text("""
            SELECT c.name, SUM(f.amount) as total_spend
            FROM companies c
            JOIN filings f ON c.id = f.company_id
            WHERE c.id IN (:a, :b)
            GROUP BY c.name
        """)

        result = db.execute(query, {"a": companyA, "b": companyB})
        rows = [dict(row) for row in result.fetchall()]

        if len(rows) < 2:
            return {"error": "One or both companies not found"}

        diff = rows[0]["total_spend"] - rows[1]["total_spend"]

        return {
            "companies": rows,
            "difference": diff
        }

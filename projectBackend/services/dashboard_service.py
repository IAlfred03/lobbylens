from sqlalchemy import text
from app.core.db import SessionLocal

class DashboardService:

    @staticmethod
    def get_summary():
        db = SessionLocal()

        top_companies = db.execute(text("""
            SELECT c.name, SUM(f.amount) as total_spend
            FROM companies c
            JOIN filings f ON c.id = f.company_id
            GROUP BY c.name
            ORDER BY total_spend DESC
            LIMIT 5
        """)).fetchall()

        return {
            "top_companies": [dict(row) for row in top_companies]
        }

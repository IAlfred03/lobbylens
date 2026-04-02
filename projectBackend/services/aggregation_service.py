from sqlalchemy import text
from app.core.db import SessionLocal

class AggregationService:
 @staticmethod
def filter_companies(industry=None, year=None, min_spend=None,page=1, limit=10, sort_by="total_spend", order="desc"):

db = SessionLocal()

 offset = (page - 1) * limit

query = text(f"""
SELECT c.name, SUM(f.amount) as total_spend
FROM companies c
JOIN filings f ON c.id = f.company_id
WHERE 1=1
AND (:industry IS NULL OR c.industry = :industry)
AND (:year IS NULL OR f.year = :year)
GROUP BY c.name
HAVING (:min_spend IS NULL OR SUM(f.amount) >= :min_spend)
ORDER BY {sort_by} {order}
LIMIT :limit OFFSET :offset; """)
result = db.execute(query, { 
        "industry": industry,
        "year": year,
        "min_spend": min_spend,
        "limit": limit,
        "offset": offset
    })
rows = result.fetchall()
return {
        "results": [dict(row) for row in rows],
        "page": page,
        "limit": limit,
        "count": len(rows)
    }

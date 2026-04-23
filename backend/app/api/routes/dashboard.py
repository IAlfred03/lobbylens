from fastapi import APIRouter, Depends
from sqlalchemy import select, func
from sqlalchemy.orm import Session

from app.core.db import get_db
from app.models.company import Company
from app.models.filing import Filing
from app.schemas.dashboard import DashboardOut, RecentFilingOut

router = APIRouter(prefix="/dashboard", tags=["dashboard"])


@router.get("", response_model=DashboardOut)
def get_dashboard(db: Session = Depends(get_db)):
    total_tracked = db.execute(
        select(func.coalesce(func.sum(Filing.amount), 0))
    ).scalar_one()

    active_filings = db.execute(
        select(func.count(Filing.id))
    ).scalar_one()

    recent_rows = db.execute(
        select(
            Company.name,
            Filing.amount,
            Filing.year,
            Filing.quarter,
            Filing.source,
        )
        .join(Filing, Filing.company_id == Company.id)
        .order_by(Filing.id.desc())
        .limit(6)
    ).all()

    recent_disclosures = [
        RecentFilingOut(
            company=row.name,
            amount_spent=float(row.amount),
            primary_issue="General Lobbying",
            lobbying_firm=row.source or "Unknown",
            date_filed=f"{row.year} {row.quarter}",
        )
        for row in recent_rows
    ]

    return DashboardOut(
        total_tracked=float(total_tracked),
        active_filings=int(active_filings),
        top_issue_area="General Lobbying",
        recent_disclosures=recent_disclosures,
    )
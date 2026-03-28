from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy import select, func
from sqlalchemy.orm import Session

from app.core.db import get_db
from app.models.company import Company
from app.models.filing import Filing
from app.schemas.spending import CompanySpendingOut, YearAmount

router = APIRouter(prefix="/companies")


@router.get("/{company_id}/spending", response_model=CompanySpendingOut)
def get_company_spending(company_id: int, db: Session = Depends(get_db)):
    company = db.get(Company, company_id)
    if not company:
        raise HTTPException(status_code=404, detail="Company not found")

    total_stmt = (
        select(func.coalesce(func.sum(Filing.amount), 0))
        .where(Filing.company_id == company_id)
    )
    total_spending = db.execute(total_stmt).scalar_one()

    by_year_stmt = (
        select(Filing.year, func.sum(Filing.amount).label("amount"))
        .where(Filing.company_id == company_id)
        .group_by(Filing.year)
        .order_by(Filing.year)
    )
    rows = db.execute(by_year_stmt).all()

    return CompanySpendingOut(
        company_id=company.id,
        company_name=company.name,
        total_spending=float(total_spending),
        by_year=[YearAmount(year=row.year, amount=float(row.amount)) for row in rows],
    )
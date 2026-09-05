from dotenv import load_dotenv
from pathlib import Path

ROOT_DIR = Path(__file__).parent
load_dotenv(ROOT_DIR / ".env")

import os
import uuid
import logging
import asyncio
from datetime import datetime, timezone, timedelta
from typing import List, Optional

import bcrypt
import jwt as pyjwt
import resend
from fastapi import FastAPI, APIRouter, HTTPException, Request, Response, Depends, status
from starlette.middleware.cors import CORSMiddleware
from motor.motor_asyncio import AsyncIOMotorClient
from pydantic import BaseModel, Field, EmailStr, ConfigDict

# ---------------------- Setup ----------------------
logging.basicConfig(level=logging.INFO, format="%(asctime)s - %(name)s - %(levelname)s - %(message)s")
logger = logging.getLogger("suja")

mongo_url = os.environ["MONGO_URL"]
client = AsyncIOMotorClient(mongo_url)
db = client[os.environ["DB_NAME"]]

app = FastAPI(title="Suja Contera API")
api_router = APIRouter(prefix="/api")

JWT_ALGORITHM = "HS256"
JWT_SECRET = os.environ.get("JWT_SECRET", "dev-secret-change-me")

# ---------------------- Auth helpers ----------------------
def hash_password(password: str) -> str:
    salt = bcrypt.gensalt()
    return bcrypt.hashpw(password.encode("utf-8"), salt).decode("utf-8")

def verify_password(plain: str, hashed: str) -> bool:
    try:
        return bcrypt.checkpw(plain.encode("utf-8"), hashed.encode("utf-8"))
    except Exception:
        return False

def create_access_token(user_id: str, email: str) -> str:
    payload = {
        "sub": user_id,
        "email": email,
        "exp": datetime.now(timezone.utc) + timedelta(hours=12),
        "type": "access",
    }
    return pyjwt.encode(payload, JWT_SECRET, algorithm=JWT_ALGORITHM)

async def get_current_admin(request: Request) -> dict:
    token = request.cookies.get("access_token")
    if not token:
        auth = request.headers.get("Authorization", "")
        if auth.startswith("Bearer "):
            token = auth[7:]
    if not token:
        raise HTTPException(status_code=401, detail="Not authenticated")
    try:
        payload = pyjwt.decode(token, JWT_SECRET, algorithms=[JWT_ALGORITHM])
        if payload.get("type") != "access":
            raise HTTPException(status_code=401, detail="Invalid token type")
        user = await db.users.find_one({"id": payload["sub"]}, {"_id": 0, "password_hash": 0})
        if not user:
            raise HTTPException(status_code=401, detail="User not found")
        return user
    except pyjwt.ExpiredSignatureError:
        raise HTTPException(status_code=401, detail="Token expired")
    except pyjwt.InvalidTokenError:
        raise HTTPException(status_code=401, detail="Invalid token")


# ---------------------- Models ----------------------
class LoginIn(BaseModel):
    email: EmailStr
    password: str

class LeadCreate(BaseModel):
    model_config = ConfigDict(extra="ignore")
    name: str = Field(min_length=2, max_length=100)
    phone: str = Field(min_length=6, max_length=20)
    email: Optional[EmailStr] = None
    property_type: str
    location: str = Field(min_length=2, max_length=120)
    budget: Optional[str] = None
    message: Optional[str] = None

class LeadUpdate(BaseModel):
    status: Optional[str] = None
    notes: Optional[str] = None

class Lead(BaseModel):
    id: str
    name: str
    phone: str
    email: Optional[str] = None
    property_type: str
    location: str
    budget: Optional[str] = None
    message: Optional[str] = None
    status: str = "Pending"
    notes: Optional[str] = None
    created_at: str
    updated_at: str


# ---------------------- Email ----------------------
async def send_lead_emails(lead: dict) -> None:
    api_key = os.environ.get("RESEND_API_KEY", "").strip()
    if not api_key:
        logger.info("[EMAIL:MOCKED] RESEND_API_KEY not set. Lead received: %s (%s)", lead["name"], lead["phone"])
        return
    resend.api_key = api_key
    sender = os.environ.get("SENDER_EMAIL", "onboarding@resend.dev")
    business = os.environ.get("BUSINESS_EMAIL", "hello@sujacontera.com")

    rows = "".join(
        f"<tr><td style='padding:8px 12px;color:#5C4033;font-family:Inter,sans-serif;font-size:13px;text-transform:uppercase;letter-spacing:1px;'>{k}</td>"
        f"<td style='padding:8px 12px;color:#1E1E1E;font-family:Inter,sans-serif;font-size:15px;'>{v or '-'}</td></tr>"
        for k, v in [
            ("Name", lead.get("name")),
            ("Phone", lead.get("phone")),
            ("Email", lead.get("email")),
            ("Property", lead.get("property_type")),
            ("Location", lead.get("location")),
            ("Budget", lead.get("budget")),
            ("Message", lead.get("message")),
        ]
    )
    business_html = f"""
    <div style='background:#FAF8F5;padding:32px;font-family:Inter,sans-serif;'>
      <div style='max-width:560px;margin:0 auto;background:#FFFFFF;border-radius:18px;overflow:hidden;box-shadow:0 8px 30px rgba(0,0,0,0.05);'>
        <div style='background:#2C211A;padding:32px;text-align:center;'>
          <div style='color:#C8A96A;font-family:Georgia,serif;font-size:12px;letter-spacing:4px;text-transform:uppercase;'>Suja Contera</div>
          <h1 style='color:#FAF8F5;font-family:Georgia,serif;font-weight:300;font-size:26px;margin:12px 0 0;'>New Consultation Lead</h1>
        </div>
        <table style='width:100%;border-collapse:collapse;padding:24px;'>{rows}</table>
      </div>
    </div>
    """
    try:
        await asyncio.to_thread(
            resend.Emails.send,
            {"from": sender, "to": [business], "subject": f"New Lead: {lead['name']} - {lead['property_type']}", "html": business_html},
        )
        logger.info("Business notification sent for lead %s", lead["id"])
    except Exception as e:
        logger.error("Failed to send business email: %s", e)

    if lead.get("email"):
        confirm_html = f"""
        <div style='background:#FAF8F5;padding:32px;font-family:Inter,sans-serif;'>
          <div style='max-width:560px;margin:0 auto;background:#FFFFFF;border-radius:18px;overflow:hidden;box-shadow:0 8px 30px rgba(0,0,0,0.05);'>
            <div style='background:#2C211A;padding:40px;text-align:center;'>
              <div style='color:#C8A96A;font-family:Georgia,serif;font-size:12px;letter-spacing:4px;text-transform:uppercase;'>Suja Contera</div>
              <h1 style='color:#FAF8F5;font-family:Georgia,serif;font-weight:300;font-size:28px;margin:16px 0 0;'>Thank You, {lead['name']}.</h1>
            </div>
            <div style='padding:32px;color:#1E1E1E;font-size:15px;line-height:1.7;'>
              <p>We have received your enquiry for <b>{lead['property_type']}</b> interiors in <b>{lead['location']}</b>.</p>
              <p>One of our senior designers will personally reach out within <b>24 hours</b> to schedule your complimentary consultation.</p>
              <p style='margin-top:24px;color:#5C4033;'>Warm regards,<br/><b>The Suja Contera Studio</b></p>
            </div>
          </div>
        </div>
        """
        try:
            await asyncio.to_thread(
                resend.Emails.send,
                {"from": sender, "to": [lead["email"]], "subject": "We received your enquiry — Suja Contera", "html": confirm_html},
            )
        except Exception as e:
            logger.error("Failed to send customer confirmation: %s", e)


# ---------------------- Public routes ----------------------
@api_router.get("/")
async def root():
    return {"service": "Suja Contera API", "status": "ok"}

@api_router.post("/leads", response_model=Lead)
async def create_lead(payload: LeadCreate):
    now = datetime.now(timezone.utc).isoformat()
    doc = {
        "id": str(uuid.uuid4()),
        **payload.model_dump(),
        "status": "Pending",
        "notes": None,
        "created_at": now,
        "updated_at": now,
    }
    await db.leads.insert_one(doc)
    asyncio.create_task(send_lead_emails(doc))
    return Lead(**{k: v for k, v in doc.items() if k != "_id"})


# ---------------------- Auth routes ----------------------
@api_router.post("/auth/login")
async def login(payload: LoginIn, response: Response):
    email = payload.email.lower().strip()
    user = await db.users.find_one({"email": email})
    if not user or not verify_password(payload.password, user["password_hash"]):
        raise HTTPException(status_code=401, detail="Invalid email or password")
    token = create_access_token(user["id"], user["email"])
    response.set_cookie("access_token", token, httponly=True, secure=False, samesite="lax", max_age=43200, path="/")
    return {"token": token, "user": {"id": user["id"], "email": user["email"], "name": user.get("name"), "role": user.get("role")}}

@api_router.post("/auth/logout")
async def logout(response: Response):
    response.delete_cookie("access_token", path="/")
    return {"ok": True}

@api_router.get("/auth/me")
async def me(user=Depends(get_current_admin)):
    return user


# ---------------------- Admin lead routes ----------------------
@api_router.get("/admin/leads")
async def list_leads(user=Depends(get_current_admin)):
    docs = await db.leads.find({}, {"_id": 0}).sort("created_at", -1).to_list(1000)
    return docs

@api_router.get("/admin/stats")
async def stats(user=Depends(get_current_admin)):
    now = datetime.now(timezone.utc)
    start_today = datetime(now.year, now.month, now.day, tzinfo=timezone.utc).isoformat()
    start_month = datetime(now.year, now.month, 1, tzinfo=timezone.utc).isoformat()
    total = await db.leads.count_documents({})
    today = await db.leads.count_documents({"created_at": {"$gte": start_today}})
    month = await db.leads.count_documents({"created_at": {"$gte": start_month}})
    pending = await db.leads.count_documents({"status": "Pending"})
    won = await db.leads.count_documents({"status": "Won"})
    return {"total": total, "today": today, "month": month, "pending": pending, "won": won}

@api_router.patch("/admin/leads/{lead_id}")
async def update_lead(lead_id: str, payload: LeadUpdate, user=Depends(get_current_admin)):
    update = {k: v for k, v in payload.model_dump().items() if v is not None}
    if not update:
        raise HTTPException(status_code=400, detail="No fields to update")
    update["updated_at"] = datetime.now(timezone.utc).isoformat()
    res = await db.leads.update_one({"id": lead_id}, {"$set": update})
    if res.matched_count == 0:
        raise HTTPException(status_code=404, detail="Lead not found")
    doc = await db.leads.find_one({"id": lead_id}, {"_id": 0})
    return doc

@api_router.delete("/admin/leads/{lead_id}")
async def delete_lead(lead_id: str, user=Depends(get_current_admin)):
    res = await db.leads.delete_one({"id": lead_id})
    if res.deleted_count == 0:
        raise HTTPException(status_code=404, detail="Lead not found")
    return {"ok": True}


# ---------------------- Startup: seed admin & indexes ----------------------
@app.on_event("startup")
async def startup_event():
    await db.users.create_index("email", unique=True)
    await db.leads.create_index("created_at")
    admin_email = os.environ.get("ADMIN_EMAIL", "admin@sujacontera.com").lower().strip()
    admin_password = os.environ.get("ADMIN_PASSWORD", "Admin@123")
    existing = await db.users.find_one({"email": admin_email})
    if not existing:
        await db.users.insert_one({
            "id": str(uuid.uuid4()),
            "email": admin_email,
            "password_hash": hash_password(admin_password),
            "name": "Suja Contera Admin",
            "role": "admin",
            "created_at": datetime.now(timezone.utc).isoformat(),
        })
        logger.info("Seeded admin user: %s", admin_email)
    elif not verify_password(admin_password, existing["password_hash"]):
        await db.users.update_one({"email": admin_email}, {"$set": {"password_hash": hash_password(admin_password)}})
        logger.info("Updated admin password for: %s", admin_email)

@app.on_event("shutdown")
async def shutdown_db_client():
    client.close()

app.include_router(api_router)

app.add_middleware(
    CORSMiddleware,
    allow_credentials=True,
    allow_origins=os.environ.get("CORS_ORIGINS", "*").split(","),
    allow_methods=["*"],
    allow_headers=["*"],
)

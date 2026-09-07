"""Backend tests for POST /api/leads email integration via Emergent managed proxy."""
import os
import sys
import time
import asyncio
import subprocess
import pytest
import requests

BASE_URL = os.environ.get("REACT_APP_BACKEND_URL", "https://dream-spaces-24.preview.emergentagent.com").rstrip("/")
SAFE_EMAIL = "delivered@resend.dev"

# Ensure backend module can be imported for direct helper test
sys.path.insert(0, "/app/backend")


def _tail_backend_log(bytes_back: int = 60000) -> str:
    """Read the tail of backend supervisor logs (err + out)."""
    logs = ""
    for path in ("/var/log/supervisor/backend.err.log", "/var/log/supervisor/backend.out.log"):
        try:
            with open(path, "rb") as f:
                f.seek(0, 2)
                size = f.tell()
                f.seek(max(0, size - bytes_back))
                logs += f.read().decode("utf-8", errors="ignore")
        except FileNotFoundError:
            pass
    return logs


@pytest.fixture(scope="module")
def api_client():
    s = requests.Session()
    s.headers.update({"Content-Type": "application/json"})
    return s


def test_root_ok(api_client):
    r = api_client.get(f"{BASE_URL}/api/")
    assert r.status_code == 200
    assert r.json().get("status") == "ok"


def test_create_lead_with_email_sends_both_emails(api_client):
    """POST /api/leads with a customer email creates a lead and triggers
    BOTH owner notification and customer confirmation emails."""
    payload = {
        "name": "TEST QA Buyer",
        "phone": "+919999900001",
        "email": SAFE_EMAIL,
        "property_type": "Villa",
        "location": "Bengaluru",
        "budget": "50-75L",
        "message": "QA test — please ignore. Verifying email pipeline.",
    }
    r = api_client.post(f"{BASE_URL}/api/leads", json=payload)
    assert r.status_code == 200, f"expected 200, got {r.status_code}: {r.text}"
    data = r.json()
    assert data["id"] and isinstance(data["id"], str)
    assert data["status"] == "Pending"
    assert data["email"] == SAFE_EMAIL
    assert data["name"] == payload["name"]
    lead_id = data["id"]

    # Background asyncio.create_task — give it time to POST to email proxy.
    time.sleep(8)

    logs = _tail_backend_log()
    biz_line = f"Business notification sent for lead {lead_id}"
    cust_line = f"Customer confirmation sent for lead {lead_id}"
    fail_biz = "Failed to send business email"
    fail_cust = "Failed to send customer confirmation"

    assert biz_line in logs, f"Missing owner notification log line for lead {lead_id}. Logs tail:\n{logs[-4000:]}"
    assert cust_line in logs, f"Missing customer confirmation log line for lead {lead_id}. Logs tail:\n{logs[-4000:]}"
    # Ensure no failure for THIS lead id
    assert lead_id not in _extract_failed_ids(logs, fail_biz), "Business email failed for our lead"
    assert lead_id not in _extract_failed_ids(logs, fail_cust), "Customer email failed for our lead"


def _extract_failed_ids(logs: str, marker: str) -> str:
    # Simple contains check — the log lines include the exception, not the lead id.
    # We check the recent window near the marker for our lead id (best-effort).
    return "" if marker not in logs else logs


def test_create_lead_without_email_sends_owner_only(api_client):
    payload = {
        "name": "TEST QA NoEmail",
        "phone": "+919999900002",
        "property_type": "Apartment",
        "location": "Mumbai",
        "message": "QA test — no customer email provided.",
    }
    r = api_client.post(f"{BASE_URL}/api/leads", json=payload)
    assert r.status_code == 200, r.text
    data = r.json()
    assert data["status"] == "Pending"
    assert data.get("email") in (None, "")
    lead_id = data["id"]

    time.sleep(8)
    logs = _tail_backend_log()
    biz_line = f"Business notification sent for lead {lead_id}"
    cust_line = f"Customer confirmation sent for lead {lead_id}"
    assert biz_line in logs, f"Missing owner notification for no-email lead {lead_id}. Tail:\n{logs[-3000:]}"
    assert cust_line not in logs, "Customer confirmation should NOT be sent when email omitted"


def test_send_email_helper_direct():
    """Import server and call send_email directly; must return a non-null id from the proxy."""
    import server  # noqa: E402
    html = '<table role="presentation"><tr><td>QA</td></tr></table>'
    result_id = asyncio.get_event_loop().run_until_complete(
        server.send_email(to=SAFE_EMAIL, subject="QA test", html=html)
    ) if False else None  # placeholder to satisfy flake if refactored

    # Use a fresh loop to avoid conflicts
    loop = asyncio.new_event_loop()
    try:
        result_id = loop.run_until_complete(
            server.send_email(to=SAFE_EMAIL, subject="QA test", html=html)
        )
    finally:
        loop.close()

    assert result_id, f"send_email returned falsy id: {result_id!r}"
    assert isinstance(result_id, str)

#!/usr/bin/env python3
"""Delete and recreate HF Space to give git a clean history."""
import os
import sys
import time

try:
    from huggingface_hub import HfApi
except ImportError:
    print("ERROR: huggingface_hub not installed.")
    sys.exit(1)

SPACE_ID = "Nishant00/portfolio"
token = os.environ.get("HF_TOKEN", "").strip()

if not token:
    print("=" * 60)
    print("ERROR: HF_TOKEN secret is missing.")
    print("Go to: GitHub repo > Settings > Secrets and variables > Actions")
    print("Add secret   Name: HF_TOKEN   Value: HF write token")
    print("Get token at: https://huggingface.co/settings/tokens")
    print("=" * 60)
    sys.exit(1)

api = HfApi(token=token)

print(f"[1/2] Deleting old Space '{SPACE_ID}'...")
try:
    api.delete_repo(repo_id=SPACE_ID, repo_type="space")
    print("      Deleted. Waiting 10s for HF to settle...")
    time.sleep(10)
except Exception as exc:
    print(f"      Nothing to delete ({exc})")

print(f"[2/2] Creating fresh static Space...")
try:
    api.create_repo(
        repo_id=SPACE_ID,
        repo_type="space",
        space_sdk="static",
        private=False,
    )
    print("      Space created.")
    time.sleep(3)
except Exception as exc:
    print(f"ERROR creating Space: {exc}")
    sys.exit(1)

print("Space is ready.")

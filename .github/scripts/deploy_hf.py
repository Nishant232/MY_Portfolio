#!/usr/bin/env python3
"""Deploy dist/ to Hugging Face Spaces (Nishant00/portfolio).

Strategy: keep the Space alive (never delete it) to avoid subdomain
propagation delays. Always override .gitattributes first so HF's default
LFS rules don't affect any of our binary assets.
"""
import glob
import io
import os
import sys
import time

try:
    from huggingface_hub import HfApi
except ImportError:
    print("ERROR: huggingface_hub not installed.", flush=True)
    sys.exit(1)

SPACE_ID = "Nishant00/portfolio"
token = os.environ.get("HF_TOKEN", "").strip()

if not token:
    print("=" * 60, flush=True)
    print("ERROR: HF_TOKEN secret is missing.", flush=True)
    print("Go to: GitHub repo > Settings > Secrets and variables > Actions", flush=True)
    print("Add secret  Name: HF_TOKEN  Value: HF write token", flush=True)
    print("Get token: https://huggingface.co/settings/tokens", flush=True)
    print("=" * 60, flush=True)
    sys.exit(1)

# Remove any stray .gitattributes from dist/
for f in glob.glob("dist/**/.gitattributes", recursive=True):
    os.remove(f)
    print(f"Removed local {f}", flush=True)

api = HfApi(token=token)

print(f"\n[1/3] Ensuring Space '{SPACE_ID}' exists...", flush=True)
try:
    api.create_repo(
        repo_id=SPACE_ID,
        repo_type="space",
        space_sdk="static",
        private=False,
        exist_ok=True,
    )
    print("      Space ready.", flush=True)
    time.sleep(3)
except Exception as exc:
    print(f"ERROR creating/verifying Space: {exc}", flush=True)
    sys.exit(1)

print("[2/3] Clearing HF default .gitattributes LFS rules...", flush=True)
try:
    api.upload_file(
        path_or_fileobj=io.BytesIO(b"# No LFS rules\n"),
        path_in_repo=".gitattributes",
        repo_id=SPACE_ID,
        repo_type="space",
        commit_message="ci: remove LFS rules",
    )
    print("      .gitattributes cleared.", flush=True)
    time.sleep(2)
except Exception as exc:
    print(f"WARNING: Could not clear .gitattributes: {exc}", flush=True)

print("[3/3] Uploading portfolio files...", flush=True)
try:
    api.upload_folder(
        folder_path="dist",
        repo_id=SPACE_ID,
        repo_type="space",
        commit_message="ci: deploy portfolio",
        ignore_patterns=["*.map", "**/.gitattributes", ".gitattributes"],
    )
except Exception as exc:
    print(f"ERROR uploading files: {exc}", flush=True)
    sys.exit(1)

print("", flush=True)
print("=" * 60, flush=True)
print("Deployed!", flush=True)
print(f"  https://nishant00-portfolio.static.hf.space", flush=True)
print(f"  https://huggingface.co/spaces/{SPACE_ID}", flush=True)
print("=" * 60, flush=True)

#!/usr/bin/env python3
import os
import sys

try:
    from huggingface_hub import HfApi
except ImportError:
    print("ERROR: huggingface_hub not installed.")
    sys.exit(1)

SPACE_ID = "Nishant00/portfolio"
token = os.environ.get("HF_TOKEN", "").strip()

if not token:
    print("=" * 60)
    print("ERROR: HF_TOKEN secret is missing or empty.")
    print("Fix:")
    print("  1. Visit https://huggingface.co/settings/tokens")
    print("  2. Create a token with WRITE permission")
    print("  3. In GitHub repo go to:")
    print("     Settings > Secrets and variables > Actions")
    print("  4. Click 'New repository secret'")
    print("     Name : HF_TOKEN")
    print("     Value: your HuggingFace write token")
    print("=" * 60)
    sys.exit(1)

api = HfApi(token=token)

print(f"[1/2] Ensuring Space '{SPACE_ID}' exists...")
try:
    api.create_repo(
        repo_id=SPACE_ID,
        repo_type="space",
        space_sdk="static",
        exist_ok=True,
        private=False,
    )
    print("      Space OK.")
except Exception as exc:
    print(f"ERROR creating Space: {exc}")
    print("Make sure your HF_TOKEN has Write permission.")
    sys.exit(1)

print("[2/2] Uploading build files from dist/ ...")
try:
    api.upload_folder(
        folder_path="dist",
        repo_id=SPACE_ID,
        repo_type="space",
        ignore_patterns=["*.map"],
    )
except Exception as exc:
    print(f"ERROR uploading files: {exc}")
    sys.exit(1)

print("")
print("Deployed!")
print(f"  https://nishant00-portfolio.hf.space")
print(f"  https://huggingface.co/spaces/{SPACE_ID}")

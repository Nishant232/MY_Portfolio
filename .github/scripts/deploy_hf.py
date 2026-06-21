#!/usr/bin/env python3
"""Deploy dist/ to Hugging Face Spaces (Nishant00/portfolio).

Why delete+recreate?
  Previous failed runs can leave partial LFS state in the Space's git
  history. Deleting and recreating gives a guaranteed clean slate.

Why no LFS now?
  public/models/.gitattributes (which marked *.glb as LFS) has been
  removed from the project. character.glb (1.47 MB) is a regular git
  file — well under huggingface_hub's 10 MB LFS threshold — so
  upload_folder uploads it as a plain file with no LFS involvement.
"""
import glob
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
    print("Add secret  Name: HF_TOKEN  Value: HF write token")
    print("Get token: https://huggingface.co/settings/tokens")
    print("=" * 60)
    sys.exit(1)

# Safety: remove any stray .gitattributes from dist/ that could
# reintroduce LFS tracking rules (e.g. if they sneak back via Vite).
for f in glob.glob("dist/**/.gitattributes", recursive=True):
    os.remove(f)
    print(f"Removed {f}")

api = HfApi(token=token)

print(f"\n[1/3] Deleting old Space '{SPACE_ID}' (clears any stale LFS state)...")
try:
    api.delete_repo(repo_id=SPACE_ID, repo_type="space")
    print("      Deleted. Waiting 10 s for HF to settle...")
    time.sleep(10)
except Exception as exc:
    print(f"      Nothing to delete ({exc})")

print("[2/3] Creating fresh static Space...")
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

print("[3/3] Uploading portfolio files as plain files (no LFS)...")
try:
    api.upload_folder(
        folder_path="dist",
        repo_id=SPACE_ID,
        repo_type="space",
        ignore_patterns=["*.map", "**/.gitattributes", ".gitattributes"],
    )
except Exception as exc:
    print(f"ERROR uploading files: {exc}")
    sys.exit(1)

print("")
print("=" * 60)
print("Deployed!")
print(f"  https://nishant00-portfolio.hf.space")
print(f"  https://huggingface.co/spaces/{SPACE_ID}")
print("=" * 60)

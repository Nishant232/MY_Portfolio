#!/usr/bin/env python3
"""Deploy dist/ to Hugging Face Spaces (Nishant00/portfolio).

Why delete+recreate?
  Previous failed runs left an orphaned LFS pointer for models/character.glb
  in the Space's git history. Any new commit to that Space is rejected until
  the history is wiped. Deleting and recreating gives a clean slate.

Why remove .gitattributes?
  public/models/.gitattributes marks *.glb as Git LFS. Vite copies it into
  dist/, so upload_folder tries to create an LFS pointer for character.glb
  but never uploads the LFS content → commit rejected again. Removing the
  file before upload makes HF treat character.glb as a plain 1.47 MB file,
  which is well within the 10 MB regular-file limit.
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
    print("Fix:")
    print("  1. https://huggingface.co/settings/tokens")
    print("     -> New token with WRITE permission")
    print("  2. GitHub repo -> Settings -> Secrets and variables")
    print("     -> Actions -> New repository secret")
    print("     Name : HF_TOKEN")
    print("     Value: your HuggingFace write token")
    print("=" * 60)
    sys.exit(1)

# ── Step 0: Strip every .gitattributes from dist/ ───────────────────────────
ga_files = (glob.glob("dist/**/.gitattributes", recursive=True)
            + glob.glob("dist/.gitattributes"))
for f in ga_files:
    os.remove(f)
    print(f"Removed {f}  (no LFS tracking on HF)")

api = HfApi(token=token)

# ── Step 1: Delete Space to wipe any corrupted LFS git history ───────────────
print(f"\n[1/3] Clearing old Space '{SPACE_ID}'...")
try:
    api.delete_repo(repo_id=SPACE_ID, repo_type="space")
    print("      Deleted. Waiting for HF to process...")
    time.sleep(8)
except Exception:
    print("      No existing Space found (first deploy).")

# ── Step 2: Create a brand-new static Space ──────────────────────────────────
print(f"[2/3] Creating fresh static Space...")
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
    print("Make sure your HF_TOKEN has Write permission.")
    sys.exit(1)

# ── Step 3: Upload dist/ — all files as plain files, no LFS ─────────────────
print("[3/3] Uploading portfolio files (plain files, no LFS)...")
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

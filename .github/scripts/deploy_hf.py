#!/usr/bin/env python3
"""Deploy dist/ to Hugging Face Spaces (Nishant00/portfolio).

Root-cause note: public/models/.gitattributes marks *.glb as Git LFS.
Vite copies it into dist/, which makes HF reject every commit because it
sees an LFS pointer with no LFS content. We delete all .gitattributes
files from dist/ before uploading so HF treats character.glb (1.47 MB)
as a plain file — well within HF's 10 MB regular-file limit.
"""
import glob
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

# Remove every .gitattributes from dist/ so HF never sees the LFS rule
# for *.glb and uploads character.glb as a plain file instead.
ga_files = glob.glob("dist/**/.gitattributes", recursive=True) + \
           glob.glob("dist/.gitattributes")
for f in ga_files:
    os.remove(f)
    print(f"Removed {f} (prevents false LFS tracking on HF)")

api = HfApi(token=token)

print(f"\n[1/2] Creating Space '{SPACE_ID}' if it does not exist...")
try:
    api.create_repo(
        repo_id=SPACE_ID,
        repo_type="space",
        space_sdk="static",
        exist_ok=True,
        private=False,
    )
    print("      Space ready.")
except Exception as exc:
    print(f"ERROR creating Space: {exc}")
    print("Make sure your HF_TOKEN has Write permission.")
    sys.exit(1)

print("[2/2] Uploading portfolio files...")
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

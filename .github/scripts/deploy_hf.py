#!/usr/bin/env python3
"""Deploy dist/ to HuggingFace as a Docker Space (nginx on port 7860).

Docker SDK gives the clean  https://nishant00-portfolio.hf.space  URL.
Static SDK gives            https://nishant00-portfolio.static.hf.space

On first run (or when switching from static → docker) we delete the old
Space and recreate as Docker.  Subsequent runs just upload changed files.
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

SPACE_ID  = "Nishant00/portfolio"
token     = os.environ.get("HF_TOKEN", "").strip()

if not token:
    print("ERROR: HF_TOKEN secret is missing.", flush=True)
    print("Go to: GitHub repo > Settings > Secrets and variables > Actions", flush=True)
    print("Add secret  Name: HF_TOKEN  Value: HF write token", flush=True)
    sys.exit(1)

# ── Write nginx files into dist/ before uploading ────────────────────────────
DOCKERFILE = """\
FROM nginx:alpine
COPY . /usr/share/nginx/html/
COPY nginx.conf /etc/nginx/conf.d/default.conf
EXPOSE 7860
CMD ["nginx", "-g", "daemon off;"]
"""

NGINX_CONF = """\
server {
    listen 7860;
    root /usr/share/nginx/html;
    index index.html;

    gzip on;
    gzip_types text/plain text/css application/javascript application/json
               image/svg+xml application/wasm;

    # SPA fallback — serve index.html for unknown routes
    location / {
        try_files $uri $uri/ /index.html;
    }

    # Long-term cache for hashed assets
    location /assets/ {
        expires 1y;
        add_header Cache-Control "public, immutable";
    }
}
"""

os.makedirs("dist", exist_ok=True)
with open("dist/Dockerfile",  "w") as f:
    f.write(DOCKERFILE)
with open("dist/nginx.conf",  "w") as f:
    f.write(NGINX_CONF)
print("Created Dockerfile and nginx.conf in dist/", flush=True)

# Remove any stray .gitattributes from dist/
for f in glob.glob("dist/**/.gitattributes", recursive=True):
    os.remove(f)
    print(f"Removed {f}", flush=True)

# ── Ensure a Docker Space exists ─────────────────────────────────────────────
api = HfApi(token=token)

print(f"\n[1/3] Checking Space '{SPACE_ID}'...", flush=True)
need_create = False
try:
    info = api.space_info(repo_id=SPACE_ID)
    if getattr(info, "sdk", None) != "docker":
        print("      Space exists but is NOT Docker SDK — recreating...", flush=True)
        api.delete_repo(repo_id=SPACE_ID, repo_type="space")
        print("      Deleted. Waiting 15 s...", flush=True)
        time.sleep(15)
        need_create = True
    else:
        print("      Docker Space already exists.", flush=True)
except Exception:
    need_create = True

if need_create:
    print("      Creating Docker Space...", flush=True)
    try:
        api.create_repo(
            repo_id=SPACE_ID,
            repo_type="space",
            space_sdk="docker",
            private=False,
        )
        print("      Space created.", flush=True)
        time.sleep(5)
    except Exception as exc:
        print(f"ERROR creating Space: {exc}", flush=True)
        sys.exit(1)

# ── Clear HF's default .gitattributes ────────────────────────────────────────
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

# ── Upload dist/ (includes Dockerfile + nginx.conf) ──────────────────────────
print("[3/3] Uploading portfolio files + Dockerfile...", flush=True)
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
print("Files uploaded! Docker build starting on HF (~2-3 min)...", flush=True)
print(f"  https://nishant00-portfolio.hf.space", flush=True)
print(f"  https://huggingface.co/spaces/{SPACE_ID}", flush=True)
print("=" * 60, flush=True)

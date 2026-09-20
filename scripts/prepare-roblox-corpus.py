"""Build a local JSONL corpus from the Roblox sources used by Vibe Studio.

This is deliberately an export/preparation step. It does not silently fine-tune
a hosted model. The web app uses the checked-in skill material as RAG context;
this script creates a clean corpus for an optional Hugging Face training job.

Examples:
  python scripts/prepare-roblox-corpus.py --output data/training/roblox.jsonl --max-rows 50000
  python scripts/prepare-roblox-corpus.py --dataset Roblox/luau_corpus --output data/training/luau.jsonl
"""

from __future__ import annotations

import argparse
import json
import os
from pathlib import Path
from typing import Any, Iterable


DEFAULT_DATASETS = [
    "Roblox/luau_corpus",
    "487798RGW/Roblox-Luau-Reasoning-v1.0",
]


def iter_skill_files(root: Path) -> Iterable[dict[str, Any]]:
    for source_root in (root / ".knowledge", root / ".claude" / "skills"):
        if not source_root.exists():
            continue
        for path in source_root.rglob("*.md"):
            text = path.read_text(encoding="utf-8", errors="ignore").strip()
            if text:
                yield {
                    "source": str(path.relative_to(root)),
                    "kind": "skill",
                    "prompt": f"Apply the Roblox development guidance in {path.name}.",
                    "completion": text,
                }


def iter_huggingface(dataset_id: str, max_rows: int | None) -> Iterable[dict[str, Any]]:
    try:
        from datasets import load_dataset  # type: ignore
    except ImportError as exc:
        raise RuntimeError("Install the optional training dependencies with: pip install -r requirements-training.txt") from exc

    stream = load_dataset(dataset_id, split="train", streaming=True)
    for index, row in enumerate(stream):
        if max_rows is not None and index >= max_rows:
            break
        row = dict(row)
        prompt = row.get("prompt") or row.get("instruction") or row.get("question") or ""
        completion = row.get("code") or row.get("response") or row.get("explanation") or ""
        if not prompt or not completion:
            continue
        yield {
            "source": dataset_id,
            "kind": "dataset",
            "prompt": str(prompt),
            "completion": str(completion),
        }


def main() -> None:
    parser = argparse.ArgumentParser()
    parser.add_argument("--output", type=Path, default=Path("data/training/roblox.jsonl"))
    parser.add_argument("--dataset", action="append", dest="datasets", help="Hugging Face dataset id; repeat for more than one")
    parser.add_argument("--max-rows", type=int, default=10000)
    parser.add_argument("--skip-skills", action="store_true")
    args = parser.parse_args()

    root = Path(__file__).resolve().parents[1]
    args.output.parent.mkdir(parents=True, exist_ok=True)
    rows: list[dict[str, Any]] = []
    if not args.skip_skills:
        rows.extend(iter_skill_files(root))

    for dataset_id in args.datasets or DEFAULT_DATASETS:
        try:
            rows.extend(iter_huggingface(dataset_id, args.max_rows))
        except Exception as exc:  # keep one unavailable source from blocking the others
            print(f"warning: skipped {dataset_id}: {exc}")

    with args.output.open("w", encoding="utf-8") as handle:
        for row in rows:
            handle.write(json.dumps(row, ensure_ascii=False) + "\n")
    print(f"wrote {len(rows):,} examples to {args.output}")


if __name__ == "__main__":
    main()

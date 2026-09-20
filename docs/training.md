# Roblox knowledge and training workflow

Vibe Studio uses retrieval-augmented generation in the web app. The Roblox
skill repositories are mirrored under `.knowledge/` and the most relevant
chunks are selected for each request. That makes the app useful without
retraining a model or checking a multi-gigabyte dataset into the repository.

The optional `scripts/prepare-roblox-corpus.py` script exports the mirrored
skills and the code/reasoning Hugging Face datasets to JSONL. It is the handoff
point for a separate fine-tuning job with a model and GPU that you control.
Image datasets and the uploaded icon archive stay in the visual asset path;
they should be used as retrieval references or for a licensed image-training
run rather than mixed into the Luau text corpus.

The uploaded archive contains 43,115 icons and 100,750 thumbnails. The app
ships a small sample in `public/assets/dataset/` and can index a mounted local
library when `VIBE_ASSET_LIBRARY` points at its extracted icon directory. The archive README states that
the artwork remains the property of its original creators.

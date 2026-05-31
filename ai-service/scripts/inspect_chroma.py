"""
Standalone ChromaDB inspection helper.

Usage:
    from scripts.inspect_chroma import inspect_user_docs
    inspect_user_docs("usr_test")
"""

from chromadb import PersistentClient

import config


client = PersistentClient(path=config.CHROMA_DATA_DIR)
collection = client.get_or_create_collection(config.CHROMA_COLLECTION_NAME)


def inspect_user_docs(user_id: str):
    """Print stored Chroma documents for a user and return the raw result."""
    results = collection.get(
        where={"user_id": user_id},
        include=["documents", "metadatas"],
    )

    documents = results.get("documents", [])
    metadatas = results.get("metadatas", [])
    ids = results.get("ids", [])

    for index, doc in enumerate(documents):
        print(f"\n--- Chunk {index} ---")
        print(f"ID: {ids[index] if index < len(ids) else 'unknown'}")
        print(f"Meta: {metadatas[index] if index < len(metadatas) else {}}")
        print(f"Text: {(doc or '')[:200]}...")

    return results


if __name__ == "__main__":
    import argparse

    parser = argparse.ArgumentParser(description="Inspect ChromaDB documents for a user")
    parser.add_argument("user_id", help="User ID to inspect")
    args = parser.parse_args()

    inspect_user_docs(args.user_id)
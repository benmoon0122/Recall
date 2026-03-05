import os, json, uuid
from datetime import datetime

def _load_json(path: str):
    with open(path, "r", encoding="utf-8") as f:
        return json.load(f)

def parse_slack_export(export_dir: str):
    """
    Parses a Slack export folder into normalized "documents".
    Each document is one thread (thread_ts) if possible, otherwise one message.
    Output: list of dicts with document_id, text, and metadata.
    """

    # Optional: map user IDs to display names
    users_path = os.path.join(export_dir, "users.json")
    user_map = {}
    if os.path.exists(users_path):
        for u in _load_json(users_path):
            uid = u.get("id")
            name = u.get("profile", {}).get("display_name") or u.get("name") or uid
            user_map[uid] = name

    documents = []

    # Each channel is a directory inside export_dir
    for entry in os.listdir(export_dir):
        chan_dir = os.path.join(export_dir, entry)
        if not os.path.isdir(chan_dir):
            continue
        channel_name = entry

        # Load all day files in that channel
        messages = []
        for fname in sorted(os.listdir(chan_dir)):
            if fname.endswith(".json"):
                messages.extend(_load_json(os.path.join(chan_dir, fname)))

        # Group messages by thread
        threads = {}
        for m in messages:
            text = (m.get("text") or "").strip()
            if not text:
                continue

            # Skip some noisy system messages (safe for MVP)
            if m.get("subtype") in {"channel_join", "channel_leave"}:
                continue

            ts = m.get("ts")
            if not ts:
                continue

            thread_ts = m.get("thread_ts") or ts
            threads.setdefault(thread_ts, []).append(m)

        # Build one document per thread
        for thread_ts, msgs in threads.items():
            msgs.sort(key=lambda x: float(x.get("ts", "0")))

            lines = []
            participants = set()

            start_ts = msgs[0].get("ts")
            end_ts = msgs[-1].get("ts")

            for m in msgs:
                uid = m.get("user") or "unknown"
                name = user_map.get(uid, uid)
                participants.add(name)

                ts = m.get("ts")
                try:
                    dt = datetime.fromtimestamp(float(ts))
                    ts_str = dt.strftime("%Y-%m-%d %H:%M:%S")
                except Exception:
                    ts_str = ts

                lines.append(f"{ts_str} {name}: {(m.get('text') or '').strip()}")

            documents.append({
                "document_id": str(uuid.uuid4()),
                "source": "slack_export",
                "channel": channel_name,
                "thread_ts": thread_ts,
                "participants": sorted(participants),
                "start_ts": start_ts,
                "end_ts": end_ts,
                "title": f"Slack thread in #{channel_name}",
                "text": "\n".join(lines),
                "metadata": {"message_count": len(msgs)},
            })

    return documents
import os
import time
from datetime import datetime

import psycopg

DB_HOST = os.getenv("DB_HOST", "db")
DB_PORT = int(os.getenv("DB_PORT", "5432"))
DB_USER = os.getenv("DB_USER", "todo")
DB_PASSWORD = os.getenv("DB_PASSWORD", "todo")
DB_NAME = os.getenv("DB_NAME", "todo")
INTERVAL_SECONDS = int(os.getenv("STATS_INTERVAL_SECONDS", "30"))


def query_stats():
  with psycopg.connect(
    host=DB_HOST,
    port=DB_PORT,
    user=DB_USER,
    password=DB_PASSWORD,
    dbname=DB_NAME,
    autocommit=True,
  ) as conn:
    with conn.cursor() as cursor:
      cursor.execute(
        """
        SELECT status, COUNT(*)
        FROM tasks
        GROUP BY status
        ORDER BY status
        """
      )
      by_status = {status: total for status, total in cursor.fetchall()}

      cursor.execute("SELECT COUNT(*) FROM tasks")
      total = cursor.fetchone()[0]

  return total, by_status


def main():
  while True:
    try:
      total, by_status = query_stats()
      print(
        f"[{datetime.utcnow().isoformat()}Z] total={total} by_status={by_status}",
        flush=True,
      )
    except Exception as exc:
      print(f"Stats service error: {exc}", flush=True)

    time.sleep(INTERVAL_SECONDS)


if __name__ == "__main__":
  main()

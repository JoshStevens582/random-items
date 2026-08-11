from pathlib import Path

BASE_DIR = Path(__file__).resolve().parent.parent.parent
DATABASE_URL = f"sqlite:///{BASE_DIR / 'items.db'}"
APP_TITLE = "Random Items API"

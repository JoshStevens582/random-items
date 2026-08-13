import pytest

from random_items.config import Settings


def _clear_settings_env(monkeypatch: pytest.MonkeyPatch) -> None:
    for key in ("APP_TITLE", "DATABASE_URL", "CORS_ORIGINS", "HOST", "PORT", "ENV"):
        monkeypatch.delenv(key, raising=False)


def test_settings_defaults(monkeypatch: pytest.MonkeyPatch) -> None:
    _clear_settings_env(monkeypatch)
    values = Settings(_env_file=None)
    assert values.host == "127.0.0.1"
    assert values.port == 8000
    assert values.env == "development"
    assert values.reload is True
    assert values.cors_origins == [
        "http://127.0.0.1:5173",
        "http://localhost:5173",
    ]
    assert values.database_url.endswith("items.db")


def test_production_env_disables_reload(monkeypatch: pytest.MonkeyPatch) -> None:
    _clear_settings_env(monkeypatch)
    monkeypatch.setenv("ENV", "production")
    values = Settings(_env_file=None)
    assert values.reload is False


def test_cors_origins_from_comma_separated_env(
    monkeypatch: pytest.MonkeyPatch,
) -> None:
    _clear_settings_env(monkeypatch)
    monkeypatch.setenv(
        "CORS_ORIGINS",
        "https://example.com, https://app.example.com",
    )
    values = Settings(_env_file=None)
    assert values.cors_origins == [
        "https://example.com",
        "https://app.example.com",
    ]

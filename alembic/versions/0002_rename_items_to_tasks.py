"""rename items to tasks and content to title

Revision ID: 0002
Revises: 0001
Create Date: 2026-08-20

"""

from collections.abc import Sequence

from alembic import op

revision: str = "0002"
down_revision: str | Sequence[str] | None = "0001"
branch_labels: str | Sequence[str] | None = None
depends_on: str | Sequence[str] | None = None


def upgrade() -> None:
    with op.batch_alter_table("items") as batch_op:
        batch_op.alter_column("content", new_column_name="title")
    op.rename_table("items", "tasks")


def downgrade() -> None:
    op.rename_table("tasks", "items")
    with op.batch_alter_table("items") as batch_op:
        batch_op.alter_column("title", new_column_name="content")

"""add priority and due_date columns

Revision ID: 0004
Revises: 0003
Create Date: 2026-08-28

"""

from collections.abc import Sequence

import sqlalchemy as sa
from alembic import op

revision: str = "0004"
down_revision: str | Sequence[str] | None = "0003"
branch_labels: str | Sequence[str] | None = None
depends_on: str | Sequence[str] | None = None


def upgrade() -> None:
    with op.batch_alter_table("tasks") as batch_op:
        batch_op.add_column(
            sa.Column(
                "priority",
                sa.String(length=20),
                nullable=False,
                server_default="medium",
            )
        )
        batch_op.add_column(
            sa.Column(
                "due_date",
                sa.Date(),
                nullable=True,
            )
        )


def downgrade() -> None:
    with op.batch_alter_table("tasks") as batch_op:
        batch_op.drop_column("due_date")
        batch_op.drop_column("priority")

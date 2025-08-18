"""merge heads

Revision ID: f5b7b6699bfe
Revises: 20250818_fastapi_users_add_fields, 3e5a5b2d3e91
Create Date: 2025-08-18 18:44:31.153235

"""
from typing import Sequence, Union

from alembic import op
import sqlalchemy as sa


# revision identifiers, used by Alembic.
revision: str = 'f5b7b6699bfe'
down_revision: Union[str, Sequence[str], None] = ('20250818_fastapi_users_add_fields', '3e5a5b2d3e91')
branch_labels: Union[str, Sequence[str], None] = None
depends_on: Union[str, Sequence[str], None] = None


def upgrade() -> None:
    """Upgrade schema."""
    pass


def downgrade() -> None:
    """Downgrade schema."""
    pass

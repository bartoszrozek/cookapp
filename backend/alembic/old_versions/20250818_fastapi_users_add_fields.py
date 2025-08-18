"""Make users table compatible with fastapi-users

Revision ID: 20250818_fastapi_users_add_fields
Revises: 
Create Date: 2025-08-18
"""
from alembic import op
import sqlalchemy as sa
from sqlalchemy import inspect

# revision identifiers, used by Alembic.
revision = '20250818_fastapi_users_add_fields'
down_revision = None
branch_labels = None
depends_on = None


def upgrade():
    bind = op.get_bind()
    inspector = inspect(bind)
    cols = [c['name'] for c in inspector.get_columns('users')]

    # Rename password_hash -> hashed_password when present
    if 'password_hash' in cols and 'hashed_password' not in cols:
        try:
            op.alter_column('users', 'password_hash', new_column_name='hashed_password')
        except Exception:
            # fall back to add+copy if rename unsupported
            op.add_column('users', sa.Column('hashed_password', sa.String(), nullable=True))
            op.execute("UPDATE users SET hashed_password = password_hash")
            # leaving password_hash for manual cleanup

    # Add hashed_password if neither exists
    if 'hashed_password' not in cols and 'password_hash' not in cols:
        op.add_column('users', sa.Column('hashed_password', sa.String(), nullable=True))

    # Add flags with sensible defaults
    if 'is_active' not in cols:
        op.add_column('users', sa.Column('is_active', sa.Boolean(), nullable=False, server_default=sa.true()))
    if 'is_superuser' not in cols:
        op.add_column('users', sa.Column('is_superuser', sa.Boolean(), nullable=False, server_default=sa.false()))
    if 'is_verified' not in cols:
        op.add_column('users', sa.Column('is_verified', sa.Boolean(), nullable=False, server_default=sa.false()))


def downgrade():
    bind = op.get_bind()
    inspector = inspect(bind)
    cols = [c['name'] for c in inspector.get_columns('users')]

    # Remove added columns if present
    if 'is_verified' in cols:
        op.drop_column('users', 'is_verified')
    if 'is_superuser' in cols:
        op.drop_column('users', 'is_superuser')
    if 'is_active' in cols:
        op.drop_column('users', 'is_active')

    # Try to rename hashed_password back to password_hash if appropriate
    if 'hashed_password' in cols and 'password_hash' not in cols:
        try:
            op.alter_column('users', 'hashed_password', new_column_name='password_hash')
        except Exception:
            # If rename unsupported, leave columns as-is
            pass

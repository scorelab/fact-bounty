from __future__ import annotations
db_fd: int
db_path: str

import tempfile

db_fd, db_path = tempfile.mkstemp()
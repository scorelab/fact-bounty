# -*- coding: utf-8 -*-
"""Database module, including the SQLAlchemy database object \
and DB-related utilities."""
from .extensions import db

# Alias common SQLAlchemy names
Column = db.Column
Model = db.Model

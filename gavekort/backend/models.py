#Databasemodeller (Gavekort, Transaksjon osv)
from flask_sqlalchemy import SQLAlchemy

db = SQLAlchemy()

class Gavekort(db.Model):
    id = db.Column(db.Integer, primary_key=True)
    belop = db.Column(db.Integer, nullable=False)
    brukt = db.Column(db.Integer, nullable=False, default=0)
    igjen = db.Column(db.Integer, nullable=False)
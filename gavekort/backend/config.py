#Databasekonfigurasjon
# backend/config.py
class Config:
    SQLALCHEMY_DATABASE_URI = "sqlite:///gavekort.db"
    SQLALCHEMY_TRACK_MODIFICATIONS = False
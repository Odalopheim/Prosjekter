
# Prosjekter

Dette repositoryet inneholder to separate prosjekter:

- `food_choser` - en .NET-app som hjelper deg med forslag til hvilken mat du skal ha.
- `gavekort` - en Flask-basert gavekortløsning med database, kjøp, sjekk av saldo og bruk av gavekort.

## food_choser

`food_choser` er en liten .NET-webapp. Prosjektet er satt opp med SQLite og kan bygges og kjøres direkte fra mappen `food_choser`.

### Starte prosjektet

Gå til mappen:

```powershell
cd food_choser
```

Kjør appen:

```powershell
dotnet run
```

Hvis du vil bygge først, kan du bruke:

```powershell
dotnet build
```

## gavekort

`gavekort` er et Python/Flask-prosjekt som lar deg opprette gavekort, sjekke saldo og bruke saldo. Backend bruker SQLite og lager databasen automatisk når appen starter.

### Krav

- Python
- pip

### Installere avhengigheter

Gå til hovedmappen for `gavekort`, og installer pakkene fra `requirements.txt`:

```powershell
cd gavekort
pip install -r requirements.txt
```

### Starte backend

Gå inn i backend-mappen og start Flask-appen:

```powershell
cd gavekort\backend
python app.py
```

Backend kjører da vanligvis på `http://127.0.0.1:5000`.

### Bruke frontend

Frontend ligger i `gavekort/forntend`. Du kan åpne `index.html` direkte i nettleseren, eller bruke en lokal webserver som Live Server i VS Code.

## Kort oppsummert

- `food_choser` starter med `dotnet run`
- `gavekort` starter backend med `python app.py`
- `gavekort`-frontend åpnes i nettleseren




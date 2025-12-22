using System;
using System.Collections.Generic;
using System.Linq;
using Microsoft.Data.Sqlite;
using Microsoft.AspNetCore.Builder;
using System.Net;
using System.Text.Json;
using System.IO;
using Microsoft.Extensions.DependencyInjection;

var builder = WebApplication.CreateBuilder(args);

// Configure JSON serialization to use camelCase
builder.Services.ConfigureHttpJsonOptions(options =>
{
    options.SerializerOptions.PropertyNamingPolicy = JsonNamingPolicy.CamelCase;
});

// Database path
const string DbPath = "food.db";

// Initialize database
InitializeDatabase(DbPath);

var app = builder.Build();

app.UseStaticFiles(); // Serve HTML, CSS, JS fra wwwroot

// API endpoints
// API endpoints
app.MapGet("/api/kategorier", () => 
{
    var result = GetKategorier(DbPath);
    Console.WriteLine($"Returnerer {result.Count} kategorier");
    return result;
});

app.MapGet("/api/land", () => 
{
    var result = GetLand(DbPath);
    Console.WriteLine($"Returnerer {result.Count} land");
    return result;
});

app.MapPost("/api/retter", (RettRequest request) => AddRett(request, DbPath));

app.MapGet("/api/retter", () => GetRetter(DbPath));

app.Run();

// Database functions
void InitializeDatabase(string dbPath)
{
    using var connection = new SqliteConnection($"Data Source={dbPath}");
    connection.Open();

    Execute(connection, @"
        CREATE TABLE IF NOT EXISTS kategorier (
            kategori_id INTEGER PRIMARY KEY,
            navn TEXT NOT NULL
        );
    ");

    Execute(connection, @"
        CREATE TABLE IF NOT EXISTS land (
            land_id INTEGER PRIMARY KEY,
            navn TEXT NOT NULL
        );
    ");

    Execute(connection, @"
        CREATE TABLE IF NOT EXISTS retter (
            rett_id INTEGER PRIMARY KEY,
            navn TEXT NOT NULL,
            tid INTEGER,
            ganger_valgt INTEGER DEFAULT 0,
            kategori_id INTEGER,
            land_id INTEGER,
            FOREIGN KEY (kategori_id) REFERENCES kategorier(kategori_id),
            FOREIGN KEY (land_id) REFERENCES land(land_id)
        );
    ");

    Execute(connection, @"
        INSERT OR IGNORE INTO kategorier (kategori_id, navn) VALUES
            (1, 'Ku'),
            (2, 'Svin'),
            (3, 'Kylling'),
            (4, 'Vegetar'),
            (5, 'Vegansk');
    ");

    Execute(connection, @"
        INSERT OR IGNORE INTO land (land_id, navn) VALUES
            (1, 'Indisk'),
            (2, 'Italiensk'),
            (3, 'Meksikansk'),
            (4, 'Norsk');
    ");
}

void Execute(SqliteConnection conn, string sql)
{
    using var cmd = conn.CreateCommand();
    cmd.CommandText = sql;
    cmd.ExecuteNonQuery();
}

List<Kategori> GetKategorier(string dbPath)
{
    var kategorier = new List<Kategori>();
    using var connection = new SqliteConnection($"Data Source={dbPath}");
    connection.Open();
    using var cmd = connection.CreateCommand();
    cmd.CommandText = "SELECT kategori_id, navn FROM kategorier";
    using var reader = cmd.ExecuteReader();
    while (reader.Read())
    {
        kategorier.Add(new Kategori 
        { 
            KategoriId = reader.GetInt32(0), 
            Navn = reader.GetString(1) 
        });
    }
    return kategorier;
}

List<Land> GetLand(string dbPath)
{
    var land = new List<Land>();
    using var connection = new SqliteConnection($"Data Source={dbPath}");
    connection.Open();
    using var cmd = connection.CreateCommand();
    cmd.CommandText = "SELECT land_id, navn FROM land";
    using var reader = cmd.ExecuteReader();
    while (reader.Read())
    {
        land.Add(new Land 
        { 
            LandId = reader.GetInt32(0), 
            Navn = reader.GetString(1) 
        });
    }
    return land;
}

List<Rett> GetRetter(string dbPath)
{
    var retter = new List<Rett>();
    using var connection = new SqliteConnection($"Data Source={dbPath}");
    connection.Open();
    using var cmd = connection.CreateCommand();
    cmd.CommandText = @"
        SELECT r.rett_id, r.navn, k.navn, l.navn, r.ganger_valgt 
        FROM retter r 
        LEFT JOIN kategorier k ON r.kategori_id = k.kategori_id
        LEFT JOIN land l ON r.land_id = l.land_id
    ";
    using var reader = cmd.ExecuteReader();
    while (reader.Read())
    {
        retter.Add(new Rett 
        { 
            RettId = reader.GetInt32(0),
            Navn = reader.GetString(1),
            Kategori = reader.GetString(2),
            Land = reader.GetString(3),
            GangerValgt = reader.GetInt32(4)
        });
    }
    return retter;
}

void AddRett(RettRequest request, string dbPath)
{
    using var connection = new SqliteConnection($"Data Source={dbPath}");
    connection.Open();
    using var cmd = connection.CreateCommand();
    cmd.CommandText = @"
        INSERT INTO retter (navn, kategori_id, land_id, ganger_valgt) 
        VALUES (@navn, @kategori_id, @land_id, 0)
    ";
    cmd.Parameters.AddWithValue("@navn", request.Navn);
    cmd.Parameters.AddWithValue("@kategori_id", request.KategoriId);
    cmd.Parameters.AddWithValue("@land_id", request.LandId);
    cmd.ExecuteNonQuery();
}

// Models
class Kategori 
{ 
    public int KategoriId { get; set; } 
    public string? Navn { get; set; } 
}

class Land 
{ 
    public int LandId { get; set; } 
    public string? Navn { get; set; } 
}

class Rett 
{ 
    public int RettId { get; set; } 
    public string? Navn { get; set; } 
    public string? Kategori { get; set; } 
    public string? Land { get; set; } 
    public int GangerValgt { get; set; } 
}

record RettRequest(string Navn, int KategoriId, int LandId);
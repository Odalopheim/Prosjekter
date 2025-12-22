using System;
using Microsoft.Data.Sqlite;

class Program
{
    static void Main()
    {
        Console.WriteLine("Connecting to SQLite...");

        using var connection = new SqliteConnection("Data Source=food.db");
        connection.Open();

        Console.WriteLine("Connected!");

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

        Console.WriteLine("Tables and data ensured.");
    }

    static void Execute(SqliteConnection conn, string sql)
    {
        using var cmd = conn.CreateCommand();
        cmd.CommandText = sql;
        cmd.ExecuteNonQuery();
    }
}
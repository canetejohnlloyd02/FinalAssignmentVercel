require("dotenv").config();

const express = require("express");
const { neon } = require("@neondatabase/serverless");

const app = express();
const PORT = 3000;

const sql = neon(process.env.DATABASE_URL);

app.use(express.json());
app.use(express.static("public"));

app.get("/movies", async (req, res) => {
    try {
        const movies = await sql`
            SELECT * FROM movies
            ORDER BY id;
        `;

        res.json(movies);
    } catch (error) {
        console.error("DATABASE ERROR:", error);
        res.status(500).json({ error: "Database error" });
    }
}); app.post("/movies", async (req, res) => {
    try {
        const { title, director, year } = req.body;

        const result = await sql`
            INSERT INTO movies (title, director, year)
            VALUES (${title}, ${director}, ${year})
            RETURNING *;
        `;

        res.json(result[0]);
    } catch (error) {
        console.error("DATABASE ERROR:", error);
        res.status(500).json({ error: "Database error" });
    }
});

app.put("/movies/:id", async (req, res) => {
    try {
        const { id } = req.params;
        const { title, director, year } = req.body;

        const result = await sql`
            UPDATE movies
            SET title = ${title},
                director = ${director},
                year = ${year}
            WHERE id = ${id}
            RETURNING *;
        `;

        res.json(result[0]);
    } catch (error) {
        console.error("DATABASE ERROR:", error);
        res.status(500).json({ error: "Database error" });
    }
});



app.delete("/movies/:id", async (req, res) => {
    try {
        const { id } = req.params;

        const result = await sql`
            DELETE FROM movies
            WHERE id = ${id}
            RETURNING *;
        `;

        res.json(result[0]);
    } catch (error) {
        console.error("DATABASE ERROR:", error);
        res.status(500).json({ error: "Database error" });
    }
});

if (require.main === module) {
    app.listen(PORT, () => {
        console.log(`Server running on http://localhost:${PORT}`);
    });
}

module.exports = app;
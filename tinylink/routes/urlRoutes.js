// routes/urlRoutes.js  (ESM fixed version)
import express from "express";
import { nanoid } from "nanoid";
import db from "../db.js";

const router = express.Router();

// Home page
router.get("/", async (req, res) => {
  try {
    const links = await db.query("SELECT * FROM links ORDER BY id DESC");
    res.render("index", { links: links.rows });
  } catch (err) {
    console.error(err);
    res.render("index", { links: [] });
  }
});

// API endpoint for AJAX shorten button
router.post("/api/shorten", async (req, res) => {
  try {
    const { destination } = req.body;

    if (!destination)
      return res.status(400).json({ error: "Missing destination URL" });

    // Correct regex (no double escaping!)
    if (!/^https?:\/\//i.test(destination)) {
      return res
        .status(400)
        .json({ error: "URL must start with http:// or https://" });
    }

    const code = nanoid(7);

    const query =
      "INSERT INTO links (short_code, destination) VALUES ($1, $2) RETURNING *";
    const values = [code, destination];

    const result = await db.query(query, values);

    return res.json({ ok: true, link: result.rows[0] });
  } catch (error) {
    console.error(error);
    return res.status(500).json({ error: "Server error" });
  }
});

// Fallback redirect route
router.get("/:short", async (req, res) => {
  try {
    const { short } = req.params;

    const result = await db.query(
      "SELECT * FROM links WHERE short_code = $1",
      [short]
    );

    if (result.rows.length === 0) {
      return res.status(404).send("Short link not found");
    }

    await db.query(
      "UPDATE links SET clicks = clicks + 1 WHERE short_code = $1",
      [short]
    );

    return res.redirect(result.rows[0].destination);
  } catch (error) {
    console.error(error);
    return res.status(500).send("Server error");
  }
});

export default router;

const express = require("express");
const cors = require("cors");
const pool = require("./db");


const app = express();
const PORT = process.env.PORT || 5000;

app.use(cors());
app.use(express.json());

app.get("/", (req, res) => {
    res.json({
        message: "Family Tree API is running"
    });
});

app.get("/health", (req, res) => {
    res.json({
        status: "healthy"
    });
});

app.get("/api/db-test", async (req, res) => {
    try {
        const result = await pool.query(
            "SELECT COUNT(*) FROM family_members"
        );

        res.json({
            database: "connected",
            family_members: Number(result.rows[0].count)
        });
} catch (error) {
    console.error("DATABASE ERROR:", error);

    res.status(500).json({
        database: "connection failed",
        error: error.message,
        code: error.code,
        hostname: error.hostname
    });
}
});

app.get("/api/members", async (req, res) => {
    try {
        const result = await pool.query(`
            SELECT
                id,
                name,
                phone,
                email,
                location,
                gender,
                date_of_birth,
                photo_url
            FROM family_members
            ORDER BY id;
        `);

        res.json({
            count: result.rows.length,
            members: result.rows
        });

    } catch (error) {
        console.error(error);

        res.status(500).json({
            error: "Failed to fetch family members"
        });
    }
});

app.get("/api/relationships", async (req, res) => {
    try {
        const result = await pool.query(`
            SELECT
                r.id,
                r.member_id,
                m1.name AS member_name,
                r.related_member_id,
                m2.name AS related_member_name,
                r.relationship_type
            FROM relationships r
            JOIN family_members m1
                ON r.member_id = m1.id
            JOIN family_members m2
                ON r.related_member_id = m2.id
            ORDER BY r.id;
        `);

        res.json({
            count: result.rows.length,
            relationships: result.rows
        });

    } catch (error) {
        console.error(error);

        res.status(500).json({
            error: "Failed to fetch relationships"
        });
    }
});

app.post("/api/members", async (req, res) => {
    try {
        const {
            name,
            phone,
            email,
            location,
            gender,
            date_of_birth,
            photo_url
        } = req.body;

        if (!name || !name.trim()) {
            return res.status(400).json({
                error: "Name is required"
            });
        }

        const result = await pool.query(
            `
            INSERT INTO family_members
                (name, phone, email, location, gender, date_of_birth, photo_url)
            VALUES
                ($1, $2, $3, $4, $5, $6, $7)
            RETURNING
                id,
                name,
                phone,
                email,
                location,
                gender,
                date_of_birth,
                photo_url
            `,
            [
                name.trim(),
                phone || null,
                email || null,
                location || null,
                gender || null,
                date_of_birth || null,
                photo_url || null
            ]
        );

        res.status(201).json({
            message: "Family member added successfully",
            member: result.rows[0]
        });

    } catch (error) {
        console.error(error);

        res.status(500).json({
            error: "Failed to add family member"
        });
    }
});

app.post("/api/relationships", async (req, res) => {
    try {
        const {
            member_id,
            related_member_id,
            relationship_type
        } = req.body;

        if (
            !member_id ||
            !related_member_id ||
            !relationship_type
        ) {
            return res.status(400).json({
                error: "member_id, related_member_id and relationship_type are required"
            });
        }

        if (Number(member_id) === Number(related_member_id)) {
            return res.status(400).json({
                error: "A member cannot have a relationship with themselves"
            });
        }

        const result = await pool.query(
            `
            INSERT INTO relationships
                (member_id, related_member_id, relationship_type)
            VALUES
                ($1, $2, $3)
            RETURNING
                id,
                member_id,
                related_member_id,
                relationship_type,
                created_at
            `,
            [
                Number(member_id),
                Number(related_member_id),
                relationship_type
            ]
        );

        res.status(201).json({
            message: "Relationship added successfully",
            relationship: result.rows[0]
        });

    } catch (error) {
        console.error(error);

        if (error.code === "23505") {
            return res.status(409).json({
                error: "This relationship already exists"
            });
        }

        if (error.code === "23503") {
            return res.status(400).json({
                error: "One or both members do not exist"
            });
        }

        res.status(500).json({
            error: "Failed to add relationship"
        });
    }
});

app.get("/api/members/:id/family", async (req, res) => {
    try {
        const memberId = Number(req.params.id);

        if (!Number.isInteger(memberId)) {
            return res.status(400).json({
                error: "Invalid member ID"
            });
        }

        const memberResult = await pool.query(
            `
            SELECT
                id,
                name,
                phone,
                email,
                location,
                gender,
                date_of_birth,
                photo_url
            FROM family_members
            WHERE id = $1
            `,
            [memberId]
        );

        if (memberResult.rows.length === 0) {
            return res.status(404).json({
                error: "Family member not found"
            });
        }

        const relationshipsResult = await pool.query(
            `
            SELECT
                r.id,
                r.relationship_type,
                r.member_id,
                m1.name AS member_name,
                r.related_member_id,
                m2.name AS related_member_name
            FROM relationships r
            JOIN family_members m1
                ON r.member_id = m1.id
            JOIN family_members m2
                ON r.related_member_id = m2.id
            WHERE r.member_id = $1
               OR r.related_member_id = $1
            ORDER BY r.id
            `,
            [memberId]
        );

        res.json({
            member: memberResult.rows[0],
            relationships: relationshipsResult.rows
        });

    } catch (error) {
        console.error(error);

        res.status(500).json({
            error: "Failed to fetch family information"
        });
    }
});

if (require.main === module) {
    app.listen(PORT, "0.0.0.0", () => {
        console.log(`Server running on http://localhost:${PORT}`);
    });
}

module.exports = app;
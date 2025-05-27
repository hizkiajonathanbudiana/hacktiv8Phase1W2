const pool = require("../config/connect");
const { Author, AuthorDetail, Post, PostDetail } = require("./class");

class Model {
    static async getAllAuthors() {
        const query = `
            SELECT * FROM "Authors"
        ;`
        try {
            const { rows } = await pool.query(query);
            return rows.map(r => new Author(r.id, r.fullName, r.gender));
        } catch (error) {
            throw error;
        }
    }

    static async getAuthorDetails() {
        const query = `
            SELECT a.id, a."fullName", a.gender,
            COUNT(p.id) AS "totalPost",
            SUM(p."totalVote") AS "totalVoteSum", 
            ROUND(AVG(p."estimatedTime"),1) AS "averageTime"
            FROM "Authors" a
            LEFT JOIN "Posts" p ON a.id = p."AuthorId"
            GROUP BY a.id, a."fullName", a.gender
            ORDER BY a.id;
        `;
        try {
            const { rows } = await pool.query(query);
            return rows.map(r => new AuthorDetail(r.id, r.fullName, r.gender, +r.totalPost, +r.totalVoteSum, +r.averageTime));
        } catch (error) {
            throw error;
        }
    }


    static async getAllPosts() {
        const query = `
            SELECT p.*, a."fullName" AS "authorName" 
            FROM "Posts" p
            JOIN "Authors" a ON p."AuthorId" = a.id
            ORDER BY p."totalVote" DESC, p.id ASC;
        `;
        try {
            const { rows } = await pool.query(query);
            return rows.map(r => new Post(r.id, r.title, r.difficulty, r.totalVote, r.authorName));
        } catch (error) {
            throw error;
        }
    }

    static async getPostById(id) {
        const query = `
            SELECT p.*, a."fullName" AS "authorName" 
            FROM "Posts" p
            JOIN "Authors" a ON p."AuthorId" = a.id
            WHERE p.id = $1;
        `;
        try {
            const { rows } = await pool.query(query, [id]);
            console.log(rows);

            const r = rows[0];
            console.log(r.id);

            return new PostDetail(r.id, r.title, r.difficulty, r.totalVote, r.authorName, r.estimatedTime, r.description, r.imageUrl, r.createdDate, r.AuthorId);
        } catch (error) {
            throw error;
        }
    }

    static async plusVote(id) {
        const query = `
        UPDATE "Posts"
		SET "totalVote" = "totalVote" + 1
		WHERE id = $1
        ;`
        try {
            const { rows } = await pool.query(query, [+id]);
            return rows
        } catch (error) {
            throw error
        }
    }

    static async addPost(title, author, difficulty, estimatedTime, imageUrl, createdAt, description) {
        const query = `
        INSERT INTO "Posts" (title, "AuthorId", difficulty, "estimatedTime", "imageUrl", "createdDate", description)
        VALUES ($1, $2, $3, $4, $5, $6, $7)
        ;`

        try {
            const errors = await this.validation(title, author, difficulty, estimatedTime, imageUrl, createdAt, description)
            if (errors.length > 0) throw { errors }
            
            const { rows } = await pool.query(query, [title, author, difficulty, estimatedTime, imageUrl, createdAt, description])

            return rows
        } catch (error) {
            throw error
        }
    }

    static async deletePost(id) {
        const query = ` 
        DELETE FROM "Posts" WHERE id = $1
        ;`
        try {
            const { rows } = await pool.query(query, [id])
            return rows
        } catch (error) {
            throw error
        }
    }

    static async editPost(title, author, difficulty, estimatedTime, imageUrl, createdAt, description, id) {
        const query = `
        UPDATE "Posts"
        SET 
        title =$1,
        "AuthorId" = $2,
        difficulty = $3,
        "estimatedTime" = $4,
        "imageUrl" = $5,
        "createdDate" = $6,
        description = $7
        WHERE id = $8
        RETURNING *
        ;`
        try {
            const errors = await this.validation(title, author, difficulty, estimatedTime, imageUrl, createdAt, description)
            if (errors.length > 0) throw { errors }

            const { rows } = await pool.query(query, [title, author, difficulty, estimatedTime, imageUrl, createdAt, description, id])
            return rows
        } catch (error) {
            throw error
        }
    }
    static async searchPosts(search) {
        const query = `
        SELECT * FROM "Posts"
        WHERE title ILIKE $1
        ;`
        try {
            const { rows } = await pool.query(query, ['%' + search + '%']);
            return rows.map(r => new Post(r.id, r.title, r.difficulty, r.totalVote, r.authorName))

        } catch (error) {
            throw error
        }
    }

    static async validation(title, author, difficulty, estimatedTime, imageUrl, createdAt, description) {
        try {
            let result = []

            if (!title) result.push("Title is required.");
            else if (title.length > 100) result.push("Post title maximum character is 100.")

            if (title.length > 100) result.push("Post title maximum character is 100.");

            if (!author) result.push("Author is required.");

            if (!difficulty) result.push("Difficulty is required.");

            if (!estimatedTime) result.push("Estimated time is required.");
            else if (+estimatedTime < 5) result.push("Minimum estimated time is 5 minutes.");

            if (!imageUrl) result.push("Image Url is required.");
            else if (imageUrl.length > 100) result.push("Image Url name maximum character is 100.");

            if (!createdAt) result.push("Created date is required.");
            else if (new Date(createdAt) > new Date()) result.push("Maximum created date is today.");

            if (!description) result.push("Description is required.");
            else {
                const wordCount = description.trim().split(/\s+/).length;
                if (wordCount < 10) result.push("Minimum word in description is 10.");
            }
            return result
        } catch (error) {
            throw error
        }
    }

}
module.exports = Model
const pool = require("./connect.js")

let migrate = async () => {
    try {
        let queryDrop = `
            DROP TABLE IF EXISTS "Authors", "Posts" CASCADE; 
        `
        await pool.query(queryDrop);
        console.log("DROP TABLES SUCCESS (if they existed)!");

        let queryAuthors = `
            CREATE TABLE IF NOT EXISTS "Authors" (
                "id" SERIAL PRIMARY KEY,
                "fullName" VARCHAR(120),
                gender VARCHAR(6) 
            );
        `;
        await pool.query(queryAuthors);
        console.log("CREATE TABLE Authors SUCCESS!");

        let queryPosts = `
            CREATE TABLE IF NOT EXISTS "Posts" (
                "id" SERIAL PRIMARY KEY,
                "title" VARCHAR(100),
                "difficulty" VARCHAR(6),
                "estimatedTime" INT,
                "description" TEXT,
                "totalVote" INT DEFAULT 0,
                "imageUrl" VARCHAR(100),
                "createdDate" DATE,
                "AuthorId" INT
                REFERENCES "Authors"("id")
                    ON DELETE CASCADE
                    ON UPDATE CASCADE
            );
        `;
        await pool.query(queryPosts);
        console.log("CREATE TABLE Posts SUCCESS!")


    } catch (error) {
        console.error(error)
    }
}

migrate()


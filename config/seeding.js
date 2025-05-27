const pool = require("./connect")
const fs = require('fs').promises;

let seeding = async () => {
    try {
        let queryTruncate = `
            TRUNCATE TABLE "Authors", "Posts" RESTART IDENTITY CASCADE;
        `;
        await pool.query(queryTruncate);
        console.log("TRUNCATE TABLES SUCCESS!");


        // Authors
        let AuthorsData = JSON.parse(await fs.readFile('./data/authors.json', 'utf-8'));
        console.log(AuthorsData);

        let authorValues = AuthorsData.map(el => {
            return `( '${el.fullName}', '${el.gender}')`;
        }).join(', \n');

        let seedAuthorsQuery = `
            INSERT INTO "Authors" ( "fullName", "gender")
            VALUES ${authorValues};
        `
        await pool.query(seedAuthorsQuery)
        console.log("SUCCESS SEED Authors!")


        //posts
        let PostsData = JSON.parse(await fs.readFile('./data/posts.json', 'utf-8'));

        let categoryValues = PostsData.map(el => {
            return `( '${el.title}','${el.difficulty}' ,'${el.estimatedTime}', '${el.description}', '${el.totalVote}', '${el.imageUrl}', '${el.createdDate}', '${el.AuthorId}')`
        }).join(', \n');

        let seedPostsQuery = ` 
            INSERT INTO "Posts" ( "title","difficulty" , "estimatedTime", "description", "totalVote", "imageUrl", "createdDate", "AuthorId") 
            VALUES ${categoryValues}; 
        `
        await pool.query(seedPostsQuery);
        console.log("SUCCESS SEED Posts!");




    } catch (error) {
        console.log(error)
    }
}

seeding()




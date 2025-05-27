class Author {
    constructor(id, fullName, gender) {
        this.id = id;
        this.fullName = fullName;
        this.gender = gender;
    }

    get formatName() {
        if (this.gender === "Male") return "Mr. " + this.fullName
        if (this.gender === "Female") return "Mrs. " + this.fullName
    }
}

class AuthorDetail extends Author {
    constructor(id, fullName, gender, totalPost, totalVote, averageTime) {
        super(id, fullName, gender);
        this.totalPost = totalPost;
        this.totalVote = totalVote;
        this.averageTime = averageTime;
    }
}

class Post {
    constructor(id, title, difficulty, totalVote, authorName) {
        this.id = id;
        this.title = title;
        this.difficulty = difficulty;
        this.totalVote = totalVote;
        this.authorName = authorName;
    }
}

class PostDetail extends Post {
    constructor(id, title, difficulty, totalVote, authorName, estimatedTime, description, imageUrl, createdDate, AuthorId) {
        super(id, title, difficulty, totalVote, authorName);
        this.estimatedTime = estimatedTime;
        this.description = description;
        this.imageUrl = imageUrl;
        this.createdDate = createdDate;
        this.AuthorId = AuthorId;
    }
    get formatCreatedDate() {
        // return this.createdDate.getDate();
        return this.createdDate.toISOString().split("T")[0]

        // return `${this.createdDate.getFullYear()}-${this.createdDate.getMonth()+1}-${this.createdDate.getDate()}`
    }

}
module.exports = { Author, AuthorDetail, Post, PostDetail };


const Model = require("../models/model");

class Controller {
    static async home(req, res) {
        try {
            res.render("home");
        } catch (err) {
            // console.log(err);
            res.send(err);
        }
    }

    static async showAllAuthors(req, res) {
        try {
            const authors = await Model.getAllAuthors();
            res.render("authors", { authors });
        } catch (err) {
            res.send(err);
        }
    }

    static async showAuthorDetails(req, res) {
        try {
            const authorDetails = await Model.getAuthorDetails();
            res.render("authorsDetail", { authorDetails });
        } catch (err) {
            res.send(err);
        }
    }

    static async showAllPosts(req, res) {
        try {
            const { search } = req.query
            // console.log(search);
            if (search) {
                const posts = await Model.searchPosts(search);
                res.render("posts", { posts });
            } else {
                const posts = await Model.getAllPosts();
                res.render("posts", { posts });
            }
        } catch (err) {
            res.send(err);
        }
    }


    static async showPostDetail(req, res) {
        try {
            const { id } = req.params;
            const post = await Model.getPostById(+id);
            console.log(post.createdDate);

            res.render("postDetail", { post });
        } catch (err) {
            res.send(err)
        }
    }

    static async handleVotePost(req, res) {
        try {
            const { id } = req.params;
            await Model.plusVote(+id);
            res.redirect(`/posts/${id}`)
        } catch (err) {
            res.send(err);
        }
    }

    static async showAddPostForm(req, res) {
        try {
            const authors = await Model.getAllAuthors();
            // console.log(authors);

            let { errors } = req.query
            // console.log(req.body);
            if (errors) errors = errors.split(',')

            res.render("addPost", { authors, errors })
        } catch (err) {
            res.send(err);
        }
    }//

    static async handleAddPost(req, res) {
        try {
            const { title, author, difficulty, estimatedTime, imageUrl, createdAt, description } = req.body
            // console.log(title, author, difficulty, estimatedTime, imageUrl, createdAt, description);
            // console.log(req.body);
            await Model.addPost(title, author, difficulty, estimatedTime, imageUrl, createdAt, description)
            res.redirect(`/posts/`)

        } catch (err) {
            // res.redirect(`/posts/add?errors=${err.errors}`)
            if (err.errors) {
                // console.log(err.errors);
                res.redirect(`/posts/add?errors=${err.errors}`)//errors
            } else {
                res.send(err);
            }
        }
    }

    static async handleDeletePost(req, res) {
        try {
            const { id } = req.params
            await Model.deletePost(id)
            res.redirect("/posts")
        } catch (err) {
            res.send(err);
        }
    }

    static async showEditPostForm(req, res) {
        try {
            const { id } = req.params
            const post = await Model.getPostById(id)
            const authors = await Model.getAllAuthors()
            // console.log(post);
            let { errors } = req.query
            // console.log(req.body);
            if (errors) errors = errors.split(',')

            res.render("editPost", { post, authors, errors })

        } catch (err) {
            res.send(err);
        }
    }

    static async handleEditPost(req, res) {
        try {
            const { id } = req.params
            // console.log(id);
            const { title, author, difficulty, estimatedTime, imageUrl, createdAt, description } = req.body
            // console.log(title, author, difficulty, estimatedTime, imageUrl, createdAt, description, id);

            await Model.editPost(title, author, difficulty, estimatedTime, imageUrl, createdAt, description, id)
            res.redirect(`/posts/`)
        } catch (err) {
            if (err.errors) {
                // console.log(err.errors);
                res.redirect(`/posts/add?errors=${err.errors}`)
            } else {
                // console.log(err);
                res.send(err);
            }
        }
    }


}

module.exports = Controller


const express = require('express');
const router = express.Router();
const Controller = require('../controllers/controller');


router.get('/', Controller.home);

router.get('/authors', Controller.showAllAuthors);
router.get('/authors/detail', Controller.showAuthorDetails)

router.get('/posts', Controller.showAllPosts);
router.get('/posts/add', Controller.showAddPostForm);
router.post('/posts/add', Controller.handleAddPost)
router.get('/posts/:id', Controller.showPostDetail);
router.get('/posts/:id/edit', Controller.showEditPostForm);
router.post('/posts/:id/edit', Controller.handleEditPost);
router.get('/posts/:id/delete', Controller.handleDeletePost);
router.get('/posts/:id/vote', Controller.handleVotePost);

module.exports = router;

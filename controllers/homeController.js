const homeController = require('express').Router();

const { isUser } = require('../middleware/guards');
const { getPost, getPostById, getPostByAuthor } = require('../services/postService');
const { postViewModel } = require('../util/mapError');


//TODO replace with real controller by assignment

homeController.get('/', (req, res) => {
    res.render('home', { title: 'Home Page' });
});


homeController.get('/catalog', async (req, res) => {
    const posts = (await getPost()).map(postViewModel);
    res.render('catalog', { title: 'Catalog Page', posts });

});

homeController.get('/catalog/:id', async (req, res) => {
    const id = req.params.id;
    const post = postViewModel(await getPostById(id));

    if(req.session.user) {
        post.hasUser = true;
        if(req.session.user._id == post.author._id) {
            post.isAuthor = true;
        } else {
            post.hasVoted = post.votes.find(v => v._id == req.session.user._id) != undefined;
        }
    }

    res.render('details', { title: post.title, post });
});


homeController.get('/profile', isUser(), async (req, res) => {
    const posts = (await getPostByAuthor(req.session.user._id)).map(postViewModel);
    res.render('profile', { title: 'My Posts', posts });
});


module.exports = homeController;
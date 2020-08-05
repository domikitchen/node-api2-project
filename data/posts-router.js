const express = require('express');

const Posts = require('./db.js');
const { findById, insertComment } = require('./db.js');
const { response, request } = require('express');

const router = express.Router();

router.get('/', (request, response) => {
    const query = request.query;
    Posts.find(query)
        .then(posts => {
            response.status(200).json(posts);
        })
        .catch(error => {
            console.log(error);
            response.status(500).json({ error: error.message });
        });
});

router.post('/', (request, response) => {
    post = request.body;
    if(post.title === undefined || post.contents === undefined){
        response.status(400).json({ errorMessage: "Please provide title and contents for the post." });
    }
    else if(post.hasOwnProperty('title') && post.hasOwnProperty('contents')){
        Posts.insert(post)
            .then(p => {
                response.status(201).json(p);
            })
            .catch(error => {
                console.log(error);
                response.status(500).json({ error: "There was an error while saving the post to the database" })
            })
    }
});

router.get('/:id', (request, response) => {
    id = request.params.id;

    Posts.findById(id)
        .then(post => {
            if(post[0] === undefined){
                response.status(404).json({ message: "The post with the specified ID does not exist." });
            }
            else{
                response.status(200).json(post);
            }
        })
        .catch(error => {
            console.log(error);
            response.status(500).json({ error: "The post information could not be retrieved." });
        });
})

router.get('/:id/comments', (request, response) => {
    id = request.params.id;

    Posts.findPostComments(id)
    .then(comments => {
        Posts.findById(id)
            .then(post => {
                if(post[0] === undefined){
                    response.status(404).json({ message: "The post with the specified ID does not exist." });
                }
                else{
                    response.status(200).json(comments);
                }
            })
            .catch(error => {
                console.log(error);
                response.status(500).json({ error: "The post information could not be retrieved." });
            });
    })
    .catch(error => {
        console.log(error.response);
        response.status(500).json({ error: "The comments information could not be retrieved." });
    })
});

router.post('/:id/comments', (request, response) => {
    const id = request.params.id;
    const comment = request.body;
    comment.post_id = id;
    Posts.findById(id)
        .then(post => {
            if(post[0] === undefined){
                response.status(404).json({ message: "The post with the specified ID does not exist." });
            }
            else if(comment.text === undefined){
                response.status(400).json({ errorMessage: "Please provide text for the comment." });
            }
            else{
                Posts.insertComment(comment)
                    .then(p => {
                        response.status(201).json({ p, comment });
                    })
                    .catch(error => {
                        console.log(error.response);
                        response.status(500).json({ error: "there was an error while saving the comment to the database." });
                    })
            }
        })
        .catch(error => {
            console.log(error.response);
            response.status(500).json({ error: "There was an error while saving the comment to the database" })
        })
})

router.delete('/:id', (request, response) => {
    const id = request.params.id;

    Posts.findById(id)
        .then(post => {
            if(post[0] === undefined){
                response.status(404).json({ message: "The post with the specified ID does not exist." });
            }
            else{
                Posts.remove(id)
                    .then(p => {
                        response.status(204).end();
                    })
                    .catch(error => {
                        console.log(error.response);
                        response.status(500).json({ error: "The post could not be removed" })
                    })
            }
        })
        .catch(error => {
            console.log(error);
            response.status(500).json({ error: "The post information could not be retrieved." });
        });
});

router.put('/:id', (request, response) => {
    const id = request.params.id;
    const changes = request.body;

    Posts.findById(id)
        .then(post => {
            if(post[0] === undefined){
                response.status(404).json({ message: "The post with the specified ID does not exist." });
            }
            else if(changes.title === undefined || changes.contents === undefined){
                response.status(400).json({ errorMessage: "Please provide title and contents for the post." });
            }
            else{
                Posts.update(id, changes)
                    .then(up => {
                        response.status(200).json(up);
                    })
                    .catch(error => {
                        console.log(error.response);
                        response.status(500).json({ error: "The post information could not be modified." })
                    })
            }
        })
        .catch(error => {
            console.log(error);
            response.status(500).json({ error: "The post information could not be retrieved." });
        });    
});

module.exports = router;
const express = require('express');
const postsRouter = require('./data/posts-router.js');

const server = express();

server.use(express.json());

server.use('/api/posts', postsRouter);

server.listen(4000, () => {
    console.log('server go NYOOM');
  });
  
const express = require('express');
const postsRouter = require('./data/posts-router.js');

const server = express();

server.use(express.json());

server.get('/', (req, res) => {
  res.send(`<h2>/api/posts</h2>`);
});

server.use('/api/posts', postsRouter);

const port = process.env.PORT || 4000;

server.listen(port, () => {
  console.log('server go NYOOM');
});

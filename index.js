const express = require('express');
const postsRouter = require('./data/posts-router.js');

const server = express();

server.use(express.json());

server.get('/', (req, res) => {
  res.status(200).json({ "heck": "plez work" });
});

server.use('/api/posts', postsRouter);

const port = process.env.PORT || 4000;

server.listen(port, () => {
  console.log('server go NYOOM');
});

const express = require('express')

const Posts = require('./data/db')

const server = express()

server.use(express.json());

server.get('/', (req, res) => {
  res.send(`
    <h2>API Project</h>
  `);
});

server.get('/api/posts', (req, res) => {
  Posts.find()
    .then(post => {
      if (post) {
        res.status(200).json(post)
      } else {
        res.status(404).json({ message: "The post with the specified ID does not exist." })
      }
    })
    .catch(err => {
      res.status(500).json({ error: "The posts information could not be retrieved." })
    })
})

server.get('/api/posts/:id', (req, res) => {
  const id = req.params.id

  Posts.findById(id)
    .then(post => {
      if (post) {
        res.status(200).json(post)
      } else {
        res.status(404).json({ message: "The post with the specified ID does not exist." })
      }
    })
    .catch(err => {
      res.status(500).json({ error: "The posts information could not be retrieved." })
    })
})



server.listen(8000, () => {
  console.log('\n*** Server Running on http://localhost:8000 ***\n');
});

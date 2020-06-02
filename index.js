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

server.get('/api/posts/:id/comments', (req, res) => {
  const id = req.params.id

  Posts.findById(id)
    .then(comment => {
      if (comment) {
          res.status(200).json(comment)
      } else {
        res.status(404).json({ message: "The post with the specified ID does not exist." })
        }
    })
    .catch(err => {
      res.status(500).json({ error: "The comments information could not be retrieved." })
    })
})

server.delete('/api/posts/:id', (req, res) => {
  const id = req.params.id

  if (!id) {
    res.status(404).json({message: "The post with the specified ID does not exist."})
  } else {
    Posts.remove(id)
      .then(item => {
        res.status(200).json(`deleted post ${item}`)
      })
      .catch(err => {
        res.status(500).json({ error: "The post could not be removed" })
      })
  }
})

server.post('/api/posts', (req, res) => {
  const { title, contents } = req.body;

  if (!title || !contents) {
    res.status(400).json({ errorMessage: "Please provide title and contents for the post." })
  } else {
    Posts.insert(req.body)
      .then(post => {
        res.status(201).json(post)
      })
      .catch(err => {
        res.status(500)
          .json({ error: "There was an error while saving the post to the database" })
      })
  }
})

server.post('/api/posts/:id/comments', (req, res) => {
  const id = req.params.id;
  const {text} = req.body

  if (text === undefined) {
    res.status(400).json({
      errorMessage: "Please provide text for the comment.",
    });
  } else {
    Posts.findCommentById(id)
    .then(post => {
      res.status(201).json(text)
    })
      .catch(err => {
        res.status(500)
          .json({ error: "There was an error while saving the comment to the database" })
    })
  }

  
})



server.listen(8000, () => {
  console.log('\n*** Server Running on http://localhost:8000 ***\n');
});

const express = require('express')

const Posts = require('../data/db')

const router = express.Router()

router.get('/', (req, res) => {
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

router.get('/:id', (req, res) => {
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

router.get('/:id/comments', (req, res) => {
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

router.delete('/:id', (req, res) => {
  const id = req.params.id
  Posts.findById(id)
    .then(post => {
      if (post.length === 0) {
        res.status(404).json({ message: "The post with the specified ID does not exist." })
      } else {
        Posts.remove(id)
          .then(() => {
            res.status(200).json(post)
          })
          .catch(err => {
            res.status(500).json({ error: "The post could not be removed" })
          })
      }
    })
    .catch(err => {
      res.status(500).json({ error: "The post could not be removed" })
    })
})

router.post('/', (req, res) => {
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

router.post('/:id/comments', (req, res) => {
  const { id } = req.params;
  const comment = { ...req.body, post_id: id };

  Posts.findById(id)
    .then(post => {
      if (post.length) {
        if (comment.text) {
          Posts.insertComment(comment)
            .then(newComment => {
              res.status(201).json(newComment);
            })
            .catch(err => {
              console.log(err);
              res.status(500).json({
                error: "There was an error while saving to the database"
              });
            });
        } else {
          res.status(404).json({ message: "Comment is missing." });
        }
      } else {
        res.status(404).json({ message: "The id is not in database" });
      }
    })
    .catch(err => {
      console.log(err);
      res.status(500).json({
        error: "There was an error while saving the comment to the database."
      });
    });  
})

router.put('/:id', (req, res) => {
  const changes = req.body

  Posts.update(req.params.id, changes)
    .then(post => {
      if (post) {
        res.status(200).json(post)
      } else {
        res.status(404).json({ message: "The post with the specified ID does not exist." })
      }
    })
    .catch(err => {
      console.log(err)
      res.status(500).json({
        error: "The post information could not be modified."
      })
    })
})





module.exports = router;
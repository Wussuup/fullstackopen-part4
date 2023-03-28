const blogRouter = require('express').Router();
const Blog = require('../models/blog');
const User = require('../models/user');

blogRouter.get('/', async (request, response) => {
  const blogs = await Blog.find({}).populate("user", { username: 1, name: 1})
  response.json(blogs) 
})

blogRouter.get('/:id', async (request, response) => {
  const blogs = await Blog.findById(request.params.id) 
  if (blogs) {
    response.json(blogs) 
  } else {
    response.status(404).end()
  }
})

blogRouter.post('/', async (request, response) => {
  const user = await User.findOne({ username: 'Tysseeee' })
  console.log(user, "userfindone") 
  const body = request.body
  console.log(body, "body")
  const blog = new Blog({
    title: body.title,
    author: body.author, 
    url: body.url,
    likes: body.likes,
    user: user._id
  })
  console.log(blog, "newblog")
  const savedBlog = await blog.save()
  console.log(savedBlog, "savedblog")
  response.status(201).json(savedBlog)
})


blogRouter.delete('/:id', async (request, response) => {
  await Blog.findByIdAndDelete(request.params.id)
  response.status(204).end()
}) 

blogRouter.put('/:id', async (request, response, next) => {
  const body = request.body

  const blog = new Blog ({
    title: body.title,
    author: body.author, 
    url: body.url,
    likes: body.likes,
    _id: request.params.id
  })
  const blogupdated = await Blog.findByIdAndUpdate(request.params.id, blog) 
  response.status(201).json(blogupdated)
})


module.exports = blogRouter;
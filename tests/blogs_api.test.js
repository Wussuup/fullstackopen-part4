const mongoose = require('mongoose');
const supertest = require('supertest');
const helper = require('./test_helper') 
const app = require('../app');
const api = supertest(app)
const bcrypt = require('bcrypt')
const User = require('../models/user')

const Blog = require('../models/blog');
beforeEach(async () => {
  await Blog.deleteMany({});
  await Blog.insertMany(helper.intialBlogs);
})

describe("returned blogs", () => {
  test("blogs returned in json", async () => {
     await api
      .get('/api/blogs')
      .expect(200)
      .expect('Content-Type', /application\/json/) 
  })

  test("correct amount of blogs", async () => {
    const response = await api.get('/api/blogs') 
    expect(response.body.length).toBe(helper.intialBlogs.length)
  })

  test("correct identications", async () => {
    const blogs = await helper.blogsInDb()
    const blog = blogs[0]

    expect(blog.id).toBeDefined()
  })
})

describe("post blogs", () => {
  test("Posts returned in json", async () => {
    const newBlog =   {
      title: "Canonical string reduction",
      author: "Edsger W. Dijkstra",
      url: "http://www.cs.utexas.edu/~EWD/transcriptions/EWD08xx/EWD808.html",
      likes: 12,
    }
  
    await api
      .post('/api/blogs')
      .send(newBlog)
      .expect(201)
      .expect('Content-Type', /application\/json/)
    
    const blogsAtEnd = await helper.blogsInDb()
  
    const title = blogsAtEnd.map(r => r.title)
    expect(blogsAtEnd).toHaveLength(helper.intialBlogs.length + 1)
    expect(title).toContain("Canonical string reduction")
  
    }) 
})


describe("blog deletion", () => {
  test("delete blog", async () => {
    const startblogs = await helper.blogsInDb()
    const deleteblog = startblogs[0]
    await api
      .delete(`/api/blogs/${deleteblog.id}`)
      .expect(204)

    const endblogs = await helper.blogsInDb()
    expect(endblogs).toHaveLength(helper.intialBlogs.length - 1)
    const title = endblogs.map(endBlog => endBlog.title)
    expect(title).not.toContain(deleteblog.title)
  })
}) 


describe('updating a blog', () => {
  test('update blog', async () => {
    const startBlogs = await helper.blogsInDb()
    const blogToUpdate = startBlogs[0]
    const updatedBlog = { ...blogToUpdate, likes: blogToUpdate.likes + 1 }
  
    const response = await api
      .put(`/api/blogs/${blogToUpdate.id}`)
      .send(updatedBlog)
      .expect(201)
      .expect('Content-Type', /application\/json/)
  
    const endBlogs = await helper.blogsInDb()
    const updatedBlogInDb = endBlogs.find(blog => blog.id === blogToUpdate.id)
  
    expect(response.body.likes).not.toBe(updatedBlog.likes)
    expect(updatedBlogInDb.likes).toBe(updatedBlog.likes)
  })
})

describe('post users', () => {
  beforeEach(async () => {
    await User.deleteMany({})

    const passwordHash = await bcrypt.hash('sekret', 10)
    const user = new User({ username: 'root', passwordHash })

    await user.save()
  })

  test('creation succeeds with a fresh username', async () => {
    const usersAtStart = await helper.usersInDb()

    const newUser = {
      username: 'harrigaming',
      name: 'Arto Hellas',
      password: 'salainen',
    }

    await api
      .post('/api/users')
      .send(newUser)
      .expect(201)
      .expect('Content-Type', /application\/json/)

    const usersAtEnd = await helper.usersInDb()
    expect(usersAtEnd).toHaveLength(usersAtStart.length + 1)

    const usernames = usersAtEnd.map(u => u.username)
    expect(usernames).toContain(newUser.username)
  })

  test("bad accounts not created successfully", async () => {
    const usersAtStart = await helper.usersInDb()
    
    const newUser = {
      username: 'tosiaajoo',
      name: 'Pekka Jooo',
      password: 'sa',
    }

    await api
      .post('/api/users')
      .send(newUser)
      .expect(400)
      .expect('Content-Type', /application\/json/)

    const usersAtEnd = await helper.usersInDb()
    expect(usersAtEnd).toHaveLength(usersAtStart.length)

  })
})







afterAll(async () => {
  await mongoose.connection.close()
})
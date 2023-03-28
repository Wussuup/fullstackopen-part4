const _ = require('lodash');
const dummy = (blogs) => {
  return 1 
}

const totalLikes = (blogs) => {
  return blogs.length === 0 ? 0 : blogs.reduce((a, b) => a + b.likes, 0)
}

const favoriteBlog = (blogs) => {
  return blogs.reduce((prev, current) => prev.likes > current.likes ? prev : current)
}

const mostBlogs = (blogs) => {
  const authorCounts = _.countBy(blogs, 'author');
  const [mostBlogsAuthor, mostBlogsCount] = _.toPairs(authorCounts)
    .reduce(([maxAuthor, maxCount], [author, count]) =>
      count > maxCount ? [author, count] : [maxAuthor, maxCount],
      ['', 0]
    );
    
  return {
    author: mostBlogsAuthor,
    blogs: mostBlogsCount
  }
}


const mostLikes = (blogs) => {
  const maxLikes = Math.max(...blogs.map(blog => blog.likes));
  const most = blogs.filter(blog => blog.likes === maxLikes)
          .map(blog => ({ author: blog.author, likes: blog.likes }));
  return most[0];
};





module.exports = {
  dummy,
  totalLikes,
  favoriteBlog, 
  mostBlogs,
  mostLikes
}
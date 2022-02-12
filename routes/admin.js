const express = require('express');
const router = express.Router();
const auth = require('../middleware/auth');
const Category = require('../models/Category');
const Book = require('../models/Book');
const mongoose = require('mongoose')

/* GET users listing. */
router.get('/', auth, function (req, res, next) {
  res.render('admin/index', {
    layout: 'layout',
    title: 'AdminPage'
  });
});

router.get('/category', auth, async function (req, res, next) {
  const categories = await Category.find()
  console.log(categories);
  res.render('admin/categories', {
    layout: 'layout',
    title: "Category",
    categories
  })
})

router.get('/category/:id', auth, async (req, res) => {
  const category = await Category.findById(req.params.id)

  const books = await Book.aggregate([
    {
      $match: {
        categoryId: mongoose.Types.ObjectId(req.params.id)
      }
    }
  ])

  // console.log(books);
  res.render('admin/category', {
    title: category.name,
    books
  })
})

router.post('/category/add', auth, async function (req, res, next) {
  const { name } = req.body

  const category = new Category({
    name
  })

  await category.save()
  res.redirect('/admin/category')
})

router.get('/book', auth, async (req, res, next) => {
  const categories = await Category.find()
  const books = await Book.find()
  res.render('admin/books', {
    title: 'Books',
    categories,
    books
  })
})

router.post('/book/add', auth, async (req, res, next) => {
  const {
    name,
    price,
    oldPrice,
    author,
    img,
    categoryId
  } = req.body

  const book = new Book({
    name,
    price,
    oldPrice,
    author,
    img,
    categoryId
  })

  await book.save()
  res.redirect('/admin/book')
})

module.exports = router;

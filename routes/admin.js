const express = require('express');
const router = express.Router();
const auth = require('../middleware/auth');
const Category = require('../models/Category');
const Book = require('../models/Book');
const mongoose = require('mongoose')
const upload = require('../middleware/fileUpload');
const fileRemove = require('../middleware/fileRemove');

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
    categories,
    alert: req.flash('alert')
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
    layout: 'layout',
    categories,
    books
  })
})

router.get('/book/:id', auth, async (req, res, next) => {
  const book = await Book.findById(req.params.id)

  console.log(book);

  res.render('admin/book', {
    title: book.name,
    layout: 'layout',
    book
  })
})

router.post('/book/add', auth, upload.single('img'), async (req, res, next) => {
  const {
    name,
    price,
    oldPrice,
    author,
    categoryId,
    textarea
  } = req.body


  const book = new Book({
    name,
    price,
    oldPrice,
    author,
    img: req.file.filename,
    categoryId,
    textarea
  })

  await book.save()
  res.redirect('/admin/book')
})

router.get('/category/remove/:id', auth, async (req, res, next) => {
  try {
    await Category.findByIdAndDelete(req.params.id, (err) => {
      if (err) {
        throw new Error
      } else {
        req.flash('alert', 'Success deleted')
        res.redirect('/admin/category')
      }
    })
  } catch (error) {
    console.log(error);
  }
})

router.get('/category/update/:id', auth, async (req, res, next) => {
  const category = await Category.findById(req.params.id)
  res.render('admin/updateCategory', {
    title: category.name,
    category
  })
})

router.post('/category/update/:id', auth, async (req, res, next) => {
  try {

    await Category.findByIdAndUpdate(req.params.id, { name: req.body.name }, (err) => {
      if (err) {
        throw new Error
      } else {
        req.flash('successUpdate', 'Updated successfull')
        res.redirect('/admin/category')
      }
    })

  } catch (error) {
    console.log(error);
  }
})

router.get('/book/remove/:id', auth, async (req, res, next) => {
  try {
    const book = await Book.findById(req.params.id)

    await Book.findByIdAndDelete(req.params.id, (err) => {
      if (err) {
        throw new Error
      } else {
        fileRemove(book.img)
        console.log('Book removed');
        res.redirect('/admin/book')
      }
    })
  } catch (error) {
    console.log(error);
  }
})

router.get('/book/update/:id', auth, async (req, res, next) => {
  const book = await Book.findById(req.params.id)
  const categories = await Category.find()
  res.render('admin/bookUpdate', {
    title: book.name,
    book,
    categories
  })
})

router.post('/book/update/:id', auth, upload.single('img'), async (req, res, next) => {
  try {
    const oldBook = await Book.findById(req.params.id)
    const book = req.body

    if (req.file) {
      fileRemove(oldBook.img)
      book.img = req.file.filename
    } else {
      book.img = oldBook.img
    }

    await Book.findByIdAndUpdate(req.params.id, book, (err) => {
      if (err) {
        throw new Error
      } else {
        res.redirect('/admin/book')
      }
    })

  } catch (error) {
    console.log(error);
  }
})
module.exports = router;

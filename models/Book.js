const { Schema, model } = require('mongoose')

const bookSchema = new Schema({
    name: {
        type: String,
        required: true
    },
    price: {
        type: Number,
        required: true
    },
    oldPrice: {
        type: Number,
    },
    author: {
        type: String,
        required: true
    },
    img: {
        type: String,
        required: true
    },
    categoryId: {
        ref: 'categories',
        type: Schema.Types.ObjectId,
        required: true
    }
})

module.exports = model('book', bookSchema)
const mongoose = require('mongoose')
const Schema = mongoose.Schema;


const CategorySchema = new Schema({
    description: { type: String, required: [true, 'description is required'], unique: true },
    userId: { type: Schema.Types.ObjectId, ref: 'User' }
})

module.exports = mongoose.model('Category', CategorySchema);
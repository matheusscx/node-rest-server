const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const productSchema = new Schema({
    name: { type: String, unique: true, required: [true, 'El nombre del producto es requerido'] },
    description: { type: String, require: false },
    price: { type: Number, require: [true, 'El precio es requerido'] },
    status: { type: Boolean, required: true, default: true },
    category: { type: Schema.Types.ObjectId, ref: 'Category', require: [true, 'La categoria es requerida'] },
    user: { type: Schema.Types.ObjectId, ref: 'User', require: false }
})

module.exports = mongoose.model('Product',productSchema);

const mongoose = require('mongoose');
const uniqueValidator = require('mongoose-unique-validator');

let validRoles = {
    values: ['USER_ROLE', 'ADMIN_ROLE'],
    message: '{VALUE} is not a permitted role'
};

let Schema = mongoose.Schema;

let userSchema = new Schema({
    name: { type: String, required: [true, 'name is required'] },
    email: { type: String, required: [true, 'email is required'], unique: true },
    password: { type: String, required: [true, 'password is required'] },
    img: { type: String, require: false, default: 'no-image.jpg' },
    role: { type: String, default: 'USER_ROLE', enum: validRoles },
    status: { type: Boolean, default: true }, google: { type: Boolean, default: false }
});


userSchema.methods.toJSON = function () {
    let user = this;
    let userObj = user.toObject();
    delete userObj.password;
    return userObj;
}

userSchema.plugin(uniqueValidator);

module.exports = mongoose.model('User', userSchema);
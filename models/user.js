const { Schema, model, Error } = require('mongoose');
const { createHmac, randomBytes } = require('crypto');
const { createtokenforuser } = require('../services/authentication');

const userschema = new Schema({
    fullname: {
        type: String,
        require: true
    },
    email: {
        type: String,
        required: true,
        unique: true
    },
    salt: {
        type: String,
    },
    password: {
        type: String,
        required: true,
    },
    profileimageurl: {
        type: String,
        default: "https://t3.ftcdn.net/jpg/07/24/59/76/360_F_724597608_pmo5BsVumFcFyHJKlASG2Y2KpkkfiYUU.jpg"
    },
    role: {
        type: String,
        enum: ["USER", "ADMIN"],
        default: "USER"
    },
}, { timestamps: true });

userschema.pre("save", function (next) {
    const user = this;
    if (!user.isModified("password")) return;
    const salt = randomBytes(16).toString();
    const hashpassword = createHmac('sha256', salt).update(user.password).digest("hex");

    this.salt = salt;
    this.password = hashpassword;
    next();
})


userschema.static("matchpasswordandgeneratetoken", async function (email,password) {
    const user = await this.findOne({ email });
    if (!user) throw new Error('user not found');
    const salt = user.salt;
    const hashpassword = user.password;

    const userprovidedhash = createHmac('sha256', salt).update(password).digest("hex")
    if(hashpassword!== userprovidedhash) throw new Error('incorrect password');
    const token = createtokenforuser(user);
    return token;
})


const USER = model("user", userschema);

module.exports = USER;
const JWT = require ('jsonwebtoken');
// const secret = "";
function createtokenforuser(user) {
    const payload={
        _id:user._id,
        email:user.email,
        profileimage:user.profileimage,
        role:user.role,
    };
    const token= JWT.sign(payload,secret)
    return token;
}

function validatetoken(token){
    const payload=JWT.verify(token,secret);
    return payload;
};

module.exports={
    createtokenforuser,
    validatetoken,
};
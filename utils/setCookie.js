const jwt = require('jsonwebtoken');

const setCookie = (user, res) => {
    const token = jwt.sign({id: user.id}, process.env.JWT_SECRET, {
        expiresIn: process.env.JWT_EXPIRES_IN
    });

    const cookieOptions =  {
        expires: new Date(Date.now()+ parseInt(process.env.JWT_EXPIRES_IN) * 24 * 60 * 60 * 1000), //days to ms
        httpOnly: true
    }
    process.env.NODE_ENV === "production" && (cookieOptions.secure = true);
    res.cookie('jwt', token, cookieOptions);
}

module.exports = setCookie;
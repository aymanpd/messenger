const appError = require('../utils/appError');

const sendErrorProduction = (err, res) => {
    if (err.isOperational) {
        res.status(err.code).send(err.message);
    } else {
        console.log(err);
        res.status(500).send("Something went wrong, plase try again later");
    }
}

const sendErrorDevelopment = (err, res) => {
    if (err.isOperational) {
        res.status(err.code).send(err.message);
    } else {
        console.log(err);
        res.status(500).send(err);
    }
}

const errorHandler = (err, req, res, next) => {
    const sendError = process.env.NODE_ENV === 'DEVELOPMENT' ? sendErrorDevelopment : sendErrorProduction;
    
    if (err.name == 'ValidationError') {
        const errors = Object.values(err.errors).map((error) => error.message);
        const errorMessage = errors.join('. ', errors);
        return sendError(new appError(errorMessage, 400), res);
    }
    if (err.code === 11000) {
        console.log(err);
        const errorMessage = `${err.errmsg.match(/(["'])(\\?.)*?\1/)[0]} Already exists`;
        return sendError(new appError(errorMessage, 400), res)
    }
    if (err.name === "CastError") {
        const errorMessage = "Invalid Id";
        return sendError(new appError(errorMessage, 400), res)

    }
    return sendError(err, res);
}

module.exports = errorHandler;
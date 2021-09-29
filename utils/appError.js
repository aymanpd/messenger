class appError extends Error {
    constructor(message, code = 400) {
        super(message);

        this.code = code;
        this.isOperational = true;

        Error.captureStackTrace(this, this.constructor);
    }
}

module.exports = appError;
//Error handler class //u have to setup a class to capture the error stack and send it to frontend
class ApiError extends Error {
  constructor(statusCode, message) {
    super(message); // sets this.message
    this.statusCode = statusCode;
    this.success = false;
    Error.captureStackTrace(this, this.constructor);
  }
}

export default ApiError;
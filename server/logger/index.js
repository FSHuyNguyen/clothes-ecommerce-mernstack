function logger({ res, success, message, data = null, statusCode = 200, key = 'payload' }) {
  const response = {
    success: success,
    message: message,
  };

  if (data) {
    response[key] = data;
  }

  return res.status(statusCode).json(response);
}

module.exports = { logger };

function errorHandler(err, req, res, next) {
  if (res.headersSent) {
    return next(err);
  }

  if (err.type === 'entity.parse.failed') {
    return res.status(400).json({ error: 'Malformed JSON body' });
  }

  const statusCode = err.statusCode || 500;
  const message = statusCode >= 500 ? 'Internal server error' : err.message;

  return res.status(statusCode).json({ error: message });
}

module.exports = errorHandler;

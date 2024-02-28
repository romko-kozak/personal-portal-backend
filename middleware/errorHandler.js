require('colors');
const PortalError = require('./../error');

module.exports = (err, req, res, next) => {
  if (err instanceof PortalError || err.status) {
    return res.status(err.status).json({
      status: err.status,
      message: err.message || err.code || err.name,
      stack: process.env.NODE_ENV === 'production' ? null : err.stack
    });
  }

  return res.status(500).json({ error: err, message: 'Ooops! Something went really wrong! 💩'});
};
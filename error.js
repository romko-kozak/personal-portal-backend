class PortalError extends Error {
  constructor(status, message) {
    super();
    this.status = status;
    this.message = message;
  }

  static BadRequest(message) {
    return new PortalError(400, message);
  }
  static NotFound(message) {
    return new PortalError(404, message);
  }
  static Internal(message) {
    return new PortalError(500, message);
  }

  static Forbidden(message) {
    return new PortalError(403, message);
  }

  static Unauthorized(message) {
    return new PortalError(401, message);
  }
};

module.exports = PortalError;
class ApiError extends Error {
  constructor(code, message) {
    super();
    this.code = code;
    this.message = message;
  }

  static badRequest(message) {
    return new ApiError(404, message);
  }

  static internalError(message) {
    return new ApiError(500, message);
  }

  static forbiddenError(message) {
    return new ApiError(403, message);
  }
}

module.exports = ApiError;
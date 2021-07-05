class ApiError extends Error {
  constructor(code, message) {
    super();
    this.code = code;
    this.message = message;
  }

  static badRequest(message) {
    return new ApiError(404, `API error: ${message}`);
  }

  static internalError(message) {
    return new ApiError(500, `API error: ${message}`);
  }

  static forbiddenError(message) {
    return new ApiError(403, `API error: ${message}`);
  }
}

module.exports = ApiError;
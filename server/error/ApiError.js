class ApiError extends Error {
  constructor(code, message, apiCode) {
    super();
    this.code = code;
    this.message = message;
    this.apiCode = apiCode;
  }

  static badRequest(message) {
    return new ApiError(404, `API error: ${message}`, 1);
  }

  static internalError(message) {
    return new ApiError(500, `API error: ${message}`, 2);
  }

  static forbiddenError(message) {
    return new ApiError(403, `API error: ${message}`, 3);
  }

  static duplicateError(message) {
    return new ApiError(409, `API error: ${message}`, 4);
  }
}

module.exports = ApiError;
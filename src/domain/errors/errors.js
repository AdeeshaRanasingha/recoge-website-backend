export class ValidationError extends Error {
  constructor(message = "Validation error") {
    super(message);
    this.name = "ValidationError";
    this.statusCode = 400;
  }
}

export class NotFoundError extends Error {
  constructor(message = "Resource not found") {
    super(message);
    this.name = "NotFoundError";
    this.statusCode = 404;
  }
}

export class ApiError extends Error {
  constructor(message = "Internal server error", statusCode = 500) {
    super(message);
    this.name = "ApiError";
    this.statusCode = statusCode;
  }
}

class APIError extends Error {
  constructor(
    statusCode,
    messege = "something went wrong",
    errors = [],
    statck = ""
  ) {
    super(messege);
    this.statusCode = statusCode;
    this.data = null;
    this.messege = messege;
    this.success = false;
    this.errors = errors;

    if (statck) {
      this.statck = statck;
    } else {
      Error.captureStackTrace(this, this.constructor);
    }
  }
}

export default APIError;
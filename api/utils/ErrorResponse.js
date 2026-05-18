module.exports = class ErrorResponse extends Error {
  #httpCode;
  #error;
  #name;

  constructor(httpCode, message, error = null) {
    super(message);
    this.#name = "ErrorResponse";

    this.#httpCode = httpCode;
    this.#error = error;
  }

  get httpCode() {
    return this.#httpCode;
  }

  get error() {
    return this.#error;
  }

  get name() {
    return this.#name;
  }
};

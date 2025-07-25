export class ApiError extends Error {
  statusCode: number;
  type: string;
  details?: Record<string, any>;

  constructor(
    statusCode: number,
    type: string,
    message: string,
    details?: Record<string, any>
  ) {
    super(message);
    this.statusCode = statusCode;
    this.type = type;
    this.details = details;
  }
}

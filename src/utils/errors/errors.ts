import { ApiError } from "./apiError";

/**
 * ValidationError
 * Thrown when input validation fails (e.g., Zod schema errors)
 */
export class ValidationError extends ApiError {
  constructor(details?: Record<string, string[]>) {
    super(
      400,
      "ValidationError",
      "One or more fields failed validation",
      details
    );
  }
}

/**
 * AuthError
 * Thrown for authentication/authorization failures
 */
export class AuthError extends ApiError {
  constructor(message = "Authentication failed") {
    super(401, "AuthError", message);
  }
}

/**
 * NotFoundError
 * Thrown when a requested resource is not found
 */
export class NotFoundError extends ApiError {
  constructor(resource = "Resource") {
    super(404, "NotFoundError", `${resource} not found`);
  }
}

/**
 * ServerError
 * Thrown for internal server errors (fallback)
 */
export class ServerError extends ApiError {
  constructor(message = "Internal Server Error") {
    super(500, "ServerError", message);
  }
}

/**
 * ForbiddenError
 * Thrown when a user tries to access a forbidden resource
 */
export class ForbiddenError extends ApiError {
  constructor(message = "Access to this resource is forbidden") {
    super(403, "ForbiddenError", message);
  }
}

/**
 * HabitError
 * Thrown for habit-related domain errors
 */
export class HabitError extends ApiError {
  constructor(message = "Habit operation failed") {
    super(400, "HabitError", message);
  }
}

/**
 * TodoError
 * Thrown for todo-related domain errors
 */
export class TodoError extends ApiError {
  constructor(message = "Todo operation failed") {
    super(400, "TodoError", message);
  }
}

/**
 * ReminderError
 * Thrown for reminder-related domain errors
 */
export class ReminderError extends ApiError {
  constructor(message = "Reminder operation failed") {
    super(400, "ReminderError", message);
  }
}

export type OrderErrorCode =
  | "VALIDATION_ERROR"
  | "PRODUCT_UNAVAILABLE"
  | "INVALID_EMPTY_BOTTLE_QUANTITY"
  | "OUT_OF_OPERATING_HOURS"
  | "IDEMPOTENCY_CONFLICT"
  | "ORDER_CREATION_FAILED";

export interface SafeError {
  code: OrderErrorCode;
  message: string;
  details?: unknown;
}

export type Result<T, E = SafeError> =
  { success: true; data: T } | { success: false; error: E };

export function ok<T>(data: T): Result<T, never> {
  return { success: true, data };
}

export function err<E = SafeError>(error: E): Result<never, E> {
  return { success: false, error };
}

export function makeSafeError(
  code: OrderErrorCode,
  message: string,
  details?: unknown
): SafeError {
  return { code, message, details };
}

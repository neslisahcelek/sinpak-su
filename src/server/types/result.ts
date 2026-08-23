export type OrderErrorCode =
  | "VALIDATION_ERROR"
  | "PRODUCT_UNAVAILABLE"
  | "INVALID_EMPTY_BOTTLE_QUANTITY"
  | "OUT_OF_OPERATING_HOURS"
  | "IDEMPOTENCY_CONFLICT"
  | "ORDER_CREATION_FAILED";

export type AdminErrorCode =
  | "VALIDATION_ERROR"
  | "UNAUTHORIZED"
  | "INVALID_CREDENTIALS"
  | "SESSION_EXPIRED"
  | "ORDER_NOT_FOUND"
  | "INVALID_STATUS_TRANSITION"
  | "CONCURRENT_MODIFICATION"
  | "INTERNAL_ERROR";

export type AppErrorCode = OrderErrorCode | AdminErrorCode;

export interface SafeError<TCode extends string = AppErrorCode> {
  code: TCode;
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

export function makeSafeError<TCode extends string = AppErrorCode>(
  code: TCode,
  message: string,
  details?: unknown
): SafeError<TCode> {
  return { code, message, details };
}


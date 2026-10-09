/**
 * Honeypot form guard for passive bot protection.
 * Bots routinely parse HTML and auto-fill all input fields regardless of visibility.
 * Legitimate human users never see or interact with the honeypot field.
 */

/**
 * Returns true if a submission appears to be from an automated bot
 * that filled in the hidden honeypot field.
 */
export function isHoneypotTriggered(honeypotValue: unknown): boolean {
  if (honeypotValue === undefined || honeypotValue === null) {
    return false;
  }

  if (typeof honeypotValue === "string") {
    return honeypotValue.trim().length > 0;
  }

  // Any non-empty value (array, object, number, etc.) is considered triggered
  return Boolean(honeypotValue);
}

/**
 * Maps internal/database errors to safe, user-friendly messages.
 * Prevents leaking database structure or technical details.
 */
export const getSafeErrorMessage = (error: any): string => {
  const msg = error?.message?.toLowerCase?.() || "";

  // Auth-related
  if (msg.includes("invalid login")) return "Invalid email or password. Please try again.";
  if (msg.includes("email not confirmed")) return "Please verify your email before signing in.";
  if (msg.includes("user already registered")) return "An account with this email already exists.";
  if (msg.includes("signup") || msg.includes("sign up")) return "Could not create account. Please try again.";
  if (msg.includes("password")) return "Password does not meet requirements.";

  // Points / rewards
  if (msg.includes("points") || msg.includes("insufficient")) return "Insufficient points for this action.";

  // Network
  if (msg.includes("fetch") || msg.includes("network")) return "Network error. Please check your connection.";

  // Generic fallback
  return "Something went wrong. Please try again.";
};

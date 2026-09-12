export const SHORT_CODE_PATTERN = /^[A-Za-z0-9]{5}$/;
export const SHORT_CODE_LENGTH = 5;
export const REDIRECT_TTL_SECONDS = 300;
export const NOT_FOUND_TTL_SECONDS = 3_600;

export function isValidShortCode(value: string): boolean {
  return SHORT_CODE_PATTERN.test(value);
}

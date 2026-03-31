export const PASSWORD_PATTERN = /^(?=.*?[A-Z])(?=.*?[a-z])(?=.*?[0-9])(?=.*?[#?!@$ %^_/()&*\-]).{8,}$/;

export function getPasswordChecks(value: string) {
  return {
    uppercase: /[A-Z]/.test(value),
    lowercase: /[a-z]/.test(value),
    number:    /[0-9]/.test(value),
    special:   /[#?!@$ %^_/()&*\-]/.test(value),
    minlength: value.length >= 8,
  };
}

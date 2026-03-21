import { AbstractControl, ValidationErrors } from '@angular/forms';

export function matchPasswords(passwordKey: string, confirmPasswordKey: string) {
  return (form: AbstractControl): ValidationErrors | null => {
    const passwordControl = form.get(passwordKey);
    const confirmPasswordControl = form.get(confirmPasswordKey);

    if (!passwordControl || !confirmPasswordControl) return null;

    const password = passwordControl.value;
    const confirmPassword = confirmPasswordControl.value;

    return password === confirmPassword ? null : { passwordMismatch: true };
  };
}

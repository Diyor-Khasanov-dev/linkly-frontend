import { AbstractControl, ValidationErrors, ValidatorFn } from '@angular/forms';

export function normalizeWhitespace(value: string): string {
  return value.trim().replace(/\s+/g, ' ');
}

export function trimValue(value: string): string {
  return value.trim();
}

export function normalizeEmail(value: string): string {
  return trimValue(value).toLowerCase();
}

export function trimmedLengthValidator(minLength: number, maxLength?: number): ValidatorFn {
  return (control: AbstractControl<string>): ValidationErrors | null => {
    const length = normalizeWhitespace(control.value ?? '').length;

    if (length < minLength) {
      return { trimmedMinLength: { requiredLength: minLength, actualLength: length } };
    }

    if (maxLength !== undefined && length > maxLength) {
      return { trimmedMaxLength: { requiredLength: maxLength, actualLength: length } };
    }

    return null;
  };
}

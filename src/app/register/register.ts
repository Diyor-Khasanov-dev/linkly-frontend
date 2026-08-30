import { ChangeDetectionStrategy, Component, inject, signal } from '@angular/core';
import { NonNullableFormBuilder, ReactiveFormsModule, Validators } from '@angular/forms';
import { Router, RouterLink } from '@angular/router';

import { ApiService } from '../api.service';
import { AuthService } from '../auth.service';
import {
  normalizeEmail,
  normalizeWhitespace,
  trimValue,
  trimmedLengthValidator,
} from '../form-utils';

@Component({
  selector: 'app-register',
  imports: [ReactiveFormsModule, RouterLink],
  templateUrl: './register.html',
  styleUrl: './register.css',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class Register {
  private readonly api = inject(ApiService);
  private readonly authService = inject(AuthService);
  private readonly formBuilder = inject(NonNullableFormBuilder);
  private readonly router = inject(Router);

  readonly isSubmitting = signal(false);
  readonly errorMessage = signal('');
  readonly noticeMessage = signal('');
  readonly form = this.formBuilder.group({
    workspaceName: ['', [Validators.required, trimmedLengthValidator(2, 80)]],
    email: ['', [Validators.required, Validators.email]],
    password: ['', [Validators.required, trimmedLengthValidator(8)]],
    otp: ['', [trimmedLengthValidator(6, 6)]],
  });

  fillDemoCredentials(): void {
    this.form.patchValue({
      workspaceName: 'Demo Workspace',
      email: 'demo@linkly.com',
      password: 'demo123456',
    });
  }

  async registerWithDemo(): Promise<void> {
    this.fillDemoCredentials();
    await this.register();
  }

  async register(): Promise<void> {
    const rawValue = this.form.getRawValue();
    const payload = {
      workspaceName: normalizeWhitespace(rawValue.workspaceName),
      email: normalizeEmail(rawValue.email),
      password: trimValue(rawValue.password),
    };

    this.form.patchValue(payload, { emitEvent: false });

    if (
      this.form.controls.workspaceName.invalid ||
      this.form.controls.email.invalid ||
      this.form.controls.password.invalid ||
      this.isSubmitting()
    ) {
      this.form.controls.workspaceName.markAsTouched();
      this.form.controls.email.markAsTouched();
      this.form.controls.password.markAsTouched();
      return;
    }

    this.isSubmitting.set(true);
    this.errorMessage.set('');
    this.noticeMessage.set('');

    try {
      await this.authService.register(payload);

      if (this.authService.isAuthenticated()) {
        await this.router.navigate(['/dashboard']);
        return;
      }

      await this.router.navigate(['/otp-verification'], {
        queryParams: { email: payload.email },
      });
    } catch (error) {
      this.errorMessage.set(this.api.extractErrorMessage(error));
    } finally {
      this.isSubmitting.set(false);
    }
  }

  async verifyOtp(): Promise<void> {
    const { email: rawEmail, otp: rawOtp } = this.form.getRawValue();
    const email = normalizeEmail(rawEmail);
    const otp = trimValue(rawOtp);

    this.form.patchValue({ email, otp }, { emitEvent: false });

    if (!email || !otp || this.form.controls.email.invalid || this.isSubmitting()) {
      this.form.controls.email.markAsTouched();
      this.form.controls.otp.markAsTouched();
      return;
    }

    this.isSubmitting.set(true);
    this.errorMessage.set('');

    try {
      await this.authService.verifyOtp(email, otp);
      await this.router.navigate(['/dashboard']);
    } catch (error) {
      this.errorMessage.set(this.api.extractErrorMessage(error));
    } finally {
      this.isSubmitting.set(false);
    }
  }
}

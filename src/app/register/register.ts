import { Component, inject, signal } from '@angular/core';
import { NonNullableFormBuilder, ReactiveFormsModule, Validators } from '@angular/forms';
import { Router, RouterLink } from '@angular/router';

import { ApiService } from '../api.service';
import { AuthService } from '../auth.service';

@Component({
  selector: 'app-register',
  imports: [ReactiveFormsModule, RouterLink],
  templateUrl: './register.html',
  styleUrl: './register.css',
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
    name: ['', [Validators.required, Validators.minLength(2)]],
    email: ['', [Validators.required, Validators.email]],
    password: ['', [Validators.required, Validators.minLength(6)]],
    otp: [''],
  });

  async register(): Promise<void> {
    const { name, email, password } = this.form.getRawValue();

    if (
      this.form.controls.name.invalid ||
      this.form.controls.email.invalid ||
      this.form.controls.password.invalid ||
      this.isSubmitting()
    ) {
      this.form.markAllAsTouched();
      return;
    }

    this.isSubmitting.set(true);
    this.errorMessage.set('');
    this.noticeMessage.set('');

    try {
      await this.authService.register({ name, email, password });

      if (this.authService.isAuthenticated()) {
        await this.router.navigate(['/dashboard']);
        return;
      }

      this.noticeMessage.set(
        'Account created. If an OTP was sent to your email, enter it below to finish verification.',
      );
    } catch (error) {
      this.errorMessage.set(this.api.extractErrorMessage(error));
    } finally {
      this.isSubmitting.set(false);
    }
  }

  async verifyOtp(): Promise<void> {
    const { email, otp } = this.form.getRawValue();

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

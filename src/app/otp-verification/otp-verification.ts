import { Component, OnInit, inject, signal } from '@angular/core';
import { NonNullableFormBuilder, ReactiveFormsModule, Validators } from '@angular/forms';
import { ActivatedRoute, Router, RouterLink } from '@angular/router';

import { ApiService } from '../api.service';
import { AuthService } from '../auth.service';
import { normalizeEmail, trimValue, trimmedLengthValidator } from '../form-utils';

@Component({
  selector: 'app-otp-verification',
  imports: [ReactiveFormsModule, RouterLink],
  templateUrl: './otp-verification.html',
  styleUrl: './otp-verification.css',
})
export class OtpVerification implements OnInit {
  private readonly api = inject(ApiService);
  private readonly authService = inject(AuthService);
  private readonly formBuilder = inject(NonNullableFormBuilder);
  private readonly route = inject(ActivatedRoute);
  private readonly router = inject(Router);

  readonly isSubmitting = signal(false);
  readonly errorMessage = signal('');
  readonly form = this.formBuilder.group({
    email: ['', [Validators.required, Validators.email]],
    code: ['', [Validators.required, trimmedLengthValidator(6, 6)]],
  });

  ngOnInit(): void {
    const queryEmail = this.route.snapshot.queryParamMap.get('email');
    if (queryEmail) {
      this.form.patchValue({ email: normalizeEmail(queryEmail) });
    }
  }

  async verifyOtp(): Promise<void> {
    const rawValue = this.form.getRawValue();
    const email = normalizeEmail(rawValue.email);
    const code = trimValue(rawValue.code);

    this.form.patchValue({ email, code }, { emitEvent: false });

    if (
      this.form.controls.email.invalid ||
      this.form.controls.code.invalid ||
      this.isSubmitting()
    ) {
      this.form.controls.email.markAsTouched();
      this.form.controls.code.markAsTouched();
      return;
    }

    this.isSubmitting.set(true);
    this.errorMessage.set('');

    try {
      await this.authService.verifyOtp(email, code);
      await this.router.navigate(['/dashboard']);
    } catch (error) {
      this.errorMessage.set(this.api.extractErrorMessage(error));
    } finally {
      this.isSubmitting.set(false);
    }
  }
}

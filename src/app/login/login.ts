import { ChangeDetectionStrategy, Component, OnInit, inject, signal } from '@angular/core';
import { NonNullableFormBuilder, ReactiveFormsModule, Validators } from '@angular/forms';
import { ActivatedRoute, Router, RouterLink } from '@angular/router';

import { ApiService } from '../api.service';
import { AuthService } from '../auth.service';
import { normalizeEmail, trimValue, trimmedLengthValidator } from '../form-utils';

@Component({
  selector: 'app-login',
  imports: [ReactiveFormsModule, RouterLink],
  templateUrl: './login.html',
  styleUrl: './login.css',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class Login implements OnInit {
  private readonly api = inject(ApiService);
  private readonly authService = inject(AuthService);
  private readonly formBuilder = inject(NonNullableFormBuilder);
  private readonly route = inject(ActivatedRoute);
  private readonly router = inject(Router);

  readonly isSubmitting = signal(false);
  readonly errorMessage = signal('');
  readonly successMessage = signal('');
  readonly form = this.formBuilder.group({
    email: ['', [Validators.required, Validators.email]],
    password: ['', [Validators.required, trimmedLengthValidator(8)]],
  });

  ngOnInit(): void {
    const queryEmail = this.route.snapshot.queryParamMap.get('email');
    const isVerified = this.route.snapshot.queryParamMap.get('verified') === 'true';

    if (queryEmail) {
      this.form.patchValue({ email: normalizeEmail(queryEmail) });
    }

    if (isVerified) {
      this.successMessage.set('Email verified successfully! Please enter your password to log in.');
    }
  }

  fillDemoCredentials(): void {
    this.form.patchValue({
      email: 'demo@linkly.com',
      password: 'demo123456',
    });
  }

  async loginWithDemo(): Promise<void> {
    this.fillDemoCredentials();
    await this.login();
  }

  async login(): Promise<void> {
    const payload = {
      email: normalizeEmail(this.form.controls.email.value),
      password: trimValue(this.form.controls.password.value),
    };

    this.form.patchValue(payload, { emitEvent: false });

    if (this.form.invalid || this.isSubmitting()) {
      this.form.markAllAsTouched();
      return;
    }

    this.isSubmitting.set(true);
    this.errorMessage.set('');

    try {
      await this.authService.login(payload);
      const returnUrl = this.route.snapshot.queryParamMap.get('returnUrl') || '/dashboard';
      await this.router.navigateByUrl(returnUrl);
    } catch (error) {
      this.errorMessage.set(this.api.extractErrorMessage(error));
    } finally {
      this.isSubmitting.set(false);
    }
  }
}

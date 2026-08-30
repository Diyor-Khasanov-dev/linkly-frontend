import { ChangeDetectionStrategy, Component, computed, inject, signal } from '@angular/core';
import { toSignal } from '@angular/core/rxjs-interop';
import { NonNullableFormBuilder, ReactiveFormsModule, Validators } from '@angular/forms';
import { RouterLink } from '@angular/router';

import { ApiService } from '../api.service';
import { AuthService } from '../auth.service';
import { trimValue } from '../form-utils';

@Component({
  selector: 'app-landing',
  imports: [ReactiveFormsModule, RouterLink],
  templateUrl: './landing.html',
  styleUrl: './landing.css',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class Landing {
  private readonly api = inject(ApiService);
  private readonly authService = inject(AuthService);
  private readonly formBuilder = inject(NonNullableFormBuilder);

  private readonly currentUser = toSignal(this.authService.user$, {
    initialValue: this.authService.getCurrentUser(),
  });

  readonly isAuthenticated = computed(() => {
    return Boolean(this.currentUser() || this.authService.isAuthenticated());
  });

  readonly isSubmitting = signal(false);
  readonly errorMessage = signal('');
  readonly shortUrl = signal('');

  readonly form = this.formBuilder.group({
    url: ['', [Validators.required, Validators.pattern(/^https?:\/\/.+/i)]],
  });

  shortenUrl(): void {
    const url = trimValue(this.form.controls.url.value);
    this.form.patchValue({ url }, { emitEvent: false });

    if (this.form.invalid || this.isSubmitting()) {
      this.form.markAllAsTouched();
      return;
    }

    this.isSubmitting.set(true);
    this.errorMessage.set('');
    this.shortUrl.set('');

    this.api.createShortLink(url).subscribe({
      next: (response) => {
        this.shortUrl.set(this.api.formatShortUrl(response));
      },
      error: (error: unknown) => {
        this.errorMessage.set(this.api.extractErrorMessage(error));
        this.isSubmitting.set(false);
      },
      complete: () => {
        this.isSubmitting.set(false);
      },
    });
  }

  async copyShortUrl(): Promise<void> {
    const url = this.shortUrl();
    if (url && navigator.clipboard) {
      await navigator.clipboard.writeText(url);
    }
  }
}

import { Component, inject, signal } from '@angular/core';
import { NonNullableFormBuilder, ReactiveFormsModule, Validators } from '@angular/forms';

import { ApiService } from '../api.service';
import { trimValue } from '../form-utils';

@Component({
  selector: 'app-landing',
  imports: [ReactiveFormsModule],
  templateUrl: './landing.html',
  styleUrl: './landing.css',
})
export class Landing {
  private readonly api = inject(ApiService);
  private readonly formBuilder = inject(NonNullableFormBuilder);

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

import { ChangeDetectionStrategy, Component, inject, signal } from '@angular/core';
import { NonNullableFormBuilder, ReactiveFormsModule, Validators } from '@angular/forms';

import { ApiService } from '../../api.service';
import { AuthService } from '../../auth.service';
import { trimValue } from '../../form-utils';

@Component({
  selector: 'app-link-short',
  imports: [ReactiveFormsModule],
  template: `
    <section class="demo-page-shell">
      <div class="demo-page-hero">
        <div>
          <p class="dashboard-eyebrow">Link Short</p>
          <h1>Create production short links</h1>
          <p>
            Paste any destination URL and Linkly will create a public short link using the real
            backend API.
          </p>
        </div>
        <span class="dashboard-pill">POST /api/links</span>
      </div>

      <div class="demo-page-grid">
        <form class="demo-feature-card" [formGroup]="form" (ngSubmit)="shorten()">
          <span>Destination URL</span>
          <label for="shortener-long-url" class="mt-5 flex flex-col gap-3 font-bold text-ink">
            Long link
            <input
              id="shortener-long-url"
              class="dashboard-input"
              type="url"
              formControlName="url"
              placeholder="https://example.com/very/long/link"
              autocomplete="url"
              [attr.aria-invalid]="form.controls.url.touched && form.controls.url.invalid"
            />
          </label>
          <label for="shortener-alias" class="mt-4 flex flex-col gap-3 font-bold text-ink">
            Custom alias (optional)
            <input
              id="shortener-alias"
              class="dashboard-input"
              type="text"
              formControlName="customAlias"
              placeholder="e.g. my-custom-link (4-32 chars)"
            />
          </label>
          <button
            class="dashboard-primary-button mt-5 w-full cursor-pointer focus:outline-none focus:ring-2 focus:ring-accent"
            type="submit"
            [disabled]="isSubmitting()"
          >
            {{ isSubmitting() ? 'Shortening…' : 'Shorten link' }}
          </button>
          @if (errorMessage()) {
            <p
              class="mt-4 rounded-sm2 border border-red-200 bg-red-50 px-4 py-3 text-sm font-semibold text-red-700"
              role="alert"
              aria-live="assertive"
            >
              {{ errorMessage() }}
            </p>
          }
        </form>

        <div class="demo-preview-card">
          <div class="dashboard-panel-header">
            <div>
              <p class="dashboard-eyebrow">Result</p>
              <h2 class="dashboard-panel-title">Your short link</h2>
            </div>
            <span class="dashboard-pill">Bearer token ready</span>
          </div>
          @if (shortUrl()) {
            <div class="mt-6 rounded-md2 border border-line bg-bg p-5" aria-live="polite">
              <p class="font-mono text-xs uppercase tracking-[0.14em] text-ink-faint">Short URL</p>
              <a
                class="mt-2 block break-all font-mono text-lg font-bold text-accent"
                [href]="shortUrl()"
                target="_blank"
                rel="noreferrer"
              >
                {{ shortUrl() }}
              </a>
              <button
                class="dashboard-secondary-button mt-4 cursor-pointer focus:outline-none focus:ring-2 focus:ring-accent"
                type="button"
                (click)="copyShortUrl()"
                aria-label="Copy short link to clipboard"
              >
                Copy link
              </button>
            </div>
          } @else {
            <div class="preview-header mt-6"><span></span><span></span><span></span></div>
            <div class="preview-line"></div>
            <div class="preview-line w-2/3"></div>
            <div class="preview-chart">
              <i style="height: 58%"></i><i style="height: 78%"></i><i style="height: 46%"></i
              ><i style="height: 88%"></i>
            </div>
          }
        </div>
      </div>
    </section>
  `,
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class LinkShort {
  private readonly api = inject(ApiService);
  private readonly auth = inject(AuthService);
  private readonly formBuilder = inject(NonNullableFormBuilder);

  readonly isSubmitting = signal(false);
  readonly errorMessage = signal('');
  readonly shortUrl = signal('');
  readonly form = this.formBuilder.group({
    url: ['', [Validators.required, Validators.pattern(/^https?:\/\/.+/i)]],
    customAlias: [''],
  });

  shorten(): void {
    const url = trimValue(this.form.controls.url.value);
    const customAlias = trimValue(this.form.controls.customAlias.value);
    this.form.patchValue({ url, customAlias }, { emitEvent: false });

    if (this.form.invalid || this.isSubmitting()) {
      this.form.markAllAsTouched();
      return;
    }

    this.isSubmitting.set(true);
    this.errorMessage.set('');
    this.shortUrl.set('');

    this.api.createShortLink(url, this.auth.getToken(), customAlias).subscribe({
      next: (response) => this.shortUrl.set(this.api.formatShortUrl(response)),
      error: (error: unknown) => {
        this.errorMessage.set(this.api.extractErrorMessage(error));
        this.isSubmitting.set(false);
      },
      complete: () => this.isSubmitting.set(false),
    });
  }

  async copyShortUrl(): Promise<void> {
    const url = this.shortUrl();

    if (url && navigator.clipboard) {
      await navigator.clipboard.writeText(url);
    }
  }
}

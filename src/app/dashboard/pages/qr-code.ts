import { ChangeDetectionStrategy, Component, computed, inject, signal } from '@angular/core';
import { NonNullableFormBuilder, ReactiveFormsModule, Validators } from '@angular/forms';
import { ApiService } from '../../api.service';
import { DemoDataService } from '../../demo-data.service';

@Component({
  selector: 'app-qr-code',
  imports: [ReactiveFormsModule],
  template: `
    <section class="demo-page-shell">
      <div class="demo-page-hero">
        <div>
          <p class="dashboard-eyebrow">QR Code Studio</p>
          <h1>Generate & customize QR codes</h1>
          <p>
            Create high-resolution QR codes using the backend API directly or preview with custom styling.
            Manage all active QR codes in your workspace.
          </p>
        </div>
        <span class="dashboard-pill font-mono">GET /api/qr</span>
      </div>

      <div class="demo-page-grid">
        <!-- Generator Form -->
        <form class="demo-feature-card flex flex-col justify-between" [formGroup]="form" (ngSubmit)="generate()">
          <div>
            <div class="flex items-center justify-between">
              <span class="font-mono text-xs uppercase text-ink-faint">Generator</span>
              <span class="font-mono text-[11px] text-accent font-bold">Backend PNG / Vector SVG</span>
            </div>

            <label for="qr-title-input" class="mt-5 flex flex-col gap-2 font-bold text-ink">
              QR Code Title
              <input
                id="qr-title-input"
                class="dashboard-input"
                type="text"
                formControlName="title"
                placeholder="e.g. Summer Campaign Poster"
              />
            </label>

            <label for="qr-target-input" class="mt-4 flex flex-col gap-2 font-bold text-ink">
              Target URL or Text
              <input
                id="qr-target-input"
                class="dashboard-input"
                type="url"
                formControlName="targetUrl"
                placeholder="https://example.com/target-page"
              />
            </label>

            <div class="mt-4 grid grid-cols-2 gap-4">
              <label class="flex flex-col gap-2 font-bold text-ink text-sm">
                Foreground Color
                <div class="flex items-center gap-2">
                  <input type="color" formControlName="fgColor" class="w-9 h-9 rounded cursor-pointer border border-line p-0 bg-transparent" />
                  <input type="text" formControlName="fgColor" class="dashboard-input font-mono text-xs uppercase flex-1" />
                </div>
              </label>

              <label class="flex flex-col gap-2 font-bold text-ink text-sm">
                Background Color
                <div class="flex items-center gap-2">
                  <input type="color" formControlName="bgColor" class="w-9 h-9 rounded cursor-pointer border border-line p-0 bg-transparent" />
                  <input type="text" formControlName="bgColor" class="dashboard-input font-mono text-xs uppercase flex-1" />
                </div>
              </label>
            </div>

            <!-- Quick Color Presets -->
            <div class="mt-4">
              <span class="text-xs font-semibold text-ink-soft block mb-2">Color Presets</span>
              <div class="flex gap-2">
                <button type="button" (click)="applyPreset('#1d1f26', '#ffffff')" class="px-3 py-1.5 rounded-sm2 text-xs font-mono border border-line bg-surface text-ink hover:border-ink">Dark / White</button>
                <button type="button" (click)="applyPreset('#ff5a3d', '#ffffff')" class="px-3 py-1.5 rounded-sm2 text-xs font-mono border border-line bg-surface text-accent hover:border-accent">Accent / White</button>
                <button type="button" (click)="applyPreset('#0e9e76', '#fbfaf6')" class="px-3 py-1.5 rounded-sm2 text-xs font-mono border border-line bg-[#fbfaf6] text-[#0e9e76] hover:border-[#0e9e76]">Emerald / Offwhite</button>
              </div>
            </div>
          </div>

          <button
            class="dashboard-primary-button mt-6 w-full"
            type="submit"
          >
            Create QR Code
          </button>
        </form>

        <!-- Preview Card -->
        <div class="demo-preview-card flex flex-col justify-between">
          <div class="dashboard-panel-header">
            <div>
              <p class="dashboard-eyebrow">Backend Live Preview</p>
              <h2 class="dashboard-panel-title">QR Code Result</h2>
            </div>
            <span class="dashboard-pill font-mono text-xs">{{ previewTitle() }}</span>
          </div>

          <div class="my-6 p-8 rounded-md2 border border-line flex flex-col items-center justify-center transition-colors" [style.background-color]="previewBgColor()">
            <!-- Live Backend QR Code Image -->
            <div class="w-48 h-48 relative flex items-center justify-center p-3 rounded-md shadow-md border border-line/20 bg-white">
              <img
                [src]="backendQrUrl()"
                alt="Backend generated QR Code"
                class="w-full h-full object-contain"
              />
            </div>

            <p class="mt-4 font-mono text-xs truncate max-w-full text-center text-ink-soft">
              Target: <span class="font-bold text-ink">{{ previewTargetUrl() }}</span>
            </p>
          </div>

          <div class="flex gap-3">
            <button
              type="button"
              (click)="copyTargetUrl()"
              class="dashboard-secondary-button flex-1"
            >
              {{ copied() ? '✓ Target URL Copied' : 'Copy Target URL' }}
            </button>
            <a
              [href]="backendQrUrl()"
              target="_blank"
              download="qrcode.png"
              class="dashboard-primary-button flex-1 text-center"
            >
              Download PNG
            </a>
          </div>
        </div>
      </div>

      <!-- Active Demo QR Codes List -->
      <div class="mt-8 dashboard-panel">
        <div class="dashboard-panel-header mb-6">
          <div>
            <p class="dashboard-eyebrow font-mono">Workspace Directory</p>
            <h2 class="dashboard-panel-title">Active QR Codes ({{ demoService.qrCodes().length }})</h2>
          </div>
          <span class="dashboard-pill font-mono text-xs">Real-time sync</span>
        </div>

        <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
          @for (qr of demoService.qrCodes(); track qr.id) {
            <div class="bg-surface border border-line rounded-md2 p-4 flex flex-col justify-between hover:border-accent/40 transition-all">
              <div>
                <div class="flex items-center justify-between mb-3">
                  <span class="w-3 h-3 rounded-full border border-line" [style.background-color]="qr.fgColor"></span>
                  <button (click)="demoService.deleteQrCode(qr.id)" title="Delete QR Code" class="text-xs text-ink-faint hover:text-red-500 font-bold px-1.5 py-0.5 rounded">✕</button>
                </div>
                <h3 class="font-bold text-ink text-sm line-clamp-1">{{ qr.title }}</h3>
                <p class="font-mono text-xs text-ink-soft truncate mt-1">{{ qr.targetUrl }}</p>
              </div>

              <div class="mt-4 pt-3 border-t border-line/60 flex items-center justify-between text-xs font-mono">
                <span class="text-ink-faint">Scans: <b class="text-ink font-bold">{{ qr.scanCount }}</b></span>
                <span class="text-ink-faint">{{ qr.createdAt }}</span>
              </div>
            </div>
          }
        </div>
      </div>
    </section>
  `,
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class QrCode {
  readonly apiService = inject(ApiService);
  readonly demoService = inject(DemoDataService);
  private readonly formBuilder = inject(NonNullableFormBuilder);

  readonly copied = signal(false);

  readonly form = this.formBuilder.group({
    title: ['Spring Campaign Landing Page', [Validators.required]],
    targetUrl: ['https://linkly.com/promo/spring-2025', [Validators.required]],
    fgColor: ['#1d1f26'],
    bgColor: ['#ffffff'],
  });

  readonly previewTitle = signal('Spring Campaign Landing Page');
  readonly previewTargetUrl = signal('https://linkly.com/promo/spring-2025');
  readonly previewFgColor = signal('#1d1f26');
  readonly previewBgColor = signal('#ffffff');

  readonly backendQrUrl = computed(() => {
    return this.apiService.getQrCodeUrl(this.previewTargetUrl());
  });

  applyPreset(fg: string, bg: string): void {
    this.form.patchValue({ fgColor: fg, bgColor: bg });
    this.previewFgColor.set(fg);
    this.previewBgColor.set(bg);
  }

  generate(): void {
    const { title, targetUrl, fgColor, bgColor } = this.form.getRawValue();
    if (!targetUrl) return;

    this.previewTitle.set(title || 'Custom QR Code');
    this.previewTargetUrl.set(targetUrl);
    this.previewFgColor.set(fgColor || '#1d1f26');
    this.previewBgColor.set(bgColor || '#ffffff');

    this.demoService.addQrCode(title, targetUrl, fgColor, bgColor);
  }

  async copyTargetUrl(): Promise<void> {
    const url = this.previewTargetUrl();
    if (url && navigator.clipboard) {
      await navigator.clipboard.writeText(url);
      this.copied.set(true);
      setTimeout(() => this.copied.set(false), 2000);
    }
  }

}

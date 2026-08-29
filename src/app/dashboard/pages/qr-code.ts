import { Component, inject, signal } from '@angular/core';
import { NonNullableFormBuilder, ReactiveFormsModule, Validators } from '@angular/forms';
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
            Create high-resolution QR codes with custom styling, colors, and target destinations.
            Manage all active QR codes in your demo workspace.
          </p>
        </div>
        <span class="dashboard-pill font-mono">Demo Workspace Ready</span>
      </div>

      <div class="demo-page-grid">
        <!-- Generator Form -->
        <form class="demo-feature-card flex flex-col justify-between" [formGroup]="form" (ngSubmit)="generate()">
          <div>
            <div class="flex items-center justify-between">
              <span class="font-mono text-xs uppercase text-ink-faint">Generator</span>
              <span class="font-mono text-[11px] text-accent font-bold">Vector SVG Output</span>
            </div>

            <label class="mt-5 flex flex-col gap-2 font-bold text-ink">
              QR Code Title
              <input
                class="dashboard-input"
                type="text"
                formControlName="title"
                placeholder="e.g. Summer Campaign Poster"
              />
            </label>

            <label class="mt-4 flex flex-col gap-2 font-bold text-ink">
              Target URL or Text
              <input
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
              <p class="dashboard-eyebrow">Live Visual Preview</p>
              <h2 class="dashboard-panel-title">QR Code Result</h2>
            </div>
            <span class="dashboard-pill font-mono text-xs">{{ previewTitle() }}</span>
          </div>

          <div class="my-6 p-8 rounded-md2 border border-line flex flex-col items-center justify-center transition-colors" [style.background-color]="previewBgColor()">
            <!-- SVG QR Code Visual Matrix -->
            <div class="w-48 h-48 relative flex items-center justify-center p-3 rounded-md shadow-md border border-line/20" [style.background-color]="previewBgColor()">
              <svg viewBox="0 0 100 100" class="w-full h-full" [style.fill]="previewFgColor()">
                <!-- QR Corner Finder Top Left -->
                <rect x="5" y="5" width="25" height="25" rx="3" />
                <rect x="9" y="9" width="17" height="17" rx="2" [style.fill]="previewBgColor()" />
                <rect x="13" y="13" width="9" height="9" rx="1" />

                <!-- QR Corner Finder Top Right -->
                <rect x="70" y="5" width="25" height="25" rx="3" />
                <rect x="74" y="9" width="17" height="17" rx="2" [style.fill]="previewBgColor()" />
                <rect x="78" y="13" width="9" height="9" rx="1" />

                <!-- QR Corner Finder Bottom Left -->
                <rect x="5" y="70" width="25" height="25" rx="3" />
                <rect x="9" y="74" width="17" height="17" rx="2" [style.fill]="previewBgColor()" />
                <rect x="13" y="78" width="9" height="9" rx="1" />

                <!-- Data Modules Pattern Grid -->
                <rect x="35" y="5" width="5" height="5" />
                <rect x="45" y="5" width="5" height="5" />
                <rect x="55" y="5" width="5" height="5" />
                <rect x="35" y="15" width="5" height="5" />
                <rect x="50" y="15" width="5" height="5" />
                <rect x="60" y="15" width="5" height="5" />

                <rect x="5" y="35" width="5" height="5" />
                <rect x="15" y="35" width="5" height="5" />
                <rect x="25" y="35" width="5" height="5" />
                <rect x="35" y="35" width="10" height="5" />
                <rect x="50" y="35" width="5" height="5" />
                <rect x="60" y="35" width="10" height="5" />
                <rect x="75" y="35" width="5" height="5" />
                <rect x="85" y="35" width="10" height="5" />

                <rect x="5" y="45" width="5" height="5" />
                <rect x="20" y="45" width="5" height="5" />
                <rect x="30" y="45" width="5" height="5" />
                <rect x="45" y="45" width="10" height="5" />
                <rect x="65" y="45" width="5" height="5" />
                <rect x="80" y="45" width="5" height="5" />

                <rect x="10" y="55" width="5" height="5" />
                <rect x="25" y="55" width="5" height="5" />
                <rect x="35" y="55" width="5" height="5" />
                <rect x="55" y="55" width="10" height="5" />
                <rect x="70" y="55" width="5" height="5" />
                <rect x="85" y="55" width="5" height="5" />

                <rect x="35" y="70" width="5" height="5" />
                <rect x="45" y="70" width="10" height="5" />
                <rect x="60" y="70" width="5" height="5" />
                <rect x="75" y="70" width="5" height="5" />
                <rect x="85" y="70" width="10" height="5" />

                <rect x="40" y="80" width="5" height="5" />
                <rect x="50" y="80" width="5" height="5" />
                <rect x="65" y="80" width="10" height="5" />
                <rect x="80" y="80" width="5" height="5" />

                <rect x="35" y="90" width="10" height="5" />
                <rect x="55" y="90" width="5" height="5" />
                <rect x="70" y="90" width="5" height="5" />
                <rect x="85" y="90" width="5" height="5" />
              </svg>
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
            <button
              type="button"
              (click)="downloadSimulated()"
              class="dashboard-primary-button flex-1"
            >
              Download SVG / PNG
            </button>
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
})
export class QrCode {
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

  downloadSimulated(): void {
    const svgData = `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 100 100"><rect width="100" height="100" fill="${this.previewBgColor()}"/><path fill="${this.previewFgColor()}" d="M5 5h25v25H5zm4 4v17h17V9zm4 4h9v9h-9zm52-8h25v25H70zm4 4v17h17V9zm4 4h9v9h-9zM5 70h25v25H5zm4 4v17h17V74zm4 4h9v9h-9z"/></svg>`;
    const blob = new Blob([svgData], { type: 'image/svg+xml' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `${this.previewTitle().toLowerCase().replace(/[^a-z0-9]/g, '-')}-qrcode.svg`;
    a.click();
    URL.revokeObjectURL(url);
  }
}

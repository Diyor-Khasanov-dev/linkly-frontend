import { Component, inject, signal, computed } from '@angular/core';
import { NonNullableFormBuilder, ReactiveFormsModule, Validators } from '@angular/forms';
import { DemoDataService } from '../../demo-data.service';

@Component({
  selector: 'app-expiring-qr-codes',
  imports: [ReactiveFormsModule],
  template: `
    <section class="demo-page-shell">
      <div class="demo-page-hero">
        <div>
          <p class="dashboard-eyebrow">Expiring QR Codes</p>
          <h1>Temporary QR codes & time-bound access</h1>
          <p>
            Deploy QR codes with expiration limits, scan caps, or event decay. Great for event badges, flash pop-up stores, and guest portal access.
          </p>
        </div>
        <button
          type="button"
          (click)="showCreateModal.set(true)"
          class="dashboard-primary-button"
        >
          + Create Expiring QR Code
        </button>
      </div>

      <!-- Summary Metrics -->
      <div class="mt-6 grid grid-cols-1 sm:grid-cols-3 gap-4">
        <div class="dashboard-stat-card">
          <p class="dashboard-eyebrow">Active QR Codes</p>
          <p class="font-display font-bold text-3xl mt-2 text-ink">{{ activeCount() }}</p>
          <p class="text-xs text-accent-2 font-mono mt-1">Ready for scanning</p>
        </div>
        <div class="dashboard-stat-card">
          <p class="dashboard-eyebrow">Expiring Soon</p>
          <p class="font-display font-bold text-3xl mt-2 text-amber-600">{{ expiringSoonCount() }}</p>
          <p class="text-xs text-amber-600 font-mono mt-1">Under 3 days remaining</p>
        </div>
        <div class="dashboard-stat-card">
          <p class="dashboard-eyebrow">Expired QR Codes</p>
          <p class="font-display font-bold text-3xl mt-2 text-red-600">{{ expiredCount() }}</p>
          <p class="text-xs text-red-500 font-mono mt-1">Scan access disabled</p>
        </div>
      </div>

      <!-- QR Codes Directory -->
      <div class="mt-8 dashboard-panel">
        <div class="dashboard-panel-header mb-6">
          <div>
            <p class="dashboard-eyebrow font-mono">Managed QR Items</p>
            <h2 class="dashboard-panel-title">Expiring QR Codes ({{ demoService.expiringQrs().length }})</h2>
          </div>
          <div class="flex items-center gap-2">
            <button
              type="button"
              (click)="filterStatus.set('all')"
              class="px-3 py-1.5 rounded-sm2 text-xs font-mono font-bold transition-all"
              [class.bg-ink]="filterStatus() === 'all'"
              [class.text-white]="filterStatus() === 'all'"
              [class.bg-surface]="filterStatus() !== 'all'"
              [class.border]="filterStatus() !== 'all'"
              [class.border-line]="filterStatus() !== 'all'"
            >
              All
            </button>
            <button
              type="button"
              (click)="filterStatus.set('active')"
              class="px-3 py-1.5 rounded-sm2 text-xs font-mono font-bold transition-all"
              [class.bg-ink]="filterStatus() === 'active'"
              [class.text-white]="filterStatus() === 'active'"
              [class.bg-surface]="filterStatus() !== 'active'"
              [class.border]="filterStatus() !== 'active'"
              [class.border-line]="filterStatus() !== 'active'"
            >
              Active
            </button>
            <button
              type="button"
              (click)="filterStatus.set('expiring_soon')"
              class="px-3 py-1.5 rounded-sm2 text-xs font-mono font-bold transition-all"
              [class.bg-ink]="filterStatus() === 'expiring_soon'"
              [class.text-white]="filterStatus() === 'expiring_soon'"
              [class.bg-surface]="filterStatus() !== 'expiring_soon'"
              [class.border]="filterStatus() !== 'expiring_soon'"
              [class.border-line]="filterStatus() !== 'expiring_soon'"
            >
              Expiring Soon
            </button>
            <button
              type="button"
              (click)="filterStatus.set('expired')"
              class="px-3 py-1.5 rounded-sm2 text-xs font-mono font-bold transition-all"
              [class.bg-ink]="filterStatus() === 'expired'"
              [class.text-white]="filterStatus() === 'expired'"
              [class.bg-surface]="filterStatus() !== 'expired'"
              [class.border]="filterStatus() !== 'expired'"
              [class.border-line]="filterStatus() !== 'expired'"
            >
              Expired
            </button>
          </div>
        </div>

        <div class="divide-y divide-line/60">
          @for (qr of filteredQrs(); track qr.id) {
            <div class="py-4 flex flex-col md:flex-row md:items-center justify-between gap-4">
              <div class="flex items-start gap-3 max-w-lg">
                <span class="w-4 h-4 rounded-full border border-line mt-1 flex-shrink-0" [style.background-color]="qr.fgColor"></span>
                <div class="space-y-1">
                  <div class="flex items-center gap-2">
                    <h3 class="font-bold text-ink text-base">{{ qr.title }}</h3>
                    @if (qr.status === 'active') {
                      <span class="px-2 py-0.5 rounded-full text-[11px] font-mono font-bold bg-emerald-50 text-emerald-700 border border-emerald-200">Active</span>
                    } @else if (qr.status === 'expiring_soon') {
                      <span class="px-2 py-0.5 rounded-full text-[11px] font-mono font-bold bg-amber-50 text-amber-700 border border-amber-200">Expiring Soon</span>
                    } @else {
                      <span class="px-2 py-0.5 rounded-full text-[11px] font-mono font-bold bg-red-50 text-red-700 border border-red-200">Expired</span>
                    }
                  </div>
                  <p class="font-mono text-xs text-ink-soft truncate">Target: {{ qr.targetUrl }}</p>
                </div>
              </div>

              <div class="flex flex-wrap items-center gap-4 text-xs font-mono">
                <div class="bg-bg border border-line rounded-md p-2 min-w-[120px]">
                  <span class="text-ink-faint block uppercase text-[10px]">Scans</span>
                  <b class="text-ink font-bold">{{ qr.currentScans }} {{ qr.maxScans ? '/ ' + qr.maxScans : '' }}</b>
                </div>

                <div class="bg-bg border border-line rounded-md p-2 min-w-[150px]">
                  <span class="text-ink-faint block uppercase text-[10px]">Expires</span>
                  <b class="text-ink font-bold">{{ formatDate(qr.expiresAt) }}</b>
                </div>

                <div class="flex items-center gap-2">
                  <button
                    type="button"
                    (click)="demoService.extendQrExpiration(qr.id, 7)"
                    class="dashboard-secondary-button text-xs py-1.5 px-3"
                    title="Add 7 Days"
                  >
                    +7 Days
                  </button>
                  <button
                    type="button"
                    (click)="demoService.deleteExpiringQr(qr.id)"
                    class="text-xs text-ink-faint hover:text-red-600 font-bold px-2 py-1.5 border border-line rounded-sm2 hover:border-red-300"
                    title="Delete QR"
                  >
                    Delete
                  </button>
                </div>
              </div>
            </div>
          } @empty {
            <p class="py-8 text-center text-sm font-mono text-ink-faint">No expiring QR codes matched the selected filter.</p>
          }
        </div>
      </div>

      <!-- Create Modal -->
      @if (showCreateModal()) {
        <div class="fixed inset-0 z-50 bg-ink/50 backdrop-blur-sm flex items-center justify-center p-4">
          <div class="bg-surface border border-line rounded-lg2 max-w-md w-full p-6 shadow-2xl">
            <div class="flex justify-between items-center mb-4">
              <h2 class="font-display font-bold text-xl">Create Expiring QR Code</h2>
              <button (click)="showCreateModal.set(false)" class="text-ink-faint hover:text-ink font-bold text-lg">✕</button>
            </div>

            <form [formGroup]="form" (ngSubmit)="createQr()" class="flex flex-col gap-4">
              <label class="flex flex-col gap-2 text-sm font-semibold text-ink">
                Title
                <input class="dashboard-input" type="text" formControlName="title" placeholder="e.g. Pop-up Store Menu QR" />
              </label>

              <label class="flex flex-col gap-2 text-sm font-semibold text-ink">
                Target URL
                <input class="dashboard-input" type="url" formControlName="targetUrl" placeholder="https://example.com/target" />
              </label>

              <div class="grid grid-cols-2 gap-3">
                <label class="flex flex-col gap-2 text-sm font-semibold text-ink">
                  Expires In (Days)
                  <input class="dashboard-input" type="number" min="1" max="90" formControlName="expiresAtDays" />
                </label>

                <label class="flex flex-col gap-2 text-sm font-semibold text-ink">
                  Max Scans (Optional)
                  <input class="dashboard-input" type="number" min="1" formControlName="maxScans" placeholder="Unlimited" />
                </label>
              </div>

              <div class="flex gap-2 mt-4">
                <button type="button" (click)="showCreateModal.set(false)" class="dashboard-secondary-button flex-1">Cancel</button>
                <button type="submit" class="dashboard-primary-button flex-1">Create QR Code</button>
              </div>
            </form>
          </div>
        </div>
      }
    </section>
  `,
})
export class ExpiringQrCodes {
  readonly demoService = inject(DemoDataService);
  private readonly formBuilder = inject(NonNullableFormBuilder);

  readonly showCreateModal = signal(false);
  readonly filterStatus = signal<'all' | 'active' | 'expiring_soon' | 'expired'>('all');

  readonly form = this.formBuilder.group({
    title: ['', [Validators.required]],
    targetUrl: ['', [Validators.required, Validators.pattern(/^https?:\/\/.+/i)]],
    expiresAtDays: [7, [Validators.required]],
    maxScans: [null as number | null],
  });

  readonly activeCount = computed(() => this.demoService.expiringQrs().filter((q) => q.status === 'active').length);
  readonly expiringSoonCount = computed(() => this.demoService.expiringQrs().filter((q) => q.status === 'expiring_soon').length);
  readonly expiredCount = computed(() => this.demoService.expiringQrs().filter((q) => q.status === 'expired').length);

  readonly filteredQrs = computed(() => {
    const status = this.filterStatus();
    const qrs = this.demoService.expiringQrs();
    if (status === 'all') return qrs;
    return qrs.filter((q) => q.status === status);
  });

  createQr(): void {
    if (this.form.invalid) {
      this.form.markAllAsTouched();
      return;
    }

    const { title, targetUrl, expiresAtDays, maxScans } = this.form.getRawValue();
    this.demoService.addExpiringQr(title, targetUrl, Number(expiresAtDays), maxScans ? Number(maxScans) : null);
    this.form.reset({ title: '', targetUrl: '', expiresAtDays: 7, maxScans: null });
    this.showCreateModal.set(false);
  }

  formatDate(date: Date): string {
    return new Date(date).toLocaleDateString('en-US', {
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
    });
  }
}

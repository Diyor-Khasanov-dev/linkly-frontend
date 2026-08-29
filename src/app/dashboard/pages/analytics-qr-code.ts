import { Component, inject } from '@angular/core';
import { DemoDataService } from '../../demo-data.service';

@Component({
  selector: 'app-analytics-qr-code',
  template: `
    <section class="demo-page-shell">
      <div class="demo-page-hero">
        <div>
          <p class="dashboard-eyebrow">Analytics QR Code</p>
          <h1>QR Code scan metrics & locations</h1>
          <p>
            Monitor physical and digital QR code scans, scanner OS breakdown, top cities, and velocity metrics.
          </p>
        </div>
        <div class="flex items-center gap-2">
          <button
            type="button"
            (click)="demoService.qrAnalyticsTimeframe.set('7d')"
            class="px-3 py-1.5 rounded-sm2 text-xs font-mono font-bold transition-all"
            [class.bg-accent]="demoService.qrAnalyticsTimeframe() === '7d'"
            [class.text-white]="demoService.qrAnalyticsTimeframe() === '7d'"
            [class.bg-surface]="demoService.qrAnalyticsTimeframe() !== '7d'"
            [class.border]="demoService.qrAnalyticsTimeframe() !== '7d'"
            [class.border-line]="demoService.qrAnalyticsTimeframe() !== '7d'"
          >
            7 Days
          </button>
          <button
            type="button"
            (click)="demoService.qrAnalyticsTimeframe.set('30d')"
            class="px-3 py-1.5 rounded-sm2 text-xs font-mono font-bold transition-all"
            [class.bg-accent]="demoService.qrAnalyticsTimeframe() === '30d'"
            [class.text-white]="demoService.qrAnalyticsTimeframe() === '30d'"
            [class.bg-surface]="demoService.qrAnalyticsTimeframe() !== '30d'"
            [class.border]="demoService.qrAnalyticsTimeframe() !== '30d'"
            [class.border-line]="demoService.qrAnalyticsTimeframe() !== '30d'"
          >
            30 Days
          </button>
          <button
            type="button"
            (click)="demoService.qrAnalyticsTimeframe.set('all')"
            class="px-3 py-1.5 rounded-sm2 text-xs font-mono font-bold transition-all"
            [class.bg-accent]="demoService.qrAnalyticsTimeframe() === 'all'"
            [class.text-white]="demoService.qrAnalyticsTimeframe() === 'all'"
            [class.bg-surface]="demoService.qrAnalyticsTimeframe() !== 'all'"
            [class.border]="demoService.qrAnalyticsTimeframe() !== 'all'"
            [class.border-line]="demoService.qrAnalyticsTimeframe() !== 'all'"
          >
            All Time
          </button>
        </div>
      </div>

      <!-- Key Metrics -->
      <div class="mt-6 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <div class="dashboard-stat-card">
          <p class="dashboard-eyebrow">Total QR Scans</p>
          <p class="font-display font-bold text-3xl mt-2">3,900</p>
          <p class="text-xs text-accent-2 font-mono mt-1">↑ +24.2% month-over-month</p>
        </div>
        <div class="dashboard-stat-card">
          <p class="dashboard-eyebrow">Mobile Ratio</p>
          <p class="font-display font-bold text-3xl mt-2">94.0%</p>
          <p class="text-xs text-accent-2 font-mono mt-1">Camera App direct scans</p>
        </div>
        <div class="dashboard-stat-card">
          <p class="dashboard-eyebrow">Top Location</p>
          <p class="font-display font-bold text-3xl mt-2">San Francisco</p>
          <p class="text-xs text-ink-faint font-mono mt-1">followed by London & Berlin</p>
        </div>
        <div class="dashboard-stat-card">
          <p class="dashboard-eyebrow">Peak Scan Time</p>
          <p class="font-display font-bold text-3xl mt-2">2:00 - 4:00 PM</p>
          <p class="text-xs text-ink-faint font-mono mt-1">Local timezone peak</p>
        </div>
      </div>

      <!-- Scan History Bar Chart -->
      <div class="mt-6 dashboard-panel">
        <div class="dashboard-panel-header mb-6">
          <div>
            <p class="dashboard-eyebrow">Scan Trends</p>
            <h2 class="dashboard-panel-title">Daily QR Scan History</h2>
          </div>
          <span class="dashboard-pill font-mono text-xs">Range: {{ demoService.qrAnalyticsTimeframe() }}</span>
        </div>

        <div class="h-44 flex items-end gap-3 pt-6 pb-2 border-b border-line px-2">
          <div class="chart-bar" style="height: 30%; background: linear-gradient(180deg, #0e9e76 0%, #076d51 100%);" title="Day 1: 110 scans"></div>
          <div class="chart-bar" style="height: 45%; background: linear-gradient(180deg, #0e9e76 0%, #076d51 100%);" title="Day 2: 170 scans"></div>
          <div class="chart-bar" style="height: 60%; background: linear-gradient(180deg, #0e9e76 0%, #076d51 100%);" title="Day 3: 230 scans"></div>
          <div class="chart-bar" style="height: 50%; background: linear-gradient(180deg, #0e9e76 0%, #076d51 100%);" title="Day 4: 190 scans"></div>
          <div class="chart-bar" style="height: 80%; background: linear-gradient(180deg, #0e9e76 0%, #076d51 100%);" title="Day 5: 310 scans"></div>
          <div class="chart-bar" style="height: 95%; background: linear-gradient(180deg, #0e9e76 0%, #076d51 100%);" title="Day 6: 380 scans"></div>
          <div class="chart-bar" style="height: 70%; background: linear-gradient(180deg, #0e9e76 0%, #076d51 100%);" title="Day 7: 270 scans"></div>
          <div class="chart-bar" style="height: 85%; background: linear-gradient(180deg, #0e9e76 0%, #076d51 100%);" title="Day 8: 340 scans"></div>
          <div class="chart-bar" style="height: 100%; background: linear-gradient(180deg, #0e9e76 0%, #076d51 100%);" title="Day 9: 410 scans"></div>
          <div class="chart-bar" style="height: 75%; background: linear-gradient(180deg, #0e9e76 0%, #076d51 100%);" title="Day 10: 290 scans"></div>
        </div>
        <div class="flex justify-between text-xs font-mono text-ink-faint mt-3 px-2">
          <span>Start of Month</span>
          <span>Mid Month</span>
          <span>Today</span>
        </div>
      </div>

      <div class="mt-6 grid grid-cols-1 lg:grid-cols-2 gap-6">
        <!-- Scanner OS Breakdown -->
        <div class="dashboard-panel">
          <div class="dashboard-panel-header mb-4">
            <div>
              <p class="dashboard-eyebrow">Operating Systems</p>
              <h2 class="dashboard-panel-title text-xl">Scanner Devices</h2>
            </div>
          </div>
          <div class="space-y-4">
            @for (dev of demoService.qrScanDevices(); track dev.platform) {
              <div class="source-row">
                <div class="flex justify-between text-sm">
                  <span>{{ dev.platform }}</span>
                  <b class="font-mono">{{ dev.scans }} ({{ dev.percentage }}%)</b>
                </div>
                <i [style.width.%]="dev.percentage" style="background: linear-gradient(90deg, #ff5a3d, #ffb09e);"></i>
              </div>
            }
          </div>
        </div>

        <!-- Scan Locations -->
        <div class="dashboard-panel">
          <div class="dashboard-panel-header mb-4">
            <div>
              <p class="dashboard-eyebrow">Top Metros</p>
              <h2 class="dashboard-panel-title text-xl">Scan Cities</h2>
            </div>
          </div>
          <div class="space-y-4">
            @for (loc of demoService.qrScanLocations(); track loc.location) {
              <div class="source-row">
                <div class="flex justify-between text-sm">
                  <span>{{ loc.location }}</span>
                  <b class="font-mono">{{ loc.scans }} scans</b>
                </div>
                <i [style.width.%]="(loc.scans / 1120) * 100" style="background: linear-gradient(90deg, #1d1f26, #656874);"></i>
              </div>
            }
          </div>
        </div>
      </div>

      <!-- Scanned QR Codes List -->
      <div class="mt-6 dashboard-panel">
        <div class="dashboard-panel-header mb-4">
          <div>
            <p class="dashboard-eyebrow">Scanned QR Codes</p>
            <h2 class="dashboard-panel-title">QR Code Performance</h2>
          </div>
        </div>
        <div class="divide-y divide-line/60">
          @for (qr of demoService.qrCodes(); track qr.id) {
            <div class="py-3 flex items-center justify-between gap-2">
              <div class="flex items-center gap-3">
                <span class="w-3.5 h-3.5 rounded-full border border-line" [style.background-color]="qr.fgColor"></span>
                <div>
                  <strong class="text-ink font-bold text-sm block">{{ qr.title }}</strong>
                  <span class="font-mono text-xs text-ink-soft">{{ qr.targetUrl }}</span>
                </div>
              </div>
              <div class="font-mono text-sm text-right">
                <b class="text-accent font-bold">{{ qr.scanCount }} scans</b>
                <span class="text-xs text-ink-faint block">Created {{ qr.createdAt }}</span>
              </div>
            </div>
          }
        </div>
      </div>
    </section>
  `,
})
export class AnalyticsQrCode {
  readonly demoService = inject(DemoDataService);
}

import { ChangeDetectionStrategy, Component, inject } from '@angular/core';
import { DemoDataService } from '../../demo-data.service';

@Component({
  selector: 'app-analytics-link',
  changeDetection: ChangeDetectionStrategy.OnPush,
  template: `
    <section class="demo-page-shell">
      <div class="demo-page-hero">
        <div>
          <p class="dashboard-eyebrow">Analytics Link</p>
          <h1>Short link traffic & conversion insights</h1>
          <p>
            Track real-time click volume, geographic distribution, traffic sources, and device breakdowns for all short links.
          </p>
        </div>
        <div class="flex items-center gap-2">
          <button
            type="button"
            (click)="demoService.linkAnalyticsTimeframe.set('7d')"
            class="px-3 py-1.5 rounded-sm2 text-xs font-mono font-bold transition-all"
            [class.bg-accent]="demoService.linkAnalyticsTimeframe() === '7d'"
            [class.text-white]="demoService.linkAnalyticsTimeframe() === '7d'"
            [class.bg-surface]="demoService.linkAnalyticsTimeframe() !== '7d'"
            [class.border]="demoService.linkAnalyticsTimeframe() !== '7d'"
            [class.border-line]="demoService.linkAnalyticsTimeframe() !== '7d'"
          >
            7 Days
          </button>
          <button
            type="button"
            (click)="demoService.linkAnalyticsTimeframe.set('30d')"
            class="px-3 py-1.5 rounded-sm2 text-xs font-mono font-bold transition-all"
            [class.bg-accent]="demoService.linkAnalyticsTimeframe() === '30d'"
            [class.text-white]="demoService.linkAnalyticsTimeframe() === '30d'"
            [class.bg-surface]="demoService.linkAnalyticsTimeframe() !== '30d'"
            [class.border]="demoService.linkAnalyticsTimeframe() !== '30d'"
            [class.border-line]="demoService.linkAnalyticsTimeframe() !== '30d'"
          >
            30 Days
          </button>
          <button
            type="button"
            (click)="demoService.linkAnalyticsTimeframe.set('all')"
            class="px-3 py-1.5 rounded-sm2 text-xs font-mono font-bold transition-all"
            [class.bg-accent]="demoService.linkAnalyticsTimeframe() === 'all'"
            [class.text-white]="demoService.linkAnalyticsTimeframe() === 'all'"
            [class.bg-surface]="demoService.linkAnalyticsTimeframe() !== 'all'"
            [class.border]="demoService.linkAnalyticsTimeframe() !== 'all'"
            [class.border-line]="demoService.linkAnalyticsTimeframe() !== 'all'"
          >
            All Time
          </button>
        </div>
      </div>

      <!-- Key Metrics -->
      <div class="mt-6 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <div class="dashboard-stat-card">
          <p class="dashboard-eyebrow">Total Clicks</p>
          <p class="font-display font-bold text-3xl mt-2">12,410</p>
          <p class="text-xs text-accent-2 font-mono mt-1">↑ +18.4% vs last period</p>
        </div>
        <div class="dashboard-stat-card">
          <p class="dashboard-eyebrow">Unique Visitors</p>
          <p class="font-display font-bold text-3xl mt-2">9,180</p>
          <p class="text-xs text-accent-2 font-mono mt-1">↑ +12.1% unique reach</p>
        </div>
        <div class="dashboard-stat-card">
          <p class="dashboard-eyebrow">Top Referrer</p>
          <p class="font-display font-bold text-3xl mt-2">Direct (43.7%)</p>
          <p class="text-xs text-ink-faint font-mono mt-1">followed by Google (25.0%)</p>
        </div>
        <div class="dashboard-stat-card">
          <p class="dashboard-eyebrow">Avg. CTR</p>
          <p class="font-display font-bold text-3xl mt-2">4.82%</p>
          <p class="text-xs text-accent-2 font-mono mt-1">↑ High engagement</p>
        </div>
      </div>

      <!-- Traffic Trend Chart Visual -->
      <div class="mt-6 dashboard-panel">
        <div class="dashboard-panel-header mb-6">
          <div>
            <p class="dashboard-eyebrow">Traffic Overview</p>
            <h2 class="dashboard-panel-title">Click Volume History</h2>
          </div>
          <span class="dashboard-pill font-mono text-xs">Range: {{ demoService.linkAnalyticsTimeframe() }}</span>
        </div>

        <div class="h-44 flex items-end gap-3 pt-6 pb-2 border-b border-line px-2">
          <div class="chart-bar" style="height: 40%" title="Day 1: 310 clicks"></div>
          <div class="chart-bar" style="height: 55%" title="Day 2: 420 clicks"></div>
          <div class="chart-bar" style="height: 35%" title="Day 3: 280 clicks"></div>
          <div class="chart-bar" style="height: 70%" title="Day 4: 590 clicks"></div>
          <div class="chart-bar" style="height: 85%" title="Day 5: 710 clicks"></div>
          <div class="chart-bar" style="height: 65%" title="Day 6: 520 clicks"></div>
          <div class="chart-bar" style="height: 95%" title="Day 7: 840 clicks"></div>
          <div class="chart-bar" style="height: 60%" title="Day 8: 490 clicks"></div>
          <div class="chart-bar" style="height: 75%" title="Day 9: 630 clicks"></div>
          <div class="chart-bar" style="height: 100%" title="Day 10: 920 clicks"></div>
          <div class="chart-bar" style="height: 80%" title="Day 11: 680 clicks"></div>
          <div class="chart-bar" style="height: 90%" title="Day 12: 780 clicks"></div>
        </div>
        <div class="flex justify-between text-xs font-mono text-ink-faint mt-3 px-2">
          <span>Week 1</span>
          <span>Week 2</span>
          <span>Week 3</span>
          <span>Today</span>
        </div>
      </div>

      <div class="mt-6 grid grid-cols-1 lg:grid-cols-3 gap-6">
        <!-- Referrers Breakdown -->
        <div class="dashboard-panel">
          <div class="dashboard-panel-header mb-4">
            <div>
              <p class="dashboard-eyebrow">Traffic Sources</p>
              <h2 class="dashboard-panel-title text-xl">Top Referrers</h2>
            </div>
          </div>
          <div class="space-y-4">
            @for (ref of demoService.referrers(); track ref.source) {
              <div class="source-row">
                <div class="flex justify-between text-sm">
                  <span>{{ ref.source }}</span>
                  <b class="font-mono">{{ ref.clicks }} ({{ ref.percentage }}%)</b>
                </div>
                <i [style.width.%]="ref.percentage"></i>
              </div>
            }
          </div>
        </div>

        <!-- Geographic Breakdown -->
        <div class="dashboard-panel">
          <div class="dashboard-panel-header mb-4">
            <div>
              <p class="dashboard-eyebrow">Geographic</p>
              <h2 class="dashboard-panel-title text-xl">Top Countries</h2>
            </div>
          </div>
          <div class="space-y-4">
            @for (c of demoService.countryStats(); track c.code) {
              <div class="source-row">
                <div class="flex justify-between text-sm">
                  <span>{{ c.country }} ({{ c.code }})</span>
                  <b class="font-mono">{{ c.clicks }} ({{ c.percentage }}%)</b>
                </div>
                <i [style.width.%]="c.percentage" style="background: linear-gradient(90deg, #0e9e76, #7ee6c9);"></i>
              </div>
            }
          </div>
        </div>

        <!-- Device Breakdown -->
        <div class="dashboard-panel">
          <div class="dashboard-panel-header mb-4">
            <div>
              <p class="dashboard-eyebrow">Devices & OS</p>
              <h2 class="dashboard-panel-title text-xl">User Devices</h2>
            </div>
          </div>
          <div class="space-y-4">
            @for (d of demoService.deviceStats(); track d.device) {
              <div class="source-row">
                <div class="flex justify-between text-sm">
                  <span>{{ d.icon }} {{ d.device }}</span>
                  <b class="font-mono">{{ d.clicks }} ({{ d.percentage }}%)</b>
                </div>
                <i [style.width.%]="d.percentage" style="background: linear-gradient(90deg, #1d1f26, #656874);"></i>
              </div>
            }
          </div>
        </div>
      </div>

      <!-- Top Performing Links Table -->
      <div class="mt-6 dashboard-panel">
        <div class="dashboard-panel-header mb-4">
          <div>
            <p class="dashboard-eyebrow">Top Performing Links</p>
            <h2 class="dashboard-panel-title">Highest Traffic URLs</h2>
          </div>
        </div>
        <div class="divide-y divide-line/60">
          @for (link of demoService.topPerformingLinks(); track link.id) {
            <div class="py-3 flex flex-col sm:flex-row sm:items-center justify-between gap-2">
              <div>
                <strong class="text-ink font-bold text-sm block">{{ link.title }}</strong>
                <a [href]="link.shortUrl" target="_blank" class="font-mono text-xs text-accent hover:underline">{{ link.shortUrl }}</a>
                <span class="text-xs text-ink-faint font-mono ml-2 truncate max-w-xs inline-block">→ {{ link.originalUrl }}</span>
              </div>
              <div class="flex items-center gap-4 text-sm font-mono">
                <span class="font-bold text-ink">{{ link.clicks }} clicks</span>
                <span [class.text-accent-2]="link.trend > 0" [class.text-red-500]="link.trend < 0" class="text-xs font-bold">
                  {{ link.trend > 0 ? '+' : '' }}{{ link.trend }}%
                </span>
              </div>
            </div>
          }
        </div>
      </div>
    </section>
  `,
})
export class AnalyticsLink {
  readonly demoService = inject(DemoDataService);
}

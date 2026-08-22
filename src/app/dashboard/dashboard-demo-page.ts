import { Component, computed, inject } from '@angular/core';
import { ActivatedRoute, RouterLink } from '@angular/router';
import { toSignal } from '@angular/core/rxjs-interop';
import { map } from 'rxjs';

type DemoPage = {
  label: string;
  eyebrow: string;
  title: string;
  description: string;
  metric: string;
  metricLabel: string;
  action: string;
  accent: string;
};

const FALLBACK_PAGE: DemoPage = {
  label: 'Short URLs',
  eyebrow: 'Demo route',
  title: 'Short URLs command center',
  description: 'Create polished, branded short links and organize every destination by campaign.',
  metric: '248',
  metricLabel: 'active links',
  action: 'Create short URL',
  accent: 'from-[#ff5a3d] to-[#ff9b82]',
};

@Component({
  selector: 'app-dashboard-demo-page',
  imports: [RouterLink],
  styleUrl: './dashboard.css',
  template: `
    <section class="demo-page-shell">
      <div class="demo-page-hero">
        <div>
          <p class="dashboard-eyebrow">{{ page().eyebrow }}</p>
          <h1>{{ page().title }}</h1>
          <p>{{ page().description }}</p>
        </div>
        <a routerLink="/dashboard/short-urls" class="dashboard-secondary-button"
          >Back to short URLs</a
        >
      </div>

      <div class="demo-page-grid">
        <article class="demo-feature-card">
          <span>{{ page().metricLabel }}</span>
          <strong>{{ page().metric }}</strong>
          <button class="dashboard-primary-button">{{ page().action }}</button>
        </article>
        <article class="demo-preview-card">
          <div class="preview-header"><span></span><span></span><span></span></div>
          <div class="preview-line w-[72%]"></div>
          <div class="preview-line w-[92%]"></div>
          <div class="preview-line w-[54%]"></div>
          <div class="preview-chart">
            <i class="h-[42%]"></i><i class="h-[68%]"></i><i class="h-[51%]"></i
            ><i class="h-[88%]"></i><i class="h-[74%]"></i>
          </div>
        </article>
      </div>
    </section>
  `,
})
export class DashboardDemoPage {
  private readonly route = inject(ActivatedRoute);
  private readonly data = toSignal(
    this.route.data.pipe(map((data) => data['page'] as DemoPage | undefined)),
    {
      initialValue: FALLBACK_PAGE,
    },
  );

  readonly page = computed(() => this.data() ?? FALLBACK_PAGE);
}

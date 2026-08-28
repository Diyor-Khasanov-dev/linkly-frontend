import { AsyncPipe } from '@angular/common';
import { Component, inject } from '@angular/core';
import { RouterLink } from '@angular/router';

import { AuthService } from '../../auth.service';

@Component({
  selector: 'app-profile',
  imports: [AsyncPipe, RouterLink],
  template: `
    @let user = authService.user$ | async;
    <section class="profile-page-shell">
      <div class="profile-hero">
        <div>
          <p class="dashboard-eyebrow">Profile</p>
          <h1>Your Linkly profile</h1>
          <p>
            Review the authenticated account returned by the production backend and keep your
            workspace details consistent across the dashboard.
          </p>
        </div>
        <div class="profile-avatar-card" aria-label="User profile summary">
          <div class="profile-avatar">
            {{ initials(user?.name || user?.username || user?.email) }}
          </div>
          <strong>{{ user?.name || user?.username || 'Linkly user' }}</strong>
          <span>{{ user?.email || 'Authenticated account' }}</span>
        </div>
      </div>

      <div class="profile-grid">
        <form class="profile-panel" onsubmit="return false;">
          <div class="dashboard-panel-header">
            <div>
              <p class="dashboard-eyebrow">Account details</p>
              <h2 class="dashboard-panel-title">Personal information</h2>
            </div>
            <span class="dashboard-pill">Real account</span>
          </div>

          <div class="profile-form-grid">
            <label class="profile-field">
              Full name
              <input type="text" [value]="user?.name || user?.username || ''" readonly />
            </label>
            <label class="profile-field">
              Email address
              <input type="email" [value]="user?.email || ''" readonly />
            </label>
            <label class="profile-field">
              Account ID
              <input type="text" [value]="user?.id || user?._id || ''" readonly />
            </label>
            <label class="profile-field">
              Time zone
              <input type="text" value="UTC" readonly />
            </label>
          </div>

          <div class="profile-actions">
            <a routerLink="/dashboard/link-short" class="dashboard-primary-button">Create a link</a>
          </div>
        </form>

        <aside class="profile-panel profile-security-card">
          <p class="dashboard-eyebrow">Security</p>
          <h2 class="dashboard-panel-title">Bearer token auth</h2>
          <p>
            Linkly stores the API token locally and sends it as an Authorization bearer token for
            authenticated backend requests. Cookie credentials are intentionally not used.
          </p>
          <div class="profile-credential-box">
            <p><span>Status</span><strong>Authenticated</strong></p>
            <p><span>API</span><strong>linkly-backend-8vcp.onrender.com</strong></p>
          </div>
        </aside>
      </div>
    </section>
  `,
})
export class Profile {
  readonly authService = inject(AuthService);

  initials(value: string | undefined | null): string {
    if (!value) {
      return 'LU';
    }

    return value
      .split(/\s|@/)
      .filter(Boolean)
      .slice(0, 2)
      .map((part) => part.charAt(0).toUpperCase())
      .join('');
  }
}

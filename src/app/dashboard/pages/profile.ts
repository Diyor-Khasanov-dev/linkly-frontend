import { Component } from '@angular/core';
import { RouterLink } from '@angular/router';

@Component({
  selector: 'app-profile',
  imports: [RouterLink],
  template: `
    <section class="profile-page-shell">
      <div class="profile-hero">
        <div>
          <p class="dashboard-eyebrow">Profile</p>
          <h1>Your Linkly profile</h1>
          <p>
            Manage the same demo identity used at sign in, review workspace details, and keep your
            account presentation consistent across the dashboard.
          </p>
        </div>
        <div class="profile-avatar-card" aria-label="Demo user profile summary">
          <div class="profile-avatar">DL</div>
          <strong>Demo Linkly</strong>
          <span>demo&#64;linkly.com</span>
        </div>
      </div>

      <div class="profile-grid">
        <form class="profile-panel" onsubmit="return false;">
          <div class="dashboard-panel-header">
            <div>
              <p class="dashboard-eyebrow">Account details</p>
              <h2 class="dashboard-panel-title">Personal information</h2>
            </div>
            <span class="dashboard-pill">Demo account</span>
          </div>

          <div class="profile-form-grid">
            <label class="profile-field">
              Full name
              <input type="text" value="Demo Linkly" />
            </label>
            <label class="profile-field">
              Email address
              <input type="email" value="demo@linkly.com" />
            </label>
            <label class="profile-field">
              Role
              <input type="text" value="Workspace owner" />
            </label>
            <label class="profile-field">
              Time zone
              <input type="text" value="UTC" />
            </label>
          </div>

          <div class="profile-actions">
            <button type="submit" class="dashboard-primary-button">Save demo profile</button>
            <a routerLink="/dashboard/link-short" class="dashboard-secondary-button"
              >Back to links</a
            >
          </div>
        </form>

        <aside class="profile-panel profile-security-card">
          <p class="dashboard-eyebrow">Security</p>
          <h2 class="dashboard-panel-title">Login credentials</h2>
          <p>
            This preview keeps the same demo access logic as the login flow so the profile feels
            production-ready without connecting to a backend.
          </p>
          <div class="profile-credential-box">
            <p><span>Demo Email</span><strong>demo&#64;linkly.com</strong></p>
            <p><span>Demo Password</span><strong>demo123</strong></p>
          </div>
        </aside>
      </div>
    </section>
  `,
})
export class Profile {}

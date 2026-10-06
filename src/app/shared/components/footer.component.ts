import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterLink } from '@angular/router';
import { environment } from '../../../environments/environment';

@Component({
  selector: 'app-footer',
  standalone: true,
  imports: [CommonModule, RouterLink],
  template: `
    <footer class="border-t border-slate-900 bg-slate-950/90 py-12 mt-20">
      <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div class="grid grid-cols-1 md:grid-cols-4 gap-8">
          
          <!-- Col 1: Brand -->
          <div class="space-y-4">
            <div class="flex items-center gap-2.5">
              <div class="w-8 h-8 rounded-lg bg-slate-900/70 border border-slate-800 p-1">
                <img [src]="brandIconPath" alt="Bracezin logo" class="w-full h-full object-contain">
              </div>
              <span class="text-lg font-bold tracking-tight text-white">BRACEZIN <span class="text-blue-400">SOFT STORE</span></span>
            </div>
            <p class="text-sm text-slate-400 leading-relaxed">
              Premium proprietary software, enterprise source code packages, automated scripts, and turnkey SaaS starters with secure verified downloads.
            </p>
            <div class="flex items-center gap-3 pt-2 text-slate-400">
              <a [href]="socialLinks.github" target="_blank" class="w-8 h-8 rounded-lg bg-slate-900 border border-slate-800 flex items-center justify-center hover:text-white hover:border-slate-700 transition-colors">
                <i class="fa-brands fa-github text-sm"></i>
              </a>
              <a [href]="socialLinks.twitter" target="_blank" class="w-8 h-8 rounded-lg bg-slate-900 border border-slate-800 flex items-center justify-center hover:text-white hover:border-slate-700 transition-colors">
                <i class="fa-brands fa-x-twitter text-sm"></i>
              </a>
              <a [href]="socialLinks.linkedin" target="_blank" class="w-8 h-8 rounded-lg bg-slate-900 border border-slate-800 flex items-center justify-center hover:text-white hover:border-slate-700 transition-colors">
                <i class="fa-brands fa-linkedin-in text-sm"></i>
              </a>
            </div>
          </div>

          <!-- Col 2: Categories -->
          <div>
            <h4 class="text-sm font-semibold uppercase tracking-wider text-slate-300 mb-4">Categories</h4>
            <ul class="space-y-2.5 text-sm text-slate-400">
              <li><a routerLink="/" [queryParams]="{category: 'enterprise-web-applications'}" class="hover:text-blue-400 transition-colors">Enterprise Web Apps</a></li>
              <li><a routerLink="/" [queryParams]="{category: 'saas-boilerplates'}" class="hover:text-blue-400 transition-colors">SaaS Boilerplates</a></li>
              <li><a routerLink="/" [queryParams]="{category: 'developer-tools-automation'}" class="hover:text-blue-400 transition-colors">Dev Tools & Automation</a></li>
              <li><a routerLink="/" [queryParams]="{category: 'mobile-applications'}" class="hover:text-blue-400 transition-colors">Mobile Applications</a></li>
            </ul>
          </div>

          <!-- Col 3: Customer & Security -->
          <div>
            <h4 class="text-sm font-semibold uppercase tracking-wider text-slate-300 mb-4">Customer Care</h4>
            <ul class="space-y-2.5 text-sm text-slate-400">
              <li><a routerLink="/my-purchases" class="hover:text-blue-400 transition-colors">My Purchases & Downloads</a></li>
              <li><a routerLink="/my-purchases" class="hover:text-blue-400 transition-colors">Software License Manager</a></li>
              <li><span class="text-emerald-400 text-xs font-semibold flex items-center gap-1.5"><i class="fa-solid fa-lock"></i> Razorpay 256-Bit Encrypted</span></li>
              <li><span class="text-blue-400 text-xs font-semibold flex items-center gap-1.5"><i class="fa-solid fa-shield-check"></i> Private GitHub Release Streaming</span></li>
            </ul>
          </div>

          <!-- Col 4: Trust & Payment Badges -->
          <div>
            <h4 class="text-sm font-semibold uppercase tracking-wider text-slate-300 mb-4">Payment Methods</h4>
            <p class="text-xs text-slate-400 mb-3">Accepting all major Indian and international payment methods via Razorpay.</p>
            <div class="grid grid-cols-3 gap-2">
              <div class="px-2.5 py-1.5 bg-slate-900 border border-slate-800 rounded-md text-center text-xs font-semibold text-slate-300">
                <i class="fa-solid fa-bolt text-amber-400 mr-1"></i> UPI
              </div>
              <div class="px-2.5 py-1.5 bg-slate-900 border border-slate-800 rounded-md text-center text-xs font-semibold text-slate-300">
                <i class="fa-regular fa-credit-card text-blue-400 mr-1"></i> Cards
              </div>
              <div class="px-2.5 py-1.5 bg-slate-900 border border-slate-800 rounded-md text-center text-xs font-semibold text-slate-300">
                <i class="fa-solid fa-building-columns text-emerald-400 mr-1"></i> NetBank
              </div>
            </div>
            <div class="mt-4 p-3 bg-slate-900/60 border border-slate-800 rounded-xl">
              <p class="text-[11px] text-slate-400">
                <i class="fa-solid fa-headset text-blue-400 mr-1"></i> Need custom software or source customization? <a [href]="supportMailTo" class="text-blue-400 hover:underline">Contact Us</a>
              </p>
            </div>
          </div>

        </div>

        <div class="border-t border-slate-900 mt-10 pt-6 flex flex-col sm:flex-row items-center justify-between gap-4 text-xs text-slate-400">
          <p>© {{ year }} Bracezin Technologies Pvt Ltd. All rights reserved.</p>
          <div class="flex items-center gap-4">
            <a routerLink="/privacy-policy" class="hover:text-slate-300">Privacy Policy</a>
            <a routerLink="/terms-of-service" class="hover:text-slate-300">Terms of Service</a>
            <a routerLink="/refund-policy" class="hover:text-slate-300">Refund Policy</a>
          </div>
        </div>
      </div>
    </footer>
  `
})
export class FooterComponent {
  year = new Date().getFullYear();
  brandIconPath = environment.app.brandIconPath;
  socialLinks = environment.app.socialLinks;
  supportMailTo = `mailto:${environment.app.supportEmail}`;
}


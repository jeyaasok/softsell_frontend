import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';

@Component({
  selector: 'app-terms-of-service',
  standalone: true,
  imports: [CommonModule],
  template: `
    <section class="max-w-4xl mx-auto">
      <header class="mb-8">
        <p class="text-xs uppercase tracking-[0.2em] text-blue-400 font-semibold">Legal</p>
        <h1 class="text-3xl sm:text-4xl font-extrabold text-white mt-2">Terms of Service</h1>
        <p class="text-sm text-slate-400 mt-3">Effective date: August 30, 2026</p>
      </header>

      <article class="space-y-6 text-sm leading-relaxed text-slate-300">
        <p>
          These Terms of Service ("Terms") govern your access to and use of Bracezin Soft Store, including all software,
          source code bundles, digital products, licenses, and related services provided by Bracezin Technologies Pvt Ltd.
          By creating an account, browsing, purchasing, or downloading products, you agree to these Terms.
        </p>

        <section>
          <h2 class="text-lg font-bold text-white mb-2">1. Eligibility and Account Responsibilities</h2>
          <ul class="list-disc pl-5 space-y-2">
            <li>You must provide accurate account information and keep your credentials confidential.</li>
            <li>You are responsible for all activity under your account unless unauthorized use is promptly reported.</li>
            <li>We may suspend or terminate accounts involved in abuse, fraud, or policy violations.</li>
          </ul>
        </section>

        <section>
          <h2 class="text-lg font-bold text-white mb-2">2. Product Nature and Delivery</h2>
          <ul class="list-disc pl-5 space-y-2">
            <li>Products are digital goods delivered electronically via authenticated account access and download links.</li>
            <li>Delivery is deemed complete when the product is made available to your account after payment confirmation.</li>
            <li>Availability may depend on third-party services, maintenance windows, and security controls.</li>
          </ul>
        </section>

        <section>
          <h2 class="text-lg font-bold text-white mb-2">3. License and Permitted Use</h2>
          <ul class="list-disc pl-5 space-y-2">
            <li>Each purchase grants a limited, non-transferable license as specified in the product description.</li>
            <li>Unless explicitly allowed, redistribution, reselling, sublicensing, or public sharing of source files is prohibited.</li>
            <li>License keys and download credentials may not be shared across unrelated individuals or organizations.</li>
            <li>Violation of license terms may result in entitlement revocation without prejudice to other legal remedies.</li>
          </ul>
        </section>

        <section>
          <h2 class="text-lg font-bold text-white mb-2">4. Pricing, Taxes, and Payments</h2>
          <ul class="list-disc pl-5 space-y-2">
            <li>Prices are displayed at checkout and may change prospectively without prior notice.</li>
            <li>Applicable taxes, fees, or charges are shown during payment where required.</li>
            <li>Payments are processed by Razorpay and are subject to Razorpay terms and banking partner policies.</li>
          </ul>
        </section>

        <section>
          <h2 class="text-lg font-bold text-white mb-2">5. Support and Updates</h2>
          <p>
            Support scope, update frequency, and maintenance commitments vary by product tier and listing details.
            Unless stated otherwise, purchases do not guarantee unlimited custom development, integrations, or consulting.
          </p>
        </section>

        <section>
          <h2 class="text-lg font-bold text-white mb-2">6. Prohibited Conduct</h2>
          <ul class="list-disc pl-5 space-y-2">
            <li>Reverse engineering, bypassing licensing checks, scraping protected content, or exploiting vulnerabilities.</li>
            <li>Using the platform for illegal activity, malware distribution, credential theft, or IP infringement.</li>
            <li>Automated abuse of APIs, download systems, or account creation workflows.</li>
          </ul>
        </section>

        <section>
          <h2 class="text-lg font-bold text-white mb-2">7. Intellectual Property</h2>
          <p>
            All trademarks, branding, content, software artifacts, and platform code remain the property of Bracezin or
            its licensors. No ownership rights are transferred except limited usage rights explicitly granted by license.
          </p>
        </section>

        <section>
          <h2 class="text-lg font-bold text-white mb-2">8. Refunds and Entitlement Revocation</h2>
          <p>
            Refund eligibility is governed by our Refund Policy. Where a refund is approved, related download entitlements,
            license keys, and access may be suspended or revoked to prevent continued commercial use.
          </p>
        </section>

        <section>
          <h2 class="text-lg font-bold text-white mb-2">9. Warranties and Liability Limits</h2>
          <ul class="list-disc pl-5 space-y-2">
            <li>Products are provided on an "as-is" and "as-available" basis except where non-excludable legal rights apply.</li>
            <li>We disclaim implied warranties to the extent permitted by law, including merchantability and fitness for a particular purpose.</li>
            <li>To the maximum extent permitted, we are not liable for indirect, incidental, special, or consequential damages.</li>
          </ul>
        </section>

        <section>
          <h2 class="text-lg font-bold text-white mb-2">10. Termination</h2>
          <p>
            We may restrict or terminate access for breach of these Terms, security risks, legal requirements, or fraudulent activity.
            Termination does not limit our right to pursue legal remedies for misuse or infringement.
          </p>
        </section>

        <section>
          <h2 class="text-lg font-bold text-white mb-2">11. Governing Law and Disputes</h2>
          <p>
            These Terms are governed by applicable laws of India, without prejudice to mandatory consumer protections in your jurisdiction.
            You agree to attempt good-faith resolution with our support team before initiating formal proceedings.
          </p>
        </section>

        <section class="p-4 rounded-xl border border-slate-800 bg-slate-900/50">
          <h2 class="text-base font-bold text-white mb-1">Contact</h2>
          <p>
            Questions about these Terms can be 
            <a href="mailto:projects.bracezin@gmail.com" class="text-blue-400 hover:underline">Drop a Mail here... </a>.
          </p>
        </section>
      </article>
    </section>
  `
})
export class TermsOfServiceComponent {}

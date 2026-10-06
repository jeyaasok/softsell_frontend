import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';

@Component({
  selector: 'app-privacy-policy',
  standalone: true,
  imports: [CommonModule],
  template: `
    <section class="max-w-4xl mx-auto">
      <header class="mb-8">
        <p class="text-xs uppercase tracking-[0.2em] text-blue-400 font-semibold">Legal</p>
        <h1 class="text-3xl sm:text-4xl font-extrabold text-white mt-2">Privacy Policy</h1>
        <p class="text-sm text-slate-400 mt-3">Effective date: August 30, 2026</p>
      </header>

      <article class="space-y-6 text-sm leading-relaxed text-slate-300">
        <p>
          Bracezin Technologies Pvt Ltd ("Bracezin", "we", "us", "our") operates the Bracezin Soft Store platform
          for selling proprietary software products, source code packages, and digital downloads. This Privacy Policy
          explains how we collect, use, disclose, and protect your personal information when you use our website,
          create an account, make purchases, and download products.
        </p>

        <section>
          <h2 class="text-lg font-bold text-white mb-2">1. Information We Collect</h2>
          <ul class="list-disc pl-5 space-y-2">
            <li>Account information: name, email address, password hash, and profile metadata.</li>
            <li>Order and transaction data: products purchased, billing details, payment status, invoices, and refunds.</li>
            <li>Payment references from Razorpay: payment IDs, order IDs, and transaction status (we do not store full card details).</li>
            <li>Delivery and download data: entitlement records, download logs, IP addresses, user agent, and timestamps.</li>
            <li>Support communication data: messages you send to contact&#64;bracezin.com and related support notes.</li>
            <li>Technical logs: security events, audit logs, and diagnostics needed to secure and maintain the service.</li>
          </ul>
        </section>

        <section>
          <h2 class="text-lg font-bold text-white mb-2">2. How We Use Information</h2>
          <ul class="list-disc pl-5 space-y-2">
            <li>To create and manage your account and authenticate access.</li>
            <li>To process orders, verify payments, and deliver digital products securely.</li>
            <li>To provide license keys, entitlement checks, and controlled download access.</li>
            <li>To detect fraud, abuse, unauthorized redistribution, and suspicious behavior.</li>
            <li>To provide customer support and respond to product, billing, and refund requests.</li>
            <li>To maintain accounting records, legal compliance, and internal business reporting.</li>
          </ul>
        </section>

        <section>
          <h2 class="text-lg font-bold text-white mb-2">3. Lawful Basis and Consent</h2>
          <p>
            We process personal data where necessary to perform a contract with you (such as order fulfillment),
            comply with legal obligations, and pursue legitimate interests in fraud prevention and service security.
            Where required by law, we request your consent before sending promotional communications.
          </p>
        </section>

        <section>
          <h2 class="text-lg font-bold text-white mb-2">4. Payment Processing</h2>
          <p>
            Payments are processed by Razorpay. Razorpay acts as an independent payment processor and is responsible for
            handling sensitive payment instruments. We receive limited payment metadata needed for confirmation, reconciliation,
            support, and refund handling.
          </p>
        </section>

        <section>
          <h2 class="text-lg font-bold text-white mb-2">5. Data Sharing</h2>
          <p class="mb-2">We do not sell your personal data. We may share data only with:</p>
          <ul class="list-disc pl-5 space-y-2">
            <li>Service providers supporting payments, hosting, email delivery, logging, and infrastructure.</li>
            <li>Authorities or regulators when disclosure is required by applicable law or legal process.</li>
            <li>Professional advisors during audits, compliance checks, or legal proceedings, under confidentiality obligations.</li>
          </ul>
        </section>

        <section>
          <h2 class="text-lg font-bold text-white mb-2">6. Data Retention</h2>
          <p>
            We retain account, order, and compliance-related records for as long as needed for service delivery,
            contractual obligations, fraud prevention, and legal/tax requirements. When retention is no longer necessary,
            we delete or anonymize data in accordance with operational and legal constraints.
          </p>
        </section>

        <section>
          <h2 class="text-lg font-bold text-white mb-2">7. Security Measures</h2>
          <p>
            We use reasonable administrative, technical, and organizational safeguards, including encrypted transport,
            access controls, auditing, and secure token-based download authorization. No internet-based system is fully
            immune to risk, but we continuously improve protections against unauthorized access or misuse.
          </p>
        </section>

        <section>
          <h2 class="text-lg font-bold text-white mb-2">8. Your Rights</h2>
          <p class="mb-2">Subject to applicable law, you may request to:</p>
          <ul class="list-disc pl-5 space-y-2">
            <li>Access and receive a copy of personal data we hold about you.</li>
            <li>Correct inaccurate or incomplete personal information.</li>
            <li>Delete personal data when legally permissible.</li>
            <li>Object to or restrict certain processing activities.</li>
            <li>Withdraw consent for optional communications.</li>
          </ul>
          <p class="mt-2">To exercise these rights, email contact&#64;bracezin.com from your registered account email address.</p>
        </section>

        <section>
          <h2 class="text-lg font-bold text-white mb-2">9. International Transfers</h2>
          <p>
            Our service providers may process data in locations outside your jurisdiction. Where required, we use
            appropriate safeguards and contractual protections for cross-border data transfer.
          </p>
        </section>

        <section>
          <h2 class="text-lg font-bold text-white mb-2">10. Policy Updates</h2>
          <p>
            We may revise this Privacy Policy from time to time. Material updates will be posted on this page with a
            new effective date. Continued use of the platform after updates constitutes acceptance of the revised policy.
          </p>
        </section>

        <section class="p-4 rounded-xl border border-slate-800 bg-slate-900/50">
          <h2 class="text-base font-bold text-white mb-1">Contact</h2>
          <p>
            For privacy questions, requests, or concerns, 
            <a href="mailto:projects.bracezin@gmail.com" class="text-blue-400 hover:underline">Drop us a Mail here...</a>.
          </p>
        </section>
      </article>
    </section>
  `
})
export class PrivacyPolicyComponent {}

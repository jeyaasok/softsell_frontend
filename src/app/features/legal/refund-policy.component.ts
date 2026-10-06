import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';

@Component({
  selector: 'app-refund-policy',
  standalone: true,
  imports: [CommonModule],
  template: `
    <section class="max-w-4xl mx-auto">
      <header class="mb-8">
        <p class="text-xs uppercase tracking-[0.2em] text-blue-400 font-semibold">Legal</p>
        <h1 class="text-3xl sm:text-4xl font-extrabold text-white mt-2">Refund Policy</h1>
        <p class="text-sm text-slate-400 mt-3">Effective date: August 30, 2026</p>
      </header>

      <article class="space-y-6 text-sm leading-relaxed text-slate-300">
        <p>
          This Refund Policy applies to all digital software products sold on Bracezin Soft Store. Because digital goods
          are delivered instantly and can be copied, refunds are assessed carefully to protect both customers and creators.
        </p>

        <section>
          <h2 class="text-lg font-bold text-white mb-2">1. General Rule</h2>
          <p>
            Sales are generally final once a digital product has been delivered to your account. Refunds may be approved
            only for qualifying scenarios described below.
          </p>
        </section>

        <section>
          <h2 class="text-lg font-bold text-white mb-2">2. Eligible Refund Scenarios</h2>
          <ul class="list-disc pl-5 space-y-2">
            <li>Duplicate payment for the same order caused by technical error.</li>
            <li>Payment captured successfully but product entitlement was not delivered and support cannot restore access.</li>
            <li>Product materially differs from the published description and the issue is verified by our team.</li>
            <li>Unauthorized transaction confirmed after reasonable account and payment verification.</li>
          </ul>
        </section>

        <section>
          <h2 class="text-lg font-bold text-white mb-2">3. Non-Refundable Cases</h2>
          <ul class="list-disc pl-5 space-y-2">
            <li>Change of mind after successful delivery.</li>
            <li>Lack of technical knowledge, unmet custom expectations, or required third-party service costs.</li>
            <li>Failure to review product requirements, technology stack, or compatibility notes before purchase.</li>
            <li>Requests made after extensive use, repeated downloads, or visible production deployment.</li>
            <li>Violations of license terms, account abuse, chargeback misuse, or fraudulent conduct.</li>
          </ul>
        </section>

        <section>
          <h2 class="text-lg font-bold text-white mb-2">4. Refund Request Window</h2>
          <p>
            You must submit refund requests within 7 calendar days from the purchase timestamp unless local consumer law
            requires a longer mandatory period.
          </p>
        </section>

        <section>
          <h2 class="text-lg font-bold text-white mb-2">5. How to Request a Refund</h2>
          <p class="mb-2">Email contact&#64;bracezin.com with:</p>
          <ul class="list-disc pl-5 space-y-2">
            <li>Registered account email and order ID.</li>
            <li>Payment reference (Razorpay payment ID, if available).</li>
            <li>Detailed reason for refund and reproducible evidence (screenshots/logs where relevant).</li>
          </ul>
        </section>

        <section>
          <h2 class="text-lg font-bold text-white mb-2">6. Review and Resolution Timeline</h2>
          <ul class="list-disc pl-5 space-y-2">
            <li>Initial acknowledgement is typically sent within 2 business days.</li>
            <li>Final decision is typically made within 5 to 10 business days, depending on case complexity.</li>
            <li>If approved, refund settlement timelines depend on Razorpay and your issuing bank/payment provider.</li>
          </ul>
        </section>

        <section>
          <h2 class="text-lg font-bold text-white mb-2">7. Effects of Approved Refunds</h2>
          <ul class="list-disc pl-5 space-y-2">
            <li>Associated license keys, API access, and download entitlements may be revoked immediately.</li>
            <li>You must stop using and delete refunded software/assets unless required retention is mandated by law.</li>
            <li>Partial refunds may be issued in documented cases involving partial non-conformance.</li>
          </ul>
        </section>

        <section>
          <h2 class="text-lg font-bold text-white mb-2">8. Chargebacks</h2>
          <p>
            Before initiating a chargeback, contact us so we can attempt a direct resolution. Invalid or abusive chargebacks
            may lead to account restrictions and loss of future purchasing access.
          </p>
        </section>

        <section>
          <h2 class="text-lg font-bold text-white mb-2">9. Policy Changes</h2>
          <p>
            We may update this policy to reflect legal, operational, or product changes. Updated versions become effective
            when posted on this page.
          </p>
        </section>
      </article>
    </section>
  `
})
export class RefundPolicyComponent {}

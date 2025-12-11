// src/app/terms/page.tsx

import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Terms & Conditions • Trap Culture",
  description:
    "Terms and conditions for using Trap Culture websites, apps, and services.",
};

export default function TermsPage() {
  return (
    <main className="mx-auto max-w-3xl px-4 pt-24 pb-28 text-foreground space-y-6">
      <header className="space-y-2">
        <h1 className="tc-section-title text-[36px] md:text-[44px] leading-none font-extrabold uppercase tracking-[0.16em]">
          Terms &amp; Conditions
        </h1>
        <p className="tc-body-text text-sm">
          Effective date: {new Date().getFullYear()}
        </p>
      </header>

      <section className="space-y-3 tc-body-text">
        <p>
          These Terms &amp; Conditions (“Terms”) govern your access to and use
          of Trap Culture websites, the Trap Culture app, Trap Fam, and any
          related services (collectively, the “Services”). By accessing or using
          the Services, you agree to be bound by these Terms.
        </p>
        <p>If you do not agree with these Terms, do not use the Services.</p>
      </section>

      <section className="space-y-2 tc-body-text">
        <h2 className="font-semibold text-base tracking-[0.16em] uppercase">
          Eligibility
        </h2>
        <p>
          You must be at least 18 years old, or the age of majority in your
          jurisdiction, to use the Services. By using the Services, you
          represent that you meet this requirement and that you have the
          authority to agree to these Terms.
        </p>
      </section>

      <section className="space-y-2 tc-body-text">
        <h2 className="font-semibold text-base tracking-[0.16em] uppercase">
          Accounts and Security
        </h2>
        <p>
          When you create an account, you agree to provide accurate, current
          information and to keep it updated. You are responsible for
          maintaining the confidentiality of your login credentials and for all
          activity that occurs under your account.
        </p>
        <p>
          Notify us immediately if you believe your account has been accessed
          without authorization.
        </p>
      </section>

      <section className="space-y-2 tc-body-text">
        <h2 className="font-semibold text-base tracking-[0.16em] uppercase">
          Communications
        </h2>
        <p>
          By creating an account, joining Trap Fam, or providing your contact
          information, you may receive emails or in-app messages related to your
          account, events, and other updates.
        </p>
        <p>
          You may opt out of marketing emails by using the unsubscribe link in
          those messages, while still receiving essential transactional
          communications (such as security notices or account-related updates).
        </p>
      </section>

      <section className="space-y-2 tc-body-text">
        <h2 className="font-semibold text-base tracking-[0.16em] uppercase">
          SMS Messaging
        </h2>
        <p>
          If you choose to opt in to SMS, you agree to receive marketing text
          messages from Trap Culture at the number you provide. Message and data
          rates may apply. Message frequency may vary.
        </p>
        <p>
          You can opt out at any time by replying <strong>STOP</strong> to any
          message. For help, reply <strong>HELP</strong> or contact us at{" "}
          <a
            href="mailto:info@trapcultureaz.com"
            className="underline underline-offset-2"
          >
            info@trapcultureaz.com
          </a>
          .
        </p>
        <p>
          SMS consent is not a condition of purchasing anything or attending any
          event.
        </p>
      </section>

      <section className="space-y-2 tc-body-text">
        <h2 className="font-semibold text-base tracking-[0.16em] uppercase">
          Event Participation
        </h2>
        <p>
          Some Services relate to live events, parties, or activations. Event
          details, capacity, and entry conditions may change at any time. We
          reserve the right to deny entry or remove individuals whose behavior
          is unsafe, unlawful, or disruptive.
        </p>
        <p>
          You are responsible for your own safety and belongings at events and
          agree that Trap Culture is not liable for losses or injuries except as
          required by law.
        </p>
      </section>

      <section className="space-y-2 tc-body-text">
        <h2 className="font-semibold text-base tracking-[0.16em] uppercase">
          Intellectual Property
        </h2>
        <p>
          All content on the Services, including logos, artwork, text, graphics,
          and audiovisual materials, is owned by Trap Culture or its partners
          and is protected by intellectual property laws.
        </p>
        <p>
          You may not copy, reproduce, distribute, modify, or create derivative
          works from our content without prior written permission.
        </p>
      </section>

      <section className="space-y-2 tc-body-text">
        <h2 className="font-semibold text-base tracking-[0.16em] uppercase">
          Prohibited Conduct
        </h2>
        <p>You agree not to use the Services to:</p>
        <p>
          • Break the law or encourage illegal activity.  
          • Harass, threaten, or harm
          others.  
          • Interfere with or disrupt the operation of the Services.  
          • Attempt to gain unauthorized access to accounts, systems, or data.  
          • Use automated tools (bots, scrapers) in ways that overload or
          degrade the Services.
        </p>
      </section>

      <section className="space-y-2 tc-body-text">
        <h2 className="font-semibold text-base tracking-[0.16em] uppercase">
          Third-Party Services
        </h2>
        <p>
          The Services may link to or integrate with third-party platforms,
          ticketing, email, SMS, or payment providers. Those services are
          governed by their own terms and privacy policies. We are not
          responsible for the content or practices of third-party services.
        </p>
      </section>

      <section className="space-y-2 tc-body-text">
        <h2 className="font-semibold text-base tracking-[0.16em] uppercase">
          Disclaimer of Warranties
        </h2>
        <p>
          The Services are provided “as is” and “as available” without warranties
          of any kind, whether express or implied. We do not guarantee that the
          Services will be uninterrupted, error-free, or completely secure.
        </p>
      </section>

      <section className="space-y-2 tc-body-text">
        <h2 className="font-semibold text-base tracking-[0.16em] uppercase">
          Limitation of Liability
        </h2>
        <p>
          To the maximum extent permitted by law, Trap Culture and its owners,
          employees, and partners are not liable for indirect, incidental,
          special, or consequential damages arising from or related to your use
          of the Services.
        </p>
      </section>

      <section className="space-y-2 tc-body-text">
        <h2 className="font-semibold text-base tracking-[0.16em] uppercase">
          Changes to These Terms
        </h2>
        <p>
          We may update these Terms from time to time. When we do, we will
          update the effective date at the top of this page and may provide
          additional notice as required.
        </p>
      </section>

      <section className="space-y-2 tc-body-text">
        <h2 className="font-semibold text-base tracking-[0.16em] uppercase">
          Governing Law
        </h2>
        <p>
          These Terms are governed by the laws of the State of Arizona and
          applicable federal law, without regard to conflict-of-law rules.
        </p>
      </section>

      <section className="space-y-2 tc-body-text">
        <h2 className="font-semibold text-base tracking-[0.16em] uppercase">
          Contact Us
        </h2>
        <p>
          If you have questions about these Terms, contact us at{" "}
          <a
            href="mailto:info@trapcultureaz.com"
            className="underline underline-offset-2"
          >
            info@trapcultureaz.com
          </a>
          .
        </p>
      </section>
    </main>
  );
}

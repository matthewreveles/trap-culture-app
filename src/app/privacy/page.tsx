// src/app/privacy/page.tsx

import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Privacy Policy • Trap Culture",
  description:
    "Trap Culture privacy policy describing how we collect, use, and protect your information online and through our apps.",
};

export default function PrivacyPage() {
  return (
    <main className="mx-auto max-w-3xl px-4 pt-24 pb-28 text-foreground space-y-6">
      <header className="space-y-2">
        <h1 className="tc-section-title text-[36px] md:text-[44px] leading-none font-extrabold uppercase tracking-[0.16em]">
          Privacy Policy
        </h1>
        <p className="tc-body-text text-sm">
          Effective date: {new Date().getFullYear()}
        </p>
      </header>

      <section className="space-y-3 tc-body-text">
        <p>
          Trap Culture (“we,” “us,” or “our”) respects your privacy. This
          Privacy Policy explains how we collect, use, and share information
          when you visit our websites, use the Trap Culture app, join Trap Fam,
          or interact with our events, content, and marketing.
        </p>
        <p>
          By using our sites or apps, you agree to the practices described in
          this Privacy Policy.
        </p>
      </section>

      <section className="space-y-2 tc-body-text">
        <h2 className="font-semibold text-base tracking-[0.16em] uppercase">
          Information We Collect
        </h2>
        <p>We may collect the following types of information:</p>
        <p>
          <strong>Contact information.</strong> Name, email address, phone
          number, and mailing address when you create an account, join Trap Fam,
          RSVP to events, or contact us.
        </p>
        <p>
          <strong>Account details.</strong> Login credentials and basic profile
          details associated with your Trap Culture account.
        </p>
        <p>
          <strong>Usage data.</strong> Log data, device information, pages
          viewed, links clicked, approximate location, and similar analytics
          information when you use our sites or app.
        </p>
        <p>
          <strong>Event and commerce activity.</strong> RSVP history, event
          attendance, purchases, and interactions with merch or partner
          offerings where applicable.
        </p>
      </section>

      <section className="space-y-2 tc-body-text">
        <h2 className="font-semibold text-base tracking-[0.16em] uppercase">
          How We Use Your Information
        </h2>
        <p>We use the information we collect to:</p>
        <p>
          • Operate, maintain, and improve the Trap Culture app, site, and
          services.  
          • Communicate with you about events, drops, news, and updates
          you have signed up for.  
          • Send marketing email or SMS messages when you have
          provided the appropriate consent.  
          • Respond to your questions, support
          requests, or feedback.  
          • Monitor performance, prevent abuse, and maintain
          security.
        </p>
      </section>

      <section className="space-y-2 tc-body-text">
        <h2 className="font-semibold text-base tracking-[0.16em] uppercase">
          Cookies and Tracking
        </h2>
        <p>
          We may use cookies, local storage, pixels, and similar technologies to
          remember your preferences, understand usage patterns, and improve your
          experience. You can usually control cookies through your browser
          settings, but some features may not function properly if cookies are
          disabled.
        </p>
      </section>

      <section className="space-y-2 tc-body-text">
        <h2 className="font-semibold text-base tracking-[0.16em] uppercase">
          Email Communications
        </h2>
        <p>
          If you join Trap Fam, create an account, or otherwise opt in, we may
          send you email updates about events, drops, and Trap Culture news.
        </p>
        <p>
          You can unsubscribe from marketing emails at any time by clicking the
          unsubscribe link in the message or contacting us at{" "}
          <a
            href="mailto:info@trapcultureaz.com"
            className="underline underline-offset-2"
          >
            info@trapcultureaz.com
          </a>
          .
        </p>
      </section>

      <section className="space-y-2 tc-body-text">
        <h2 className="font-semibold text-base tracking-[0.16em] uppercase">
          SMS Communications
        </h2>
        <p>
          If you provide your phone number and explicitly opt in, we may send
          marketing SMS messages about merch drops, event announcements, and
          digital exclusives.
        </p>
        <p>
          By enrolling in SMS messages, you agree to receive recurring texts
          from Trap Culture at the phone number you provided. Message and data
          rates may apply. Message frequency may vary.
        </p>
        <p>
          You can opt out of SMS at any time by replying{" "}
          <strong>STOP</strong> to any message. For help, reply{" "}
          <strong>HELP</strong> or contact us at{" "}
          <a
            href="mailto:info@trapcultureaz.com"
            className="underline underline-offset-2"
          >
            info@trapcultureaz.com
          </a>
          .
        </p>
      </section>

      <section className="space-y-2 tc-body-text">
        <h2 className="font-semibold text-base tracking-[0.16em] uppercase">
          How We Share Information
        </h2>
        <p>
          We do not sell your personal information. We may share limited data
          with trusted service providers who help us run email, SMS, hosting,
          analytics, or payment processing. These providers are contractually
          required to protect your information and use it only as instructed.
        </p>
        <p>
          We may also share information if required by law, to protect our
          rights, or in connection with a merger, acquisition, or other business
          transition.
        </p>
      </section>

      <section className="space-y-2 tc-body-text">
        <h2 className="font-semibold text-base tracking-[0.16em] uppercase">
          Your Choices and Rights
        </h2>
        <p>
          Depending on your location, you may have rights to request access to,
          correction of, or deletion of your personal information. You may also
          object to certain processing or request limitations on how your data
          is used.
        </p>
        <p>
          To make a request, contact{" "}
          <a
            href="mailto:info@trapcultureaz.com"
            className="underline underline-offset-2"
          >
            info@trapcultureaz.com
          </a>
          . We may ask you to verify your identity before responding.
        </p>
      </section>

      <section className="space-y-2 tc-body-text">
        <h2 className="font-semibold text-base tracking-[0.16em] uppercase">
          Data Retention
        </h2>
        <p>
          We retain personal information only as long as reasonably necessary to
          provide our services, meet legal obligations, resolve disputes, and
          enforce our agreements. When information is no longer required, we
          take steps to delete or de-identify it.
        </p>
      </section>

      <section className="space-y-2 tc-body-text">
        <h2 className="font-semibold text-base tracking-[0.16em] uppercase">
          Children&apos;s Privacy
        </h2>
        <p>
          Trap Culture is not directed to children under 13, and we do not
          knowingly collect personal information from children under 13. If you
          believe a child has provided us information, contact{" "}
          <a
            href="mailto:info@trapcultureaz.com"
            className="underline underline-offset-2"
          >
            info@trapcultureaz.com
          </a>{" "}
          and we will take appropriate steps.
        </p>
      </section>

      <section className="space-y-2 tc-body-text">
        <h2 className="font-semibold text-base tracking-[0.16em] uppercase">
          Changes to This Policy
        </h2>
        <p>
          We may update this Privacy Policy from time to time. When we make
          changes, we will revise the effective date at the top of this page and
          may provide additional notice as required by law.
        </p>
      </section>

      <section className="space-y-2 tc-body-text">
        <h2 className="font-semibold text-base tracking-[0.16em] uppercase">
          Contact Us
        </h2>
        <p>
          For questions about this Privacy Policy or our data practices, contact
          us at{" "}
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

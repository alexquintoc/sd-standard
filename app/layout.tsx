import type { Metadata } from "next";
import Link from "next/link";
import Script from "next/script";
import { AnnouncementBar } from "./components/AnnouncementBar";
import { getAllUpdates, selectAnnouncement } from "../lib/updates";
import "./globals.css";

export const metadata: Metadata = {
  metadataBase: new URL(process.env.NEXT_PUBLIC_SITE_URL ?? "https://sdstandard.org"),
  title: "SD Standard",
  description: "Sustainable Design Standard tools, projects, and baselines.",
};

type NavItem = {
  label: string;
  href: string;
  children?: NavItem[];
};

const navItems: NavItem[] = [
  {
    label: "About",
    href: "/about",
    children: [
      { label: "About", href: "/about" },
      { label: "Updates", href: "/updates" },
    ],
  },
  { label: "Impact Snapshot", href: "/impact-snapshot" },
  { label: "Evaluate", href: "/calculator" },
  {
    label: "Learn",
    href: "/knowledge-base",
    children: [
      { label: "Knowledge Base", href: "/knowledge-base" },
      { label: "Standard and SDGs", href: "/the-standard-and-the-sdgs" },
    ],
  },
  { label: "Imagine", href: "/brief-generator" },
  { label: "Get Involved", href: "/#get-involved" },
];

const footerNavItems: NavItem[] = [
  { label: "About", href: "/about" },
  { label: "Updates", href: "/updates" },
  { label: "Impact Snapshot", href: "/impact-snapshot" },
  { label: "Evaluate", href: "/calculator" },
  { label: "Knowledge Base", href: "/knowledge-base" },
  { label: "Standard and SDGs", href: "/the-standard-and-the-sdgs" },
  { label: "Imagine", href: "/brief-generator" },
];

const socialItems: NavItem[] = [
  { label: "LinkedIn", href: "https://www.linkedin.com/company/sd-standard" },
  { label: "Instagram", href: "https://www.instagram.com/sdstandard_org" },
  { label: "GitHub", href: "https://github.com/alexquintoc/sd-standard" },
  { label: "Bluesky", href: "https://bsky.app/profile/sdstandard.bsky.social" },
];

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <head>
        <Script async src="https://www.googletagmanager.com/gtag/js?id=G-N1FKMBM1KL" />
        <Script id="google-analytics">
          {`
            window.dataLayer = window.dataLayer || [];
            function gtag(){dataLayer.push(arguments);}
            gtag('js', new Date());

            gtag('config', 'G-N1FKMBM1KL');
          `}
        </Script>
      </head>
      <body>
        <AnnouncementBar update={selectAnnouncement(getAllUpdates())} />
        <header className="site-header">
          <div className="site-header-inner">
            <Link className="site-logo" href="/">
              SD Standard
            </Link>
            <nav className="site-nav" aria-label="Main navigation">
              {navItems.map((item) => {
                if (item.children) {
                  return (
                    <div className="site-nav-group" key={item.href}>
                      <button aria-haspopup="true" type="button">
                        {item.label}
                      </button>
                      <div className="site-subnav">
                        {item.children.map((child) => (
                          <Link href={child.href} key={child.href}>
                            {child.label}
                          </Link>
                        ))}
                      </div>
                    </div>
                  );
                }

                return (
                  <Link href={item.href} key={item.href}>
                    {item.label}
                  </Link>
                );
              })}
            </nav>
          </div>
        </header>
        {children}
        <footer className="site-footer">
          <div className="site-footer-inner">
            <div className="site-footer-brand">
              <h2>SD Standard</h2>
              <p>
                An open sustainability standard for visual communication and design practitioners
              </p>
              <form
                action="https://buttondown.com/api/emails/embed-subscribe/sdstandard"
                method="post"
                className="embeddable-buttondown-form site-newsletter-form"
              >
                <p className="site-newsletter-intro">
                  Get occasional updates about the SD Standard.
                </p>
                <label htmlFor="bd-email">Enter your email</label>
                <div className="site-newsletter-fields">
                  <input type="email" name="email" id="bd-email" required />
                  <input type="submit" value="Subscribe" />
                </div>
                <p className="site-newsletter-powered">
                  <a
                    href="https://buttondown.com/refer/sdstandard"
                    target="_blank"
                    rel="noopener noreferrer"
                  >
                    Powered by Buttondown.
                  </a>
                </p>
              </form>
            </div>
            <nav aria-label="Footer navigation" className="site-footer-nav">
              {footerNavItems.map((item) => (
                <Link href={item.href} key={item.href}>
                  {item.label}
                </Link>
              ))}
            </nav>
            <div className="site-footer-connect">
              <Link href="/#get-involved">Get Involved</Link>
              <div className="site-social-links" aria-label="Social media">
                {socialItems.map((item) => (
                  <a href={item.href} key={item.href} rel="noreferrer" target="_blank">
                    <span className="sr-only">{item.label}</span>
                    {item.label === "LinkedIn" ? (
                      <svg aria-hidden="true" viewBox="0 0 24 24">
                        <path d="M4.98 3.5C4.98 4.88 3.86 6 2.5 6S0 4.88 0 3.5 1.12 1 2.5 1s2.48 1.12 2.48 2.5ZM.28 8.25h4.43V23H.28V8.25ZM7.55 8.25h4.24v2.02h.06c.59-1.12 2.03-2.3 4.18-2.3 4.47 0 5.29 2.94 5.29 6.76V23h-4.42v-7.33c0-1.75-.03-4-2.44-4-2.44 0-2.81 1.9-2.81 3.87V23H7.55V8.25Z" />
                      </svg>
                    ) : item.label === "Instagram" ? (
                      <svg aria-hidden="true" viewBox="0 0 24 24">
                        <path d="M7.5 2h9A5.51 5.51 0 0 1 22 7.5v9a5.51 5.51 0 0 1-5.5 5.5h-9A5.51 5.51 0 0 1 2 16.5v-9A5.51 5.51 0 0 1 7.5 2Zm0 2A3.5 3.5 0 0 0 4 7.5v9A3.5 3.5 0 0 0 7.5 20h9a3.5 3.5 0 0 0 3.5-3.5v-9A3.5 3.5 0 0 0 16.5 4h-9ZM12 7a5 5 0 1 1 0 10 5 5 0 0 1 0-10Zm0 2a3 3 0 1 0 0 6 3 3 0 0 0 0-6Zm5.25-2.5a1.25 1.25 0 1 1 0 2.5 1.25 1.25 0 0 1 0-2.5Z" />
                      </svg>
                    ) : item.label === "GitHub" ? (
                      <svg aria-hidden="true" viewBox="0 0 24 24">
                        <path d="M12 .5A12 12 0 0 0 8.2 23.9c.6.11.82-.26.82-.58v-2.24c-3.34.73-4.04-1.42-4.04-1.42-.55-1.39-1.34-1.76-1.34-1.76-1.09-.75.08-.73.08-.73 1.2.08 1.84 1.24 1.84 1.24 1.07 1.83 2.81 1.3 3.49.99.11-.78.42-1.3.76-1.6-2.66-.3-5.47-1.33-5.47-5.93 0-1.31.47-2.38 1.24-3.22-.12-.3-.54-1.53.12-3.18 0 0 1.01-.32 3.3 1.23A11.4 11.4 0 0 1 12 6.3c1.02 0 2.05.14 3.01.4 2.29-1.55 3.3-1.23 3.3-1.23.66 1.65.24 2.88.12 3.18.77.84 1.24 1.91 1.24 3.22 0 4.61-2.81 5.62-5.49 5.92.43.37.82 1.1.82 2.23v3.3c0 .32.21.7.83.58A12 12 0 0 0 12 .5Z" />
                      </svg>
                    ) : (
                      <svg
                        aria-hidden="true"
                        fill="none"
                        stroke="currentColor"
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth="2"
                        viewBox="0 0 24 24"
                      >
                        <path d="M12 10.8C10.5 7.9 7.3 4.2 4.6 3.1c-1.2-.5-2 .1-2 1.4 0 2.9 1.5 5.3 4.3 6.1-2.9.5-4 2.4-2.2 4.7 2.2 2.8 5.3 1.4 7.3-2.9 2 4.3 5.1 5.7 7.3 2.9 1.8-2.3.7-4.2-2.2-4.7 2.8-.8 4.3-3.2 4.3-6.1 0-1.3-.8-1.9-2-1.4-2.7 1.1-5.9 4.8-7.4 7.7Z" />
                      </svg>
                    )}
                  </a>
                ))}
              </div>
            </div>
          </div>
        </footer>
      </body>
    </html>
  );
}

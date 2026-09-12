import { ExternalLink, Github, Instagram, Linkedin } from "lucide-react";
import { knowledgeBaseLinkProps, siteNavigation } from "./siteNavigation";

const socialItems = [
  { label: "LinkedIn", href: "https://www.linkedin.com/company/sd-standard", Icon: Linkedin },
  { label: "Instagram", href: "https://www.instagram.com/sdstandard_org", Icon: Instagram },
  { label: "GitHub", href: "https://github.com/alexquintoc/sd-standard", Icon: Github },
  { label: "Bluesky", href: "https://bsky.app/profile/sdstandard.bsky.social", Icon: null },
];

const utilityItems = [
  { label: "Footprints", href: "/footprints" },
  { label: "Baselines", href: "/baselines" },
  { label: "Impact Snapshot", href: "/impact-snapshot" },
  { label: "Brief Generator", href: "/brief-generator" },
];

export function SiteFooter({ t }: { t: (text: string) => string }) {
  return <footer className="public-footer">
    <div className="public-footer-inner">
      <div className="public-footer-intro">
        <h2>SD Standard</h2>
        <p>{t("An open sustainability standard for visual communication and design practitioners")}</p>
        <form action="https://buttondown.com/api/emails/embed-subscribe/sdstandard" method="post" className="embeddable-buttondown-form public-footer-form">
          <p>{t("Get occasional updates about the SD Standard.")}</p>
          <label htmlFor="bd-email">{t("Enter your email")}</label>
          <div>
            <input type="email" name="email" id="bd-email" required />
            <input type="submit" value={t("Subscribe")} />
          </div>
          <p><a href="https://buttondown.com/refer/sdstandard" target="_blank" rel="noopener noreferrer">{t("Powered by Buttondown.")}</a></p>
        </form>
      </div>

      <nav className="public-footer-navigation" aria-label={t("Footer navigation")}>
        {siteNavigation.map(section => <section key={section.id} aria-labelledby={`footer-${section.id}`}>
          <h3 id={`footer-${section.id}`}>{t(section.label)}</h3>
          <ul>{section.items.map(item => <li key={item.href}><a href={item.href} {...knowledgeBaseLinkProps(item)}>{t(item.label)}{item.opensInNewTab && <ExternalLink size={13} aria-hidden="true" />}</a></li>)}</ul>
        </section>)}
      </nav>

      <div className="public-footer-utility">
        <nav aria-label={t("Tools and utility links")}>
          {utilityItems.map(item => <a href={item.href} key={item.href}>{t(item.label)}</a>)}
        </nav>
        <div className="public-footer-social" aria-label={t("Social media")}>
          {socialItems.map(({ label, href, Icon }) => <a aria-label={label} href={href} key={href} rel="noopener noreferrer" target="_blank">{Icon ? <Icon aria-hidden="true" /> : <span aria-hidden="true">Bluesky</span>}</a>)}
        </div>
      </div>

      <div className="public-footer-legal">
        <p>SD Standard © Sustainable Design Standard - licensed under <a href="https://creativecommons.org/licenses/by/4.0/" target="_blank" rel="noopener noreferrer">CC BY 4.0</a></p>
      </div>
    </div>
  </footer>;
}

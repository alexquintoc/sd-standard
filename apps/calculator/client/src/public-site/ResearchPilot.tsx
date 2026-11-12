import { FormEvent, useRef, useState } from "react";
import { Link } from "wouter";
import { PageMeta } from "./PageIntro";
import "./research-pilot.css";

const participationMessages = [
  ["Improve design decisions", "Explore practical ways to improve the sustainability of design decisions without expecting a perfect outcome."],
  ["Understand wider systems", "Consider how design contributes to environmental, social, cultural, and economic systems."],
  ["Learn across contexts", "Exchange knowledge with practitioners and researchers working in different disciplines and places."],
  ["Document the process", "Record challenges, trade-offs, outcomes, and lessons learned throughout the work."],
  ["Contribute practical knowledge", "Help build a growing body of useful knowledge about sustainable communication design."],
] as const;

const collaborativeActivities = [
  { title: "Explore", description: "Investigate sustainability challenges, question assumptions, and identify where design might make a meaningful contribution.", detail: "Use research, systems thinking, and the SD Standard's four pillars to understand a project's wider context." },
  { title: "Apply", description: "Bring sustainability principles into real design projects and educational or research activities.", detail: "Use the Standard's criteria and tools to explore alternatives, make informed decisions, and document trade-offs." },
  { title: "Share", description: "Document experiences, findings, and lessons that can support other designers and researchers.", detail: "Contribute case studies, methods, and practical knowledge that can also help improve the Standard." },
] as const;

const stages = [
  { month: "January", title: "Discover opportunities", activities: ["Introduce projects and contributions.", "Explore relevant SD Standard criteria.", "Identify questions and opportunities."], output: "Initial opportunity map" },
  { month: "February", title: "Put ideas into practice", activities: ["Investigate alternatives.", "Experiment with design decisions.", "Document findings using the Project Passport."], output: "Project documentation using the Standard's framework" },
  { month: "March", title: "Reflect and share findings", activities: ["Reflect on the experience.", "Discuss changes, barriers, and unresolved questions.", "Contribute findings and feedback."], output: "Research reflections and shared learning" },
] as const;

const participantTypes = [
  ["Designers and studios", "Apply sustainability principles to real projects, explore new approaches, and document design decisions and outcomes."],
  ["Researchers", "Investigate design impact, ecological literacy, sustainability transitions, measurement, systems thinking, and research methods."],
  ["Educators and students", "Integrate sustainability into studio projects, workshops, coursework, and applied research."],
  ["Organizations and nonprofits", "Bring real-world communication challenges and collaborate with design practitioners on environmental, social, cultural, or economic objectives."],
  ["Design associations and professional networks", "Connect practitioners, share knowledge, and encourage more responsible approaches across the design community."],
] as const;

const benefits = [
  ["Practical experience", "Explore sustainability principles through real projects using the SD Standard's open tools and resources."],
  ["Research and knowledge exchange", "Connect with people investigating similar questions across disciplines and geographic contexts."],
  ["Project documentation", "Use the Project Workspace and Project Passport to record decisions, trade-offs, evidence, and learning."],
  ["Professional learning", "Develop a deeper understanding of sustainability in communication design and its relationship to wider systems."],
  ["Opportunities for visibility", "Selected work may be featured as a case study or shared through SD Standard platforms, with participants' permission."],
  ["Contribution to an open framework", "Help identify ways to improve the Standard's criteria, tools, resources, and methodologies."],
] as const;

const explorationAreas = [
  "Environmental impact reduction and resource use", "Accessibility, inclusion, and social well-being", "Cultural sustainability and community participation", "Fair compensation and economic sustainability", "Ecological literacy and systems thinking", "Measuring and communicating design impact", "Design's contribution to sustainability transitions",
] as const;

const principles = [
  "The Collaborative is not a competition or a certification program.", "Participants retain ownership of their projects.", "Identifiable project materials or findings will only be presented publicly with permission.", "The research will consider successful changes as well as barriers and unresolved questions.", "Findings will contribute to an openly shared research summary.",
] as const;

const roleOptions = ["Independent designer", "Design studio or creative team", "Design educator", "Researcher", "Student or student team", "Organization or nonprofit", "Design association or professional network", "Other"];
const projectOptions = ["Applying the Standard to a design project", "Participating in research", "Educational collaboration", "Contributing expertise or resources", "Exploring an institutional partnership", "Still exploring how I might participate", "Other"];
const stageOptions = ["Planning or concept development", "Research", "Early design development", "Already underway, but open to changes", "Not project-based or still to be discussed", "Still exploring a project idea"];
const availabilityOptions = ["Yes", "Probably, but I’d like more information", "Not sure yet"];

function encodeForm(form: HTMLFormElement) {
  return new URLSearchParams(Array.from(new FormData(form).entries()).map(([key, value]) => [key, String(value)])).toString();
}

export default function ResearchPilot() {
  const formRef = useRef<HTMLFormElement>(null);
  const [status, setStatus] = useState<"idle" | "submitting" | "success" | "error">("idle");
  const [error, setError] = useState("");

  async function submit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    const form = event.currentTarget;
    if (!form.reportValidity() || status === "submitting") return;
    setStatus("submitting"); setError("");
    try {
      const response = await fetch("/", { method: "POST", headers: { "Content-Type": "application/x-www-form-urlencoded" }, body: encodeForm(form) });
      if (!response.ok) throw new Error("Submission failed");
      form.reset(); setStatus("success");
      window.history.replaceState(null, "", `${window.location.pathname}#thank-you`);
      window.requestAnimationFrame(() => document.getElementById("thank-you")?.focus());
    } catch {
      setError("We couldn’t submit the form. Please check your connection and try again.");
      setStatus("error");
    }
  }

  return <main className="pilot-page">
    <PageMeta title="Design Impact Collaborative 2027" seoTitle="Design Impact Collaborative 2027 | SD Standard" description="Join an international initiative bringing designers, researchers, and organizations together to explore sustainable communication design through projects, research, and shared learning." socialTitle="Design Impact Collaborative - 2027 Inaugural Cohort" socialDescription="A global invitation to rethink the impact of communication design. Explore, apply, and share new approaches to sustainability through collaborative design and research." />

    <header className="pilot-hero"><div className="pilot-wrap pilot-hero-grid">
      <div className="pilot-hero-copy">
        <p className="pilot-kicker">Design Impact Collaborative · 2027</p>
        <h1>A global invitation to rethink the impact of communication design.</h1>
        <p className="pilot-lede">An international research and practice initiative by the Sustainable Design Standard.</p>
        <p>Designers, researchers, educators, students, and organizations use real-world projects, collaborative research, and shared learning to investigate how design decisions influence environmental, social, cultural, and economic outcomes.</p>
        <p>The SD Standard provides an open framework for experimentation, documentation, and continuous improvement.</p>
        <div className="pilot-actions"><a className="public-button" href="#apply">Express your interest</a><Link className="pilot-secondary" href="/explore">Explore the SD Standard <span aria-hidden="true">→</span></Link></div>
      </div>
      <div className="pilot-fact-panel"><p className="pilot-cohort-note">Applications of interest are open for the 2027 Inaugural Cohort.</p><dl className="pilot-facts" aria-label="2027 Inaugural Cohort at a glance">
        <div><dt>Collaborative cycle</dt><dd>January-March 2027</dd></div><div><dt>Cohort</dt><dd>3-5 projects</dd></div><div><dt>Research time</dt><dd>Approximately 12 hours<small>Additional to normal project development.</small></dd></div><div><dt>Cost</dt><dd>Free participation</dd></div><div><dt>Expression-of-interest deadline</dt><dd><time dateTime="2026-12-06">December 6, 2026</time></dd></div><div><dt>Selected participants announced</dt><dd><time dateTime="2026-12-18">December 18, 2026</time></dd></div>
      </dl></div>
    </div></header>

    <section className="pilot-section pilot-wrap" aria-labelledby="why-heading"><div className="pilot-heading pilot-heading-stacked"><h2 id="why-heading">Better design through shared knowledge.</h2><p>Design decisions can affect resource consumption, accessibility, cultural representation, economic opportunity, and the systems in which people live and work. Understanding these connections requires knowledge, experimentation, and collaboration.</p><p>Design Impact Collaborative creates a space to explore these questions through real projects. Participation is about learning and improvement, not demonstrating perfection.</p></div><div className="pilot-objectives">{participationMessages.map(([title, description], index) => <article key={title}><span>{String(index + 1).padStart(2, "0")}</span><h3>{title}</h3><p>{description}</p></article>)}</div></section>

    <section className="pilot-section pilot-timeline-section" id="timeline" aria-labelledby="timeline-heading"><div className="pilot-wrap"><div className="pilot-heading pilot-heading-stacked"><h2 id="timeline-heading">Explore. Apply. Share.</h2><p>These activities are interconnected, not necessarily sequential. Participants may contribute in different ways depending on their expertise and interests.</p></div><div className="pilot-collaborative-steps">{collaborativeActivities.map(activity => <article key={activity.title}><h3>{activity.title}</h3><p>{activity.description}</p><p>{activity.detail}</p></article>)}</div><div className="pilot-schedule"><h3>The 2027 cycle</h3><ol className="pilot-timeline">{stages.map((stage, index) => <li key={stage.month}><article><div className="pilot-stage-top"><span aria-hidden="true">{index + 1}</span><p>{stage.month}</p></div><h3>{stage.title}</h3><ul>{stage.activities.map(activity => <li key={activity}>{activity}</li>)}</ul><p className="pilot-output"><strong>Output</strong>{stage.output}</p></article></li>)}</ol></div><p className="pilot-time-note"><strong>Plan for approximately 10-12 hours of additional research activities across the three months.</strong> This excludes normal project development. The estimate is provisional and will be confirmed before the Collaborative begins.</p></div></section>

    <section className="pilot-section pilot-wrap" aria-labelledby="participants-heading"><div className="pilot-heading pilot-heading-stacked"><h2 id="participants-heading">Different perspectives. Shared purpose.</h2><p>Participants do not need to be sustainability experts. Curiosity, a willingness to learn, and a relevant project, question, or contribution are enough to begin.</p></div><div className="pilot-participant-grid">{participantTypes.map(([title, description]) => <article key={title}><h3>{title}</h3><p>{description}</p></article>)}</div></section>

    <section className="pilot-section pilot-audience-section" aria-labelledby="gain-heading"><div className="pilot-wrap"><div className="pilot-heading pilot-heading-stacked"><h2 id="gain-heading">A shared opportunity to learn and contribute.</h2><p>The value is reciprocal: participants develop their practice while contributing knowledge that can support the wider design community.</p></div><div className="pilot-benefit-grid">{benefits.map(([title, description]) => <article key={title}><h3>{title}</h3><p>{description}</p></article>)}</div></div></section>

    <section className="pilot-section pilot-wrap pilot-cohort" aria-labelledby="cohort-heading"><div className="pilot-heading pilot-heading-stacked"><p className="pilot-kicker">2027 Inaugural Cohort</p><h2 id="cohort-heading">The first collaborative cycle begins in 2027.</h2><p>Participants may contribute through design projects, educational activities, applied research, methodological development, or shared documentation. The first cycle will establish a foundation for future collaboration while generating practical insights into sustainable communication design.</p></div><div className="pilot-cohort-grid"><div><h3>Potential areas of exploration</h3><ul>{explorationAreas.map(area => <li key={area}>{area}</li>)}</ul></div><div className="pilot-principles"><h3>Clear conditions for working together</h3><ul>{principles.map(item => <li key={item}>{item}</li>)}</ul></div></div></section>

    <section className="pilot-section pilot-passport-section" aria-labelledby="framework-heading"><div className="pilot-wrap pilot-passport-grid"><div className="pilot-passport-preview" aria-label="Preview of the Abierto de Diseño Project Passport"><div className="pilot-preview-bar"><span>Project Passport</span><span>Living record</span></div><img src="/images/project-passports/abierto/abierto-installation-overview.jpg" alt="Abierto de Diseño installation documented in the existing Project Passport" loading="lazy" width="900" height="675" /><div className="pilot-preview-data"><div><span>Project</span><strong>Abierto de Diseño México 2026</strong></div><div><span>Tracks</span><strong>Decisions, evidence, learning</strong></div></div></div><div className="pilot-passport-copy"><p className="pilot-kicker">The Sustainable Design Standard</p><h2 id="framework-heading">An open framework for better design decisions.</h2><p>Design Impact Collaborative is an initiative of the Sustainable Design Standard. Its four interconnected pillars, Environment, Society, Culture, and Finance, help participants ask better questions, explore alternatives, document decisions, and assess outcomes.</p><p>The Collaborative also creates opportunities to improve the framework through practical experience, critical evaluation, and research.</p><nav className="pilot-resource-links" aria-label="SD Standard resources"><Link href="/explore/pillars">Explore the four pillars</Link><Link href="/explore/criteria">Browse the criteria</Link><a href="/knowledge-base">Visit the Knowledge Base</a><Link href="/workspace">Explore the Project Workspace</Link><Link href="/projects/abierto">View a Project Passport</Link></nav></div></div></section>

    <section className="pilot-apply" id="apply" aria-labelledby="apply-heading"><div className="pilot-wrap pilot-apply-grid"><div className="pilot-apply-intro"><p className="pilot-kicker">Expression of interest</p><h2 id="apply-heading">Bring your perspective to the Collaborative.</h2><p className="pilot-apply-lede">Tell us a little about your work and how you might like to participate.</p><p>Whether you are a designer, researcher, educator, student, network, or organization, we would like to hear from you.</p><p className="pilot-deadline-reminder"><strong>Expressions of interest close December 6, 2026.</strong></p><p>You do not need a finished proposal. An idea, question, or area of interest is enough to express your interest.</p></div>
      {status === "success" ? <section className="pilot-confirmation" id="thank-you" tabIndex={-1} aria-live="polite"><p className="pilot-kicker">Form submitted</p><h3>Thank you for your interest!</h3><p>We’ve received your expression of interest in the 2027 Design Impact Collaborative.</p><p>We’ll review submissions and contact potential participants to discuss next steps.</p><p>In the meantime, you’re welcome to explore the SD Standard and its tools.</p><Link className="public-button" href="/explore">Explore the SD Standard</Link></section> : <form ref={formRef} className="pilot-form" name="research-pilot-2027" method="POST" data-netlify="true" netlify-honeypot="company-website" onSubmit={submit} noValidate={false}>
        <input type="hidden" name="form-name" value="research-pilot-2027" /><p className="pilot-honeypot" aria-hidden="true"><label>Do not fill this out if you are human: <input name="company-website" tabIndex={-1} autoComplete="off" /></label></p>
        <fieldset><legend>Personal information</legend><div className="pilot-form-grid"><label>Name <span aria-hidden="true">*</span><input name="name" type="text" autoComplete="name" required /></label><label>Email address <span aria-hidden="true">*</span><input name="email" type="email" autoComplete="email" required /></label><label>Organization, studio, or university <span className="pilot-optional">Optional</span><input name="organization" type="text" autoComplete="organization" /></label><label>Country or region <span aria-hidden="true">*</span><input name="country-region" type="text" autoComplete="country-name" required /></label><label className="pilot-span-2">How would you describe your role? <span aria-hidden="true">*</span><select name="role" required defaultValue=""><option value="" disabled>Select one</option>{roleOptions.map(option => <option key={option}>{option}</option>)}</select></label></div></fieldset>
        <fieldset><legend>Participation interests</legend><div className="pilot-form-grid"><label className="pilot-span-2">How might you like to participate? <span aria-hidden="true">*</span><select name="project-type" required defaultValue=""><option value="" disabled>Select one</option>{projectOptions.map(option => <option key={option}>{option}</option>)}</select></label><label className="pilot-span-2">Briefly describe your project, question, or contribution. <span aria-hidden="true">*</span><textarea name="project-description" required maxLength={1000} rows={6} aria-describedby="project-description-help" /><small id="project-description-help">A few sentences are enough. Tell us what you are planning, working on, or interested in exploring. Maximum 1,000 characters.</small></label><label className="pilot-span-2">What stage will this work be at in January 2027? <span aria-hidden="true">*</span><select name="project-stage" required defaultValue=""><option value="" disabled>Select one</option>{stageOptions.map(option => <option key={option}>{option}</option>)}</select></label></div></fieldset>
        <fieldset><legend>Motivation and availability</legend><div className="pilot-form-grid"><label className="pilot-span-2">What interests you most about participating? <span className="pilot-optional">Optional</span><textarea name="motivation" maxLength={500} rows={4} /><small>Maximum 500 characters.</small></label><label className="pilot-span-2">Would you be available for approximately 10-12 hours of online collaborative activities between January and March 2027? <span aria-hidden="true">*</span><select name="availability" required defaultValue=""><option value="" disabled>Select one</option>{availabilityOptions.map(option => <option key={option}>{option}</option>)}</select></label></div></fieldset>
        <fieldset><legend>Privacy and consent</legend><div className="pilot-privacy"><p>Your information will be used to review your expression of interest, understand your proposed contribution, and contact you about the Collaborative. It will not be sent to analytics services or used for unrelated marketing without your permission.</p><label className="pilot-check"><input type="checkbox" name="privacy-acknowledgment" value="acknowledged" required /><span>I acknowledge the privacy notice above and agree to the use of my information for this expression of interest. <span aria-hidden="true">*</span></span></label><label className="pilot-check"><input type="checkbox" name="future-news" value="yes" /><span>I would also like to receive future SD Standard news and research opportunities. <span className="pilot-optional">Optional</span></span></label></div></fieldset>
        {error && <p className="pilot-form-error" role="alert">{error}</p>}<button className="public-button pilot-submit" type="submit" disabled={status === "submitting"}>{status === "submitting" ? "Submitting…" : "Submit expression of interest"}</button><p className="pilot-submit-note">Submitting an expression of interest does not commit you to participating. Selected applicants will be contacted to discuss the initiative before confirming their involvement.</p>
      </form>}
    </div></section>
  </main>;
}

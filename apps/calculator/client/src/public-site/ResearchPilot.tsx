import { FormEvent, useRef, useState } from "react";
import { Link } from "wouter";
import { PageMeta } from "./PageIntro";
import "./research-pilot.css";

const objectives = [
  ["01", "Understand environmental impacts", "Identify opportunities to estimate and potentially reduce the emissions and resource use associated with a project."],
  ["02", "Discover new opportunities", "Identify materials, technologies, collaborators, suppliers, and approaches that might not otherwise be considered."],
  ["03", "Engage with communities", "Recognize stakeholders who could contribute valuable perspectives, knowledge, or expertise."],
  ["04", "Make more informed decisions", "Consider environmental, social, cultural, and financial implications alongside conventional design objectives."],
  ["05", "Expand designers’ influence", "Explore how designers can help shape project briefs, processes, and outcomes."],
] as const;

const stages = [
  { month: "January", title: "Discover opportunities", question: "What could we do differently?", activities: ["Introduce projects.", "Explore relevant SD Standard criteria.", "Identify opportunities for improvement."], output: "Initial opportunity map" },
  { month: "February", title: "Put ideas into practice", question: "What can we change?", activities: ["Investigate alternatives.", "Experiment with design decisions.", "Document findings using the Project Passport."], output: "Project documentation using the Standard's framework" },
  { month: "March", title: "Reflect and share findings", question: "What did we learn?", activities: ["Reflect on the experience.", "Discuss successful changes and challenges.", "Contribute feedback to the SD Standard."], output: "Research reflections and findings" },
] as const;

const projectTypes = [
  ["Digital experiences", "Websites, digital products, services, platforms, and other screen-based experiences."],
  ["Visual communication and editorial design", "Identity systems, campaigns, publications, information design, and printed communication."],
  ["Physical and hybrid experiences", "Exhibitions, installations, events, signage, and projects that connect physical and digital touchpoints."],
  ["Academic and experimental projects", "Research-led, speculative, educational, and student projects that can test new approaches."],
] as const;

const benefits = ["Explore new approaches to design.", "Discover possibilities for your projects.", "Connect with other designers.", "Contribute to an open framework.", "Document and communicate your process."];
const participants = ["Independent designers", "Design studios", "Multidisciplinary creative teams", "Digital and communication designers", "Educators and researchers", "University programs and student teams", "Organizations developing communication design initiatives"];
const principles = ["The pilot is not a competition or a certification program.", "Participants retain ownership of their projects.", "Identifiable project materials or findings will only be presented publicly with permission.", "The research will examine successful changes as well as barriers and unresolved questions.", "Findings will contribute to an openly shared research summary."];
const participation = ["Contribute one new or early-stage design project.", "Join introductory and collaborative online research sessions.", "Explore relevant SD Standard criteria and apply them to the project.", "Document discoveries and decisions using the Project Passport.", "Share feedback on the framework, tools, and overall experience.", "Take part in a final reflection on the pilot’s findings."];

const roleOptions = ["Independent designer", "Design studio or creative team", "Design educator or researcher", "Student or student team", "Organization or institution", "Other"];
const projectOptions = ["Website or digital experience", "Editorial or publication design", "Visual identity or branding", "Communication campaign", "Exhibition or installation", "Information design", "Academic or experimental project", "Other"];
const stageOptions = ["Planning or concept development", "Research", "Early design development", "Already underway, but open to changes", "Still exploring a project idea"];
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
    <PageMeta title="SD Standard Research Pilot 2027" seoTitle="SD Standard Research Pilot 2027 | Sustainable Design Standard" description="Join the first SD Standard Research Pilot, January–March 2027. An open invitation for communication designers, studios, and academic teams to explore sustainability in the design process." />

    <header className="pilot-hero">
      <div className="pilot-wrap pilot-hero-grid">
        <div className="pilot-hero-copy">
          <p className="pilot-kicker">SD Standard Research Pilot 2027</p>
          <h1>What if sustainability became part of how we design from the start?</h1>
          <p className="pilot-lede">The Sustainable Design Standard invites communication designers, creative studios, and academic teams to explore how environmental, social, cultural, and financial considerations can shape the design process.</p>
          <p>From January to March 2027, a small cohort will use the Standard to identify opportunities, test decisions, and document what changes in practice—including the limits, trade-offs, and questions that remain.</p>
          <div className="pilot-actions"><a className="public-button" href="#apply">Express your interest</a><a className="pilot-secondary" href="#timeline">How the pilot works <span aria-hidden="true">↓</span></a></div>
        </div>
        <div className="pilot-fact-panel">
          <dl className="pilot-facts" aria-label="Pilot at a glance">
            <div><dt>Pilot period</dt><dd>January–March 2027</dd></div>
            <div><dt>Cohort</dt><dd>3–5 projects</dd></div>
            <div><dt>Research time</dt><dd>Approximately 12 hours<small>Additional to normal project development.</small></dd></div>
            <div><dt>Cost</dt><dd>Free participation</dd></div>
            <div><dt>Expression-of-interest deadline</dt><dd><time dateTime="2026-12-06">December 6, 2026</time></dd></div>
            <div><dt>Selected participants announced</dt><dd><time dateTime="2026-12-18">December 18, 2026</time></dd></div>
          </dl>
        </div>
      </div>
    </header>

    <section className="pilot-framework" aria-labelledby="framework-heading"><div className="pilot-wrap pilot-framework-grid">
      <div><p className="pilot-kicker">What is the SD Standard?</p><h2 id="framework-heading">An open framework for evaluating and improving communication design.</h2></div>
      <div><p>Organized around four interconnected pillars—Environment, Society, Culture, and Finance—the SD Standard provides criteria that help designers consider the broader consequences of their work.</p><p>Communication design influences how resources are used, how information is accessed, whose perspectives are represented, and how value is created and distributed. Many of these considerations are not traditionally part of a design brief.</p><Link className="pilot-secondary" href="/explore">Explore the framework <span aria-hidden="true">→</span></Link></div>
    </div></section>

    <section className="pilot-section pilot-wrap" aria-labelledby="why-heading">
      <div className="pilot-heading pilot-heading-stacked"><p className="pilot-kicker">Why we’re launching this pilot</p><h2 id="why-heading">Researching what responsible design can look like in practice.</h2><p>The pilot will explore a set of opportunities and questions—not promise predetermined outcomes.</p></div>
      <div className="pilot-objectives">{objectives.map(([number, title, description]) => <article key={number}><span>{number}</span><h3>{title}</h3><p>{description}</p></article>)}</div>
    </section>

    <section className="pilot-section pilot-timeline-section" id="timeline" aria-labelledby="timeline-heading">
      <div className="pilot-wrap"><div className="pilot-heading"><p className="pilot-kicker">How the pilot works</p><h2 id="timeline-heading">Three months. Three connected stages.</h2></div>
        <ol className="pilot-timeline">{stages.map((stage, index) => <li key={stage.month}><article><div className="pilot-stage-top"><span aria-hidden="true">{index + 1}</span><p>{stage.month}</p></div><h3>{stage.title}</h3><blockquote>{stage.question}</blockquote><ul>{stage.activities.map(activity => <li key={activity}>{activity}</li>)}</ul><p className="pilot-output"><strong>Output</strong>{stage.output}</p></article></li>)}</ol>
        <p className="pilot-time-note"><strong>Plan for approximately 10–12 hours of additional research activities across the three months.</strong> This excludes normal project development. The estimate is provisional and will be confirmed before the pilot begins.</p>
        <div className="pilot-participation"><h3>What participation involves</h3><ul>{participation.map(item => <li key={item}>{item}</li>)}</ul></div>
      </div>
    </section>

    <section className="pilot-section pilot-wrap" aria-labelledby="projects-heading">
      <div className="pilot-heading"><p className="pilot-kicker">Projects</p><h2 id="projects-heading">What kinds of projects are we looking for?</h2></div>
      <div className="pilot-project-grid">{projectTypes.map(([title, description]) => <article key={title}><h3>{title}</h3><p>{description}</p></article>)}</div>
      <div className="pilot-emphasis"><p>Your project doesn’t need to be about sustainability.</p><span>We are particularly interested in how sustainability considerations can enter projects that may not otherwise have included them.</span></div>
      <p className="pilot-body-copy">Projects can be in planning, research, or early design development in January 2027. Work already underway may also be suitable when there is still room to investigate alternatives and change decisions.</p>
    </section>

    <section className="pilot-section pilot-passport-section" aria-labelledby="passport-heading"><div className="pilot-wrap pilot-passport-grid">
      <div className="pilot-passport-preview" aria-label="Preview of the Abierto de Diseño Project Passport">
        <div className="pilot-preview-bar"><span>Project Passport</span><span>Living record</span></div>
        <img src="/images/project-passports/abierto/abierto-installation-overview.jpg" alt="Abierto de Diseño installation documented in the existing Project Passport" loading="lazy" width="900" height="675" />
        <div className="pilot-preview-data"><div><span>Project</span><strong>Abierto de Diseño México 2026</strong></div><div><span>Tracks</span><strong>Decisions · Evidence · Learning</strong></div></div>
      </div>
      <div className="pilot-passport-copy"><p className="pilot-kicker">A research tool</p><h2 id="passport-heading">Introducing the Project Passport</h2><p>The Project Passport records sustainability considerations as a project develops: the questions explored, decisions made, alternatives investigated, and evidence gathered.</p><p>It is an evolving record of the design process—not simply a final assessment. During the pilot, it will help each team make its reasoning visible and give the research a shared structure.</p><Link className="public-button" href="/projects/abierto">Explore an example Project Passport</Link></div>
    </div></section>

    <section className="pilot-section pilot-wrap" aria-labelledby="gain-heading"><div className="pilot-heading"><p className="pilot-kicker">What will you gain?</p><h2 id="gain-heading">A space to test, learn, and document.</h2></div><ul className="pilot-benefits">{benefits.map((benefit, index) => <li key={benefit}><span>{String(index + 1).padStart(2, "0")}</span>{benefit}</li>)}</ul><p className="pilot-body-copy">Participants will be acknowledged as contributors to the first research pilot, with opportunities to share their projects publicly if they choose.</p></section>

    <section className="pilot-section pilot-audience-section"><div className="pilot-wrap pilot-two-column">
      <div><p className="pilot-kicker">Who can participate?</p><h2>Open to different forms of design practice.</h2><p>No previous experience with the SD Standard is required.</p></div>
      <ul className="pilot-audience-list">{participants.map(item => <li key={item}>{item}</li>)}</ul>
    </div></section>

    <section className="pilot-section pilot-wrap pilot-principles" aria-labelledby="principles-heading"><div className="pilot-heading pilot-heading-stacked"><p className="pilot-kicker">An open, collaborative research initiative</p><h2 id="principles-heading">Clear conditions for working together.</h2><p>The pilot is designed to learn from real practice while respecting each participant’s work and choices.</p></div><ul>{principles.map(item => <li key={item}>{item}</li>)}</ul></section>

    <section className="pilot-apply" id="apply" aria-labelledby="apply-heading"><div className="pilot-wrap pilot-apply-grid">
      <div className="pilot-apply-intro"><p className="pilot-kicker">Expression of interest</p><h2 id="apply-heading">Join the first SD Standard Research Pilot</h2><p className="pilot-apply-lede">Help us explore what responsible design can become.</p><p className="pilot-deadline-reminder"><strong>Expressions of interest close December 6, 2026.</strong></p><p>You do not need a finished proposal. A project idea and an interest in learning through the process are enough to express your interest.</p></div>
      {status === "success" ? <section className="pilot-confirmation" id="thank-you" tabIndex={-1} aria-live="polite"><p className="pilot-kicker">Form submitted</p><h3>Thank you for your interest!</h3><p>We’ve received your expression of interest in the SD Standard Research Pilot 2027.</p><p>We’ll review submissions and contact potential participants to discuss the next steps.</p><p>In the meantime, you’re welcome to explore the SD Standard and its tools.</p><Link className="public-button" href="/explore">Explore the SD Standard</Link></section> : <form ref={formRef} className="pilot-form" name="research-pilot-2027" method="POST" data-netlify="true" netlify-honeypot="company-website" onSubmit={submit} noValidate={false}>
        <input type="hidden" name="form-name" value="research-pilot-2027" />
        <p className="pilot-honeypot" aria-hidden="true"><label>Do not fill this out if you are human: <input name="company-website" tabIndex={-1} autoComplete="off" /></label></p>
        <fieldset><legend>Personal information</legend><div className="pilot-form-grid">
          <label>Name <span aria-hidden="true">*</span><input name="name" type="text" autoComplete="name" required /></label>
          <label>Email address <span aria-hidden="true">*</span><input name="email" type="email" autoComplete="email" required /></label>
          <label>Organization, studio, or university <span className="pilot-optional">Optional</span><input name="organization" type="text" autoComplete="organization" /></label>
          <label>Country or region <span aria-hidden="true">*</span><input name="country-region" type="text" autoComplete="country-name" required /></label>
          <label className="pilot-span-2">How would you describe your role? <span aria-hidden="true">*</span><select name="role" required defaultValue=""><option value="" disabled>Select one</option>{roleOptions.map(option => <option key={option}>{option}</option>)}</select></label>
        </div></fieldset>
        <fieldset><legend>Project information</legend><div className="pilot-form-grid">
          <label className="pilot-span-2">What type of project would you like to explore? <span aria-hidden="true">*</span><select name="project-type" required defaultValue=""><option value="" disabled>Select one</option>{projectOptions.map(option => <option key={option}>{option}</option>)}</select></label>
          <label className="pilot-span-2">Briefly describe your project or idea. <span aria-hidden="true">*</span><textarea name="project-description" required maxLength={1000} rows={6} aria-describedby="project-description-help" /><small id="project-description-help">A few sentences are enough. Tell us what you’re planning or working on. Maximum 1,000 characters.</small></label>
          <label className="pilot-span-2">What stage will your project be at in January 2027? <span aria-hidden="true">*</span><select name="project-stage" required defaultValue=""><option value="" disabled>Select one</option>{stageOptions.map(option => <option key={option}>{option}</option>)}</select></label>
        </div></fieldset>
        <fieldset><legend>Motivation and availability</legend><div className="pilot-form-grid">
          <label className="pilot-span-2">What interests you most about participating? <span className="pilot-optional">Optional</span><textarea name="motivation" maxLength={500} rows={4} /><small>Maximum 500 characters.</small></label>
          <label className="pilot-span-2">Would you be available for approximately 10–12 hours of online research activities between January and March 2027? <span aria-hidden="true">*</span><select name="availability" required defaultValue=""><option value="" disabled>Select one</option>{availabilityOptions.map(option => <option key={option}>{option}</option>)}</select></label>
        </div></fieldset>
        <fieldset><legend>Privacy and consent</legend><div className="pilot-privacy"><p>Your information will be used to review your expression of interest, understand the proposed project, and contact you about this pilot. It will not be sent to analytics services or used for unrelated marketing without your permission.</p>
          <label className="pilot-check"><input type="checkbox" name="privacy-acknowledgment" value="acknowledged" required /><span>I acknowledge the privacy notice above and agree to the use of my information for this expression of interest. <span aria-hidden="true">*</span></span></label>
          <label className="pilot-check"><input type="checkbox" name="future-news" value="yes" /><span>I would also like to receive future SD Standard news and research opportunities. <span className="pilot-optional">Optional</span></span></label>
        </div></fieldset>
        {error && <p className="pilot-form-error" role="alert">{error}</p>}
        <button className="public-button pilot-submit" type="submit" disabled={status === "submitting"}>{status === "submitting" ? "Submitting…" : "Submit expression of interest"}</button>
        <p className="pilot-submit-note">Submitting an expression of interest does not commit you to participating. Selected applicants will be contacted to discuss the program before confirming their involvement.</p>
      </form>}
    </div></section>
  </main>;
}

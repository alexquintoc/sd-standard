import { Link } from "wouter";
import questions from "./design-questions.json";
import { publicCriteria } from "./criteria";

export function DesignQuestions() {
  return <section className="public-section">
    <h2>Start with a design question</h2>
    <div className="public-questions">{questions.map(question => <details key={question.id} id={question.id}>
      <summary>{question.question}</summary>
      <div>
        <p>{question.answer}</p>
        <ul>{question.criterionIds.map(id => {
          const criterion = publicCriteria.find(item => item.id === id);
          if (!criterion) throw new Error(`Stale design question criterion: ${id}`);
          return <li key={id}><a className="public-link" href={criterion.url} target="_blank" rel="noopener noreferrer" aria-label={`${criterion.displayId}: ${criterion.label} (opens in a new tab)`}>{criterion.displayId} · {criterion.label} ↗</a></li>;
        })}</ul>
        <Link className="public-link" href={`/explore/criteria#${question.criterionIds[0]}`}>{question.action} →</Link>
      </div>
    </details>)}</div>
  </section>;
}

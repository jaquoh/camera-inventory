import type { Goal } from '../data/content'

export function GoalsScreen({ goals }: { goals: Goal[] }) {
  return <div><header className="screen-heading"><p className="eyebrow">Deliberate practice</p><h1>Next Goals</h1><p>A quest log for experiments, technique, and a curated collection.</p></header><div className="quest-list">{goals.map((goal, index) => <article className={`quest status-${goal.status.toLowerCase()}`} key={goal.id}><span className="quest__number">{String(index + 1).padStart(2, '0')}</span><div><p className="eyebrow">{goal.status} · {goal.priority} PRIORITY</p><h2>{goal.title}</h2><p>{goal.description}</p>{goal.notes && <small>{goal.notes}</small>}<div className="tag-list">{goal.tags.map((tag) => <span key={tag}>{tag}</span>)}</div></div></article>)}</div></div>
}

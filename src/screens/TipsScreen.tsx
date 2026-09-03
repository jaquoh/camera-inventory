import type { Tip } from '../data/content'

export function TipsScreen({ tips }: { tips: Tip[] }) {
  return <div><header className="screen-heading"><p className="eyebrow">Collected field wisdom</p><h1>Tips & Tricks</h1><p>Small, practical reminders for buying, carrying, and photographing.</p></header><div className="tip-grid">{tips.map((tip) => <article className="tip-card" key={tip.id}><p className="eyebrow">{tip.category}</p><h2>{tip.title}</h2><p>{tip.body}</p><div className="tag-list">{tip.tags.map((tag) => <span key={tag}>{tag}</span>)}</div></article>)}</div></div>
}

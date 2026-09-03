import { useMemo, useState } from 'react'
import ReactMarkdown from 'react-markdown'
import remarkGfm from 'remark-gfm'
import type { NotebookPage } from '../data/content'

export function NotebookScreen({ pages }: { pages: NotebookPage[] }) {
  const tabs = [...new Set(pages.map((page) => page.tab))]
  const [activeTab, setActiveTab] = useState(tabs[0] ?? '')
  const pagesInTab = useMemo(() => pages.filter((page) => page.tab === activeTab), [pages, activeTab])
  const [activeId, setActiveId] = useState<string | undefined>(pages[0]?.id)
  const activePage = pages.find((page) => page.id === activeId) ?? pagesInTab[0]
  const chooseTab = (tab: string) => { setActiveTab(tab); setActiveId(pages.find((page) => page.tab === tab)?.id) }

  return (
    <div><header className="screen-heading"><p className="eyebrow">Git-versioned knowledge</p><h1>Field Notebook</h1><p>Real notes, techniques, and experiments in plain Markdown.</p></header>
      <div className="notebook-tabs" role="tablist" aria-label="Notebook sections">{tabs.map((tab) => <button role="tab" aria-selected={activeTab === tab} onClick={() => chooseTab(tab)} key={tab}>{tab}</button>)}</div>
      <div className="notebook">
        <nav className="notebook-index" aria-label={`${activeTab} pages`}><p className="eyebrow">{activeTab}</p>{pagesInTab.map((page) => <button className={page.id === activePage?.id ? 'active' : ''} onClick={() => setActiveId(page.id)} key={page.id}><strong>{page.title}</strong><span>{page.summary}</span></button>)}</nav>
        <article className="notebook-page">{activePage ? <ReactMarkdown remarkPlugins={[remarkGfm]}>{activePage.body}</ReactMarkdown> : <p>No page selected.</p>}</article>
      </div>
    </div>
  )
}

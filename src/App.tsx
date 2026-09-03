import { useState } from 'react'
import { goals, inventory, notebookPages, tips } from './data/content'
import { InventoryScreen } from './screens/InventoryScreen'
import { BackpackScreen } from './screens/BackpackScreen'
import { NotebookScreen } from './screens/NotebookScreen'
import { GoalsScreen } from './screens/GoalsScreen'
import { TipsScreen } from './screens/TipsScreen'

type Screen = 'INVENTORY' | 'BACKPACK' | 'FIELD NOTEBOOK' | 'QUESTS' | 'TIPS'
const nav: Array<{ id: Screen; marker: string }> = [
  { id: 'INVENTORY', marker: '▦' }, { id: 'BACKPACK', marker: '▣' }, { id: 'FIELD NOTEBOOK', marker: '▤' }, { id: 'QUESTS', marker: '◇' }, { id: 'TIPS', marker: '✦' },
]

export default function App() {
  const [screen, setScreen] = useState<Screen>('INVENTORY')
  return (
    <div className="app-shell">
      <header className="topbar"><button className="brand" onClick={() => setScreen('INVENTORY')}><span className="brand__mark">VL</span><span><strong>Vintage Lens Plan</strong><small>Photographer's field kit</small></span></button><div className="topbar__status"><span className="signal" /> Repository content online</div></header>
      <div className="app-frame">
        <nav className="main-nav" aria-label="Main navigation">{nav.map((item) => <button className={screen === item.id ? 'active' : ''} onClick={() => setScreen(item.id)} key={item.id}><span aria-hidden="true">{item.marker}</span>{item.id === 'FIELD NOTEBOOK' ? 'Notebook' : item.id[0] + item.id.slice(1).toLowerCase()}</button>)}</nav>
        <main>{screen === 'INVENTORY' && <InventoryScreen items={inventory} />}{screen === 'BACKPACK' && <BackpackScreen items={inventory} />}{screen === 'FIELD NOTEBOOK' && <NotebookScreen pages={notebookPages} />}{screen === 'QUESTS' && <GoalsScreen goals={goals} />}{screen === 'TIPS' && <TipsScreen tips={tips} />}</main>
      </div>
    </div>
  )
}

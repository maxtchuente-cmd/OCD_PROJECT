import { useState } from 'react'
import PublicHomePage from './pages/PublicHomePage'
import AccountPage from './pages/AccountPage'
import Icon from './components/ui/Icon'
import './account.css'

export default function App() {
  const [view, setView] = useState<'home' | 'account'>('home')
  const [accountMode, setAccountMode] = useState<'login' | 'register'>('login')
  const openAccount = (mode: 'login' | 'register' = 'login') => { setAccountMode(mode); setView('account') }
  if (view === 'account') return <AccountPage onBack={() => setView('home')} initialMode={accountMode} />
  return <div className="ocd-app-root"><PublicHomePage onAccount={openAccount} /><button className="account-floating-action" onClick={() => openAccount('login')}><Icon name="users"/><span>Mon espace</span></button></div>
}

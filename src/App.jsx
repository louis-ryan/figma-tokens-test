import { useState } from 'react'
import './App.css'

const navItems = [
  { id: 'dashboard', label: 'Dashboard', icon: '◉' },
  { id: 'analytics', label: 'Analytics', icon: '◈' },
  { id: 'projects', label: 'Projects', icon: '◇' },
  { id: 'reports', label: 'Reports', icon: '▷' },
  { id: 'settings', label: 'Settings', icon: '⊙' },
]

const statCards = [
  { title: 'Total Revenue', value: '$42,891', change: '+12.5%', trend: 'up' },
  { title: 'Active Users', value: '2,847', change: '+8.2%', trend: 'up' },
  { title: 'Conversion Rate', value: '4.3%', change: '-0.4%', trend: 'down' },
  { title: 'Avg. Order Value', value: '$127', change: '+23.1%', trend: 'up' },
]

const recentActivity = [
  { action: 'New signup', detail: 'john@example.com', time: '2 min ago' },
  { action: 'Payment received', detail: '$299.00', time: '15 min ago' },
  { action: 'Project updated', detail: 'Website redesign', time: '1 hr ago' },
  { action: 'Support ticket', detail: '#1842 opened', time: '2 hrs ago' },
]

function App() {
  const [activeNav, setActiveNav] = useState('dashboard')

  return (
    <div className="dashboard">
      <aside className="sidebar">
        <div className="sidebar-header">
          <span className="logo">Dashboard</span>
        </div>
        <nav className="sidebar-nav">
          {navItems.map((item) => (
            <button
              key={item.id}
              className={`nav-item ${activeNav === item.id ? 'active' : ''}`}
              onClick={() => setActiveNav(item.id)}
            >
              <span className="nav-icon">{item.icon}</span>
              <span>{item.label}</span>
            </button>
          ))}
        </nav>
        <div className="sidebar-footer">
          <div className="user-avatar">LR</div>
          <div className="user-info">
            <span className="user-name">Louis Ryan</span>
            <span className="user-role">Admin</span>
          </div>
        </div>
      </aside>

      <main className="main-content">
        <header className="header">
          <h1>Dashboard</h1>
          <p className="subtitle">Welcome back. Here's what's happening today.</p>
        </header>

        <section className="stats-grid">
          {statCards.map((card) => (
            <div key={card.title} className="stat-card">
              <span className="stat-title">{card.title}</span>
              <span className="stat-value">{card.value}</span>
              <span className={`stat-change ${card.trend}`}>{card.change}</span>
            </div>
          ))}
        </section>

        <div className="content-grid">
          <section className="card chart-section">
            <h2>Overview</h2>
            <div className="chart-placeholder">
              <div className="chart-bars">
                {[65, 45, 78, 52, 89, 62, 55, 72, 48, 85].map((h, i) => (
                  <div
                    key={i}
                    className="chart-bar"
                    style={{ height: `${h}%` }}
                  />
                ))}
              </div>
              <span className="chart-label">Last 10 days</span>
            </div>
          </section>

          <section className="card activity-section">
            <h2>Recent Activity</h2>
            <ul className="activity-list">
              {recentActivity.map((item, i) => (
                <li key={i} className="activity-item">
                  <div className="activity-content">
                    <span className="activity-action">{item.action}</span>
                    <span className="activity-detail">{item.detail}</span>
                  </div>
                  <span className="activity-time">{item.time}</span>
                </li>
              ))}
            </ul>
          </section>
        </div>
      </main>
    </div>
  )
}

export default App

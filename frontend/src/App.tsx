import { useState } from 'react'
import { useTranslation } from 'react-i18next'
import './App.css'

const API_URL = import.meta.env.VITE_API_URL ?? 'http://localhost:3000/api'

export default function App() {
  const { t } = useTranslation()
  const [email, setEmail] = useState('')
  const [submitted, setSubmitted] = useState(false)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')

  async function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault()

    if (!email.trim()) {
      setError(t('error_empty'))
      return
    }

    setError('')
    setLoading(true)

    try {
      const res = await fetch(`${API_URL}/waitlist`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email: email.trim() }),
      })

      if (res.status === 409) {
        setError(t('error_conflict'))
        return
      }

      if (!res.ok) {
        setError(t('error_server'))
        return
      }

      setSubmitted(true)
    } catch {
      setError(t('error_network'))
    } finally {
      setLoading(false)
    }
  }

  return (
    <main className="page">
      <div className="container">
        <h1 className="logo">Zghapari</h1>

        <p className="tagline-geo">{t('tagline_geo')}</p>
        <p className="tagline-en">{t('tagline_en')}</p>

        <div className="divider" />

        {submitted ? (
          <div className="thankyou">
            <strong>{t('thankyou_heading')}</strong>
            <br />
            {t('thankyou_line1')}
            <br />
            {t('thankyou_line2')}
          </div>
        ) : (
          <form className="signup-form" onSubmit={handleSubmit} noValidate>
            <input
              className="email-input"
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder={t('email_placeholder')}
              aria-label={t('email_aria_label')}
              autoComplete="email"
              disabled={loading}
            />
            {error && (
              <p style={{ fontSize: '0.82rem', color: '#b94040' }}>{error}</p>
            )}
            <button
              className="submit-btn"
              type="submit"
              disabled={loading}
              aria-busy={loading}
            >
              {loading ? t('loading') : t('submit')}
            </button>
          </form>
        )}

        <footer className="footer">{t('footer')}</footer>
      </div>
    </main>
  )
}

import { useState, type FormEvent } from 'react'
import { useAuth } from './AuthProvider'

export function SignInPage() {
  const { sessionError, signIn } = useAuth()
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [error, setError] = useState<string | null>(null)
  const [submitting, setSubmitting] = useState(false)

  async function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault()
    setError(null)
    setSubmitting(true)

    try {
      await signIn(email.trim(), password)
    } catch {
      setError(
        'Sign-in failed. Check your details or contact your pharmacy administrator.',
      )
    } finally {
      setSubmitting(false)
    }
  }

  return (
    <main className="auth-page">
      <section className="auth-panel" aria-labelledby="sign-in-title">
        <p className="auth-eyebrow">PHARMACY OPERATIONS</p>
        <h1 id="sign-in-title">Staff sign in</h1>
        <p className="auth-description">
          Sign in with the account provided by your pharmacy administrator.
        </p>

        {sessionError && (
          <p className="auth-message" role="alert">
            {sessionError}
          </p>
        )}
        {error && (
          <p className="auth-message" role="alert">
            {error}
          </p>
        )}

        <form className="auth-form" onSubmit={handleSubmit}>
          <label htmlFor="sign-in-email">Email</label>
          <input
            autoComplete="username"
            autoCapitalize="none"
            id="sign-in-email"
            name="email"
            onChange={(event) => setEmail(event.target.value)}
            required
            type="email"
            value={email}
          />

          <label htmlFor="sign-in-password">Password</label>
          <input
            autoComplete="current-password"
            id="sign-in-password"
            name="password"
            onChange={(event) => setPassword(event.target.value)}
            required
            type="password"
            value={password}
          />

          <button className="auth-submit" disabled={submitting} type="submit">
            {submitting ? 'Signing in...' : 'Sign in'}
          </button>
        </form>

        <p className="auth-footnote">
          Staff accounts are managed by your pharmacy administrator.
        </p>
      </section>
    </main>
  )
}
import { useState } from 'react'
import heroImg from './assets/hero.png'
import reactLogo from './assets/react.svg'
import viteLogo from './assets/vite.svg'
import './App.css'
import { SignInPage } from './auth/SignInPage'
import { useAuth } from './auth/AuthProvider'

function StarterContent() {
  const [count, setCount] = useState(0)

  return (
    <>
      <section id="center">
        <div className="hero">
          <img src={heroImg} className="base" width="170" height="179" alt="" />
          <img src={reactLogo} className="framework" alt="React logo" />
          <img src={viteLogo} className="vite" alt="Vite logo" />
        </div>
        <div>
          <h1>Get started</h1>
          <p>
            Edit <code>src/App.tsx</code> and save to test <code>HMR</code>
          </p>
        </div>
        <button
          type="button"
          className="counter"
          onClick={() => setCount((count) => count + 1)}
        >
          Count is {count}
        </button>
      </section>

      <div className="ticks"></div>

      <section id="next-steps">
        <div id="docs">
          <svg className="icon" role="presentation" aria-hidden="true">
            <use href="/icons.svg#documentation-icon"></use>
          </svg>
          <h2>Documentation</h2>
          <p>Your questions, answered</p>
          <ul>
            <li>
              <a href="https://vite.dev/" target="_blank">
                <img className="logo" src={viteLogo} alt="" />
                Explore Vite
              </a>
            </li>
            <li>
              <a href="https://react.dev/" target="_blank">
                <img className="button-icon" src={reactLogo} alt="" />
                Learn more
              </a>
            </li>
          </ul>
        </div>
        <div id="social">
          <svg className="icon" role="presentation" aria-hidden="true">
            <use href="/icons.svg#social-icon"></use>
          </svg>
          <h2>Connect with us</h2>
          <p>Join the Vite community</p>
          <ul>
            <li>
              <a href="https://github.com/vitejs/vite" target="_blank">
                <svg
                  className="button-icon"
                  role="presentation"
                  aria-hidden="true"
                >
                  <use href="/icons.svg#github-icon"></use>
                </svg>
                GitHub
              </a>
            </li>
            <li>
              <a href="https://chat.vite.dev/" target="_blank">
                <svg
                  className="button-icon"
                  role="presentation"
                  aria-hidden="true"
                >
                  <use href="/icons.svg#discord-icon"></use>
                </svg>
                Discord
              </a>
            </li>
            <li>
              <a href="https://x.com/vite_js" target="_blank">
                <svg
                  className="button-icon"
                  role="presentation"
                  aria-hidden="true"
                >
                  <use href="/icons.svg#x-icon"></use>
                </svg>
                X.com
              </a>
            </li>
            <li>
              <a href="https://bsky.app/profile/vite.dev" target="_blank">
                <svg
                  className="button-icon"
                  role="presentation"
                  aria-hidden="true"
                >
                  <use href="/icons.svg#bluesky-icon"></use>
                </svg>
                Bluesky
              </a>
            </li>
          </ul>
        </div>
      </section>

      <div className="ticks"></div>
      <section id="spacer"></section>
    </>
  )
}

function App() {
  const { configurationError, loading, session, signOut } = useAuth()
  const [signOutError, setSignOutError] = useState(false)

  if (loading) {
    return (
      <main className="auth-page">
        <p role="status">Restoring your session...</p>
      </main>
    )
  }

  if (configurationError) {
    return (
      <main className="auth-page">
        <section className="auth-panel" role="alert">
          <p className="auth-eyebrow">CONFIGURATION REQUIRED</p>
          <h1>Sign-in unavailable</h1>
          <p className="auth-description">{configurationError}</p>
        </section>
      </main>
    )
  }

  if (!session) return <SignInPage />

  return (
    <>
      <header className="auth-toolbar">
        <span>Signed in as {session.user.email}</span>
        <button
          className="auth-sign-out"
          onClick={() => {
            setSignOutError(false)
            void signOut().catch(() => setSignOutError(true))
          }}
          type="button"
        >
          Sign out
        </button>
      </header>
      {signOutError && (
        <p className="auth-message auth-toolbar-message" role="alert">
          Sign-out failed. Check your connection and try again.
        </p>
      )}
      <p className="auth-access-notice" role="status">
        Sign-in is active. Pharmacy data access will be enabled after membership
        roles and database authorization are configured.
      </p>
      <StarterContent />
    </>
  )
}

export default App

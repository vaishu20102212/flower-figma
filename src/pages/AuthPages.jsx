import React, { useEffect, useState } from 'react'
import { Link, useLocation, useNavigate } from 'react-router-dom'

const pageCopy = {
  '/login': {
    eyebrow: 'WELCOME BACK',
    title: 'Login To Your Account',
    description: '',
  },
  '/register': {
    eyebrow: 'GET STARTED',
    title: 'Create your account',
    description: 'Start growing something wonderful with us.',
  },
  '/forgot-password': {
    eyebrow: 'ACCOUNT RECOVERY',
    title: 'Forgot your password?',
    description: 'No worries — we’ll send you a reset link.',
  },
  '/reset-password': {
    eyebrow: 'ALMOST THERE',
    title: 'Set a new password',
    description: 'Choose a strong password you haven’t used before.',
  },
  '/lock-screen': {
    eyebrow: 'SESSION LOCKED',
    title: 'Ronald Robertson',
    description: 'Enter your password to access the admin.',
  },
}

function LockIllustration() {
  return (
    <svg viewBox="0 0 96 96" aria-hidden="true" className="auth-lock-art">
      <path d="M39 39V27c0-11 6-18 14-18s14 7 14 18v12h-8V27c0-6-2-10-6-10s-6 4-6 10v12h-8Z" fill="#D38B00" />
      <path d="m26 38 18-10 26 14-18 11-26-15Z" fill="#FFC400" />
      <path d="m26 38 26 15v31L26 69V38Z" fill="#F7B900" />
      <path d="m52 53 18-11v31L52 84V53Z" fill="#E99B00" />
      <circle cx="49" cy="58" r="4" fill="#D58A00" />
      <path d="M49 60v8" stroke="#D58A00" strokeWidth="3" strokeLinecap="round" />
      <path d="M43 30V17c0-8 4-13 10-13" stroke="#D38B00" strokeWidth="5" strokeLinecap="round" />
    </svg>
  )
}

const inputClass =
  'auth-input'

function Brand() {
  return (
    <Link to="/login" className="auth-brand" aria-label="Flower home">
      <img src="/flower-logo.png" alt="" />
      <span>flower<span className="auth-brand-dot">.</span></span>
    </Link>
  )
}

function FlowerIllustration() {
  return (
    <svg className="auth-flower-art" viewBox="0 0 560 500" fill="none" role="img" aria-label="Illustration of flowers growing in a garden">
      <circle cx="284" cy="246" r="184" fill="white" fillOpacity=".06" />
      <circle cx="284" cy="246" r="145" stroke="white" strokeOpacity=".11" />
      <path d="M281 416c-4-89 13-164 1-242" stroke="#B9EAC2" strokeWidth="7" strokeLinecap="round" />
      <path d="M281 332c-58-53-95-60-124-48 13 41 60 69 124 48Z" fill="#8DD9A0" />
      <path d="M283 367c46-52 91-67 124-57-17 45-66 73-124 57Z" fill="#5DC57A" />
      <path d="M279 290c-39-42-65-49-90-43 10 33 43 54 90 43Z" fill="#B2E8BB" />
      <path d="M286 313c31-37 64-48 88-41-12 34-47 54-88 41Z" fill="#89D89B" />
      <path d="M281 407c-21 24-39 45-51 69m55-66c16 20 33 39 49 58" stroke="#B9EAC2" strokeWidth="6" strokeLinecap="round" />
      <g transform="translate(281 156)">
        <ellipse cy="-42" rx="23" ry="43" fill="#FFE2A8" />
        <ellipse cy="-42" rx="23" ry="43" fill="#FFE2A8" transform="rotate(60)" />
        <ellipse cy="-42" rx="23" ry="43" fill="#FFE2A8" transform="rotate(120)" />
        <circle r="22" fill="#F5B94F" />
        <circle r="9" fill="#E79A32" />
      </g>
      <path d="M151 198c-2-48 9-88 33-111" stroke="#B9EAC2" strokeWidth="6" strokeLinecap="round" />
      <path d="M184 91c25-18 52-13 62 3-15 21-40 27-62-3Z" fill="#75CE8A" />
      <g transform="translate(183 79) scale(.64)">
        <ellipse cy="-34" rx="19" ry="35" fill="#F4A9B5" />
        <ellipse cy="-34" rx="19" ry="35" fill="#F4A9B5" transform="rotate(72)" />
        <ellipse cy="-34" rx="19" ry="35" fill="#F4A9B5" transform="rotate(144)" />
        <ellipse cy="-34" rx="19" ry="35" fill="#F4A9B5" transform="rotate(216)" />
        <ellipse cy="-34" rx="19" ry="35" fill="#F4A9B5" transform="rotate(288)" />
        <circle r="15" fill="#F7C66B" />
      </g>
      <path d="M414 231c6-53 0-97-19-127" stroke="#B9EAC2" strokeWidth="6" strokeLinecap="round" />
      <path d="M395 112c-23-20-49-18-60-4 12 22 36 31 60 4Z" fill="#75CE8A" />
      <g transform="translate(395 99) scale(.55)">
        <ellipse cy="-34" rx="19" ry="35" fill="#D4C2FF" />
        <ellipse cy="-34" rx="19" ry="35" fill="#D4C2FF" transform="rotate(72)" />
        <ellipse cy="-34" rx="19" ry="35" fill="#D4C2FF" transform="rotate(144)" />
        <ellipse cy="-34" rx="19" ry="35" fill="#D4C2FF" transform="rotate(216)" />
        <ellipse cy="-34" rx="19" ry="35" fill="#D4C2FF" transform="rotate(288)" />
        <circle r="15" fill="#F7C66B" />
      </g>
      <circle cx="104" cy="303" r="5" fill="#D2EFD6" />
      <circle cx="462" cy="324" r="7" fill="#D2EFD6" />
      <circle cx="439" cy="145" r="4" fill="#F5DDAA" />
      <path d="m106 147 5 12 12 5-12 5-5 12-5-12-12-5 12-5 5-12Z" fill="#F5DDAA" />
    </svg>
  )
}

function LoginIllustration() {
  return (
    <svg className="auth-login-art" viewBox="0 0 440 360" fill="none" role="img" aria-label="People working together on a laptop">
      <ellipse cx="215" cy="303" rx="174" ry="19" fill="#147A35" fillOpacity=".28" />
      <path d="m72 219 127-78 142 64-125 82-144-68Z" fill="#E9F1FA" />
      <path d="m86 216 113-67 122 57-105 68-130-58Z" fill="#27374D" />
      <path d="m199 141 133 61-2-119-127-57-4 115Z" fill="#F8FAFF" />
      <path d="m209 136 112 52V93L208 43l1 93Z" fill="#DCEBFA" />
      <path d="m219 127 88 42V101l-87-40-1 66Z" fill="#FFF" />
      <path d="m228 79 22 10v14l-22-10V79Zm0 21 69 32v5l-69-32v-5Zm0 12 56 26v5l-56-26v-5Z" fill="#F2B637" />
      <path d="m82 217 118-69v8l-105 63 118 51 99-63v-7l17 8-111 68-136-59Z" fill="#C6D4E5" />
      <path d="m102 215 97-56 94 44-91 58-100-46Z" fill="#33465D" />
      <path d="m124 213 75-43 66 31-70 45-71-33Z" fill="#DCE5EF" />
      <path d="m187 246 45 20-22 21-47-21 24-20Z" fill="#AAB9CA" />
      <g fill="#F6B21A">
        <path d="m74 195 14-9 14 7-14 9-14-7Z" />
        <path d="m74 195 14 7v17l-14-8v-16Z" />
        <path d="m88 202 14-9v16l-14 10v-17Z" />
      </g>
      <g stroke="#F3B21D" strokeWidth="4" strokeLinecap="round" strokeLinejoin="round">
        <path d="m150 86 13 6v28l-13-6V86Zm34 24 13 6v25l-13-6v-25Z" />
      </g>
      <g>
        <path d="M133 60c0-6 4-10 9-10s8 4 8 10l-2 8h-12l-3-8Z" fill="#F4BE92" />
        <path d="M132 60c-1-8 4-14 11-14 5 0 9 4 9 10-5 1-8-2-10-5-2 5-5 8-10 9Z" fill="#243248" />
        <path d="m134 69 13 1 5 29-19-3 1-27Z" fill="#FFF" />
        <path d="m137 96 13 1 1 28-8 2-4-20-4 18-8-1 5-28Z" fill="#25354B" />
        <path d="m136 73-10 13-9-4m20-4 9 12 6-5" stroke="#F4BE92" strokeWidth="4" strokeLinecap="round" />
      </g>
      <g>
        <path d="M286 105c0-6 4-10 9-10s8 4 8 10l-2 8h-12l-3-8Z" fill="#EFB68D" />
        <path d="M285 104c0-8 4-13 11-13 5 0 8 4 8 9-5 1-8-2-10-5-2 5-5 8-9 9Z" fill="#26354A" />
        <path d="m287 113 13 1 4 26-19-2 2-25Z" fill="#F4B328" />
        <path d="m288 138 13 2v24l-7 2-4-17-3 16-8-1 4-25Z" fill="#26354A" />
        <path d="m289 117-11 12-8-4m20-4 9 9 6-6" stroke="#EFB68D" strokeWidth="4" strokeLinecap="round" />
      </g>
      <g>
        <path d="M51 164c0-5 4-9 9-9s8 4 8 9l-2 7H53l-2-7Z" fill="#EFB68D" />
        <path d="M51 163c0-7 4-12 10-12 5 0 8 3 8 8-5 1-8-1-10-4-1 4-4 7-8 8Z" fill="#26354A" />
        <path d="m53 172 12 1 4 24-18-2 2-23Z" fill="#FFF" />
        <path d="m54 195 13 1 1 24-7 2-4-17-3 16-8-1 4-25Z" fill="#26354A" />
        <path d="m55 175-9 10-7-4m20-3 9 8 6-5" stroke="#EFB68D" strokeWidth="4" strokeLinecap="round" />
      </g>
      <g>
        <path d="M363 207c0-5 4-9 9-9s8 4 8 9l-2 7h-12l-3-7Z" fill="#EFB68D" />
        <path d="M362 206c0-7 5-12 11-12 5 0 8 4 8 9-5 1-8-1-10-4-2 4-5 6-9 7Z" fill="#29364A" />
        <path d="m365 215 12 1 4 27-19-2 3-26Z" fill="#FFF" />
        <path d="m364 240 15 1-1 25-8 2-2-17-5 17-8-2 9-26Z" fill="#26354A" />
        <path d="m366 219-9 12-8-3m21-5 10 8 6-6" stroke="#EFB68D" strokeWidth="4" strokeLinecap="round" />
      </g>
      <g fill="#F4B21B">
        <path d="m342 126 5-10 5 10 10 4-10 5-5 10-5-10-10-5 10-4Z" />
        <path d="m92 91 4-8 4 8 8 4-8 4-4 8-4-8-8-4 8-4Z" />
      </g>
    </svg>
  )
}

function Field({ label, name, type = 'text', value, onChange, placeholder, autoComplete, trailing, ...props }) {
  return (
    <label className="auth-field">
      <span>{label}</span>
      <div className="auth-input-wrap">
        <input
          className={inputClass}
          aria-label={label}
          name={name}
          type={type}
          value={value}
          onChange={onChange}
          placeholder={placeholder}
          autoComplete={autoComplete}
          {...props}
        />
        {trailing}
      </div>
    </label>
  )
}

function AuthForm({ path }) {
  const copy = pageCopy[path]
  const navigate = useNavigate()
  const [values, setValues] = useState({ name: '', email: '', password: '', confirmPassword: '' })
  const [showPassword, setShowPassword] = useState(false)
  const [message, setMessage] = useState('')
  const [error, setError] = useState('')

  useEffect(() => {
    setValues({ name: '', email: '', password: '', confirmPassword: '' })
    setShowPassword(false)
    setMessage('')
    setError('')
  }, [path])

  const update = (event) => {
    const { name, value } = event.target
    setValues((current) => ({ ...current, [name]: value }))
    setMessage('')
    setError('')
  }

  const submit = (event) => {
    event.preventDefault()
    setError('')
    setMessage('')

    if (path === '/register' && values.password !== values.confirmPassword) {
      setError('Your passwords don’t match. Please try again.')
      return
    }
    if (path === '/reset-password' && values.password !== values.confirmPassword) {
      setError('Your passwords don’t match. Please try again.')
      return
    }

    if (path === '/login') {
      sessionStorage.setItem('flower-authenticated', 'true')
      navigate('/')
      return
    }

    const success = {
      '/register': 'Your account details are ready. Welcome to Flower!',
      '/forgot-password': 'If that email is registered, a reset link is on its way.',
      '/reset-password': 'Your password has been updated for this demo.',
      '/lock-screen': 'Workspace unlocked. Welcome back!',
    }
    setMessage(success[path])
  }

  const passwordToggle = (name) => (
    <button
      type="button"
      className="auth-show-password"
      onClick={() => setShowPassword((visible) => !visible)}
      aria-label={showPassword ? 'Hide password' : 'Show password'}
    >
      {showPassword ? 'Hide' : 'Show'}
    </button>
  )

  const passwordField = (label, name, autocomplete) => (
    <Field
      label={label}
      name={name}
      type={showPassword ? 'text' : 'password'}
      value={values[name]}
      onChange={update}
      placeholder="••••••••"
      autoComplete={autocomplete}
      minLength={8}
      required
      trailing={passwordToggle(name)}
    />
  )

  return (
    <div className="auth-form-panel">
      <div className="auth-form-content">
        <p className="auth-eyebrow">{copy.eyebrow}</p>
        {(path === '/forgot-password' || path === '/reset-password') && (
          <div className="auth-lock-icon">
            <LockIllustration />
          </div>
        )}
        {path === '/lock-screen' && (
          <img className="auth-lock-avatar" src="/user-avatar.png" alt="Ronald Robertson" />
        )}
        <h1>{path === '/register' ? 'Create Account' : path === '/forgot-password' ? 'Recover Your Password' : path === '/reset-password' ? 'Reset Your Password' : copy.title}</h1>
        {path !== '/forgot-password' && path !== '/reset-password' && copy.description && <p className="auth-description">{copy.description}</p>}
        <form onSubmit={submit} noValidate={false}>
          {(path === '/login' || path === '/register') && (
            <>
              <button
                type="button"
                className="auth-google-button"
                onClick={() => setMessage(`Google ${path === '/login' ? 'sign-in' : 'sign-up'} is not connected in this demo.`)}
              >
                <svg viewBox="0 0 48 48" aria-hidden="true">
                  <path fill="#4285F4" d="M43.6 24.5c0-1.4-.1-2.8-.4-4.1H24v7.8h11a9.4 9.4 0 0 1-4.1 6.2v5.1h6.6c3.9-3.6 6.1-8.8 6.1-15Z" />
                  <path fill="#34A853" d="M24 44c5.5 0 10.1-1.8 13.5-4.8l-6.6-5.1c-1.8 1.2-4.1 2-6.9 2-5.3 0-9.8-3.6-11.4-8.4H5.8v5.3A20 20 0 0 0 24 44Z" />
                  <path fill="#FBBC05" d="M12.6 27.7a12 12 0 0 1 0-7.4V15H5.8a20 20 0 0 0 0 18Z" />
                  <path fill="#EA4335" d="M24 12.1c3 0 5.7 1 7.8 3.1l5.8-5.8C34.1 6.1 29.5 4 24 4A20 20 0 0 0 5.8 15l6.8 5.3c1.6-4.8 6.1-8.2 11.4-8.2Z" />
                </svg>
                <span>{path === '/login' ? 'Login with Google' : 'Sign Up with Google'}</span>
              </button>
              <div className="auth-or-divider"><span>{path === '/login' ? 'OR USE EMAIL' : 'OR SIGN UP WITH EMAIL'}</span></div>
            </>
          )}

          {path === '/register' && (
            <Field
              label="Full name"
              name="name"
              value={values.name}
              onChange={update}
              placeholder="Your name"
              autoComplete="name"
              required
              minLength={2}
            />
          )}

          {path !== '/lock-screen' && (
            <Field
              label={path === '/lock-screen' ? 'Email address' : 'Email address'}
              name="email"
              type="email"
              value={values.email}
              onChange={update}
              placeholder="you@example.com"
              autoComplete="email"
              required
            />
          )}

          {(path === '/login' || path === '/register' || path === '/lock-screen') &&
            passwordField('Password', 'password', path === '/login' ? 'current-password' : 'new-password')}

          {path === '/register' && passwordField('Confirm password', 'confirmPassword', 'new-password')}
          {path === '/reset-password' && passwordField('Password', 'password', 'new-password')}
          {(path === '/register' || path === '/reset-password') &&
            passwordField('Confirm Password', 'confirmPassword', 'new-password')}

          {path === '/login' && (
            <div className="auth-options">
              <label className="auth-check">
                <input type="checkbox" />
                <span>Remember me</span>
              </label>
              <Link to="/forgot-password">Forgot password?</Link>
            </div>
          )}

          {path === '/register' && (
            <label className="auth-check auth-terms">
              <input type="checkbox" required />
              <span>I agree to the <a href="#terms" onClick={(event) => event.preventDefault()}>Terms of Service</a> and Privacy Policy.</span>
            </label>
          )}

          {error && <p className="auth-feedback auth-error" role="alert">{error}</p>}
          {message && <p className="auth-feedback auth-success" role="status">{message}</p>}

          <button className="auth-submit" type="submit">
            {path === '/login' ? 'Log In' : path === '/register' ? 'Create Account' : path === '/forgot-password' ? 'Recover Password' : path === '/reset-password' ? 'Reset Password' : path === '/lock-screen' ? 'Unlock' : 'Submit'}
            {path !== '/login' && path !== '/reset-password' && path !== '/lock-screen' && <span aria-hidden="true">→</span>}
          </button>
        </form>

        <div className="auth-form-footer">
          {path === '/login' && <>Don’t have an account? <Link to="/register">Sign Up</Link></>}
          {path === '/register' && <>Already have an account? <Link to="/login">Sign in</Link></>}
          {path === '/forgot-password' && <>Go back to <Link to="/login">Login</Link></>}
          {path === '/reset-password' && <>Go back to <Link to="/login">Login</Link></>}
          {path === '/lock-screen' && <>Not you? <Link to="/login">Sign In</Link></>}
        </div>
      </div>
    </div>
  )
}

function NotFound({ variant }) {
  return (
    <main className={`auth-page ${variant ? 'auth-v2' : 'auth-v1'} auth-not-found`}>
      <style>{styles}</style>
      <div className="auth-shell">
        <div className="auth-not-found-card">
          <Brand />
          <div className="auth-404-number">404</div>
          <p className="auth-eyebrow">PAGE NOT FOUND</p>
          <h1>Looks like this page has wandered off.</h1>
          <p className="auth-description">The page you’re looking for doesn’t exist or may have moved. Let’s get you back on track.</p>
          <Link className="auth-submit auth-home-button" to="/login">Back to sign in <span aria-hidden="true">→</span></Link>
          <Link className="auth-home-link" to="/">Go to dashboard</Link>
        </div>
        {variant && (
          <aside className="auth-art-panel auth-404-art">
            <FlowerIllustration />
            <p className="auth-art-quote">Even the best gardens<br />have a path back.</p>
          </aside>
        )}
      </div>
    </main>
  )
}

const styles = `
  .auth-page {
    --auth-green: #176b3a;
    --auth-dark: #12472b;
    --auth-leaf: #eaf6eb;
    min-height: 100vh;
    width: 100%;
    display: flex;
    align-items: stretch;
    justify-content: center;
    padding: 32px;
    color: #17251b;
    background:
      radial-gradient(ellipse at 10% 6%, rgba(226, 244, 228, .8), transparent 31%),
      #f7faf7;
    font-family: 'Plus Jakarta Sans', 'Inter', ui-sans-serif, system-ui, sans-serif;
  }
  .auth-shell {
    width: min(1120px, 100%);
    min-height: min(760px, calc(100vh - 64px));
    display: grid;
    grid-template-columns: 1fr;
    overflow: hidden;
    border: 1px solid rgba(26, 75, 43, .08);
    border-radius: 28px;
    background: white;
    box-shadow: 0 26px 80px rgba(24, 56, 34, .10), 0 3px 10px rgba(24, 56, 34, .04);
  }
  .auth-v1 .auth-shell {
    width: min(520px, 100%);
    min-height: 0;
    align-self: center;
    padding: 42px 54px 38px;
  }
  .auth-content { position: relative; display: flex; min-width: 0; flex-direction: column; }
  .auth-v2 .auth-content { min-height: 100%; padding: 42px 12% 24px; }
  .auth-v2 .auth-content > .auth-brand { align-self: flex-start; }
  .auth-v2 .auth-form-panel { flex: 1; padding-left: 0; padding-right: 0; }
  .auth-legal { margin: auto 0 0; padding-top: 21px; color: #a3aca5; text-align: center; font-size: 9px; }
  .auth-legal span { padding: 0 5px; color: #c5ccc6; }
  .auth-brand {
    display: inline-flex;
    align-items: center;
    gap: 10px;
    color: #183c27;
    font-size: 22px;
    font-weight: 800;
    letter-spacing: -1.2px;
    text-decoration: none;
  }
  .auth-brand img { width: 34px; height: 34px; border-radius: 11px; object-fit: contain; }
  .auth-brand-dot { color: #2aa454; }
  .auth-form-panel {
    display: flex;
    align-items: center;
    justify-content: center;
    padding: 60px 9%;
  }
  .auth-v1 .auth-form-panel { padding: 30px 0 0; }
  .auth-form-content { width: min(100%, 400px); }
  .auth-eyebrow {
    margin: 0 0 10px;
    color: #398653;
    font-size: 10px;
    font-weight: 800;
    letter-spacing: 1.55px;
  }
  .auth-form-content h1, .auth-not-found-card h1 {
    margin: 0;
    color: #172b1e;
    font-size: clamp(24px, 3vw, 31px);
    line-height: 1.2;
    letter-spacing: -1.1px;
    font-weight: 800;
  }
  .auth-description {
    margin: 10px 0 27px;
    color: #78847c;
    font-size: 13px;
    line-height: 1.65;
  }
  .auth-field { display: block; margin: 0 0 17px; color: #36443a; font-size: 11px; font-weight: 700; }
  .auth-input-wrap { position: relative; margin-top: 7px; }
  .auth-input {
    display: block;
    width: 100%;
    height: 45px;
    padding: 0 14px;
    border: 1px solid #e4eae5;
    border-radius: 10px;
    background: #fff;
    color: #24372a;
    font: inherit;
    font-size: 12px;
    outline: none;
    transition: border-color .18s, box-shadow .18s;
  }
  .auth-input::placeholder { color: #b3bdb5; }
  .auth-input:focus { border-color: #69b47a; box-shadow: 0 0 0 3px rgba(57, 134, 83, .11); }
  .auth-show-password {
    position: absolute;
    top: 50%;
    right: 13px;
    transform: translateY(-50%);
    padding: 3px;
    border: 0;
    background: transparent;
    color: #63836c;
    font: inherit;
    font-size: 10px;
    font-weight: 700;
    cursor: pointer;
  }
  .auth-input-wrap:has(.auth-show-password) .auth-input { padding-right: 58px; }
  .auth-options { display: flex; align-items: center; justify-content: space-between; gap: 10px; margin: -1px 0 21px; }
  .auth-check { display: flex; align-items: flex-start; gap: 8px; color: #718077; font-size: 10px; line-height: 1.5; cursor: pointer; }
  .auth-check input { width: 14px; height: 14px; flex: 0 0 14px; margin: 0; accent-color: #238348; }
  .auth-options a, .auth-check a, .auth-form-footer a, .auth-home-link { color: #247a43; font-weight: 700; text-decoration: none; }
  .auth-options a { font-size: 10px; }
  .auth-options a:hover, .auth-form-footer a:hover, .auth-home-link:hover { text-decoration: underline; }
  .auth-terms { margin: 1px 0 18px; }
  .auth-locked-email { display: flex; align-items: center; gap: 9px; margin: -5px 0 17px; color: #768179; font-size: 11px; }
  .auth-avatar { display: inline-grid; width: 27px; height: 27px; place-items: center; border-radius: 50%; background: #edf7ef; color: #227d42; font-weight: 800; }
  .auth-feedback { margin: 0 0 14px; padding: 10px 12px; border-radius: 9px; font-size: 11px; line-height: 1.45; }
  .auth-error { border: 1px solid #f6d3d0; background: #fff6f5; color: #ae4238; }
  .auth-success { border: 1px solid #d5ebd9; background: #f2faf3; color: #267340; }
  .auth-submit {
    display: flex;
    width: 100%;
    min-height: 46px;
    align-items: center;
    justify-content: center;
    gap: 12px;
    border: 0;
    border-radius: 10px;
    background: #176b3a;
    color: white;
    font: inherit;
    font-size: 12px;
    font-weight: 800;
    text-decoration: none;
    cursor: pointer;
    box-shadow: 0 7px 14px rgba(23, 107, 58, .13);
    transition: background .18s, transform .18s, box-shadow .18s;
  }
  .auth-submit:hover { background: #12572f; box-shadow: 0 9px 18px rgba(23, 107, 58, .2); transform: translateY(-1px); }
  .auth-submit span { font-size: 16px; line-height: 1; }
  .auth-form-footer { margin-top: 22px; color: #89938b; text-align: center; font-size: 10px; }
  .auth-demo-note { margin: 15px 0 0; color: #9aa49c; text-align: center; font-size: 9px; line-height: 1.5; }
  .auth-page.auth-forgot-v1 {
    align-items: center;
    padding: 26px;
    background: #e8f2f3;
  }
  .auth-forgot-v1 .auth-shell {
    width: min(580px, 100%);
    min-height: 0;
    align-self: center;
    padding: 48px 62px 35px;
    border: 0;
    border-radius: 5px;
    box-shadow: 0 2px 12px rgba(37, 59, 63, .04);
  }
  .auth-forgot-v1 .auth-brand,
  .auth-forgot-v1 .auth-legal,
  .auth-forgot-v1 .auth-eyebrow,
  .auth-forgot-v1 .auth-description { display: none; }
  .auth-forgot-v1 .auth-form-panel { padding: 0; }
  .auth-forgot-v1 .auth-form-content { width: min(100%, 360px); margin: auto; }
  .auth-lock-icon {
    display: grid;
    width: 138px;
    height: 138px;
    margin: 0 auto 22px;
    place-items: center;
    border-radius: 50%;
    background: #f7f7f7;
  }
  .auth-lock-art { width: 76px; height: 76px; }
  .auth-forgot-v1 .auth-form-content h1 {
    margin-bottom: 28px;
    color: #444a52;
    text-align: center;
    font-size: 22px;
    font-weight: 600;
    letter-spacing: -.35px;
  }
  .auth-forgot-v1 .auth-field { margin-bottom: 17px; color: #879197; font-size: 10px; font-weight: 500; }
  .auth-forgot-v1 .auth-input-wrap { margin-top: 5px; }
  .auth-forgot-v1 .auth-input { height: 36px; border-radius: 9px; font-size: 10px; }
  .auth-forgot-v1 .auth-submit { min-height: 37px; border-radius: 5px; background: #199b43; font-size: 10px; box-shadow: none; }
  .auth-forgot-v1 .auth-submit:hover { background: #14863a; box-shadow: none; transform: none; }
  .auth-forgot-v1 .auth-form-footer { margin-top: 48px; }
  .auth-page.auth-reset-v1 {
    align-items: center;
    padding: 26px;
    background: #e8f2f3;
  }
  .auth-reset-v1 .auth-shell {
    width: min(374px, 100%);
    min-height: 536px;
    align-self: center;
    padding: 49px 48px 31px;
    border: 0;
    border-radius: 5px;
    box-shadow: 0 2px 12px rgba(37, 59, 63, .04);
  }
  .auth-reset-v1 .auth-brand,
  .auth-reset-v1 .auth-legal,
  .auth-reset-v1 .auth-eyebrow,
  .auth-reset-v1 .auth-description { display: none; }
  .auth-reset-v1 .auth-form-panel { padding: 0; }
  .auth-reset-v1 .auth-form-content { width: 100%; margin: auto; }
  .auth-reset-v1 .auth-lock-icon { width: 138px; height: 138px; margin: 0 auto 25px; }
  .auth-reset-v1 .auth-lock-art { width: 96px; height: 96px; }
  .auth-reset-v1 .auth-form-content h1 {
    margin-bottom: 27px;
    color: #444a52;
    text-align: center;
    font-size: 17px;
    font-weight: 600;
    letter-spacing: -.3px;
    white-space: nowrap;
  }
  .auth-reset-v1 .auth-field { margin-bottom: 15px; color: #879197; font-size: 9px; font-weight: 500; }
  .auth-reset-v1 .auth-input-wrap { margin-top: 5px; }
  .auth-reset-v1 .auth-input { height: 27px; padding: 0 10px; border-radius: 9px; font-size: 9px; }
  .auth-reset-v1 .auth-show-password { right: 8px; font-size: 0; }
  .auth-reset-v1 .auth-show-password::after { content: '◉'; color: #59636c; font-size: 11px; }
  .auth-reset-v1 .auth-input-wrap:has(.auth-show-password) .auth-input { padding-right: 31px; }
  .auth-reset-v1 .auth-feedback { margin-bottom: 12px; font-size: 9px; }
  .auth-reset-v1 .auth-submit { min-height: 25px; margin-top: 0; border-radius: 5px; background: #199b43; font-size: 9px; box-shadow: none; }
  .auth-reset-v1 .auth-submit:hover { background: #14863a; box-shadow: none; transform: none; }
  .auth-reset-v1 .auth-form-footer { margin-top: 47px; font-size: 8px; }
  .auth-page.auth-lock-v1 {
    align-items: center;
    padding: 26px;
    background: #e8f2f3;
  }
  .auth-lock-v1 .auth-shell {
    width: min(374px, 100%);
    min-height: 430px;
    align-self: center;
    padding: 49px 60px 29px;
    border: 0;
    border-radius: 5px;
    box-shadow: 0 2px 12px rgba(37, 59, 63, .04);
  }
  .auth-lock-v1 .auth-brand,
  .auth-lock-v1 .auth-legal,
  .auth-lock-v1 .auth-eyebrow { display: none; }
  .auth-lock-v1 .auth-form-panel { padding: 0; }
  .auth-lock-v1 .auth-form-content { width: 100%; margin: auto; }
  .auth-lock-avatar {
    display: block;
    width: 138px;
    height: 138px;
    margin: 0 auto 15px;
    border-radius: 50%;
    object-fit: cover;
  }
  .auth-lock-v1 .auth-form-content h1 {
    margin-bottom: 6px;
    color: #444a52;
    text-align: center;
    font-size: 17px;
    font-weight: 600;
    letter-spacing: -.3px;
  }
  .auth-lock-v1 .auth-description {
    display: block;
    margin: 0 0 28px;
    color: #879197;
    text-align: center;
    font-size: 9px;
    line-height: 1.6;
  }
  .auth-lock-v1 .auth-field { margin-bottom: 15px; color: #879197; font-size: 9px; font-weight: 500; }
  .auth-lock-v1 .auth-input-wrap { margin-top: 5px; }
  .auth-lock-v1 .auth-input { height: 27px; padding: 0 10px; border-radius: 9px; font-size: 9px; }
  .auth-lock-v1 .auth-show-password { right: 8px; font-size: 0; }
  .auth-lock-v1 .auth-show-password::after { content: '◉'; color: #59636c; font-size: 11px; }
  .auth-lock-v1 .auth-input-wrap:has(.auth-show-password) .auth-input { padding-right: 31px; }
  .auth-lock-v1 .auth-feedback { margin-bottom: 12px; font-size: 9px; }
  .auth-lock-v1 .auth-submit { min-height: 25px; border-radius: 5px; background: #199b43; font-size: 9px; box-shadow: none; }
  .auth-lock-v1 .auth-submit:hover { background: #14863a; box-shadow: none; transform: none; }
  .auth-lock-v1 .auth-form-footer { margin-top: 47px; font-size: 8px; }
  .auth-art-panel {
    position: relative;
    display: flex;
    flex-direction: column;
    align-items: center;
    justify-content: center;
    min-height: 100%;
    overflow: hidden;
    padding: 44px;
    background:
      radial-gradient(ellipse at 54% 43%, rgba(87, 171, 102, .55), transparent 43%),
      linear-gradient(150deg, #1d7541 0%, #14532f 56%, #0c4328 100%);
    color: white;
  }
  .auth-art-panel::before, .auth-art-panel::after {
    position: absolute;
    width: 340px;
    height: 340px;
    border: 1px solid rgba(255,255,255,.1);
    border-radius: 50%;
    content: '';
  }
  .auth-art-panel::before { top: -190px; right: -140px; }
  .auth-art-panel::after { bottom: -220px; left: -140px; width: 410px; height: 410px; }
  .auth-v2 .auth-shell { grid-template-columns: 1.05fr .95fr; }
  .auth-v2 .auth-art-panel { grid-column: 1; grid-row: 1; }
  .auth-v2 .auth-form-panel { grid-column: 2; grid-row: 1; }
  .auth-art-copy { position: relative; z-index: 1; width: min(100%, 400px); text-align: center; }
  .auth-art-kicker { margin: 0 0 10px; color: #c9ebce; font-size: 10px; font-weight: 800; letter-spacing: 1.6px; }
  .auth-art-copy h2 { margin: 0; font-size: clamp(23px, 3vw, 32px); letter-spacing: -1px; line-height: 1.18; }
  .auth-art-copy p:last-child { margin: 12px 0 0; color: #d3e9d8; font-size: 12px; line-height: 1.7; }
  .auth-flower-art { position: relative; z-index: 1; width: min(100%, 465px); height: auto; margin: -18px 0 8px; overflow: visible; }
  .auth-art-quote { position: relative; z-index: 1; margin: 0; color: #e0f1e3; text-align: center; font-size: 13px; line-height: 1.7; }
  .auth-not-found .auth-shell { grid-template-columns: 1fr; align-self: center; min-height: 0; }
  .auth-not-found-card { max-width: 470px; margin: auto; padding: 53px 42px; text-align: center; }
  .auth-not-found-card .auth-brand { margin-bottom: 25px; }
  .auth-404-number { margin: 5px 0 -4px; color: #d9eedc; font-size: clamp(88px, 17vw, 144px); font-weight: 900; letter-spacing: -12px; line-height: .95; }
  .auth-not-found-card .auth-eyebrow { margin-top: 23px; }
  .auth-not-found-card h1 { font-size: 26px; }
  .auth-not-found-card .auth-description { margin-bottom: 24px; }
  .auth-home-link { display: inline-block; margin-top: 17px; font-size: 10px; }
  .auth-home-button { max-width: 270px; margin: auto; }
  .auth-page.auth-login-v1 {
    align-items: center;
    padding: 26px;
    background: #e8f2f3;
  }
  .auth-login-v1 .auth-shell {
    width: min(360px, 100%);
    min-height: 0;
    align-self: center;
    padding: 28px 30px 24px;
    border: 0;
    border-radius: 4px;
    box-shadow: 0 2px 12px rgba(37, 59, 63, .04);
  }
  .auth-login-v1 .auth-brand,
  .auth-login-v1 .auth-legal,
  .auth-login-v1 .auth-eyebrow,
  .auth-login-v1 .auth-description { display: none; }
  .auth-login-v1 .auth-form-panel { padding: 0; }
  .auth-login-v1 .auth-form-content { width: 100%; }
  .auth-login-v1 .auth-form-content h1 {
    margin-bottom: 17px;
    color: #252b31;
    text-align: center;
    font-size: 16px;
    font-weight: 600;
    letter-spacing: -.25px;
  }
  .auth-google-button {
    position: relative;
    display: flex;
    width: 100%;
    height: 34px;
    align-items: center;
    justify-content: center;
    border: 1px solid #e7eaec;
    border-radius: 6px;
    background: white;
    color: #59636c;
    font: inherit;
    font-size: 10px;
    cursor: pointer;
  }
  .auth-google-button:hover { background: #fafbfb; border-color: #d8dfe1; }
  .auth-google-button svg { position: absolute; left: 10px; width: 13px; height: 13px; }
  .auth-or-divider {
    display: flex;
    align-items: center;
    gap: 9px;
    margin: 15px 0;
    color: #a0a8ac;
    font-size: 8px;
    white-space: nowrap;
  }
  .auth-or-divider::before,
  .auth-or-divider::after { height: 1px; flex: 1; background: #edf0f0; content: ''; }
  .auth-login-v1 .auth-field { margin-bottom: 12px; color: #879197; font-size: 9px; font-weight: 500; }
  .auth-login-v1 .auth-input-wrap { margin-top: 4px; }
  .auth-login-v1 .auth-input {
    height: 33px;
    padding: 0 10px;
    border-color: #e8ebed;
    border-radius: 7px;
    color: #44505a;
    font-size: 9px;
  }
  .auth-login-v1 .auth-show-password { right: 8px; font-size: 9px; }
  .auth-login-v1 .auth-input-wrap:has(.auth-show-password) .auth-input { padding-right: 42px; }
  .auth-login-v1 .auth-options { margin: -1px 0 13px; }
  .auth-login-v1 .auth-check { align-items: center; gap: 5px; font-size: 8px; }
  .auth-login-v1 .auth-check input { width: 11px; height: 11px; flex-basis: 11px; }
  .auth-login-v1 .auth-options a { font-size: 8px; }
  .auth-login-v1 .auth-submit {
    min-height: 34px;
    border-radius: 5px;
    background: #199b43;
    font-size: 9px;
    box-shadow: none;
  }
  .auth-login-v1 .auth-submit:hover { background: #14863a; box-shadow: none; transform: none; }
  .auth-login-v1 .auth-form-footer { margin-top: 21px; font-size: 8px; }
  .auth-login-v1 .auth-success,
  .auth-login-v1 .auth-error { font-size: 9px; }
  .auth-page.auth-login-v2 {
    align-items: center;
    padding: 26px;
    background: #e6e6e6;
  }
  .auth-login-v2 .auth-shell {
    width: min(1120px, 100%);
    min-height: min(760px, calc(100vh - 52px));
    grid-template-columns: 1fr 1fr;
    gap: 0;
    align-self: center;
    padding: 22px;
    border: 0;
    border-radius: 0;
    background: #20963e;
    box-shadow: none;
  }
  .auth-login-v2 .auth-art-panel {
    grid-column: 1;
    grid-row: 1;
    min-height: 0;
    justify-content: center;
    padding: 28px 20px;
    background: transparent;
  }
  .auth-login-art { position: relative; z-index: 1; width: min(100%, 440px); height: auto; }
  .auth-login-v2 .auth-art-copy,
  .auth-login-v2 .auth-art-quote { display: none; }
  .auth-login-v2 .auth-content {
    grid-column: 2;
    grid-row: 1;
    align-self: stretch;
    min-height: 0;
    justify-content: center;
    margin: 0;
    padding: 32px clamp(18px, 7%, 76px);
    border-radius: 5px;
    background: white;
  }
  .auth-login-v2 .auth-content > .auth-brand,
  .auth-login-v2 .auth-legal { display: none; }
  .auth-login-v2 .auth-form-panel { flex: initial; padding: 0; }
  .auth-login-v2 .auth-form-content { width: min(100%, 360px); }
  .auth-login-v2 .auth-form-content h1 {
    margin-bottom: 24px;
    color: #252b31;
    text-align: center;
    font-size: 19px;
    font-weight: 600;
    letter-spacing: -.35px;
  }
  .auth-login-v2 .auth-google-button { height: 38px; }
  .auth-login-v2 .auth-field { margin-bottom: 15px; }
  .auth-login-v2 .auth-input { height: 39px; }
  .auth-login-v2 .auth-options { margin-bottom: 19px; }
  .auth-login-v2 .auth-submit { min-height: 39px; border-radius: 5px; background: #199b43; box-shadow: none; }
  .auth-login-v2 .auth-submit:hover { background: #14863a; box-shadow: none; transform: none; }
  .auth-login-v2 .auth-form-footer { margin-top: 24px; }
  .auth-page.auth-register-v2 {
    align-items: center;
    padding: 26px;
    background: #e6e6e6;
  }
  .auth-register-v2 .auth-shell {
    width: min(1120px, 100%);
    min-height: min(760px, calc(100vh - 52px));
    grid-template-columns: 1.2fr 1fr;
    gap: 0;
    align-self: center;
    padding: 22px;
    border: 0;
    border-radius: 0;
    background: #20963e;
    box-shadow: none;
  }
  .auth-register-v2 .auth-art-panel {
    grid-column: 1;
    grid-row: 1;
    min-height: 0;
    justify-content: center;
    padding: 24px;
    background: transparent;
  }
  .auth-register-v2 .auth-login-art { width: min(100%, 520px); }
  .auth-register-v2 .auth-art-copy,
  .auth-register-v2 .auth-art-quote { display: none; }
  .auth-register-v2 .auth-content {
    grid-column: 2;
    grid-row: 1;
    align-self: stretch;
    min-height: 0;
    justify-content: center;
    margin: 0;
    padding: 30px clamp(24px, 7%, 72px);
    border-radius: 5px;
    background: white;
  }
  .auth-register-v2 .auth-content > .auth-brand,
  .auth-register-v2 .auth-legal { display: none; }
  .auth-register-v2 .auth-form-panel { flex: initial; padding: 0; }
  .auth-register-v2 .auth-form-content { width: min(100%, 360px); }
  .auth-register-v2 .auth-eyebrow,
  .auth-register-v2 .auth-description { display: none; }
  .auth-register-v2 .auth-form-content h1 {
    margin-bottom: 18px;
    color: #41464e;
    text-align: center;
    font-size: 22px;
    font-weight: 600;
    letter-spacing: -.35px;
  }
  .auth-register-v2 .auth-google-button { height: 34px; }
  .auth-register-v2 .auth-or-divider { margin: 12px 0; }
  .auth-register-v2 .auth-field { margin-bottom: 10px; color: #8b949d; font-size: 10px; font-weight: 500; }
  .auth-register-v2 .auth-input-wrap { margin-top: 5px; }
  .auth-register-v2 .auth-input { height: 32px; border-radius: 9px; font-size: 10px; }
  .auth-register-v2 .auth-show-password { font-size: 0; }
  .auth-register-v2 .auth-show-password::after { content: '◉'; font-size: 12px; }
  .auth-register-v2 .auth-input-wrap:has(.auth-show-password) .auth-input { padding-right: 36px; }
  .auth-register-v2 .auth-terms { margin: 2px 0 12px; font-size: 9px; }
  .auth-register-v2 .auth-submit { min-height: 34px; border-radius: 5px; background: #199b43; box-shadow: none; }
  .auth-register-v2 .auth-submit:hover { background: #14863a; box-shadow: none; transform: none; }
  .auth-register-v2 .auth-form-footer { margin-top: 28px; }
  .auth-v2.auth-not-found .auth-shell { grid-template-columns: 1fr 1fr; }
  .auth-v2 .auth-404-art { grid-column: 2; grid-row: 1; }
  .auth-v2.auth-not-found .auth-not-found-card { grid-column: 1; grid-row: 1; }
  @media (max-width: 760px) {
    .auth-page { padding: 16px; }
    .auth-shell { min-height: calc(100vh - 32px); border-radius: 22px; }
    .auth-v2 .auth-shell, .auth-v2.auth-not-found .auth-shell { grid-template-columns: 1fr; }
    .auth-v2 .auth-art-panel { grid-column: 1; grid-row: 1; min-height: 245px; padding: 18px 24px; }
    .auth-v2 .auth-flower-art { width: 185px; height: 150px; margin: -12px 0 -18px; }
    .auth-art-copy { padding: 0; }
    .auth-art-copy h2 { font-size: 21px; }
    .auth-art-copy p:last-child { margin-top: 6px; font-size: 10px; }
    .auth-v2 .auth-form-panel { grid-column: 1; grid-row: 2; padding: 36px 28px 40px; }
    .auth-v2.auth-not-found .auth-not-found-card { grid-column: 1; grid-row: 1; padding: 38px 26px; }
    .auth-v2 .auth-404-art { grid-column: 1; grid-row: 2; min-height: 230px; }
    .auth-login-v2.auth-page { padding: 10px; }
    .auth-login-v2 .auth-shell {
      height: calc(100dvh - 20px);
      min-height: 0;
      grid-template-columns: 1fr 1fr;
      padding: 10px;
    }
    .auth-login-v2 .auth-art-panel { grid-column: 1; grid-row: 1; min-height: 0; padding: 6px; }
    .auth-login-v2 .auth-login-art { width: 100%; }
    .auth-login-v2 .auth-content { grid-column: 2; grid-row: 1; min-height: 0; padding: 10px; }
    .auth-login-v2 .auth-eyebrow { display: none; }
    .auth-login-v2 .auth-form-content h1 { margin-bottom: 9px; font-size: clamp(11px, 2.8vw, 16px); }
    .auth-login-v2 .auth-google-button { height: 25px; font-size: 7px; }
    .auth-login-v2 .auth-google-button svg { left: 6px; width: 10px; height: 10px; }
    .auth-login-v2 .auth-or-divider { margin: 7px 0; font-size: 5px; }
    .auth-login-v2 .auth-field { margin-bottom: 6px; font-size: 7px; }
    .auth-login-v2 .auth-input { height: 23px; padding: 0 6px; font-size: 7px; }
    .auth-login-v2 .auth-show-password { right: 5px; font-size: 7px; }
    .auth-login-v2 .auth-input-wrap:has(.auth-show-password) .auth-input { padding-right: 33px; }
    .auth-login-v2 .auth-options { gap: 3px; margin: 0 0 7px; }
    .auth-login-v2 .auth-check,
    .auth-login-v2 .auth-options a { gap: 3px; font-size: 6px; }
    .auth-login-v2 .auth-check input { width: 9px; height: 9px; flex-basis: 9px; }
    .auth-login-v2 .auth-submit { min-height: 23px; font-size: 7px; }
    .auth-login-v2 .auth-form-footer { margin-top: 10px; font-size: 6px; }
    .auth-register-v2.auth-page { padding: 10px; }
    .auth-register-v2 .auth-shell {
      height: calc(100dvh - 20px);
      min-height: 0;
      grid-template-columns: 1.05fr 1fr;
      padding: 10px;
    }
    .auth-register-v2 .auth-art-panel { grid-column: 1; grid-row: 1; min-height: 0; padding: 6px; }
    .auth-register-v2 .auth-login-art { width: 100%; }
    .auth-register-v2 .auth-content { grid-column: 2; grid-row: 1; min-height: 0; padding: 10px; }
    .auth-register-v2 .auth-form-content h1 { margin-bottom: 10px; font-size: clamp(11px, 2.8vw, 17px); }
    .auth-register-v2 .auth-google-button { height: 24px; font-size: 7px; }
    .auth-register-v2 .auth-google-button svg { left: 6px; width: 10px; height: 10px; }
    .auth-register-v2 .auth-or-divider { gap: 4px; margin: 6px 0; font-size: 5px; }
    .auth-register-v2 .auth-field { margin-bottom: 5px; font-size: 7px; }
    .auth-register-v2 .auth-input-wrap { margin-top: 3px; }
    .auth-register-v2 .auth-input { height: 22px; padding: 0 6px; font-size: 7px; }
    .auth-register-v2 .auth-show-password { right: 5px; }
    .auth-register-v2 .auth-show-password::after { font-size: 9px; }
    .auth-register-v2 .auth-input-wrap:has(.auth-show-password) .auth-input { padding-right: 24px; }
    .auth-register-v2 .auth-terms { gap: 3px; margin: 3px 0 7px; font-size: 6px; }
    .auth-register-v2 .auth-check input { width: 9px; height: 9px; flex-basis: 9px; }
    .auth-register-v2 .auth-submit { min-height: 23px; font-size: 7px; }
    .auth-register-v2 .auth-form-footer { margin-top: 12px; font-size: 6px; }
    .auth-v1 .auth-shell { min-height: 0; padding: 33px 28px 30px; }
    .auth-login-v1 .auth-shell { padding: 28px 26px 23px; }
    .auth-forgot-v1.auth-page { padding: 16px; }
    .auth-forgot-v1 .auth-shell { width: min(580px, 100%); padding: 36px 34px 28px; }
    .auth-reset-v1.auth-page { padding: 16px; }
    .auth-reset-v1 .auth-shell { min-height: 0; padding: 36px 34px 28px; }
    .auth-lock-v1.auth-page { padding: 16px; }
    .auth-lock-v1 .auth-shell { min-height: 0; padding: 36px 34px 28px; }
    .auth-not-found .auth-shell { min-height: 0; }
  }
  @media (max-width: 420px) {
    .auth-page { padding: 10px; }
    .auth-shell { min-height: calc(100vh - 20px); }
    .auth-v1 .auth-shell { padding: 26px 21px; }
    .auth-login-v1 .auth-shell { padding: 25px 22px 21px; }
    .auth-forgot-v1 .auth-shell { padding: 31px 22px 25px; }
    .auth-reset-v1 .auth-shell { padding: 31px 22px 25px; }
    .auth-lock-v1 .auth-shell { padding: 31px 22px 25px; }
    .auth-lock-avatar { width: 112px; height: 112px; margin-bottom: 18px; }
    .auth-lock-v1 .auth-form-content h1 { font-size: 16px; }
    .auth-lock-v1 .auth-description { margin-bottom: 23px; }
    .auth-lock-v1 .auth-form-footer { margin-top: 35px; }
    .auth-reset-v1 .auth-lock-icon { width: 112px; height: 112px; margin-bottom: 18px; }
    .auth-reset-v1 .auth-lock-art { width: 78px; height: 78px; }
    .auth-reset-v1 .auth-form-content h1 { margin-bottom: 23px; font-size: 16px; }
    .auth-reset-v1 .auth-form-footer { margin-top: 35px; }
    .auth-lock-icon { width: 112px; height: 112px; margin-bottom: 18px; }
    .auth-lock-art { width: 64px; height: 64px; }
    .auth-forgot-v1 .auth-form-content h1 { margin-bottom: 23px; font-size: 19px; }
    .auth-forgot-v1 .auth-form-footer { margin-top: 35px; }
    .auth-v2 .auth-form-panel { padding: 28px 21px 31px; }
    .auth-not-found-card { padding: 37px 23px; }
    .auth-options { align-items: flex-start; }
  }
`

export default function AuthPages() {
  const { pathname, search } = useLocation()
  const variant = new URLSearchParams(search).get('variant') === '2'

  if (pathname === '/404') return <NotFound variant={variant} />
  if (!pageCopy[pathname]) return <NotFound variant={variant} />

  return (
    <main className={`auth-page ${variant ? 'auth-v2' : 'auth-v1'} ${pathname === '/login' ? (variant ? 'auth-login-v2' : 'auth-login-v1') : ''} ${pathname === '/register' && variant ? 'auth-register-v2' : ''} ${pathname === '/forgot-password' && !variant ? 'auth-forgot-v1' : ''} ${pathname === '/reset-password' && !variant ? 'auth-reset-v1' : ''} ${pathname === '/lock-screen' && !variant ? 'auth-lock-v1' : ''}`}>
      <style>{styles}</style>
      <div className="auth-shell">
        {variant && (
          <aside className="auth-art-panel">
            {pathname === '/login' || pathname === '/register' ? (
              <LoginIllustration />
            ) : (
              <>
                <div className="auth-art-copy">
                  <p className="auth-art-kicker">A LITTLE ROOM TO GROW</p>
                  <h2>Make space for<br />wonderful things.</h2>
                  <p>Your ideas, your work, and your next big thing — all in one beautiful place.</p>
                </div>
                <FlowerIllustration />
                <p className="auth-art-quote">Grow at your own pace. We’ll be here.</p>
              </>
            )}
          </aside>
        )}
        <section className="auth-content">
          <Brand />
          <AuthForm path={pathname} />
          <p className="auth-legal">© 2025 Flower Studio <span>·</span> Made for growing</p>
        </section>
      </div>
    </main>
  )
}

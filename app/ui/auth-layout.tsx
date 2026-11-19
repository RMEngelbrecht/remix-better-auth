import type { Handle, RemixNode } from 'remix/component'
import { css } from 'remix/component'

import { Document } from '../actions/document.tsx'

const FONT_STACK =
  "ui-sans-serif, system-ui, -apple-system, 'Segoe UI', Roboto, 'Helvetica Neue', Arial, sans-serif"

const pageStyle = css({
  '--surface-0': '#dee2e6',
  '--surface-1': '#f7fbff',
  '--border': '#c4c9ce',
  '--text-primary': '#313539',
  '--text-secondary': '#5f6469',
  '--brand-blue': '#2dacf9',
  '--danger': '#c92a2a',
  '@media (prefers-color-scheme: dark)': {
    '--surface-0': '#1e2226',
    '--surface-1': '#2a2e32',
    '--border': '#43484d',
    '--text-primary': '#dee2e6',
    '--text-secondary': '#a3a8ad',
    '--danger': '#ff6b6b',
  },
  '& *, & *::before, & *::after': { boxSizing: 'border-box' },
  minHeight: '100vh',
  margin: 0,
  padding: '48px 16px',
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'center',
  background: 'var(--surface-0)',
  color: 'var(--text-primary)',
  fontFamily: FONT_STACK,
  fontSize: '15px',
  lineHeight: 1.5,
})

const cardStyle = css({
  width: '100%',
  maxWidth: '400px',
  padding: '32px',
  borderRadius: '12px',
  background: 'var(--surface-1)',
  border: '1px solid var(--border)',
  display: 'flex',
  flexDirection: 'column',
  gap: '20px',
  '& h1': { margin: 0, fontSize: '22px' },
  '& p': { margin: 0 },
  '& a': { color: 'var(--brand-blue)' },
})

export interface AuthLayoutProps {
  title: string
  children?: RemixNode
}

/** Centered card layout shared by the login, signup, and dashboard pages. */
export function AuthLayout(handle: Handle<AuthLayoutProps>) {
  return () => {
    let { title, children } = handle.props
    return (
      <Document title={title}>
        <main mix={pageStyle}>
          <div mix={cardStyle}>
            <h1>{title}</h1>
            {children}
          </div>
        </main>
      </Document>
    )
  }
}

export const formStyle = css({
  display: 'flex',
  flexDirection: 'column',
  gap: '14px',
  '& label': {
    display: 'flex',
    flexDirection: 'column',
    gap: '4px',
    fontSize: '13px',
    fontWeight: 600,
  },
  '& input': {
    font: 'inherit',
    fontWeight: 400,
    padding: '8px 10px',
    borderRadius: '6px',
    border: '1px solid var(--border)',
    background: 'var(--surface-0)',
    color: 'var(--text-primary)',
  },
})

export const buttonStyle = css({
  font: 'inherit',
  fontWeight: 600,
  padding: '9px 14px',
  border: 0,
  borderRadius: '6px',
  background: 'var(--brand-blue)',
  color: '#fff',
  cursor: 'pointer',
  '&:hover': { filter: 'brightness(1.05)' },
})

export const mutedStyle = css({ color: 'var(--text-secondary)', fontSize: '14px' })

export interface FormErrorProps {
  message?: string | null
}

export function FormError(handle: Handle<FormErrorProps>) {
  return () => {
    let { message } = handle.props
    if (!message) return null
    return (
      <p role="alert" mix={css({ color: 'var(--danger)', fontSize: '14px' })}>
        {message}
      </p>
    )
  }
}

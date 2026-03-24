/**
 * Frontend component test for App.tsx (Coming Soon / waitlist page).
 *
 * SETUP REQUIRED (one-time) — these packages are not yet in package.json:
 *
 *   cd frontend
 *   npm install --save-dev vitest @vitest/coverage-v8 \
 *     @testing-library/react @testing-library/user-event \
 *     @testing-library/jest-dom jsdom
 *
 * Then add the following to frontend/vite.config.ts (or create it):
 *
 *   import { defineConfig } from 'vite'
 *   import react from '@vitejs/plugin-react'
 *
 *   export default defineConfig({
 *     plugins: [react()],
 *     test: {
 *       globals: true,
 *       environment: 'jsdom',
 *       setupFiles: ['./src/setupTests.ts'],
 *     },
 *   })
 *
 * And create frontend/src/setupTests.ts with:
 *
 *   import '@testing-library/jest-dom'
 *
 * Add a test script to frontend/package.json:
 *
 *   "test": "vitest run",
 *   "test:watch": "vitest"
 *
 * These tests will NOT run until those steps are completed. They are written
 * in anticipation of that setup so no production code needs to change.
 *
 * ---------------------------------------------------------------------------
 * What is tested
 * ---------------------------------------------------------------------------
 * 1. Page renders with the Georgian tagline visible
 * 2. Submit with empty email shows the bilingual error message
 * 3. Submit with valid email shows loading state then success message
 * 4. Submit duplicate email (API 409) shows the bilingual conflict message
 * 5. Network error shows the bilingual network-error message
 * 6. Email input is accessible (aria-label present)
 * 7. Button is disabled while loading
 */

import { render, screen, waitFor } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { beforeEach, describe, expect, it, vi } from 'vitest'
import App from './App'

// ---------------------------------------------------------------------------
// Helpers
// ---------------------------------------------------------------------------

/**
 * Build a minimal Response-like object that satisfies what App.tsx reads:
 *   res.status, res.ok, res.status === 409
 */
function mockFetchResponse(status: number, body: unknown = {}): Response {
  return {
    status,
    ok: status >= 200 && status < 300,
    json: () => Promise.resolve(body),
  } as unknown as Response
}

// ---------------------------------------------------------------------------
// Suite
// ---------------------------------------------------------------------------

describe('App — Coming Soon page', () => {
  beforeEach(() => {
    vi.restoreAllMocks()
  })

  // -------------------------------------------------------------------------
  // Initial render
  // -------------------------------------------------------------------------

  describe('Initial render', () => {
    it('renders the Georgian tagline', () => {
      render(<App />)
      expect(
        screen.getByText('გახადე შენი შვილი ქართული ზღაპრის გმირად'),
      ).toBeInTheDocument()
    })

    it('renders the English tagline', () => {
      render(<App />)
      expect(
        screen.getByText('Turn your child into the hero of their own Georgian fairy tale'),
      ).toBeInTheDocument()
    })

    it('renders the email input with the correct aria-label', () => {
      render(<App />)
      expect(screen.getByLabelText('Email address')).toBeInTheDocument()
    })

    it('renders the submit button in its default (not loading) state', () => {
      render(<App />)
      // The button text includes a Georgian segment; query by partial text
      const button = screen.getByRole('button')
      expect(button).not.toBeDisabled()
      // Should not show loading indicator
      expect(button.textContent).not.toBe('...')
    })

    it('does not show a success message on initial render', () => {
      render(<App />)
      expect(screen.queryByText(/გმადლობთ/)).not.toBeInTheDocument()
    })
  })

  // -------------------------------------------------------------------------
  // Validation: empty email
  // -------------------------------------------------------------------------

  describe('Form validation — empty email', () => {
    it('shows a bilingual error when the form is submitted with no email entered', async () => {
      const user = userEvent.setup()
      render(<App />)

      await user.click(screen.getByRole('button'))

      expect(
        await screen.findByText(
          'გთხოვთ შეიყვანოთ ელ-ფოსტა / Please enter your email',
        ),
      ).toBeInTheDocument()
    })

    it('does not call fetch when email is empty', async () => {
      const user = userEvent.setup()
      const fetchSpy = vi.spyOn(global, 'fetch')
      render(<App />)

      await user.click(screen.getByRole('button'))

      expect(fetchSpy).not.toHaveBeenCalled()
    })
  })

  // -------------------------------------------------------------------------
  // Happy path: valid email → loading → success
  // -------------------------------------------------------------------------

  describe('Happy path — valid email submission', () => {
    it('disables the button and shows "..." while the request is in flight', async () => {
      // Use a promise that we control so we can assert the loading state before it resolves
      let resolveRequest!: (value: Response) => void
      const pendingRequest = new Promise<Response>((res) => {
        resolveRequest = res
      })

      vi.spyOn(global, 'fetch').mockReturnValueOnce(pendingRequest)

      const user = userEvent.setup()
      render(<App />)

      await user.type(screen.getByLabelText('Email address'), 'test@example.com')
      await user.click(screen.getByRole('button'))

      // Loading state: button text should be "..."
      expect(screen.getByRole('button')).toBeDisabled()
      expect(screen.getByRole('button').textContent).toBe('...')

      // Resolve the request so the component can finish
      resolveRequest(mockFetchResponse(201))
    })

    it('shows the Georgian+English thank-you message after a successful 201 response', async () => {
      vi.spyOn(global, 'fetch').mockResolvedValueOnce(mockFetchResponse(201))

      const user = userEvent.setup()
      render(<App />)

      await user.type(screen.getByLabelText('Email address'), 'success@example.com')
      await user.click(screen.getByRole('button'))

      expect(await screen.findByText(/გმადლობთ/)).toBeInTheDocument()
      expect(await screen.findByText(/Thank you/)).toBeInTheDocument()
    })

    it('hides the form after successful submission', async () => {
      vi.spyOn(global, 'fetch').mockResolvedValueOnce(mockFetchResponse(201))

      const user = userEvent.setup()
      render(<App />)

      await user.type(screen.getByLabelText('Email address'), 'success2@example.com')
      await user.click(screen.getByRole('button'))

      await waitFor(() => {
        expect(screen.queryByLabelText('Email address')).not.toBeInTheDocument()
      })
    })

    it('calls fetch with the correct endpoint, method, headers, and trimmed email', async () => {
      const fetchSpy = vi
        .spyOn(global, 'fetch')
        .mockResolvedValueOnce(mockFetchResponse(201))

      const user = userEvent.setup()
      render(<App />)

      await user.type(screen.getByLabelText('Email address'), '  padded@example.com  ')
      await user.click(screen.getByRole('button'))

      await screen.findByText(/გმადლობთ/)

      expect(fetchSpy).toHaveBeenCalledTimes(1)
      const [url, options] = fetchSpy.mock.calls[0] as [string, RequestInit]
      expect(url).toContain('/waitlist')
      expect(options.method).toBe('POST')
      expect(options.headers).toMatchObject({ 'Content-Type': 'application/json' })
      // The component trims the email before sending
      const sent = JSON.parse(options.body as string) as { email: string }
      expect(sent.email).toBe('padded@example.com')
    })
  })

  // -------------------------------------------------------------------------
  // Duplicate email — 409
  // -------------------------------------------------------------------------

  describe('Duplicate email — 409 Conflict', () => {
    it('shows a bilingual already-registered error message on a 409 response', async () => {
      vi.spyOn(global, 'fetch').mockResolvedValueOnce(mockFetchResponse(409))

      const user = userEvent.setup()
      render(<App />)

      await user.type(screen.getByLabelText('Email address'), 'dup@example.com')
      await user.click(screen.getByRole('button'))

      expect(
        await screen.findByText(
          'ეს ელ-ფოსტა უკვე რეგისტრირებულია / This email is already registered',
        ),
      ).toBeInTheDocument()
    })

    it('keeps the form visible after a 409 so the user can correct their input', async () => {
      vi.spyOn(global, 'fetch').mockResolvedValueOnce(mockFetchResponse(409))

      const user = userEvent.setup()
      render(<App />)

      await user.type(screen.getByLabelText('Email address'), 'dup@example.com')
      await user.click(screen.getByRole('button'))

      await screen.findByText(/უკვე რეგისტრირებულია/)
      expect(screen.getByLabelText('Email address')).toBeInTheDocument()
    })
  })

  // -------------------------------------------------------------------------
  // Network error
  // -------------------------------------------------------------------------

  describe('Network error', () => {
    it('shows a bilingual network-error message when fetch rejects', async () => {
      vi.spyOn(global, 'fetch').mockRejectedValueOnce(new Error('Network failure'))

      const user = userEvent.setup()
      render(<App />)

      await user.type(screen.getByLabelText('Email address'), 'offline@example.com')
      await user.click(screen.getByRole('button'))

      expect(
        await screen.findByText(
          'ქსელის შეცდომა — სცადეთ თავიდან / Network error — please try again',
        ),
      ).toBeInTheDocument()
    })

    it('shows the generic error message when API returns a non-409 error status', async () => {
      vi.spyOn(global, 'fetch').mockResolvedValueOnce(mockFetchResponse(500))

      const user = userEvent.setup()
      render(<App />)

      await user.type(screen.getByLabelText('Email address'), 'error@example.com')
      await user.click(screen.getByRole('button'))

      expect(
        await screen.findByText(
          'დაფიქსირდა შეცდომა — სცადეთ თავიდან / Something went wrong, please try again',
        ),
      ).toBeInTheDocument()
    })
  })

  // -------------------------------------------------------------------------
  // Accessibility
  // -------------------------------------------------------------------------

  describe('Accessibility', () => {
    it('re-enables the submit button after an error response', async () => {
      vi.spyOn(global, 'fetch').mockResolvedValueOnce(mockFetchResponse(409))

      const user = userEvent.setup()
      render(<App />)

      await user.type(screen.getByLabelText('Email address'), 'dup@example.com')
      await user.click(screen.getByRole('button'))

      await screen.findByText(/უკვე რეგისტრირებულია/)
      expect(screen.getByRole('button')).not.toBeDisabled()
    })

    it('input has autocomplete="email" for mobile keyboard optimisation', () => {
      render(<App />)
      expect(screen.getByLabelText('Email address')).toHaveAttribute(
        'autocomplete',
        'email',
      )
    })
  })

  // -------------------------------------------------------------------------
  // Privacy — email must not be logged to the console
  // -------------------------------------------------------------------------

  describe('Privacy — email not logged to console', () => {
    it('does not log the email address to console.log on successful submission', async () => {
      vi.spyOn(global, 'fetch').mockResolvedValueOnce(mockFetchResponse(201))
      const consoleSpy = vi.spyOn(console, 'log').mockImplementation(() => undefined)

      const user = userEvent.setup()
      render(<App />)

      await user.type(screen.getByLabelText('Email address'), 'nolog@example.com')
      await user.click(screen.getByRole('button'))

      await screen.findByText(/გმადლობთ/)

      const logged = consoleSpy.mock.calls.flat().join(' ')
      expect(logged).not.toContain('nolog@example.com')

      consoleSpy.mockRestore()
    })
  })
})

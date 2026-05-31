const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || 'http://localhost:8000'

export async function signInUser(email, password) {
  const response = await fetch(`${API_BASE_URL}/auth/signin`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({ email, password }),
  })

  if (!response.ok) {
    const error = await response.json().catch(() => ({}))
    throw new Error(error.detail || 'Sign in failed')
  }

  return response.json()
}

export async function signUpUser(name, email, password) {
  const response = await fetch(`${API_BASE_URL}/auth/signup`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({ name, email, password }),
  })

  if (!response.ok) {
    const error = await response.json().catch(() => ({}))
    throw new Error(error.detail || 'Sign up failed')
  }

  return response.json()
}

export async function signOutUser() {
  localStorage.removeItem('token')
  localStorage.removeItem('user')
}
import { useState } from 'react'
import type { FormEvent } from 'react'
import { useNavigate, Link } from 'react-router-dom'
import { useAuth } from '../contexts/AuthContext'
import { Logo } from '../components/Logo'

export function Login() {
  const { login } = useAuth()
  const navigate = useNavigate()
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [showPassword, setShowPassword] = useState(false)
  const [error, setError] = useState('')
  const [loading, setLoading] = useState(false)

  async function handleSubmit(e: FormEvent) {
    e.preventDefault()
    setError('')
    setLoading(true)
    try {
      await login(email, password)
      navigate('/dashboard')
    } catch {
      setError('Email ou senha incorretos.')
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="min-h-screen flex items-center justify-center px-4" style={{ background: '#0f0f14' }}>
      <div className="w-full max-w-sm">

        <div className="flex flex-col items-center mb-8">
          <Logo size="lg" />
          <p className="text-sm mt-3" style={{ color: '#6b6b8a' }}>
            Gerencie sua equipe com clareza
          </p>
        </div>

        <div className="rounded-2xl p-8" style={{ background: '#1a1a2e', border: '0.5px solid #2a2a45' }}>
          <h1 className="text-lg font-medium text-white mb-1">Bem-vindo de volta</h1>
          <p className="text-sm mb-6" style={{ color: '#6b6b8a' }}>Entre na sua conta para continuar</p>

          <form onSubmit={handleSubmit} className="flex flex-col gap-4">
            <div className="flex flex-col gap-1.5">
              <label className="text-xs" style={{ color: '#8888aa' }}>Email</label>
              <input
                type="email"
                placeholder="seu@email.com"
                value={email}
                onChange={e => setEmail(e.target.value)}
                required
              />
            </div>

            <div className="flex flex-col gap-1.5">
              <label className="text-xs" style={{ color: '#8888aa' }}>Senha</label>
              <div className="relative">
                <input
                  type={showPassword ? 'text' : 'password'}
                  placeholder="••••••••"
                  value={password}
                  onChange={e => setPassword(e.target.value)}
                  required
                  style={{ paddingRight: '42px' }}
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-3 top-1/2 -translate-y-1/2"
                  style={{ background: 'none', padding: 0 }}
                >
                  {showPassword ? (
                    <svg width="16" height="16" viewBox="0 0 16 16" fill="none">
                      <path d="M1 8s2.5-5 7-5 7 5 7 5-2.5 5-7 5-7-5-7-5z" stroke="#6b6b8a" strokeWidth="1.2"/>
                      <circle cx="8" cy="8" r="2" stroke="#6b6b8a" strokeWidth="1.2"/>
                      <line x1="2" y1="2" x2="14" y2="14" stroke="#6b6b8a" strokeWidth="1.2" strokeLinecap="round"/>
                    </svg>
                  ) : (
                    <svg width="16" height="16" viewBox="0 0 16 16" fill="none">
                      <path d="M1 8s2.5-5 7-5 7 5 7 5-2.5 5-7 5-7-5-7-5z" stroke="#6b6b8a" strokeWidth="1.2"/>
                      <circle cx="8" cy="8" r="2" stroke="#6b6b8a" strokeWidth="1.2"/>
                    </svg>
                  )}
                </button>
              </div>
            </div>

            {error && (
              <p className="text-xs px-3 py-2 rounded-lg" style={{ color: '#f09595', background: '#2a1a1a' }}>
                {error}
              </p>
            )}

            <button
              type="submit"
              disabled={loading}
              className="w-full py-3 rounded-xl text-sm font-medium text-white mt-1"
              style={{ background: loading ? '#4a3fa0' : '#7c6fe0' }}
            >
              {loading ? 'Entrando...' : 'Entrar'}
            </button>
          </form>
        </div>

        <p className="text-center text-sm mt-5" style={{ color: '#6b6b8a' }}>
          Não tem conta?{' '}
          <Link to="/register" style={{ color: '#8b7cf8' }}>
            Cadastre-se
          </Link>
        </p>

        <div className="mt-6 rounded-xl p-4 flex items-start gap-3" style={{ background: '#1a1a2e', border: '0.5px solid #2a2a45' }}>
          <div className="w-2 h-2 rounded-full mt-1 flex-shrink-0" style={{ background: '#1D9E75' }}></div>
          <div>
            <p className="text-xs font-medium" style={{ color: '#c8c8e8' }}>Conta de demonstração</p>
            <p className="text-xs mt-0.5" style={{ color: '#6b6b8a' }}>demo@taskmanager.com</p>
            <p className="text-xs" style={{ color: '#6b6b8a' }}>Senha: demo1234</p>
          </div>
        </div>

      </div>
    </div>
  )
}

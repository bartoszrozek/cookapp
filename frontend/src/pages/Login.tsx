import React, { useState } from 'react';
import { useAuth } from '../contexts/AuthContext';
import '../styles/_base.scss';

export default function Login() {
  const { login } = useAuth();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState<string | null>(null);

  async function onSubmit(e: React.FormEvent) {
    e.preventDefault();
    try {
      await login(email, password);
      // redirect or close modal
    } catch (err: any) {
      setError(err.message || 'Login failed');
    }
  }

  return (
    <form className='modal-form' onSubmit={onSubmit}>
      <div>
        <label>Email</label>
        <input value={email} onChange={e => setEmail(e.target.value)} />
      </div>
      <div>
        <label>Password</label>
        <input type="password" value={password} onChange={e => setPassword(e.target.value)} />
      </div>
      <button type="submit">Login</button>
      {error && <div className="error">{error}</div>}
    </form>
  );
}

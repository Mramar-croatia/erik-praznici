import { useState } from 'react';
import { signInWithEmailAndPassword, signOut } from 'firebase/auth';
import { auth } from '../firebase';
import styles from './AdminLogin.module.css';

export default function AdminLogin({ isAdmin, onClose }) {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const handleLogin = async (e) => {
    e.preventDefault();
    setError('');
    setLoading(true);
    try {
      await signInWithEmailAndPassword(auth, email, password);
      onClose();
    } catch (err) {
      setError('Pogrešan email ili lozinka.');
    } finally {
      setLoading(false);
    }
  };

  const handleLogout = async () => {
    await signOut(auth);
    onClose();
  };

  return (
    <div className={styles.overlay} onClick={(e) => e.target === e.currentTarget && onClose()}>
      <div className={styles.modal}>
        {isAdmin ? (
          <>
            <h2>Admin aktivan</h2>
            <p className={styles.info}>Trenutno si prijavljen kao administrator.<br />Možeš mijenjati status zadataka.</p>
            <button className={styles.logoutBtn} onClick={handleLogout}>Odjava</button>
            <button className={styles.cancelBtn} onClick={onClose}>Zatvori</button>
          </>
        ) : (
          <>
            <h2>Admin prijava</h2>
            <form onSubmit={handleLogin} className={styles.form}>
              <label>Email
                <input
                  type="email"
                  value={email}
                  onChange={e => setEmail(e.target.value)}
                  required
                  autoFocus
                  placeholder="admin@example.com"
                />
              </label>
              <label>Lozinka
                <input
                  type="password"
                  value={password}
                  onChange={e => setPassword(e.target.value)}
                  required
                  placeholder="••••••••"
                />
              </label>
              {error && <div className={styles.error}>{error}</div>}
              <button type="submit" className={styles.loginBtn} disabled={loading}>
                {loading ? 'Prijava...' : 'Prijava'}
              </button>
              <button type="button" className={styles.cancelBtn} onClick={onClose}>Odustani</button>
            </form>
          </>
        )}
      </div>
    </div>
  );
}

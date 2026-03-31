// status: null | 'correct' | 'partial' | 'wrong'
import styles from './StatusBadge.module.css';

export default function StatusBadge({ status, isAdmin, onCycle }) {
  const label = status === 'correct' ? '✓' : status === 'wrong' ? '✗' : status === 'partial' ? '~' : '?';
  const cls = status === 'correct'
    ? styles.correct
    : status === 'wrong'
    ? styles.wrong
    : status === 'partial'
    ? styles.partial
    : styles.unknown;

  return (
    <button
      className={`${styles.badge} ${cls} ${isAdmin ? styles.clickable : ''}`}
      onClick={isAdmin ? onCycle : undefined}
      title={isAdmin ? 'Klikni za promjenu statusa' : undefined}
      disabled={!isAdmin}
    >
      {label}
    </button>
  );
}

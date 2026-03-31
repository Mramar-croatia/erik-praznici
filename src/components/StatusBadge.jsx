import styles from './StatusBadge.module.css';

// status: null | 'correct' | 'wrong'
// isAdmin: whether to show clickable controls
export default function StatusBadge({ status, isAdmin, onCycle }) {
  const label = status === 'correct' ? '✓' : status === 'wrong' ? '✗' : '?';
  const cls = status === 'correct'
    ? styles.correct
    : status === 'wrong'
    ? styles.wrong
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

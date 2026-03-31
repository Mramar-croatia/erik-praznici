import styles from './Header.module.css';

export default function Header({ total, correct, isAdmin, onAdminClick }) {
  const pct = total > 0 ? Math.round((correct / total) * 100) : 0;

  return (
    <header className={styles.header}>
      <div className={styles.headerTop}>
        <div>
          <div className={styles.title}>Zadaci za praznike</div>
          <div className={styles.subtitle}>Matematika &amp; Fizika · 7. razred · 9 dana</div>
        </div>
        <div className={styles.headerRight}>
          <div className={styles.calcNotes}>
            <span>🚫 Matematika: bez kalkulatora</span>
            <span>✓ Fizika: kalkulator ok</span>
          </div>
          <button
            className={`${styles.adminBtn} ${isAdmin ? styles.adminActive : ''}`}
            onClick={onAdminClick}
            title={isAdmin ? 'Admin mode — klikni za odjavu' : 'Admin prijava'}
          >
            {isAdmin ? '🔓 Admin' : '🔒'}
          </button>
        </div>
      </div>
      <div className={styles.progressWrap}>
        <div className={styles.progressBg}>
          <div className={styles.progressFill} style={{ width: `${pct}%` }} />
        </div>
        <div className={styles.progressLabel}>
          {correct} / {total} točno
        </div>
      </div>
    </header>
  );
}

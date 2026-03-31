import TaskCard from './TaskCard';
import styles from './DayPanel.module.css';

const SECTIONS = [
  { key: 'math', label: 'MATEMATIKA', icon: '📐', note: '🚫 Bez kalkulatora' },
  { key: 'phys', label: 'FIZIKA',     icon: '⚗️',  note: '✓ Kalkulator ok'  },
];

export default function DayPanel({ dayData, dayIndex, taskStates, isAdmin, onStatusChange }) {
  const subjects = ['math', 'phys'];

  // Count stats
  const total = subjects.reduce((s, subj) => s + dayData[subj].length, 0);
  const correct = subjects.reduce((s, subj) =>
    s + dayData[subj].filter((_, i) => taskStates[`${dayIndex}_${subj}_${i}`] === 'correct').length, 0);
  const allDone = correct === total;

  return (
    <div className={styles.panel}>
      <div className={styles.dayHeader}>
        <div className={styles.dayNumber}>Dan {dayData.day}</div>
        <div className={styles.dayMeta}>
          <span className={styles.pillMath}>Matematika</span>
          <span className={styles.pillPhys}>Fizika</span>
          <span className={styles.dayDone}>{correct} / {total} točno</span>
        </div>
      </div>

      <div className={styles.legend}>
        <span className={`${styles.badge} ${styles.easy}`}>Lakše</span>
        <span className={`${styles.badge} ${styles.mid}`}>Srednje</span>
        <span className={`${styles.badge} ${styles.hard}`}>Zahtjevnije</span>
        {isAdmin && <span className={styles.adminHint}>— klikni status za promjenu: ? → ✓ → ✗ → ?</span>}
      </div>

      {SECTIONS.map(({ key, label, icon, note }) => (
        <div key={key} className={styles.section}>
          <div className={`${styles.sectionHeader} ${styles[key]}`}>
            <div className={`${styles.sectionIcon} ${styles[`icon_${key}`]}`}>{icon}</div>
            <div className={styles.sectionLabel}>{label}</div>
            <div className={styles.sectionNote}>{note}</div>
          </div>
          <div className={styles.tasks}>
            {dayData[key].map((task, i) => (
              <TaskCard
                key={i}
                task={task}
                taskNum={i + 1}
                status={taskStates[`${dayIndex}_${key}_${i}`] ?? null}
                isAdmin={isAdmin}
                onStatusChange={(newStatus) => onStatusChange(dayIndex, key, i, newStatus)}
              />
            ))}
          </div>
        </div>
      ))}

      {allDone && (
        <div className={styles.congrats}>
          <div className={styles.congratsIcon}>🎉</div>
          <h3>Dan {dayData.day} završen!</h3>
          <p>Odličan posao — svi zadaci točno riješeni.</p>
        </div>
      )}
    </div>
  );
}

import TaskCard from './TaskCard';
import styles from './DayPanel.module.css';

const SECTIONS = [
  { key: 'math', label: 'MATEMATIKA', icon: '📐', note: '🚫 Bez kalkulatora' },
  { key: 'phys', label: 'FIZIKA',     icon: '⚗️',  note: '✓ Kalkulator ok'  },
];

export default function DayPanel({ dayData, dayIndex, taskStates, isAdmin, onStatusChange, comments, onCommentChange, solUnlocked, onSolUnlockChange, isFutureDay, isDayAdminUnlocked, onDayUnlock }) {
  const subjects = ['math', 'phys'];

  // Count stats
  const total = subjects.reduce((s, subj) => s + dayData[subj].length, 0);
  const correct = subjects.reduce((s, subj) =>
    s + dayData[subj].filter((_, i) => taskStates[`${dayIndex}_${subj}_${i}`] === 'correct').length, 0);
  const allDone = subjects.every(subj =>
    dayData[subj].every((_, i) => taskStates[`${dayIndex}_${subj}_${i}`] === 'correct')
  );

  return (
    <div className={styles.panel}>
      {isAdmin && isFutureDay && (
        <div className={`${styles.lockBanner} ${isDayAdminUnlocked ? styles.lockBannerUnlocked : ''} noPrint`}>
          <span className={styles.lockBannerIcon}>{isDayAdminUnlocked ? '🔓' : '🔒'}</span>
          <span className={styles.lockBannerText}>
            {isDayAdminUnlocked
              ? 'Učenik može vidjeti ovaj dan.'
              : 'Učenik ne može vidjeti ovaj dan — dan je zaključan.'}
          </span>
          <button
            className={styles.lockBannerBtn}
            onClick={() => onDayUnlock(!isDayAdminUnlocked)}
          >
            {isDayAdminUnlocked ? 'Zaključaj' : 'Otključaj za učenika'}
          </button>
        </div>
      )}
      <div className={styles.dayHeader}>
        <div className={styles.dayNumber}>Dan {dayData.day}</div>
        <div className={styles.dayMeta}>
          <span className={styles.dayDone}>{correct} / {total} točno</span>
        </div>
      </div>

      {SECTIONS.map(({ key, label, icon, note }) => (
        <div key={key} className={styles.section}>
          <div className={`${styles.sectionHeader} ${styles[key]}`}>
            <div className={`${styles.sectionIcon} ${styles[`icon_${key}`]}`}>{icon}</div>
            <div className={styles.sectionLabel}>{label}</div>
            <div className={styles.sectionNote}>{note}</div>
          </div>
          <div className={styles.tasks}>
            {dayData[key].map((task, i) => {
              const taskKey = `${dayIndex}_${key}_${i}`;
              return (
                <TaskCard
                  key={i}
                  task={task}
                  taskNum={i + 1}
                  status={taskStates[taskKey] ?? null}
                  isAdmin={isAdmin}
                  onStatusChange={(newStatus) => onStatusChange(dayIndex, key, i, newStatus)}
                  comment={comments[taskKey]}
                  onCommentChange={(v) => onCommentChange(dayIndex, key, i, v)}
                  solUnlocked={!!solUnlocked[taskKey]}
                  onSolUnlockChange={(v) => onSolUnlockChange(dayIndex, key, i, v)}
                />
              );
            })}
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

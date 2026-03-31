import IMGS from '../data/imgs';
import StatusBadge from './StatusBadge';
import styles from './TaskCard.module.css';

const DIFF_LABEL = { easy: 'Lakše', mid: 'Srednje', hard: 'Zahtjevnije' };
const DIFF_CLASS = { easy: styles.easy, mid: styles.mid, hard: styles.hard };

// Cycle: null → 'correct' → 'wrong' → null
function cycleStatus(current) {
  if (!current) return 'correct';
  if (current === 'correct') return 'wrong';
  return null;
}

export default function TaskCard({ task, taskNum, status, isAdmin, onStatusChange }) {
  const handleCycle = () => {
    onStatusChange(cycleStatus(status));
  };

  const rowCls = [
    styles.task,
    status === 'correct' ? styles.correct : '',
    status === 'wrong' ? styles.wrong : '',
  ].join(' ');

  return (
    <div className={rowCls}>
      <StatusBadge status={status} isAdmin={isAdmin} onCycle={handleCycle} />
      <div className={styles.body}>
        <div className={styles.top}>
          <span className={styles.num}>Zad. {taskNum}</span>
          <span className={`${styles.badge} ${DIFF_CLASS[task.d]}`}>
            {DIFF_LABEL[task.d]}
          </span>
        </div>
        <div className={styles.text}>{task.t}</div>
        {task.img && IMGS[task.img] && (
          <div className={styles.imgWrap}>
            <img src={IMGS[task.img]} alt="skica" loading="lazy" />
          </div>
        )}
      </div>
    </div>
  );
}

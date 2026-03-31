import { useRef, useEffect } from 'react';
import DAYS from '../data/days';
import styles from './DayTabs.module.css';

// Returns 'all-correct' | 'partial' | 'none' for a day
function dayStatus(di, taskStates) {
  const subjects = ['math', 'phys'];
  let correct = 0, total = 0;
  subjects.forEach(subj => {
    DAYS[di][subj].forEach((_, i) => {
      total++;
      if (taskStates[`${di}_${subj}_${i}`] === 'correct') correct++;
    });
  });
  if (correct === total) return 'all-correct';
  if (correct > 0) return 'partial';
  return 'none';
}

function dayProgress(di, taskStates) {
  const subjects = ['math', 'phys'];
  let correct = 0, total = 0;
  subjects.forEach(subj => {
    DAYS[di][subj].forEach((_, i) => {
      total++;
      if (taskStates[`${di}_${subj}_${i}`] === 'correct') correct++;
    });
  });
  return { correct, total };
}

export default function DayTabs({ currentDay, onSwitch, taskStates }) {
  const tabRefs = useRef([]);

  useEffect(() => {
    tabRefs.current[currentDay]?.scrollIntoView({
      behavior: 'smooth', block: 'nearest', inline: 'center'
    });
  }, [currentDay]);

  return (
    <div className={styles.wrap}>
      <div className={styles.tabs}>
        {DAYS.map((d, i) => {
          const status = dayStatus(i, taskStates);
          const { correct, total } = dayProgress(i, taskStates);
          return (
            <button
              key={i}
              ref={el => tabRefs.current[i] = el}
              className={[
                styles.tab,
                i === currentDay ? styles.active : '',
                status === 'all-correct' ? styles.done : '',
              ].join(' ')}
              onClick={() => onSwitch(i)}
            >
              {status !== 'none' && (
                <span className={styles.dot} />
              )}
              Dan {d.day}
              <span className={styles.progress}>{correct}/{total}</span>
            </button>
          );
        })}
      </div>
    </div>
  );
}

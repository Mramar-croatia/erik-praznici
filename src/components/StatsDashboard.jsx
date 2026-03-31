import DAYS from '../data/days';
import styles from './StatsDashboard.module.css';

export default function StatsDashboard({ taskStates, onClose }) {
  const s = {
    math: { correct: 0, partial: 0, wrong: 0, total: 0 },
    phys: { correct: 0, partial: 0, wrong: 0, total: 0 },
    easy: { correct: 0, partial: 0, wrong: 0, total: 0 },
    mid:  { correct: 0, partial: 0, wrong: 0, total: 0 },
    hard: { correct: 0, partial: 0, wrong: 0, total: 0 },
  };

  DAYS.forEach((d, di) => {
    ['math', 'phys'].forEach(subj => {
      d[subj].forEach((task, i) => {
        const st = taskStates[`${di}_${subj}_${i}`] || null;
        s[subj].total++;
        s[task.d].total++;
        if (st === 'correct') { s[subj].correct++; s[task.d].correct++; }
        else if (st === 'partial') { s[subj].partial++; s[task.d].partial++; }
        else if (st === 'wrong') { s[subj].wrong++; s[task.d].wrong++; }
      });
    });
  });

  const total = s.math.total + s.phys.total;
  const correct = s.math.correct + s.phys.correct;
  const partial = s.math.partial + s.phys.partial;
  const wrong = s.math.wrong + s.phys.wrong;
  const answered = correct + partial + wrong;
  const pct = (n, d) => d > 0 ? Math.round(n / d * 100) : 0;

  function StatBar({ data }) {
    const cPct = pct(data.correct, data.total);
    const pPct = pct(data.partial, data.total);
    return (
      <div className={styles.bar}>
        <div className={styles.barCorrect} style={{ width: `${cPct}%` }} />
        <div className={styles.barPartial} style={{ width: `${pPct}%`, left: `${cPct}%` }} />
      </div>
    );
  }

  function Row({ label, data }) {
    return (
      <div className={styles.row}>
        <div className={styles.rowLabel}>{label}</div>
        <StatBar data={data} />
        <div className={styles.rowStats}>
          <span className={styles.cNum}>{data.correct}</span>
          {data.partial > 0 && <span className={styles.pNum}>~{data.partial}</span>}
          {data.wrong > 0 && <span className={styles.wNum}>✗{data.wrong}</span>}
          <span className={styles.tNum}>/{data.total}</span>
        </div>
      </div>
    );
  }

  return (
    <div className={styles.overlay} onClick={onClose}>
      <div className={styles.modal} onClick={e => e.stopPropagation()}>
        <div className={styles.modalHeader}>
          <h2 className={styles.title}>Statistika</h2>
          <button className={styles.close} onClick={onClose}>✕</button>
        </div>

        <div className={styles.overall}>
          <div className={styles.bigNum}>{pct(correct, total)}%</div>
          <div className={styles.bigLabel}>točnih zadataka</div>
          <div className={styles.chips}>
            <span className={styles.chipC}>✓ {correct} točno</span>
            {partial > 0 && <span className={styles.chipP}>~ {partial} djelomično</span>}
            <span className={styles.chipW}>✗ {wrong} netočno</span>
            <span className={styles.chipN}>? {total - answered} neriješeno</span>
          </div>
        </div>

        <h3 className={styles.sectionTitle}>Po predmetu</h3>
        <Row label="📐 Matematika" data={s.math} />
        <Row label="⚗️ Fizika" data={s.phys} />

        <h3 className={styles.sectionTitle}>Po težini</h3>
        <Row label="Lakše" data={s.easy} />
        <Row label="Srednje" data={s.mid} />
        <Row label="Zahtjevnije" data={s.hard} />
      </div>
    </div>
  );
}

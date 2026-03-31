import { useState } from 'react';
import IMGS from '../data/imgs';
import StatusBadge from './StatusBadge';
import styles from './TaskCard.module.css';

const DIFF_LABEL = { easy: 'Lakše', mid: 'Srednje', hard: 'Zahtjevnije' };
const DIFF_CLASS = { easy: styles.easy, mid: styles.mid, hard: styles.hard };

// Cycle: null → 'correct' → 'partial' → 'wrong' → null
function cycleStatus(current) {
  if (!current) return 'correct';
  if (current === 'correct') return 'partial';
  if (current === 'partial') return 'wrong';
  return null;
}

export default function TaskCard({ task, taskNum, status, isAdmin, onStatusChange, note, onNoteChange, comment, onCommentChange }) {
  const [showSol, setShowSol] = useState(false);
  const [editingComment, setEditingComment] = useState(false);
  const [commentDraft, setCommentDraft] = useState('');

  const handleCycle = () => {
    onStatusChange(cycleStatus(status));
  };

  const startEditComment = () => {
    setCommentDraft(comment || '');
    setEditingComment(true);
  };

  const saveComment = () => {
    onCommentChange(commentDraft);
    setEditingComment(false);
  };

  const cancelComment = () => {
    setEditingComment(false);
  };

  const rowCls = [
    styles.task,
    status === 'correct' ? styles.correct : '',
    status === 'wrong' ? styles.wrong : '',
    status === 'partial' ? styles.partial : '',
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

        {task.sol && (
          <div className={styles.solWrap}>
            {!showSol ? (
              <button className={`${styles.solBtn} printHide`} onClick={() => setShowSol(true)}>
                Prikaži rješenje
              </button>
            ) : (
              <div className={styles.sol}>
                <span className={styles.solLabel}>Rješenje:</span>
                {task.sol}
                <button className={styles.solClose} onClick={() => setShowSol(false)}>sakrij</button>
              </div>
            )}
          </div>
        )}

        {comment && !editingComment && (
          <div className={styles.comment}>
            <span className={styles.commentIcon}>💬</span>
            <span className={styles.commentText}>{comment}</span>
            {isAdmin && (
              <button className={`${styles.commentEditBtn} printHide`} onClick={startEditComment}>Uredi</button>
            )}
          </div>
        )}
        {!comment && !editingComment && isAdmin && (
          <button className={`${styles.addCommentBtn} printHide`} onClick={startEditComment}>+ Dodaj komentar</button>
        )}
        {editingComment && isAdmin && (
          <div className={`${styles.commentEdit} printHide`}>
            <textarea
              className={styles.commentInput}
              value={commentDraft}
              onChange={e => setCommentDraft(e.target.value)}
              rows={2}
              placeholder="Upiši komentar..."
            />
            <div className={styles.commentBtns}>
              <button className={styles.commentSave} onClick={saveComment}>Spremi</button>
              <button className={styles.commentCancel} onClick={cancelComment}>Odustani</button>
            </div>
          </div>
        )}

        <div className={styles.noteWrap}>
          <textarea
            className={`${styles.noteInput} printHide`}
            value={note || ''}
            onChange={e => onNoteChange(e.target.value)}
            onInput={e => { e.target.style.height = 'auto'; e.target.style.height = e.target.scrollHeight + 'px'; }}
            placeholder="Bilješke (samo na ovom uređaju)..."
            rows={1}
          />
        </div>
      </div>
    </div>
  );
}

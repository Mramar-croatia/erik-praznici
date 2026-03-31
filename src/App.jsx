import { useState, useEffect, useRef } from 'react';
import { onAuthStateChanged } from 'firebase/auth';
import { doc, onSnapshot, setDoc } from 'firebase/firestore';
import { auth, db } from './firebase';
import DAYS from './data/days';
import Header from './components/Header';
import DayTabs from './components/DayTabs';
import DayPanel from './components/DayPanel';
import AdminLogin from './components/AdminLogin';
import StatsDashboard from './components/StatsDashboard';
import './index.css';

const STATE_DOC = doc(db, 'state', 'tasks');

function calcStreak(fullDoc) {
  let streak = 0;
  for (let di = 0; di < DAYS.length; di++) {
    let dayComplete = true;
    outer: for (const subj of ['math', 'phys']) {
      for (let i = 0; i < DAYS[di][subj].length; i++) {
        if (fullDoc[`${di}_${subj}_${i}`] !== 'correct') {
          dayComplete = false;
          break outer;
        }
      }
    }
    if (dayComplete) streak++;
    else break;
  }
  return streak;
}

export default function App() {
  const [currentDay, setCurrentDay] = useState(0);
  const [fullDoc, setFullDoc] = useState({});
  const [notes, setNotes] = useState(() => {
    try { return JSON.parse(localStorage.getItem('erik-notes') || '{}'); }
    catch { return {}; }
  });
  const [isAdmin, setIsAdmin] = useState(false);
  const [showLogin, setShowLogin] = useState(false);
  const [showStats, setShowStats] = useState(false);
  const [loading, setLoading] = useState(true);
  const touchStartX = useRef(null);

  // Derive taskStates (status keys) and comments from fullDoc
  const taskStates = {};
  const comments = {};
  for (const [k, v] of Object.entries(fullDoc)) {
    if (k.startsWith('comment_')) {
      comments[k.slice(8)] = v;
    } else {
      taskStates[k] = v;
    }
  }

  useEffect(() => {
    return onAuthStateChanged(auth, (user) => setIsAdmin(!!user));
  }, []);

  useEffect(() => {
    const unsub = onSnapshot(STATE_DOC, (snap) => {
      setFullDoc(snap.exists() ? snap.data() : {});
      setLoading(false);
    }, (err) => {
      console.error('Firestore error:', err);
      setLoading(false);
    });
    return unsub;
  }, []);

  const handleStatusChange = async (dayIndex, subj, taskIdx, newStatus) => {
    if (!isAdmin) return;
    const key = `${dayIndex}_${subj}_${taskIdx}`;
    const old = fullDoc;
    const updated = { ...fullDoc };
    if (newStatus === null) delete updated[key];
    else updated[key] = newStatus;
    setFullDoc(updated);
    try {
      await setDoc(STATE_DOC, updated);
    } catch (err) {
      console.error('Save failed:', err);
      setFullDoc(old);
    }
  };

  const handleCommentChange = async (dayIndex, subj, taskIdx, value) => {
    if (!isAdmin) return;
    const key = `comment_${dayIndex}_${subj}_${taskIdx}`;
    const old = fullDoc;
    const updated = { ...fullDoc };
    if (!value) delete updated[key];
    else updated[key] = value;
    setFullDoc(updated);
    try {
      await setDoc(STATE_DOC, updated);
    } catch (err) {
      console.error('Save failed:', err);
      setFullDoc(old);
    }
  };

  const handleNoteChange = (dayIndex, subj, taskIdx, value) => {
    const key = `${dayIndex}_${subj}_${taskIdx}`;
    const updated = { ...notes, [key]: value };
    setNotes(updated);
    localStorage.setItem('erik-notes', JSON.stringify(updated));
  };

  const handleTouchStart = (e) => {
    touchStartX.current = e.touches[0].clientX;
  };

  const handleTouchEnd = (e) => {
    if (touchStartX.current === null) return;
    const delta = touchStartX.current - e.changedTouches[0].clientX;
    if (Math.abs(delta) > 60) {
      if (delta > 0 && currentDay < DAYS.length - 1) setCurrentDay(d => d + 1);
      if (delta < 0 && currentDay > 0) setCurrentDay(d => d - 1);
    }
    touchStartX.current = null;
  };

  // Global stats
  let total = 0, correct = 0;
  DAYS.forEach((d, di) => {
    ['math', 'phys'].forEach(subj => {
      d[subj].forEach((_, i) => {
        total++;
        if (taskStates[`${di}_${subj}_${i}`] === 'correct') correct++;
      });
    });
  });

  const streak = calcStreak(fullDoc);

  if (loading) {
    return (
      <div style={{
        display: 'flex', alignItems: 'center', justifyContent: 'center',
        height: '100vh', fontFamily: "'DM Sans', sans-serif", color: '#777'
      }}>
        Učitavanje...
      </div>
    );
  }

  return (
    <>
      <div className="noPrint" style={{ position: 'sticky', top: 0, zIndex: 100, boxShadow: '0 4px 24px rgba(27,58,107,0.18)' }}>
        <Header
          total={total}
          correct={correct}
          isAdmin={isAdmin}
          onAdminClick={() => setShowLogin(true)}
          streak={streak}
          onStatsClick={() => setShowStats(true)}
          onExportClick={() => window.print()}
        />
        <DayTabs
          currentDay={currentDay}
          onSwitch={setCurrentDay}
          taskStates={taskStates}
        />
      </div>
      <div onTouchStart={handleTouchStart} onTouchEnd={handleTouchEnd}>
        <DayPanel
          key={currentDay}
          dayData={DAYS[currentDay]}
          dayIndex={currentDay}
          taskStates={taskStates}
          isAdmin={isAdmin}
          onStatusChange={handleStatusChange}
          notes={notes}
          onNoteChange={handleNoteChange}
          comments={comments}
          onCommentChange={handleCommentChange}
        />
      </div>
      {showLogin && (
        <AdminLogin isAdmin={isAdmin} onClose={() => setShowLogin(false)} />
      )}
      {showStats && (
        <StatsDashboard taskStates={taskStates} onClose={() => setShowStats(false)} />
      )}
    </>
  );
}

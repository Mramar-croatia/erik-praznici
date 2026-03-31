import { useState, useEffect } from 'react';
import { onAuthStateChanged } from 'firebase/auth';
import { doc, onSnapshot, setDoc } from 'firebase/firestore';
import { auth, db } from './firebase';
import DAYS from './data/days';
import Header from './components/Header';
import DayTabs from './components/DayTabs';
import DayPanel from './components/DayPanel';
import AdminLogin from './components/AdminLogin';
import './index.css';

const STATE_DOC = doc(db, 'state', 'tasks');

export default function App() {
  const [currentDay, setCurrentDay] = useState(0);
  const [taskStates, setTaskStates] = useState({});
  const [isAdmin, setIsAdmin] = useState(false);
  const [showLogin, setShowLogin] = useState(false);
  const [loading, setLoading] = useState(true);

  // Listen for auth state
  useEffect(() => {
    return onAuthStateChanged(auth, (user) => {
      setIsAdmin(!!user);
    });
  }, []);

  // Listen for task states from Firestore in real-time
  useEffect(() => {
    const unsub = onSnapshot(STATE_DOC, (snap) => {
      if (snap.exists()) {
        setTaskStates(snap.data());
      } else {
        setTaskStates({});
      }
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
    const updated = { ...taskStates };
    if (newStatus === null) {
      delete updated[key];
    } else {
      updated[key] = newStatus;
    }
    // Optimistic update
    setTaskStates(updated);
    try {
      await setDoc(STATE_DOC, updated);
    } catch (err) {
      console.error('Save failed:', err);
      setTaskStates(taskStates);
    }
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
      <div style={{ position: 'sticky', top: 0, zIndex: 100, boxShadow: '0 4px 24px rgba(27,58,107,0.18)' }}>
        <Header
          total={total}
          correct={correct}
          isAdmin={isAdmin}
          onAdminClick={() => setShowLogin(true)}
        />
        <DayTabs
          currentDay={currentDay}
          onSwitch={setCurrentDay}
          taskStates={taskStates}
        />
      </div>
      <DayPanel
        key={currentDay}
        dayData={DAYS[currentDay]}
        dayIndex={currentDay}
        taskStates={taskStates}
        isAdmin={isAdmin}
        onStatusChange={handleStatusChange}
      />
      {showLogin && (
        <AdminLogin
          isAdmin={isAdmin}
          onClose={() => setShowLogin(false)}
        />
      )}
    </>
  );
}

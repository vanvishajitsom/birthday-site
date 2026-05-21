"use client";

import { useEffect, useRef, useState } from "react";
import {
  collection,
  addDoc,
  deleteDoc,
  doc,
  onSnapshot,
  query,
  orderBy,
  serverTimestamp
} from "firebase/firestore";

import { db } from "./firebase";

export default function Home() {
  const [open, setOpen] = useState(false);

  const [name, setName] = useState("");
  const [wish, setWish] = useState("");
  const [wishes, setWishes] = useState<any[]>([]);

  const [musicOn, setMusicOn] = useState(false);

  const audioRef = useRef<HTMLAudioElement | null>(null);

  const [admin] = useState(true);

  /* 🌸 FIREBASE (FIXED CLEANUP) */
  useEffect(() => {
    const q = query(collection(db, "wishes"), orderBy("createdAt", "desc"));

    const unsub = onSnapshot(q, (snap) => {
      setWishes(
        snap.docs.map((d) => ({
          id: d.id,
          ...d.data()
        }))
      );
    });

    return () => unsub();
  }, []);

  /* 🎵 MUSIC CONTROL (SAFE) */
  useEffect(() => {
    const audio = audioRef.current;
    if (!audio) return;

    if (musicOn) {
      audio.play().catch(() => {});
    } else {
      audio.pause();
    }
  }, [musicOn]);

  /* 💌 SEND */
  const submitWish = async () => {
    if (!name || !wish) return;

    await addDoc(collection(db, "wishes"), {
      name,
      message: wish,
      createdAt: serverTimestamp()
    });

    setName("");
    setWish("");
  };

  /* 🗑 DELETE */
  const deleteWish = async (id: string) => {
    await deleteDoc(doc(db, "wishes", id));
  };

  /* 🚪 ENTER SITE + AUTO MUSIC FIX */
  const enterSite = () => {
    setOpen(true);
    setMusicOn(true); // กดเข้าเว็บแล้วเพลงติดทันที
  };

  /* 🌸 PAGE 1 */
  if (!open) {
    return (
      <>
        <style>{globalStyle}</style>

        <main style={styles.startPage}>
          <div style={styles.startCard} onClick={enterSite}>
            <h1 style={{ fontSize: 40, color: "#ff4d88" }}>
              🎂 22 MAY 2005
            </h1>
            <p>click to enter 💖</p>
          </div>
        </main>
      </>
    );
  }

  /* 🌸 PAGE 2 */
  return (
    <>
      <style>{globalStyle}</style>

      {/* 🎵 AUDIO (FIXED FILE NAME) */}
      <audio ref={audioRef} loop>
        <source src="/happy.mp3" type="audio/mp3" />
      </audio>

      {/* 🔊 BUTTON */}
      <button style={styles.musicBtn} onClick={() => setMusicOn(!musicOn)}>
        {musicOn ? "🔊 music on" : "🔇 music off"}
      </button>

      <div style={styles.bg}></div>

      <main style={styles.container}>
        <h1 style={styles.title}>🎂 Birthday Guestbook</h1>
        <p style={styles.subtitle}>leave your wishes 💖</p>

        {/* FORM */}
        <div style={styles.form}>
          <input
            placeholder="your name"
            value={name}
            onChange={(e) => setName(e.target.value)}
            style={styles.input}
          />

          <textarea
            placeholder="write your wish..."
            value={wish}
            onChange={(e) => setWish(e.target.value)}
            style={styles.textarea}
          />

          <button onClick={submitWish} style={styles.button}>
            send 💌
          </button>
        </div>

        {/* GRID */}
        <div style={styles.grid}>
          {wishes.map((w) => (
            <div key={w.id} style={styles.card}>
              <div style={styles.name}>{w.name}</div>
              <div style={styles.msg}>{w.message}</div>

              {admin && (
                <button
                  onClick={() => deleteWish(w.id)}
                  style={styles.deleteBtn}
                >
                  delete
                </button>
              )}
            </div>
          ))}
        </div>
      </main>
    </>
  );
}

/* 🌸 STYLE */
const globalStyle = `
body { margin:0; font-family:system-ui; overflow-x:hidden; }
@keyframes float { 0%{transform:translateY(0)} 50%{transform:translateY(-8px)} 100%{transform:translateY(0)} }
`;

const styles: any = {
  startPage: {
    height: "100vh",
    display: "flex",
    justifyContent: "center",
    alignItems: "center",
    background: "linear-gradient(135deg,#ffd6e7,#fff0f5,#f8dfff)"
  },

  startCard: {
    padding: 50,
    borderRadius: 25,
    background: "rgba(255,255,255,0.7)",
    backdropFilter: "blur(15px)",
    cursor: "pointer",
    textAlign: "center"
  },

  bg: {
    position: "fixed",
    inset: 0,
    background:
      "radial-gradient(circle at 20% 20%, #ffd6e7, transparent 40%), radial-gradient(circle at 80% 30%, #ffe4f0, transparent 50%)",
    filter: "blur(60px)",
    zIndex: -1
  },

  container: {
    padding: 25,
    textAlign: "center"
  },

  title: {
    fontSize: 40,
    color: "#ff4d88",
    animation: "float 3s infinite"
  },

  subtitle: {
    color: "#888",
    marginBottom: 20
  },

  form: {
    maxWidth: 500,
    margin: "0 auto"
  },

  input: {
    width: "100%",
    padding: 12,
    marginBottom: 10,
    borderRadius: 14,
    border: "none",
    background: "rgba(255,255,255,0.7)"
  },

  textarea: {
    width: "100%",
    height: 110,
    padding: 12,
    borderRadius: 14,
    border: "none",
    background: "rgba(255,255,255,0.7)"
  },

  button: {
    marginTop: 10,
    padding: "10px 22px",
    borderRadius: 14,
    border: "none",
    background: "#ff4d88",
    color: "white",
    cursor: "pointer"
  },

  grid: {
    columnCount: 3,
    columnGap: 16,
    marginTop: 40
  },

  card: {
    background: "rgba(255,255,255,0.6)",
    backdropFilter: "blur(18px)",
    padding: 16,
    marginBottom: 16,
    borderRadius: 20
  },

  name: {
    color: "#ff4d88",
    fontWeight: "bold"
  },

  msg: {
    color: "#444",
    marginTop: 6
  },

  deleteBtn: {
    marginTop: 10,
    background: "#ff3b3b",
    color: "white",
    border: "none",
    padding: "6px 10px",
    borderRadius: 10,
    cursor: "pointer"
  },

  musicBtn: {
    position: "fixed",
    top: 15,
    right: 15,
    padding: "10px 14px",
    borderRadius: 12,
    border: "none",
    background: "rgba(255,255,255,0.8)",
    backdropFilter: "blur(10px)",
    cursor: "pointer",
    zIndex: 999
  }
};
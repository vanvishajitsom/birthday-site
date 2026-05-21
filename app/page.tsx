"use client";

import { useEffect, useRef, useState } from "react";
import Confetti from "react-confetti";
import { useWindowSize } from "@uidotdev/usehooks";

export default function Home() {
  const { width, height } = useWindowSize();

  const [page, setPage] = useState(1);

  const [name, setName] = useState("");
  const [wish, setWish] = useState("");

  const [wishes, setWishes] = useState<
    { name: string; message: string }[]
  >([]);

  const [showPopup, setShowPopup] =
    useState(false);

  const [popupName, setPopupName] =
    useState("");

  const [hearts, setHearts] =
    useState(false);

  const [musicOn, setMusicOn] =
    useState(true);

  const [cursor, setCursor] =
    useState({ x: 0, y: 0 });

  const [isAdmin, setIsAdmin] =
    useState(false);

  const audioRef =
    useRef<HTMLAudioElement>(null);

  // load wishes
  useEffect(() => {
    const saved =
      localStorage.getItem(
        "birthday-wishes"
      );

    if (saved) {
      setWishes(JSON.parse(saved));
    }
  }, []);

  // admin mode
  useEffect(() => {
    if (
      window.location.search.includes(
        "admin=2205"
      )
    ) {
      setIsAdmin(true);
    }
  }, []);

  // autoplay music
  useEffect(() => {
    if (
      page >= 2 &&
      audioRef.current &&
      musicOn
    ) {
      audioRef.current.play().catch(() => {});
    }
  }, [page, musicOn]);

  // sparkle cursor
  useEffect(() => {
    const move = (e: MouseEvent) => {
      setCursor({
        x: e.clientX,
        y: e.clientY,
      });
    };

    window.addEventListener(
      "mousemove",
      move
    );

    return () =>
      window.removeEventListener(
        "mousemove",
        move
      );
  }, []);

  // submit wish
  const submitWish = () => {
    if (!name.trim() || !wish.trim())
      return;

    const newWish = {
      name,
      message: wish,
    };

    const updated = [newWish, ...wishes];

    setWishes(updated);

    localStorage.setItem(
      "birthday-wishes",
      JSON.stringify(updated)
    );

    setPopupName(name);

    setName("");
    setWish("");

    setShowPopup(true);
    setHearts(true);

    setTimeout(() => {
      setShowPopup(false);
      setHearts(false);

      setPage(3);
    }, 2500);
  };

  // delete wish
  const deleteWish = (
    indexToDelete: number
  ) => {
    const updated = wishes.filter(
      (_, index) =>
        index !== indexToDelete
    );

    setWishes(updated);

    localStorage.setItem(
      "birthday-wishes",
      JSON.stringify(updated)
    );
  };

  // PAGE 1
  if (page === 1) {
    return (
      <main style={styles.startPage}>
        <div style={styles.glow}></div>

        <div
          style={styles.startCard}
          onClick={() => setPage(2)}
        >
          <div style={styles.small}>
            MY BIRTHDAY
          </div>

          <h1 style={styles.big}>
            22
          </h1>

          <div style={styles.year}>
            MAY 2005
          </div>

          <p style={styles.enter}>
            ✨ click to enter ✨
          </p>
        </div>
      </main>
    );
  }

  return (
    <>
      <audio ref={audioRef} loop autoPlay>
        <source
          src="/happy.mp3"
          type="audio/mp3"
        />
      </audio>

      <Confetti
        width={width || 0}
        height={height || 0}
      />

      {/* sparkle cursor */}
      <div
        style={{
          ...styles.sparkle,
          left: cursor.x,
          top: cursor.y,
        }}
      >
        ✨
      </div>

      {/* petals */}
      <div style={styles.petals}>
        🌸 🌸 🌸 🌸 🌸 🌸 🌸
      </div>

      {/* floating hearts */}
      {hearts && (
        <div style={styles.heartEffect}>
          💖 💕 🌸 ✨ 💖 💕
        </div>
      )}

      <main style={styles.container}>
        <div style={styles.glowPink}></div>
        <div style={styles.glowPurple}></div>

        <div style={styles.cloud1}>
          ☁️
        </div>

        <div style={styles.cloud2}>
          ☁️
        </div>

        <div style={styles.cloud3}>
          ☁️
        </div>

        {/* music player */}
        <div style={styles.musicPlayer}>
          <button
            style={styles.musicButton}
            onClick={() => {
              if (!audioRef.current)
                return;

              if (musicOn) {
                audioRef.current.pause();
              } else {
                audioRef.current.play();
              }

              setMusicOn(!musicOn);
            }}
          >
            {musicOn
              ? "🎵 music on"
              : "🔇 music off"}
          </button>
        </div>

        {/* PAGE 2 */}
        {page === 2 && (
          <div style={styles.card}>
            <h1 style={styles.title}>
              💌 Leave a Wish
            </h1>

            <p style={styles.subtitle}>
              write something for me ✨
            </p>

            <div style={styles.wishSection}>
              <input
                type="text"
                placeholder="your name..."
                value={name}
                onChange={(e) =>
                  setName(e.target.value)
                }
                style={styles.input}
              />

              <textarea
                placeholder="write something for me..."
                value={wish}
                onChange={(e) =>
                  setWish(
                    e.target.value
                  )
                }
                style={styles.textarea}
              />

              <button
                onClick={submitWish}
                style={
                  styles.sendButton
                }
              >
                send ✨
              </button>
            </div>

            <div style={styles.cake}>
              🎂
            </div>

            <div style={styles.balloons}>
              🎈 🎈 🎈 🎈 🎈
            </div>
          </div>
        )}

        {/* PAGE 3 */}
        {page === 3 && (
          <div style={styles.card}>
            <h1 style={styles.title}>
              💖 Birthday Wishes
            </h1>

            <p style={styles.subtitle}>
              messages for me ✨
            </p>

            <div style={styles.cards}>
              {wishes.map(
                (item, index) => (
                  <div
                    key={index}
                    style={
                      styles.wishCard
                    }
                  >
                    <div
                      style={
                        styles.cardName
                      }
                    >
                      💖 {item.name}
                    </div>

                    <div
                      style={
                        styles.cardMessage
                      }
                    >
                      {item.message}
                    </div>

                    {isAdmin && (
                      <button
                        onClick={() =>
                          deleteWish(
                            index
                          )
                        }
                        style={
                          styles.deleteButton
                        }
                      >
                        delete
                      </button>
                    )}
                  </div>
                )
              )}
            </div>

            <button
              style={styles.nextButton}
              onClick={() =>
                setPage(2)
              }
            >
              ✨ write another wish
            </button>
          </div>
        )}

        {/* popup */}
        {showPopup && (
          <div style={styles.popup}>
            ✨ ขอบคุณ {popupName}
            สำหรับคำอวยพร 💖
            <br />
            ขอให้ทุกคำอวยพร
            <br />
            ย้อนกลับไปหาคุณเช่นกัน 🌸
          </div>
        )}
      </main>
    </>
  );
}

const styles: any = {
  startPage: {
    height: "100vh",
    display: "flex",
    justifyContent: "center",
    alignItems: "center",
    overflow: "hidden",
    position: "relative",
    background:
      "linear-gradient(-45deg,#ffd6e7,#ffe8cc,#fff0f6,#f8dfff)",
    backgroundSize: "400% 400%",
    fontFamily: "sans-serif",
  },

  glow: {
    position: "absolute",
    width: 500,
    height: 500,
    background:
      "rgba(255,192,203,0.4)",
    borderRadius: "50%",
    filter: "blur(120px)",
  },

  startCard: {
    background:
      "rgba(255,255,255,0.65)",
    backdropFilter: "blur(18px)",
    padding: "60px 80px",
    borderRadius: 35,
    textAlign: "center",
    cursor: "pointer",
    zIndex: 2,
    boxShadow:
      "0 10px 40px rgba(255,105,180,0.25)",
  },

  small: {
    color: "#ff6b81",
    letterSpacing: 4,
  },

  big: {
    fontSize: 140,
    color: "#ff4d88",
    margin: 0,
  },

  year: {
    color: "#ff85a2",
    fontSize: 30,
    fontWeight: "bold",
    letterSpacing: 4,
  },

  enter: {
    marginTop: 20,
    color: "#666",
  },

  container: {
    minHeight: "100vh",
    padding: 30,
    position: "relative",
    overflow: "hidden",
    background:
      "linear-gradient(-45deg,#fff0f6,#ffe5ec,#fff5f7,#ffe3f1)",
    display: "flex",
    justifyContent: "center",
    alignItems: "center",
    fontFamily: "sans-serif",
  },

  glowPink: {
    position: "absolute",
    width: 350,
    height: 350,
    background:
      "rgba(255,182,193,0.35)",
    borderRadius: "50%",
    filter: "blur(120px)",
    top: -50,
    left: -50,
  },

  glowPurple: {
    position: "absolute",
    width: 300,
    height: 300,
    background:
      "rgba(221,160,221,0.25)",
    borderRadius: "50%",
    filter: "blur(120px)",
    bottom: -50,
    right: -50,
  },

  cloud1: {
    position: "absolute",
    top: 80,
    left: 40,
    fontSize: 60,
    opacity: 0.5,
  },

  cloud2: {
    position: "absolute",
    top: 180,
    right: 60,
    fontSize: 80,
    opacity: 0.4,
  },

  cloud3: {
    position: "absolute",
    bottom: 120,
    left: 100,
    fontSize: 50,
    opacity: 0.4,
  },

  petals: {
    position: "fixed",
    top: 0,
    width: "100%",
    textAlign: "center",
    fontSize: 30,
    opacity: 0.5,
    pointerEvents: "none",
  },

  sparkle: {
    position: "fixed",
    pointerEvents: "none",
    fontSize: 18,
    zIndex: 9999,
    transform:
      "translate(-50%, -50%)",
  },

  musicPlayer: {
    position: "fixed",
    top: 20,
    right: 20,
    zIndex: 999,
  },

  musicButton: {
    border: "none",
    borderRadius: 20,
    padding: "10px 18px",
    background:
      "rgba(255,255,255,0.7)",
    backdropFilter: "blur(10px)",
    cursor: "pointer",
    color: "#ff4d88",
  },

  card: {
    width: "100%",
    maxWidth: 550,
    background:
      "rgba(255,255,255,0.7)",
    backdropFilter: "blur(18px)",
    borderRadius: 35,
    padding: 35,
    textAlign: "center",
    boxShadow:
      "0 10px 40px rgba(255,105,180,0.2)",
    zIndex: 2,
  },

  title: {
    color: "#ff4d88",
    fontSize: 42,
  },

  subtitle: {
    color: "#ff85a2",
    letterSpacing: 4,
    marginBottom: 25,
  },

  wishSection: {
    marginTop: 10,
  },

  input: {
    width: "100%",
    padding: 15,
    border: "none",
    borderRadius: 16,
    marginBottom: 12,
    outline: "none",
    boxSizing: "border-box",
    fontSize: 16,
    background:
      "rgba(255,255,255,0.85)",
  },

  textarea: {
    width: "100%",
    height: 120,
    border: "none",
    borderRadius: 20,
    padding: 18,
    resize: "none",
    outline: "none",
    background:
      "rgba(255,255,255,0.85)",
    fontSize: 16,
    boxSizing: "border-box",
  },

  sendButton: {
    marginTop: 15,
    padding: "12px 30px",
    border: "none",
    borderRadius: 15,
    background: "#ff6b81",
    color: "white",
    cursor: "pointer",
    fontSize: 16,
    boxShadow:
      "0 5px 15px rgba(255,105,180,0.3)",
  },

  cards: {
    marginTop: 30,
    display: "flex",
    flexDirection: "column",
    gap: 15,
    maxHeight: "500px",
    overflowY: "auto",
  },

  wishCard: {
    background:
      "rgba(255,255,255,0.75)",
    padding: 20,
    borderRadius: 22,
    textAlign: "left",
    boxShadow:
      "0 10px 30px rgba(255,105,180,0.15)",
    backdropFilter: "blur(10px)",
    border:
      "1px solid rgba(255,255,255,0.5)",
  },

  cardName: {
    color: "#ff4d88",
    fontWeight: "bold",
    marginBottom: 8,
    fontSize: 17,
  },

  cardMessage: {
    color: "#555",
    lineHeight: 1.7,
  },

  deleteButton: {
    marginTop: 12,
    border: "none",
    padding: "8px 14px",
    borderRadius: 12,
    background: "#ff4d6d",
    color: "white",
    cursor: "pointer",
    fontSize: 13,
  },

  cake: {
    marginTop: 30,
    fontSize: 90,
  },

  balloons: {
    marginTop: 20,
    fontSize: 35,
  },

  nextButton: {
    marginTop: 35,
    padding: "14px 32px",
    border: "none",
    borderRadius: 18,
    background: "#ff6b81",
    color: "white",
    fontSize: 18,
    cursor: "pointer",
    boxShadow:
      "0 5px 20px rgba(255,105,180,0.3)",
  },

  popup: {
    position: "fixed",
    top: "50%",
    left: "50%",
    transform:
      "translate(-50%, -50%)",
    background:
      "rgba(255,255,255,0.95)",
    padding: "30px 40px",
    borderRadius: 25,
    textAlign: "center",
    color: "#ff4d88",
    lineHeight: 1.8,
    fontSize: 20,
    zIndex: 999,
    boxShadow:
      "0 10px 40px rgba(255,105,180,0.3)",
  },

  heartEffect: {
    position: "fixed",
    top: "20%",
    width: "100%",
    textAlign: "center",
    fontSize: 40,
    zIndex: 999,
  },
};
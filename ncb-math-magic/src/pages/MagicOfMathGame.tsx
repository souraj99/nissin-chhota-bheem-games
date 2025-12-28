import React, {
  useState,
  useEffect,
  useMemo,
  useRef,
  useCallback,
} from "react";
import "../styles/pages.scss";
import { IMAGES } from "../lib/images";
import MainLayout from "../layouts/MainLayout";
import API from "../api";
import { MathGameData, Equation } from "../interface/api";
import { MODAL_TYPES, useGlobalModalContext } from "../helpers/GlobalModal";
import { useNavigate } from "react-router-dom";

const imageMap: Record<string, string> = {
  dragon1: IMAGES.QuizBheem,
  dragon2: IMAGES.QuizChutki,
  dragon3: IMAGES.QuizKaalia,
};

const POINTS_PER_CORRECT_ANSWER = 100;
const INITIAL_TIME_SECONDS = 600;

const MagicOfMathGame = () => {
  // Game state
  const [currentRound, setCurrentRound] = useState(1);
  const [mathGameData, setMathGameData] = useState<MathGameData[]>([]);
  const [userAnswers, setUserAnswers] = useState<Record<string, string>>({});
  const [isSubmitted, setIsSubmitted] = useState(false);
  const [loading, setLoading] = useState(false);
  const [isGameOver, setIsGameOver] = useState(false);

  // Timer state
  const [timeRemaining, setTimeRemaining] = useState(INITIAL_TIME_SECONDS);
  const [isTimerPaused, setIsTimerPaused] = useState(false);
  const [totalTimeTaken, setTotalTimeTaken] = useState(0);
  const timerIntervalRef = useRef<NodeJS.Timeout | null>(null);

  // Score state
  const [score, setScore] = useState(0);
  const [showScoreAnimation, setShowScoreAnimation] = useState(false);

  const [scoreData, setScoreData] = useState<
    {
      images: string[];
      userAnswers: Record<string, string>;
      correct: boolean;
    }[]
  >([]);

  const { showModal } = useGlobalModalContext();
  const navigate = useNavigate();
  const gameKey = "TEST_GAME_KEY";
  // const gameKey = useAppSelector((state) => state.user.gameKey);

  const equationsToShow = mathGameData[currentRound - 1]?.equations || [];

  const currentEquationDataList = useMemo(() => {
    return mathGameData[currentRound - 1]?.equations || [];
  }, [mathGameData, currentRound]);

  const currentCharacterValues = useMemo<Record<string, number>>(() => {
    return currentEquationDataList.reduce((acc, eq) => {
      return { ...acc, ...eq.characterValues };
    }, {});
  }, [currentEquationDataList]);

  const usedCharacters = useMemo(() => {
    return Array.from(
      new Set(currentEquationDataList.flatMap((eq) => eq.images))
    );
  }, [currentEquationDataList]);

  // const allAnswersCorrect = Object.entries(currentCharacterValues).every(
  //   ([key, value]) => userAnswers[key] === String(value)
  // );

  const allInputsFilled = Object.keys(currentCharacterValues).every(
    (key) =>
      Object.prototype.hasOwnProperty.call(userAnswers, key) &&
      userAnswers[key] !== ""
  );

  const isButtonDisabled = loading || !allInputsFilled;

  // Format time as MM:SS
  const formatTime = useCallback((seconds: number): string => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${String(mins).padStart(2, "0")}:${String(secs).padStart(2, "0")}`;
  }, []);

  // Timer logic with pause/resume capability
  useEffect(() => {
    // Don't start timer if game is over or hasn't started
    if (isGameOver || mathGameData.length === 0) return;

    // Clear any existing interval
    if (timerIntervalRef.current) {
      clearInterval(timerIntervalRef.current);
    }

    // Start timer if not paused
    if (!isTimerPaused) {
      timerIntervalRef.current = setInterval(() => {
        setTimeRemaining((prev) => {
          if (prev <= 1) {
            // Time's up - end game
            setIsGameOver(true);
            setTotalTimeTaken(INITIAL_TIME_SECONDS);
            return 0;
          }
          return prev - 1;
        });
      }, 1000);
    }

    // Cleanup on unmount or when dependencies change
    return () => {
      if (timerIntervalRef.current) {
        clearInterval(timerIntervalRef.current);
      }
    };
  }, [isTimerPaused, isGameOver, mathGameData.length]);

  // Calculate total time taken when game ends
  useEffect(() => {
    if (isGameOver) {
      setTotalTimeTaken(INITIAL_TIME_SECONDS - timeRemaining);
    }
  }, [isGameOver, timeRemaining]);

  const handleChange = (characterKey: string, value: string) => {
    setUserAnswers((prev) => ({
      ...prev,
      [characterKey]: value,
    }));
  };

  const loadNextRound = useCallback(
    (answerString: string) => {
      if (!gameKey) return;

      // Pause timer during API call
      setIsTimerPaused(true);

      API.magicMathAns(gameKey, currentRound, answerString)
        .then((resp) => {
          if (resp.game_complete === 1) {
            setIsGameOver(true);
          } else {
            setCurrentRound((r) => r + 1);
            setIsSubmitted(false);
            setUserAnswers({});
            // Resume timer when next question is ready
            setIsTimerPaused(false);
          }
          setLoading(false);
        })
        .catch((error) => {
          console.error("Error submitting answers:", error);
          showModal(MODAL_TYPES.ERROR_POPUP, { message: error.message });
          setLoading(false);
          setIsTimerPaused(false);
        });
    },
    [gameKey, currentRound, showModal]
  );

  const handleSubmit = () => {
    const allFilled = Object.keys(currentCharacterValues).every(
      (key) =>
        Object.prototype.hasOwnProperty.call(userAnswers, key) &&
        userAnswers[key] !== ""
    );
    if (!allFilled) return;

    // Pause timer when user submits answer
    setIsTimerPaused(true);
    setIsSubmitted(true);
    setLoading(true);

    const answerString = Object.values(userAnswers).join(", ");

    const correct = Object.entries(currentCharacterValues).every(
      ([key, value]) => userAnswers[key] === String(value)
    );

    // Update score if correct
    if (correct) {
      setScore((prev) => prev + POINTS_PER_CORRECT_ANSWER);
      setShowScoreAnimation(true);
      setTimeout(() => setShowScoreAnimation(false), 500);
    }

    setScoreData((prev) => [
      ...prev,
      {
        images: currentEquationDataList.flatMap((eq) => eq.images),
        userAnswers,
        correct,
      },
    ]);

    setTimeout(() => {
      loadNextRound(answerString);
    }, 1000);
  };

  // Fetch initial game data
  useEffect(() => {
    console.log(1);
    if (!gameKey) return;
    console.log(2);
    API.magicMathGame(gameKey)
      .then((resp) => {
        setMathGameData(resp?.data);
      })
      .catch((error) => {
        console.error("Error fetching math game data:", error);
        showModal(MODAL_TYPES.ERROR_POPUP, { message: error.message });
      });
  }, [gameKey, showModal]);

  // Initial loading effect
  useEffect(() => {
    const timer = setTimeout(() => setLoading(false), 1000);
    return () => clearTimeout(timer);
  }, []);

  const handleReplay = useCallback(() => {
    // Reset all game state
    setCurrentRound(1);
    setUserAnswers({});
    setIsSubmitted(false);
    setLoading(false);
    setIsGameOver(false);
    setTimeRemaining(INITIAL_TIME_SECONDS);
    setIsTimerPaused(false);
    setTotalTimeTaken(0);
    setScore(0);
    setScoreData([]);

    // Fetch new game data
    if (gameKey) {
      API.magicMathGame(gameKey)
        .then((resp) => {
          setMathGameData(resp?.data);
        })
        .catch((error) => {
          console.error("Error fetching math game data:", error);
          showModal(MODAL_TYPES.ERROR_POPUP, { message: error.message });
        });
    }
  }, [gameKey, showModal]);

  const handleGoHome = useCallback(() => {
    navigate("/"); // Adjust route as needed
  }, [navigate]);

  // Game completion modal
  if (isGameOver) {
    return (
      <>
        <div className="game-completion-overlay">
          <div className="game-completion-modal">
            <div className="modal-content">
              {/* Congratulations Image (Stars + Banner) */}
              <div className="congrats-image-container">
                <img
                  src={IMAGES.Congratulations}
                  alt="Congratulations"
                  className="congrats-image"
                />
              </div>

              {/* Starburst Background */}
              {/* <div className="starburst-bg"></div> */}

              {/* Score Display */}
              <div className="score-display-popup">
                <p className="score-label">SCORE</p>
                <p className="score-value">{score}</p>
              </div>

              {/* Stats Row */}
              <div className="stats-row">
                <div className="stat-badge">
                  <img src={IMAGES.Xp} alt="Clock Icon" className="stat-icon" />
                  <span className="stat-number">
                    {scoreData.filter((entry) => entry.correct).length}
                  </span>
                </div>

                <div className="stat-badge">
                  <img
                    src={IMAGES.TimerIcon}
                    alt="Clock Icon"
                    className="stat-icon clock-icon"
                  />
                  <span className="stat-number">
                    {formatTime(totalTimeTaken)}
                  </span>
                </div>
              </div>

              {/* Action Buttons */}
              <div className="modal-actions">
                <button
                  className=" btn-home"
                  onClick={handleGoHome}
                  aria-label="Go to home"
                >
                  <img src={IMAGES.HomeIcon} alt="" className="btn-icon" />
                </button>

                <button
                  className=" btn-replay"
                  onClick={handleReplay}
                  aria-label="Replay game"
                >
                  <img src={IMAGES.RetryIcon} alt="" className="btn-icon" />
                </button>
              </div>
            </div>
          </div>
        </div>
      </>
    );
  }

  return (
    <>
      <MainLayout contentClass="common-page" className="auto-height">
        <div className="common-content">
          {/* Game Header */}
          <div className="game-header">
            <div className="timer-display timer-bg">
              <span
                className={`timer-text ${
                  timeRemaining < 10 ? "timer-warning" : ""
                }`}
                aria-label={`Time remaining: ${formatTime(timeRemaining)}`}
              >
                {formatTime(timeRemaining)}
              </span>
            </div>

            <div className="score-display score-bg">
              <span
                className={`score-text ${
                  showScoreAnimation ? "score-animate" : ""
                }`}
                aria-label={`Current score: ${score}`}
              >
                {score}
              </span>
            </div>
          </div>

          {loading && (
            <div className="loader-wrapper">
              {isSubmitted && <img src={IMAGES.Logo} alt="Correct answer" />}
            </div>
          )}

          <div className="magic-of-math-page">
            <div className="magic-of-math">
              <div className="equations">
                {equationsToShow.map((eq: Equation, idx: number) => (
                  <div
                    key={idx}
                    className={`equation-row ${
                      currentRound === 1 || currentRound === 2 ? "big-img" : ""
                    }`}
                  >
                    {eq.images.map((imgKey: string, i: number) => (
                      <React.Fragment key={i}>
                        <img
                          src={imageMap[imgKey]}
                          alt={imgKey}
                          className="character-img"
                        />
                        {i < eq.images.length - 1 && (
                          <span className="symbol">+</span>
                        )}
                      </React.Fragment>
                    ))}
                    <span className="symbol equals">=</span>
                    <span className="total">{eq.total}</span>
                  </div>
                ))}
              </div>
            </div>
          </div>

          <div className="answer-section">
            {usedCharacters.map((characterKey, idx) => (
              <div key={idx} className="answer-box">
                <img
                  src={imageMap[characterKey]}
                  alt={characterKey}
                  className="character-img"
                />
                <input
                  type="number"
                  placeholder="?"
                  maxLength={3}
                  inputMode="numeric"
                  pattern="[0-9]*"
                  aria-label={`Answer for ${characterKey}`}
                  value={userAnswers[characterKey] || ""}
                  onChange={(e) => handleChange(characterKey, e.target.value)}
                  className={`answer-input ${
                    isSubmitted
                      ? userAnswers[characterKey] ===
                        String(currentCharacterValues[characterKey])
                        ? "correct"
                        : "incorrect"
                      : ""
                  }`}
                  disabled={isSubmitted}
                />
              </div>
            ))}
          </div>

          <div className="button-group">
            <button
              className="btn mb"
              onClick={handleSubmit}
              disabled={isButtonDisabled}
              aria-label={
                currentRound < mathGameData.length
                  ? "Submit and go to next round"
                  : "Submit and finish game"
              }
            >
              {currentRound < mathGameData.length ? "Next" : "Finish"}
            </button>
          </div>
        </div>
      </MainLayout>
    </>
  );
};

export default MagicOfMathGame;

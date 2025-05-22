import Button from "@mui/material/Button";
import ButtonGroup from "@mui/material/ButtonGroup";
import "../Components/Counter.css"
import { useEffect, useState, useRef } from "react";

function Counter() {
  // Define time constants for clarity
  const POMO_TIME = 25 * 60; // 25 minutes in seconds
  const SHORT_BREAK_TIME =   5 * 60; // 5 minutes in seconds
  const LONG_BREAK_TIME = 15 * 60; // 15 minutes in seconds

  const [mode, setMode] = useState('pomo'); // State to track the selected mode
  const [time, setTime] = useState(POMO_TIME); // Initial time based on default mode
  const [isRunning, setIsRunning] = useState(false); // To track if the timer is running
  const timerRef = useRef(null); // Use useRef to store the interval ID

  // useEffect to manage the timer when isRunning changes
  useEffect(() => {
    if (isRunning) {
      timerRef.current = setInterval(() => {
        setTime((prevTime) => {
          if (prevTime <= 1) { // Check for 1 instead of 0 to stop at 0
            clearInterval(timerRef.current);
            setIsRunning(false); // Set isRunning to false when timer finishes
            return 0; // Ensure time ends at 0
          }
          return prevTime - 1;
        });
      }, 1000);
    } else {
      // Clear interval if isRunning is false (e.g., when paused or finished)
      clearInterval(timerRef.current);
    }

    // Cleanup function: This runs when the component unmounts or
    // when isRunning changes and the effect re-runs.
    return () => {
      clearInterval(timerRef.current);
    };
  }, [isRunning]); // Re-run effect only when isRunning changes

  // Function to handle changing the timer mode
  const handleModeChange = (newMode) => {
    // Only update if a different mode is clicked
    if (mode === newMode) return;

    setMode(newMode); // Update the selected mode
    setIsRunning(false); // Pause timer if running
    clearInterval(timerRef.current); // Clear any existing interval

    // Set the time based on the new mode
    switch (newMode) {
      case 'pomo':
        setTime(POMO_TIME);
        break;
      case 'shortBreak':
        setTime(SHORT_BREAK_TIME);
        break;
      case 'longBreak':
        setTime(LONG_BREAK_TIME);
        break;
      default:
        setTime(POMO_TIME); // Fallback
    }
  };

  const startTimer = () => {
    if (!isRunning) { // Prevent multiple intervals if already running
      setIsRunning(true);
    }
  };

  const pauseTimer = () => {
    setIsRunning(false);
  };

  const resetTimer = () => {
    clearInterval(timerRef.current); // Ensure any running timer is stopped
    setIsRunning(false);
    // Reset to the time for the currently selected mode
    switch (mode) {
        case 'pomo':
            setTime(POMO_TIME);
            break;
        case 'shortBreak':
            setTime(SHORT_BREAK_TIME);
            break;
        case 'longBreak':
            setTime(LONG_BREAK_TIME);
            break;
        default:
            setTime(POMO_TIME);
    }
  };

  const getButtonText = () => {
    if (isRunning) {
      return "PAUSE";
    } else if (time === 0) {
      return "RESTART";
    } else {
      return "START";
    }
  };

  const handleStartPauseClick = () => {
    if (isRunning) {
      pauseTimer();
    } else if (time === 0) {
      resetTimer(); // If timer is at 0, "START" button becomes "RESTART"
      startTimer(); // And immediately start it again
    } else {
      startTimer();
    }
  };


  return (
    <div className="counter">
      <div className="btngrp">
        <ButtonGroup color="inherit" className="btn" variant="text" size="large" aria-label="Basic button group">
          <Button
            onClick={() => handleModeChange('pomo')}
            className={mode === 'pomo' ? 'selected-mode-button' : ''}
          >
            POMO
          </Button>
          <Button
            onClick={() => handleModeChange('shortBreak')}
            className={mode === 'shortBreak' ? 'selected-mode-button' : ''}
          >
            Short Break
          </Button>
          <Button
            onClick={() => handleModeChange('longBreak')}
            className={mode === 'longBreak' ? 'selected-mode-button' : ''}
          >
            Long Break
          </Button>
        </ButtonGroup>
      </div>
      <div className="timer">
        {/* Display minutes and seconds, padding with leading zeros */}
        {`${Math.floor(time / 60)}`.padStart(2, '0')}:
        {`${time % 60}`.padStart(2, '0')}
      </div>
      <div className="stt-btn">
        <Button
          size="large"
          className="st-btn"
          onClick={handleStartPauseClick}
        >
          {getButtonText()}
        </Button>
        {/* Conditionally render the Reset button */}
        {time !== POMO_TIME || time !== SHORT_BREAK_TIME || time !== LONG_BREAK_TIME && !isRunning ? (
            <Button size="large" className="st-btn" onClick={resetTimer} style={{ marginLeft: '10px' }}>
              RESET
            </Button>
        ) : null}
      </div>
    </div>
  );
}

export default Counter;
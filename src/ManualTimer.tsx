import React, { useState } from "react";
import useStore from "./store/store";
import { useWebSocketContext } from "./hooks/useWebSocket";

const ManualTimerDisplay: React.FC = () => {
  const [inputTime, setInputTime] = useState(0); // Для ввода времени в минутах
  const remainingTime = useStore((state) => state.remainingTime);
  const setRemainingTime = useStore((state) => state.setRemainingTime);
  const { sendMessage } = useWebSocketContext();

  const formatTime = (seconds: number) => {
    const minutes = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${minutes}:${secs < 10 ? "0" : ""}${secs}`;
  };

  const handleStart = () => {
    const timeInSeconds = inputTime * 60;
    setRemainingTime(timeInSeconds); // Обновляем стейт

    // Отправляем данные на сервер
    sendMessage({ remainingTime: timeInSeconds });
  };

  const handleStop = () => {
    setRemainingTime(0); // Сбрасываем стейт

    // Отправляем данные на сервер
    sendMessage({ remainingTime: 0 });
  };

  return (
    <div>
      <h2>Оставшееся время: {formatTime(remainingTime)}</h2>

      <div>
        <label>
          Установить время (минуты):
          <input
            type="number"
            value={inputTime}
            onChange={(e) => setInputTime(Number(e.target.value))}
          />
        </label>
      </div>

      <div>
        <button onClick={handleStart}>Старт</button>
        <button onClick={handleStop}>Стоп</button>
      </div>
    </div>
  );
};

export default ManualTimerDisplay;

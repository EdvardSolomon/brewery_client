import React from "react";

interface PauseControlsProps {
  pauseCount: number;
  setPauseCount: React.Dispatch<React.SetStateAction<number>>;
  sendMessage: (message: string) => void; // Функция для отправки данных на сервер
}

const PauseControls: React.FC<PauseControlsProps> = ({
  pauseCount,
  setPauseCount,
  sendMessage,
}) => {
  const handleIncrease = () => {
    setPauseCount((prev) => {
      const newCount = Math.min(prev + 1, 10);
      sendMessage(`SET_PAUSE_COUNT:${newCount}`); // Отправляем новое количество пауз
      return newCount;
    });
  };

  const handleDecrease = () => {
    setPauseCount((prev) => {
      const newCount = Math.max(prev - 1, 1);
      sendMessage(`SET_PAUSE_COUNT:${newCount}`); // Отправляем новое количество пауз
      return newCount;
    });
  };

  return (
    <div>
      <h2>Количество пауз</h2>
      <div>
        <button onClick={handleDecrease}>-</button>
        <span>{pauseCount}</span>
        <button onClick={handleIncrease}>+</button>
      </div>
    </div>
  );
};

export default PauseControls;

import React, { useState } from "react";

interface PauseProps {
  index: number;
  sendMessage: (message: string) => void; // Функция для отправки данных на сервер
}

const Pause: React.FC<PauseProps> = ({ index, sendMessage }) => {
  const [temperature, setTemperature] = useState<number>(50);
  const [hysteresis, setHysteresis] = useState<number>(3);
  const [time, setTime] = useState<number>(10);

  const handleUpdate = () => {
    // Формируем сообщение с данными о конкретной паузе
    const message = `UPDATE_PAUSE:${index}:${temperature}:${hysteresis}:${time}`;
    sendMessage(message);
  };

  return (
    <div style={{ border: "1px solid #ccc", margin: "10px", padding: "10px" }}>
      <h3>Пауза {index}</h3>
      <div>
        <label>Температура:</label>
        <input
          type='number'
          value={temperature}
          onChange={(e) => {
            setTemperature(Number(e.target.value));
            handleUpdate(); // Отправляем данные на сервер
          }}
        />
      </div>
      <div>
        <label>Гистерезис:</label>
        <input
          type='number'
          value={hysteresis}
          onChange={(e) => {
            setHysteresis(Number(e.target.value));
            handleUpdate(); // Отправляем данные на сервер
          }}
        />
      </div>
      <div>
        <label>Время:</label>
        <input
          type='number'
          value={time}
          onChange={(e) => {
            setTime(Number(e.target.value));
            handleUpdate(); // Отправляем данные на сервер
          }}
        />
      </div>
    </div>
  );
};

export default Pause;

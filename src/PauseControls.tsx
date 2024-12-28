import React from "react";
import useStore from "./store/store";
import { useWebSocketContext } from "./hooks/useWebSocket";

const PauseControls: React.FC = () => {
  const pauses = useStore((state) => state.pauses);
  const addPause = useStore((state) => state.addPause);
  const removePause = useStore((state) => state.removePause);
  const { sendMessage } = useWebSocketContext();

  const handleAddPause = () => {
    const newPause = { temperature: 50, hysteresis: 3, time: 10 };
    addPause(newPause);

    sendMessage({ pauses: [...pauses, newPause] });
  };

  const handleRemovePause = () => {
    const updatedPauses = pauses.slice(0, pauses.length - 1);
    removePause(pauses.length - 1);

    sendMessage({ pauses: updatedPauses });
  };

  return (
    <div className='pause-controls'>
      <h2>Управление паузами</h2>
      <div className='controls'>
        <button
          onClick={handleRemovePause}
          disabled={pauses.length <= 1}
        >
          Уменьшить паузы
        </button>
        <span>{pauses.length}</span>
        <button
          onClick={handleAddPause}
          disabled={pauses.length >= 10}
        >
          Добавить паузу
        </button>
      </div>
    </div>
  );
};

export default PauseControls;

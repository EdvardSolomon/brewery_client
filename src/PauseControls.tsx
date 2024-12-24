import React from "react";
import useStore from "./store/store";

const PauseControls: React.FC = () => {
  const pauses = useStore((state) => state.pauses);
  const addPause = useStore((state) => state.addPause);
  const removePause = useStore((state) => state.removePause);

  return (
    <div className="pause-controls">
      <h2>Управление паузами</h2>
      <div className="controls">
        <button
          onClick={() => removePause(pauses.length - 1)}
          disabled={pauses.length <= 1}
        >
          Уменьшить паузы
        </button>
        <span>{pauses.length}</span>
        <button
          onClick={() => addPause({ temperature: 50, hysteresis: 3, time: 10 })}
          disabled={pauses.length >= 10}
        >
          Добавить паузу
        </button>
      </div>
    </div>
  );
};

export default PauseControls;

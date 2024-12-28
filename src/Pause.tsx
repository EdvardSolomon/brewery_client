import React from "react";
import useStore from "./store/store";
import { useWebSocketContext } from "./hooks/useWebSocket";

interface PauseProps {
  index: number;
}

const Pause: React.FC<PauseProps> = ({ index }) => {
  const pause = useStore((state) => state.pauses[index]);
  const updatePause = useStore((state) => state.updatePause);
  const pauses = useStore((state) => state.pauses);
  const { sendMessage } = useWebSocketContext();

  if (!pause) {
    return <div>Пауза не найдена</div>;
  }

  const handleUpdate = (key: keyof typeof pause, value: number) => {
    const updatedPause = { ...pause, [key]: value };
    updatePause(index, updatedPause);

    const updatedPauses = pauses.map((p, i) =>
      i === index ? updatedPause : p
    );
    sendMessage({ pauses: updatedPauses });
  };

  return (
    <div className='pause'>
      <h3>Пауза {index + 1}</h3>
      <div>
        <label>Температура:</label>
        <input
          type='number'
          value={pause.temperature}
          onChange={(e) => handleUpdate("temperature", Number(e.target.value))}
        />
      </div>
      <div>
        <label>Гистерезис:</label>
        <input
          type='number'
          value={pause.hysteresis}
          onChange={(e) => handleUpdate("hysteresis", Number(e.target.value))}
        />
      </div>
      <div>
        <label>Время:</label>
        <input
          type='number'
          value={pause.time}
          onChange={(e) => handleUpdate("time", Number(e.target.value))}
        />
      </div>
    </div>
  );
};

export default Pause;

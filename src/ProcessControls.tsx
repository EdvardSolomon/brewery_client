import React from "react";
import { useWebSocketContext } from "./hooks/useWebSocket";
import useStore from "./store/store";

const ProcessControls: React.FC = () => {
  const { sendMessage } = useWebSocketContext();
  const { startProcess, pauseProcess, stopProcess } = useStore();

  const start = () => {
    startProcess();
    sendMessage({ brewStatus: "Процесс запущен" });
  };

  const pause = () => {
    pauseProcess();
    sendMessage({ brewStatus: "Процесс приостановлен" });
  };

  const stop = () => {
    stopProcess();
    sendMessage({ brewStatus: "Процесс остановлен" });
  };

  return (
    <div className="section controls">
      {/* <h2>Управление процессом</h2> */}
      <button className="control-button start" onClick={start}>
        Старт
      </button>
      <button className="control-button pause" onClick={pause}>
        Пауза
      </button>
      <button className="control-button stop" onClick={stop}>
        Стоп
      </button>
    </div>
  );
};

export default ProcessControls;

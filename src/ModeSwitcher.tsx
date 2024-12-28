import React from "react";
import useStore from "./store/store";
import { useWebSocketContext } from "./hooks/useWebSocket";

const ModeSwitcher: React.FC = () => {
  const isAutomatic = useStore((state) => state.isAutomatic);
  const toggleMode = useStore((state) => state.toggleMode);
  const { sendMessage } = useWebSocketContext();

  const handleClick = () => {
    toggleMode();

    const newEnabled = !isAutomatic;
    sendMessage({ isAutomatic: newEnabled });
  };

  return (
    <div className='mode-switcher'>
      <button
        onClick={handleClick}
        className='mode-button'
      >
        {isAutomatic ? "Автоматический режим" : "Ручной режим"}
      </button>
    </div>
  );
};

export default ModeSwitcher;

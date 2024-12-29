import React from "react";
import useStore from "./store/store";
import { useWebSocketContext } from "./hooks/useWebSocket";

const PumpControl: React.FC = () => {
  const { pumpState, setPumpState } = useStore();
  const { sendMessage } = useWebSocketContext();

  const handleToggle = () => {
    setPumpState((prevState) => ({
      ...prevState,
      enabled: !prevState.enabled,
    }));

    const newEnabled = !pumpState.enabled;
    sendMessage({ pumpState: { ...pumpState, enabled: newEnabled } });
  };

  const handlePWMChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const newPWM = Number(event.target.value);
    setPumpState((prevState: any) => ({
      ...prevState,
      pwm: newPWM,
    }));

    sendMessage({ pumpState: { ...pumpState, pwm: newPWM } });
  };

  return (
    <div className="section control">
      <h2>Управление насосом</h2>
      <div className="row">
        <span>Состояние:</span>
        <span
          className={`status-indicator ${
            pumpState.enabled ? "green-square" : "red-square"
          }`}
        ></span>
      </div>
      <input
        type="range"
        min="0"
        max="100"
        step="5"
        value={pumpState.pwm}
        onChange={handlePWMChange}
      />
      <button className="toggle-button" onClick={handleToggle}>
        {pumpState.enabled ? "Выключить насос" : "Включить насос"}
      </button>
    </div>
  );
};

export default PumpControl;

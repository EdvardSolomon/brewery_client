import React from "react";

interface PumpControlProps {
  pumpState: { enabled: boolean; pwm: number };
  setPumpPWM: (pwm: number) => void;
  togglePump: () => void;
}

const PumpControl: React.FC<PumpControlProps> = ({
  pumpState,
  setPumpPWM,
  togglePump,
}) => {
  return (
    <div className='section control'>
      <h2>Управление насосом</h2>
      <div className='row'>
        <span>Состояние:</span>
        <span>{pumpState.enabled ? "ВКЛ" : "ВЫКЛ"}</span>
      </div>
      <input
        type='range'
        min='0'
        max='100'
        step='5'
        value={pumpState.pwm}
        onChange={(e) => setPumpPWM(Number(e.target.value))}
      />
      <button
        onClick={togglePump}
        className='toggle-button'
      >
        {pumpState.enabled ? "Выключить насос" : "Включить насос"}
      </button>
    </div>
  );
};

export default PumpControl;

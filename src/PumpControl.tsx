import React from "react";
import useStore from "./store/store";

const PumpControl: React.FC = () => {
  const { pumpState, setPumpState } = useStore();

  const handleToggle = () => {
    setPumpState((prevState) => ({
      ...prevState,
      enabled: !prevState.enabled,
    }));
  };

  const handlePWMChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const newPWM = Number(event.target.value);
    setPumpState((prevState: any) => ({
      ...prevState,
      pwm: newPWM,
    }));
  };

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
        onChange={handlePWMChange}
      />
      <button
        className='toggle-button'
        onClick={handleToggle}
      >
        {pumpState.enabled ? "Выключить насос" : "Включить насос"}
      </button>
    </div>
  );
};

export default PumpControl;

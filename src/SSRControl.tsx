import React from "react";
import useStore from "./store/store";

const SSRControl: React.FC = () => {
  const { ssrState, setSSRState } = useStore();

  const handleToggle = () => {
    setSSRState((prevState) => ({
      ...prevState,
      enabled: !prevState.enabled,
    }));
  };

  const handlePWMChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const newPWM = Number(event.target.value);
    setSSRState((prevState) => ({
      ...prevState,
      pwm: newPWM,
    }));
  };

  return (
    <div className='section control'>
      <h2>Управление SSR</h2>
      <div className='row'>
        <span>Состояние:</span>
        <span>{ssrState.enabled ? "ВКЛ" : "ВЫКЛ"}</span>
      </div>
      <input
        type='range'
        min='0'
        max='100'
        step='5'
        value={ssrState.pwm}
        onChange={handlePWMChange}
      />
      <button
        className='toggle-button'
        onClick={handleToggle}
      >
        {ssrState.enabled ? "Выключить SSR" : "Включить SSR"}
      </button>
    </div>
  );
};

export default SSRControl;

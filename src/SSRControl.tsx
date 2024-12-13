import React from "react";

interface SSRControlProps {
  ssrState: { enabled: boolean; pwm: number };
  setSSRPWM: (pwm: number) => void;
  toggleSSR: () => void;
}

const SSRControl: React.FC<SSRControlProps> = ({
  ssrState,
  setSSRPWM,
  toggleSSR,
}) => {
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
        onChange={(e) => setSSRPWM(Number(e.target.value))}
      />
      <button
        onClick={toggleSSR}
        className='toggle-button'
      >
        {ssrState.enabled ? "Выключить SSR" : "Включить SSR"}
      </button>
    </div>
  );
};

export default SSRControl;

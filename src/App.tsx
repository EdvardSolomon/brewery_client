import React from "react";
import useStore from "./store/store";

import "./App.css";
import Pause from "./Pause";
import PauseControls from "./PauseControls";
import ModeSwitcher from "./ModeSwitcher";
import BrewStatus from "./BrewStatus";
import PumpControl from "./PumpControl";
import SSRControl from "./SSRControl";
import TemperatureSensor from "./TemperatureSensor";

const App: React.FC = () => {
  const {
    connectionStatus,
    pauses,
    sensors,
    isAutomatic,
    brewStatus,
    toggleMode,
    startProcess,
    pauseProcess,
    stopProcess,
  } = useStore();

  return (
    <div className='app-container'>
      <h1>Управление системой</h1>
      <p className='status'>
        Статус подключения: <strong>{connectionStatus}</strong>
      </p>

      {/* Мониторинг температуры */}
      <div className='section temperature'>
        <h2>Мониторинг температуры</h2>
        <TemperatureSensor
          label='Датчик 1'
          temperature={sensors.sensor1_temp}
          address={sensors.sensor1_address}
        />
        <TemperatureSensor
          label='Датчик 2'
          temperature={sensors.sensor2_temp}
          address={sensors.sensor2_address}
        />
      </div>

      {/* Переключатель режима работы */}
      <ModeSwitcher
        isAutomatic={isAutomatic}
        setIsAutomatic={toggleMode}
      />

      {/* Управление паузами */}
      {isAutomatic && (
        <div className='section pauses'>
          <PauseControls />
          <div className='pause-list'>
            {pauses.map((pause, index) => (
              <Pause
                key={index}
                index={index}
              />
            ))}
          </div>
        </div>
      )}

      {/* Управление насосом */}
      <PumpControl />

      {/* Управление SSR */}
      <SSRControl />

      {/* Статус процесса */}
      <BrewStatus status={brewStatus} />

      {/* Управление процессом */}
      <div className='section controls'>
        <h2>Управление процессом</h2>
        <button
          className='control-button start'
          onClick={startProcess}
        >
          Старт
        </button>
        <button
          className='control-button pause'
          onClick={pauseProcess}
        >
          Пауза
        </button>
        <button
          className='control-button stop'
          onClick={stopProcess}
        >
          Стоп
        </button>
      </div>
    </div>
  );
};

export default App;

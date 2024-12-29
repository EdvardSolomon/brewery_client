import React from "react";
import useStore from "./store/store";

import "./App.css";
import ModeSwitcher from "./ModeSwitcher";
import BrewStatus from "./BrewStatus";
import PumpControl from "./PumpControl";
import SSRControl from "./SSRControl";
import TemperatureSensor from "./TemperatureSensor";
import PauseManagement from "./PauseManagement";
import ManualTimerDisplay from "./ManualTimer";

const App: React.FC = () => {
  const { connectionStatus, sensors, brewStatus } = useStore();

  return (
    <div className="app-container">
      <h1>Управление системой</h1>
      <p className="status">
        Статус подключения: <strong>{connectionStatus}</strong>
      </p>

      {/* Мониторинг температуры */}
      <div className="section temperature">
        <h2>Мониторинг температуры</h2>
        <TemperatureSensor
          label="Датчик 1"
          temperature={sensors.sensor1_temp}
          address={sensors.sensor1_address}
        />
        <TemperatureSensor
          label="Датчик 2"
          temperature={sensors.sensor2_temp}
          address={sensors.sensor2_address}
        />
      </div>

      {/* Переключатель режима работы */}
      <ModeSwitcher />

      {/* Управление паузами */}
      <PauseManagement />

      {/* Управление насосом */}
      <PumpControl />

      {/* Управление SSR */}
      <SSRControl />

      {/* Статус процесса */}
      <BrewStatus status={brewStatus} />

      <ManualTimerDisplay />
    </div>
  );
};

export default App;

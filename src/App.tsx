import React, { useState, useEffect, useRef } from "react";
import "./App.css";
import Pause from "./Pause";
import PauseControls from "./PauseControls";
import ModeSwitcher from "./ModeSwitcher";
import TimeControl from "./TimeControl";
import PowerControl from "./PowerControl";
import BrewStatus from "./BrewStatus";
import PumpControl from "./PumpControl";
import SSRControl from "./SSRControl";
import TemperatureSensor from "./TemperatureSensor";

interface TemperatureState {
  sensor1_address: string;
  sensor1_temp: string;
  sensor2_address: string;
  sensor2_temp: string;
}

const App: React.FC = () => {
  const [temperature, setTemperature] = useState<TemperatureState>({
    sensor1_address: "",
    sensor1_temp: "0",
    sensor2_address: "",
    sensor2_temp: "0",
  });

  const [pumpState, setPumpState] = useState({ enabled: false, pwm: 0 });
  const [ssrState, setSsrState] = useState({ enabled: false, pwm: 0 });
  const [connectionStatus, setConnectionStatus] =
    useState<string>("Disconnected");
  const [pauseCount, setPauseCount] = useState<number>(1);
  const [isAutomatic, setIsAutomatic] = useState<boolean>(true);
  const [time, setTime] = useState<number>(19);
  const [power, setPower] = useState<number>(51);
  const [brewStatus, setBrewStatus] = useState<string>("Ожидание, ошибок нет");

  const wsRef = useRef<WebSocket | null>(null);

  useEffect(() => {
    const ws = new WebSocket("ws://192.168.50.201:81/");
    wsRef.current = ws;

    ws.onopen = () => setConnectionStatus("Connected");

    ws.onmessage = (event) => {
      const data = JSON.parse(event.data);
      if (data.operation_mode !== undefined) {
        setIsAutomatic(data.operation_mode === "automatic");
      }
      if (data.sensor1_temp !== undefined && data.sensor2_temp !== undefined) {
        setTemperature({
          sensor1_address: data.sensor1_address || "",
          sensor1_temp: data.sensor1_temp || "0",
          sensor2_address: data.sensor2_address || "",
          sensor2_temp: data.sensor2_temp || "0",
        });
      }
      if (data.pump_enabled !== undefined && data.pump_pwm !== undefined) {
        setPumpState({
          enabled: data.pump_enabled,
          pwm: data.pump_pwm,
        });
      }
      if (data.ssr_enabled !== undefined && data.ssr_pwm !== undefined) {
        setSsrState({
          enabled: data.ssr_enabled,
          pwm: data.ssr_pwm,
        });
      }
      if (data.brew_status !== undefined) {
        setBrewStatus(data.brew_status || "Ожидание, ошибок нет");
      }
    };

    ws.onclose = () => setConnectionStatus("Disconnected");
    ws.onerror = (error) => console.error("WebSocket error:", error);

    return () => ws.close();
  }, []);

  const sendMessage = (message: string) => {
    if (wsRef.current && wsRef.current.readyState === WebSocket.OPEN) {
      wsRef.current.send(message);
    } else {
      console.error("WebSocket is not connected");
    }
  };

  const handleModeChange = () => {
    const newMode = isAutomatic ? "manual" : "automatic";
    sendMessage(`SET_MODE:${newMode}`);
    setIsAutomatic(!isAutomatic); // Локальное обновление
  };

  const handleStart = () => {
    sendMessage("START_PROCESS");
    setBrewStatus("Процесс запущен");
  };

  const handlePause = () => {
    sendMessage("PAUSE_PROCESS");
    setBrewStatus("Процесс приостановлен");
  };

  const handleStop = () => {
    sendMessage("STOP_PROCESS");
    setBrewStatus("Процесс остановлен");
  };

  return (
    <div className='app-container'>
      <h1>Управление системой</h1>
      <p className='status'>
        Статус подключения: <strong>{connectionStatus}</strong>
      </p>

      <div className='section temperature'>
        <h2>Мониторинг температуры</h2>
        <TemperatureSensor
          label='Датчик 1'
          temperature={temperature.sensor1_temp}
          address={temperature.sensor1_address}
        />
        <TemperatureSensor
          label='Датчик 2'
          temperature={temperature.sensor2_temp}
          address={temperature.sensor2_address}
        />
      </div>

      <ModeSwitcher
        isAutomatic={isAutomatic}
        setIsAutomatic={handleModeChange}
      />

      {isAutomatic && (
        <>
          <PauseControls
            pauseCount={pauseCount}
            setPauseCount={setPauseCount}
            sendMessage={sendMessage}
          />
          {[...Array(pauseCount)].map((_, index) => (
            <Pause
              key={index}
              index={index + 1}
              sendMessage={sendMessage}
            />
          ))}
        </>
      )}

      <TimeControl
        time={time}
        setTime={setTime}
      />
      <PowerControl
        power={power}
        setPower={setPower}
      />
      <BrewStatus status={brewStatus} />

      <PumpControl
        pumpState={pumpState}
        setPumpPWM={(pwm: number) => sendMessage(`SET_PWM:${pwm}`)}
        togglePump={() => sendMessage("TOGGLE_PUMP")}
      />

      <SSRControl
        ssrState={ssrState}
        setSSRPWM={(pwm: number) => sendMessage(`SET_SSR_PWM:${pwm}`)}
        toggleSSR={() => sendMessage("TOGGLE_SSR")}
      />

      <div className='section controls'>
        <h2>Управление процессом</h2>
        <button
          className='control-button start'
          onClick={handleStart}
        >
          Старт
        </button>
        <button
          className='control-button pause'
          onClick={handlePause}
        >
          Пауза
        </button>
        <button
          className='control-button stop'
          onClick={handleStop}
        >
          Стоп
        </button>
      </div>
    </div>
  );
};

export default App;

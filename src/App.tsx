import React, { useState, useEffect, useRef } from "react";
import "./App.css"; // Подключаем кастомный CSS для стиля

const App = () => {
  const [temperature, setTemperature] = useState({
    sensor1_address: "",
    sensor1_temp: "0",
    sensor2_address: "",
    sensor2_temp: "0",
  });
  const [pumpState, setPumpState] = useState({ enabled: false, pwm: 0 });
  const [ssrState, setSsrState] = useState({ enabled: false, pwm: 0 });
  const [connectionStatus, setConnectionStatus] = useState("Disconnected");

  const wsRef = useRef(null);

  useEffect(() => {
    // Подключение к WebSocket
    const ws = new WebSocket("ws://192.168.50.201:81/");
    wsRef.current = ws;

    ws.onopen = () => {
      setConnectionStatus("Connected");
    };

    ws.onmessage = (event) => {
      const data = JSON.parse(event.data);
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
    };

    ws.onclose = () => {
      setConnectionStatus("Disconnected");
    };

    ws.onerror = (error) => {
      console.error("WebSocket error:", error);
    };

    return () => {
      ws.close();
    };
  }, []);

  const sendMessage = (message) => {
    if (wsRef.current && wsRef.current.readyState === WebSocket.OPEN) {
      wsRef.current.send(message);
    } else {
      console.error("WebSocket is not connected");
    }
  };

  const togglePump = () => {
    sendMessage("TOGGLE_PUMP");
  };

  const setPumpPWM = (pwm) => {
    sendMessage(`SET_PWM:${pwm}`);
  };

  const toggleSSR = () => {
    sendMessage("TOGGLE_SSR");
  };

  const setSSRPWM = (pwm) => {
    sendMessage(`SET_SSR_PWM:${pwm}`);
  };

  return (
    <div className="app-container">
      <h1>Управление насосом и SSR</h1>
      <p className="status">
        Статус подключения: <strong>{connectionStatus}</strong>
      </p>

      <div className="section temperature">
        <h2>Мониторинг температуры</h2>
        <div className="row">
          <span>Датчик 1:</span>
          <span>
            {temperature.sensor1_temp !== null
              ? `${temperature.sensor1_temp} °C`
              : "Загрузка..."}
          </span>
        </div>
        <div className="row">
          <span>Датчик 2:</span>
          <span>
            {temperature.sensor2_temp !== null
              ? `${temperature.sensor2_temp} °C`
              : "Загрузка..."}
          </span>
        </div>
      </div>

      <div className="section control">
        <h2>Управление насосом</h2>
        <div className="row">
          <span>Состояние:</span>
          <span>{pumpState.enabled ? "ВКЛ" : "ВЫКЛ"}</span>
        </div>
        <div className="row">
          <span>Мощность:</span>
          <span>{pumpState.pwm}%</span>
        </div>
        <input
          type="range"
          min="0"
          max="100"
          step="5"
          value={pumpState.pwm}
          onChange={(e) => setPumpPWM(Number(e.target.value))}
        />
        <button onClick={togglePump} className="toggle-button">
          {pumpState.enabled ? "Выключить насос" : "Включить насос"}
        </button>
      </div>

      <div className="section control">
        <h2>Управление SSR</h2>
        <div className="row">
          <span>Состояние:</span>
          <span>{ssrState.enabled ? "ВКЛ" : "ВЫКЛ"}</span>
        </div>
        <div className="row">
          <span>Мощность:</span>
          <span>{ssrState.pwm}%</span>
        </div>
        <input
          type="range"
          min="0"
          max="100"
          step="5"
          value={ssrState.pwm}
          onChange={(e) => setSSRPWM(Number(e.target.value))}
        />
        <button onClick={toggleSSR} className="toggle-button">
          {ssrState.enabled ? "Выключить SSR" : "Включить SSR"}
        </button>
      </div>
    </div>
  );
};

export default App;

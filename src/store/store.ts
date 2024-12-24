import { create } from "zustand";

interface Pause {
  temperature: number;
  hysteresis: number;
  time: number;
}

interface SensorState {
  sensor1_address: string;
  sensor1_temp: string;
  sensor2_address: string;
  sensor2_temp: string;
}

interface PumpState {
  enabled: boolean;
  pwm: number;
}

interface SSRState {
  enabled: boolean;
  pwm: number;
}

interface AppState {
  connectionStatus: string;
  sensors: SensorState;
  pumpState: PumpState;
  ssrState: SSRState;
  pauses: Pause[];
  brewStatus: string;
  isAutomatic: boolean;

  // Actions
  setConnectionStatus: (status: string) => void;
  setSensors: (sensors: SensorState) => void;
  setPumpState: (state: PumpState) => void;
  setSSRState: (state: SSRState) => void;
  setBrewStatus: (status: string) => void;
  toggleMode: () => void;
  syncWithServer: () => void;
  sendMessage: (message: string) => void;

  startProcess: () => void;
  pauseProcess: () => void;
  stopProcess: () => void;

  setPauses: (pauses: Pause[]) => void;
  updatePause: (index: number, updatedPause: Pause) => void;
  addPause: (newPause: Pause) => void;
  removePause: (index: number) => void;
}

const useStore = create<AppState>((set, get) => {
  let ws: WebSocket | null = null;

  const initializeWebSocket = () => {
    if (!ws || ws.readyState === WebSocket.CLOSED) {
      ws = new WebSocket("ws://192.168.31.167:80");

      ws.onopen = () => {
        set({ connectionStatus: "Connected" });
      };

      ws.onmessage = (event) => {
        const data = JSON.parse(event.data);

        if (data.operationMode !== undefined) {
          set({ isAutomatic: data.operationMode === "automatic" });
        }

        if (data.sensors) {
          set((state) => ({
            sensors: {
              ...state.sensors,
              ...data.sensors,
            },
          }));
        }

        if (data.control) {
          if (data.control.pump_enabled !== undefined) {
            set((state) => ({
              pumpState: {
                ...state.pumpState,
                enabled: data.control.pump_enabled,
                pwm: data.control.pump_pwm,
              },
            }));
          }

          if (data.control.ssr_enabled !== undefined) {
            set((state) => ({
              ssrState: {
                ...state.ssrState,
                enabled: data.control.ssr_enabled,
                pwm: data.control.ssr_pwm,
              },
            }));
          }
        }

        if (data.brew_status !== undefined) {
          set({ brewStatus: data.brew_status || "Ожидание, ошибок нет" });
        }

        if (data.pauses) {
          set({
            pauses: data.pauses.map((pause: any) => ({
              temperature: pause.temp,
              hysteresis: pause.hysteresis,
              time: pause.time,
            })),
          });
        }
      };

      ws.onclose = () => {
        set({ connectionStatus: "Disconnected" });
      };

      ws.onerror = (error) => {
        console.error("WebSocket error:", error);
      };
    }
  };

  const sendMessageToServer = (message: string) => {
    if (ws && ws.readyState === WebSocket.OPEN) {
      ws.send(message);
    } else {
      console.error("WebSocket is not connected");
    }
  };

  return {
    connectionStatus: "Disconnected",
    sensors: {
      sensor1_address: "",
      sensor1_temp: "0",
      sensor2_address: "",
      sensor2_temp: "0",
    },
    pumpState: { enabled: false, pwm: 0 },
    ssrState: { enabled: false, pwm: 0 },
    brewStatus: "Ожидание, ошибок нет",
    isAutomatic: true,
    pauses: [],

    setConnectionStatus: (status) => set({ connectionStatus: status }),
    setSensors: (sensors) =>
      set((state) => ({
        sensors: { ...state.sensors, ...sensors },
      })),
    setPumpState: (state) => {
      set({ pumpState: state });
      sendMessageToServer(`SET_PUMP:${state.enabled}:${state.pwm}`);
    },
    setSSRState: (state) => {
      set({ ssrState: state });
      sendMessageToServer(`SET_SSR:${state.enabled}:${state.pwm}`);
    },
    setBrewStatus: (status) => set({ brewStatus: status }),
    setPauses: (pauses) => set({ pauses }),

    toggleMode: () => {
      const newMode = !get().isAutomatic;
      set({ isAutomatic: newMode });
      sendMessageToServer(`SET_MODE:${newMode ? "automatic" : "manual"}`);
    },

    startProcess: () => {
      sendMessageToServer("START_PROCESS");
      set({ brewStatus: "Процесс запущен" });
    },
    pauseProcess: () => {
      sendMessageToServer("PAUSE_PROCESS");
      set({ brewStatus: "Процесс приостановлен" });
    },
    stopProcess: () => {
      sendMessageToServer("STOP_PROCESS");
      set({ brewStatus: "Процесс остановлен" });
    },

    updatePause: (index, updatedPause) => {
      const pauses = [...get().pauses];
      pauses[index] = updatedPause;
      set({ pauses });
      sendMessageToServer(
        `UPDATE_PAUSE:${index}:${updatedPause.temperature}:${updatedPause.hysteresis}:${updatedPause.time}`
      );
    },
    addPause: (newPause) => {
      const pauses = [...get().pauses, newPause];
      set({ pauses });
      sendMessageToServer(
        `ADD_PAUSE:${newPause.temperature}:${newPause.hysteresis}:${newPause.time}`
      );
    },
    removePause: (index) => {
      const pauses = get().pauses.filter((_, i) => i !== index);
      set({ pauses });
      sendMessageToServer(`REMOVE_PAUSE:${index}`);
    },

    syncWithServer: initializeWebSocket,
    sendMessage: sendMessageToServer,
  };
});

export default useStore;

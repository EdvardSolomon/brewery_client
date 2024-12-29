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
  remainingTime: number;

  setConnectionStatus: (status: string) => void;
  setSensors: (sensors: SensorState) => void;
  setPumpState: (
    state: PumpState | ((prevState: PumpState) => PumpState)
  ) => void;
  setSSRState: (state: SSRState | ((prevState: SSRState) => SSRState)) => void;
  setBrewStatus: (status: string) => void;
  toggleMode: () => void;

  startProcess: () => void;
  pauseProcess: () => void;
  stopProcess: () => void;

  setRemainingTime: (time: number) => void;

  setPauses: (pauses: Pause[]) => void;
  updatePause: (index: number, updatedPause: Pause) => void;
  addPause: (newPause: Pause) => void;
  removePause: (index: number) => void;

  updateData: (data) => void;
}

const useStore = create<AppState>()((set, get) => {
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
    remainingTime: 0,

    setConnectionStatus: (status) => set({ connectionStatus: status }),
    setSensors: (sensors) =>
      set((state) => ({
        sensors: { ...state.sensors, ...sensors },
      })),
    setPumpState: (state: PumpState | ((prevState: PumpState) => PumpState)) =>
      set((currentState) => ({
        pumpState:
          typeof state === "function" ? state(currentState.pumpState) : state,
      })),
    setSSRState: (state: SSRState | ((prevState: SSRState) => SSRState)) =>
      set((currentState) => ({
        ssrState:
          typeof state === "function" ? state(currentState.ssrState) : state,
      })),
    setBrewStatus: (status) => set({ brewStatus: status }),
    setPauses: (pauses) => set({ pauses }),
    setRemainingTime: (time) => set({ remainingTime: time }),

    toggleMode: () => {
      const newMode = !get().isAutomatic;
      set({ isAutomatic: newMode });
    },

    startProcess: () => {
      set({ brewStatus: "Процесс запущен" });
    },
    pauseProcess: () => {
      set({ brewStatus: "Процесс приостановлен" });
    },
    stopProcess: () => {
      set({ brewStatus: "Процесс остановлен" });
    },

    updatePause: (index, updatedPause) => {
      const pauses = [...get().pauses];
      pauses[index] = updatedPause;
      set({ pauses });
    },
    addPause: (newPause) => {
      const pauses = [...get().pauses, newPause];
      set({ pauses });
    },
    removePause: (index) => {
      const pauses = get().pauses.filter((_, i) => i !== index);
      set({ pauses });
    },

    updateData: (data) => set({ ...data }),
  };
});

export default useStore;

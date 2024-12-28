import React, { createContext, useContext, useEffect, ReactNode } from "react";
import useStore from "../store/store";

// Определяем тип контекста
interface WebSocketContextType {
  sendMessage: (data: object) => void;
}

// Создаём контекст
const WebSocketContext = createContext<WebSocketContextType | null>(null);

let ws: WebSocket | null = null;

// Провайдер для WebSocket
export const WebSocketProvider: React.FC<{ children: ReactNode }> = ({
  children,
}) => {
  const updateData = useStore((state) => state.updateData);

  // Функция отправки сообщений
  const sendMessage = (data: object) => {
    if (ws && ws.readyState === WebSocket.OPEN) {
      ws.send(JSON.stringify(data));
    } else {
      console.warn("WebSocket is not connected.");
    }
  };

  // Подключение WebSocket
  useEffect(() => {
    if (!ws || ws.readyState === WebSocket.CLOSED) {
      ws = new WebSocket("ws://localhost:8080");

      ws.onopen = () => {
        console.log("Connected to WebSocket server");
        updateData({ connectionStatus: "Connected" });
      };

      ws.onmessage = (event) => {
        const data = JSON.parse(event.data);
        console.log("Received data:", data);
        updateData(data);
      };

      ws.onerror = (error) => {
        console.error("WebSocket error:", error);
        updateData({ connectionStatus: "Disconnected" });
      };

      ws.onclose = () => {
        console.log("WebSocket connection closed");
        updateData({ connectionStatus: "Disconnected" });
      };
    }

    // Закрываем соединение при размонтировании
    return () => {
      if (ws) {
        ws.close();
        ws = null;
      }
    };
  }, [updateData]);

  // Возвращаем провайдер с контекстом
  return (
    <WebSocketContext.Provider value={{ sendMessage }}>
      {children}
    </WebSocketContext.Provider>
  );
};

// Хук для использования контекста
export const useWebSocketContext = () => {
  const context = useContext(WebSocketContext);
  if (!context) {
    throw new Error(
      "useWebSocketContext must be used within a WebSocketProvider"
    );
  }
  return context;
};

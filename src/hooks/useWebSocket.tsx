import React, { createContext, useContext, useEffect, ReactNode } from "react";
import useStore from "../store/store";

interface WebSocketContextType {
  sendMessage: (data: object) => void;
}

const WebSocketContext = createContext<WebSocketContextType | null>(null);

let ws: WebSocket | null = null;

export const WebSocketProvider: React.FC<{ children: ReactNode }> = ({
  children,
}) => {
  const updateData = useStore((state) => state.updateData);

  const sendMessage = (data: object) => {
    if (ws && ws.readyState === WebSocket.OPEN) {
      ws.send(JSON.stringify(data));
    } else {
      console.warn("WebSocket is not connected.");
    }
  };

  useEffect(() => {
    if (!ws || ws.readyState === WebSocket.CLOSED) {
      ws = new WebSocket("ws://192.168.31.167:8080");

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

    return () => {
      if (ws) {
        ws.close();
        ws = null;
      }
    };
  }, [updateData]);

  return (
    <WebSocketContext.Provider value={{ sendMessage }}>
      {children}
    </WebSocketContext.Provider>
  );
};

export const useWebSocketContext = () => {
  const context = useContext(WebSocketContext);
  if (!context) {
    throw new Error(
      "useWebSocketContext must be used within a WebSocketProvider"
    );
  }
  return context;
};

import { useSerialContext } from "context/SerialContext";
import React, { createContext, useState, useContext, useEffect } from "react";

type MessageContextType = {
  messages: string[];
  setMessages: React.Dispatch<React.SetStateAction<string[]>>;
};

const MessageContext = createContext<MessageContextType | undefined>(undefined);

export const MessageProvider: React.FC<{ children: React.ReactNode }> = ({
  children,
}) => {
  const { ipcRenderer } = useSerialContext();
  const [messages, setMessages] = useState<string[]>([]);

  useEffect(() => {
    const initPort = () => {
      ipcRenderer.send("serial-disconnect");
      setTimeout(() => {
        ipcRenderer.send("serial-connect");
      }, 1000);
    };

    initPort(); // 초기 마운트 시 실행

    const handleSerialData = (_event: any, data: string) => {
      const now = new Date();
      const utcTimestamp = `${String(now.getUTCHours()).padStart(2, "0")}:${String(
        now.getUTCMinutes()
      ).padStart(2, "0")}:${String(now.getUTCSeconds()).padStart(2, "0")}`;
      
      setMessages((prev) => [...prev, `[UTC ${utcTimestamp}] RX: ${data}`]);
    };
    
    const handleSentData = (_event: any, data: string) => {
      const now = new Date();
      const utcTimestamp = `${String(now.getUTCHours()).padStart(2, "0")}:${String(
        now.getUTCMinutes()
      ).padStart(2, "0")}:${String(now.getUTCSeconds()).padStart(2, "0")}`;
      
      setMessages((prev) => [...prev, `[UTC ${utcTimestamp}] TX: ${data}`]);
    };

    ipcRenderer.on("serial-data", handleSerialData);
    ipcRenderer.on("serial-sent", handleSentData);

    return () => {
      ipcRenderer.removeListener("serial-data", handleSerialData);
      ipcRenderer.removeListener("serial-sent", handleSentData);
    };
  }, [ipcRenderer]);

  return (
    <MessageContext.Provider value={{ messages, setMessages }}>
      {children}
    </MessageContext.Provider>
  );
};

export const useMessages = () => {
  const context = useContext(MessageContext);
  if (!context)
    throw new Error("useMessages must be used within MessageProvider");
  return context;
};

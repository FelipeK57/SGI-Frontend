// context/ClientProviderContext.tsx
import { createContext, useContext, useState } from "react";

type ReloadContextType = {
  reload: boolean;
  setReload: (reload: boolean) => void;
};

const ReloadContext = createContext<ReloadContextType | undefined>(undefined);

export const ReloadProvider = ({ children }: { children: React.ReactNode }) => {
  const [reload, setReload] = useState(false);
  return (
    <ReloadContext.Provider value={{ reload, setReload }}>
      {children}
    </ReloadContext.Provider>
  );
};

export const useReload = () => {
  const context = useContext(ReloadContext);
  if (!context) {
    throw new Error("useReload debe usarse dentro de ReloadProvider");
  }
  return context;
};

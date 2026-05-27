import { createContext, PropsWithChildren, useContext } from "react";
import { create } from "zustand";

type AppStore = {
  appName: string;
};

const useAppStore = create<AppStore>(() => ({
  appName: "project-1"
}));

const AppContext = createContext({ useAppStore });

export function AppContextProvider({ children }: PropsWithChildren) {
  return <AppContext.Provider value={{ useAppStore }}>{children}</AppContext.Provider>;
}

export function useAppContext() {
  return useContext(AppContext);
}

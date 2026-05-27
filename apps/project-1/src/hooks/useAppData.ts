import { useAppContext } from "@/context/AppContext";

export function useAppData() {
  const { useAppStore } = useAppContext();
  const appName = useAppStore((state) => state.appName);
  return { appName };
}

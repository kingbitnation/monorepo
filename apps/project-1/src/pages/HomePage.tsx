import { motion } from "framer-motion";
import { useAppData } from "@/hooks/useAppData";

export function HomePage() {
  const { appName } = useAppData();

  return (
    <section>
      <motion.h2 initial={{ opacity: 0 }} animate={{ opacity: 1 }}>
        {appName}
      </motion.h2>
      <p>Migrated React application scaffold, ready for HTML-to-JSX integration.</p>
    </section>
  );
}

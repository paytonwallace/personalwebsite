"use client";

import { useState, useCallback } from "react";
import { AnimatePresence, motion } from "framer-motion";
import LoadingScreen from "@/components/LoadingScreen";
import CustomCursor from "@/components/Cursor";
import Sidebar from "@/components/Sidebar";
import Hero from "@/components/Hero";
import About from "@/components/About";
import Tools from "@/components/Tools";
import Generosity from "@/components/Generosity";
import LifeMd from "@/components/LifeMd";
import Connect from "@/components/Connect";
import Games from "@/components/Games";
import Footer from "@/components/Footer";

export type Page = "home" | "about" | "tools" | "generosity" | "life" | "connect" | "games";

export type SectionProps = {
  isActive: boolean;
  onNavigate?: (page: Page) => void;
};

export default function Home() {
  const [loaded, setLoaded] = useState(false);
  const [activePage, setActivePage] = useState<Page>("home");

  const navigate = useCallback((page: Page) => setActivePage(page), []);

  const sections: Record<Page, React.FC<SectionProps>> = {
    home:       Hero,
    about:      About,
    tools:      Tools,
    generosity: Generosity,
    life:       LifeMd,
    connect:    Connect,
    games:      Games,
  };

  const ActiveSection = sections[activePage];

  return (
    <>
      <CustomCursor />
      <LoadingScreen onComplete={() => setLoaded(true)} />

      <AnimatePresence>
        {loaded && (
          <motion.div
            key="site"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.55 }}
            className="layout-root"
          >
            <Sidebar activePage={activePage} onNavigate={navigate} />

            <main className="main-content" style={{ position: "relative" }}>
              <AnimatePresence mode="wait">
                <motion.div
                  key={activePage}
                  initial={{ opacity: 0, y: 14 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -10 }}
                  transition={{ duration: 0.25, ease: "easeInOut" }}
                  style={{ minHeight: "100vh" }}
                >
                  <ActiveSection isActive={true} onNavigate={navigate} />
                  {activePage === "home" && <Footer />}
                </motion.div>
              </AnimatePresence>
            </main>

          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}


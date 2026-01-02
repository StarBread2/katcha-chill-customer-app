/* Swiper */
import "swiper/css";
import "swiper/css/pagination";

//for some reason red ang font
import "@fontsource/bebas-neue/400.css";

import "@fontsource/montserrat/100.css";
import "@fontsource/montserrat/200.css";
import "@fontsource/montserrat/300.css";
import "@fontsource/montserrat/400.css";
import "@fontsource/montserrat/500.css";
import "@fontsource/montserrat/600.css";
import "@fontsource/montserrat/700.css";
import "@fontsource/montserrat/800.css";
import "@fontsource/montserrat/900.css";

import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'

import './index.css'
import App from './App.tsx'

import { AuthProvider } from "./auth/AuthProvider"; 
// USER CONTEXT
import { UserProvider } from "./context/UserContext.tsx";
// PROGRESS CONTEXT
import { ProgressProvider } from "./context/ProgressContext.tsx";
// CROWD HISTORY CONTEXT
import { CrowdHistoryProvider } from "./context/CrowdHistoryContext.tsx";

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <AuthProvider>
      <UserProvider>
        <ProgressProvider>
          <CrowdHistoryProvider>
            <App />
          </CrowdHistoryProvider>
        </ProgressProvider>
      </UserProvider>
    </AuthProvider>
  </StrictMode>,
)

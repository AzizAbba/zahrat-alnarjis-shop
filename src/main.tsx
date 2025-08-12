import { createRoot } from 'react-dom/client'
import { BrowserRouter, HashRouter } from 'react-router-dom'
import App from './App.tsx'
import './index.css'

const RouterComponent = (typeof window !== 'undefined' && window.location.hostname.includes('github.io'))
  ? HashRouter
  : BrowserRouter

createRoot(document.getElementById("root")!).render(
  <RouterComponent>
    <App />
  </RouterComponent>
);

import {StrictMode} from 'react';
import {createRoot} from 'react-dom/client';
import App from './App.tsx';
import { LogicEngineProvider } from './components/LogicEngineContext.tsx';
import './index.css';

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <LogicEngineProvider>
      <App />
    </LogicEngineProvider>
  </StrictMode>,
);

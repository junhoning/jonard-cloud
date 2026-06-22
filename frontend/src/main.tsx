import React from 'react'
import ReactDOM from 'react-dom/client'
import {
  IngradientGlobalStyle,
  IngradientThemeProvider,
} from '@ingradient/ui/tokens'
import { App } from './App'
import '@ingradient/ui/tokens.css'
import './app.css'

ReactDOM.createRoot(document.getElementById('root')!).render(
  <React.StrictMode>
    <IngradientThemeProvider>
      <IngradientGlobalStyle />
      <App />
    </IngradientThemeProvider>
  </React.StrictMode>,
)

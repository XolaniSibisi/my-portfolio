import React from 'react';
import './App.css';
import 'bootstrap/dist/css/bootstrap.min.css';
import { BrowserRouter } from 'react-router-dom';
import { ThemeProvider } from 'styled-components';
import useDarkMode from './hooks/useDarkMode';
import AppContext from './AppContext';
import MainApp from './MainApp';
import GlobalStyles from './theme/GlobalStyles';
import { lightTheme, darkTheme } from './theme/themes';

function App() {
  // Destructure across multiple lines to satisfy object-curly-newline
  const {
    isDark,
    toggle,
    setDark,
    setLight,
  } = useDarkMode();

  // Use object shorthand + multiline to satisfy both rules
  const darkMode = {
    value: isDark,
    toggle,
    setDark,
    setLight,
  };

  return (
    <AppContext.Provider value={{ darkMode }}>
      <ThemeProvider theme={isDark ? darkTheme : lightTheme}>
        <GlobalStyles />
        <div className="App">
          <BrowserRouter>
            <MainApp />
          </BrowserRouter>
        </div>
      </ThemeProvider>
    </AppContext.Provider>
  );
}

export default App;

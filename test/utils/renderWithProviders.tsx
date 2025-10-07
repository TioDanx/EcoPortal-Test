import { ReactNode } from 'react';
import { render } from '@testing-library/react';
import { Provider } from 'react-redux';
import { ThemeProvider } from '@mui/material/styles';
import { appTheme } from '../../src/theme';
import { createStore } from '../../src/state/store';

export const renderWithProviders = (ui: ReactNode) => {
  const store = createStore({ epicDependencies: { client: {} as any } });
  const Wrapper = ({ children }: { children: ReactNode }) => (
    <Provider store={store}>
      <ThemeProvider theme={appTheme}>{children}</ThemeProvider>
    </Provider>
  );
  return { store, ...render(<Wrapper>{ui}</Wrapper>) };
};

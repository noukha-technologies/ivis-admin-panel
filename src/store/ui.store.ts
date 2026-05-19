/**
 * UI Store — manages theme and sidebar state.
 * Replace with Redux/Zustand when you integrate a state manager.
 */
export interface UIState {
  sidebarOpen: boolean;
  theme: 'light' | 'dark';
}

export const initialUIState: UIState = {
  sidebarOpen: true,
  theme: 'light',
};

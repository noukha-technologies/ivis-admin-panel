import type { IntakeState } from '../features/intake/IntakeContext';

const INTAKE_KEY = 'ivis_intake_session';

export function loadIntakeSession(): IntakeState {
  try {
    const raw = localStorage.getItem(INTAKE_KEY);
    if (!raw) return {};
    return JSON.parse(raw) as IntakeState;
  } catch {
    return {};
  }
}

export function saveIntakeSession(state: IntakeState): void {
  localStorage.setItem(INTAKE_KEY, JSON.stringify(state));
}

export function clearIntakeSession(): void {
  localStorage.removeItem(INTAKE_KEY);
}

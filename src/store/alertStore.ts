import { create } from 'zustand';

type Alert = {
    id: string,
    message: string,
    type?: 'success' | 'error' | 'info' | 'warning'
}
;

interface AlertState {
    alerts: Alert[];
    addAlert: (message: string, type?: Alert['type']) => void;
    removeAlert: (id: string) => void;
}

const useAlertStore = create<AlertState>((set) => ({
    alerts: [],
    addAlert: (message, type = 'info') => {
        const id = Date.now().toString();
        set((state) => ({
            alerts: [...state.alerts, { id, message, type }]
        }));

        setTimeout(() => {
            set((state) => ({
                alerts: state.alerts.filter(alert => alert.id !== id)
            }));
        }, 5000);
    },
    removeAlert: (id) => set((state) => ({
        alerts: state.alerts.filter(alert => alert.id !== id)
    }))
}))

export default useAlertStore;
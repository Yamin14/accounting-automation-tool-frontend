import { CheckCircle, XCircle, AlertCircle, Info, X } from 'lucide-react';
import useAlertStore from '../../store/alertStore';

const Alert = () => {
  const { alerts, removeAlert } = useAlertStore();

  const getAlertStyles = (type: string) => {
    switch (type) {
      case 'success':
        return {
          container: 'bg-green-50/95 border-green-200 text-green-800',
          icon: 'text-green-600',
          button: 'text-green-600 hover:bg-green-100',
          Icon: CheckCircle
        };
      case 'error':
        return {
          container: 'bg-red-50/95 border-red-200 text-red-800',
          icon: 'text-red-600',
          button: 'text-red-600 hover:bg-red-100',
          Icon: XCircle
        };
      case 'warning':
        return {
          container: 'bg-yellow-50/95 border-yellow-200 text-yellow-800',
          icon: 'text-yellow-600',
          button: 'text-yellow-600 hover:bg-yellow-100',
          Icon: AlertCircle
        };
      case 'info':
      default:
        return {
          container: 'bg-blue-50/95 border-blue-200 text-blue-800',
          icon: 'text-blue-600',
          button: 'text-blue-600 hover:bg-blue-100',
          Icon: Info
        };
    }
  };

  if (alerts.length === 0) return null;

  return (
    <div className="fixed top-4 left-1/2 transform -translate-x-1/2 z-50 w-full max-w-md px-4 space-y-2">
      {alerts.map((alert) => {
        const styles = getAlertStyles(alert.type || 'info');
        const IconComponent = styles.Icon;

        return (
          <div
            key={alert.id}
            className={`${styles.container} border rounded-xl shadow-lg backdrop-blur-xl p-4 flex items-center justify-between animate-in slide-in-from-top duration-300`}
          >
            <div className="flex items-center space-x-3 flex-1">
              <IconComponent className={`h-6 w-6 ${styles.icon} flex-shrink-0`} />
              <p className="font-medium text-sm">{alert.message}</p>
            </div>
            <button
              onClick={() => removeAlert(alert.id)}
              className={`${styles.button} rounded-lg p-1.5 transition-colors duration-200 focus:outline-none focus:ring-2 focus:ring-offset-2 ml-2 flex-shrink-0`}
            >
              <X className="h-4 w-4" />
            </button>
          </div>
        );
      })}
    </div>
  );
};

export default Alert;
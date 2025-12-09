import { Loader2 } from 'lucide-react';

interface SpinnerProps {
  text?: string;
}

function Spinner({ text = 'Loading...' }: SpinnerProps) {
  return (
    <div className="flex flex-col items-center justify-center min-h-screen">
      <Loader2 className="h-16 w-16 animate-spin text-blue-600" />
      <p className="mt-4 text-lg font-medium text-gray-700">{text}</p>
    </div>
  );
}

export default Spinner;
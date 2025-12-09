import React, { useCallback, useState } from 'react';
import { Send } from 'lucide-react';

const ChatInput: React.FC<{ onSend: (text: string) => void }> = ({ onSend }) => {
  const [value, setValue] = useState('');

  const submit = useCallback((e?: React.FormEvent) => {
    e?.preventDefault();
    const trimmed = value.trim();
    if (!trimmed) return;
    onSend(trimmed);
    setValue('');
  }, [value, onSend]);

  return (
    <form onSubmit={submit} className="flex gap-3">
      <input
        value={value}
        onChange={e => setValue(e.target.value)}
        placeholder="Ask about profit margins, liquidity, debt levels, recommendations..."
        className="flex-1 p-3 border rounded-xl focus:ring-2 focus:ring-blue-500"
      />
      <button type="submit" className="px-4 py-2 bg-blue-600 text-white rounded-xl disabled:opacity-50" disabled={!value.trim()}>
        <Send className="h-4 w-4" />
      </button>
    </form>
  );
};

export default React.memo(ChatInput);
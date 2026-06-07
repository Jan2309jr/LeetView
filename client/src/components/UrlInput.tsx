import { useState, useRef, type KeyboardEvent } from 'react';
import { Plus, X, Loader2, Link } from 'lucide-react';
import { extractUsername } from '../lib/utils';
import toast from 'react-hot-toast';

interface UrlInputProps {
  onAdd: (username: string) => Promise<boolean>;
  existingUsernames: string[];
}

export function UrlInput({ onAdd, existingUsernames }: UrlInputProps) {
  const [value, setValue] = useState('');
  const [isAdding, setIsAdding] = useState(false);
  const inputRef = useRef<HTMLInputElement>(null);

  const handleAdd = async () => {
    const trimmed = value.trim();
    if (!trimmed) return;

    const username = extractUsername(trimmed);
    if (!username) {
      toast.error('Invalid URL. Use: https://leetcode.com/u/username/');
      return;
    }

    const isDuplicate = existingUsernames.some(
      (u) => u.toLowerCase() === username.toLowerCase()
    );
    if (isDuplicate) {
      toast.error(`"${username}" is already being tracked.`);
      return;
    }

    setIsAdding(true);
    try {
      const added = await onAdd(username);
      if (added) {
        setValue('');
        inputRef.current?.focus();
        toast.success(`Added ${username}!`);
      }
    } catch (err: unknown) {
      const msg = err instanceof Error ? err.message : 'Failed to add profile';
      toast.error(msg);
    } finally {
      setIsAdding(false);
    }
  };

  const handleKey = (e: KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Enter') handleAdd();
  };

  return (
    <div className="p-5 bg-[#0e4735] rounded-xl shadow-sm text-white">
      <div className="flex items-center gap-2 mb-4">
        <Link className="w-5 h-5 text-emerald-400" />
        <h2 className="text-base font-semibold">Add Profile</h2>
      </div>

      <div className="flex flex-col sm:flex-row gap-3 items-stretch sm:items-center">
        <div className="flex-1 relative">
          <input
            ref={inputRef}
            id="profile-url-input"
            type="text"
            className="w-full py-2.5 px-0 bg-transparent border-0 border-b border-emerald-700 text-white placeholder-emerald-100/50 focus:ring-0 focus:border-emerald-400 text-sm"
            placeholder="Paste LeetCode Profile URL — e.g. https://leetcode.com/u/username/"
            value={value}
            onChange={(e) => setValue(e.target.value)}
            onKeyDown={handleKey}
            disabled={isAdding}
          />
        </div>

        <div className="flex gap-3">
          <button
            id="add-profile-btn"
            className="flex items-center gap-2 px-4 py-2 rounded-lg bg-[#dcfce7] text-[#065f46] font-medium text-sm hover:bg-[#bbf7d0] transition-colors"
            onClick={handleAdd}
            disabled={isAdding || !value.trim()}
          >
            {isAdding ? (
              <Loader2 className="w-4 h-4 animate-spin" />
            ) : (
              <Plus className="w-4 h-4" />
            )}
            <span>Add Profile</span>
          </button>

          <button
            id="clear-input-btn"
            className="flex items-center gap-1.5 px-3 py-2 rounded-lg text-emerald-100 hover:bg-white/10 transition-colors text-sm"
            onClick={() => { setValue(''); inputRef.current?.focus(); }}
            disabled={!value}
          >
            <X className="w-4 h-4" />
            <span>Clear</span>
          </button>
        </div>
      </div>

      <p className="mt-3 text-[11px] text-emerald-100/60">
        Supports: <code className="font-mono text-emerald-300">https://leetcode.com/u/username/</code> or just a username
      </p>
    </div>
  );
}

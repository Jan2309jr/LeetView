import { useState, useRef } from 'react';
import { Upload, FileText, Loader2, ChevronDown, ChevronUp } from 'lucide-react';
import { extractUsername } from '../lib/utils';
import toast from 'react-hot-toast';

interface BulkImportProps {
  onAddMany: (usernames: string[]) => Promise<{ added: number; skipped: number }>;
}

export function BulkImport({ onAddMany }: BulkImportProps) {
  const [isOpen, setIsOpen] = useState(false);
  const [text, setText] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const fileRef = useRef<HTMLInputElement>(null);

  const parseUrls = (raw: string): string[] => {
    return raw
      .split(/[\n,;]+/)
      .map((line) => line.trim())
      .filter(Boolean)
      .map(extractUsername)
      .filter((u): u is string => u !== null);
  };

  const handleImport = async (urls: string) => {
    const usernames = parseUrls(urls);
    if (usernames.length === 0) {
      toast.error('No valid LeetCode URLs found.');
      return;
    }
    setIsLoading(true);
    try {
      const { added, skipped } = await onAddMany(usernames);
      toast.success(`Added ${added} profile${added !== 1 ? 's' : ''}${skipped > 0 ? ` (${skipped} skipped)` : ''}`);
      setText('');
    } catch {
      toast.error('Bulk import failed. Please try again.');
    } finally {
      setIsLoading(false);
    }
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    const reader = new FileReader();
    reader.onload = (evt) => {
      const content = evt.target?.result as string;
      // Strip CSV header row if it contains "profile_url"
      const lines = content.split('\n').filter((l) => !l.toLowerCase().includes('profile_url'));
      handleImport(lines.join('\n'));
    };
    reader.readAsText(file);
    e.target.value = '';
  };

  return (
    <div className="bg-[#0e4735] rounded-xl shadow-sm text-white overflow-hidden">
      <button
        className="w-full flex items-center justify-between px-5 py-4 text-sm font-semibold text-white hover:bg-white/5 transition-colors"
        onClick={() => setIsOpen((v) => !v)}
        id="bulk-import-toggle"
      >
        <div className="flex items-center gap-2">
          <Upload className="w-5 h-5 text-emerald-400" />
          <span className="text-base">Bulk Import</span>
          <span className="px-2 py-0.5 rounded-full text-[10px] font-bold bg-[#115e45] text-emerald-100 uppercase tracking-wider ml-1">
            Optional
          </span>
        </div>
        {isOpen ? <ChevronUp className="w-5 h-5 text-emerald-100" /> : <ChevronDown className="w-5 h-5 text-emerald-100" />}
      </button>

      {isOpen && (
        <div className="px-5 pb-5 space-y-4 animate-slide-up">
          <p className="text-xs text-emerald-100/70 pt-2 border-t border-emerald-800/50">
            Paste multiple URLs (one per line) or upload a CSV with a <code className="font-mono text-emerald-300">profile_url</code> column.
          </p>

          <textarea
            id="bulk-import-textarea"
            className="w-full min-h-[100px] resize-y font-mono text-xs p-3 rounded-lg bg-[#0a3326] border border-emerald-800/50 text-white placeholder-emerald-100/30 focus:outline-none focus:border-emerald-500 focus:ring-1 focus:ring-emerald-500"
            placeholder={`https://leetcode.com/u/user1/\nhttps://leetcode.com/u/user2/\nhttps://leetcode.com/u/user3/`}
            value={text}
            onChange={(e) => setText(e.target.value)}
            disabled={isLoading}
          />

          <div className="flex items-center gap-3">
            <button
              id="bulk-import-btn"
              className="flex items-center gap-2 px-4 py-2 rounded-lg bg-[#dcfce7] text-[#065f46] font-medium text-sm hover:bg-[#bbf7d0] transition-colors"
              onClick={() => handleImport(text)}
              disabled={isLoading || !text.trim()}
            >
              {isLoading ? <Loader2 className="w-4 h-4 animate-spin" /> : <Upload className="w-4 h-4" />}
              Import URLs
            </button>

            <button
              id="csv-upload-btn"
              className="flex items-center gap-1.5 px-3 py-2 rounded-lg text-emerald-100 hover:bg-white/10 transition-colors text-sm"
              onClick={() => fileRef.current?.click()}
              disabled={isLoading}
            >
              <FileText className="w-4 h-4" />
              Upload CSV
            </button>

            <input
              ref={fileRef}
              type="file"
              accept=".csv,.txt"
              className="hidden"
              onChange={handleFileChange}
            />
          </div>

          {/* Example CSV format */}
          <div className="p-3 bg-[#0a3326]/50 rounded-lg border border-dashed border-emerald-800/50">
            <p className="text-[11px] text-emerald-100/60 font-mono leading-relaxed">
              profile_url<br />
              https://leetcode.com/u/user1/<br />
              https://leetcode.com/u/user2/
            </p>
          </div>
        </div>
      )}
    </div>
  );
}

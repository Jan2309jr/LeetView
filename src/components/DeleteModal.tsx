import { AlertTriangle, X } from 'lucide-react';

interface DeleteModalProps {
  username: string;
  onConfirm: () => void;
  onCancel: () => void;
}

export function DeleteModal({ username, onConfirm, onCancel }: DeleteModalProps) {
  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center p-4"
      role="dialog"
      aria-modal="true"
      aria-labelledby="delete-modal-title"
    >
      {/* Backdrop */}
      <div
        className="absolute inset-0 bg-black/40 backdrop-blur-sm animate-fade-in"
        onClick={onCancel}
      />

      {/* Modal */}
      <div className="relative bg-white dark:bg-gray-900 rounded-2xl shadow-2xl p-6 max-w-sm w-full animate-slide-up border border-gray-200 dark:border-gray-700">
        <button
          className="absolute top-4 right-4 text-gray-400 hover:text-gray-600 dark:hover:text-gray-300 transition-colors"
          onClick={onCancel}
          aria-label="Close"
          id="delete-modal-close"
        >
          <X className="w-5 h-5" />
        </button>

        <div className="flex items-center gap-3 mb-4">
          <div className="p-2.5 bg-red-100 dark:bg-red-900/30 rounded-xl">
            <AlertTriangle className="w-5 h-5 text-red-500" />
          </div>
          <h2 id="delete-modal-title" className="text-base font-semibold text-gray-900 dark:text-white">
            Remove Profile
          </h2>
        </div>

        <p className="text-sm text-gray-600 dark:text-gray-400 mb-6">
          Are you sure you want to remove{' '}
          <span className="font-semibold text-gray-900 dark:text-white">{username}</span>?
          This will stop tracking this profile.
        </p>

        <div className="flex gap-3">
          <button
            id="delete-modal-cancel"
            className="btn-secondary flex-1 justify-center"
            onClick={onCancel}
          >
            Cancel
          </button>
          <button
            id="delete-modal-confirm"
            className="btn-danger flex-1 justify-center"
            onClick={onConfirm}
          >
            Delete
          </button>
        </div>
      </div>
    </div>
  );
}

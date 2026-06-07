import {
  useState,
  useMemo,
  useRef,
  useCallback,
  useEffect,
} from 'react';
import {
  useReactTable,
  getCoreRowModel,
  getSortedRowModel,
  getFilteredRowModel,
  getPaginationRowModel,
  flexRender,
  type ColumnDef,
  type SortingState,
} from '@tanstack/react-table';
import { useVirtualizer } from '@tanstack/react-virtual';
import {
  ArrowUpDown,
  ArrowUp,
  ArrowDown,
  Trash2,
  RefreshCw,
  Search,
  Download,
  Loader2,
  ExternalLink,
  AlertCircle,
  ChevronLeft,
  ChevronRight,
} from 'lucide-react';
import { formatDistanceToNow } from 'date-fns';
import { cn, formatNumber, formatAcceptance } from '../lib/utils';
import { DeleteModal } from './DeleteModal';
import type { LeetCodeProfile } from '../types';

interface ProfileRow {
  username: string;
  data: LeetCodeProfile | null;
  isLoading: boolean;
  isFetching: boolean;
  error: string | null;
  fetchedAt: string | null;
}

interface ProfileTableProps {
  profiles: ProfileRow[];
  onDelete: (username: string) => void;
  onRefresh: (username: string) => void;
}


const DEBOUNCE_MS = 300;

function useDebounce<T>(value: T, delay: number): T {
  const [debounced, setDebounced] = useState(value);
  useEffect(() => {
    const t = setTimeout(() => setDebounced(value), delay);
    return () => clearTimeout(t);
  }, [value, delay]);
  return debounced;
}

function DifficultyPill({
  count,
  type,
}: {
  count: number | undefined;
  type: 'easy' | 'medium' | 'hard';
}) {
  const colors = {
    easy: 'bg-[#ebfbf3] text-[#15803d]',
    medium: 'bg-[#fffbeb] text-[#d97706]',
    hard: 'bg-[#fef2f2] text-[#dc2626]',
  };
  return (
    <span className={cn('badge', colors[type])}>
      {count ?? '—'}
    </span>
  );
}

export function ProfileTable({ profiles, onDelete, onRefresh }: ProfileTableProps) {
  const [sorting, setSorting] = useState<SortingState>([]);
  const [globalFilter, setGlobalFilter] = useState('');
  const [deleteTarget, setDeleteTarget] = useState<string | null>(null);
  const debouncedFilter = useDebounce(globalFilter, DEBOUNCE_MS);
  const tableContainerRef = useRef<HTMLDivElement>(null);

  const columns = useMemo<ColumnDef<ProfileRow>[]>(
    () => [
      {
        id: 'username',
        accessorKey: 'username',
        header: 'Username',
        cell: ({ row }) => {
          const { username, isLoading, isFetching, error } = row.original;
          return (
            <div className="flex items-center gap-2">
              <a
                href={`https://leetcode.com/u/${username}/`}
                target="_blank"
                rel="noopener noreferrer"
                className="font-semibold text-[#059669] hover:text-[#047857] hover:underline flex items-center gap-1.5 transition-colors"
              >
                {username}
                <ExternalLink className="w-3.5 h-3.5 opacity-50" />
              </a>
              {isFetching && !isLoading && (
                <Loader2 className="w-3 h-3 animate-spin text-gray-400" />
              )}
              {error && (
                <span title={error}>
                  <AlertCircle className="w-3 h-3 text-red-400" />
                </span>
              )}
            </div>
          );
        },
        enableSorting: true,
      },
      {
        id: 'totalSolved',
        accessorFn: (row) => row.data?.totalSolved ?? -1,
        header: 'Total Solved',
        cell: ({ row }) =>
          row.original.isLoading ? (
            <Loader2 className="w-4 h-4 animate-spin text-gray-300" />
          ) : (
            <span className="font-semibold text-gray-900">
              {formatNumber(row.original.data?.totalSolved)}
            </span>
          ),
        enableSorting: true,
      },
      {
        id: 'easySolved',
        accessorFn: (row) => row.data?.easySolved ?? -1,
        header: 'Easy',
        cell: ({ row }) =>
          row.original.isLoading ? null : (
            <DifficultyPill count={row.original.data?.easySolved} type="easy" />
          ),
        enableSorting: true,
      },
      {
        id: 'mediumSolved',
        accessorFn: (row) => row.data?.mediumSolved ?? -1,
        header: 'Medium',
        cell: ({ row }) =>
          row.original.isLoading ? null : (
            <DifficultyPill count={row.original.data?.mediumSolved} type="medium" />
          ),
        enableSorting: true,
      },
      {
        id: 'hardSolved',
        accessorFn: (row) => row.data?.hardSolved ?? -1,
        header: 'Hard',
        cell: ({ row }) =>
          row.original.isLoading ? null : (
            <DifficultyPill count={row.original.data?.hardSolved} type="hard" />
          ),
        enableSorting: true,
      },
      {
        id: 'acceptanceRate',
        accessorFn: (row) => row.data?.acceptanceRate ?? -1,
        header: 'Acceptance',
        cell: ({ row }) => (
          <span className="text-gray-600">
            {formatAcceptance(row.original.data?.acceptanceRate)}
          </span>
        ),
        enableSorting: true,
      },
      {
        id: 'ranking',
        accessorFn: (row) => row.data?.ranking ?? Infinity,
        header: 'Ranking',
        cell: ({ row }) => (
          <span className="font-mono text-xs text-gray-500">
            {formatNumber(row.original.data?.ranking)}
          </span>
        ),
        enableSorting: true,
      },
      {
        id: 'contestRating',
        accessorFn: (row) => row.data?.contestRating ?? -1,
        header: 'Contest',
        cell: ({ row }) => {
          const rating = row.original.data?.contestRating;
          if (rating == null) return <span className="text-gray-400">—</span>;
          const color =
            rating >= 2400
              ? 'text-red-500'
              : rating >= 2000
              ? 'text-orange-500'
              : rating >= 1600
              ? 'text-yellow-500'
              : 'text-gray-600';
          return <span className={cn('font-semibold', color)}>{rating}</span>;
        },
        enableSorting: true,
      },
      {
        id: 'fetchedAt',
        accessorFn: (row) => row.fetchedAt,
        header: 'Last Updated',
        cell: ({ row }) => {
          const at = row.original.fetchedAt;
          if (!at) return <span className="text-gray-400 text-xs">—</span>;
          return (
            <span className="text-xs text-gray-400" title={at}>
              {formatDistanceToNow(new Date(at), { addSuffix: true })}
            </span>
          );
        },
        enableSorting: false,
      },
      {
        id: 'actions',
        header: 'Actions',
        cell: ({ row }) => {
          const { username, isLoading } = row.original;
          return (
            <div className="flex items-center gap-1">
              <button
                title="Refresh"
                className="p-1.5 rounded-lg text-gray-400 hover:text-brand-600 hover:bg-brand-50 transition-colors"
                onClick={() => onRefresh(username)}
                disabled={isLoading}
                id={`refresh-${username}`}
              >
                <RefreshCw className={cn('w-3.5 h-3.5', isLoading && 'animate-spin')} />
              </button>
              <button
                title="Delete"
                className="p-1.5 rounded-lg text-gray-400 hover:text-red-500 hover:bg-red-50 transition-colors"
                onClick={() => setDeleteTarget(username)}
                id={`delete-${username}`}
              >
                <Trash2 className="w-3.5 h-3.5" />
              </button>
            </div>
          );
        },
        enableSorting: false,
      },
    ],
    [onRefresh]
  );

  const table = useReactTable({
    data: profiles,
    columns,
    state: { sorting, globalFilter: debouncedFilter },
    onSortingChange: setSorting,
    onGlobalFilterChange: setGlobalFilter,
    getCoreRowModel: getCoreRowModel(),
    getSortedRowModel: getSortedRowModel(),
    getFilteredRowModel: getFilteredRowModel(),
    getPaginationRowModel: getPaginationRowModel(),
    initialState: { pagination: { pageSize: 25 } },
  });

  const { rows } = table.getRowModel();

  // Virtualizer — only active when > 50 rows for performance
  const rowVirtualizer = useVirtualizer({
    count: rows.length,
    getScrollElement: () => tableContainerRef.current,
    estimateSize: () => 52,
    overscan: 10,
  });

  const useVirtual = profiles.length > 50;
  const virtualRows = rowVirtualizer.getVirtualItems();
  const totalSize = rowVirtualizer.getTotalSize();
  const paddingTop = useVirtual && virtualRows.length > 0 ? virtualRows[0]?.start ?? 0 : 0;
  const paddingBottom =
    useVirtual && virtualRows.length > 0
      ? totalSize - (virtualRows[virtualRows.length - 1]?.end ?? 0)
      : 0;

  // CSV export
  const handleExportCSV = useCallback(() => {
    const headers = [
      'username', 'totalSolved', 'easySolved', 'mediumSolved', 'hardSolved',
      'acceptanceRate', 'ranking', 'contestRating', 'fetchedAt',
    ];
    const rows = profiles.map((p) => [
      p.username,
      p.data?.totalSolved ?? '',
      p.data?.easySolved ?? '',
      p.data?.mediumSolved ?? '',
      p.data?.hardSolved ?? '',
      p.data?.acceptanceRate ?? '',
      p.data?.ranking ?? '',
      p.data?.contestRating ?? '',
      p.data?.fetchedAt ?? '',
    ]);
    const csv = [headers, ...rows].map((r) => r.join(',')).join('\n');
    const blob = new Blob([csv], { type: 'text/csv' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `leetview-export-${Date.now()}.csv`;
    a.click();
    URL.revokeObjectURL(url);
  }, [profiles]);

  const displayRows = useVirtual ? virtualRows.map((vr) => rows[vr.index]) : rows;

  return (
    <>
      {deleteTarget && (
        <DeleteModal
          username={deleteTarget}
          onConfirm={() => { onDelete(deleteTarget); setDeleteTarget(null); }}
          onCancel={() => setDeleteTarget(null)}
        />
      )}

      <div className="card overflow-hidden">
        {/* Toolbar */}
        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 px-5 py-4 border-b border-gray-100">
          <div className="relative w-full max-w-sm">
            <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
            <input
              type="text"
              placeholder="Search usernames..."
              value={globalFilter ?? ''}
              onChange={(e) => setGlobalFilter(e.target.value)}
              className="w-full pl-10 pr-4 py-2 bg-white border border-gray-200 rounded-lg text-sm text-gray-900 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-[#059669] focus:border-transparent transition-all shadow-sm"
            />
          </div>

          <div className="flex items-center gap-4 w-full sm:w-auto">
            <span className="text-xs font-medium text-gray-500 whitespace-nowrap">
              {table.getFilteredRowModel().rows.length} of {profiles.length}
            </span>
            <button
              onClick={handleExportCSV}
              className="flex items-center gap-2 px-4 py-2 bg-white border border-gray-200 rounded-lg text-sm font-semibold text-gray-700 hover:bg-gray-50 hover:border-gray-300 transition-all shadow-sm"
            >
              <Download className="w-4 h-4" />
              Export CSV
            </button>
          </div>
        </div>

        {/* Table */}
        <div
          ref={tableContainerRef}
          className="overflow-auto"
          style={{ maxHeight: useVirtual ? '600px' : undefined }}
        >
          <table className="w-full min-w-[900px] table-fixed">
            <thead className="sticky top-0 z-10 bg-gray-50/90/90 backdrop-blur-sm">
              {table.getHeaderGroups().map((headerGroup) => (
                <tr key={headerGroup.id} className="border-b border-gray-200">
                  {headerGroup.headers.map((header) => (
                    <th key={header.id} className={cn('px-4 py-4 text-left text-[11px] font-bold text-gray-500 tracking-wider', header.id === 'username' && 'w-48')}>
                      {header.column.getCanSort() ? (
                        <button
                          className="flex items-center gap-1.5 hover:text-gray-900 transition-colors"
                          onClick={header.column.getToggleSortingHandler()}
                        >
                          {flexRender(header.column.columnDef.header, header.getContext())}
                          {header.column.getIsSorted() === 'asc' ? (
                            <ArrowUp className="w-3 h-3" />
                          ) : header.column.getIsSorted() === 'desc' ? (
                            <ArrowDown className="w-3 h-3" />
                          ) : (
                            <ArrowUpDown className="w-3 h-3 opacity-40" />
                          )}
                        </button>
                      ) : (
                        flexRender(header.column.columnDef.header, header.getContext())
                      )}
                    </th>
                  ))}
                </tr>
              ))}
            </thead>

            <tbody>
              {useVirtual && paddingTop > 0 && (
                <tr><td style={{ height: paddingTop }} colSpan={columns.length} /></tr>
              )}

              {displayRows.map((row, i) => (
                row && (
                  <tr
                    key={row.id}
                    className={cn(
                      'tr-hover border-b border-gray-100 last:border-0 row-appear',
                      row.original.error && 'opacity-60'
                    )}
                    style={useVirtual ? { animationDelay: '0ms' } : { animationDelay: `${i * 20}ms` }}
                  >
                    {row.getVisibleCells().map((cell) => (
                      <td key={cell.id} className="td">
                        {flexRender(cell.column.columnDef.cell, cell.getContext())}
                      </td>
                    ))}
                  </tr>
                )
              ))}

              {useVirtual && paddingBottom > 0 && (
                <tr><td style={{ height: paddingBottom }} colSpan={columns.length} /></tr>
              )}
            </tbody>
          </table>
        </div>

        {/* Pagination */}
        {!useVirtual && (
          <div className="flex flex-col sm:flex-row items-center justify-between gap-4 px-5 py-4 border-t border-gray-100">
            <div className="flex items-center gap-3 text-sm text-gray-600">
              <span className="font-medium">Rows per page:</span>
              <select
                value={table.getState().pagination.pageSize}
                onChange={(e) => table.setPageSize(Number(e.target.value))}
                className="bg-white border border-gray-200 text-gray-900 rounded-lg focus:ring-[#059669] focus:border-[#059669] p-1.5 cursor-pointer font-semibold shadow-sm"
              >
                {[10, 25, 50, 100].map((pageSize) => (
                  <option key={pageSize} value={pageSize}>
                    {pageSize}
                  </option>
                ))}
              </select>
            </div>

            <div className="flex items-center gap-2">
              <button
                className="p-2 border border-gray-200 rounded-lg hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed transition-colors text-gray-600 shadow-sm"
                onClick={() => table.previousPage()}
                disabled={!table.getCanPreviousPage()}
              >
                <ChevronLeft className="w-4 h-4" />
              </button>
              
              <div className="flex items-center justify-center min-w-[2rem] h-9 bg-[#ebfbf3] text-[#059669] font-bold rounded-lg text-sm">
                {table.getState().pagination.pageIndex + 1}
              </div>

              <button
                className="p-2 border border-gray-200 rounded-lg hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed transition-colors text-gray-600 shadow-sm"
                onClick={() => table.nextPage()}
                disabled={!table.getCanNextPage()}
              >
                <ChevronRight className="w-4 h-4" />
              </button>
            </div>
          </div>
        )}
      </div>
    </>
  );
}

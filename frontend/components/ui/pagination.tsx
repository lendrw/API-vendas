type Props = {
  current: number;
  last: number;
  onChange: (page: number) => void;
};

export default function Pagination({ current, last, onChange }: Props) {
  if (last <= 1) return null;
  return (
    <div className="flex items-center justify-between mt-5">
      <p className="text-sm text-slate-500">
        Page <span className="font-medium text-slate-700">{current}</span> of{" "}
        <span className="font-medium text-slate-700">{last}</span>
      </p>
      <div className="flex gap-2">
        <button
          onClick={() => onChange(current - 1)}
          disabled={current === 1}
          className="px-4 py-2 rounded-xl border border-slate-200 text-sm font-medium text-slate-700 hover:bg-slate-50 disabled:opacity-40 disabled:cursor-not-allowed transition-colors"
        >
          Previous
        </button>
        <button
          onClick={() => onChange(current + 1)}
          disabled={current === last}
          className="px-4 py-2 rounded-xl border border-slate-200 text-sm font-medium text-slate-700 hover:bg-slate-50 disabled:opacity-40 disabled:cursor-not-allowed transition-colors"
        >
          Next
        </button>
      </div>
    </div>
  );
}

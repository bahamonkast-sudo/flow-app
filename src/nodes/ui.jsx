export function Toggle({ on, onChange }) {
  return (
    <button
      type="button"
      onClick={(e) => { e.stopPropagation(); onChange(); }}
      className={`nodrag relative inline-flex h-5 w-9 shrink-0 items-center rounded-full transition-colors ${
        on ? 'bg-emerald-500 shadow-[0_0_10px_#10b981]' : 'bg-slate-700'
      }`}
    >
      <span
        className={`inline-block h-4 w-4 transform rounded-full bg-white transition-transform ${
          on ? 'translate-x-4' : 'translate-x-0.5'
        }`}
      />
    </button>
  );
}

export function Slider({ value, min, max, step, onChange, disabled }) {
  return (
    <input
      type="range"
      min={min}
      max={max}
      step={step}
      value={value}
      disabled={disabled}
      onChange={(e) => onChange(Number(e.target.value))}
      className="funnel-slider nodrag w-full"
    />
  );
}

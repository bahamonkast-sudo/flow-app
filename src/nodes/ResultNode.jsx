import { Handle, Position } from '@xyflow/react';
import { TriangleAlert, ShieldCheck } from 'lucide-react';
import { useFunnelStore, selectHealth } from '../store/useFunnelStore';

const RATES = [
  { label: 'Filtro Telegram', value: '40% inicia el bot' },
  { label: 'Fondeo en broker', value: '15% fondea' },
  { label: 'Retención base', value: '50% +10% por módulo' },
];

export default function ResultNode() {
  const h = useFunnelStore(selectHealth);
  const optimal = h.optimal;

  return (
    <div className={`w-[320px] rounded-2xl bg-gradient-to-b from-slate-900 to-slate-950 border-2 p-5 ${
      optimal
        ? 'border-emerald-500/50 shadow-[0_0_35px_-5px_rgba(16,185,129,0.3)]'
        : 'border-red-500/50 shadow-[0_0_35px_-5px_rgba(239,68,68,0.3)]'
    }`}>
      <Handle id="in" type="target" position={Position.Left} className="bg-emerald-400! w-3! h-3! border-2! border-slate-950!" />

      <div className="flex items-center justify-between pb-3 border-b border-slate-800">
        <span className="text-xs font-mono text-slate-400 tracking-wider">TERMINAL DE SALUD</span>
        <span className={`text-[10px] font-bold px-2 py-0.5 rounded-full animate-pulse border ${
          optimal
            ? 'bg-emerald-500/20 text-emerald-300 border-emerald-500/30'
            : 'bg-red-500/20 text-red-300 border-red-500/30'
        }`}>
          ● EN VIVO
        </span>
      </div>

      <div className="py-4 text-center">
        <div className="text-4xl font-extrabold text-white tracking-tight">{h.score}%</div>
        <div className={`text-xs font-semibold mt-1 uppercase tracking-wider ${optimal ? 'text-emerald-400' : 'text-red-400'}`}>
          {optimal ? 'Ecosistema Blindado' : 'Sistema Vulnerable'}
        </div>
        <p className="text-[11px] text-slate-400 mt-1">
          {optimal
            ? 'Captación, Filtro, Señales Binomo y Academia en sinergia'
            : 'Riesgo alto de fuga de usuarios y quema de cuentas'}
        </p>
      </div>

      <div className="space-y-1.5 pt-2 border-t border-slate-800 text-xs">
        {RATES.map(({ label, value }, i) => (
          <div key={i} className="flex justify-between py-1 px-2 rounded bg-slate-950/80 text-slate-300">
            <span>{label}</span>
            <span className="font-mono text-emerald-400 font-bold">{value}</span>
          </div>
        ))}
      </div>

      {h.alerts.length > 0 && (
        <div className="mt-2.5 space-y-1.5">
          {h.alerts.map((a, i) => (
            <div key={i} className="rounded-xl border border-red-500/20 bg-red-500/10 px-2.5 py-2">
              <div className="flex items-start gap-1.5 text-[10px] font-bold text-red-300">
                {a.canal === '' ? <TriangleAlert size={13} className="mt-px shrink-0" /> : <ShieldCheck size={13} className="mt-px shrink-0" />}
                <span>{a.canal === '' ? 'Crítico' : `${a.canal}`}</span>
              </div>
              <div className="mt-0.5 pl-5 text-[10px] leading-relaxed text-red-200/80">{a.msg}</div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

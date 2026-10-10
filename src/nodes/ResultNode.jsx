import { Handle, Position } from '@xyflow/react';
import { HeartPulse, Filter, Wallet, GraduationCap, BadgeDollarSign, TriangleAlert, ShieldCheck } from 'lucide-react';
import { useFunnelStore, selectHealth } from '../store/useFunnelStore';

const RATES = [
  { Icon: Filter, label: 'Filtro Telegram', value: '40% inicia el bot' },
  { Icon: Wallet, label: 'Fondeo en broker', value: '15% fondea' },
  { Icon: GraduationCap, label: 'Retención base', value: '50% +10% por módulo' },
  { Icon: BadgeDollarSign, label: 'Comisión por trader', value: 'USD 35 (referencial)' },
];

export default function ResultNode() {
  const h = useFunnelStore(selectHealth);
  const optimal = h.optimal;

  return (
    <div className={`w-72 rounded-xl border-2 bg-slate-900/95 p-4 text-slate-100 backdrop-blur ${
      optimal
        ? 'border-emerald-400 shadow-[0_0_35px_rgba(16,185,129,0.35)]'
        : 'border-red-500/70 shadow-[0_0_35px_rgba(239,68,68,0.25)]'
    }`}>
      <Handle id="in" type="target" position={Position.Left} className="bg-emerald-400! w-3! h-3!" />
      <div className="mb-2 flex items-center gap-2">
        <HeartPulse size={18} className={optimal ? 'text-emerald-400' : 'text-red-400'} />
        <div>
          <div className="text-[13px] font-semibold">Diagnóstico de Salud</div>
          <div className="text-[10px] text-slate-400">Ecosistema · en vivo</div>
        </div>
        <span className={`ml-auto flex items-center gap-1 rounded-full px-2 py-0.5 text-[9px] font-bold ${
          optimal ? 'bg-emerald-500/15 text-emerald-400' : 'bg-red-500/15 text-red-400'
        }`}>
          <span className={`h-1.5 w-1.5 animate-pulse rounded-full ${optimal ? 'bg-emerald-400' : 'bg-red-400'}`} /> LIVE
        </span>
      </div>

      <div className={`mb-2 rounded-lg px-2 py-2 text-center ${optimal ? 'bg-emerald-500/10' : 'bg-red-500/10'}`}>
        <div className="text-[10px] uppercase tracking-wide text-slate-400">Salud del sistema</div>
        <div className={`text-lg font-bold ${optimal ? 'text-emerald-300' : 'text-red-300'}`}>{h.status}</div>
        <div className="text-[10px] text-slate-400">
          {optimal
            ? '(Captación, Filtro, Retención y Recuperación activos)'
            : '(Riesgo alto de fuga de usuarios y quema de cuentas)'}
        </div>
      </div>

      <div className="mb-1 text-[10px] uppercase tracking-wide text-slate-500">Tasas del mecanismo</div>
      <div className="space-y-1">
        {RATES.map(({ Icon, label, value }, i) => (
          <div key={i} className="flex items-center justify-between rounded-lg bg-slate-800/70 px-2 py-1">
            <div className="flex items-center gap-2 text-[11px] text-slate-300">
              <Icon size={13} className="text-slate-400" /> {label}
            </div>
            <span className="text-[11px] font-semibold text-slate-100">{value}</span>
          </div>
        ))}
      </div>

      {h.alerts.length > 0 && (
        <div className="mt-2 space-y-1">
          {h.alerts.map((a, i) => (
            <div key={i} className="rounded-lg bg-red-500/10 px-2 py-1.5">
              <div className="flex items-start gap-1.5 text-[10px] font-semibold text-red-300">
                {a.canal === '' ? <TriangleAlert size={13} className="mt-px shrink-0" /> : <ShieldCheck size={13} className="mt-px shrink-0" />}
                <span>{a.canal === '' ? '' : `${a.canal}: `}</span>
              </div>
              <div className="mt-0.5 pl-5 text-[10px] leading-relaxed text-red-200/80">{a.msg}</div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

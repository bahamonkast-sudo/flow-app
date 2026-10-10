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
    <div className={`node-card w-80 rounded-2xl border-2 bg-slate-900/95 p-4 text-slate-100 backdrop-blur ${
      optimal
        ? 'border-emerald-400 shadow-[0_0_40px_rgba(16,185,129,0.4)]'
        : 'border-red-500/70 shadow-[0_0_40px_rgba(239,68,68,0.3)]'
    }`}>
      <Handle id="in" type="target" position={Position.Left} className="bg-emerald-400! w-3! h-3!" />
      <div className="mb-3 flex items-center gap-2.5">
        <span className={`flex h-9 w-9 items-center justify-center rounded-xl ${optimal ? 'bg-emerald-500/15 text-emerald-400' : 'bg-red-500/15 text-red-400'}`}>
          <HeartPulse size={18} />
        </span>
        <div>
          <div className="text-[13px] font-bold tracking-tight text-white">Diagnóstico de Salud</div>
          <div className="text-[10px] font-medium uppercase tracking-wider text-slate-500">Ecosistema · en vivo</div>
        </div>
        <span className={`ml-auto flex items-center gap-1.5 rounded-full px-2.5 py-1 text-[9px] font-extrabold tracking-wider ${
          optimal ? 'bg-emerald-500/15 text-emerald-400' : 'bg-red-500/15 text-red-400'
        }`}>
          <span className={`h-1.5 w-1.5 animate-pulse rounded-full ${optimal ? 'bg-emerald-400' : 'bg-red-400'}`} /> LIVE
        </span>
      </div>

      <div className={`mb-3 rounded-xl px-3 py-2.5 ${optimal ? 'bg-emerald-500/10' : 'bg-red-500/10'}`}>
        <div className="mb-1 flex items-baseline justify-between">
          <div className="text-[10px] font-bold uppercase tracking-widest text-slate-400">Salud del sistema</div>
          <div className={`text-[11px] font-extrabold ${optimal ? 'text-emerald-300' : 'text-red-300'}`}>{h.score} pts</div>
        </div>
        <div className="h-2 overflow-hidden rounded-full bg-slate-800">
          <div
            className="h-full rounded-full transition-all duration-500"
            style={{
              width: `${h.score}%`,
              background: optimal ? 'linear-gradient(90deg,#059669,#10b981)' : 'linear-gradient(90deg,#b91c1c,#ef4444)',
              boxShadow: optimal ? '0 0 12px #10b981' : '0 0 12px #ef4444',
            }}
          />
        </div>
        <div className={`mt-1.5 text-center text-[15px] font-extrabold tracking-tight ${optimal ? 'text-emerald-300' : 'text-red-300'}`}>{h.status}</div>
        <div className="text-center text-[10px] text-slate-500">
          {optimal
            ? '(Captación, Filtro, Retención y Recuperación activos)'
            : '(Riesgo alto de fuga de usuarios y quema de cuentas)'}
        </div>
      </div>

      <div className="mb-1.5 text-[10px] font-bold uppercase tracking-widest text-slate-500">Tasas del mecanismo</div>
      <div className="space-y-1">
        {RATES.map(({ Icon, label, value }, i) => (
          <div key={i} className="flex items-center justify-between rounded-xl bg-slate-800/60 px-2.5 py-1.5">
            <div className="flex items-center gap-2 text-[11px] font-medium text-slate-300">
              <Icon size={14} className="text-slate-500" /> {label}
            </div>
            <span className="text-[11px] font-bold text-slate-100">{value}</span>
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

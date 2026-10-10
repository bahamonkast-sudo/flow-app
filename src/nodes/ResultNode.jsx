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
    <div className={`neumorphic w-[320px] rounded-2xl p-5 ${
      optimal
        ? 'border-2 border-emerald-300/60'
        : 'border-2 border-red-300/60'
    }`}>
      <Handle id="in" type="target" position={Position.Left} className="neo-handle" />

      <div className="flex items-center justify-between pb-3 border-b border-neutral-300/50">
        <span className="text-xs font-mono text-neutral-500 tracking-wider">TERMINAL DE SALUD</span>
        <span className={`text-[10px] font-bold px-2 py-0.5 rounded-full animate-pulse border ${
          optimal
            ? 'bg-emerald-100/80 text-emerald-700 border-emerald-300/60'
            : 'bg-red-100/80 text-red-700 border-red-300/60'
        }`}>
          ● EN VIVO
        </span>
      </div>

      <div className="py-4 text-center">
        <div className="text-4xl font-extrabold text-neutral-900 tracking-tight">{h.score}%</div>
        <div className={`text-xs font-semibold mt-1 uppercase tracking-wider ${optimal ? 'text-emerald-600' : 'text-red-600'}`}>
          {optimal ? 'Ecosistema Blindado' : 'Sistema Vulnerable'}
        </div>
        <p className="text-[11px] text-neutral-500 mt-1">
          {optimal
            ? 'Captación, Filtro, Señales Binomo y Academia en sinergia'
            : 'Riesgo alto de fuga de usuarios y quema de cuentas'}
        </p>
      </div>

      <div className="space-y-1.5 pt-2 border-t border-neutral-300/50 text-xs">
        {RATES.map(({ label, value }, i) => (
          <div key={i} className="flex justify-between py-1 px-2 rounded bg-neutral-200/60 text-neutral-700">
            <span>{label}</span>
            <span className="font-mono font-bold text-emerald-600">{value}</span>
          </div>
        ))}
      </div>

      {h.alerts.length > 0 && (
        <div className="mt-2.5 space-y-1.5">
          {h.alerts.map((a, i) => (
            <div key={i} className="rounded-xl border border-red-300/60 bg-red-50/80 px-2.5 py-2">
              <div className="flex items-start gap-1.5 text-[10px] font-bold text-red-700">
                {a.canal === '' ? <TriangleAlert size={13} className="mt-px shrink-0" /> : <ShieldCheck size={13} className="mt-px shrink-0" />}
                <span>{a.canal === '' ? 'Crítico' : `${a.canal}`}</span>
              </div>
              <div className="mt-0.5 pl-5 text-[10px] leading-relaxed text-red-600">{a.msg}</div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
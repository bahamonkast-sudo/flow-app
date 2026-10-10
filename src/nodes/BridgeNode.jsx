import { Handle, Position } from '@xyflow/react';
import { Send, UserPlus, Wallet, BadgeCheck } from 'lucide-react';
import { useFunnelStore, selectMetrics, fmt } from '../store/useFunnelStore';

const STEPS = [
  { Icon: Send, label: 'Presentación del modelo' },
  { Icon: UserPlus, label: 'Registro en broker (Binomo)' },
  { Icon: Wallet, label: 'Fondeo de cuenta' },
  { Icon: BadgeCheck, label: 'Solicitud de validación' },
];

export default function BridgeNode() {
  const metrics = useFunnelStore(selectMetrics);

  return (
    <div className="w-64 rounded-xl border border-sky-500/60 bg-slate-900/90 p-4 text-slate-100 shadow-[0_0_25px_rgba(56,189,248,0.25)] backdrop-blur">
      <Handle type="target" position={Position.Left} className="bg-emerald-400!" />
      <Handle type="source" position={Position.Right} className="bg-emerald-400!" />
      <div className="mb-1 flex items-center gap-2">
        <Send size={18} className="text-sky-400" />
        <div>
          <div className="text-[13px] font-semibold">Bot de Telegram</div>
          <div className="text-[10px] text-slate-400">Centro de Mando</div>
        </div>
      </div>
      <div className="mb-2 rounded-lg bg-slate-800/70 px-2 py-1.5 text-center">
        <div className="text-[10px] uppercase tracking-wide text-slate-400">Conversión a Telegram 40%</div>
        <div className="text-xl font-bold text-sky-300">{fmt(metrics.telegramLeads)}</div>
        <div className="text-[10px] text-slate-400">usuarios filtrados</div>
      </div>
      <div className="space-y-1">
        {STEPS.map(({ Icon, label }, i) => (
          <div key={i} className="flex items-center gap-2 text-[11px] text-slate-300">
            <Icon size={13} className="shrink-0 text-sky-400" />
            <span>{i + 1}. {label}</span>
          </div>
        ))}
      </div>
    </div>
  );
}

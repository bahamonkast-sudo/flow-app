import { Handle, Position } from '@xyflow/react';
import { GraduationCap, Clapperboard, Flame, Bot, ShieldCheck, FlaskConical } from 'lucide-react';
import { useFunnelStore, MODULES } from '../store/useFunnelStore';
import { Toggle } from './ui';

const ICONS = { videos: Clapperboard, velas: Flame, ia: Bot, riesgo: ShieldCheck, beta: FlaskConical };

export default function ValueNode() {
  const modules = useFunnelStore((s) => s.modules);
  const toggleModule = useFunnelStore((s) => s.toggleModule);
  const activeCount = MODULES.filter((m) => modules[m.key]).length;
  const retention = Math.round((0.5 + activeCount * 0.1) * 100);

  return (
    <div className="w-72 rounded-xl border border-violet-500/50 bg-slate-900/90 p-4 text-slate-100 shadow-[0_0_25px_rgba(139,92,246,0.2)] backdrop-blur">
      <Handle type="target" position={Position.Left} className="bg-emerald-400!" />
      <Handle type="source" position={Position.Right} className="bg-emerald-400!" />
      <div className="mb-1 flex items-center gap-2">
        <GraduationCap size={18} className="text-violet-400" />
        <div>
          <div className="text-[13px] font-semibold">Hub Educativo & Valor</div>
          <div className="text-[10px] text-slate-400">Retención del trader</div>
        </div>
      </div>
      <div className="mb-2 rounded-lg bg-slate-800/70 px-2 py-1.5 text-center">
        <div className="text-[10px] uppercase tracking-wide text-slate-400">Retención</div>
        <div className="text-xl font-bold text-violet-300">{retention}%</div>
        <div className="text-[10px] text-slate-400">{activeCount} de {MODULES.length} módulos activos</div>
      </div>
      <div className="space-y-1.5">
        {MODULES.map((m) => {
          const Icon = ICONS[m.key];
          const on = modules[m.key];
          return (
            <div key={m.key} className="flex items-center justify-between gap-2">
              <div className="flex items-center gap-2 text-[11px] text-slate-300">
                <Icon size={13} className={on ? 'text-violet-300' : 'text-slate-600'} />
                <span className={on ? '' : 'text-slate-500'}>{m.label}</span>
              </div>
              <Toggle on={on} onChange={() => toggleModule(m.key)} />
            </div>
          );
        })}
      </div>
    </div>
  );
}

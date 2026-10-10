import { Handle, Position, useReactFlow } from '@xyflow/react';
import { X, Plus, Trash2 } from 'lucide-react';
import { useFunnelStore, PHASE_META, capacityOf } from '../store/useFunnelStore';

const THEME_OF = { social: 'emerald', wa: 'emerald', telegram: 'sky', signals: 'amber', academy: 'purple' };

const colorThemes = {
  emerald: {
    border: 'border-emerald-500/30 hover:border-emerald-400/60',
    glow: 'shadow-[0_0_20px_-3px_rgba(16,185,129,0.15)]',
    accent: 'text-emerald-400',
    pill: 'bg-emerald-500/10 text-emerald-300 border-emerald-500/20',
    handle: 'bg-emerald-400!',
    dot: 'bg-emerald-400 shadow-[0_0_6px_#34d399]',
  },
  sky: {
    border: 'border-sky-500/30 hover:border-sky-400/60',
    glow: 'shadow-[0_0_20px_-3px_rgba(14,165,233,0.15)]',
    accent: 'text-sky-400',
    pill: 'bg-sky-500/10 text-sky-300 border-sky-500/20',
    handle: 'bg-sky-400!',
    dot: 'bg-sky-400 shadow-[0_0_6px_#38bdf8]',
  },
  amber: {
    border: 'border-amber-500/40 hover:border-amber-400/70',
    glow: 'shadow-[0_0_25px_-3px_rgba(245,158,11,0.2)]',
    accent: 'text-amber-400',
    pill: 'bg-amber-500/10 text-amber-300 border-amber-500/20',
    handle: 'bg-amber-400!',
    dot: 'bg-amber-400 shadow-[0_0_6px_#fbbf24]',
  },
  purple: {
    border: 'border-purple-500/30 hover:border-purple-400/60',
    glow: 'shadow-[0_0_20px_-3px_rgba(168,85,247,0.15)]',
    accent: 'text-purple-400',
    pill: 'bg-purple-500/10 text-purple-300 border-purple-500/20',
    handle: 'bg-purple-400!',
    dot: 'bg-purple-400 shadow-[0_0_6px_#c084fc]',
  },
};

const HANDLES = {
  social: { target: false, source: true },
  wa: { target: false, source: true },
  telegram: { target: true, source: true },
  signals: { target: true, source: true },
  academy: { target: true, source: true },
};

export default function ContainerNode({ id, data }) {
  const phaseId = data.phaseId;
  const meta = PHASE_META[phaseId];
  const theme = colorThemes[THEME_OF[phaseId]] || colorThemes.emerald;
  const handles = HANDLES[phaseId];

  const phase = useFunnelStore((s) => s.phases[phaseId]);
  const togglePhase = useFunnelStore((s) => s.togglePhase);
  const setPhaseEnabled = useFunnelStore((s) => s.setPhaseEnabled);
  const removeTool = useFunnelStore((s) => s.removeToolFromPhase);
  const inspect = useFunnelStore((s) => s.selectForInspection);
  const openCatalog = useFunnelStore((s) => s.setCatalogOpen);
  const { deleteElements } = useReactFlow();

  if (!phase) return null;
  const isActive = phase.enabled;
  const totalReach = phase.items.reduce((s, i) => s + i.reach, 0);
  const badge = isActive ? capacityOf(totalReach) : 'Pausado';

  const removePhase = (e) => {
    e.stopPropagation();
    setPhaseEnabled(phaseId, false);
    deleteElements({ nodes: [{ id }] });
  };

  const onDrop = (e) => {
    e.preventDefault();
    e.stopPropagation();
    try {
      const payload = JSON.parse(e.dataTransfer.getData('application/funnel-tool'));
      if (payload && payload.tool) {
        useFunnelStore.getState().addToolToPhase(payload.phaseId, payload.tool);
      }
    } catch { /* drop inválido */ }
  };

  return (
    <div
      onClick={() => inspect({ type: 'phase', phaseId })}
      onDragOver={(e) => { e.preventDefault(); e.stopPropagation(); }}
      onDrop={onDrop}
      className={`relative w-[310px] rounded-2xl bg-slate-900/80 backdrop-blur-xl border ${theme.border} ${theme.glow} p-4 transition-all duration-300 ${
        !isActive ? 'opacity-40 grayscale' : ''
      }`}
    >
      {handles.target && (
        <Handle type="target" position={Position.Left} id="in" className={`w-3! h-3! border-2! border-slate-950! ${theme.handle}`} />
      )}
      {handles.source && (
        <Handle type="source" position={Position.Right} id="out" className={`w-3! h-3! border-2! border-slate-950! ${theme.handle}`} />
      )}

      <div className="flex items-start justify-between gap-2 pb-3 border-b border-slate-800/80">
        <div>
          <span className="text-[10px] font-mono tracking-wider uppercase text-slate-400">
            {meta.subtitle}
          </span>
          <h3 className="text-base font-bold text-slate-100 flex items-center gap-1.5">
            {meta.title}
            {badge && (
              <span className={`text-[10px] px-2 py-0.5 rounded-full border ${theme.pill} font-normal`}>
                {badge}
              </span>
            )}
          </h3>
        </div>

        <div className="flex items-center gap-1.5">
          <button
            onClick={(e) => { e.stopPropagation(); togglePhase(phaseId); }}
            className={`nodrag w-9 h-5 rounded-full transition-colors p-0.5 flex items-center ${
              isActive ? 'bg-emerald-500 justify-end' : 'bg-slate-700 justify-start'
            }`}
          >
            <div className="w-4 h-4 rounded-full bg-slate-950 shadow-sm" />
          </button>
          <button
            onClick={removePhase}
            className="nodrag text-slate-500 hover:text-rose-400 p-1 rounded-md transition-colors"
            title="Eliminar fase del flujo"
          >
            <X size={14} />
          </button>
        </div>
      </div>

      <div className="my-3 space-y-2 max-h-[220px] overflow-y-auto pr-1">
        {phase.items.length === 0 && (
          <div className="rounded-xl border border-dashed border-slate-700 px-2 py-4 text-center text-[11px] text-slate-500">
            Caja vacía. Agrega herramientas desde el catálogo.
          </div>
        )}
        {phase.items.map((item) => (
          <div
            key={item.id}
            onClick={(e) => { e.stopPropagation(); inspect({ type: 'item', phaseId, itemId: item.id }); }}
            className="group flex items-center justify-between p-2.5 rounded-xl bg-slate-950/60 border border-slate-800/60 hover:border-slate-700 hover:bg-slate-800/40 cursor-pointer transition-all"
            title="Ver ficha técnica"
          >
            <div className="flex items-center gap-2.5 truncate">
              <div className={`w-1.5 h-1.5 rounded-full shrink-0 ${theme.dot}`} />
              <div className="truncate">
                <p className="text-xs font-medium text-slate-200 group-hover:text-white truncate">
                  {item.name}
                </p>
                <p className="text-[10px] text-slate-500 truncate">{item.strategy}</p>
              </div>
            </div>
            <div className="flex items-center gap-1 shrink-0">
              <span className={`text-[10px] font-mono px-1.5 py-0.5 rounded border ${theme.pill}`}>
                {item.conversion > 0 ? `${(item.conversion * 100).toFixed(1)}%` : 'Flujo'}
              </span>
              <button
                className="nodrag rounded p-1 text-slate-600 opacity-0 transition group-hover:opacity-100 hover:bg-slate-700 hover:text-red-400"
                onClick={(e) => { e.stopPropagation(); removeTool(phaseId, item.id); }}
                title="Quitar ingrediente"
              >
                <Trash2 size={12} />
              </button>
            </div>
          </div>
        ))}
      </div>

      <div className="pt-2 border-t border-slate-800/60 flex items-center justify-between">
        <button
          onClick={(e) => { e.stopPropagation(); inspect({ type: 'phase', phaseId }); openCatalog(true); }}
          className="nodrag text-xs text-slate-400 hover:text-slate-200 flex items-center gap-1 py-1 px-2 rounded-lg hover:bg-slate-800/60 transition-colors"
        >
          <Plus size={13} className={theme.accent} />
          <span>Añadir módulo</span>
        </button>

        <span className="text-[10px] text-slate-400 font-mono flex items-center gap-1">
          <span className={`w-1.5 h-1.5 rounded-full ${isActive ? theme.dot : 'bg-slate-600'}`} />
          {isActive ? 'Conectado' : 'Pausado'}
        </span>
      </div>
    </div>
  );
}

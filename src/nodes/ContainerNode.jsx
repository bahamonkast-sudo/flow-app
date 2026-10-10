import { Handle, Position, useReactFlow } from '@xyflow/react';
import { Share2, MessageCircle, Send, GraduationCap, Radio, X, Trash2, Plus } from 'lucide-react';
import { useFunnelStore, PHASE_META, capacityOf } from '../store/useFunnelStore';
import { Toggle } from './ui';

const ICONS = { social: Share2, wa: MessageCircle, telegram: Send, signals: Radio, academy: GraduationCap };
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
  const Icon = ICONS[phaseId];
  const handles = HANDLES[phaseId];

  const phase = useFunnelStore((s) => s.phases[phaseId]);
  const togglePhase = useFunnelStore((s) => s.togglePhase);
  const setPhaseEnabled = useFunnelStore((s) => s.setPhaseEnabled);
  const removeTool = useFunnelStore((s) => s.removeToolFromPhase);
  const inspect = useFunnelStore((s) => s.selectForInspection);
  const openCatalog = useFunnelStore((s) => s.setCatalogOpen);
  const { deleteElements } = useReactFlow();

  if (!phase) return null;
  const totalReach = phase.items.reduce((s, i) => s + i.reach, 0);
  const glow = phase.enabled
    ? phaseId === 'telegram'
      ? '0 0 28px rgba(0,136,204,0.4)'
      : `0 12px 32px ${meta.color}2e`
    : undefined;

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
      className={`node-card w-80 rounded-2xl border bg-slate-900/90 text-slate-100 shadow-xl backdrop-blur transition-opacity ${
        phase.enabled ? '' : 'opacity-45 grayscale'
      }`}
      style={{ borderColor: phase.enabled ? `${meta.color}99` : '#334155', boxShadow: glow }}
    >
      {handles.target && <Handle id="in" type="target" position={Position.Left} className="bg-emerald-400! w-3! h-3!" />}

      <div className="mb-2.5 flex items-center justify-between px-3.5 pt-3">
        <div className="flex items-center gap-2.5">
          <span
            className="flex h-9 w-9 items-center justify-center rounded-xl"
            style={{ background: `${meta.color}1f`, color: meta.color }}
          >
            <Icon size={18} />
          </span>
          <div>
            <div className="text-[13px] font-bold tracking-tight text-white">{meta.title}</div>
            <div className="text-[10px] font-medium uppercase tracking-wider text-slate-500">{meta.subtitle}</div>
          </div>
        </div>
        <div className="flex items-center gap-1.5">
          <Toggle on={phase.enabled} onChange={() => togglePhase(phaseId)} />
          <span
            className="fn-btn nodrag cursor-pointer rounded-lg border border-slate-700/80 bg-slate-800/60 px-1.5 py-1 text-slate-500 transition hover:border-red-500/70 hover:text-red-400"
            onClick={removePhase}
            title="Eliminar fase del flujo"
          >
            <X size={12} />
          </span>
        </div>
      </div>

      <div className="mb-1.5 px-3.5 text-[10px] font-bold uppercase tracking-widest text-slate-500">
        Ingredientes · {phase.items.length}
      </div>
      <div className="max-h-48 space-y-1.5 overflow-y-auto px-3.5">
        {phase.items.length === 0 && (
          <div className="rounded-xl border border-dashed border-slate-700 px-2 py-4 text-center text-[11px] text-slate-500">
            Caja vacía. Agrega herramientas desde el catálogo.
          </div>
        )}
        {phase.items.map((item) => (
          <div
            key={item.id}
            onClick={(e) => { e.stopPropagation(); inspect({ type: 'item', phaseId, itemId: item.id }); }}
            className="group flex cursor-pointer items-center justify-between gap-2 rounded-xl border border-transparent bg-slate-800/50 px-2.5 py-2 transition hover:border-slate-600 hover:bg-slate-800"
            title="Ver ficha técnica"
          >
            <div className="min-w-0">
              <div className="truncate text-[12px] font-semibold text-slate-100">{item.name}</div>
              {item.conversion > 0
                ? (
                  <span
                    className="mt-0.5 inline-block rounded-full px-1.5 py-px text-[10px] font-semibold"
                    style={{ background: `${meta.color}1a`, color: meta.color }}
                  >
                    {(item.conversion * 100).toFixed(1)}% conv · {capacityOf(item.reach)}
                  </span>
                )
                : (<div className="text-[10px] font-medium text-slate-500">Función del flujo</div>)}
            </div>
            <button
              className="nodrag shrink-0 rounded-lg p-1.5 text-slate-600 opacity-0 transition group-hover:opacity-100 hover:bg-slate-700 hover:text-red-400"
              onClick={(e) => { e.stopPropagation(); removeTool(phaseId, item.id); }}
              title="Quitar ingrediente"
            >
              <Trash2 size={13} />
            </button>
          </div>
        ))}
      </div>

      <div className="px-3.5 pb-3.5">
        <button
          className="nodrag mt-2.5 flex w-full items-center justify-center gap-1.5 rounded-xl border border-dashed border-slate-700 px-2 py-1.5 text-[11px] font-semibold text-slate-400 transition hover:border-emerald-500/70 hover:text-emerald-300"
          onClick={(e) => { e.stopPropagation(); inspect({ type: 'phase', phaseId }); openCatalog(true); }}
        >
          <Plus size={13} /> Agregar herramienta
        </button>

        <div className="mt-2 flex items-center justify-center gap-1.5 rounded-xl bg-slate-800/60 px-2 py-1.5 text-[12px]">
          <span className={`h-1.5 w-1.5 rounded-full ${phase.enabled ? 'animate-pulse bg-emerald-400' : 'bg-slate-600'}`} />
          {phase.enabled
            ? (<span className="text-slate-300">Estado: <span className="font-bold text-emerald-400">Canal Activo</span> <span className="text-slate-500">| {capacityOf(totalReach)}</span></span>)
            : (<span className="text-slate-500">Estado: <span className="font-bold">Canal Pausado</span></span>)}
        </div>
      </div>

      {handles.source && <Handle id="out" type="source" position={Position.Right} className="bg-emerald-400! w-3! h-3!" />}
    </div>
  );
}

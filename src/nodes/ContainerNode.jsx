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
      className={`w-72 rounded-xl border bg-slate-900/90 p-3 text-slate-100 shadow-xl backdrop-blur transition-opacity ${
        phase.enabled ? '' : 'opacity-45 grayscale'
      }`}
      style={{ borderColor: phase.enabled ? meta.color : '#334155', boxShadow: phase.enabled && phaseId === 'telegram' ? '0 0 25px rgba(0,136,204,0.35)' : undefined }}
    >
      {handles.target && <Handle id="in" type="target" position={Position.Left} className="bg-emerald-400! w-3! h-3!" />}

      <div className="mb-2 flex items-center justify-between">
        <div className="flex items-center gap-2">
          <Icon size={18} style={{ color: meta.color }} />
          <div>
            <div className="text-[13px] font-semibold">{meta.title}</div>
            <div className="text-[10px] text-slate-400">{meta.subtitle}</div>
          </div>
        </div>
        <div className="flex items-center gap-1">
          <Toggle on={phase.enabled} onChange={() => togglePhase(phaseId)} />
          <span
            className="fn-btn nodrag cursor-pointer rounded border border-slate-700 bg-slate-800 px-1.5 py-0.5 text-[10px] text-slate-400 hover:border-red-500 hover:text-red-400"
            onClick={removePhase}
            title="Eliminar fase del flujo"
          >
            <X size={11} />
          </span>
        </div>
      </div>

      <div className="mb-1 text-[10px] uppercase tracking-wide text-slate-500">
        Ingredientes ({phase.items.length})
      </div>
      <div className="max-h-44 space-y-1 overflow-y-auto pr-0.5">
        {phase.items.length === 0 && (
          <div className="rounded-lg border border-dashed border-slate-700 px-2 py-3 text-center text-[11px] text-slate-500">
            Caja vacía. Agrega herramientas desde el catálogo.
          </div>
        )}
        {phase.items.map((item) => (
          <div
            key={item.id}
            onClick={(e) => { e.stopPropagation(); inspect({ type: 'item', phaseId, itemId: item.id }); }}
            className="group flex cursor-pointer items-center justify-between gap-2 rounded-lg bg-slate-800/70 px-2 py-1.5 hover:bg-slate-800"
            title="Ver ficha técnica"
          >
            <div className="min-w-0">
              <div className="truncate text-[11px] font-medium text-slate-200">{item.name}</div>
              {item.conversion > 0
                ? (<div className="text-[10px] text-emerald-400">{(item.conversion * 100).toFixed(1)}% conv · {capacityOf(item.reach)}</div>)
                : (<div className="text-[10px] text-slate-500">Función del flujo</div>)}
            </div>
            <button
              className="nodrag shrink-0 rounded p-1 text-slate-600 opacity-0 transition group-hover:opacity-100 hover:bg-slate-700 hover:text-red-400"
              onClick={(e) => { e.stopPropagation(); removeTool(phaseId, item.id); }}
              title="Quitar ingrediente"
            >
              <Trash2 size={12} />
            </button>
          </div>
        ))}
      </div>

      <button
        className="nodrag mt-2 flex w-full items-center justify-center gap-1 rounded-lg border border-dashed border-slate-700 px-2 py-1 text-[11px] text-slate-400 hover:border-emerald-500 hover:text-emerald-300"
        onClick={(e) => { e.stopPropagation(); inspect({ type: 'phase', phaseId }); openCatalog(true); }}
      >
        <Plus size={12} /> Agregar herramienta
      </button>

      <div className="mt-2 rounded-lg bg-slate-800/70 px-2 py-1 text-center text-[12px]">
        {phase.enabled
          ? (<span>Estado: <span className="font-bold text-emerald-400">Canal Activo</span> <span className="text-slate-400">| Capacidad: {capacityOf(totalReach)}</span></span>)
          : (<span>Estado: <span className="font-bold text-slate-500">Canal Pausado</span></span>)}
      </div>

      {handles.source && <Handle id="out" type="source" position={Position.Right} className="bg-emerald-400! w-3! h-3!" />}
    </div>
  );
}

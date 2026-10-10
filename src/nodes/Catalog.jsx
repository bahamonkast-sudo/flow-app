import { X, Wrench, Plus, Check } from 'lucide-react';
import { useFunnelStore, PHASE_META, CATALOG, capacityOf, fmt } from '../store/useFunnelStore';

export default function Catalog() {
  const open = useFunnelStore((s) => s.catalogOpen);
  const setOpen = useFunnelStore((s) => s.setCatalogOpen);
  const phases = useFunnelStore((s) => s.phases);
  const addTool = useFunnelStore((s) => s.addToolToPhase);

  if (!open) return null;

  return (
    <div className="absolute bottom-4 left-4 top-20 z-10 flex w-80 flex-col rounded-xl border border-slate-800 bg-slate-900/95 shadow-2xl backdrop-blur">
      <div className="flex items-center justify-between border-b border-slate-800 px-4 py-3">
        <div className="flex items-center gap-2">
          <Wrench size={16} className="text-emerald-400" />
          <h3 className="text-[13px] font-bold uppercase tracking-wide">Catálogo de herramientas</h3>
        </div>
        <button onClick={() => setOpen(false)} className="rounded p-1 text-slate-500 hover:bg-slate-800 hover:text-slate-200">
          <X size={16} />
        </button>
      </div>
      <div className="flex-1 space-y-4 overflow-y-auto p-3">
        {Object.entries(CATALOG).map(([phaseId, tools]) => (
          <div key={phaseId}>
            <div className="mb-1.5 text-[11px] font-semibold uppercase tracking-wide" style={{ color: PHASE_META[phaseId].color }}>
              {PHASE_META[phaseId].title}
            </div>
            <div className="space-y-1.5">
              {tools.map((tool) => {
                const added = phases[phaseId]?.items.some((i) => i.id === tool.id);
                return (
                  <div
                    key={tool.id}
                    draggable={!added}
                    onDragStart={(e) => {
                      if (added) return;
                      e.dataTransfer.setData('application/funnel-tool', JSON.stringify({ phaseId, tool }));
                      e.dataTransfer.effectAllowed = 'copy';
                    }}
                    className={`rounded-lg border px-2.5 py-2 ${added ? 'border-slate-800 opacity-50' : 'cursor-grab border-slate-700 hover:border-emerald-500'}`}
                  >
                    <div className="text-[12px] font-medium text-slate-100">{tool.name}</div>
                    <div className="text-[10px] text-slate-400">{tool.strategy}</div>
                    <div className="mt-1.5 flex items-center justify-between">
                      <span className="text-[10px] text-emerald-400">
                        {tool.conversion > 0 ? `${(tool.conversion * 100).toFixed(1)}% conv · ${capacityOf(tool.reach)}` : 'Función del bot'}
                      </span>
                      {added ? (
                        <span className="flex items-center gap-1 text-[10px] text-slate-500"><Check size={11} /> En la caja</span>
                      ) : (
                        <button
                          onClick={() => addTool(phaseId, tool)}
                          className="flex items-center gap-1 rounded bg-emerald-500/15 px-2 py-0.5 text-[10px] font-semibold text-emerald-300 hover:bg-emerald-500/30"
                        >
                          <Plus size={11} /> Agregar
                        </button>
                      )}
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        ))}
      </div>
      <div className="border-t border-slate-800 px-4 py-2 text-[10px] text-slate-500">
        Arrastra una herramienta a su caja o presiona Agregar.
      </div>
    </div>
  );
}

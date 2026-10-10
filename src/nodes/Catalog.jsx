import { X, Wrench, Plus, Check } from 'lucide-react';
import { useFunnelStore, PHASE_META, CATALOG, capacityOf } from '../store/useFunnelStore';

export default function Catalog() {
  const open = useFunnelStore((s) => s.catalogOpen);
  const setOpen = useFunnelStore((s) => s.setCatalogOpen);
  const phases = useFunnelStore((s) => s.phases);
  const addTool = useFunnelStore((s) => s.addToolToPhase);

  if (!open) return null;

  return (
    <div className="rise absolute bottom-4 left-4 top-24 z-10 flex w-84 flex-col rounded-2xl border border-slate-700/60 bg-slate-900/95 shadow-2xl backdrop-blur" style={{ width: 330 }}>
      <div className="flex items-center justify-between border-b border-slate-800 px-4 py-3">
        <div className="flex items-center gap-2">
          <span className="flex h-7 w-7 items-center justify-center rounded-lg bg-emerald-500/15 text-emerald-400">
            <Wrench size={15} />
          </span>
          <h3 className="text-[13px] font-extrabold uppercase tracking-wider text-white">Catálogo</h3>
        </div>
        <button onClick={() => setOpen(false)} className="rounded-lg p-1.5 text-slate-500 transition hover:bg-slate-800 hover:text-slate-200">
          <X size={16} />
        </button>
      </div>
      <div className="flex-1 space-y-4 overflow-y-auto p-3">
        {Object.entries(CATALOG).map(([phaseId, tools]) => (
          <div key={phaseId}>
            <div className="mb-1.5 flex items-center justify-between">
              <div className="text-[11px] font-extrabold uppercase tracking-widest" style={{ color: PHASE_META[phaseId].color }}>
                {PHASE_META[phaseId].title}
              </div>
              <span className="rounded-full bg-slate-800 px-1.5 py-px text-[10px] font-bold text-slate-400">{tools.length}</span>
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
                    className={`rounded-xl border px-3 py-2 transition ${
                      added
                        ? 'border-slate-800/60 opacity-50'
                        : 'cursor-grab border-slate-700/70 bg-slate-800/30 hover:-translate-y-0.5 hover:border-emerald-500/60 hover:shadow-lg hover:shadow-emerald-500/10'
                    }`}
                  >
                    <div className="text-[12px] font-bold text-slate-100">{tool.name}</div>
                    <div className="text-[10px] font-medium text-slate-500">{tool.strategy}</div>
                    <div className="mt-1.5 flex items-center justify-between">
                      <span className="text-[10px] font-bold text-emerald-400">
                        {tool.conversion > 0 ? `${(tool.conversion * 100).toFixed(1)}% · ${capacityOf(tool.reach)}` : 'Función del bot'}
                      </span>
                      {added ? (
                        <span className="flex items-center gap-1 text-[10px] font-semibold text-slate-500"><Check size={11} /> En la caja</span>
                      ) : (
                        <button
                          onClick={() => addTool(phaseId, tool)}
                          className="flex items-center gap-1 rounded-lg bg-emerald-500 px-2 py-1 text-[10px] font-extrabold text-slate-950 transition hover:bg-emerald-400 active:scale-95"
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
      <div className="border-t border-slate-800 px-4 py-2.5 text-[10px] font-medium text-slate-500">
        Arrastra una herramienta a su caja o presiona Agregar.
      </div>
    </div>
  );
}

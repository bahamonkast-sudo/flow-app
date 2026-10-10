import { Handle, Position, useReactFlow } from '@xyflow/react';
import { X, Trash2 } from 'lucide-react';
import { useFunnelStore, PHASE_META } from '../store/useFunnelStore';
import { Toggle } from './ui';

const THEME_OF = { social: 'emerald', wa: 'emerald', telegram: 'sky', signals: 'amber', academy: 'purple' };

const colorThemes = {
  emerald: {
    border: 'border-emerald-300/60 hover:border-emerald-400/80',
    accent: 'text-emerald-600',
    pill: 'bg-emerald-100/80 text-emerald-700 border-emerald-200/60',
    handle: 'bg-emerald-500!',
    dot: 'bg-emerald-500',
  },
  sky: {
    border: 'border-sky-300/60 hover:border-sky-400/80',
    accent: 'text-sky-600',
    pill: 'bg-sky-100/80 text-sky-700 border-sky-200/60',
    handle: 'bg-sky-500!',
    dot: 'bg-sky-500',
  },
  amber: {
    border: 'border-amber-300/70 hover:border-amber-400/90',
    accent: 'text-amber-700',
    pill: 'bg-amber-100/80 text-amber-800 border-amber-200/70',
    handle: 'bg-amber-500!',
    dot: 'bg-amber-500',
  },
  purple: {
    border: 'border-purple-300/60 hover:border-purple-400/80',
    accent: 'text-purple-600',
    pill: 'bg-purple-100/80 text-purple-700 border-purple-200/60',
    handle: 'bg-purple-500!',
    dot: 'bg-purple-500',
  },
};

const HANDLES = {
  social: { target: false, source: true },
  wa: { target: false, source: true },
  telegram: { target: true, source: true },
  signals: { target: true, source: true },
  academy: { target: true, source: true },
};

const SHORT = {
  fb_groups: 'Facebook Grupos', tiktok_clips: 'TikTok Clips', ig_bio: 'Instagram Bio', yt_shorts: 'YT Shorts',
  wa_extract: 'Extractor Leads', wa_mass: 'Envío Masivo', wa_groups: 'WA Grupos',
  tg_magnet: 'Lead Magnet', tg_filtro: 'Filtro Quiz', tg_verify: 'Verificación', tg_creds: 'Credenciales',
  sig_live: 'Señales Live', sig_premarket: 'Pre-mercado', sig_sureshots: 'Sure Shots',
  m_videos: 'Video Cursos', m_velas: 'Velas y Patrones', m_ia: 'IA Mentor', m_riesgo: 'Gestión Riesgo', m_beta: 'Beta Binomo',
};

const dotColor = (id) => {
  if (id.startsWith('tg_')) return '#0284c7';
  if (id.startsWith('wa_')) return '#16a34a';
  if (id.startsWith('sig_')) return '#f59e0b';
  if (id.startsWith('m_')) return '#a855f7';
  return '#38bdf8';
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
      className={`relative w-[260px] rounded-2xl bg-ebe8da/95 backdrop-blur-sm border border-neutral-300/60 p-3 transition-all duration-300 neumorphic ${
        !isActive ? 'opacity-45 grayscale' : ''
      }`}
    >
      {handles.target && (
        <Handle type="target" position={Position.Left} id="in" className="neo-handle" />
      )}
      {handles.source && (
        <Handle type="source" position={Position.Right} id="out" className="neo-handle" />
      )}

      <div className="flex items-start justify-between gap-2 pb-2 border-b border-neutral-300/50">
        <div className="min-w-0">
          <span className="text-[10px] font-mono tracking-wider uppercase text-neutral-500">
            {meta.subtitle}
          </span>
          <h3 className="text-sm font-bold text-neutral-900 truncate">{meta.title}</h3>
        </div>
        <div className="flex items-center gap-1.5 shrink-0">
          <Toggle on={isActive} onChange={() => togglePhase(phaseId)} />
          <button
            onClick={removePhase}
            className="nodrag text-neutral-400 hover:text-rose-500 p-1.5 rounded-md transition-colors"
            title="Eliminar fase del flujo"
          >
            <X size={13} />
          </button>
        </div>
      </div>

      <div className="my-2 space-y-1.5 max-h-[176px] overflow-y-auto pr-0.5">
        {phase.items.length === 0 && (
          <div className="rounded-lg border border-dashed border-neutral-300/60 px-2 py-3 text-center text-[11px] text-neutral-500">
            Caja vacía
          </div>
        )}
        {phase.items.map((item) => {
          const dot = dotColor(item.id);
          return (
            <div
              key={item.id}
              onClick={(e) => { e.stopPropagation(); inspect({ type: 'item', phaseId, itemId: item.id }); }}
              className="group flex items-center justify-between h-8 px-2 rounded-lg bg-neutral-200/60 border border-neutral-300/50 hover:border-neutral-400/70 cursor-pointer transition-colors"
              title={item.name}
            >
              <div className="flex items-center gap-2 min-w-0">
                <span className="w-1.5 h-1.5 rounded-full shrink-0" style={{ background: dot, boxShadow: `0 0 6px ${dot}` }} />
                <span className="truncate text-[11px] font-medium text-neutral-800">{SHORT[item.id] || item.name}</span>
              </div>
              <div className="flex items-center gap-1 shrink-0">
                <span className={`text-[10px] font-mono ${item.conversion > 0 ? 'text-emerald-600' : 'text-neutral-500'}`}>
                  {item.conversion > 0 ? `+${parseFloat((item.conversion * 100).toFixed(1))}%` : 'Activo'}
                </span>
                <button
                  className="nodrag rounded p-0.5 text-neutral-400 opacity-0 transition group-hover:opacity-100 hover:text-red-500"
                  onClick={(e) => { e.stopPropagation(); removeTool(phaseId, item.id); }}
                  title="Quitar ingrediente"
                >
                  <Trash2 size={11} />
                </button>
              </div>
            </div>
          );
        })}
      </div>

      <button
        onClick={(e) => { e.stopPropagation(); inspect({ type: 'phase', phaseId }); openCatalog(true); }}
        className="btn-neumorphic w-full py-1.5 mt-2 rounded-xl text-[11px] font-medium text-neutral-500 hover:text-neutral-800"
      >
        + Añadir módulo
      </button>
    </div>
  );
}
import { Handle, Position, useReactFlow } from '@xyflow/react';
import { X, Trash2 } from 'lucide-react';
import { useFunnelStore, PHASE_META } from '../store/useFunnelStore';
import { Toggle } from './ui';

const THEME_OF = { social: 'emerald', wa: 'emerald', telegram: 'sky', signals: 'amber', academy: 'purple' };

const colorThemes = {
  emerald: {
    border: 'border-emerald-300/50 hover:border-emerald-400/70',
    glow: 'shadow-[0_0_20px_-3px_rgba(16,185,129,0.1)]',
    handle: 'bg-emerald-500!',
  },
  sky: {
    border: 'border-sky-300/50 hover:border-sky-400/70',
    glow: 'shadow-[0_0_20px_-3px_rgba(14,165,233,0.1)]',
    handle: 'bg-sky-500!',
  },
  amber: {
    border: 'border-amber-300/60 hover:border-amber-400/80',
    glow: 'shadow-[0_0_25px_-3px_rgba(245,158,11,0.15)]',
    handle: 'bg-amber-500!',
  },
  purple: {
    border: 'border-purple-300/50 hover:border-purple-400/70',
    glow: 'shadow-[0_0_20px_-3px_rgba(168,85,247,0.1)]',
    handle: 'bg-purple-500!',
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
  if (id.startsWith('tg_')) return '#0088cc';
  if (id.startsWith('wa_')) return '#25d366';
  if (id.startsWith('sig_')) return '#f59e0b';
  if (id.startsWith('m_')) return '#a78bfa';
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
      className={`relative w-[260px] rounded-2xl bg-white/90 backdrop-blur-sm border ${theme.border} ${theme.glow} p-3 transition-all duration-300 card-paper ${
        !isActive ? 'opacity-40 grayscale' : ''
      }`}
    >
      {handles.target && (
        <Handle type="target" position={Position.Left} id="in" className={`w-3! h-3! border-2! border-slate-950! ${theme.handle}`} />
      )}
      {handles.source && (
        <Handle type="source" position={Position.Right} id="out" className={`w-3! h-3! border-2! border-slate-950! ${theme.handle}`} />
      )}

      <div className="flex items-start justify-between gap-2 pb-2 border-b border-slate-800/80">
        <div className="min-w-0">
          <span className="text-[10px] font-mono tracking-wider uppercase text-neutral-500">
            {meta.subtitle}
          </span>
          <h3 className="text-sm font-bold text-white truncate">{meta.title}</h3>
        </div>
        <div className="flex items-center gap-1.5 shrink-0">
          <Toggle on={isActive} onChange={() => togglePhase(phaseId)} />
          <button
            onClick={removePhase}
            className="nodrag text-slate-500 hover:text-rose-400 p-1 rounded-md transition-colors"
            title="Eliminar fase del flujo"
          >
            <X size={13} />
          </button>
        </div>
      </div>

      <div className="my-2 space-y-1.5 max-h-[176px] overflow-y-auto pr-0.5">
        {phase.items.length === 0 && (
          <div className="rounded-lg border border-dashed border-slate-800 px-2 py-3 text-center text-[11px] text-slate-500">
            Caja vacía
          </div>
        )}
        {phase.items.map((item) => {
          const dot = dotColor(item.id);
          return (
            <div
              key={item.id}
              onClick={(e) => { e.stopPropagation(); inspect({ type: 'item', phaseId, itemId: item.id }); }}
              className="group flex items-center justify-between h-8 px-2 rounded-lg bg-slate-950/40 border border-slate-800/80 hover:border-slate-700 cursor-pointer transition-colors"
              title={item.name}
            >
              <div className="flex items-center gap-2 min-w-0">
                <span className="w-1.5 h-1.5 rounded-full shrink-0" style={{ background: dot, boxShadow: `0 0 6px ${dot}` }} />
                <span className="truncate text-[11px] font-medium text-slate-200">{SHORT[item.id] || item.name}</span>
              </div>
              <div className="flex items-center gap-1 shrink-0">
                <span className={`text-[10px] font-mono ${item.conversion > 0 ? 'text-emerald-400' : 'text-slate-500'}`}>
                  {item.conversion > 0 ? `+${parseFloat((item.conversion * 100).toFixed(1))}%` : 'Activo'}
                </span>
                <button
                  className="nodrag rounded p-0.5 text-slate-600 opacity-0 transition group-hover:opacity-100 hover:text-red-400"
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
        className="nodrag w-full py-1.5 mt-2 rounded-lg border border-dashed border-slate-800 hover:border-slate-700 text-[11px] text-slate-400 hover:text-slate-200 transition-colors"
      >
        + Añadir módulo
      </button>
    </div>
  );
}

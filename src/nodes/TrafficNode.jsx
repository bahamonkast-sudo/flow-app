import { Handle, Position } from '@xyflow/react';
import { Share2, MessageCircle } from 'lucide-react';
import { useFunnelStore, fmt } from '../store/useFunnelStore';
import { Toggle, Slider } from './ui';

const CONFIG = {
  social: {
    title: 'Tráfico Orgánico y Redes',
    subtitle: 'TikTok · Reels · Pago',
    Icon: Share2,
    accent: '#38bdf8',
    min: 5000, max: 50000, step: 1000, unit: 'visualizaciones',
  },
  wa: {
    title: 'Prospección Masiva WhatsApp',
    subtitle: 'Extracción · Envíos · Grupos',
    Icon: MessageCircle,
    accent: '#25d366',
    min: 1000, max: 10000, step: 500, unit: 'envíos',
  },
};

export default function TrafficNode({ data }) {
  const cfg = CONFIG[data.channel];
  const isSocial = data.channel === 'social';
  const active = useFunnelStore((s) => (isSocial ? s.social.active : s.wa.active));
  const value = useFunnelStore((s) => (isSocial ? s.social.reach : s.wa.messages));
  const toggle = useFunnelStore((s) => (isSocial ? s.toggleSocial : s.toggleWa));
  const setValue = useFunnelStore((s) => (isSocial ? s.setReach : s.setMessages));
  const leads = useFunnelStore((s) => {
    const m = s;
    return isSocial
      ? (m.social.active ? m.social.reach * 0.03 : 0)
      : (m.wa.active ? m.wa.messages * 0.08 : 0);
  });

  const { Icon } = cfg;

  return (
    <div
      className="w-64 rounded-xl border bg-slate-900/90 p-4 text-slate-100 shadow-xl backdrop-blur"
      style={{ borderColor: active ? cfg.accent : '#334155' }}
    >
      <Handle type="source" position={Position.Right} className="bg-emerald-400!" />
      <div className="mb-2 flex items-center justify-between">
        <div className="flex items-center gap-2">
          <Icon size={18} style={{ color: cfg.accent }} />
          <div>
            <div className="text-[13px] font-semibold">{cfg.title}</div>
            <div className="text-[10px] text-slate-400">{cfg.subtitle}</div>
          </div>
        </div>
        <Toggle on={active} onChange={toggle} />
      </div>
      <div className="mb-1 flex justify-between text-[11px] text-slate-400">
        <span>Alcance estimado</span>
        <span className="font-semibold text-slate-200">{fmt(value)} {cfg.unit}</span>
      </div>
      <Slider value={value} min={cfg.min} max={cfg.max} step={cfg.step} onChange={setValue} disabled={!active} />
      <div className="mt-2 rounded-lg bg-slate-800/70 px-2 py-1 text-center text-[12px]">
        Leads: <span className="font-bold text-emerald-400">{fmt(leads)}</span>
      </div>
    </div>
  );
}

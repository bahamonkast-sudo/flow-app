import { X, ClipboardList, Wrench, TrendingUp, Target } from 'lucide-react';
import { useFunnelStore, PHASE_META, capacityOf, fmt } from '../store/useFunnelStore';
import { Slider } from './ui';

export default function Inspector() {
  const inspection = useFunnelStore((s) => s.inspection);
  const phases = useFunnelStore((s) => s.phases);
  const clear = useFunnelStore((s) => s.selectForInspection);
  const setReach = useFunnelStore((s) => s.setItemReach);

  if (!inspection) return null;

  const { phaseId } = inspection;
  const phase = phases[phaseId];
  const meta = PHASE_META[phaseId];
  const isItem = inspection.type === 'item';
  const item = isItem ? phase?.items.find((i) => i.id === inspection.itemId) : null;

  if (!phase || (isItem && !item)) return null;

  const title = isItem ? item.name : phaseId === 'telegram' ? 'Bot de Automatización Telegram (Onboarding & Broker Gate)' : meta.title;
  const subtitle = isItem ? item.strategy : `${meta.subtitle} · ${phase.items.length} ingredientes`;

  const rows = isItem
    ? [
        { Icon: ClipboardList, label: 'Qué se hace', value: item.description },
        { Icon: Wrench, label: 'Herramienta requerida', value: item.tool },
        { Icon: TrendingUp, label: 'Beneficio directo', value: item.benefit },
        { Icon: Target, label: 'Eficiencia del mecanismo', value: item.conversion > 0 ? `${(item.conversion * 100).toFixed(1)}% de conversión · Capacidad ${capacityOf(item.reach)} · Alcance ${fmt(item.reach)}` : 'Función de flujo: no genera leads directos, habilita la conversión' },
      ]
    : [
        { Icon: ClipboardList, label: 'Estado', value: phase.enabled ? 'Activa en el flujo' : 'Desactivada (no aporta leads)' },
        { Icon: TrendingUp, label: 'Aporte total', value: phase.enabled ? `Canal activo · ${phase.items.length} ingredientes · Capacidad ${capacityOf(phase.items.reduce((s, i) => s + i.reach, 0))}` : 'Desactivada (no aporta al flujo)' },
        { Icon: Target, label: 'Ingredientes', value: phase.items.length > 0 ? phase.items.map((i) => i.name).join(' · ') : 'Caja vacía' },
      ];

  if (!isItem && phaseId === 'telegram') {
    rows.splice(1, 0,
      { Icon: Target, label: 'Proceso', value: 'Recepción 24/7 → Calificación → Verificación de Fondeo → Apertura de Acceso a Academia' },
    );
    rows.push(
      { Icon: Wrench, label: 'Herramientas asociadas', value: 'Telegram Bot API / Webhooks / Integración de Afiliados' },
      { Icon: TrendingUp, label: 'Métrica clave', value: 'Tasa de paso de lead curioso a cuenta fondeada validada: 40% inicia el bot, 15% fondea' },
    );
  }

  return (
    <div className="absolute bottom-4 right-4 top-4 z-10 flex w-80 flex-col rounded-xl border border-slate-700 bg-slate-900/95 shadow-2xl backdrop-blur">
      <div className="flex items-center justify-between border-b border-slate-800 px-4 py-3">
        <div>
          <h3 className="text-[13px] font-bold uppercase tracking-wide text-emerald-300">Ficha técnica</h3>
          <div className="text-[10px] text-slate-400">{meta.title}</div>
        </div>
        <button onClick={() => clear(null)} className="rounded p-1 text-slate-500 hover:bg-slate-800 hover:text-slate-200">
          <X size={16} />
        </button>
      </div>
      <div className="flex-1 space-y-3 overflow-y-auto p-4">
        <div>
          <div className="text-[14px] font-semibold text-slate-100">{title}</div>
          <div className="text-[11px]" style={{ color: meta.color }}>{subtitle}</div>
        </div>
        {rows.map(({ Icon, label, value }, i) => (
          <div key={i} className="rounded-lg bg-slate-800/70 p-2.5">
            <div className="mb-1 flex items-center gap-1.5 text-[11px] font-semibold text-slate-300">
              <Icon size={13} className="text-emerald-400" /> {label}
            </div>
            <div className="text-[12px] leading-relaxed text-slate-400">{value}</div>
          </div>
        ))}
        {isItem && item.conversion > 0 && (
          <div className="rounded-lg bg-slate-800/70 p-2.5">
            <div className="mb-1 flex justify-between text-[11px] text-slate-300">
              <span className="font-semibold">Alcance</span>
              <span className="font-bold text-emerald-300">{fmt(item.reach)} de alcance</span>
            </div>
            <Slider value={item.reach} min={500} max={50000} step={500} onChange={(v) => setReach(phaseId, item.id, v)} />
          </div>
        )}
      </div>
    </div>
  );
}

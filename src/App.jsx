import { useMemo, useCallback } from 'react';
import {
  ReactFlow,
  ReactFlowProvider,
  Background,
  BackgroundVariant,
  Controls,
  MiniMap,
  useNodesState,
  useEdgesState,
} from '@xyflow/react';
import '@xyflow/react/dist/style.css';
import { CandlestickChart, Wrench, Plus } from 'lucide-react';
import ContainerNode from './nodes/ContainerNode.jsx';
import ResultNode from './nodes/ResultNode.jsx';
import Catalog from './nodes/Catalog.jsx';
import Inspector from './nodes/Inspector.jsx';
import { useFunnelStore, PHASE_META, syncEdges } from './store/useFunnelStore';
import './App.css';

const nodeTypes = { container: ContainerNode, result: ResultNode };

// IDs fijos y deterministas por fase → el re-agregado re-ancla los edges
const N = (phaseId) => `node-${phaseId}`;
const phaseOf = (nodeId) => (nodeId === 'node-diagnostic' ? null : nodeId.replace(/^node-/, ''));

const DEFAULT_POS = {
  'node-social': { x: 0, y: 0 },
  'node-wa': { x: 0, y: 400 },
  'node-telegram': { x: 430, y: 200 },
  'node-signals': { x: 860, y: 200 },
  'node-academy': { x: 1290, y: 180 },
  'node-diagnostic': { x: 1720, y: 170 },
};

const initialNodes = [
  { id: 'node-social', type: 'container', position: DEFAULT_POS['node-social'], data: { phaseId: 'social' } },
  { id: 'node-wa', type: 'container', position: DEFAULT_POS['node-wa'], data: { phaseId: 'wa' } },
  { id: 'node-telegram', type: 'container', position: DEFAULT_POS['node-telegram'], data: { phaseId: 'telegram' } },
  { id: 'node-signals', type: 'container', position: DEFAULT_POS['node-signals'], data: { phaseId: 'signals' } },
  { id: 'node-academy', type: 'container', position: DEFAULT_POS['node-academy'], data: { phaseId: 'academy' } },
  { id: 'node-diagnostic', type: 'result', position: DEFAULT_POS['node-diagnostic'], data: {} },
];

const initialEdges = syncEdges(initialNodes.map((n) => n.id));

const ACTIVE_EDGE = { stroke: '#10b981', strokeWidth: 2.5 };
const IDLE_EDGE = { stroke: '#334155', strokeWidth: 1.5, strokeDasharray: '6 4' };
const BROKEN_EDGE = { stroke: '#ef4444', strokeWidth: 2, strokeDasharray: '6 4' };

function FunnelCanvas() {
  const [nodes, setNodes, onNodesChange] = useNodesState(initialNodes);
  const [edges, setEdges, onEdgesChange] = useEdgesState(initialEdges);

  const phases = useFunnelStore((s) => s.phases);
  const setPhaseEnabled = useFunnelStore((s) => s.setPhaseEnabled);
  const clearInspection = useFunnelStore((s) => s.selectForInspection);
  const catalogOpen = useFunnelStore((s) => s.catalogOpen);
  const setCatalogOpen = useFunnelStore((s) => s.setCatalogOpen);
  const resetIdealFlow = useFunnelStore((s) => s.resetIdealFlow);

  const handleNodesChange = useCallback(
    (changes) => {
      const removed = changes.filter((c) => c.type === 'remove').map((c) => c.id);
      onNodesChange(changes);
      removed.forEach((id) => {
        if (id !== 'node-diagnostic') {
          const pid = phaseOf(id);
          if (pid && PHASE_META[pid]) setPhaseEnabled(pid, false);
        }
      });
      if (removed.length > 0) {
        // Limpia edges colgantes y resincroniza con los nodos vivos
        setEdges((eds) => {
          const alive = new Set(
            nodes.filter((n) => !removed.includes(n.id)).map((n) => n.id)
          );
          const kept = eds.filter((e) => alive.has(e.source) && alive.has(e.target));
          const master = syncEdges([...alive]);
          const masterKeys = new Set(master.map((e) => `${e.source}>${e.target}`));
          return [...kept.filter((e) => !masterKeys.has(`${e.source}>${e.target}`)), ...master];
        });
      }
      // El diagnóstico no se puede eliminar: se restaura si falta
      setNodes((nds) =>
        nds.some((n) => n.id === 'node-diagnostic')
          ? nds
          : [...nds, { id: 'node-diagnostic', type: 'result', position: DEFAULT_POS['node-diagnostic'], data: {} }]
      );
    },
    [onNodesChange, setNodes, setEdges, setPhaseEnabled, nodes]
  );

  const readdPhase = (phaseId) => {
    const nid = N(phaseId);
    setPhaseEnabled(phaseId, true);
    const ids = new Set(nodes.map((n) => n.id));
    ids.add(nid);
    if (!nodes.some((n) => n.id === nid)) {
      setNodes((nds) => [...nds, { id: nid, type: 'container', position: DEFAULT_POS[nid], data: { phaseId } }]);
    }
    // Reconexión automática: recalcula edges maestras (mismo ID → anclaje exacto in/out)
    setEdges(syncEdges([...ids]));
  };

  const rebuildIdeal = () => {
    resetIdealFlow();
    setNodes(initialNodes.map((n) => ({ ...n, position: { ...DEFAULT_POS[n.id] }, data: { ...n.data } })));
    setEdges(syncEdges(initialNodes.map((n) => n.id)));
  };

  // Edges derivadas (sin efectos): ancladas a handles explícitos in/out
  const tgOff = !phases.telegram?.enabled;
  const displayEdges = useMemo(
    () =>
      edges.map((e) => {
        const touchesTg = e.source === 'node-telegram' || e.target === 'node-telegram';
        if (touchesTg && tgOff) {
          return { ...e, animated: false, style: BROKEN_EDGE };
        }
        const pid = phaseOf(e.source);
        const on = pid === null ? true : phases[pid]?.enabled ?? true;
        return { ...e, animated: on, style: on ? ACTIVE_EDGE : IDLE_EDGE };
      }),
    [edges, phases, tgOff]
  );

  const removedPhases = Object.keys(PHASE_META).filter((id) => !phases[id]?.enabled);

  return (
    <div className="h-screen w-screen bg-[#0a0f1d] text-slate-100">
      <header className="absolute left-4 top-4 z-10 flex flex-col gap-2 rounded-xl border border-slate-800 bg-slate-900/90 px-4 py-2.5 backdrop-blur">
        <div className="flex items-center gap-2">
          <CandlestickChart size={20} className="text-emerald-400" />
          <div>
            <h1 className="text-sm font-extrabold tracking-tight text-white">Configurador de Embudo <span className="text-emerald-400">· Opciones Binarias</span></h1>
            <p className="text-[10px] text-slate-400">Captación → Filtro → Señales → Academia · Click: ficha técnica</p>
          </div>
          <button
            onClick={() => setCatalogOpen(!catalogOpen)}
            className={`ml-2 flex items-center gap-1 rounded-lg border px-2.5 py-1.5 text-[11px] font-semibold ${
              catalogOpen ? 'border-emerald-500 bg-emerald-500/15 text-emerald-300' : 'border-slate-700 text-slate-300 hover:border-emerald-500'
            }`}
          >
            <Wrench size={13} /> Catálogo
          </button>
          <button
            onClick={rebuildIdeal}
            className="ml-1 flex items-center gap-2 rounded-lg bg-emerald-500 px-4 py-2 text-[12px] font-bold text-slate-950 shadow-lg shadow-emerald-500/20 transition hover:bg-emerald-400 hover:shadow-emerald-500/40 active:scale-95"
          >
            ⚡ Reconstruir Flujo Ideal
          </button>
        </div>
        {removedPhases.length > 0 && (
          <div className="flex flex-wrap items-center gap-1.5 border-t border-slate-800 pt-2">
            <span className="text-[10px] text-slate-500">Agregar fase al flujo:</span>
            {removedPhases.map((id) => (
              <button
                key={id}
                onClick={() => readdPhase(id)}
                className="flex items-center gap-1 rounded-full border border-dashed border-slate-600 px-2 py-0.5 text-[10px] text-slate-300 hover:border-emerald-500 hover:text-emerald-300"
              >
                <Plus size={11} /> {PHASE_META[id].title}
              </button>
            ))}
          </div>
        )}
      </header>

      <Catalog />
      <Inspector />

      <ReactFlow
        nodes={nodes}
        edges={displayEdges}
        onNodesChange={handleNodesChange}
        onEdgesChange={onEdgesChange}
        onPaneClick={() => clearInspection(null)}
        nodeTypes={nodeTypes}
        fitView
        colorMode="dark"
        minZoom={0.3}
        maxZoom={1.75}
      >
        <Background variant={BackgroundVariant.Dots} gap={22} size={1.5} color="#1e293b" />
        <Controls showInteractive={false} />
        <MiniMap
          pannable
          zoomable
          nodeColor={(n) => {
            const pid = phaseOf(n.id);
            return pid && !phases[pid]?.enabled ? '#334155' : '#10b981';
          }}
          maskColor="rgba(10,15,29,0.8)"
        />
      </ReactFlow>
    </div>
  );
}

export default function App() {
  return (
    <ReactFlowProvider>
      <FunnelCanvas />
    </ReactFlowProvider>
  );
}

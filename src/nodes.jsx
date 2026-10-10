import { useState } from 'react';
import { Handle, Position, useReactFlow } from '@xyflow/react';

export const NODE_TEMPLATES = {
  facebook: { label: 'Facebook', icon: '📘', color: '#1877f2', time: '2-4 semanas',
    substeps: ['Crear FanPage profesional', 'Publicar contenido de valor diariamente', 'Buscar seguidores orgánicamente', 'Crear publicaciones masivas en grupos de Facebook', 'Dirigir tráfico a página de aterrizaje', 'Configurar Facebook Ads (opcional)'],
    ingredients: ['FanPage del negocio', 'Calendario de contenido', 'Grupos del nicho', 'Landing page'],
    tools: ['Facebook Business Suite', 'Canva', 'Meta Ads Manager'] },
  instagram: { label: 'Instagram', icon: '📷', color: '#e94560', time: '2-4 semanas',
    substeps: ['Crear perfil de negocio', 'Publicar reels/stories diarios', 'Responder mensajes directos', 'Dirigir tráfico a página de aterrizaje', 'Usar hashtags estratégicos', 'Colaborar con cuentas del nicho'],
    ingredients: ['Perfil de negocio', 'Banco de reels', 'Hashtags relevantes', 'Link en bio', 'Plantillas de stories'],
    tools: ['Instagram', 'Canva', 'Linktree'] },
  tiktok: { label: 'TikTok', icon: '🎵', color: '#888888', time: '1-3 semanas',
    substeps: ['Publicar videos cortos', 'Explicar soportes y técnicas', 'Responder comentarios con CTA', 'Dirigir tráfico a página de aterrizaje', 'Usar tendencias y sonidos virales', 'Publicar 1-3 veces al día'],
    ingredients: ['Dummy para TikTok', 'Videos del negocio', 'Música trending', 'CTA en comentarios', 'Descripción optimizada'],
    tools: ['TikTok', 'CapCut', 'Dummy/Plantillas'] },
  youtube: { label: 'YouTube', icon: '▶️', color: '#ff0000', time: '4-8 semanas',
    substeps: ['Publicar videos al público', 'Tutoriales paso a paso', 'Colocar CTA en descripción', 'Dirigir tráfico a página de aterrizaje', 'Optimizar SEO de videos', 'Crear playlist de cursos'],
    ingredients: ['Canal de YouTube', 'Tutoriales grabados', 'Miniaturas atractivas', 'Links en descripción', 'Guiones de video'],
    tools: ['YouTube Studio', 'Canva', 'OBS Studio'] },
  'whatsapp-grupos': { label: 'Grupos de WhatsApp', icon: '💬', color: '#25d366', time: '1-2 semanas',
    substeps: ['Unirse a grupos del nicho', 'Participar activamente con valor', 'Compartir contenido útil', 'Invitar miembros a la FanPage', 'Crear grupo propio de comunidad', 'Configurar reglas del grupo'],
    ingredients: ['Número de WhatsApp activo', 'Grupos del nicho', 'Mensajes de valor', 'Link de FanPage', 'Reglas del grupo'],
    tools: ['WhatsApp Business', 'Calentador de números', 'Extractor de grupos'] },
  'whatsapp-canales': { label: 'Canales de WhatsApp', icon: '📢', color: '#25d366', time: '1 semana',
    substeps: ['Crear canal de difusión', 'Publicar contenido diario', 'Invitar suscriptores', 'Compartir ofertas y novedades', 'Dirigir a página de aterrizaje'],
    ingredients: ['Canal de WhatsApp', 'Contenido de valor', 'Lista de suscriptores', 'Landing page'],
    tools: ['WhatsApp', 'Plantillas de mensajes'] },
  'whatsapp-masivo': { label: 'Envío Masivo WA', icon: '📤', color: '#25d366', time: '1-2 semanas',
    substeps: ['Extraer contactos de grupos', 'Validar números activos', 'Calentar números', 'Enviar mensajes personalizados', 'Programar campañas', 'Medir respuestas'],
    ingredients: ['Lista de contactos Excel', 'Mensajes personalizados', 'Números calientes', 'Rotación de cuentas'],
    tools: ['Soluciones WA', 'Extractor de grupos', 'Validador de líneas', 'Calentador'] },
  'pagina-web': { label: 'Página Web', icon: '🌐', color: '#4a7a9e', time: '2-4 semanas',
    substeps: ['Presentación del negocio', 'Cursos en video', 'Laboratorio de práctica', 'Página de aterrizaje con formulario', 'Blog de contenido', 'Optimizar para conversiones'],
    ingredients: ['Dominio web', 'Hosting', 'WordPress/Elementor', 'Formulario de captación', 'Contenido del curso'],
    tools: ['WordPress', 'Elementor', 'Hosting', 'Dominio'] },
  'bot-captura': { label: 'Bot de Captura', icon: '🤖', color: '#533483', time: '1-2 semanas',
    substeps: ['Formulario de registro', 'Chatbot de bienvenida', 'Lead magnet gratuito', 'Seguimiento automático', 'Secuencia de emails', 'Calificar leads'],
    ingredients: ['ManyChat/Chatfuel', 'Flujo de mensajes', 'Lead magnet (PDF)', 'Secuencia de emails'],
    tools: ['ManyChat', 'Chatfuel', 'Mailchimp'] },
  'bot-telegram': { label: 'Bot de Telegram', icon: '✈️', color: '#1a6a9e', time: '1 semana',
    substeps: ['Distribuir en grupos del nicho', 'Canal de difusión', 'Mensaje directo con oferta', 'Comunidad de estudiantes', 'Asignación de grupos', 'Validación automática'],
    ingredients: ['Bot de Telegram', 'Grupos del nicho', 'Canal público', 'Mensajes automatizados', 'Sistema de validación'],
    tools: ['Telegram', 'BotFather', 'ManyBot', 'Railway'] },
};

export const CATEGORIES = {
  'Redes Sociales': ['facebook', 'instagram', 'tiktok', 'youtube'],
  'WhatsApp': ['whatsapp-grupos', 'whatsapp-canales', 'whatsapp-masivo'],
  'Web & Automatización': ['pagina-web', 'bot-captura', 'bot-telegram'],
};

export function FunnelNode({ id, data }) {
  const [expanded, setExpanded] = useState(false);
  const { deleteElements } = useReactFlow();

  return (
    <div className="funnel-node" style={{ borderColor: data.color }}>
      <Handle type="target" position={Position.Top} />
      <div className="fn-header">
        <div>
          <span className="fn-icon">{data.icon}</span>
          <span className="fn-label">{data.label}</span>
        </div>
        <div className="fn-actions">
          <span className="fn-btn nodrag" onClick={() => setExpanded((e) => !e)}>
            {expanded ? '▲' : '▼'}
          </span>
          <span
            className="fn-btn fn-del nodrag"
            onClick={() => deleteElements({ nodes: [{ id }] })}
          >
            ×
          </span>
        </div>
      </div>
      <div className="fn-meta">
        {data.substeps.length} pasos • {data.time}
      </div>
      {expanded && (
        <div className="fn-substeps">
          {data.substeps.map((s, i) => (
            <div key={i} className="fn-substep">{s}</div>
          ))}
        </div>
      )}
      <Handle type="source" position={Position.Bottom} />
    </div>
  );
}

export const nodeTypes = { funnel: FunnelNode };

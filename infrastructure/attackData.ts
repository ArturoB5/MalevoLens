import type { AttackModule } from "@/domain/entities";

export const attackModules: AttackModule[] = [
  {
    id: "sql-injection",
    name: "SQL Injection",
    summary:
      "Visualiza cómo una entrada no validada puede alterar la intención de una consulta y cómo los controles defensivos rompen ese camino.",
    actors: [
      { id: "visitor", label: "Visitante", role: "user" },
      { id: "web-app", label: "Aplicación web", role: "service" },
      { id: "database", label: "Base de datos", role: "database" },
      { id: "attacker", label: "Actor malicioso", role: "attacker" }
    ],
    edges: [
      { id: "visitor-request", from: "visitor", to: "web-app", label: "Formulario legítimo" },
      { id: "attacker-input", from: "attacker", to: "web-app", label: "Entrada manipulada" },
      { id: "app-query", from: "web-app", to: "database", label: "Consulta conceptual" },
      { id: "db-response", from: "database", to: "web-app", label: "Respuesta filtrada" }
    ],
    steps: [
      {
        id: "normal-input",
        title: "Solicitud esperada",
        description:
          "Un visitante envía datos normales. La aplicación interpreta la entrada como información, no como instrucciones.",
        highlights: { actors: ["visitor", "web-app"], edges: ["visitor-request"] },
        outcome: "normal"
      },
      {
        id: "unsafe-input",
        title: "Entrada no validada",
        description:
          "La simulación muestra una entrada manipulada a nivel conceptual. No se presentan payloads reales ni pasos ofensivos.",
        highlights: { actors: ["attacker", "web-app"], edges: ["attacker-input"] },
        outcome: "compromised"
      },
      {
        id: "unsafe-query",
        title: "Intención alterada",
        description:
          "Sin separación clara entre datos e instrucciones, la aplicación podría construir una solicitud con significado inesperado.",
        highlights: { actors: ["web-app", "database"], edges: ["app-query"] },
        outcome: "compromised"
      },
      {
        id: "defensive-path",
        title: "Controles defensivos",
        description:
          "Validación, consultas parametrizadas y manejo mínimo de errores reducen el riesgo y mantienen la intención original.",
        highlights: { actors: ["web-app", "database"], edges: ["app-query", "db-response"] },
        outcome: "blocked"
      }
    ],
    mitigations: [
      {
        id: "input-validation",
        title: "Validación de entradas",
        description: "Aceptar solo formatos esperados y rechazar datos ambiguos antes de procesarlos.",
        enabled: false
      },
      {
        id: "parameterized-queries",
        title: "Consultas parametrizadas",
        description: "Separar datos de instrucciones de forma conceptual para preservar la intención.",
        enabled: false
      },
      {
        id: "least-privilege",
        title: "Mínimo privilegio",
        description: "Limitar permisos de la cuenta de datos y reducir el impacto de fallos.",
        enabled: false
      }
    ]
  },
  {
    id: "ddos",
    name: "DDoS",
    summary:
      "Explora cómo muchas solicitudes simultáneas pueden degradar un servicio y qué capas ayudan a absorber o limitar el tráfico.",
    actors: [
      { id: "users", label: "Usuarios", role: "user" },
      { id: "edge", label: "Borde/CDN", role: "service" },
      { id: "api", label: "Servidor web", role: "service" },
      { id: "attack-net", label: "Red abusiva", role: "attacker" }
    ],
    edges: [
      { id: "legit-traffic", from: "users", to: "edge", label: "Tráfico legítimo" },
      { id: "edge-to-api", from: "edge", to: "api", label: "Solicitudes filtradas" },
      { id: "flood", from: "attack-net", to: "edge", label: "Volumen anómalo" },
      { id: "origin-pressure", from: "attack-net", to: "api", label: "Presión directa" }
    ],
    steps: [
      {
        id: "baseline",
        title: "Carga saludable",
        description:
          "Usuarios legítimos acceden al servicio y las solicitudes se distribuyen con latencia estable.",
        highlights: { actors: ["users", "edge", "api"], edges: ["legit-traffic", "edge-to-api"] },
        outcome: "normal"
      },
      {
        id: "traffic-spike",
        title: "Pico de tráfico",
        description:
          "La simulación representa un aumento anómalo de volumen. El foco está en capacidad, monitoreo y defensa, no en técnicas de ataque.",
        highlights: { actors: ["attack-net", "edge"], edges: ["flood"] },
        outcome: "degraded"
      },
      {
        id: "origin-stress",
        title: "Origen bajo presión",
        description:
          "Si el tráfico no se filtra, el servidor puede perder disponibilidad para usuarios legítimos.",
        highlights: { actors: ["attack-net", "api"], edges: ["origin-pressure"] },
        outcome: "compromised"
      },
      {
        id: "traffic-managed",
        title: "Tráfico gestionado",
        description:
          "Rate limiting, balanceo y CDN reducen la presión sobre el origen y preservan disponibilidad.",
        highlights: { actors: ["edge", "api"], edges: ["flood", "edge-to-api"] },
        outcome: "blocked"
      }
    ],
    mitigations: [
      {
        id: "rate-limiting",
        title: "Rate limiting",
        description: "Definir límites razonables por identidad, origen o comportamiento observable.",
        enabled: false
      },
      {
        id: "load-balancing",
        title: "Balanceo de carga",
        description: "Distribuir demanda y evitar que un único servicio sea el punto de saturación.",
        enabled: false
      },
      {
        id: "cdn-protection",
        title: "CDN y caché",
        description: "Absorber tráfico repetitivo en el borde y proteger el servidor de origen.",
        enabled: false
      }
    ]
  },
  {
    id: "mitm",
    name: "Man-in-the-Middle",
    summary:
      "Muestra cómo una comunicación sin protección puede ser observada conceptualmente y cómo HTTPS y certificados restauran confianza.",
    actors: [
      { id: "client", label: "Cliente", role: "user" },
      { id: "network", label: "Red", role: "service" },
      { id: "server", label: "Servidor", role: "service" },
      { id: "interceptor", label: "Intermediario hostil", role: "attacker" }
    ],
    edges: [
      { id: "client-network", from: "client", to: "network", label: "Solicitud" },
      { id: "network-server", from: "network", to: "server", label: "Comunicación" },
      { id: "intercept", from: "interceptor", to: "network", label: "Observación conceptual" },
      { id: "secure-channel", from: "client", to: "server", label: "Canal protegido" }
    ],
    steps: [
      {
        id: "plain-channel",
        title: "Canal sin garantías",
        description:
          "La comunicación atraviesa una red compartida sin suficientes garantías de confidencialidad e identidad.",
        highlights: { actors: ["client", "network", "server"], edges: ["client-network", "network-server"] },
        outcome: "normal"
      },
      {
        id: "interception-risk",
        title: "Riesgo de intermediación",
        description:
          "Un intermediario hostil puede observar o alterar conceptualmente el tránsito si no existen controles criptográficos.",
        highlights: { actors: ["interceptor", "network"], edges: ["intercept"] },
        outcome: "compromised"
      },
      {
        id: "trust-check",
        title: "Verificación de identidad",
        description:
          "Certificados válidos ayudan al cliente a confirmar que habla con el servicio esperado.",
        highlights: { actors: ["client", "server"], edges: ["secure-channel"] },
        outcome: "blocked"
      },
      {
        id: "encrypted-session",
        title: "Sesión protegida",
        description:
          "HTTPS bien configurado protege confidencialidad e integridad durante la sesión.",
        highlights: { actors: ["client", "server"], edges: ["secure-channel"] },
        outcome: "blocked"
      }
    ],
    mitigations: [
      {
        id: "https",
        title: "HTTPS obligatorio",
        description: "Redirigir a canales cifrados y evitar transporte inseguro en producción.",
        enabled: false
      },
      {
        id: "certificate-validation",
        title: "Validación de certificados",
        description: "Rechazar certificados inválidos y vigilar expiración o configuración débil.",
        enabled: false
      },
      {
        id: "hsts",
        title: "HSTS",
        description: "Indicar a navegadores que solo usen conexiones seguras para el sitio.",
        enabled: false
      }
    ]
  },
  {
    id: "xss",
    name: "XSS conceptual",
    summary:
      "Muestra cómo contenido no confiable puede llegar a la interfaz y cómo escape, sanitización y políticas de contenido reducen el riesgo.",
    actors: [
      { id: "visitor", label: "Visitante", role: "user" },
      { id: "web-app", label: "Aplicación web", role: "service" },
      { id: "browser", label: "Navegador", role: "service" },
      { id: "attacker", label: "Actor malicioso", role: "attacker" }
    ],
    edges: [
      { id: "safe-content", from: "visitor", to: "web-app", label: "Contenido normal" },
      { id: "untrusted-content", from: "attacker", to: "web-app", label: "Contenido no confiable" },
      { id: "render-content", from: "web-app", to: "browser", label: "Renderizado" },
      { id: "safe-render", from: "browser", to: "visitor", label: "Interfaz protegida" }
    ],
    steps: [
      {
        id: "normal-render",
        title: "Contenido esperado",
        description:
          "La aplicación recibe texto legítimo y lo presenta como datos visibles dentro de la interfaz.",
        highlights: { actors: ["visitor", "web-app"], edges: ["safe-content"] },
        outcome: "normal"
      },
      {
        id: "untrusted-render",
        title: "Contenido no confiable",
        description:
          "La simulación representa contenido manipulado de forma abstracta. No se muestran payloads ni ejemplos ejecutables.",
        highlights: { actors: ["attacker", "web-app"], edges: ["untrusted-content"] },
        outcome: "compromised"
      },
      {
        id: "browser-risk",
        title: "Riesgo en la interfaz",
        description:
          "Si la aplicación mezcla contenido no confiable con la vista sin controles, el navegador podría interpretar algo que no debería.",
        highlights: { actors: ["web-app", "browser"], edges: ["render-content"] },
        outcome: "compromised"
      },
      {
        id: "safe-output",
        title: "Salida controlada",
        description:
          "Escape contextual, sanitización permitida y CSP ayudan a que el navegador trate el contenido como datos seguros.",
        highlights: { actors: ["browser", "visitor"], edges: ["render-content", "safe-render"] },
        outcome: "blocked"
      }
    ],
    mitigations: [
      {
        id: "contextual-escaping",
        title: "Escape contextual",
        description: "Codificar contenido según el contexto donde se renderiza para evitar interpretación inesperada.",
        enabled: false
      },
      {
        id: "content-sanitization",
        title: "Sanitización defensiva",
        description: "Permitir solo estructuras conocidas y descartar contenido activo o ambiguo.",
        enabled: false
      },
      {
        id: "content-security-policy",
        title: "Content Security Policy",
        description: "Definir una política del navegador que limite fuentes y comportamientos permitidos.",
        enabled: false
      }
    ]
  },
  {
    id: "csrf",
    name: "CSRF",
    summary:
      "Explica cómo una acción autenticada puede ser inducida conceptualmente y cómo tokens, SameSite y confirmación de intención protegen el flujo.",
    actors: [
      { id: "user", label: "Usuario autenticado", role: "user" },
      { id: "browser", label: "Navegador", role: "service" },
      { id: "app", label: "Aplicación", role: "service" },
      { id: "attacker", label: "Sitio externo hostil", role: "attacker" }
    ],
    edges: [
      { id: "trusted-action", from: "user", to: "app", label: "Acción legítima" },
      { id: "external-lure", from: "attacker", to: "browser", label: "Inducción externa" },
      { id: "ambient-session", from: "browser", to: "app", label: "Sesión existente" },
      { id: "verified-action", from: "app", to: "user", label: "Intención verificada" }
    ],
    steps: [
      {
        id: "trusted-session",
        title: "Sesión válida",
        description:
          "El usuario ya inició sesión y puede realizar acciones legítimas dentro de la aplicación.",
        highlights: { actors: ["user", "app"], edges: ["trusted-action"] },
        outcome: "normal"
      },
      {
        id: "external-prompt",
        title: "Inducción externa",
        description:
          "Un sitio externo intenta provocar una acción en el navegador. La simulación no incluye instrucciones ni mecanismos ofensivos.",
        highlights: { actors: ["attacker", "browser"], edges: ["external-lure"] },
        outcome: "compromised"
      },
      {
        id: "ambient-authority",
        title: "Autoridad ambiental",
        description:
          "Si el servidor confía solo en la sesión existente, podría confundir intención real con una solicitud inducida.",
        highlights: { actors: ["browser", "app"], edges: ["ambient-session"] },
        outcome: "compromised"
      },
      {
        id: "intent-verified",
        title: "Intención comprobada",
        description:
          "Tokens CSRF, SameSite y confirmaciones en acciones sensibles ayudan a validar que la intención viene del usuario.",
        highlights: { actors: ["app", "user"], edges: ["ambient-session", "verified-action"] },
        outcome: "blocked"
      }
    ],
    mitigations: [
      {
        id: "csrf-token",
        title: "Tokens CSRF",
        description: "Asociar acciones sensibles a tokens impredecibles generados por la aplicación.",
        enabled: false
      },
      {
        id: "samesite-cookies",
        title: "Cookies SameSite",
        description: "Reducir el envío automático de cookies desde contextos externos.",
        enabled: false
      },
      {
        id: "sensitive-confirmation",
        title: "Confirmación sensible",
        description: "Solicitar confirmación adicional cuando una acción tiene impacto relevante.",
        enabled: false
      }
    ]
  },
  {
    id: "auth-failures",
    name: "Fallos de autenticación",
    summary:
      "Visualiza fallos comunes de control de acceso y autenticación de manera conceptual, junto con defensas de sesión, MFA y autorización.",
    actors: [
      { id: "user", label: "Usuario", role: "user" },
      { id: "identity", label: "Servicio de identidad", role: "service" },
      { id: "app", label: "Aplicación protegida", role: "service" },
      { id: "attacker", label: "Actor no autorizado", role: "attacker" }
    ],
    edges: [
      { id: "login", from: "user", to: "identity", label: "Inicio de sesión" },
      { id: "session", from: "identity", to: "app", label: "Sesión validada" },
      { id: "unauthorized", from: "attacker", to: "app", label: "Acceso indebido" },
      { id: "policy-check", from: "app", to: "identity", label: "Verificación de permisos" }
    ],
    steps: [
      {
        id: "valid-login",
        title: "Autenticación legítima",
        description:
          "El usuario valida su identidad y la aplicación recibe una sesión con contexto de permisos.",
        highlights: { actors: ["user", "identity", "app"], edges: ["login", "session"] },
        outcome: "normal"
      },
      {
        id: "weak-control",
        title: "Control débil",
        description:
          "La simulación muestra, sin técnicas ofensivas, cómo decisiones de sesión o permisos incompletas aumentan el riesgo.",
        highlights: { actors: ["attacker", "app"], edges: ["unauthorized"] },
        outcome: "compromised"
      },
      {
        id: "authorization-gap",
        title: "Brecha de autorización",
        description:
          "Autenticar no es suficiente: cada acción sensible debe comprobar autorización y contexto.",
        highlights: { actors: ["app", "identity"], edges: ["policy-check"] },
        outcome: "degraded"
      },
      {
        id: "strong-auth",
        title: "Defensa por capas",
        description:
          "MFA, expiración de sesión, rotación y autorización por política reducen exposición y abuso.",
        highlights: { actors: ["identity", "app"], edges: ["session", "policy-check"] },
        outcome: "blocked"
      }
    ],
    mitigations: [
      {
        id: "mfa",
        title: "MFA",
        description: "Agregar un segundo factor para reducir dependencia de una sola prueba de identidad.",
        enabled: false
      },
      {
        id: "session-hardening",
        title: "Endurecimiento de sesión",
        description: "Usar expiración, rotación y revocación ante cambios sensibles.",
        enabled: false
      },
      {
        id: "policy-authorization",
        title: "Autorización por política",
        description: "Validar permisos por acción y recurso, no solo por presencia de sesión.",
        enabled: false
      }
    ]
  }
];

export function getAttackModule(attackId: string): AttackModule | undefined {
  return attackModules.find((module) => module.id === attackId);
}

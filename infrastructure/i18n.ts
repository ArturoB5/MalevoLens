import type { AttackCategory, AttackModule } from "@/domain/entities";
import type { AttackEvaluation } from "@/domain/entities";
import { attackModules as spanishAttackModules } from "./attackData";

export type Locale = "es" | "en";

export type UiText = {
  appSubtitle: string;
  ethicalBadge: string;
  attackNavigation: string;
  categoryLabels: Record<AttackCategory, string>;
  collapseMenu: string;
  expandMenu: string;
  moduleEyebrow: string;
  visualizerTitle: string;
  diagramLabel: string;
  mitigationsTitle: string;
  defensiveCoverage: string;
  step: string;
  of: string;
  previous: string;
  next: string;
  reset: string;
  homeEyebrow: string;
  homeTitle: string;
  homeDescription: string;
  startSimulation: string;
  theme: string;
  light: string;
  dark: string;
  language: string;
  exportReport: string;
  reportDownloaded: string;
  reportModule: string;
  reportSummary: string;
  reportOutcome: string;
  reportNoMitigations: string;
  reportEthicalNote: string;
  metricsTitle: string;
  latency: string;
  availability: string;
  trust: string;
  roles: Record<AttackModule["actors"][number]["role"], string>;
};

const englishAttackModules: AttackModule[] = [
  {
    id: "sql-injection",
    name: "SQL Injection",
    category: "injection",
    summary:
      "Visualizes how unvalidated input can alter the intent of a query and how defensive controls interrupt that path.",
    actors: [
      { id: "visitor", label: "Visitor", role: "user" },
      { id: "web-app", label: "Web app", role: "service" },
      { id: "database", label: "Database", role: "database" },
      { id: "attacker", label: "Malicious actor", role: "attacker" }
    ],
    edges: [
      { id: "visitor-request", from: "visitor", to: "web-app", label: "Legitimate form" },
      { id: "attacker-input", from: "attacker", to: "web-app", label: "Manipulated input" },
      { id: "app-query", from: "web-app", to: "database", label: "Conceptual query" },
      { id: "db-response", from: "database", to: "web-app", label: "Filtered response" }
    ],
    steps: [
      {
        id: "normal-input",
        title: "Expected request",
        description:
          "A visitor submits normal data. The application treats the input as information, not as instructions.",
        highlights: { actors: ["visitor", "web-app"], edges: ["visitor-request"] },
        outcome: "normal"
      },
      {
        id: "unsafe-input",
        title: "Unvalidated input",
        description:
          "The simulation represents manipulated input conceptually. It does not include real payloads or offensive steps.",
        highlights: { actors: ["attacker", "web-app"], edges: ["attacker-input"] },
        outcome: "compromised"
      },
      {
        id: "unsafe-query",
        title: "Altered intent",
        description:
          "Without clear separation between data and instructions, the application could create a request with unexpected meaning.",
        highlights: { actors: ["web-app", "database"], edges: ["app-query"] },
        outcome: "compromised"
      },
      {
        id: "defensive-path",
        title: "Defensive controls",
        description:
          "Validation, parameterized queries and minimal error handling reduce risk and preserve the original intent.",
        highlights: { actors: ["web-app", "database"], edges: ["app-query", "db-response"] },
        outcome: "blocked"
      }
    ],
    mitigations: [
      {
        id: "input-validation",
        title: "Input validation",
        description: "Accept only expected formats and reject ambiguous data before processing.",
        enabled: false
      },
      {
        id: "parameterized-queries",
        title: "Parameterized queries",
        description: "Conceptually separate data from instructions to preserve intent.",
        enabled: false
      },
      {
        id: "least-privilege",
        title: "Least privilege",
        description: "Limit data account permissions and reduce the impact of failures.",
        enabled: false
      }
    ]
  },
  {
    id: "ddos",
    name: "DDoS",
    category: "availability",
    summary:
      "Explores how many simultaneous requests can degrade a service and which layers help absorb or limit traffic.",
    actors: [
      { id: "users", label: "Users", role: "user" },
      { id: "edge", label: "Edge/CDN", role: "service" },
      { id: "api", label: "Web server", role: "service" },
      { id: "attack-net", label: "Abusive network", role: "attacker" }
    ],
    edges: [
      { id: "legit-traffic", from: "users", to: "edge", label: "Legitimate traffic" },
      { id: "edge-to-api", from: "edge", to: "api", label: "Filtered requests" },
      { id: "flood", from: "attack-net", to: "edge", label: "Anomalous volume" },
      { id: "origin-pressure", from: "attack-net", to: "api", label: "Direct pressure" }
    ],
    steps: [
      {
        id: "baseline",
        title: "Healthy load",
        description: "Legitimate users access the service and requests are distributed with stable latency.",
        highlights: { actors: ["users", "edge", "api"], edges: ["legit-traffic", "edge-to-api"] },
        outcome: "normal"
      },
      {
        id: "traffic-spike",
        title: "Traffic spike",
        description:
          "The simulation represents anomalous volume. The focus is capacity, monitoring and defense, not attack techniques.",
        highlights: { actors: ["attack-net", "edge"], edges: ["flood"] },
        outcome: "degraded"
      },
      {
        id: "origin-stress",
        title: "Origin under pressure",
        description: "If traffic is not filtered, the server can lose availability for legitimate users.",
        highlights: { actors: ["attack-net", "api"], edges: ["origin-pressure"] },
        outcome: "compromised"
      },
      {
        id: "traffic-managed",
        title: "Managed traffic",
        description: "Rate limiting, load balancing and CDN reduce origin pressure and preserve availability.",
        highlights: { actors: ["edge", "api"], edges: ["flood", "edge-to-api"] },
        outcome: "blocked"
      }
    ],
    mitigations: [
      {
        id: "rate-limiting",
        title: "Rate limiting",
        description: "Define reasonable limits by identity, origin or observable behavior.",
        enabled: false
      },
      {
        id: "load-balancing",
        title: "Load balancing",
        description: "Distribute demand and prevent a single service from becoming the saturation point.",
        enabled: false
      },
      {
        id: "cdn-protection",
        title: "CDN and cache",
        description: "Absorb repetitive traffic at the edge and protect the origin server.",
        enabled: false
      }
    ]
  },
  {
    id: "mitm",
    name: "Man-in-the-Middle",
    category: "transport",
    summary:
      "Shows how unprotected communication can be conceptually observed and how HTTPS and certificates restore trust.",
    actors: [
      { id: "client", label: "Client", role: "user" },
      { id: "network", label: "Network", role: "service" },
      { id: "server", label: "Server", role: "service" },
      { id: "interceptor", label: "Hostile intermediary", role: "attacker" }
    ],
    edges: [
      { id: "client-network", from: "client", to: "network", label: "Request" },
      { id: "network-server", from: "network", to: "server", label: "Communication" },
      { id: "intercept", from: "interceptor", to: "network", label: "Conceptual observation" },
      { id: "secure-channel", from: "client", to: "server", label: "Protected channel" }
    ],
    steps: [
      {
        id: "plain-channel",
        title: "Channel without guarantees",
        description:
          "Communication crosses a shared network without enough guarantees of confidentiality and identity.",
        highlights: { actors: ["client", "network", "server"], edges: ["client-network", "network-server"] },
        outcome: "normal"
      },
      {
        id: "interception-risk",
        title: "Intermediation risk",
        description:
          "A hostile intermediary can conceptually observe or alter transit if cryptographic controls are missing.",
        highlights: { actors: ["interceptor", "network"], edges: ["intercept"] },
        outcome: "compromised"
      },
      {
        id: "trust-check",
        title: "Identity verification",
        description: "Valid certificates help the client confirm it is talking to the expected service.",
        highlights: { actors: ["client", "server"], edges: ["secure-channel"] },
        outcome: "blocked"
      },
      {
        id: "encrypted-session",
        title: "Protected session",
        description: "Well-configured HTTPS protects confidentiality and integrity during the session.",
        highlights: { actors: ["client", "server"], edges: ["secure-channel"] },
        outcome: "blocked"
      }
    ],
    mitigations: [
      {
        id: "https",
        title: "Mandatory HTTPS",
        description: "Redirect to encrypted channels and avoid insecure transport in production.",
        enabled: false
      },
      {
        id: "certificate-validation",
        title: "Certificate validation",
        description: "Reject invalid certificates and monitor expiration or weak configuration.",
        enabled: false
      },
      {
        id: "hsts",
        title: "HSTS",
        description: "Tell browsers to use only secure connections for the site.",
        enabled: false
      }
    ]
  },
  {
    id: "xss",
    name: "Conceptual XSS",
    category: "client",
    summary:
      "Shows how untrusted content can reach the interface and how escaping, sanitization and content policies reduce risk.",
    actors: [
      { id: "visitor", label: "Visitor", role: "user" },
      { id: "web-app", label: "Web app", role: "service" },
      { id: "browser", label: "Browser", role: "service" },
      { id: "attacker", label: "Malicious actor", role: "attacker" }
    ],
    edges: [
      { id: "safe-content", from: "visitor", to: "web-app", label: "Normal content" },
      { id: "untrusted-content", from: "attacker", to: "web-app", label: "Untrusted content" },
      { id: "render-content", from: "web-app", to: "browser", label: "Rendering" },
      { id: "safe-render", from: "browser", to: "visitor", label: "Protected UI" }
    ],
    steps: [
      {
        id: "normal-render",
        title: "Expected content",
        description: "The application receives legitimate text and presents it as visible data in the interface.",
        highlights: { actors: ["visitor", "web-app"], edges: ["safe-content"] },
        outcome: "normal"
      },
      {
        id: "untrusted-render",
        title: "Untrusted content",
        description:
          "The simulation represents manipulated content abstractly. It does not show payloads or executable examples.",
        highlights: { actors: ["attacker", "web-app"], edges: ["untrusted-content"] },
        outcome: "compromised"
      },
      {
        id: "browser-risk",
        title: "Interface risk",
        description:
          "If the app mixes untrusted content with the view without controls, the browser could interpret something it should not.",
        highlights: { actors: ["web-app", "browser"], edges: ["render-content"] },
        outcome: "compromised"
      },
      {
        id: "safe-output",
        title: "Controlled output",
        description:
          "Contextual escaping, allow-list sanitization and CSP help the browser treat content as safe data.",
        highlights: { actors: ["browser", "visitor"], edges: ["render-content", "safe-render"] },
        outcome: "blocked"
      }
    ],
    mitigations: [
      {
        id: "contextual-escaping",
        title: "Contextual escaping",
        description: "Encode content according to where it is rendered to avoid unexpected interpretation.",
        enabled: false
      },
      {
        id: "content-sanitization",
        title: "Defensive sanitization",
        description: "Allow only known structures and discard active or ambiguous content.",
        enabled: false
      },
      {
        id: "content-security-policy",
        title: "Content Security Policy",
        description: "Define a browser policy that limits allowed sources and behaviors.",
        enabled: false
      }
    ]
  },
  {
    id: "csrf",
    name: "CSRF",
    category: "session",
    summary:
      "Explains how an authenticated action can be conceptually induced and how tokens, SameSite and intent confirmation protect the flow.",
    actors: [
      { id: "user", label: "Authenticated user", role: "user" },
      { id: "browser", label: "Browser", role: "service" },
      { id: "app", label: "Application", role: "service" },
      { id: "attacker", label: "Hostile external site", role: "attacker" }
    ],
    edges: [
      { id: "trusted-action", from: "user", to: "app", label: "Legitimate action" },
      { id: "external-lure", from: "attacker", to: "browser", label: "External inducement" },
      { id: "ambient-session", from: "browser", to: "app", label: "Existing session" },
      { id: "verified-action", from: "app", to: "user", label: "Verified intent" }
    ],
    steps: [
      {
        id: "trusted-session",
        title: "Valid session",
        description: "The user is already signed in and can perform legitimate actions inside the application.",
        highlights: { actors: ["user", "app"], edges: ["trusted-action"] },
        outcome: "normal"
      },
      {
        id: "external-prompt",
        title: "External inducement",
        description:
          "An external site tries to provoke a browser action. The simulation includes no offensive instructions or mechanisms.",
        highlights: { actors: ["attacker", "browser"], edges: ["external-lure"] },
        outcome: "compromised"
      },
      {
        id: "ambient-authority",
        title: "Ambient authority",
        description:
          "If the server trusts only the existing session, it may confuse real intent with an induced request.",
        highlights: { actors: ["browser", "app"], edges: ["ambient-session"] },
        outcome: "compromised"
      },
      {
        id: "intent-verified",
        title: "Verified intent",
        description:
          "CSRF tokens, SameSite and confirmations for sensitive actions help validate that intent comes from the user.",
        highlights: { actors: ["app", "user"], edges: ["ambient-session", "verified-action"] },
        outcome: "blocked"
      }
    ],
    mitigations: [
      {
        id: "csrf-token",
        title: "CSRF tokens",
        description: "Associate sensitive actions with unpredictable tokens generated by the application.",
        enabled: false
      },
      {
        id: "samesite-cookies",
        title: "SameSite cookies",
        description: "Reduce automatic cookie sending from external contexts.",
        enabled: false
      },
      {
        id: "sensitive-confirmation",
        title: "Sensitive confirmation",
        description: "Ask for additional confirmation when an action has meaningful impact.",
        enabled: false
      }
    ]
  },
  {
    id: "auth-failures",
    name: "Authentication failures",
    category: "access",
    summary:
      "Visualizes common authentication and access-control failures conceptually, with session, MFA and authorization defenses.",
    actors: [
      { id: "user", label: "User", role: "user" },
      { id: "identity", label: "Identity service", role: "service" },
      { id: "app", label: "Protected app", role: "service" },
      { id: "attacker", label: "Unauthorized actor", role: "attacker" }
    ],
    edges: [
      { id: "login", from: "user", to: "identity", label: "Sign-in" },
      { id: "session", from: "identity", to: "app", label: "Validated session" },
      { id: "unauthorized", from: "attacker", to: "app", label: "Improper access" },
      { id: "policy-check", from: "app", to: "identity", label: "Permission check" }
    ],
    steps: [
      {
        id: "valid-login",
        title: "Legitimate authentication",
        description: "The user validates identity and the application receives a session with permission context.",
        highlights: { actors: ["user", "identity", "app"], edges: ["login", "session"] },
        outcome: "normal"
      },
      {
        id: "weak-control",
        title: "Weak control",
        description:
          "The simulation shows, without offensive techniques, how incomplete session or permission decisions increase risk.",
        highlights: { actors: ["attacker", "app"], edges: ["unauthorized"] },
        outcome: "compromised"
      },
      {
        id: "authorization-gap",
        title: "Authorization gap",
        description: "Authentication is not enough: every sensitive action must verify authorization and context.",
        highlights: { actors: ["app", "identity"], edges: ["policy-check"] },
        outcome: "degraded"
      },
      {
        id: "strong-auth",
        title: "Layered defense",
        description: "MFA, session expiration, rotation and policy-based authorization reduce exposure and abuse.",
        highlights: { actors: ["identity", "app"], edges: ["session", "policy-check"] },
        outcome: "blocked"
      }
    ],
    mitigations: [
      {
        id: "mfa",
        title: "MFA",
        description: "Add a second factor to reduce dependency on a single proof of identity.",
        enabled: false
      },
      {
        id: "session-hardening",
        title: "Session hardening",
        description: "Use expiration, rotation and revocation after sensitive changes.",
        enabled: false
      },
      {
        id: "policy-authorization",
        title: "Policy authorization",
        description: "Validate permissions by action and resource, not just session presence.",
        enabled: false
      }
    ]
  },
  {
    id: "ssrf",
    name: "Conceptual SSRF",
    category: "access",
    summary:
      "Shows why applications that fetch external resources must validate destinations to avoid unintended internal access.",
    actors: [
      { id: "user", label: "User", role: "user" },
      { id: "app", label: "Application", role: "service" },
      { id: "internal", label: "Internal resource", role: "service" },
      { id: "attacker", label: "Untrusted input", role: "attacker" }
    ],
    edges: [
      { id: "safe-url", from: "user", to: "app", label: "Allowed destination" },
      { id: "untrusted-target", from: "attacker", to: "app", label: "Unvalidated target" },
      { id: "server-request", from: "app", to: "internal", label: "Server request" },
      { id: "blocked-target", from: "app", to: "user", label: "Blocked target" }
    ],
    steps: [
      {
        id: "allowed-target",
        title: "Expected destination",
        description:
          "The application requests an allowed external resource and keeps the flow within trusted destinations.",
        highlights: { actors: ["user", "app"], edges: ["safe-url"] },
        outcome: "normal"
      },
      {
        id: "untrusted-target",
        title: "Untrusted destination",
        description:
          "The simulation represents a manipulated URL or target abstractly, without real paths or offensive techniques.",
        highlights: { actors: ["attacker", "app"], edges: ["untrusted-target"] },
        outcome: "compromised"
      },
      {
        id: "internal-reach",
        title: "Unintended access",
        description:
          "If the application trusts the received destination, it may attempt to reach internal resources that should not be exposed.",
        highlights: { actors: ["app", "internal"], edges: ["server-request"] },
        outcome: "compromised"
      },
      {
        id: "egress-controlled",
        title: "Controlled egress",
        description:
          "Allow lists, network segmentation and destination validation reduce the risk of unauthorized requests.",
        highlights: { actors: ["app", "user"], edges: ["blocked-target"] },
        outcome: "blocked"
      }
    ],
    mitigations: [
      {
        id: "allowlisted-destinations",
        title: "Allowed destinations",
        description: "Allow only explicitly approved domains, protocols and network ranges.",
        enabled: false
      },
      {
        id: "egress-filtering",
        title: "Egress filtering",
        description: "Limit which networks the application can reach at infrastructure level.",
        enabled: false
      },
      {
        id: "response-minimization",
        title: "Minimal responses",
        description: "Avoid returning internal details from failed or blocked requests.",
        enabled: false
      }
    ]
  },
  {
    id: "path-traversal",
    name: "Conceptual Path Traversal",
    category: "access",
    summary:
      "Explains why file access must stay within expected paths and how normalization and allow lists protect the system.",
    actors: [
      { id: "user", label: "User", role: "user" },
      { id: "app", label: "Application", role: "service" },
      { id: "files", label: "Allowed files", role: "database" },
      { id: "attacker", label: "Manipulated path", role: "attacker" }
    ],
    edges: [
      { id: "safe-file", from: "user", to: "app", label: "Allowed file" },
      { id: "unsafe-file", from: "attacker", to: "app", label: "Untrusted path" },
      { id: "file-access", from: "app", to: "files", label: "Controlled read" },
      { id: "path-blocked", from: "app", to: "user", label: "Rejected path" }
    ],
    steps: [
      {
        id: "allowed-file",
        title: "Expected file",
        description: "The user requests an allowed resource inside an application-controlled directory.",
        highlights: { actors: ["user", "app"], edges: ["safe-file"] },
        outcome: "normal"
      },
      {
        id: "path-input",
        title: "Untrusted path",
        description:
          "The simulation shows a manipulated path conceptually, without real file names or abuse instructions.",
        highlights: { actors: ["attacker", "app"], edges: ["unsafe-file"] },
        outcome: "compromised"
      },
      {
        id: "path-risk",
        title: "Directory boundary",
        description:
          "Without controls, the application could try to resolve files outside the allowed space.",
        highlights: { actors: ["app", "files"], edges: ["file-access"] },
        outcome: "compromised"
      },
      {
        id: "path-safe",
        title: "Restricted access",
        description:
          "Path normalization, internal identifiers and allow-list validation keep access bounded.",
        highlights: { actors: ["app", "user"], edges: ["path-blocked"] },
        outcome: "blocked"
      }
    ],
    mitigations: [
      {
        id: "canonical-paths",
        title: "Path normalization",
        description: "Resolve canonical paths and verify they remain inside the allowed directory.",
        enabled: false
      },
      {
        id: "file-ids",
        title: "Internal identifiers",
        description: "Use file IDs instead of accepting direct user-provided paths.",
        enabled: false
      },
      {
        id: "storage-boundary",
        title: "Storage boundary",
        description: "Separate public files from secrets, configuration or system files.",
        enabled: false
      }
    ]
  },
  {
    id: "insecure-upload",
    name: "Insecure File Upload",
    category: "configuration",
    summary:
      "Visualizes why uploaded files must be validated before they are stored or published.",
    actors: [
      { id: "user", label: "User", role: "user" },
      { id: "upload", label: "Upload service", role: "service" },
      { id: "storage", label: "Storage", role: "database" },
      { id: "attacker", label: "Risky file", role: "attacker" }
    ],
    edges: [
      { id: "safe-upload", from: "user", to: "upload", label: "Expected file" },
      { id: "risky-upload", from: "attacker", to: "upload", label: "Untrusted content" },
      { id: "store-file", from: "upload", to: "storage", label: "Storage" },
      { id: "reject-file", from: "upload", to: "user", label: "Rejected upload" }
    ],
    steps: [
      {
        id: "valid-upload",
        title: "Expected upload",
        description: "The user uploads an allowed file and the application processes it with known rules.",
        highlights: { actors: ["user", "upload"], edges: ["safe-upload"] },
        outcome: "normal"
      },
      {
        id: "risky-file",
        title: "Untrusted file",
        description:
          "The simulation represents risky content abstractly, without executable examples or offensive instructions.",
        highlights: { actors: ["attacker", "upload"], edges: ["risky-upload"] },
        outcome: "compromised"
      },
      {
        id: "unsafe-storage",
        title: "Premature publication",
        description:
          "If the file is stored or served without validation, risk can increase for users and services.",
        highlights: { actors: ["upload", "storage"], edges: ["store-file"] },
        outcome: "degraded"
      },
      {
        id: "validated-upload",
        title: "Validated upload",
        description:
          "Type, size, scanning, safe names and isolated storage reduce upload risk.",
        highlights: { actors: ["upload", "user"], edges: ["reject-file"] },
        outcome: "blocked"
      }
    ],
    mitigations: [
      {
        id: "type-size-validation",
        title: "Type and size validation",
        description: "Accept only expected types and reasonable size limits.",
        enabled: false
      },
      {
        id: "isolated-storage",
        title: "Isolated storage",
        description: "Store files in areas without execution permissions or access to secrets.",
        enabled: false
      },
      {
        id: "safe-names",
        title: "Safe names",
        description: "Generate internal names and avoid using submitted names directly.",
        enabled: false
      }
    ]
  },
  {
    id: "security-misconfiguration",
    name: "Security Misconfiguration",
    category: "configuration",
    summary:
      "Shows how defaults, verbose errors or broad permissions can expand exposure.",
    actors: [
      { id: "admin", label: "Technical team", role: "user" },
      { id: "app", label: "Application", role: "service" },
      { id: "logs", label: "Observability", role: "database" },
      { id: "attacker", label: "Hostile reconnaissance", role: "attacker" }
    ],
    edges: [
      { id: "baseline-config", from: "admin", to: "app", label: "Secure configuration" },
      { id: "verbose-errors", from: "app", to: "attacker", label: "Unnecessary signals" },
      { id: "monitoring", from: "app", to: "logs", label: "Controlled events" },
      { id: "hardened", from: "admin", to: "logs", label: "Continuous review" }
    ],
    steps: [
      {
        id: "secure-baseline",
        title: "Secure baseline",
        description: "The team configures minimal values, scoped permissions and controlled messages.",
        highlights: { actors: ["admin", "app"], edges: ["baseline-config"] },
        outcome: "normal"
      },
      {
        id: "verbose-signal",
        title: "Excessive signals",
        description:
          "Verbose errors or default settings can reveal unnecessary context without showing real exploitation.",
        highlights: { actors: ["app", "attacker"], edges: ["verbose-errors"] },
        outcome: "degraded"
      },
      {
        id: "wide-exposure",
        title: "Expanded exposure",
        description:
          "Broad permissions, unnecessary services or misplaced secrets increase potential impact.",
        highlights: { actors: ["app", "logs"], edges: ["monitoring"] },
        outcome: "compromised"
      },
      {
        id: "hardened-review",
        title: "Continuous hardening",
        description:
          "Configuration reviews, monitoring and least privilege reduce accumulated exposure.",
        highlights: { actors: ["admin", "logs"], edges: ["hardened"] },
        outcome: "blocked"
      }
    ],
    mitigations: [
      {
        id: "secure-defaults",
        title: "Secure defaults",
        description: "Disable unnecessary features and control error messages.",
        enabled: false
      },
      {
        id: "secret-hygiene",
        title: "Secret hygiene",
        description: "Keep secrets out of code and rotate them when needed.",
        enabled: false
      },
      {
        id: "configuration-review",
        title: "Continuous review",
        description: "Audit configuration and permission changes as part of the delivery cycle.",
        enabled: false
      }
    ]
  }
];

export const attackModulesByLocale: Record<Locale, AttackModule[]> = {
  es: spanishAttackModules,
  en: englishAttackModules
};

export const uiTextByLocale: Record<Locale, UiText> = {
  es: {
    appSubtitle: "Simulaciones defensivas de seguridad web",
    ethicalBadge: "Educativo y no ofensivo",
    attackNavigation: "Módulos de ataque",
    categoryLabels: {
      injection: "Inyección",
      availability: "Disponibilidad",
      transport: "Transporte y confianza",
      client: "Cliente e interfaz",
      session: "Sesión e intención",
      access: "Acceso y autorización",
      configuration: "Configuración y archivos"
    },
    collapseMenu: "Ocultar menú",
    expandMenu: "Mostrar menú",
    moduleEyebrow: "Módulo interactivo",
    visualizerTitle: "Simulación visual",
    diagramLabel: "Diagrama de flujo del ataque",
    mitigationsTitle: "Mitigaciones",
    defensiveCoverage: "Cobertura defensiva",
    step: "Paso",
    of: "de",
    previous: "Anterior",
    next: "Siguiente",
    reset: "Reiniciar",
    homeEyebrow: "Laboratorio conceptual defensivo",
    homeTitle: "MalevoLens",
    homeDescription:
      "Explora escenarios comunes de seguridad web mediante simulaciones visuales, explicaciones claras y controles de mitigación. El contenido evita payloads reales e instrucciones ofensivas para mantener un enfoque educativo y responsable.",
    startSimulation: "Iniciar simulación",
    theme: "Tema",
    light: "Claro",
    dark: "Oscuro",
    language: "Idioma",
    exportReport: "Exportar reporte",
    reportDownloaded: "Reporte educativo generado",
    reportModule: "Módulo",
    reportSummary: "Resumen",
    reportOutcome: "Resultado",
    reportNoMitigations: "No hay mitigaciones activas.",
    reportEthicalNote:
      "Nota ética: reporte educativo defensivo. No contiene payloads ni instrucciones ofensivas.",
    metricsTitle: "Métricas visuales",
    latency: "Latencia",
    availability: "Disponibilidad",
    trust: "Confianza",
    roles: {
      user: "usuario",
      service: "servicio",
      database: "datos",
      attacker: "riesgo"
    }
  },
  en: {
    appSubtitle: "Defensive web security simulations",
    ethicalBadge: "Educational and non-offensive",
    attackNavigation: "Attack modules",
    categoryLabels: {
      injection: "Injection",
      availability: "Availability",
      transport: "Transport and trust",
      client: "Client and interface",
      session: "Session and intent",
      access: "Access and authorization",
      configuration: "Configuration and files"
    },
    collapseMenu: "Hide menu",
    expandMenu: "Show menu",
    moduleEyebrow: "Interactive module",
    visualizerTitle: "Visual simulation",
    diagramLabel: "Attack flow diagram",
    mitigationsTitle: "Mitigations",
    defensiveCoverage: "Defensive coverage",
    step: "Step",
    of: "of",
    previous: "Previous",
    next: "Next",
    reset: "Reset",
    homeEyebrow: "Defensive conceptual lab",
    homeTitle: "MalevoLens",
    homeDescription:
      "Explore common web security scenarios through visual simulations, clear explanations and mitigation controls. The content avoids real payloads and offensive instructions to keep a responsible educational focus.",
    startSimulation: "Start simulation",
    theme: "Theme",
    light: "Light",
    dark: "Dark",
    language: "Language",
    exportReport: "Export report",
    reportDownloaded: "Educational report generated",
    reportModule: "Module",
    reportSummary: "Summary",
    reportOutcome: "Outcome",
    reportNoMitigations: "No mitigations enabled.",
    reportEthicalNote:
      "Ethical note: defensive educational report. It contains no payloads or offensive instructions.",
    metricsTitle: "Visual metrics",
    latency: "Latency",
    availability: "Availability",
    trust: "Trust",
    roles: {
      user: "user",
      service: "service",
      database: "data",
      attacker: "risk"
    }
  }
};

export function getLocalizedAttackModule(locale: Locale, attackId: string): AttackModule | undefined {
  return attackModulesByLocale[locale].find((module) => module.id === attackId);
}

export function getLocalizedEvaluationCopy(locale: Locale, evaluation: AttackEvaluation) {
  const activeDefenseChangedOutcome = evaluation.activeMitigations > 0;

  if (locale === "en") {
    if (evaluation.outcome === "blocked" && activeDefenseChangedOutcome) {
      return {
        label: "Attack blocked",
        description: "The conceptual defenses cover the critical points of the flow and stop risk progression."
      };
    }

    if (evaluation.outcome === "degraded" && activeDefenseChangedOutcome) {
      return {
        label: "Impact reduced",
        description: "Active defenses reduce the impact, although some exposure surface still remains."
      };
    }

    const copy: Record<AttackEvaluation["outcome"], { label: string; description: string }> = {
      normal: {
        label: "Normal flow",
        description: "Communication follows the expected path without signs of abuse."
      },
      degraded: {
        label: "Degraded service",
        description: "The system keeps partial operation, but with pressure or quality loss."
      },
      blocked: {
        label: "Attack blocked",
        description: "The defenses prevent the scenario from moving toward a harmful state."
      },
      compromised: {
        label: "Compromised risk",
        description: "The simulation shows a conceptual consequence when defensive controls are missing."
      }
    };

    return copy[evaluation.outcome];
  }

  return {
    label: evaluation.label,
    description: evaluation.description
  };
}

# MalevoLens

MalevoLens es una aplicación web interactiva y educativa que visualiza, a nivel conceptual, cómo funcionan ataques comunes a aplicaciones web y cómo se mitigan. Su objetivo es ayudar a entender riesgos de seguridad desde una perspectiva defensiva, sin incluir payloads reales, guías ofensivas ni instrucciones de explotación.

## Demo

Demo pública: pendiente.  
Ejecución local: `npm install` y `npm run dev`.

## Características Principales

- Simulaciones visuales para SQL Injection, DDoS, Man-in-the-Middle, XSS conceptual, CSRF y fallos de autenticacion.
- Explicaciones claras orientadas a defensa y mitigación.
- Abstracción común para actores, conexiones, pasos y controles defensivos.
- Activación interactiva de mitigaciones y evaluación del resultado del ataque.
- Tema claro/oscuro con selector persistente.
- Selector de idioma en español e ingles.
- Métricas visuales por módulo: latencia, disponibilidad y confianza.
- Exportación de reportes educativos por módulo.
- Diseño responsive, mobile-first y accesible por teclado.
- Animaciones determinísticas con Framer Motion.
- Ejecución local sin servicios externos.

## Tecnologías Usadas

- Next.js con App Router
- React con componentes funcionales
- TypeScript en modo estricto
- Tailwind CSS
- Framer Motion

## Arquitectura

El proyecto aplica una adaptación frontend de Clean Architecture. La intención es mantener la lógica de negocio aislada de React y Next.js, facilitar pruebas futuras y permitir agregar nuevos módulos de ataque sin duplicar la UI.

### Domain

Contiene tipos, entidades y reglas puras. No depende de frameworks ni librerías externas.

- `domain/entities.ts`: modelos reutilizables como `AttackModule`, `Actor`, `Step` y `Mitigation`.
- `domain/rules.ts`: evaluación del estado de la simulación, navegación segura de pasos y manejo puro de mitigaciones.

### Application

Coordina los casos de uso desde el punto de vista de la interfaz.

- `application/useAttackState.ts`: hook que maneja paso actual, navegación, activación de mitigaciones, reinicio y evaluación del resultado usando reglas del dominio.

### Infrastructure

Contiene datos y configuración reemplazables por futuras fuentes externas.

- `infrastructure/attackData.ts`: definición tipada de los módulos en español.
- `infrastructure/i18n.ts`: textos de interfaz, traducciones al ingles y recuperación de módulos localizados.

### Presentation

Contiene componentes React dedicados a renderizado e interacción.

- `AttackLayout.tsx`: composición principal del módulo.
- `AttackVisualizer.tsx`: estado visual de la simulación.
- `FlowDiagram.tsx`: nodos, conexiones y resaltados animados.
- `StepController.tsx`: navegación directa entre pasos.
- `ExplanationPanel.tsx`: explicación contextual.
- `MitigationPanel.tsx`: controles defensivos.
- `MetricsPanel.tsx`: métricas visuales de latencia, disponibilidad y confianza.
- `ReportExportButton.tsx`: generación local de reportes educativos por módulo.
- `PreferenceControls.tsx`: selector de idioma y modo claro/oscuro.
- `ControlsPanel.tsx`: anterior, siguiente y reiniciar.
- `Sidebar.tsx` y `Header.tsx`: navegación general.

## Estructura del Proyecto

```text
/app
  /attacks/[attackId]/page.tsx
  layout.tsx
  page.tsx
/application
  useAttackState.ts
/domain
  entities.ts
  rules.ts
/infrastructure
  attackData.ts
  i18n.ts
/presentation
  /components
    AppPreferencesProvider.tsx
    AttackLayout.tsx
    AttackVisualizer.tsx
    ControlsPanel.tsx
    ExplanationPanel.tsx
    FlowDiagram.tsx
    Header.tsx
    MetricsPanel.tsx
    MitigationPanel.tsx
    PreferenceControls.tsx
    ReportExportButton.tsx
    Sidebar.tsx
    StepController.tsx
/styles
  globals.css
```

## Cómo Ejecutar el Proyecto

1. Instalar dependencias:

```bash
npm install
```

2. Ejecutar en modo desarrollo:

```bash
npm run dev
```

3. Abrir la aplicación:

```text
http://localhost:3000
```

4. Verificar tipos:

```bash
npm run typecheck
```

5. Generar build de producción:

```bash
npm run build
```

## Descripción Visual

La pantalla principal presenta una navegación lateral con los módulos disponibles. Cada módulo muestra un diagrama de flujo con actores y conexiones, un panel de explicación del paso actual, un panel de mitigaciones y métricas visuales de latencia, disponibilidad y confianza. Al avanzar la simulación, los nodos y conexiones relevantes se resaltan, y el estado puede cambiar entre normal, degradado, comprometido o bloqueado según las defensas activadas.

El encabezado mantiene la marca a la izquierda y controles compactos a la derecha para alternar idioma y tema. La exportación de reportes genera un archivo local `.txt` con resumen, paso actual, estado, métricas y mitigaciones activas.

## Consideraciones Éticas

MalevoLens está diseñado para educación defensiva. Por eso:

- No incluye payloads reales.
- No muestra queries explotables.
- No enseña procedimientos ofensivos.
- No automatiza ataques.
- Sí explica conceptos, riesgos y buenas prácticas de mitigación.

Los escenarios son abstraídos deliberadamente para ayudar a comprender la seguridad sin facilitar abuso.

## Futuras Mejoras

- Añadir pruebas unitarias para reglas de dominio.
- Incorporar modo de evaluación con preguntas defensivas.
- Agregar persistencia opcional del progreso del usuario.
- Añadir capturas automatizadas para documentar cambios visuales.

## Autor

Arturo Badillo  
Avalon Labs

## Licencia

MIT. Puedes usar, adaptar y extender el proyecto respetando el enfoque educativo y defensivo.

## Invitame un cafe

Si quieres apoyar el proyecto:

<a href="https://www.paypal.com/paypalme/arararcadabra?locale.x=es_XC&country.x=EC" target="_blank">
  <img src="https://img.shields.io/badge/Invitame%20un%20cafe-PayPal-00457C?style=for-the-badge&logo=paypal&logoColor=white" alt="Invitame un cafe">
</a>

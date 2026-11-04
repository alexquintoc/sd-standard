# Árboles para la naturaleza — guía para la evaluación preliminar BID26

## Estado y alcance

**Preliminary Assessment — BID 2026**

Evaluación exploratoria basada en información pública revisada el 4 de noviembre de 2026. Los hallazgos requieren verificación con el equipo de diseño. Este documento no constituye certificación del SD Standard, una puntuación, ni una medición de impacto ecológico.

La lectura central separa cuatro niveles que todavía no deben confundirse:

1. La plataforma publica información ambiental.
2. Las personas comprenden o recuerdan esa información.
3. La información cambia decisiones o conductas.
4. Esas decisiones producen mejoras ecológicas medibles.

El primer nivel está documentado. Los niveles segundo a cuarto requieren evidencia adicional.

## Fuentes revisadas

- Ficha oficial BID26 del proyecto: <https://bid-dimad.com/bid/trabajo_pr/arboles-para-la-naturaleza-conoce-las-especies/?filtropais=Puerto%20Rico>
- Página oficial de la sesión: <https://bid-dimad.com/evento/pon-tu-proyecto-a-prueba/>
- Experiencia activa: <https://www.paralanaturaleza.org/reforestacion/arboles>
- Ficha de muestra, Matabuey: <https://www.paralanaturaleza.org/reforestacion/arboles?arbol=goetzea-elegans>
- Sitio de TEMBOL: <https://tembol.co/works>

## Resumen de criterios seleccionados

| Pilar | ID interno / visible | Criterio | Evidencia preliminar | Falta verificar |
| --- | --- | --- | --- | --- |
| Medio ambiente | E1 / E1 | Environmental Impact Reduction | Propósito ambiental y funciones de orientación confirmados. | LCS/LCA, línea base, acción de reducción y resultados atribuibles. |
| Medio ambiente | E18 / E16 | Consumer Energy Efficiency | Modo offline con paquete ligero de texto, datos y mapa; omite medios. | Peso real, rendimiento, alojamiento, tráfico, energía y dispositivos. |
| Medio ambiente | E11 / E19 | Quantified GHG Reporting and Certification | No se encontró informe público cuantificado. | Método, alcance, periodo, datos y verificación. |
| Medio ambiente | EM6 / EM10 | Ecosystems Conservation — obligatorio | Contenido contextual para orientar especies y misión de conservación. | Salvaguardas y verificación del proyecto, TEMBOL y cliente conforme al criterio. |
| Sociedad | S6 / S8 | Electronic Documents | Idioma, estructura semántica y atributos alt observados; hallazgos automatizados preliminares. | Auditoría WCAG manual y con usuarios; teclado, foco, contraste, transcripciones. |
| Sociedad | S9 / S11 | Intellectual Property | Créditos iNaturalist y cita/enlace UICN visibles. | Licencias, permisos y autoría de textos, fotos, ilustraciones y audio. |
| Sociedad | S16 / S17 | Educational Component | Componente educativo confirmado mediante fichas y explicaciones ecológicas. | Objetivos, comprensión, retención y efecto en decisiones. |
| Cultura | C4 / C3 | Local Culture | Adaptación observable a Puerto Rico, español y contexto de reforestación local. | Investigación, validación regional y voces que influyeron en el diseño. |
| Cultura | C6 / C6 | Audience Engagement | Producto orientado a públicos y viveros. | Participación de usuarios y especialistas durante el diseño y pruebas. |
| Cultura | C7 / C7 | Community Participation | Enlace a esfuerzos de reforestación y misión pública del cliente. | Participación sostenida, funciones comunitarias y papel de la entidad de diseño. |
| Finanzas | F1 / F1 | Economic Benefits | Utilidad potencial para selección y conservación. | Beneficiarios, costos o tiempo evitado, empleo y distribución del valor. |
| Finanzas | F7 / F7 | Design Thinking | Información científica organizada como experiencia buscable y accionable. | Valor medible, presupuesto, responsables, financiación y mantenimiento. |

Los códigos visibles pueden diferir de los IDs internos estables. El JSON usa los IDs internos exactos de `criteria.v2.json`.

## Preguntas para la conversación

### Prioridad para 15 minutos

1. **E1 — Environmental Impact Reduction:** ¿Qué decisiones de diseño tomaron para reducir el impacto ambiental de la propia plataforma digital y cómo las verificaron?
2. **S16 — Educational Component:** ¿Cómo saben si las personas que utilizan la plataforma realmente aprenden algo nuevo o toman mejores decisiones?
3. **C6 — Audience Engagement:** ¿Participaron comunidades, especialistas, viveristas o usuarios finales en el desarrollo y qué decisiones cambiaron a partir de sus aportaciones?
4. **EM6 — Ecosystems Conservation:** ¿Cómo verifican que la información y las recomendaciones de especies eviten daños ecológicos y apoyen la conservación en cada contexto de siembra?
5. **F7 — Design Thinking:** ¿Cómo está prevista la actualización y el mantenimiento a largo plazo, y qué valor medible esperan que produzca para usuarios y organización?

### Preguntas de respaldo

6. **E18 — Consumer Energy Efficiency:** ¿Midieron el peso, la velocidad o el consumo de datos de la plataforma y qué decisiones tomaron para hacerla más ligera?
7. **S6 — Electronic Documents:** ¿Cómo consideraron la accesibilidad para personas con distintas capacidades o niveles de acceso a tecnología?
8. **S9 — Intellectual Property:** ¿Cómo gestionaron la autoría, los permisos y las licencias de fotografías, ilustraciones, audios y datos externos?
9. **C4 — Local Culture:** ¿Qué aspectos del contexto puertorriqueño influyeron en el lenguaje, la estructura y la experiencia de la plataforma?
10. **F1 — Economic Benefits:** ¿Qué beneficios concretos genera la plataforma para organizaciones o comunidades que trabajan en conservación y cómo los conocen?

Si el diálogo revela que existen mediciones de árboles sembrados, selección de especies o supervivencia, preguntar además: **¿Qué parte de ese resultado puede atribuirse razonablemente a la herramienta y qué otros factores intervinieron?**

## Oportunidades preliminares

1. Definir una cadena de impacto que separe publicación, aprendizaje, decisiones, conducta y resultados ecológicos.
2. Establecer presupuestos de rendimiento y datos para rutas, imágenes, audio, fuentes y JavaScript; registrar alojamiento y caché.
3. Completar una auditoría WCAG con pruebas manuales y usuarios, incluyendo transcripciones de audio y estados dinámicos.
4. Mantener un registro de fuentes, versiones, créditos, licencias y gobernanza de los datos externos.
5. Acordar indicadores, responsables, calendario y financiación para mantenimiento y seguimiento de resultados.

## Instrucciones para la presentación

### Antes de la sesión

1. En `/workspace`, si hay otro proyecto activo, usar **Download JSON** antes de reemplazarlo.
2. Conservar dos archivos claramente nombrados: el JSON de YKUA y `arboles-para-la-naturaleza-bid2026-preliminary.json`.
3. Elegir **Open Project** o **Project file**, seleccionar el JSON de Árboles y revisar la pantalla de importación.
4. Confirmar la importación. El Workspace guarda un único proyecto activo en el almacenamiento local del navegador; importar reemplaza la vista activa, no el archivo descargado.
5. Abrir **Passport preview** (`/workspace/passport`) y confirmar el título y la etiqueta preliminar en el propósito.

### Durante la conversación

1. Mostrar el Passport y explicar que la visualización presenta cobertura y evidencia, no una puntuación.
2. Abrir **Criteria** y seleccionar el criterio relacionado con la pregunta prioritaria.
3. Leer la observación y la información faltante, luego formular la pregunta.
4. Añadir la nueva evidencia o nota con su fuente. Distinguir declaración del diseñador, documento, medición y supuesto.
5. Cambiar `status` o `response` solo si la evidencia lo justifica. Mantener EM6 pendiente hasta verificar el alcance obligatorio.
6. Guardar: el Workspace realiza guardado local automático. Esperar que el indicador de guardado termine antes de cambiar de proyecto o cerrar.
7. Volver a **Passport preview** para revisar el cambio en cobertura.

### Después de la conversación

1. Usar **Download JSON** para exportar el proyecto actualizado.
2. Renombrar la copia con fecha o versión, por ejemplo `arboles-para-la-naturaleza-bid2026-updated-2026-11-04.json`.
3. Para regresar a YKUA, descargar primero cualquier cambio pendiente de Árboles y luego importar el JSON de YKUA mediante el mismo flujo.
4. No depender del navegador para conservar dos proyectos simultáneamente; los archivos JSON son el mecanismo seguro para alternarlos y archivarlos.

## Hallazgos técnicos preliminares del sitio

La revisión ligera de la experiencia activa encontró `lang="es"`, encabezados y controles semánticos, búsqueda y filtros, 118 imágenes con atributo `alt` (una alternativa vacía), un elemento de audio sin pista de texto y 29 controles sin nombre detectable mediante una comprobación DOM simplificada. La interfaz también presenta un modo offline con un paquete estimado de 1.7 MB para texto, datos y mapa en español, sin descargar fotos ni ilustraciones.

Estos datos son señales para investigación. No son una auditoría WCAG, una medición de energía ni un cálculo de emisiones. Los controles pueden estar ocultos o depender de contexto, y la calidad del texto alternativo requiere revisión humana.

# ATOM SPORT: propuesta de rediseño web (Potenaris)

Demo conceptual de la home. No es la web oficial ni está conectada a sistemas privados del centro.

**Cómo verla:** `node serve.mjs` y abrir `http://localhost:4173`.
Añade `?notas` a la URL (o pulsa «Ver notas» en la franja superior) para ver resaltados los 18 puntos que el gimnasio tiene que confirmar.

---

## 1. Qué se encontró en la web actual (consulta del 10/10/2026)

Hechos comprobados en `atomsport.es` / `atomsport.ismygym.com`:

| Hallazgo | Evidencia |
|---|---|
| La home no tiene hero ni propuesta de valor: solo un título «ACTIVIDADES» y un carrusel. | En nuestra prueba el carrusel aparecía vacío y el preloader seguía visible con la página ya cargada. |
| `www.atomsport.es` no funciona por HTTPS. | La conexión HTTPS falla. El formulario de alta pide DNI y viaja sin cifrar. `atomsport.ismygym.com` sí tiene HTTPS. |
| SEO técnico vacío. | `meta description` y `og:description` vacías; `title` = «ATOM SPORT» en todas las páginas; imágenes sin `alt`. |
| Menú con secciones vacías. | Documentos, Galería, Promociones, Eventos y Noticias no tienen contenido. |
| Opciones internas visibles al público. | El filtro de reservas muestra «Acceso torno Gimnasio (NO BORRAR)» y «Acceso torno Artes Marciales (NO BORRAR)». |
| Iconos sociales rotos. | Apuntan a `http://://www.twitter.com/ismygym`, `ftp://atomsport/` y `ftp://atomspoort/`. |
| Tarifas sin llamada a la acción. | La página de tarifas no enlaza al alta ni al contacto. |
| Fichas incompletas. | Taekwondo, Fitbarré, Yoga Yin / Breath y Jiu-jitsu kids no tienen descripción. |
| Artes marciales fuera del horario público. | El horario de reservas solo muestra Sala 1 y Sala 2 Dirigidas. |
| La identidad de marca es el logo monocromo. | El azul de la web es el de la plantilla IsMyGym («skin v2»), no un color de marca. |

Lo que sí funciona y se conserva: el sistema de reservas, el área de socio (login con código de socio), el alta online, el horario en PDF y el WhatsApp.

## 2. Dirección creativa

- **Idea:** «Levanta. Golpea. Respira.» Tres verbos para las tres grandes familias de su oferta real: fuerza, combate y cuerpo y mente. Cada palabra del hero es interactiva: cambia la imagen y enlaza con su categoría.
- **Color:** base monocroma (carbón #0C0D0F y hueso #F3F1EC), heredada del logotipo, con un único acento cobalto #2F4BFF para las acciones. El azul da continuidad con lo que los socios ya ven en el sistema de reservas, que seguirá siendo azul, y encaja con la idea del átomo. Evita el negro con rojo o neón típico de los gimnasios. El cobalto tiene un contraste de 5,9:1 sobre blanco.
- **Tipografía:** Archivo, una variable de ancho ajustable: condensada para los titulares y normal para el texto. IBM Plex Mono para datos (horas, etiquetas, precios). Dos familias en total.
- **Fotografía:** todas las imágenes son provisionales (Unsplash) y llevan la etiqueta visible «Imagen provisional». Tienen un tratamiento en blanco y negro común, que da coherencia y se podrá aplicar después a una sesión de fotos real.
- **Marca:** se conservan la órbita atómica y la «À» del logotipo. El wordmark está reconstruido en SVG solo para la demo.

## 3. Arquitectura y mejoras de captación

Una sola home que contesta, por orden, las preguntas de quien busca gimnasio:

1. **Hero:** la propuesta de valor, el CTA «Ver tarifas y hazte socio», el horario y WhatsApp. Debajo, cuatro datos verificados: desde 41,90 €, 45 clases en la semana publicada, 23 disciplinas e Inca.
2. **Actividades:** 23 disciplinas en 5 áreas (Fuerza y sala, Cardio y baile, Combate, Cuerpo y mente, Infantil). Descripciones reescritas a partir de las oficiales, con un enlace a la ficha real de cada una.
3. **Horarios:** el horario publicado (5–11 oct 2026) por día y tipo, con un enlace de reserva real por clase, el PDF y el área de socio.
4. **Tarifas:** comparativa clara, con cambio mensual/trimestral, la inscripción visible, lo que incluye y lo que no, y las tarifas no publicadas explicadas.
5. **Alta en 4 pasos:** el proceso real de IsMyGym explicado antes de mandar al formulario, con el aviso de que los menores se inscriben en recepción.
6. **El centro:** galería editorial y datos del centro.
7. **Preguntas frecuentes:** solo respuestas verificadas.
8. **Contacto:** WhatsApp, teléfono, email, cómo llegar y un mapa que solo carga si se pide. También un formulario que abre WhatsApp con el mensaje redactado.

En móvil hay una barra fija con Horario, Tarifas, Llamar y WhatsApp, menú a pantalla completa y pestañas desplazables. No hay desplazamiento horizontal.

## 4. Qué funciona de verdad en la demo

- Todos los enlaces al sistema existente (alta, reservas, una reserva por clase, área de socio, PDF y textos legales) van a `https://atomsport.ismygym.com`. Se han comprobado los 41 enlaces y las 17 URLs de reserva: todos responden.
- WhatsApp (enlaces con mensaje preparado), teléfono, email y «Cómo llegar».
- Formulario a WhatsApp con validación. No guarda datos.
- Explorador de actividades accesible por teclado.
- Horario con filtros, marca de «hoy» y botón de siguiente día.
- Cambio de precio mensual/trimestral. Los equivalentes mensuales son aritmética sobre los precios publicados.
- Mapa de Google bajo demanda, sin cookies hasta que se pulsa.
- Modo notas de la propuesta.
- `prefers-reduced-motion` respetado: el hero no cambia solo.
- HTML semántico, JSON-LD `ExerciseGym` y `meta` completas. Para la demo lleva `noindex`.

**No operativo o simulado:** el horario es una copia estática de una semana, no está sincronizado. No hay integración con la API de IsMyGym.

## 5. Qué tiene que confirmar el gimnasio

1. La periodicidad de «Sala fitness 41,90 €», que se muestra como mensual.
2. Si el Basic trimestral incluye clases dirigidas.
3. La periodicidad y el contenido de «Sala con entreno incluido» (180 €).
4. Las tarifas, horarios y edades de las artes marciales y las actividades infantiles, y si están incluidas en alguna cuota.
5. El horario de apertura. Las fuentes de terceros se contradicen.
6. Si se ofrecen visitas o una sesión de prueba. La demo no promete ninguna.
7. Las descripciones nuevas de Taekwondo, Fitbarré, Yoga Yin / Breath y Jiu-jitsu kids.
8. Los espacios: si existe un área propia de artes marciales (se deduce del «torno Artes Marciales»).
9. Que la licencia Les Mills esté vigente antes de destacarla.
10. El logotipo original en vectorial.
11. Las fotos reales y el permiso de las personas que aparezcan.
12. Las reseñas: un directorio de terceros cita 4,7 sobre 5 con 57 reseñas en Google. No lo hemos verificado y no se usa.
13. El equipo de monitores, si quieren presentarlo, con su consentimiento.

## 6. Qué falta para producción

- Sesión de fotografía (sala, salas dirigidas, combate, ambiente de clase) y, si se quiere, un vídeo corto para el hero.
- Dominio con HTTPS y redirección de `atomsport.es`, sitio en ES y CA (y EN si interesa), textos legales revisados y banner de cookies si se añaden analíticas.
- Páginas adicionales: una ficha por disciplina con horario y monitor, una página del centro con galería y una landing de alta. Valorar una página propia para artes marciales e infantil.
- Integración del horario: preguntar a IsMyGym si hay API o widget. Si no, actualizar el horario a mano o enlazarlo.
- Limpiar el panel de IsMyGym: ocultar las opciones «NO BORRAR» del filtro público, quitar las secciones vacías y arreglar las redes sociales.
- Analítica respetuosa (por ejemplo, eventos de clic en WhatsApp, alta y reserva), Search Console y perfil de Google Business.
- Optimización final: servir las imágenes propias en AVIF/WebP, autoalojar las fuentes y auditoría Lighthouse en el servidor final.

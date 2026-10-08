# INNOVA — Consultora de Tecnología

Sitio web institucional de INNOVA (trabajo práctico de la facultad). Hecho con **HTML, CSS y JavaScript** puro, sin dependencias.

## Ver el sitio
Abrí `index.html` en el navegador (doble clic) o usá la extensión *Live Server* de VS Code.

## Estructura
```
index.html      → inicio, servicios, proyectos y contacto
servicios.html  → listado de servicios (cada uno abre su página en servicios/)
nosotros.html   → identidad (misión, visión, valores) y equipo
css/styles.css  → estilos y animaciones
js/main.js      → interacciones (menú, animaciones, filtro, WhatsApp)
servicios/      → una página por cada servicio
img/            → fotos del equipo y capturas de proyectos
```

## Qué tiene que cargar cada uno
| Qué | Dónde |
|---|---|
| Número de WhatsApp | `js/main.js` → `WHATSAPP_NUMBER` (formato `549XXXXXXXXXX`) |
| Nombre, rol y descripción de cada integrante | `nosotros.html` → sección `#equipo` |
| Foto de perfil | Guardar en `img/` y reemplazar `<span class="member__initials">` por `<img src="img/nombre.jpg" alt="Nombre">` |
| Proyectos del portafolio | `index.html` → sección `#proyectos` (categoría en `data-category`: `web`, `app` o `sistema`) |
| Dirección, horarios, redes | `index.html` → secciones `#contacto` y footer |
| Contenido de cada servicio (qué incluye, proceso, tecnologías) | `servicios/<servicio>.html` |
| Estadísticas del inicio | `index.html` → atributos `data-target` de `.counter` |

## Trabajo en equipo
```bash
git pull                 # traer cambios antes de empezar
git add .
git commit -m "Cargo mis datos en la sección equipo"
git push
```

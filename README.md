# Game Recommended AI - Frontend 🎮🤖

¡Bienvenido al frontend de **Game Recommended AI**! Esta es una aplicación web moderna e interactiva diseñada para analizar y visualizar de forma inteligente la recomendación real de videojuegos en Steam mediante Inteligencia Artificial y Procesamiento de Lenguaje Natural (NLP).

El cliente web se conecta a un backend en FastAPI que extrae reseñas recientes escritas en español de la API de Steam, las limpia de caracteres innecesarios y calcula las probabilidades utilizando un modelo de Machine Learning para clasificar el sentimiento en positivo o negativo. De esta manera, el frontend presenta un veredicto alternativo al oficial de Steam, ayudando a identificar casos de *review bombing* o discrepancias de opinión.

---

## 🚀 Tecnologías Principales

Para lograr una interfaz rápida, interactiva y visualmente espectacular, se ha empleado la siguiente pila tecnológica:

*   **[React 19](https://react.dev/)**: Biblioteca principal para la construcción de la interfaz y la gestión reactiva del estado.
*   **[React Router 7](https://reactrouter.com/)**: Enrutamiento declarativo para navegar fluidamente entre páginas.
*   **[Vite 8](https://vite.dev/)**: Herramienta de compilación ultrarrápida y servidor de desarrollo con HMR instantáneo.
*   **[Tailwind CSS v4](https://tailwindcss.com/)**: Motor de estilos de última generación para lograr un diseño responsivo, moderno, con gradientes sutiles y efectos de *glassmorphism*.
*   **[PNPM](https://pnpm.io/)**: Gestor de paquetes rápido y eficiente en disco.

---

## ✨ Características Clave

*   🔍 **Buscador Inteligente de Juegos**: Permite buscar cualquier título por su nombre directamente con autocompletado y sugerencias visuales, o bien realizar la consulta directa introduciendo el AppID o la URL de la tienda de Steam.
*   ⚙️ **Simulador de Pipeline de Carga**: Durante el análisis, el frontend muestra dinámicamente cada uno de los pasos técnicos internos que ejecuta el backend (extracción, procesamiento de NLP, inferencia del clasificador, cálculo de veredicto, etc.).
*   📊 **Dashboard de Reporte Interactivo**: Presenta un informe completo del juego analizado:
    *   **Veredicto de la IA**: Cuatro niveles (Extremadamente Recomendado, Recomendado, Mixto, No Recomendado).
    *   **Metadatos de Steam**: Muestra el desarrollador, géneros, fecha de lanzamiento y precio actual en la tarjeta del juego.
    *   **Conceptos Destacados**: Nube de etiquetas dinámicas basada en la frecuencia de palabras encontradas en las reseñas.
    *   **Insignia para GitHub (SVG Badge)**: Genera y permite copiar un badge dinámico en formato Markdown para lucir el veredicto en repositorios de GitHub.
    *   **Ratio de Aprobación Real**: Comparativa en porcentaje de la puntuación calculada por el modelo Naive Bayes frente a la calificación oficial de Steam.
    *   **Resumen Semántico**: Detalle del conteo de opiniones positivas y negativas clasificadas.
*   🛍️ **Comparador de Precios**: Enlaces directos a Instant Gaming y Steam para adquirir el juego al mejor precio.
*   💡 **Sección Informativa Técnica**: Una sección dedicada ("¿Cómo funciona?") que detalla paso a paso el flujo de datos del sistema, promoviendo la transparencia de la IA.
*   📜 **Registro de Cambios**: Sección "Changelog" accesible para auditar la evolución y actualizaciones de la plataforma.

---

## 📁 Estructura del Proyecto

El código está estructurado de manera modular y limpia en el directorio `/src`:

```text
frontend/
├── public/                # Activos estáticos públicos
├── src/
│   ├── components/        # Componentes interactivos modulares
│   │   ├── Header.jsx             # Barra de navegación con soporte para React Router
│   │   ├── Input.jsx              # Buscador inteligente y manejo de autocompletado
│   │   ├── RecommendationCard.jsx # Tarjeta de resultados detallados, nube de palabras y badge SVG
│   │   ├── HowItWorks.jsx         # Panel con la explicación del flujo de datos de la IA
│   │   └── Changelog.jsx          # Historial de cambios y versiones del proyecto
│   ├── services/          # Conexiones con la API del backend
│   │   ├── steamService.js        # Peticiones de búsqueda y análisis de juegos
│   │   └── healthService.js       # Comprobación de salud de los servicios
│   ├── App.jsx            # Configuración de rutas principales de la aplicación
│   ├── App.css            # Estilos personalizados y variables de Tailwind v4
│   └── main.jsx           # Punto de entrada de la aplicación React
├── .env.development       # Variables de entorno para desarrollo local
├── .env.production        # Variables de entorno para producción
├── .gitignore             # Configuración de archivos omitidos en el control de versiones
├── eslint.config.js       # Configuración de reglas y buenas prácticas de ESLint
├── package.json           # Dependencias, scripts y configuración de npm
└── vite.config.js         # Configuración del empaquetador Vite
```

---

## 🛠️ Configuración Local

Sigue estos pasos para levantar el entorno de desarrollo local:

### 1. Requisitos Previos

Asegúrate de tener instalado [Node.js](https://nodejs.org/). Se recomienda utilizar `pnpm` como gestor de paquetes.

### 2. Instalar Dependencias

Desde la raíz del subdirectorio `/frontend`, ejecuta el siguiente comando:

```bash
pnpm install
```

### 3. Variables de Entorno

El proyecto gestiona la URL de conexión con el backend de Python mediante variables de entorno:

*   **`.env.development`**:
    ```ini
    VITE_API_URL_DEV=http://localhost:8000
    ```

Asegúrate de que el backend de FastAPI esté corriendo en la dirección configurada en `VITE_API_URL` durante el desarrollo local.

### 4. Iniciar Servidor de Desarrollo

Inicia la aplicación en modo desarrollo:

```bash
pnpm run dev
```

Abre tu navegador en la dirección local indicada por la terminal (por defecto, `http://localhost:5173`).

---

## 🛡️ Estilo de Código y Calidad

El proyecto utiliza **ESLint** configurado con las reglas estándar de React para garantizar la calidad del código. Puedes ejecutar el analizador de código estático con:

```bash
pnpm lint
```

---

Desarrollado con fines educativos y profesionales de portfolio por [Alejandro TG](https://portfolio.alejandrotg.es).

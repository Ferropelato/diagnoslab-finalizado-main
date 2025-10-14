// Configuración de build para DiagnosLab
// Script para optimizar y minificar archivos

const fs = require('fs');
const path = require('path');

const config = {
  // Archivos CSS a combinar
  cssFiles: [
    'css/main.css',
    'style/style.css'
  ],
  
  // Archivos JS a combinar
  jsFiles: [
    'js/utils.js',
    'js/cart-manager.js',
    'js/main.js',
    'js/forms.js',
    'js/productos.js',
    'js/cart.js'
  ],
  
  // Archivos HTML a procesar
  htmlFiles: [
    'index.html',
    'pages/productos.html',
    'pages/servicios.html',
    'pages/nosotros.html',
    'pages/contacto.html',
    'pages/registro.html',
    'pages/carrito.html'
  ],
  
  // Directorio de salida
  outputDir: 'dist',
  
  // Configuración de minificación
  minify: {
    css: true,
    js: true,
    html: true
  }
};

// Función para minificar CSS
function minifyCSS(css) {
  return css
    .replace(/\/\*[\s\S]*?\*\//g, '') // Comentarios
    .replace(/\s+/g, ' ') // Espacios múltiples
    .replace(/;\s*}/g, '}') // Punto y coma antes de }
    .replace(/\s*{\s*/g, '{') // Espacios alrededor de {
    .replace(/;\s*/g, ';') // Espacios después de ;
    .replace(/,\s*/g, ',') // Espacios después de comas
    .trim();
}

// Función para minificar JS
function minifyJS(js) {
  return js
    .replace(/\/\*[\s\S]*?\*\//g, '') // Comentarios de bloque
    .replace(/\/\/.*$/gm, '') // Comentarios de línea
    .replace(/\s+/g, ' ') // Espacios múltiples
    .replace(/\s*([{}();,=])\s*/g, '$1') // Espacios alrededor de operadores
    .trim();
}

// Función para minificar HTML
function minifyHTML(html) {
  return html
    .replace(/\s+/g, ' ') // Espacios múltiples
    .replace(/>\s+</g, '><') // Espacios entre tags
    .trim();
}

// Función principal de build
function build() {
  console.log('🚀 Iniciando build de DiagnosLab...');
  
  // Crear directorio de salida
  if (!fs.existsSync(config.outputDir)) {
    fs.mkdirSync(config.outputDir, { recursive: true });
  }
  
  // Procesar archivos CSS
  console.log('📝 Procesando archivos CSS...');
  let combinedCSS = '';
  config.cssFiles.forEach(file => {
    if (fs.existsSync(file)) {
      const content = fs.readFileSync(file, 'utf8');
      combinedCSS += content + '\n';
    }
  });
  
  if (config.minify.css) {
    combinedCSS = minifyCSS(combinedCSS);
  }
  
  fs.writeFileSync(path.join(config.outputDir, 'styles.min.css'), combinedCSS);
  
  // Procesar archivos JS
  console.log('📝 Procesando archivos JS...');
  let combinedJS = '';
  config.jsFiles.forEach(file => {
    if (fs.existsSync(file)) {
      const content = fs.readFileSync(file, 'utf8');
      combinedJS += content + '\n';
    }
  });
  
  if (config.minify.js) {
    combinedJS = minifyJS(combinedJS);
  }
  
  fs.writeFileSync(path.join(config.outputDir, 'scripts.min.js'), combinedJS);
  
  // Copiar archivos estáticos
  console.log('📁 Copiando archivos estáticos...');
  const staticFiles = ['acces', 'pages'];
  staticFiles.forEach(dir => {
    if (fs.existsSync(dir)) {
      const destDir = path.join(config.outputDir, dir);
      if (!fs.existsSync(destDir)) {
        fs.mkdirSync(destDir, { recursive: true });
      }
      copyDir(dir, destDir);
    }
  });
  
  console.log('✅ Build completado!');
  console.log(`📦 Archivos generados en: ${config.outputDir}/`);
}

// Función para copiar directorios recursivamente
function copyDir(src, dest) {
  const entries = fs.readdirSync(src, { withFileTypes: true });
  
  for (const entry of entries) {
    const srcPath = path.join(src, entry.name);
    const destPath = path.join(dest, entry.name);
    
    if (entry.isDirectory()) {
      if (!fs.existsSync(destPath)) {
        fs.mkdirSync(destPath, { recursive: true });
      }
      copyDir(srcPath, destPath);
    } else {
      fs.copyFileSync(srcPath, destPath);
    }
  }
}

// Ejecutar build si se llama directamente
if (require.main === module) {
  build();
}

module.exports = { build, config };

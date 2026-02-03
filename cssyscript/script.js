// 1. SELECCIÓN DE ELEMENTOS
const canvas = document.getElementById('lienzo');
const ctx = canvas.getContext('2d');
const slider = document.getElementById('slider-grosor');
const textoGrosor = document.getElementById('valor-grosor');

// --- NUEVA VARIABLE DE ESTADO ---
// Esto nos dice qué herramienta tenemos en la mano
let herramientaActual = 'pincel'; // Puede ser 'pincel' o 'cubo'
let dibujando = false;
let colorActual = 'black'; // El color seleccionado (negro por defecto)
let grosorActual = 5;

// 2. CONFIGURACIÓN DEL CANVAS
function ajustarCanvas() {
    canvas.width = canvas.offsetWidth;
    canvas.height = canvas.offsetHeight;
    ctx.lineCap = 'round';
    ctx.lineJoin = 'round';
    // Importante: Inicializamos el fondo en blanco
    ctx.fillStyle = "white"; 
    ctx.fillRect(0,0, canvas.width, canvas.height);
}
window.addEventListener('load', ajustarCanvas);
window.addEventListener('resize', ajustarCanvas);

// 3. LÓGICA DEL RATÓN (Aquí está el cambio principal)
function empezar(e) {
    // A) Si tenemos el CUBO seleccionado, pintamos todo el fondo
    if (herramientaActual === 'cubo') {
        ctx.fillStyle = colorActual;
        ctx.fillRect(0, 0, canvas.width, canvas.height);
    } 
    // B) Si tenemos el PINCEL, empezamos a dibujar
    else if (herramientaActual === 'pincel') {
        dibujando = true;
        dibujar(e); // Para que pinte un punto si solo hacemos clic
    }
}

function terminar() {
    dibujando = false;
    ctx.beginPath(); 
}

function dibujar(e) {
    // Si no estamos dibujando O si tenemos el cubo, no hacemos nada al mover el ratón
    if (!dibujando || herramientaActual === 'cubo') return;

    const rect = canvas.getBoundingClientRect();
    const x = e.clientX - rect.left;
    const y = e.clientY - rect.top;

    ctx.lineWidth = grosorActual;
    ctx.strokeStyle = colorActual;

    ctx.lineTo(x, y);
    ctx.stroke();
    ctx.beginPath();
    ctx.moveTo(x, y);
}

// Eventos del Ratón
canvas.addEventListener('mousedown', empezar);
canvas.addEventListener('mouseup', terminar);
canvas.addEventListener('mousemove', dibujar);
// Si el ratón se sale del canvas, dejamos de dibujar
canvas.addEventListener('mouseleave', terminar);

// 4. LÓGICA DE COLORES
const botonesColores = document.querySelectorAll('.color-btn');
botonesColores.forEach(boton => {
    boton.addEventListener('click', (e) => {
        botonesColores.forEach(b => b.classList.remove('activo'));
        e.target.classList.add('activo');
        colorActual = e.target.getAttribute('data-color');
    });
});

// 5. LÓGICA DEL SLIDER
slider.addEventListener('input', () => {
    grosorActual = slider.value;
    textoGrosor.textContent = slider.value + 'px';
});

// 6. LÓGICA DE HERRAMIENTAS (Pincel vs Cubo vs Basura)

// A) Botón PINCEL
document.getElementById('btn-pincel').addEventListener('click', () => {
    herramientaActual = 'pincel';
    // Visualmente marcamos el pincel
    document.getElementById('btn-pincel').classList.add('activo');
    document.getElementById('btn-cubo').classList.remove('activo');
});

// B) Botón CUBO
document.getElementById('btn-cubo').addEventListener('click', () => {
    herramientaActual = 'cubo';
    // Visualmente marcamos el cubo
    document.getElementById('btn-cubo').classList.add('activo');
    document.getElementById('btn-pincel').classList.remove('activo');
});

// C) Botón BASURA (Este sigue siendo un botón de acción inmediata)
document.getElementById('btn-basura').addEventListener('click', () => {
    if(confirm("¿Borrar todo el dibujo?")) {
        ctx.fillStyle = "white";
        ctx.clearRect(0, 0, canvas.width, canvas.height);
        ctx.fillRect(0, 0, canvas.width, canvas.height);
    }
});
'use strict';

const STORAGE_KEY_FAV  = 'elcaleno_favoritos';
const STORAGE_KEY_NEWS = 'elcaleno_noticias';
const JSON_PATH        = 'data/noticias.json';

async function cargarNoticias() {
  const guardadas = localStorage.getItem(STORAGE_KEY_NEWS);
  if (guardadas) return JSON.parse(guardadas);
  try {
    const res  = await fetch(JSON_PATH);
    const data = await res.json();
    localStorage.setItem(STORAGE_KEY_NEWS, JSON.stringify(data));
    return data;
  } catch (e) {
    console.error('Error cargando noticias:', e);
    return [];
  }
}

function guardarNoticias(noticias) {
  localStorage.setItem(STORAGE_KEY_NEWS, JSON.stringify(noticias));
}

function getFavoritos() {
  return JSON.parse(localStorage.getItem(STORAGE_KEY_FAV) || '[]');
}

function setFavoritos(arr) {
  localStorage.setItem(STORAGE_KEY_FAV, JSON.stringify(arr));
  actualizarContadorFav();
}

function esFavorito(id) {
  return getFavoritos().includes(id);
}

function toggleFavorito(id) {
  const favs = getFavoritos();
  const idx  = favs.indexOf(id);
  if (idx === -1) {
    favs.push(id);
    mostrarToast('❤️ Noticia agregada a favoritos', 'success');
  } else {
    favs.splice(idx, 1);
    mostrarToast('💔 Noticia eliminada de favoritos');
  }
  setFavoritos(favs);
  return idx === -1;
}

function actualizarContadorFav() {
  const count = getFavoritos().length;
  document.querySelectorAll('.fav-count').forEach(el => {
    el.textContent = count;
    el.style.display = count > 0 ? 'flex' : 'none';
  });
}

function formatearFecha(fechaStr) {
  const opts = { year: 'numeric', month: 'long', day: 'numeric' };
  return new Date(fechaStr + 'T00:00:00').toLocaleDateString('es-CO', opts);
}

function obtenerIniciales(nombre) {
  return nombre.split(' ').slice(0, 2).map(p => p[0]).join('').toUpperCase();
}

function clasePorCategoria(cat) {
  const map = {
    'Tecnología': 'cat-tecnologia',
    'Turismo'   : 'cat-turismo',
    'Educación' : 'cat-educacion',
    'Comercio'  : 'cat-comercio'
  };
  return map[cat] || 'cat-tecnologia';
}

function mostrarToast(mensaje, tipo = 'info') {
  let container = document.querySelector('.toast-container');
  if (!container) {
    container = document.createElement('div');
    container.className = 'toast-container';
    document.body.appendChild(container);
  }
  const toast = document.createElement('div');
  toast.className = `toast ${tipo}`;
  toast.innerHTML = `<span>${mensaje}</span>`;
  container.appendChild(toast);
  setTimeout(() => {
    toast.classList.add('removing');
    setTimeout(() => toast.remove(), 300);
  }, 3200);
}

function initMenuMovil() {
  const toggle = document.querySelector('.menu-toggle');
  const links  = document.querySelector('.nav-links');
  if (!toggle || !links) return;
  toggle.addEventListener('click', () => {
    links.classList.toggle('open');
    toggle.innerHTML = links.classList.contains('open')
      ? '<i class="fas fa-times"></i>'
      : '<i class="fas fa-bars"></i>';
  });
  links.querySelectorAll('a').forEach(a => {
    a.addEventListener('click', () => {
      links.classList.remove('open');
      toggle.innerHTML = '<i class="fas fa-bars"></i>';
    });
  });
}

function initBackToTop() {
  const btn = document.querySelector('.back-to-top');
  if (!btn) return;
  window.addEventListener('scroll', () => {
    btn.classList.toggle('visible', window.scrollY > 400);
  });
  btn.addEventListener('click', () => window.scrollTo({ top: 0, behavior: 'smooth' }));
}

function marcarNavActivo() {
  const page = window.location.pathname.split('/').pop() || 'index.html';
  document.querySelectorAll('.nav-links a').forEach(a => {
    const href = a.getAttribute('href');
    if (href === page || (page === '' && href === 'index.html')) {
      a.classList.add('active');
    }
  });
}

function crearCard(noticia) {
  const fav      = esFavorito(noticia.id);
  const catClass = clasePorCategoria(noticia.categoria);
  return `
    <article class="news-card" data-id="${noticia.id}">
      <div class="card-img-wrap">
        <img src="${noticia.imagen}" alt="${noticia.titulo}" loading="lazy"
             onerror="this.src='https://via.placeholder.com/400x210/c0392b/ffffff?text=El+Caleño'">
        <span class="card-categoria ${catClass}">${noticia.categoria}</span>
        <button class="card-fav-btn ${fav ? 'activo' : ''}"
                onclick="handleFavCard(event, ${noticia.id})"
                title="${fav ? 'Quitar de favoritos' : 'Agregar a favoritos'}"
                aria-label="Favorito">
          <i class="fa${fav ? 's' : 'r'} fa-heart"></i>
        </button>
      </div>
      <div class="card-body">
        <div class="card-meta">
          <span><i class="fas fa-calendar-alt"></i> ${formatearFecha(noticia.fecha)}</span>
          <span><i class="fas fa-tag"></i> ${noticia.categoria}</span>
        </div>
        <h3 class="card-title">${noticia.titulo}</h3>
        <p class="card-desc">${noticia.descripcion}</p>
        <div class="card-footer">
          <div class="card-autor">
            <div class="avatar-mini">${obtenerIniciales(noticia.autor)}</div>
            <span>${noticia.autor}</span>
          </div>
          <a href="detalle.html?id=${noticia.id}" class="btn btn-primary btn-sm">
            Ver más <i class="fas fa-arrow-right"></i>
          </a>
        </div>
      </div>
    </article>`;
}

function handleFavCard(e, id) {
  e.preventDefault();
  e.stopPropagation();
  const activo = toggleFavorito(id);
  const btn = e.currentTarget;
  btn.classList.toggle('activo', activo);
  btn.querySelector('i').className = `fa${activo ? 's' : 'r'} fa-heart`;
  document.querySelectorAll(`.card-fav-btn[onclick*="${id}"]`).forEach(b => {
    b.classList.toggle('activo', activo);
    b.querySelector('i').className = `fa${activo ? 's' : 'r'} fa-heart`;
  });
}

window.handleFavCard = handleFavCard;

async function initHome() {
  if (!document.getElementById('noticias-destacadas')) return;

  const noticias = await cargarNoticias();

  const tickerTrack = document.getElementById('ticker-track');
  if (tickerTrack) {
    const items = [...noticias, ...noticias];
    tickerTrack.innerHTML = items
      .map(n => `<span class="ticker-item" onclick="location.href='detalle.html?id=${n.id}'">${n.titulo}</span>`)
      .join('');
  }

  const destacadas = noticias.filter(n => n.destacada);
  const featured   = document.getElementById('featured-main');
  if (featured && destacadas.length) {
    const principal = destacadas[0];
    const catClass  = clasePorCategoria(principal.categoria);
    featured.innerHTML = `
      <div class="featured-card-big" onclick="location.href='detalle.html?id=${principal.id}'" role="button" tabindex="0">
        <img src="${principal.imagen}" alt="${principal.titulo}">
        <div class="featured-overlay">
          <span class="card-categoria ${catClass}">${principal.categoria}</span>
          <h2>${principal.titulo}</h2>
          <p>${principal.descripcion}</p>
          <a href="detalle.html?id=${principal.id}" class="btn btn-primary btn-sm">
            Leer noticia <i class="fas fa-arrow-right"></i>
          </a>
        </div>
      </div>
      <div class="featured-side">
        ${destacadas.slice(1, 3).map(n => {
          const cc = clasePorCategoria(n.categoria);
          return `
          <div class="featured-side-card" onclick="location.href='detalle.html?id=${n.id}'" role="button" tabindex="0">
            <img src="${n.imagen}" alt="${n.titulo}">
            <div class="featured-overlay">
              <span class="card-categoria ${cc}">${n.categoria}</span>
              <h2>${n.titulo}</h2>
            </div>
          </div>`;
        }).join('')}
      </div>`;
  }

  const container = document.getElementById('noticias-destacadas');
  container.innerHTML = noticias.slice(0, 6).map(crearCard).join('');
}

async function initNoticias() {
  const container = document.getElementById('noticias-container');
  if (!container) return;

  const noticias = await cargarNoticias();
  let filtradas  = [...noticias];

  const searchInput  = document.getElementById('search-input');
  const catFilter    = document.getElementById('cat-filter');
  const orderFilter  = document.getElementById('order-filter');
  const resultsCount = document.getElementById('results-count');
  const catPills     = document.querySelectorAll('.cat-pill');

  function render() {
    if (!filtradas.length) {
      container.innerHTML = `
        <div class="no-results">
          <i class="fas fa-search"></i>
          <h3>No encontramos noticias</h3>
          <p>Intenta con otros términos o categorías.</p>
        </div>`;
    } else {
      container.innerHTML = filtradas.map(crearCard).join('');
    }
    if (resultsCount) {
      resultsCount.textContent = `${filtradas.length} noticia${filtradas.length !== 1 ? 's' : ''} encontrada${filtradas.length !== 1 ? 's' : ''}`;
    }
  }

  function aplicarFiltros() {
    const termino = searchInput ? searchInput.value.toLowerCase().trim() : '';
    const cat     = catFilter ? catFilter.value : '';
    const orden   = orderFilter ? orderFilter.value : 'reciente';

    filtradas = noticias.filter(n => {
      const matchCat  = !cat || n.categoria === cat;
      const matchText = !termino ||
        n.titulo.toLowerCase().includes(termino) ||
        n.descripcion.toLowerCase().includes(termino) ||
        n.autor.toLowerCase().includes(termino);
      return matchCat && matchText;
    });

    if (orden === 'reciente') filtradas.sort((a, b) => new Date(b.fecha) - new Date(a.fecha));
    else if (orden === 'antiguo') filtradas.sort((a, b) => new Date(a.fecha) - new Date(b.fecha));
    else if (orden === 'az') filtradas.sort((a, b) => a.titulo.localeCompare(b.titulo));

    render();
  }

  if (searchInput) searchInput.addEventListener('input', aplicarFiltros);
  if (catFilter) {
    catFilter.addEventListener('change', e => {
      catPills.forEach(p => p.classList.toggle('active', p.dataset.cat === e.target.value));
      aplicarFiltros();
    });
  }
  if (orderFilter) orderFilter.addEventListener('change', aplicarFiltros);

  catPills.forEach(pill => {
    pill.addEventListener('click', () => {
      const cat = pill.dataset.cat || '';
      catPills.forEach(p => p.classList.remove('active'));
      pill.classList.add('active');
      if (catFilter) catFilter.value = cat;
      aplicarFiltros();
    });
  });

  aplicarFiltros();
}

async function initDetalle() {
  const detalleMain = document.getElementById('detalle-main');
  if (!detalleMain) return;

  const params   = new URLSearchParams(window.location.search);
  const id       = parseInt(params.get('id'));
  const noticias = await cargarNoticias();
  const noticia  = noticias.find(n => n.id === id);

  if (!noticia) {
    detalleMain.innerHTML = `
      <div class="no-results" style="padding:80px 0">
        <i class="fas fa-newspaper"></i>
        <h3>Noticia no encontrada</h3>
        <p><a href="noticias.html" class="btn btn-primary">Ver todas las noticias</a></p>
      </div>`;
    return;
  }

  document.title = `${noticia.titulo} | El Caleño`;

  const fav      = esFavorito(noticia.id);
  const catClass = clasePorCategoria(noticia.categoria);
  const bc = document.getElementById('bc-titulo');
  if (bc) bc.textContent = noticia.titulo;

  detalleMain.innerHTML = `
    <span class="card-categoria ${catClass}" style="position:static;display:inline-block;margin-bottom:16px">${noticia.categoria}</span>
    <div class="detalle-meta">
      <span><i class="fas fa-calendar-alt"></i> ${formatearFecha(noticia.fecha)}</span>
      <span><i class="fas fa-user-edit"></i> ${noticia.autor}</span>
    </div>
    <h1 class="detalle-titulo">${noticia.titulo}</h1>
    <p class="detalle-descripcion">${noticia.descripcion}</p>
    <img src="${noticia.imagenDetalle || noticia.imagen}" alt="${noticia.titulo}" class="detalle-imagen"
         onerror="this.src='https://via.placeholder.com/1200x420/c0392b/ffffff?text=El+Caleño'">
    <div class="detalle-contenido">${noticia.contenido}</div>
    <div class="detalle-tags">
      ${noticia.tags.map(t => `<span class="tag-item">#${t}</span>`).join('')}
    </div>
    <div class="detalle-acciones">
      <button class="btn ${fav ? 'btn-danger' : 'btn-ghost'}" id="btn-fav-detalle"
              onclick="handleFavDetalle(${noticia.id})">
        <i class="fa${fav ? 's' : 'r'} fa-heart"></i>
        ${fav ? 'En favoritos' : 'Agregar a favoritos'}
      </button>
      <a href="noticias.html" class="btn btn-outline" style="color:var(--gris-oscuro);border-color:var(--gris-claro)">
        <i class="fas fa-arrow-left"></i> Volver
      </a>
      <button class="btn btn-outline" style="color:var(--gris-oscuro);border-color:var(--gris-claro)"
              onclick="compartirNoticia('${noticia.titulo}')">
        <i class="fas fa-share-alt"></i> Compartir
      </button>
    </div>`;

  const sidebar = document.getElementById('sidebar-otras');
  if (sidebar) {
    sidebar.innerHTML = noticias.filter(n => n.id !== id).slice(0, 5).map(n => `
      <div class="sidebar-mini-card" onclick="location.href='detalle.html?id=${n.id}'" role="button" tabindex="0">
        <img src="${n.imagen}" alt="${n.titulo}" class="sidebar-mini-img"
             onerror="this.src='https://via.placeholder.com/70x55/c0392b/fff?text=EC'">
        <div>
          <div class="sidebar-mini-title">${n.titulo}</div>
          <div class="sidebar-mini-fecha">${formatearFecha(n.fecha)}</div>
        </div>
      </div>`).join('');
  }
}

function handleFavDetalle(id) {
  const activo = toggleFavorito(id);
  const btn    = document.getElementById('btn-fav-detalle');
  if (!btn) return;
  btn.className = `btn ${activo ? 'btn-danger' : 'btn-ghost'}`;
  btn.innerHTML = `<i class="fa${activo ? 's' : 'r'} fa-heart"></i> ${activo ? 'En favoritos' : 'Agregar a favoritos'}`;
}

function compartirNoticia(titulo) {
  if (navigator.share) {
    navigator.share({ title: titulo, url: window.location.href });
  } else {
    navigator.clipboard.writeText(window.location.href).then(() => {
      mostrarToast('🔗 Enlace copiado al portapapeles', 'success');
    });
  }
}

window.handleFavDetalle = handleFavDetalle;
window.compartirNoticia = compartirNoticia;

async function initFavoritos() {
  const container = document.getElementById('favoritos-container');
  if (!container) return;

  const noticias = await cargarNoticias();
  const conteo   = document.getElementById('fav-conteo');

  function renderFavoritos() {
    const favIds  = getFavoritos();
    const favNots = noticias.filter(n => favIds.includes(n.id));
    if (conteo) conteo.textContent = favNots.length;

    if (!favNots.length) {
      container.innerHTML = `
        <div class="favoritos-empty">
          <i class="fas fa-heart-broken"></i>
          <h3>Aún no tienes favoritos</h3>
          <p>Explora las noticias y guarda las que más te interesen.</p>
          <a href="noticias.html" class="btn btn-primary" style="margin-top:20px">
            <i class="fas fa-newspaper"></i> Explorar noticias
          </a>
        </div>`;
    } else {
      container.innerHTML = `<div class="cards-grid">${favNots.map(crearCard).join('')}</div>`;
    }
  }

  const btnLimpiar = document.getElementById('btn-limpiar-favs');
  if (btnLimpiar) {
    btnLimpiar.addEventListener('click', () => {
      if (confirm('¿Eliminar todos los favoritos?')) {
        setFavoritos([]);
        renderFavoritos();
        mostrarToast('💔 Favoritos eliminados');
      }
    });
  }

  window.addEventListener('storage', renderFavoritos);
  renderFavoritos();
}

function initContacto() {
  const form = document.getElementById('form-contacto');
  if (!form) return;

  const campos = {
    nombre  : { el: form.querySelector('#nombre'),   regex: /^.{3,}$/,                   msg: 'El nombre debe tener al menos 3 caracteres.' },
    email   : { el: form.querySelector('#email'),    regex: /^[^\s@]+@[^\s@]+\.[^\s@]+$/, msg: 'Ingresa un correo electrónico válido.' },
    asunto  : { el: form.querySelector('#asunto'),   regex: /^.{5,}$/,                   msg: 'El asunto debe tener al menos 5 caracteres.' },
    telefono: { el: form.querySelector('#telefono'), regex: /^(\+?[0-9\s\-]{7,15})?$/,   msg: 'Ingresa un número de teléfono válido.', opcional: true },
    mensaje : { el: form.querySelector('#mensaje'),  regex: /^[\s\S]{20,}$/,              msg: 'El mensaje debe tener al menos 20 caracteres.' }
  };

  function validarCampo(key) {
    const { el, regex, msg, opcional } = campos[key];
    if (!el) return true;
    const val     = el.value.trim();
    const errorEl = document.getElementById(`error-${key}`);
    if (opcional && !val) {
      el.classList.remove('error', 'success');
      if (errorEl) errorEl.classList.remove('visible');
      return true;
    }
    const ok = regex.test(val);
    el.classList.toggle('error', !ok);
    el.classList.toggle('success', ok);
    if (errorEl) {
      errorEl.textContent = msg;
      errorEl.classList.toggle('visible', !ok);
    }
    return ok;
  }

  Object.keys(campos).forEach(key => {
    const el = campos[key].el;
    if (el) {
      el.addEventListener('blur', () => validarCampo(key));
      el.addEventListener('input', () => {
        if (el.classList.contains('error')) validarCampo(key);
      });
    }
  });

  form.addEventListener('submit', e => {
    e.preventDefault();
    const todosOk = Object.keys(campos).map(validarCampo).every(Boolean);
    if (!todosOk) {
      mostrarToast('⚠️ Completa los campos requeridos', 'warning');
      return;
    }
    const btnSubmit = form.querySelector('[type="submit"]');
    btnSubmit.disabled = true;
    btnSubmit.innerHTML = '<i class="fas fa-spinner fa-spin"></i> Enviando...';
    setTimeout(() => {
      const success = document.getElementById('form-success');
      if (success) success.classList.add('visible');
      form.reset();
      Object.keys(campos).forEach(k => {
        const el = campos[k].el;
        if (el) el.classList.remove('success', 'error');
      });
      btnSubmit.disabled = false;
      btnSubmit.innerHTML = '<i class="fas fa-paper-plane"></i> Enviar mensaje';
      mostrarToast('✅ Mensaje enviado correctamente', 'success');
      setTimeout(() => {
        if (success) success.classList.remove('visible');
      }, 8000);
    }, 1500);
  });
}

async function initCrud() {
  const form = document.getElementById('form-crud');
  if (!form) return;

  let noticias = await cargarNoticias();

  function renderLista() {
    const lista  = document.getElementById('crud-lista');
    const conteo = document.getElementById('crud-count');
    if (conteo) conteo.textContent = noticias.length;
    if (!lista) return;

    if (!noticias.length) {
      lista.innerHTML = '<p style="color:var(--gris-medio);text-align:center;padding:30px">No hay noticias.</p>';
      return;
    }

    lista.innerHTML = noticias.map(n => `
      <div class="crud-item" data-id="${n.id}">
        <img src="${n.imagen}" alt="${n.titulo}" class="crud-item-img"
             onerror="this.src='https://via.placeholder.com/64x52/c0392b/fff?text=EC'">
        <div class="crud-item-info">
          <div class="crud-item-title">${n.titulo}</div>
          <div class="crud-item-cat">
            <span class="card-categoria ${clasePorCategoria(n.categoria)}" style="position:static;display:inline-block;font-size:0.65rem">
              ${n.categoria}
            </span>
            &nbsp;· ${formatearFecha(n.fecha)}
          </div>
        </div>
        <div class="crud-item-actions">
          <a href="detalle.html?id=${n.id}" class="btn btn-ghost btn-sm" title="Ver detalle">
            <i class="fas fa-eye"></i>
          </a>
          <button class="btn-delete" onclick="eliminarNoticia(${n.id})">
            <i class="fas fa-trash"></i> Eliminar
          </button>
        </div>
      </div>`).join('');
  }

  window.eliminarNoticia = function(id) {
    const noticia = noticias.find(n => n.id === id);
    if (!noticia) return;
    if (!confirm(`¿Eliminar la noticia "${noticia.titulo}"?`)) return;
    noticias = noticias.filter(n => n.id !== id);
    guardarNoticias(noticias);
    renderLista();
    mostrarToast('🗑️ Noticia eliminada correctamente');
  };

  form.addEventListener('submit', e => {
    e.preventDefault();
    const titulo      = form.querySelector('#crud-titulo').value.trim();
    const categoria   = form.querySelector('#crud-categoria').value;
    const descripcion = form.querySelector('#crud-descripcion').value.trim();
    const contenido   = form.querySelector('#crud-contenido').value.trim();
    const imagen      = form.querySelector('#crud-imagen').value.trim();
    const autor       = form.querySelector('#crud-autor').value.trim();

    if (!titulo || !categoria || !descripcion || !contenido || !autor) {
      mostrarToast('⚠️ Completa todos los campos obligatorios', 'warning');
      return;
    }

    const nueva = {
      id           : Date.now(),
      titulo,
      categoria,
      descripcion,
      contenido,
      imagen       : imagen || 'https://images.unsplash.com/photo-1504711434969-e33886168f5c?w=800&q=80',
      imagenDetalle: imagen || 'https://images.unsplash.com/photo-1504711434969-e33886168f5c?w=1200&q=80',
      autor,
      fecha        : new Date().toISOString().split('T')[0],
      destacada    : false,
      tags         : [categoria.toLowerCase()]
    };

    noticias.unshift(nueva);
    guardarNoticias(noticias);
    renderLista();
    form.reset();
    mostrarToast('✅ Noticia creada correctamente', 'success');
    document.getElementById('crud-lista').scrollIntoView({ behavior: 'smooth', block: 'start' });
  });

  renderLista();

  const btnReset = document.getElementById('btn-reset-data');
  if (btnReset) {
    btnReset.addEventListener('click', async () => {
      if (!confirm('¿Restablecer las noticias originales? Se perderán los cambios.')) return;
      localStorage.removeItem(STORAGE_KEY_NEWS);
      noticias = await cargarNoticias();
      renderLista();
      mostrarToast('♻️ Datos restablecidos', 'success');
    });
  }
}

document.addEventListener('DOMContentLoaded', async () => {
  marcarNavActivo();
  initMenuMovil();
  initBackToTop();
  actualizarContadorFav();

  await initHome();
  await initNoticias();
  await initDetalle();
  await initFavoritos();
  initContacto();
  await initCrud();
});

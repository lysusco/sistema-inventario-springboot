const API = '/api/productos';

const state = {
  productos: [],
  stockBajo: [],
};

const $ = (sel) => document.querySelector(sel);
const $$ = (sel) => document.querySelectorAll(sel);

function formatMoney(v) {
  const n = Number(v) || 0;
  return '$' + n.toLocaleString('es-CO', { minimumFractionDigits: 0, maximumFractionDigits: 2 });
}

async function api(path, options = {}) {
  const res = await fetch(API + path, {
    headers: { 'Content-Type': 'application/json' },
    ...options,
  });
  if (!res.ok) {
    let msg = 'Error en la operación';
    try { const data = await res.json(); if (data && data.message) msg = data.message; } catch (_) {}
    throw new Error(msg);
  }
  if (res.status === 204) return null;
  return res.json();
}

function toast(message, type = 'ok') {
  const el = $('#toast');
  el.textContent = message;
  el.className = 'toast ' + type;
  el.hidden = false;
  clearTimeout(toast._t);
  toast._t = setTimeout(() => { el.hidden = true; }, 2800);
}

function renderMetrics() {
  $('#mTotal').textContent = state.productos.length;
  $('#mBajo').textContent = state.stockBajo.length;
  const valor = state.productos.reduce((acc, p) => acc + (Number(p.stock) || 0) * (Number(p.precio) || 0), 0);
  $('#mValor').textContent = formatMoney(valor);
}

function estadoBadge(p) {
  if (p.stockBajo) return '<span class="badge badge-bajo">Bajo</span>';
  return '<span class="badge badge-ok">OK</span>';
}

function renderTabla() {
  const q = ($('#search').value || '').trim().toLowerCase();
  const filtrados = state.productos.filter(p =>
    !q || (p.nombre || '').toLowerCase().includes(q) ||
    (p.descripcion || '').toLowerCase().includes(q)
  );

  const tbody = $('#tablaBody');
  tbody.innerHTML = '';
  filtrados.forEach(p => {
    const tr = document.createElement('tr');
    tr.innerHTML = `
      <td><strong>${escapeHtml(p.nombre || '')}</strong><br><span class="muted" style="font-size:12px">${escapeHtml(p.descripcion || '')}</span></td>
      <td>${p.stock ?? 0}</td>
      <td>${p.stockMinimo ?? 0}</td>
      <td>${formatMoney(p.precio)}</td>
      <td>${estadoBadge(p)}</td>
      <td class="actions">
        <button class="btn btn-ghost btn-sm" data-edit="${p.id}">Editar</button>
        <button class="btn btn-danger btn-sm" data-del="${p.id}">Eliminar</button>
      </td>
    `;
    tbody.appendChild(tr);
  });

  $('#emptyState').hidden = filtrados.length > 0 || state.productos.length === 0 ? (state.productos.length > 0) : false;
  if (state.productos.length === 0) $('#emptyState').hidden = false;
  else $('#emptyState').hidden = filtrados.length > 0;
}

function renderStockBajo() {
  const ul = $('#listaStockBajo');
  ul.innerHTML = '';
  if (!state.stockBajo.length) {
    $('#emptyStock').hidden = false;
    return;
  }
  $('#emptyStock').hidden = true;
  state.stockBajo.forEach(p => {
    const li = document.createElement('li');
    li.innerHTML = `
      <span class="name">${escapeHtml(p.nombre || '')}</span>
      <span class="qty">${p.stock ?? 0} / ${p.stockMinimo ?? 0}</span>
    `;
    ul.appendChild(li);
  });
}

function escapeHtml(s) {
  return String(s).replace(/[&<>"']/g, c => ({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[c]));
}

async function cargar() {
  try {
    const [prods, bajos] = await Promise.all([
      api(''),
      api('/stock-bajo'),
    ]);
    state.productos = Array.isArray(prods) ? prods : [];
    state.stockBajo = Array.isArray(bajos) ? bajos : [];
    renderMetrics();
    renderTabla();
    renderStockBajo();
    $('#lastUpdate').textContent = 'Actualizado: ' + new Date().toLocaleTimeString('es-CO');
  } catch (e) {
    toast(e.message || 'No se pudo cargar', 'error');
  }
}

function abrirModal(producto = null) {
  const modal = $('#modal');
  $('#modalTitle').textContent = producto ? 'Editar producto' : 'Nuevo producto';
  $('#fId').value = producto ? producto.id : '';
  $('#fNombre').value = producto ? producto.nombre || '' : '';
  $('#fDescripcion').value = producto ? producto.descripcion || '' : '';
  $('#fStock').value = producto ? (producto.stock ?? 0) : 0;
  $('#fStockMinimo').value = producto ? (producto.stockMinimo ?? 0) : 0;
  $('#fPrecio').value = producto ? (producto.precio ?? 0) : 0;
  modal.hidden = false;
  $('#fNombre').focus();
}

function cerrarModal() {
  $('#modal').hidden = true;
}

async function guardarProducto(e) {
  e.preventDefault();
  const id = $('#fId').value;
  const payload = {
    nombre: $('#fNombre').value.trim(),
    descripcion: $('#fDescripcion').value.trim(),
    stock: Number($('#fStock').value) || 0,
    stockMinimo: Number($('#fStockMinimo').value) || 0,
    precio: Number($('#fPrecio').value) || 0,
  };

  try {
    if (id) {
      await api('/' + id, { method: 'PUT', body: JSON.stringify(payload) });
      toast('Producto actualizado');
    } else {
      await api('', { method: 'POST', body: JSON.stringify(payload) });
      toast('Producto creado');
    }
    cerrarModal();
    await cargar();
  } catch (e) {
    toast(e.message || 'No se pudo guardar', 'error');
  }
}

async function eliminarProducto(id) {
  if (!confirm('¿Eliminar este producto?')) return;
  try {
    await api('/' + id, { method: 'DELETE' });
    toast('Producto eliminado');
    await cargar();
  } catch (e) {
    toast(e.message || 'No se pudo eliminar', 'error');
  }
}

// Eventos
$('#btnNuevo').addEventListener('click', () => abrirModal());
$('#btnRefrescar').addEventListener('click', cargar);
$('#formProducto').addEventListener('submit', guardarProducto);
$('#search').addEventListener('input', renderTabla);

$$('[data-close]').forEach(el => el.addEventListener('click', cerrarModal));

$('#tablaBody').addEventListener('click', (e) => {
  const editBtn = e.target.closest('[data-edit]');
  const delBtn = e.target.closest('[data-del]');
  if (editBtn) {
    const id = Number(editBtn.dataset.edit);
    const p = state.productos.find(x => x.id === id);
    if (p) abrirModal(p);
  }
  if (delBtn) {
    eliminarProducto(Number(delBtn.dataset.del));
  }
});

document.addEventListener('keydown', (e) => {
  if (e.key === 'Escape' && !$('#modal').hidden) cerrarModal();
});

// Carga inicial
cargar();
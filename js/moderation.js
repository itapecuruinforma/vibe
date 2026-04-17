// ============================================
// MODERAÇÃO — Denúncias e Bloqueios
// ============================================

import { db } from './config.js';
import {
  ref, push, set, get, remove, onValue, update
} from 'https://www.gstatic.com/firebasejs/9.22.0/firebase-database.js';

// Cache em memória de usuários bloqueados pra filtragem rápida
let blockedCache = null;
let blockedListeners = [];

// ── BLOQUEIOS ──

/**
 * Retorna objeto { uid: true } com todos os usuários bloqueados pelo currentUser
 */
export async function getBlockedUsers(currentUid) {
  if (blockedCache !== null) return blockedCache;
  const snap = await get(ref(db, `bloqueios/${currentUid}`));
  blockedCache = snap.val() || {};
  return blockedCache;
}

/**
 * Escuta mudanças em bloqueios e dispara callbacks
 */
export function watchBlockedUsers(currentUid, callback) {
  onValue(ref(db, `bloqueios/${currentUid}`), (snap) => {
    blockedCache = snap.val() || {};
    blockedListeners.forEach(cb => { try { cb(blockedCache); } catch (e) {} });
    if (callback) callback(blockedCache);
  });
}

/**
 * Verifica se um uid está bloqueado (sync, usa cache)
 */
export function isBlocked(uid) {
  return !!(blockedCache && blockedCache[uid]);
}

/**
 * Bloqueia um usuário
 */
export async function blockUser(currentUid, targetUid) {
  if (currentUid === targetUid) throw new Error('Não pode bloquear a si mesmo');
  await set(ref(db, `bloqueios/${currentUid}/${targetUid}`), true);
  // Remove follow mútuo
  await remove(ref(db, `usuarios/${currentUid}/seguindo/${targetUid}`)).catch(() => {});
  await remove(ref(db, `usuarios/${targetUid}/seguidores/${currentUid}`)).catch(() => {});
  await remove(ref(db, `usuarios/${targetUid}/seguindo/${currentUid}`)).catch(() => {});
  await remove(ref(db, `usuarios/${currentUid}/seguidores/${targetUid}`)).catch(() => {});
}

/**
 * Desbloqueia um usuário
 */
export async function unblockUser(currentUid, targetUid) {
  await remove(ref(db, `bloqueios/${currentUid}/${targetUid}`));
}

// ── DENÚNCIAS ──

export const MOTIVOS_DENUNCIA = [
  { id: 'spam',        label: '🚫 Spam ou conteúdo repetitivo' },
  { id: 'assedio',     label: '😡 Assédio ou bullying' },
  { id: 'impróprio',   label: '🔞 Conteúdo impróprio / nudez' },
  { id: 'violencia',   label: '⚠️ Violência ou ameaça' },
  { id: 'odio',        label: '🗯️ Discurso de ódio' },
  { id: 'fake',        label: '❓ Informação falsa' },
  { id: 'golpe',       label: '💰 Golpe ou fraude' },
  { id: 'outro',       label: '📝 Outro motivo' }
];

/**
 * Cria uma denúncia
 * @param {string} currentUid - quem denuncia
 * @param {'post'|'comentario'|'usuario'|'mensagem'} tipo
 * @param {string} alvoId - id do post/comentário/usuário denunciado
 * @param {string} motivoId - id do motivo (ver MOTIVOS_DENUNCIA)
 * @param {string} [descricao] - texto adicional opcional
 * @param {object} [extra] - dados extras (postUid, etc)
 */
export async function denunciar(currentUid, tipo, alvoId, motivoId, descricao = '', extra = {}) {
  const motivo = MOTIVOS_DENUNCIA.find(m => m.id === motivoId);
  if (!motivo) throw new Error('Motivo inválido');

  const denuncia = {
    de: currentUid,
    tipo,
    alvoId,
    motivo: (motivo.label + (descricao ? ' — ' + descricao : '')).slice(0, 500),
    timestamp: Date.now(),
    status: 'pendente',
    ...extra
  };

  await push(ref(db, 'denuncias'), denuncia);
}

// ── MODAL DE DENÚNCIA (UI helper reutilizável) ──

/**
 * Abre um modal de denúncia. Retorna Promise<motivoId | null>
 * @param {string} tituloAlvo - ex: "@fulano", "esse post"
 */
export function abrirModalDenuncia(tituloAlvo = 'este conteúdo') {
  return new Promise((resolve) => {
    // Remove modal anterior se existir
    const prev = document.getElementById('modDenunciaBackdrop');
    if (prev) prev.remove();

    const backdrop = document.createElement('div');
    backdrop.id = 'modDenunciaBackdrop';
    backdrop.className = 'modal-backdrop';
    backdrop.innerHTML = `
      <div class="modal-box" style="max-width:400px">
        <div style="display:flex;justify-content:space-between;align-items:center;margin-bottom:14px">
          <h3 style="font-family:'Syne',sans-serif;font-size:18px">Denunciar</h3>
          <button class="btn-ghost" id="modDenunciaClose" style="font-size:22px;padding:4px 8px">×</button>
        </div>
        <p style="color:var(--text2);font-size:13px;margin-bottom:14px">Por que você está denunciando ${tituloAlvo}?</p>
        <div id="modDenunciaOpts" style="display:flex;flex-direction:column;gap:8px;max-height:300px;overflow-y:auto"></div>
        <textarea id="modDenunciaDesc" class="input" rows="2" placeholder="Detalhes (opcional)" style="margin-top:12px;display:none"></textarea>
        <div style="display:flex;gap:8px;margin-top:14px">
          <button class="btn btn-outline" id="modDenunciaCancel" style="flex:1">Cancelar</button>
          <button class="btn btn-primary" id="modDenunciaSend" style="flex:1" disabled>Enviar</button>
        </div>
      </div>
    `;
    document.body.appendChild(backdrop);

    const opts = backdrop.querySelector('#modDenunciaOpts');
    let selected = null;
    MOTIVOS_DENUNCIA.forEach(m => {
      const b = document.createElement('button');
      b.className = 'btn btn-outline';
      b.style.cssText = 'text-align:left;padding:10px 14px;font-size:13px';
      b.textContent = m.label;
      b.onclick = () => {
        selected = m.id;
        opts.querySelectorAll('button').forEach(x => x.classList.remove('btn-primary'));
        b.classList.add('btn-primary');
        backdrop.querySelector('#modDenunciaSend').disabled = false;
        backdrop.querySelector('#modDenunciaDesc').style.display = m.id === 'outro' ? 'block' : 'none';
      };
      opts.appendChild(b);
    });

    const close = (val) => { backdrop.remove(); resolve(val); };
    backdrop.querySelector('#modDenunciaClose').onclick = () => close(null);
    backdrop.querySelector('#modDenunciaCancel').onclick = () => close(null);
    backdrop.querySelector('#modDenunciaSend').onclick = () => {
      if (!selected) return;
      const desc = backdrop.querySelector('#modDenunciaDesc').value.trim().slice(0, 300);
      close({ motivoId: selected, descricao: desc });
    };
    backdrop.onclick = (e) => { if (e.target === backdrop) close(null); };
  });
}

// ── MENU DROPDOWN (⋯ em posts/comentários) ──

/**
 * Abre um menu contextual perto de um elemento.
 * @param {HTMLElement} anchor - botão que abriu o menu
 * @param {Array<{label, icon, danger, onClick}>} items
 */
export function abrirMenuContexto(anchor, items) {
  // Fecha menu anterior se houver
  document.querySelectorAll('.mod-menu').forEach(m => m.remove());

  const menu = document.createElement('div');
  menu.className = 'mod-menu';
  items.forEach(it => {
    const btn = document.createElement('button');
    btn.className = 'mod-menu-item' + (it.danger ? ' danger' : '');
    btn.innerHTML = `${it.icon || ''}<span>${it.label}</span>`;
    btn.onclick = (e) => {
      e.stopPropagation();
      menu.remove();
      it.onClick();
    };
    menu.appendChild(btn);
  });

  // Posicionamento relativo à âncora
  const rect = anchor.getBoundingClientRect();
  menu.style.position = 'fixed';
  menu.style.top = (rect.bottom + 4) + 'px';
  menu.style.right = (window.innerWidth - rect.right) + 'px';
  menu.style.zIndex = 9999;

  document.body.appendChild(menu);

  // Fecha clicando fora
  const closer = (e) => {
    if (!menu.contains(e.target) && e.target !== anchor) {
      menu.remove();
      document.removeEventListener('click', closer, true);
    }
  };
  setTimeout(() => document.addEventListener('click', closer, true), 10);
}

/**
 * ============================================================================
 * BLOCK BLASTER · DUEL - CLIENT APPLICATION
 * ============================================================================
 */

'use strict';

// ----------------------------------------------------------------------------
// 1. DOM Helper
// ----------------------------------------------------------------------------
const $ = (id) => document.getElementById(id);

// ----------------------------------------------------------------------------
// 2. Localization & Translations
// ----------------------------------------------------------------------------
const translations = {
  en: {
    eyebrow: 'REAL-TIME · Multiplayer',
    hero: 'Small blocks.<br><span>Big rivalry.</span>',
    lead: 'Your board. Your moves. One winner. Fit the pieces, blast full lines, and race your rival to the target.',
    step1: 'Share a room code with a friend to enter the duel.',
    step2: 'Drag and drop a piece onto your board, or tap to select and click to place.',
    step3: 'Clear rows and columns together for bigger combos. First to the target wins.',
    enter: 'Enter the arena',
    name: 'Player name',
    roomCode: 'Room code',
    generate: 'New code',
    codeHelp: 'Create a room with any code, or use your friend’s code. 3–16 letters, numbers, or hyphens.',
    join: 'Create / join room →',
    leave: 'Leave',
    rules: 'Match rules',
    mode: 'Game mode',
    modeTimed: '⏱ Timed duel',
    modeEndless: '♾ Endless mode',
    endlessTarget: 'Endless',
    timeElapsed: 'Time elapsed',
    autoSaved: '✓ Synced with room',
    soloWaiting: 'You can start now or wait for more players to join.',
    target: 'Target score',
    duration: 'Duration (seconds)',
    save: 'Save rules',
    start: 'Start duel →',
    grace: 'Disconnected seats are held for 60 seconds. The match clock keeps running.',
    duel: 'The duel',
    resetField: '↺ Reset Field',
    fieldReset: 'Field has been reset.',
    back: 'Match lobby',
    time: 'Time left',
    status: 'Status',
    scoring: '10 points per block · 100 per line · multi-line and consecutive-clear bonuses',
    footer: 'FIT. BLAST. OUTPLAY.',
    ready: 'Ready',
    offline: 'Offline',
    host: 'Host',
    you: 'You',
    enemy: 'Enemy cooking pieces...',
    select: 'Select a piece, then choose its top-left cell.',
    blocked: 'No moves left — waiting for the result.',
    playing: 'Live',
    finished: 'Finished',
    reconnecting: 'Reconnecting…',
    connected: 'Connected',
    waiting: 'Waiting for a rival to join…',
    hostWait: 'The host sets the rules and starts the duel.',
    readyStart: 'Both players are ready. Let’s duel.',
    win: 'You win!',
    lose: 'Your rival wins',
    tie: 'It’s a draw',
    winsGame: 'wins the game!',
    targetReason: 'Target score reached.',
    timeReason: 'Time is up. Highest score wins.',
    blockedReason: 'No more moves can be made. Highest score wins.',
    disconnectReason: 'Your rival left or their reconnect window expired.',
    saved: 'Rules saved.',
    replaced: 'This session was opened in another tab.',
    network: 'Connection interrupted. Reconnecting automatically…',
    timeout: 'The request timed out. Check your connection and try again.',
    soundOn: '♪ ON',
    soundOff: '♪ OFF',
    soundLabel: 'Toggle sound',
    player: 'Player',
    points: 'points',
    noRoom: 'Your room expired. Join again.',
    errors: {
      NO_ROOM: 'Join a room first.',
      INVALID_INPUT: 'Enter a name and a valid room code.',
      ROOM_FULL: 'This room is full (max 10 players).',
      MATCH_ACTIVE: 'A match is already in progress.',
      SERVER_FULL: 'The server is full. Try again later.',
      HOST_ONLY: 'Only the host can do that.',
      INVALID_RULES: 'Score must be 100–100,000; duration must be 30–3,600 seconds.',
      NEED_TWO: 'All connected players must be ready.',
      NOT_PLAYING: 'The match is not running.',
      INVALID_PLACEMENT: 'That piece does not fit there.',
      RATE_LIMIT: 'Too many requests. Please slow down.'
    }
  },
  th: {
    eyebrow: 'เรียลไทม์ · ผู้เล่นหลายคน',
    hero: 'บล็อกเล็ก ๆ<br><span>ศึกที่ยิ่งใหญ่</span>',
    lead: 'กระดานของคุณ เกมของคุณ ผู้ชนะเพียงหนึ่งเดียว วางบล็อก ระเบิดแถว แล้วทำคะแนนให้ถึงเป้าหมายก่อนคู่แข่ง',
    step1: 'แชร์รหัสห้องให้เพื่อนเพื่อเข้าร่วมการดวล',
    step2: 'ลากชิ้นบล็อกไปวางบนกระดาน หรือแตะเลือกชิ้นแล้วกดช่องเพื่อวาง หมุนชิ้นไม่ได้',
    step3: 'เติมแถวและคอลัมน์พร้อมกันเพื่อรับคอมโบ ใครถึงเป้าหมายก่อนชนะ',
    enter: 'เข้าสู่สนาม',
    name: 'ชื่อผู้เล่น',
    roomCode: 'รหัสห้อง',
    generate: 'สุ่มรหัส',
    codeHelp: 'สร้างห้องด้วยรหัสใหม่ หรือใช้รหัสของเพื่อน อักษรอังกฤษ ตัวเลข หรือขีดกลาง 3–16 ตัว',
    join: 'สร้าง / เข้าร่วมห้อง →',
    leave: 'ออกจากห้อง',
    rules: 'กติกาการแข่งขัน',
    mode: 'โหมดเกม',
    modeTimed: '⏱ แข่งขันจับเวลา',
    modeEndless: '♾ ไร้ขีดจำกัด',
    endlessTarget: 'ไร้ขีดจำกัด',
    timeElapsed: 'เวลาที่เล่น',
    autoSaved: '✓ ซิงค์กับห้องแล้ว',
    soloWaiting: 'คุณสามารถเริ่มเล่นได้เลย หรือรอให้ผู้เล่นอื่นเข้าร่วม',
    target: 'คะแนนเป้าหมาย',
    duration: 'ระยะเวลา (วินาที)',
    save: 'บันทึกกติกา',
    start: 'เริ่มดวล →',
    grace: 'สำรองที่นั่งเมื่อหลุด 60 วินาที เวลาการแข่งขันยังเดินต่อ',
    duel: 'สนามดวล',
    resetField: '↺ รีเซ็ตกระดาน',
    fieldReset: 'รีเซ็ตกระดานเรียบร้อยแล้ว',
    back: 'กลับล็อบบี้',
    time: 'เวลาที่เหลือ',
    status: 'สถานะ',
    scoring: '10 คะแนนต่อบล็อก · 100 ต่อแถว · โบนัสหลายแถวและเคลียร์ต่อเนื่อง',
    footer: 'วาง ระเบิด เอาชนะ',
    ready: 'พร้อม',
    offline: 'ออฟไลน์',
    host: 'เจ้าของห้อง',
    you: 'คุณ',
    enemy: 'คู่แข่งกำลังเตรียมบล็อก...',
    select: 'เลือกชิ้นบล็อก แล้วกดช่องมุมซ้ายบนที่จะวาง',
    blocked: 'วางต่อไม่ได้ — รอผลการแข่งขัน',
    playing: 'กำลังแข่ง',
    finished: 'จบแล้ว',
    reconnecting: 'กำลังเชื่อมต่อ…',
    connected: 'เชื่อมต่อแล้ว',
    waiting: 'กำลังรอคู่แข่งเข้าห้อง…',
    hostWait: 'เจ้าของห้องจะตั้งกติกาและเริ่มการแข่งขัน',
    readyStart: 'ทั้งสองคนพร้อมแล้ว เริ่มดวลกันเลย',
    win: 'คุณชนะ!',
    lose: 'คู่แข่งชนะ',
    tie: 'เสมอกัน',
    winsGame: 'ชนะการแข่งขัน!',
    targetReason: 'ทำคะแนนถึงเป้าหมายแล้ว',
    timeReason: 'หมดเวลา ผู้ที่คะแนนสูงกว่าชนะ',
    blockedReason: 'ทุกกระดานวางบล็อกต่อไม่ได้แล้ว ผู้ที่คะแนนสูงสุดชนะ',
    disconnectReason: 'คู่แข่งออกจากห้อง หรือหมดเวลาเชื่อมต่อใหม่',
    saved: 'บันทึกกติกาแล้ว',
    replaced: 'เปิดเซสชันนี้ในแท็บอื่นแล้ว',
    network: 'การเชื่อมต่อขัดข้อง กำลังเชื่อมต่อใหม่อัตโนมัติ…',
    timeout: 'คำขอหมดเวลา ตรวจสอบการเชื่อมต่อแล้วลองอีกครั้ง',
    soundOn: '♪ เปิด',
    soundOff: '♪ ปิด',
    soundLabel: 'เปิดหรือปิดเสียง',
    player: 'ผู้เล่น',
    points: 'คะแนน',
    noRoom: 'ห้องเดิมหมดอายุแล้ว กรุณาเข้าห้องใหม่',
    errors: {
      NO_ROOM: 'กรุณาเข้าห้องก่อน',
      INVALID_INPUT: 'กรอกชื่อและรหัสห้องให้ถูกต้อง',
      ROOM_FULL: 'ห้องเต็มแล้ว (สูงสุด 10 คน)',
      MATCH_ACTIVE: 'กำลังแข่งขันอยู่',
      SERVER_FULL: 'เซิร์ฟเวอร์เต็ม กรุณาลองใหม่ภายหลัง',
      HOST_ONLY: 'เฉพาะเจ้าของห้องเท่านั้น',
      INVALID_RULES: 'คะแนนต้องเป็น 100–100,000 และเวลา 30–3,600 วินาที',
      NEED_TWO: 'ผู้เล่นทุกคนต้องเชื่อมต่อให้พร้อมก่อนเริ่ม',
      NOT_PLAYING: 'ยังไม่ได้เริ่มแข่งขัน',
      INVALID_PLACEMENT: 'วางชิ้นบล็อกตรงนี้ไม่ได้',
      RATE_LIMIT: 'ส่งคำขอเร็วเกินไป กรุณารอสักครู่'
    }
  }
};

// ----------------------------------------------------------------------------
// 3. Client State & Session Management
// ----------------------------------------------------------------------------
let lang = 'en';
let session = null;

try {
  lang = sessionStorage.getItem('bb-lang') || 'en';
  session = JSON.parse(sessionStorage.getItem('bb-session'));
} catch {}

if (!translations[lang]) lang = 'en';

let state = null;
let seat = null;
let selected = null;
let pending = false;
let showLobby = false;
let muted = false;
let audio = null;
let toastTimer;
let toastKey = null;
let joining = false;
let replaced = false;
let lastTick = null;
let isDraggingPiece = false;
let pendingRoomState = false;
let shouldFocusOwnBoard = false;
let shouldFocusResult = false;

const t = (key) => translations[lang][key] || key;

function saveSession() {
  try {
    sessionStorage.setItem('bb-session', JSON.stringify(session));
  } catch {}
}

function clearSession() {
  session = null;
  try {
    sessionStorage.removeItem('bb-session');
  } catch {}
}

// ----------------------------------------------------------------------------
// 4. Audio Synthesizer (Web Audio API)
// ----------------------------------------------------------------------------
function tone(freq, duration = 0.1, delay = 0, type = 'sine', volume = 0.055) {
  if (muted || !audio || audio.state !== 'running') return;
  const o = audio.createOscillator();
  const g = audio.createGain();
  const now = audio.currentTime + delay;

  o.type = type;
  o.frequency.setValueAtTime(freq, now);
  g.gain.setValueAtTime(0.001, now);
  g.gain.exponentialRampToValueAtTime(volume, now + 0.008);
  g.gain.exponentialRampToValueAtTime(0.001, now + duration);

  o.connect(g);
  g.connect(audio.destination);
  o.start(now);
  o.stop(now + duration + 0.02);
}

function unlock() {
  try {
    if (!audio) audio = new (window.AudioContext || window.webkitAudioContext)();
    if (audio.state === 'suspended') audio.resume().catch(() => {});
  } catch {}
}

document.addEventListener('pointerdown', unlock);
document.addEventListener('keydown', unlock);

// ----------------------------------------------------------------------------
// 5. Toast Notifications
// ----------------------------------------------------------------------------
function toast(key) {
  toastKey = key;
  $('toast').textContent = translations[lang].errors[key] || t(key);
  $('toast').hidden = false;
  clearTimeout(toastTimer);
  toastTimer = setTimeout(() => {
    $('toast').hidden = true;
    toastKey = null;
  }, 4500);
}

// ----------------------------------------------------------------------------
// 6. Socket.IO Networking
// ----------------------------------------------------------------------------
const socket = io({ autoConnect: false, reconnection: true });

function request(event, data, callback) {
  if (!socket.connected) {
    toast('network');
    return callback?.({ error: 'NETWORK' });
  }
  socket.timeout(5000).emit(event, data, (err, result) => {
    if (err) {
      toast('timeout');
      return callback?.({ error: 'TIMEOUT' });
    }
    if (result?.error) toast(result.error);
    callback?.(result || {});
  });
}

function join(data) {
  if (joining) return;
  joining = true;
  $('join').disabled = true;

  request('join_room', data, (result) => {
    joining = false;
    $('join').disabled = false;
    if (result.ok) {
      session = {
        roomId: data.roomId.trim().toUpperCase(),
        playerName: data.playerName,
        playerId: result.playerId
      };
      seat = result.seat;
      saveSession();
    } else if (!['NETWORK', 'TIMEOUT'].includes(result.error)) {
      clearSession();
      state = null;
      render();
    }
  });
}

function leave() {
  request('leave_room', {}, (result) => {
    if (result.ok) {
      clearSession();
      state = null;
      seat = null;
      selected = null;
      showLobby = false;
      render();
    }
  });
}

function place(x, y) {
  if (!selected) {
    toast('select');
    return;
  }
  if (pending) return;
  pending = true;
  const pieceId = selected;
  render();
  request('place_piece', { pieceId, x, y }, () => {
    pending = false;
    render();
  });
}

// Socket Lifecycle Handlers
socket.on('connect', () => {
  replaced = false;
  localize();
  if (session) join(session);
});

socket.on('disconnect', () => {
  pending = false;
  isDraggingPiece = false;
  pendingRoomState = false;
  const avatar = $('drag-avatar');
  if (avatar) avatar.style.display = 'none';
  localize();
  render();
  if (!replaced) toast('network');
});

socket.on('connect_error', () => {
  localize();
});

socket.on('error', (err) => {
  toast(err?.message === 'RATE_LIMIT' ? 'RATE_LIMIT' : 'network');
});

socket.on('session_replaced', () => {
  replaced = true;
  isDraggingPiece = false;
  pendingRoomState = false;
  const avatar = $('drag-avatar');
  if (avatar) avatar.style.display = 'none';
  clearSession();
  state = null;
  seat = null;
  render();
  toast('replaced');
});

socket.on('room_state', (next) => {
  const previous = state;
  state = next;

  if (previous?.status !== next.status) {
    selected = null;
    pending = false;
    if (next.status === 'playing') {
      showLobby = false;
      lastTick = null;
      shouldFocusOwnBoard = true;
    } else if (next.status === 'finished') {
      shouldFocusResult = true;
      if (next.winnerSeat === seat) {
        [523, 659, 784, 1046].forEach((f, i) => tone(f, 0.18, i * 0.08, 'triangle'));
      } else if (next.winnerSeat !== null) {
        [392, 349, 311, 261].forEach((f, i) => tone(f, 0.22, i * 0.1, 'sawtooth'));
      }
    }
  }

  // If match just finished, abort any active drag immediately and display results
  if (next.status === 'finished' && isDraggingPiece) {
    isDraggingPiece = false;
    pendingRoomState = false;
    const avatar = $('drag-avatar');
    if (avatar) avatar.style.display = 'none';
    render();
    return;
  }

  const mine = next.players.find((p) => p.seat === seat);
  if (selected && !mine?.rack.some((p) => p.id === selected)) {
    if (!isDraggingPiece) {
      selected = null;
    }
  }

  if (next.action && next.revision !== previous?.revision) {
    if (next.action.seat === seat) {
      tone(260, 0.09);
      if (next.action.lines) {
        [440, 554, 659, 880].forEach((f, i) => tone(f, 0.18, i * 0.065, 'triangle'));
      }
    }
  }

  // If user is actively dragging a piece, defer render to avoid destroying active DOM elements
  if (isDraggingPiece) {
    pendingRoomState = true;
    updateHud();
    return;
  }

  render();
});

socket.on('timer_tick', ({ remaining, elapsed }) => {
  if (!state) return;
  state.remaining = remaining;
  updateHud();
  if (state.gameMode !== 'endless' && !elapsed && remaining > 0 && remaining <= 10 && remaining !== lastTick) {
    tone(remaining <= 3 ? 880 : 660, 0.07);
    lastTick = remaining;
  }
});

// ----------------------------------------------------------------------------
// 7. UI Localization & Event Handlers
// ----------------------------------------------------------------------------
function localize() {
  document.documentElement.lang = lang;
  document.querySelectorAll('[data-i18n]').forEach((el) => {
    el.textContent = t(el.dataset.i18n);
  });
  $('hero').innerHTML = t('hero');
  $('language').textContent = lang === 'en' ? 'ไทย' : 'EN';
  $('sound').textContent = t(muted ? 'soundOff' : 'soundOn');
  $('sound').setAttribute('aria-label', t('soundLabel'));
  $('connection').textContent = t(socket.connected ? 'connected' : 'reconnecting');
  if (toastKey) {
    $('toast').textContent = translations[lang].errors[toastKey] || t(toastKey);
  }
}

$('language').onclick = () => {
  lang = lang === 'en' ? 'th' : 'en';
  try {
    sessionStorage.setItem('bb-lang', lang);
  } catch {}
  localize();
  render();
};

$('sound').onclick = () => {
  muted = !muted;
  unlock();
  localize();
};

$('generate').onclick = () => {
  const bytes = new Uint8Array(4);
  crypto.getRandomValues(bytes);
  $('code').value = Array.from(bytes, (n) => n.toString(16).padStart(2, '0')).join('').toUpperCase();
};

$('join-form').onsubmit = (e) => {
  e.preventDefault();
  join({
    roomId: $('code').value,
    playerName: $('name').value,
    playerId: session?.playerId
  });
};

$('leave').onclick = leave;
$('arena-leave').onclick = leave;

let autoSaveTimer = null;
function sendConfig() {
  const isEndless = $('mode-endless').classList.contains('active');
  const targetScore = Number($('target').value);
  const matchDuration = Number($('duration').value);

  request('configure', {
    gameMode: isEndless ? 'endless' : 'timed',
    targetScore,
    matchDuration
  }, (r) => {
    if (r.ok && $('config-status')) {
      $('config-status').textContent = t('autoSaved');
    }
  });
}

$('mode-timed').onclick = () => {
  $('mode-timed').classList.add('active');
  $('mode-endless').classList.remove('active');
  $('timed-config').style.display = 'flex';
  sendConfig();
};

$('mode-endless').onclick = () => {
  $('mode-endless').classList.add('active');
  $('mode-timed').classList.remove('active');
  $('timed-config').style.display = 'none';
  sendConfig();
};

$('target').oninput = () => {
  clearTimeout(autoSaveTimer);
  autoSaveTimer = setTimeout(sendConfig, 350);
};

$('duration').oninput = () => {
  clearTimeout(autoSaveTimer);
  autoSaveTimer = setTimeout(sendConfig, 350);
};

$('start').onclick = () => {
  request('start_match', {});
};

$('back').onclick = () => {
  showLobby = true;
  render();
};

$('reset-field').onclick = () => {
  if (!state || state.status !== 'playing') return;
  request('reset_field', {}, (result) => {
    if (result.ok) {
      selected = null;
      tone(220, 0.12, 0, 'triangle');
      toast('fieldReset');
    }
  });
};

// ----------------------------------------------------------------------------
// 8. HUD & View Renderers
// ----------------------------------------------------------------------------
function updateHud() {
  if (!state) return;
  const n = state.remaining;
  const isEndless = state.gameMode === 'endless';

  $('time').textContent = String(Math.floor(n / 60)).padStart(2, '0') + ':' + String(n % 60).padStart(2, '0');
  $('time').classList.toggle('urgent', !isEndless && n <= 10 && state.status === 'playing');

  const timeLabel = $('time').previousElementSibling;
  if (timeLabel) timeLabel.textContent = t(isEndless ? 'timeElapsed' : 'time');

  if (isEndless) {
    $('target-hud').textContent = t('endlessTarget');
  } else {
    $('target-hud').textContent = state.targetScore.toLocaleString(lang === 'th' ? 'th-TH' : 'en-US');
  }

  $('status').textContent = t(!socket.connected ? 'reconnecting' : state.status === 'playing' ? 'playing' : 'finished');
}

function startDragPiece(e, piece, player, board, buttons) {
  if (state.status !== 'playing' || pending || !socket.connected || player.blocked) return;
  if (e.button !== undefined && e.button !== 0) return;

  isDraggingPiece = true;

  const isTouch = e.pointerType === 'touch';
  const startX = e.clientX;
  const startY = e.clientY;
  const pointerId = e.pointerId;
  const currentTarget = e.currentTarget || e.target;
  let hasMoved = false;

  const w = Math.max(...piece.cells.map((c) => c[0])) + 1;
  const h = Math.max(...piece.cells.map((c) => c[1])) + 1;

  // Measure actual board cell size and gap dynamically from the player's board
  let cellSize = 36;
  let cellGap = 4;
  let originLeft = 0;
  let originTop = 0;

  if (buttons.length >= 2) {
    const r0 = buttons[0].getBoundingClientRect();
    const r1 = buttons[1].getBoundingClientRect();
    cellSize = r0.width;
    cellGap = Math.max(2, r1.left - r0.right);
    originLeft = r0.left;
    originTop = r0.top;
  }

  try {
    if (pointerId !== undefined && currentTarget && currentTarget.setPointerCapture) {
      currentTarget.setPointerCapture(pointerId);
    }
  } catch {}

  let avatar = $('drag-avatar');
  if (!avatar) {
    avatar = document.createElement('div');
    avatar.id = 'drag-avatar';
    document.body.appendChild(avatar);
  }

  avatar.innerHTML = '';
  avatar.className = 'is-dragging';
  avatar.style.display = 'none';
  avatar.style.gridTemplateColumns = `repeat(${w}, ${cellSize}px)`;
  avatar.style.gridTemplateRows = `repeat(${h}, ${cellSize}px)`;
  avatar.style.gap = `${cellGap}px`;

  for (let y = 0; y < h; y++) {
    for (let x = 0; x < w; x++) {
      const block = document.createElement('div');
      if (piece.cells.some(([dx, dy]) => dx === x && dy === y)) {
        block.className = 'drag-block';
      } else {
        block.style.opacity = '0';
      }
      avatar.appendChild(block);
    }
  }

  // Lift piece above finger on touch devices so thumb does not obscure the blocks
  const touchOffsetY = isTouch ? Math.max(60, cellSize * 1.6) : 0;
  avatar.style.left = `${startX}px`;
  avatar.style.top = `${startY - touchOffsetY}px`;

  let currentDropX = null;
  let currentDropY = null;

  function updateHover(clientX, clientY) {
    const targetX = clientX;
    const targetY = clientY - touchOffsetY;

    avatar.style.left = `${targetX}px`;
    avatar.style.top = `${targetY}px`;

    const totalW = w * cellSize + (w - 1) * cellGap;
    const totalH = h * cellSize + (h - 1) * cellGap;

    // Piece top-left screen position relative to avatar center
    const pieceLeft = targetX - totalW / 2;
    const pieceTop = targetY - totalH / 2;

    const firstCell = (buttons[0] && buttons[0].isConnected)
      ? buttons[0].getBoundingClientRect()
      : { left: originLeft, top: originTop };
    const step = cellSize + cellGap;

    const gridX = Math.round((pieceLeft - firstCell.left) / step);
    const gridY = Math.round((pieceTop - firstCell.top) / step);

    buttons.forEach((b) => b.classList.remove('preview', 'invalid'));

    if (gridX >= -w && gridX < 8 && gridY >= -h && gridY < 8) {
      const valid = piece.cells.every(
        ([dx, dy]) =>
          gridX + dx >= 0 &&
          gridX + dx < 8 &&
          gridY + dy >= 0 &&
          gridY + dy < 8 &&
          !player.grid[gridY + dy][gridX + dx]
      );

      for (const [dx, dy] of piece.cells) {
        const cx = gridX + dx;
        const cy = gridY + dy;
        if (cx >= 0 && cx < 8 && cy >= 0 && cy < 8) {
          buttons[cy * 8 + cx].classList.add(valid ? 'preview' : 'invalid');
        }
      }

      if (valid) {
        currentDropX = gridX;
        currentDropY = gridY;
        return;
      }
    }

    currentDropX = null;
    currentDropY = null;
  }

  function onPointerMove(moveEvent) {
    if (moveEvent.cancelable) {
      moveEvent.preventDefault();
    }
    const dist = Math.hypot(moveEvent.clientX - startX, moveEvent.clientY - startY);
    if (dist > 6) {
      if (!hasMoved) {
        hasMoved = true;
        avatar.style.display = 'grid';
        selected = piece.id;
      }
      updateHover(moveEvent.clientX, moveEvent.clientY);
    }
  }

  function onPointerUp() {
    window.removeEventListener('pointermove', onPointerMove);
    window.removeEventListener('pointerup', onPointerUp);
    window.removeEventListener('pointercancel', onPointerUp);
    window.removeEventListener('blur', onPointerUp);

    try {
      if (pointerId !== undefined && currentTarget && currentTarget.releasePointerCapture) {
        currentTarget.releasePointerCapture(pointerId);
      }
    } catch {}

    isDraggingPiece = false;
    avatar.style.display = 'none';
    buttons.forEach((b) => b.classList.remove('preview', 'invalid'));

    if (hasMoved) {
      if (currentDropX !== null && currentDropY !== null) {
        selected = piece.id;
        pendingRoomState = false;
        place(currentDropX, currentDropY);
      } else {
        selected = piece.id;
        if (pendingRoomState) {
          pendingRoomState = false;
        }
        render();
      }
    } else {
      // Tap / click to select for click-to-place
      selected = piece.id;
      tone(360, 0.04);
      if (pendingRoomState) {
        pendingRoomState = false;
      }
      render();
    }
  }

  window.addEventListener('pointermove', onPointerMove, { passive: false });
  window.addEventListener('pointerup', onPointerUp);
  window.addEventListener('pointercancel', onPointerUp);
  window.addEventListener('blur', onPointerUp);
}

function render() {
  localize();
  const arena = state && (state.status === 'playing' || (state.status === 'finished' && !showLobby));
  $('arena').hidden = !arena;
  $('lobby').hidden = !!arena;
  $('join-form').hidden = !!state;
  $('waiting').hidden = !state;
  if (!state) return;

  const host = state.hostSeat === seat;
  const isEndless = state.gameMode === 'endless';

  $('room-code').textContent = state.roomId;
  $('presence').replaceChildren();

  for (const p of state.players) {
    const row = document.createElement('div');
    row.className = 'presence';
    const name = document.createElement('span');
    name.textContent = p.name + (p.seat === seat ? ' · ' + t('you') : '') + (p.seat === state.hostSeat ? ' · ' + t('host') : '');
    const tag = document.createElement('span');
    tag.className = p.connected ? 'ready-tag' : 'offline-tag';
    tag.textContent = t(p.connected ? 'ready' : 'offline');
    row.append(name, tag);
    $('presence').append(row);
  }

  $('config').hidden = !host;
  $('mode-timed').classList.toggle('active', !isEndless);
  $('mode-endless').classList.toggle('active', isEndless);
  $('timed-config').style.display = isEndless ? 'none' : 'flex';
  $('mode-timed').disabled = !host;
  $('mode-endless').disabled = !host;
  $('target').disabled = !host;
  $('duration').disabled = !host;

  $('start').hidden = !host;
  $('start').disabled = !socket.connected || state.players.length < 1 || state.players.some((p) => !p.connected);
  $('waiting-note').textContent = t(state.players.length < 2 ? (host ? 'soloWaiting' : 'waiting') : (host ? 'readyStart' : 'hostWait'));

  if (document.activeElement !== $('target')) $('target').value = state.targetScore;
  if (document.activeElement !== $('duration')) $('duration').value = state.matchDuration;

  if (!arena) return;
  updateHud();

  $('back').hidden = state.status !== 'finished';
  $('reset-field').hidden = state.status !== 'playing';
  $('reset-field').disabled = !socket.connected || state.status !== 'playing';
  $('result').hidden = state.status !== 'finished';

  if (state.status === 'finished') {
    const isWinner = state.winnerSeat === seat;
    const isTie = state.winnerSeat === null;
    $('result').className = 'banner ' + (isTie ? 'banner-tie' : isWinner ? 'banner-win' : 'banner-lose');

    const winner = state.players.find((p) => p.seat === state.winnerSeat);
    const title = document.createElement('strong');

    if (isTie) {
      title.textContent = t('tie');
    } else if (winner) {
      const winnerName = winner.name || (t('player') + ' ' + (winner.seat + 1));
      const youSuffix = isWinner ? ` (${t('you')})` : '';
      title.textContent = `${winnerName} ${t('winsGame')}${youSuffix}`;
    } else {
      title.textContent = t(isWinner ? 'win' : 'lose');
    }

    const reason = document.createElement('p');
    reason.textContent = t((state.reason || 'time') + 'Reason');
    $('result').replaceChildren(title, reason);
  }

  $('boards').replaceChildren();
  const sortedScores = [...state.players].sort((a, b) => b.score - a.score);

  // Always display own player's board first, followed by opponents
  const displayPlayers = [...state.players].sort((a, b) => {
    if (a.seat === seat) return -1;
    if (b.seat === seat) return 1;
    return a.seat - b.seat;
  });

  displayPlayers.forEach((p) => {
    const own = p.seat === seat;
    const rank = sortedScores.findIndex((item) => item.seat === p.seat) + 1;
    const panel = document.createElement('article');
    panel.className = 'panel player-panel' + (own ? ' is-own' : ' enemy');

    const top = document.createElement('div');
    top.className = 'player-top';
    const name = document.createElement('div');
    name.className = 'player-name';
    const rankPrefix = state.players.length > 1 ? `#${rank} ` : '';
    name.textContent = `${rankPrefix}${p.name}`;
    const tag = document.createElement('span');
    tag.className = 'you-tag';
    tag.textContent = own ? t('you') : t('player') + ' ' + (p.seat + 1);
    name.append(tag);

    const score = document.createElement('div');
    score.className = 'score';
    score.textContent = p.score.toLocaleString();
    score.setAttribute('aria-label', p.score + ' ' + t('points'));
    top.append(name, score);
    panel.append(top);

    const board = document.createElement('div');
    board.className = 'board';
    board.setAttribute('aria-label', p.name);
    const buttons = [];

    for (let y = 0; y < 8; y++) {
      for (let x = 0; x < 8; x++) {
        const cell = document.createElement('button');
        cell.className = 'cell' + (p.grid[y][x] ? ' filled' : '');
        cell.disabled = !own || state.status !== 'playing' || pending || !socket.connected || p.blocked;
        cell.setAttribute('aria-label', `${x + 1}, ${y + 1}`);
        cell.onclick = () => place(x, y);
        cell.onpointerenter = () => preview(x, y);
        cell.onfocus = () => preview(x, y);
        board.append(cell);
        buttons.push(cell);
      }
    }

    function resetPreview() {
      buttons.forEach((b) => b.classList.remove('preview', 'invalid'));
    }

    function preview(x, y) {
      resetPreview();
      if (!own) return;
      const piece = p.rack.find((item) => item.id === selected);
      if (!piece) return;
      const valid = piece.cells.every(([dx, dy]) => x + dx < 8 && y + dy < 8 && !p.grid[y + dy][x + dx]);
      for (const [dx, dy] of piece.cells) {
        if (x + dx < 8 && y + dy < 8) {
          buttons[(y + dy) * 8 + x + dx].classList.add(valid ? 'preview' : 'invalid');
        }
      }
    }

    board.onpointerleave = resetPreview;
    panel.append(board);

    const pieces = document.createElement('div');
    pieces.className = 'rack';

    if (own) {
      for (const piece of p.rack) {
        const btn = document.createElement('button');
        btn.className = 'piece' + (selected === piece.id ? ' selected' : '');
        btn.disabled = state.status !== 'playing' || pending || !socket.connected || p.blocked;
        btn.setAttribute('aria-pressed', String(selected === piece.id));
        btn.setAttribute('aria-label', t('select') + ' ' + piece.cells.length);

        const mini = document.createElement('span');
        mini.className = 'mini';
        const w = Math.max(...piece.cells.map((c) => c[0])) + 1;
        const h = Math.max(...piece.cells.map((c) => c[1])) + 1;
        mini.style.gridTemplateColumns = `repeat(${w}, 1fr)`;

        for (let y = 0; y < h; y++) {
          for (let x = 0; x < w; x++) {
            const block = document.createElement('i');
            if (piece.cells.some(([dx, dy]) => dx === x && dy === y)) {
              block.className = 'block';
            }
            mini.append(block);
          }
        }

        btn.append(mini);
        btn.onpointerdown = (e) => {
          startDragPiece(e, piece, p, board, buttons);
        };
        pieces.append(btn);
      }
    } else {
      pieces.classList.add('enemy-cooking');
      pieces.textContent = t('enemy');
    }
    panel.append(pieces);

    const help = document.createElement('div');
    help.className = 'board-help';
    help.textContent = t(!p.connected ? 'offline' : p.blocked ? 'blocked' : own ? 'select' : '');
    panel.append(help);
    $('boards').append(panel);
  });

  if (shouldFocusOwnBoard) {
    shouldFocusOwnBoard = false;
    window.scrollTo({ top: 0, left: 0, behavior: 'instant' });
    setTimeout(() => {
      const ownPanel = document.querySelector('.player-panel.is-own');
      if (ownPanel) {
        ownPanel.scrollIntoView({ behavior: 'smooth', block: 'nearest' });
      } else {
        $('arena')?.scrollIntoView({ behavior: 'smooth', block: 'start' });
      }
    }, 60);
  }

  if (shouldFocusResult) {
    shouldFocusResult = false;
    setTimeout(() => {
      $('result')?.scrollIntoView({ behavior: 'smooth', block: 'center' });
    }, 60);
  }
}

// ----------------------------------------------------------------------------
// 9. Application Initialization
// ----------------------------------------------------------------------------
if (session) {
  $('name').value = session.playerName || '';
  $('code').value = session.roomId || '';
}
localize();
socket.connect();

// ----------------------------------------------------------------------------
// 10. Background Canvas Animation (Falling Silhouettes)
// ----------------------------------------------------------------------------
const canvas = $('background');
const ctx = canvas.getContext('2d');
const reduce = matchMedia('(prefers-reduced-motion: reduce)');
let width = 0;
let height = 0;
let lastFrame = 0;

const silhouettes = [
  [[0, 0], [1, 0], [2, 0], [1, 1]],
  [[0, 0], [1, 0], [0, 1], [1, 1]],
  [[0, 0], [0, 1], [0, 2], [1, 2]],
  [[0, 0], [1, 0], [2, 0], [3, 0]]
];

const falling = Array.from({ length: 22 }, () => ({
  x: Math.random(),
  y: Math.random(),
  speed: 8 + Math.random() * 20,
  size: 16 + Math.random() * 22,
  rotation: Math.random() * Math.PI,
  shape: silhouettes[Math.floor(Math.random() * 4)]
}));

function resize() {
  width = innerWidth;
  height = innerHeight;
  const dpr = Math.min(devicePixelRatio || 1, 2);
  canvas.width = width * dpr;
  canvas.height = height * dpr;
  canvas.style.width = width + 'px';
  canvas.style.height = height + 'px';
  ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
}

function frame(now) {
  const dt = Math.min((now - lastFrame) / 1000, 0.05);
  lastFrame = now;
  ctx.clearRect(0, 0, width, height);

  for (const p of falling) {
    if (!reduce.matches) p.y += (p.speed * dt) / height;
    if (p.y * height > height + 150) p.y = -150 / height;

    ctx.save();
    ctx.translate(p.x * width, p.y * height);
    ctx.rotate(p.rotation);
    ctx.fillStyle = 'rgba(112, 117, 132, 0.075)';
    for (const [x, y] of p.shape) {
      ctx.fillRect(x * p.size, y * p.size, p.size - 3, p.size - 3);
    }
    ctx.restore();
  }

  requestAnimationFrame(frame);
}

addEventListener('resize', resize);
resize();
requestAnimationFrame(frame);

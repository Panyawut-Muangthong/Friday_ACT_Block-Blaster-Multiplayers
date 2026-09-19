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
    eyebrow: 'REAL-TIME · 1 VS 1',
    hero: 'Small blocks.<br><span>Big rivalry.</span>',
    lead: 'Your board. Your moves. One winner. Fit the pieces, blast full lines, and race your rival to the target.',
    step1: 'Share a room code with a friend to enter the duel.',
    step2: 'Choose a piece, then click a cell to place its top-left corner. No rotations.',
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
    targetReason: 'Target score reached.',
    timeReason: 'Time is up. Highest score wins.',
    blockedReason: 'Both boards ran out of moves. Highest score wins.',
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
    eyebrow: 'เรียลไทม์ · 1 ต่อ 1',
    hero: 'บล็อกเล็ก ๆ<br><span>ศึกที่ยิ่งใหญ่</span>',
    lead: 'กระดานของคุณ เกมของคุณ ผู้ชนะเพียงหนึ่งเดียว วางบล็อก ระเบิดแถว แล้วทำคะแนนให้ถึงเป้าหมายก่อนคู่แข่ง',
    step1: 'แชร์รหัสห้องให้เพื่อนเพื่อเข้าร่วมการดวล',
    step2: 'เลือกชิ้นบล็อก แล้วกดช่องมุมซ้ายบนที่ต้องการวาง หมุนชิ้นไม่ได้',
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
    targetReason: 'ทำคะแนนถึงเป้าหมายแล้ว',
    timeReason: 'หมดเวลา ผู้ที่คะแนนสูงกว่าชนะ',
    blockedReason: 'ทั้งสองกระดานวางต่อไม่ได้ ผู้ที่คะแนนสูงกว่าชนะ',
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
    } else if (next.status === 'finished') {
      if (next.winnerSeat === seat) {
        [523, 659, 784, 1046].forEach((f, i) => tone(f, 0.18, i * 0.08, 'triangle'));
      } else if (next.winnerSeat !== null) {
        [392, 349, 311, 261].forEach((f, i) => tone(f, 0.22, i * 0.1, 'sawtooth'));
      }
    }
  }

  const mine = next.players.find((p) => p.seat === seat);
  if (selected && !mine?.rack.some((p) => p.id === selected)) {
    selected = null;
  }

  if (next.action && next.revision !== previous?.revision) {
    if (next.action.seat === seat) {
      tone(260, 0.09);
      if (next.action.lines) {
        [440, 554, 659, 880].forEach((f, i) => tone(f, 0.18, i * 0.065, 'triangle'));
      }
    }
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

    const title = document.createElement('strong');
    title.textContent = t(isTie ? 'tie' : isWinner ? 'win' : 'lose');
    const reason = document.createElement('p');
    reason.textContent = t((state.reason || 'time') + 'Reason');
    $('result').replaceChildren(title, reason);
  }

  $('boards').replaceChildren();
  const sortedScores = [...state.players].sort((a, b) => b.score - a.score);

  state.players.forEach((p, index) => {
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
    tag.textContent = own ? t('you') : t('player') + ' ' + (index + 1);
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
        btn.onclick = () => {
          selected = piece.id;
          tone(360, 0.04);
          render();
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

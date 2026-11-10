const fs = require('fs');
const path = require('path');

const htmlPath = path.join(__dirname, '..', 'twogether.html');
const publicHtmlPath = path.join(__dirname, '..', 'public', 'index.html');

let htmlContent = fs.readFileSync(htmlPath, 'utf8');

// 1. Remove profile icon in top right of homepage screen
const oldTopBar = `<div class="flex items-center justify-between mb-4">
            <button onclick="alert('TWOgether — Build Your Life Together')" class="w-10 h-10 rounded-full flex items-center justify-center text-textDark/80 hover:bg-white/30" aria-label="Menu">
              <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8"><line x1="4" y1="12" x2="20" y2="12"></line><line x1="4" y1="6" x2="20" y2="6"></line><line x1="4" y1="18" x2="20" y2="18"></line></svg>
            </button>
            <h1 class="font-serif-heading text-2xl font-semibold tracking-wider text-textDark">TWOgether</h1>
            <div class="w-9 h-9 rounded-full border border-white/60 bg-white/30 flex items-center justify-center text-textDark/80 shadow-sm">
              <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8"><path d="M19 21v-2a4 4 0 0 0-4-4H9a4 4 0 0 0-4 4v2"></path><circle cx="12" cy="7" r="4"></circle></svg>
            </div>
          </div>`;

const newTopBar = `<div class="flex items-center justify-between mb-4">
            <button onclick="alert('TWOgether — Build Your Life Together')" class="w-10 h-10 rounded-full flex items-center justify-center text-textDark/80 hover:bg-white/30" aria-label="Menu">
              <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8"><line x1="4" y1="12" x2="20" y2="12"></line><line x1="4" y1="6" x2="20" y2="6"></line><line x1="4" y1="18" x2="20" y2="18"></line></svg>
            </button>
            <h1 class="font-serif-heading text-2xl font-semibold tracking-wider text-textDark">TWOgether</h1>
            <!-- Profile icon removed per request, spacer keeps title centered -->
            <div class="w-10 h-10" aria-hidden="true"></div>
          </div>`;

htmlContent = htmlContent.replace(oldTopBar, newTopBar);

// 2. Add "Join Room ID" button directly below "Mulai Tes Sekarang"
const oldCtaButtons = `<div class="mt-4 flex flex-col items-center gap-2.5">
            <button onclick="switchScreen('create')" class="w-full py-4 px-6 rounded-full bg-warmCream text-textDark font-medium text-base text-center shadow-md hover:bg-warmCream-light active:scale-[0.98] transition-all flex items-center justify-center gap-2">
              <span>Mulai Tes Sekarang</span>
              <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M5 12h14"></path><path d="m12 5 7 7-7 7"></path></svg>
            </button>
            <div class="text-center">`;

const newCtaButtons = `<div class="mt-4 flex flex-col items-center gap-2.5">
            <button onclick="switchScreen('create')" class="w-full py-4 px-6 rounded-full bg-warmCream text-textDark font-medium text-base text-center shadow-md hover:bg-warmCream-light active:scale-[0.98] transition-all flex items-center justify-center gap-2">
              <span>Mulai Tes Sekarang</span>
              <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M5 12h14"></path><path d="m12 5 7 7-7 7"></path></svg>
            </button>
            <!-- Join Room ID Button positioned directly below Mulai Tes Sekarang -->
            <button type="button" onclick="openJoinModal()" class="w-full py-3.5 px-6 rounded-full glass-card bg-white/45 text-textDark font-medium text-sm text-center border border-white/60 shadow-sm hover:bg-white/65 active:scale-[0.98] transition-all flex items-center justify-center gap-2">
              <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" class="text-olive"><path d="M16 21v-2a4 4 0 0 0-4-4H6a4 4 0 0 0-4 4v2"></path><circle cx="9" cy="7" r="4"></circle><path d="M22 21v-2a4 4 0 0 0-3-3.87"></path><path d="M16 3.13a4 4 0 0 1 0 7.75"></path></svg>
              <span>Join Room ID</span>
            </button>
            <div class="text-center mt-1">`;

htmlContent = htmlContent.replace(oldCtaButtons, newCtaButtons);

// 3. Add Join Room Modal before </main>
const joinModalHtml = `
  <!-- JOIN ROOM MODAL -->
  <div id="joinRoomModal" class="hidden fixed inset-0 z-50 bg-black/60 backdrop-blur-md flex items-center justify-center p-4">
    <div class="w-full max-w-sm rounded-[32px] glass-panel bg-white/95 p-6 shadow-2xl relative text-textDark border border-white/60 my-auto">
      <button onclick="closeJoinModal()" class="absolute top-4 right-4 w-8 h-8 rounded-full flex items-center justify-center text-textDark/70 hover:bg-black/5 transition">✕</button>
      <div class="flex items-center gap-2 mb-2">
        <span class="p-2 rounded-xl bg-olive/15 text-olive">👥</span>
        <h3 class="font-serif-heading text-xl font-semibold text-textDark">Join Room ID</h3>
      </div>
      <p class="text-xs text-textDark/75 mb-4 leading-relaxed">
        Masukkan <strong>Room ID</strong> (contoh: <code>TWO-52308</code>) atau tempel link undangan yang disediakan oleh pasanganmu.
      </p>
      <div id="joinModalError" class="hidden p-2.5 rounded-xl bg-red-500/10 border border-red-500/20 text-xs text-red-600 mb-3"></div>
      <div class="space-y-3">
        <div>
          <label class="text-xs font-semibold text-textDark/80 block mb-1">Room ID atau Link Pasangan</label>
          <input type="text" id="joinRoomInput" placeholder="Contoh: TWO-52308 atau tempel link..." class="w-full py-3 px-3.5 rounded-2xl glass-card bg-white/70 border border-white/80 text-textDark text-sm focus:outline-none focus:ring-2 focus:ring-olive/40 placeholder:text-textDark/40">
        </div>
        <button type="button" onclick="submitJoinRoomModal()" class="w-full py-3.5 px-5 rounded-full bg-olive text-white font-semibold text-sm shadow-md flex items-center justify-center gap-2 hover:bg-opacity-90 active:scale-95 transition">
          <span>Masuk ke Ruangan</span>
          <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M5 12h14"></path><path d="m12 5 7 7-7 7"></path></svg>
        </button>
      </div>
    </div>
  </div>
`;

htmlContent = htmlContent.replace('</main>', `${joinModalHtml}\n  </main>`);

// 4. Add openJoinModal, closeJoinModal, submitJoinRoomModal JS functions
const joinJsFunctions = `
    function openJoinModal() {
      document.getElementById('joinRoomModal').classList.remove('hidden');
      document.getElementById('joinModalError').classList.add('hidden');
      const inp = document.getElementById('joinRoomInput');
      if (inp) {
        inp.value = '';
        setTimeout(() => inp.focus(), 100);
      }
    }
    function closeJoinModal() {
      document.getElementById('joinRoomModal').classList.add('hidden');
    }
    function submitJoinRoomModal() {
      const inp = (document.getElementById('joinRoomInput').value || '').trim();
      const err = document.getElementById('joinModalError');
      if (!inp) {
        err.innerText = 'Silakan masukkan Room ID atau tautan undangan.';
        err.classList.remove('hidden');
        return;
      }
      closeJoinModal();
      switchScreen('invite');
    }
`;

htmlContent = htmlContent.replace('function openShareModal(', `${joinJsFunctions}\n    function openShareModal(`);

fs.writeFileSync(htmlPath, htmlContent, 'utf8');
fs.writeFileSync(publicHtmlPath, htmlContent, 'utf8');
console.log('Successfully updated Join Room ID action and removed top-right profile icon in twogether.html and public/index.html');

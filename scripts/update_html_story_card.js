const fs = require('fs');
const path = require('path');

const htmlPath = path.join(__dirname, '..', 'twogether.html');
const publicHtmlPath = path.join(__dirname, '..', 'public', 'index.html');

let htmlContent = fs.readFileSync(htmlPath, 'utf8');

// 1. Add bottom buttons right below navigation capsule in report container
const targetNavCapsule = `          <!-- STICKY 5-TAB BOTTOM NAVIGATION CAPSULE -->
          <div class="mt-8 pt-2 sticky bottom-2 z-20">
            <div class="w-full p-1.5 rounded-full glass-panel flex items-center justify-between shadow-lg border border-white/60 text-[11px] sm:text-xs">
              <button onclick="switchReportTab('overview')" id="navTab-overview" class="rep-nav-btn flex-1 py-2 px-1 rounded-full font-medium transition-all text-center bg-warmCream text-textDark shadow-sm font-semibold">
                Ringkasan
              </button>
              <button onclick="switchReportTab('connections')" id="navTab-connections" class="rep-nav-btn flex-1 py-2 px-1 rounded-full font-medium transition-all text-center text-textDark/70">
                Kekuatan
              </button>
              <button onclick="switchReportTab('differences')" id="navTab-differences" class="rep-nav-btn flex-1 py-2 px-1 rounded-full font-medium transition-all text-center text-textDark/70">
                Eksplorasi
              </button>
              <button onclick="switchReportTab('seven_areas')" id="navTab-seven_areas" class="rep-nav-btn flex-1 py-2 px-1 rounded-full font-medium transition-all text-center text-textDark/70">
                7 Dimensi
              </button>
              <button onclick="switchReportTab('recommendations')" id="navTab-recommendations" class="rep-nav-btn flex-1 py-2 px-1 rounded-full font-medium transition-all text-center text-textDark/70">
                Aksi &amp; Challenge
              </button>
            </div>
          </div>`;

const replacementWithButtons = `${targetNavCapsule}

          <!-- BOTTOM SHARE BUTTONS (FEATURE: INSTAGRAM STORY SHARE CARD) -->
          <div class="mt-4 pt-4 border-t border-white/40 flex flex-col sm:flex-row gap-2.5">
            <button
              type="button"
              onclick="openShareModal()"
              class="flex-1 py-3.5 px-5 rounded-full bg-olive text-white font-semibold text-xs sm:text-sm shadow-md flex items-center justify-center gap-2 hover:bg-opacity-90 active:scale-95 transition"
            >
              <span>📸 Share Our Story</span>
            </button>
            <button
              type="button"
              onclick="openShareModal('download')"
              class="py-3 px-5 rounded-full glass-card bg-white/40 text-textDark font-medium text-xs sm:text-sm border border-white/60 shadow-sm flex items-center justify-center gap-2 hover:bg-white/60 active:scale-95 transition"
            >
              <span>📥 Download Report Card</span>
            </button>
          </div>`;

htmlContent = htmlContent.replace(targetNavCapsule, replacementWithButtons);

// 2. Replace the old simple modal with the complete Instagram Story modal
const oldModalRegex = /<!-- SHARE \/ STORY CARD MODAL -->[\s\S]*?<!-- CLIENT-SIDE ADVANCED INSIGHT ENGINE -->/;

const newModalCode = `<!-- SHARE / INSTAGRAM STORY CARD MODAL (FEATURE: INSTAGRAM STORY SHARE CARD) -->
  <div id="shareModal" class="hidden fixed inset-0 z-50 bg-black/60 backdrop-blur-md flex items-center justify-center p-3 sm:p-4 overflow-y-auto">
    <div class="w-full max-w-md rounded-[32px] glass-panel bg-white/95 p-5 sm:p-6 shadow-2xl relative text-textDark border border-white/60 my-auto flex flex-col max-h-[95vh]">
      <!-- Header -->
      <div class="flex items-center justify-between pb-3 border-b border-black/5 shrink-0">
        <div>
          <h3 class="font-serif-heading text-lg sm:text-xl font-semibold text-textDark flex items-center gap-2">
            📸 Instagram Story Card
          </h3>
          <p class="text-[11px] text-textDark/70">
            Format 9:16 (1080 x 1920 px) resolusi tinggi
          </p>
        </div>
        <button onclick="closeShareModal()" class="w-8 h-8 rounded-full flex items-center justify-center text-textDark/70 hover:bg-black/5 transition">
          ✕
        </button>
      </div>

      <!-- Scrollable content -->
      <div class="overflow-y-auto py-3 space-y-4 pr-1">
        <!-- Variant Switcher -->
        <div>
          <label class="text-[11px] font-semibold uppercase tracking-wider text-textDark/70 block mb-1.5">
            Pilih Gaya Desain:
          </label>
          <div class="grid grid-cols-3 gap-1.5 p-1 rounded-2xl bg-black/5 text-xs text-center">
            <button
              id="htmlVarBtn-connections"
              onclick="setHtmlStoryVariant('connections')"
              class="py-2 px-1 rounded-xl font-medium transition bg-warmCream text-textDark font-semibold shadow-sm"
            >
              Pilar Kekuatan
            </button>
            <button
              id="htmlVarBtn-editorial"
              onclick="setHtmlStoryVariant('editorial')"
              class="py-2 px-1 rounded-xl font-medium transition text-textDark/70 hover:text-textDark"
            >
              Minimal Editorial
            </button>
            <button
              id="htmlVarBtn-quote"
              onclick="setHtmlStoryVariant('quote')"
              class="py-2 px-1 rounded-xl font-medium transition text-textDark/70 hover:text-textDark"
            >
              Kutipan Relasi
            </button>
          </div>
        </div>

        <!-- 9:16 Live Canvas Preview -->
        <div class="relative mx-auto w-full max-w-[240px] aspect-[9/16] rounded-2xl overflow-hidden shadow-lg border-2 border-white/80 bg-sage/20 flex items-center justify-center">
          <canvas id="htmlStoryCanvas" width="1080" height="1920" class="w-full h-full object-contain block"></canvas>
        </div>

        <!-- Notice Container -->
        <div id="htmlShareNotice" class="hidden p-3 rounded-2xl bg-olive/10 border border-olive/20 text-xs text-textDark leading-snug"></div>

        <!-- Privacy Assurance -->
        <div class="p-2.5 rounded-xl bg-black/5 text-[10px] text-textDark/75 flex items-start gap-2">
          <span>🛡️</span>
          <span>
            <strong>Privasi Terjaga:</strong> Hanya menampilkan nama panggilan, skor keselarasan, dan pilar kekuatan umum. Jawaban privat dan data sensitif tidak disertakan.
          </span>
        </div>
      </div>

      <!-- Actions -->
      <div class="pt-3 border-t border-black/5 flex flex-col gap-2 shrink-0">
        <button
          type="button"
          onclick="shareHtmlStory()"
          class="w-full py-3.5 px-5 rounded-full bg-olive text-white font-semibold text-xs sm:text-sm shadow-md flex items-center justify-center gap-2 hover:bg-opacity-90 active:scale-95 transition"
        >
          <span>🚀 Bagikan ke Instagram Story</span>
        </button>
        <button
          type="button"
          onclick="downloadHtmlStory()"
          class="w-full py-3 px-5 rounded-full bg-warmCream text-textDark font-medium text-xs sm:text-sm border border-black/10 shadow-sm flex items-center justify-center gap-2 hover:bg-opacity-90 active:scale-95 transition"
        >
          <span>📥 Unduh Gambar (1080x1920 PNG)</span>
        </button>
      </div>
    </div>
  </div>

  <!-- CLIENT-SIDE ADVANCED INSIGHT ENGINE -->`;

htmlContent = htmlContent.replace(oldModalRegex, newModalCode);

// 3. Inject canvas rendering functions into javascript block
const jsCanvasCode = `
    // INSTAGRAM STORY CANVAS ENGINE (1080 x 1920 px)
    let currentHtmlStoryVariant = 'connections';
    let currentCachedReportData = null;

    function setHtmlStoryVariant(v) {
      currentHtmlStoryVariant = v;
      ['connections', 'editorial', 'quote'].forEach(key => {
        const btn = document.getElementById('htmlVarBtn-' + key);
        if (btn) {
          if (key === v) {
            btn.className = 'py-2 px-1 rounded-xl font-medium transition bg-warmCream text-textDark font-semibold shadow-sm';
          } else {
            btn.className = 'py-2 px-1 rounded-xl font-medium transition text-textDark/70 hover:text-textDark';
          }
        }
      });
      renderHtmlStoryCanvas();
    }

    function drawRoundedRectNative(ctx, x, y, width, height, radius) {
      ctx.beginPath();
      ctx.moveTo(x + radius, y);
      ctx.lineTo(x + width - radius, y);
      ctx.quadraticCurveTo(x + width, y, x + width, y + radius);
      ctx.lineTo(x + width, y + height - radius);
      ctx.quadraticCurveTo(x + width, y + height, x + width - radius, y + height);
      ctx.lineTo(x + radius, y + height);
      ctx.quadraticCurveTo(x, y + height, x, y + height - radius);
      ctx.lineTo(x, y + radius);
      ctx.quadraticCurveTo(x, y, x + radius, y);
      ctx.closePath();
    }

    function wrapTextNative(ctx, text, maxWidth) {
      const words = text.split(' ');
      const lines = [];
      let cur = '';
      for (let i = 0; i < words.length; i++) {
        const w = words[i];
        const test = cur ? cur + ' ' + w : w;
        if (ctx.measureText(test).width > maxWidth && i > 0) {
          lines.push(cur);
          cur = w;
        } else {
          cur = test;
        }
      }
      if (cur) lines.push(cur);
      return lines;
    }

    function renderHtmlStoryCanvas() {
      const canvas = document.getElementById('htmlStoryCanvas');
      if (!canvas) return;
      const data = currentCachedReportData || buildReportData(COUPLE_PROFILES[activeCoupleKey]);
      const ctx = canvas.getContext('2d');
      if (!ctx) return;

      const width = 1080;
      const height = 1920;
      canvas.width = width;
      canvas.height = height;

      // 1. Background gradient
      const bgGrad = ctx.createLinearGradient(0, 0, 0, height);
      bgGrad.addColorStop(0.0, '#A4C3D2');
      bgGrad.addColorStop(0.28, '#B8D3CE');
      bgGrad.addColorStop(0.65, '#9EAD91');
      bgGrad.addColorStop(1.0, '#758368');
      ctx.fillStyle = bgGrad;
      ctx.fillRect(0, 0, width, height);

      // Sun glow
      const sunGlow = ctx.createRadialGradient(540, 280, 20, 540, 280, 550);
      sunGlow.addColorStop(0, 'rgba(255, 255, 255, 0.45)');
      sunGlow.addColorStop(0.5, 'rgba(240, 235, 214, 0.18)');
      sunGlow.addColorStop(1, 'rgba(255, 255, 255, 0)');
      ctx.fillStyle = sunGlow;
      ctx.fillRect(0, 0, width, 850);

      // Header logo
      ctx.save();
      ctx.textAlign = 'center';
      ctx.strokeStyle = 'rgba(255, 255, 255, 0.9)';
      ctx.lineWidth = 3.5;
      ctx.beginPath();
      ctx.arc(522, 190, 18, 0, Math.PI * 2);
      ctx.stroke();
      ctx.beginPath();
      ctx.arc(558, 190, 18, 0, Math.PI * 2);
      ctx.stroke();

      ctx.font = "bold 34px 'Playfair Display', Georgia, serif";
      ctx.fillStyle = '#2D3525';
      ctx.fillText('TWOgether', 540, 245);

      ctx.font = "400 20px 'Inter', sans-serif";
      ctx.fillStyle = 'rgba(45, 53, 37, 0.75)';
      ctx.fillText('YOUR RELATIONSHIP STORY', 540, 275);
      ctx.restore();

      // Main Glass Panel (y = 310, height = 1260)
      const pX = 70;
      const pY = 310;
      const pW = 940;
      const pH = 1260;

      ctx.save();
      ctx.shadowColor = 'rgba(30, 42, 22, 0.14)';
      ctx.shadowBlur = 40;
      ctx.shadowOffsetY = 16;
      drawRoundedRectNative(ctx, pX, pY, pW, pH, 52);
      ctx.fillStyle = 'rgba(255, 255, 255, 0.32)';
      ctx.fill();

      ctx.shadowColor = 'transparent';
      ctx.lineWidth = 2.5;
      ctx.strokeStyle = 'rgba(255, 255, 255, 0.75)';
      ctx.stroke();
      ctx.restore();

      // Names
      ctx.save();
      ctx.textAlign = 'center';
      ctx.font = "italic 600 64px 'Playfair Display', Georgia, serif";
      ctx.fillStyle = '#2C3423';
      ctx.fillText(data.nameA + ' & ' + data.nameB, 540, pY + 110);

      ctx.strokeStyle = 'rgba(119, 125, 75, 0.45)';
      ctx.lineWidth = 2;
      ctx.beginPath();
      ctx.moveTo(460, pY + 135);
      ctx.lineTo(620, pY + 135);
      ctx.stroke();
      ctx.restore();

      if (currentHtmlStoryVariant === 'editorial') {
        const scoreY = pY + 390;
        ctx.save();
        ctx.lineWidth = 20;
        ctx.lineCap = 'round';
        ctx.strokeStyle = 'rgba(255, 255, 255, 0.45)';
        ctx.beginPath();
        ctx.arc(540, scoreY - 20, 180, Math.PI, 0);
        ctx.stroke();

        const prog = Math.min(Math.max(data.overallScore / 100, 0), 1);
        ctx.strokeStyle = '#777D4B';
        ctx.beginPath();
        ctx.arc(540, scoreY - 20, 180, Math.PI, Math.PI + Math.PI * prog);
        ctx.stroke();
        ctx.restore();

        ctx.save();
        ctx.textAlign = 'center';
        ctx.font = "bold 150px 'Playfair Display', Georgia, serif";
        ctx.fillStyle = '#2A3322';
        ctx.fillText(data.overallScore + '%', 540, scoreY + 20);

        ctx.font = "600 24px 'Inter', sans-serif";
        ctx.fillStyle = 'rgba(42, 51, 34, 0.75)';
        ctx.fillText('OVERALL COMPATIBILITY', 540, scoreY + 75);

        if (data.top3 && data.top3.length > 0) {
          const topC = data.top3[0];
          drawRoundedRectNative(ctx, 240, scoreY + 140, 600, 60, 30);
          ctx.fillStyle = 'rgba(255, 255, 255, 0.55)';
          ctx.fill();
          ctx.strokeStyle = 'rgba(119, 125, 75, 0.35)';
          ctx.lineWidth = 1.5;
          ctx.stroke();

          ctx.font = "500 22px 'Inter', sans-serif";
          ctx.fillStyle = '#4A553E';
          ctx.fillText('Kekuatan Utama: ' + topC.name + ' (' + topC.score + '%)', 540, scoreY + 178);
        }

        ctx.font = "italic 400 36px 'Playfair Display', Georgia, serif";
        ctx.fillStyle = '#2E3726';
        const qLines = wrapTextNative(ctx, '“Setiap hubungan adalah kisah istimewa yang bertumbuh lewat saling memahami.”', 760);
        qLines.forEach((l, idx) => {
          ctx.fillText(l, 540, scoreY + 310 + idx * 52);
        });
        ctx.restore();

      } else if (currentHtmlStoryVariant === 'connections') {
        const scoreY = pY + 280;
        ctx.save();
        ctx.textAlign = 'center';
        ctx.font = "bold 110px 'Playfair Display', Georgia, serif";
        ctx.fillStyle = '#2A3322';
        ctx.fillText(data.overallScore + '%', 540, scoreY);

        ctx.font = "600 22px 'Inter', sans-serif";
        ctx.fillStyle = 'rgba(42, 51, 34, 0.75)';
        ctx.fillText('OVERALL COMPATIBILITY', 540, scoreY + 45);

        const secY = scoreY + 130;
        ctx.font = "bold 22px 'Inter', sans-serif";
        ctx.fillStyle = '#4E5A42';
        ctx.fillText('YOUR STRONGEST CONNECTIONS', 540, secY);
        ctx.restore();

        const barX = 150;
        const barW = 780;
        const startY = secY + 50;

        (data.top3 || []).slice(0, 3).forEach((cat, idx) => {
          const itemY = startY + idx * 135;
          ctx.save();
          drawRoundedRectNative(ctx, barX - 20, itemY - 10, barW + 40, 105, 24);
          ctx.fillStyle = 'rgba(255, 255, 255, 0.45)';
          ctx.fill();
          ctx.strokeStyle = 'rgba(255, 255, 255, 0.7)';
          ctx.lineWidth = 1.5;
          ctx.stroke();

          ctx.textAlign = 'left';
          ctx.font = "600 24px 'Playfair Display', Georgia, serif";
          ctx.fillStyle = '#2C3423';
          ctx.fillText(cat.name, barX + 10, itemY + 34);

          ctx.textAlign = 'right';
          ctx.font = "bold 26px 'Playfair Display', Georgia, serif";
          ctx.fillStyle = '#777D4B';
          ctx.fillText(cat.score + '%', barX + barW - 10, itemY + 34);

          const trackY = itemY + 56;
          drawRoundedRectNative(ctx, barX + 10, trackY, barW - 20, 12, 6);
          ctx.fillStyle = 'rgba(119, 125, 75, 0.18)';
          ctx.fill();

          const actW = Math.max(20, ((barW - 20) * cat.score) / 100);
          drawRoundedRectNative(ctx, barX + 10, trackY, actW, 12, 6);
          ctx.fillStyle = '#777D4B';
          ctx.fill();
          ctx.restore();
        });

        ctx.save();
        ctx.textAlign = 'center';
        ctx.font = "italic 400 28px 'Playfair Display', Georgia, serif";
        ctx.fillStyle = '#313B28';
        ctx.fillText('“Harmoni terkuat yang menjadi fondasi stabilitas hubungan kalian.”', 540, pY + 980);
        ctx.restore();

      } else {
        const quoteY = pY + 360;
        ctx.save();
        drawRoundedRectNative(ctx, 360, pY + 180, 360, 56, 28);
        ctx.fillStyle = 'rgba(255, 255, 255, 0.55)';
        ctx.fill();
        ctx.strokeStyle = 'rgba(119, 125, 75, 0.4)';
        ctx.lineWidth = 1.5;
        ctx.stroke();

        ctx.textAlign = 'center';
        ctx.font = "600 22px 'Inter', sans-serif";
        ctx.fillStyle = '#39442F';
        ctx.fillText(data.overallScore + '% COMPATIBILITY', 540, pY + 216);

        ctx.font = "400 160px 'Playfair Display', Georgia, serif";
        ctx.fillStyle = 'rgba(119, 125, 75, 0.28)';
        ctx.fillText('“', 540, quoteY);

        ctx.font = "italic 500 42px 'Playfair Display', Georgia, serif";
        ctx.fillStyle = '#26301D';
        const qText = '“Kalian memiliki kemampuan berbagi nilai inti yang seirama, menjadikan setiap perbedaan sebagai ruang bertumbuh bersama.”';
        const lines = wrapTextNative(ctx, qText, 780);
        lines.forEach((l, idx) => {
          ctx.fillText(l, 540, quoteY + 40 + idx * 64);
        });

        ctx.font = "400 24px 'Inter', sans-serif";
        ctx.fillStyle = 'rgba(42, 51, 34, 0.8)';
        ctx.fillText('— ' + data.nameA + ' & ' + data.nameB + ' —', 540, quoteY + 40 + lines.length * 64 + 60);
        ctx.restore();
      }

      // Footer
      ctx.save();
      ctx.textAlign = 'center';
      ctx.font = "italic 400 26px 'Playfair Display', Georgia, serif";
      ctx.fillStyle = 'rgba(42, 51, 34, 0.85)';
      ctx.fillText('“Build Your Life Together.”', 540, pY + pH - 120);

      ctx.font = "500 20px 'Inter', sans-serif";
      ctx.fillStyle = 'rgba(42, 51, 34, 0.65)';
      ctx.fillText('twogether.love', 540, pY + pH - 75);

      ctx.font = "italic 400 22px 'Playfair Display', Georgia, serif";
      ctx.fillStyle = 'rgba(255, 255, 255, 0.8)';
      ctx.fillText('Refleksi Hubungan Berdua • TWOgether', 540, 1760);
      ctx.restore();
    }

    function openShareModal(action) {
      document.getElementById('shareModal').classList.remove('hidden');
      renderHtmlStoryCanvas();
      if (action === 'download') {
        setTimeout(downloadHtmlStory, 300);
      }
    }

    function closeShareModal() {
      document.getElementById('shareModal').classList.add('hidden');
      const notice = document.getElementById('htmlShareNotice');
      if (notice) notice.classList.add('hidden');
    }

    function downloadHtmlStory() {
      const canvas = document.getElementById('htmlStoryCanvas');
      if (!canvas) return;
      const data = currentCachedReportData || buildReportData(COUPLE_PROFILES[activeCoupleKey]);
      const filename = 'twogether-' + (data.nameA + '-' + data.nameB).toLowerCase().replace(/[^a-z0-9]/g, '') + '-story.png';
      const link = document.createElement('a');
      link.download = filename;
      link.href = canvas.toDataURL('image/png', 1.0);
      link.click();

      const notice = document.getElementById('htmlShareNotice');
      if (notice) {
        notice.classList.remove('hidden');
        notice.innerHTML = '✅ <strong>Gambar Story (1080x1920) berhasil diunduh!</strong> Buka aplikasi Instagram di ponsel, buat Story baru, dan pilih gambar ini dari Galeri Anda.';
      }
    }

    async function shareHtmlStory() {
      const canvas = document.getElementById('htmlStoryCanvas');
      if (!canvas) return;
      const data = currentCachedReportData || buildReportData(COUPLE_PROFILES[activeCoupleKey]);
      const filename = 'twogether-' + (data.nameA + '-' + data.nameB).toLowerCase().replace(/[^a-z0-9]/g, '') + '-story.png';

      const notice = document.getElementById('htmlShareNotice');
      if (notice) notice.classList.add('hidden');

      try {
        canvas.toBlob(async function(blob) {
          if (!blob) return downloadHtmlStory();
          const file = new File([blob], filename, { type: 'image/png' });

          if (navigator.canShare && navigator.canShare({ files: [file] }) && navigator.share) {
            await navigator.share({
              title: 'Our TWOgether Story',
              text: 'Kecocokan kami di TWOgether mencapai ' + data.overallScore + '%!',
              files: [file]
            });
            if (notice) {
              notice.classList.remove('hidden');
              notice.innerHTML = '✨ <strong>Berhasil membuka menu bagikan!</strong> Pilih Instagram Story untuk langsung membagikan.';
            }
          } else {
            downloadHtmlStory();
          }
        }, 'image/png', 1.0);
      } catch (err) {
        downloadHtmlStory();
      }
    }
`;

// Insert the canvas engine code before `// Render Full Upgraded Report`
htmlContent = htmlContent.replace(
  '// Render Full Upgraded Report',
  `${jsCanvasCode}\n\n    // Render Full Upgraded Report`
);

// In `renderReportScreen()`, store `currentCachedReportData = data;`
htmlContent = htmlContent.replace(
  'const data = buildReportData(profile);',
  'const data = buildReportData(profile);\n      currentCachedReportData = data;'
);

fs.writeFileSync(htmlPath, htmlContent, 'utf8');
fs.writeFileSync(publicHtmlPath, htmlContent, 'utf8');
console.log('Successfully updated Instagram Story Share Card feature in twogether.html and public/index.html');

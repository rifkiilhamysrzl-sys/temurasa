const fs = require('fs');
const path = require('path');
const { ACTIVITY_LIBRARY } = require('../dist-test/activityLibrary.js');

const htmlPath = path.join(__dirname, '..', 'twogether.html');
const publicHtmlPath = path.join(__dirname, '..', 'public', 'index.html');

let htmlContent = fs.readFileSync(htmlPath, 'utf8');

// Format activity library for embedding in HTML
const libraryForHtml = ACTIVITY_LIBRARY.map((a) => ({
  id: a.activityId,
  cat: a.categoryCode,
  title: a.title,
  desc: a.baseDescription,
  instructions: a.instructions,
  benefit: a.expectedBenefit,
  duration: a.estimatedDuration,
  frequency: a.suggestedFrequency,
  relevantQuestions: a.relevantQuestions,
  tags: a.tags,
}));

// Create the script snippet to inject
const injectionCode = `
    // 70 ACTIVITIES LIBRARY FOR UPGRADED PERSONALIZED RECOMMENDATIONS
    const HTML_ACTIVITY_LIBRARY = ${JSON.stringify(libraryForHtml, null, 2)};

    function selectActivitiesForCategoryHtml(catCode, nameA, nameB, usedIds) {
      const templates = HTML_ACTIVITY_LIBRARY.filter(a => a.cat === catCode);
      const chosen = [];
      for (const t of templates) {
        if (!usedIds.has(t.id)) {
          chosen.push(t);
          usedIds.add(t.id);
          if (chosen.length === 3) break;
        }
      }
      if (chosen.length < 3) {
        for (const t of templates) {
          if (!chosen.some(c => c.id === t.id)) {
            chosen.push(t);
            usedIds.add(t.id);
            if (chosen.length === 3) break;
          }
        }
      }

      return chosen.map((t, idx) => {
        let intro = \`Karena \${nameA} dan \${nameB} memiliki keselarasan kuat di dimensi ini, aktivitas ini membantu memperkuat kebiasaan positif dan keintiman kalian.\`;
        if (catCode === 'future') {
          intro = \`Karena \${nameA} dan \${nameB} menunjukkan keselarasan tinggi dalam merancang masa depan, pemetaan ini membumikan cita-cita bersama ke dalam langkah praktis.\`;
        } else if (catCode === 'communication') {
          intro = \`Karena kalian menghargai percakapan terbuka, latihan ini menjaga kualitas saling mendengarkan tanpa distraksi harian.\`;
        } else if (catCode === 'financial') {
          intro = \`Karena kalian berdua memiliki kedewasaan transparansi finansial, aktivitas ini menguatkan perencanaan keuangan yang aman dan terarah.\`;
        } else if (catCode === 'lifestyle') {
          intro = \`Karena kalian peduli pada keseimbangan gaya hidup bersama dan ruang pribadi, aktivitas ini memadukan petualangan dan istirahat yang berkualitas.\`;
        } else if (catCode === 'family') {
          intro = \`Karena kalian berbagi nilai keluarga yang padu, diskusi ini merawat kesepakatan dan kehangatan rumah tangga mandiri.\`;
        } else if (catCode === 'emotional') {
          intro = \`Karena kalian peka terhadap rasa aman pasangan, aktivitas ini merawat kepekaan batin dan kasih sayang nyata setiap harinya.\`;
        } else if (catCode === 'conflict') {
          intro = \`Karena kalian mengutamakan dialog bermartabat, aktivitas ini menjaga agar setiap perbedaan diselesaikan secara elegan dan dewasa.\`;
        }
        return {
          id: t.id,
          title: t.title,
          intro: intro,
          instructions: t.instructions,
          benefit: t.benefit,
          duration: t.duration,
          frequency: t.frequency
        };
      });
    }

    function toggleHtmlActivity(id) {
      const el = document.getElementById(id);
      const icon = document.getElementById('icon-' + id);
      const btn = document.getElementById('btn-' + id);
      if (!el) return;
      if (el.classList.contains('hidden')) {
        el.classList.remove('hidden');
        if (icon) icon.innerText = '▲';
        if (btn) btn.innerText = 'Tutup Rincian ▲';
      } else {
        el.classList.add('hidden');
        if (icon) icon.innerText = '▼';
        if (btn) btn.innerText = 'Lihat Langkah demi Langkah ▼';
      }
    }
`;

// Insert the injectionCode right before function buildReportData(profile)
htmlContent = htmlContent.replace(
  'function buildReportData(profile) {',
  `${injectionCode}\n    function buildReportData(profile) {`
);

// Replace the old generic Section B rendering with the 3 distinct activity cards
const oldSectionB = `      // Section B: Strongest Connections
      const strContainer = document.getElementById('strongestContainer');
      strContainer.innerHTML = '';
      data.top3.forEach((c, idx) => {
        strContainer.innerHTML += \`
          <div class="rounded-2xl glass-card p-4 border-l-4 border-l-olive">
            <div class="flex items-center justify-between mb-1">
              <span class="text-xs font-bold text-olive uppercase">\${c.name} (\${c.score}%)</span>
              <span class="text-[10px] font-semibold px-2 py-0.5 rounded-full bg-olive/15 text-olive">Pilar #\${idx + 1}</span>
            </div>
            <p class="text-xs text-textDark/80 leading-relaxed mb-2">
              Kalian memiliki keselarasan intuisi dan kesepakatan prinsip yang sangat matang pada dimensi \${c.name}. Hal ini memberikan rasa aman emosional yang tinggi dalam hubungan.
            </p>
            <div class="p-2.5 rounded-xl bg-white/40 text-[11px] text-textDark/85">
              📅 <strong>Aktivitas:</strong> Luangkan waktu 15 menit untuk saling mengapresiasi kekompakan kalian di area \${c.name}.
            </div>
          </div>
        \`;
      });`;

const newSectionB = `      // Section B: Strongest Connections (Upgraded 3 Distinct Activities per Category)
      const strContainer = document.getElementById('strongestContainer');
      strContainer.innerHTML = '';
      const usedHtmlActivityIds = new Set();

      data.top3.forEach((c, idx) => {
        const activities = selectActivitiesForCategoryHtml(c.code, data.nameA, data.nameB, usedHtmlActivityIds);
        
        let actsHtml = '';
        activities.forEach((act, actIdx) => {
          const domId = 'html-act-' + idx + '-' + actIdx;
          actsHtml += \`
            <div class="rounded-xl bg-white/45 border border-white/60 p-3 text-textDark shadow-sm mb-2.5">
              <div class="flex items-start justify-between gap-2">
                <div>
                  <span class="text-[9px] font-mono font-bold tracking-wider uppercase text-olive bg-olive/10 px-1.5 py-0.5 rounded inline-block mb-1">
                    Aktivitas 0\${actIdx + 1}
                  </span>
                  <h6 class="font-serif-heading text-xs sm:text-sm font-semibold text-textDark">\${act.title}</h6>
                </div>
                <button type="button" onclick="toggleHtmlActivity('\${domId}')" class="text-olive p-1 hover:bg-white/60 rounded text-xs transition">
                  <span id="icon-\${domId}">▼</span>
                </button>
              </div>
              <p class="text-[11px] text-textDark/85 leading-relaxed mt-1.5 mb-2">
                \${act.intro}
              </p>
              <div class="flex flex-wrap items-center gap-2 mb-2 text-[10px] text-textDark/70 font-medium">
                <span class="px-2 py-0.5 rounded-full bg-white/60">⏱️ \${act.duration}</span>
                <span class="px-2 py-0.5 rounded-full bg-white/60">🔄 \${act.frequency}</span>
              </div>
              <div id="\${domId}" class="hidden pt-2 border-t border-white/40 mt-2 space-y-2 text-[11px]">
                <div>
                  <strong class="block text-[10px] uppercase font-bold text-olive mb-1">Panduan Praktis:</strong>
                  <ul class="space-y-1 pl-1">
                    \${act.instructions.map((step, sIdx) => \`
                      <li class="flex items-start gap-1.5 text-textDark/80">
                        <span class="w-3.5 h-3.5 rounded-full bg-olive/15 text-olive font-bold text-[9px] flex items-center justify-center shrink-0 mt-0.5">\${sIdx + 1}</span>
                        <span class="leading-snug">\${step}</span>
                      </li>
                    \`).join('')}
                  </ul>
                </div>
                <div class="p-2 rounded-lg bg-olive/10 border border-olive/20 text-[10px] text-textDark/90">
                  💡 <strong>Manfaat:</strong> \${act.benefit}
                </div>
              </div>
              <button id="btn-\${domId}" type="button" onclick="toggleHtmlActivity('\${domId}')" class="text-[10px] font-semibold text-olive hover:underline mt-1 inline-flex items-center gap-1">
                Lihat Langkah demi Langkah ▼
              </button>
            </div>
          \`;
        });

        strContainer.innerHTML += \`
          <div class="rounded-2xl glass-card p-4 sm:p-5 border-l-4 border-l-olive mb-4 shadow-sm">
            <div class="flex items-center justify-between mb-1.5">
              <span class="text-xs font-bold text-olive uppercase tracking-wider">\${c.icon} \${c.name} (\${c.score}%)</span>
              <span class="text-[10px] font-semibold px-2 py-0.5 rounded-full bg-olive/15 text-olive">Pilar #\${idx + 1}</span>
            </div>
            <p class="text-xs text-textDark/80 leading-relaxed mb-3">
              Kalian memiliki keselarasan intuisi dan kesepakatan prinsip yang sangat matang pada dimensi \${c.name}. Hal ini memberikan rasa aman emosional yang tinggi dalam hubungan.
            </p>
            <div class="pt-3 border-t border-white/40">
              <div class="flex items-center gap-1.5 mb-2.5">
                <span class="text-olive">✨</span>
                <h5 class="text-[11px] font-bold uppercase tracking-wider text-textDark">
                  3 Aktivitas untuk Terus Bertumbuh Bersama
                </h5>
              </div>
              <div class="flex flex-col">
                \${actsHtml}
              </div>
            </div>
          </div>
        \`;
      });`;

htmlContent = htmlContent.replace(oldSectionB, newSectionB);

fs.writeFileSync(htmlPath, htmlContent, 'utf8');
fs.writeFileSync(publicHtmlPath, htmlContent, 'utf8');
console.log('Successfully synced 70 activities and updated Section B in twogether.html and public/index.html');

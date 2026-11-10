const fs = require('fs');
const path = require('path');

const logoImgPath = path.join(__dirname, '..', 'public', 'temurasa-logo.png');
const logoBase64 = fs.readFileSync(logoImgPath).toString('base64');
const logoDataUri = `data:image/png;base64,${logoBase64}`;

const htmlPath = path.join(__dirname, '..', 'twogether.html');
const publicHtmlPath = path.join(__dirname, '..', 'public', 'index.html');

let htmlContent = fs.readFileSync(htmlPath, 'utf8');

// 1. Replace Top App Bar title
htmlContent = htmlContent.replace(
  '<span class="font-serif-heading font-bold text-sm tracking-wide text-textDark">TWOgether</span>',
  '<span class="font-serif-heading font-bold text-sm tracking-wide text-textDark">Temurasa</span>'
);

// 2. Replace Header in Screen 1 (Hero)
const oldHeroHeader = `<div class="flex items-center justify-between mb-4">
            <button onclick="alert('TWOgether — Build Your Life Together')" class="w-10 h-10 rounded-full flex items-center justify-center text-textDark/80 hover:bg-white/30" aria-label="Menu">
              <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8"><line x1="4" y1="12" x2="20" y2="12"></line><line x1="4" y1="6" x2="20" y2="6"></line><line x1="4" y1="18" x2="20" y2="18"></line></svg>
            </button>
            <h1 class="font-serif-heading text-2xl font-semibold tracking-wider text-textDark">TWOgether</h1>
            <!-- Profile icon removed per request, spacer keeps title centered -->
            <div class="w-10 h-10" aria-hidden="true"></div>
          </div>`;

const newHeroHeader = `<div class="flex items-center justify-between mb-4">
            <button onclick="alert('Temurasa — Titik Temu di Antara Dua Rasa')" class="w-10 h-10 rounded-full flex items-center justify-center text-textDark/80 hover:bg-white/30" aria-label="Menu">
              <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8"><line x1="4" y1="12" x2="20" y2="12"></line><line x1="4" y1="6" x2="20" y2="6"></line><line x1="4" y1="18" x2="20" y2="18"></line></svg>
            </button>
            <div class="flex-1 flex items-center justify-center">
              <img src="${logoDataUri}" alt="temurasa." class="h-8 w-auto object-contain" />
            </div>
            <!-- Profile icon removed per request, spacer keeps title centered -->
            <div class="w-10 h-10" aria-hidden="true"></div>
          </div>`;

htmlContent = htmlContent.replace(oldHeroHeader, newHeroHeader);

// 3. Replace Wording in Main Title & Subtitle
const oldWording = `<div class="mt-1 mb-2">
            <h2 class="font-serif-heading text-4xl sm:text-[42px] leading-[1.12] text-textDark font-medium">
              Are We<br>Compatible?
            </h2>
            <p class="text-sm text-textDark/80 mt-2.5 font-normal leading-relaxed">
              Tes kecocokan pasangan untuk memahami hubungan kalian lebih dalam.
            </p>
          </div>`;

const newWording = `<div class="mt-1 mb-2">
            <h2 class="font-serif-heading text-3xl sm:text-[38px] leading-[1.16] text-textDark font-medium">
              Temukan Titik Temu<br>di Antara Dua Rasa.
            </h2>
            <p class="text-xs sm:text-sm text-textDark/85 mt-2.5 font-normal leading-relaxed">
              <strong class="text-textDark">Temurasa</strong> adalah sebuah perjalanan untuk saling mengenal lebih dalam, memahami perbedaan, menemukan kesamaan, dan perlahan menyelaraskan arah. Ikut test di bawah ini untuk menemukan titik temu di antara dua rasa.
            </p>
          </div>`;

htmlContent = htmlContent.replace(oldWording, newWording);

// 4. Update Story Canvas text in html to "temurasa."
htmlContent = htmlContent.replace(
  "ctx.font = \"bold 34px 'Playfair Display', Georgia, serif\";\n      ctx.fillStyle = '#2D3525';\n      ctx.fillText('TWOgether', 540, 245);",
  "ctx.font = \"bold 38px 'Inter', sans-serif\";\n      ctx.fillStyle = '#2D3525';\n      ctx.fillText('temurasa.', 540, 245);"
);

htmlContent = htmlContent.replace(
  "Refleksi Hubungan Berdua • TWOgether",
  "Refleksi Hubungan Berdua • Temurasa"
);

// 5. Update HTML Title
htmlContent = htmlContent.replace(
  '<title>TWOgether — Couple Compatibility Platform</title>',
  '<title>Temurasa — Titik Temu di Antara Dua Rasa</title>'
);

fs.writeFileSync(htmlPath, htmlContent, 'utf8');
fs.writeFileSync(publicHtmlPath, htmlContent, 'utf8');

console.log('Successfully updated Temurasa logo and homepage wording in twogether.html and public/index.html');

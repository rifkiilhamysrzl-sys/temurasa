/**
 * TWOgether — Instagram Story Card Canvas Renderer (1080 x 1920 px)
 * High-resolution 9:16 static image generation optimized for Instagram Stories.
 * Respects Instagram Story safe zones (top ~180px, bottom ~260px).
 */

export interface StoryCardData {
  nameA: string;
  nameB: string;
  overallScore: number;
  topCategories: Array<{
    categoryName: string;
    score: number;
  }>;
  customQuote?: string;
  domain?: string;
}

export type StoryVariant = 'editorial' | 'connections' | 'quote';

/**
 * Helper to draw a rounded rectangle on Canvas 2D
 */
function drawRoundedRect(
  ctx: CanvasRenderingContext2D,
  x: number,
  y: number,
  width: number,
  height: number,
  radius: number
) {
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

/**
 * Helper to wrap text into multiple lines
 */
function wrapText(
  ctx: CanvasRenderingContext2D,
  text: string,
  maxWidth: number
): string[] {
  const words = text.split(' ');
  const lines: string[] = [];
  let currentLine = '';

  for (let i = 0; i < words.length; i++) {
    const word = words[i];
    const testLine = currentLine ? `${currentLine} ${word}` : word;
    const testWidth = ctx.measureText(testLine).width;

    if (testWidth > maxWidth && i > 0) {
      lines.push(currentLine);
      currentLine = word;
    } else {
      currentLine = testLine;
    }
  }

  if (currentLine) {
    lines.push(currentLine);
  }

  return lines;
}

/**
 * Main function: Renders the 1080x1920 Instagram Story Canvas
 */
export async function renderStoryCardToCanvas(
  canvas: HTMLCanvasElement,
  data: StoryCardData,
  variant: StoryVariant = 'connections'
): Promise<void> {
  const width = 1080;
  const height = 1920;

  canvas.width = width;
  canvas.height = height;

  const ctx = canvas.getContext('2d');
  if (!ctx) throw new Error('Could not get 2D canvas context');

  // Ensure fonts are ready
  try {
    if (typeof document !== 'undefined' && (document as any).fonts) {
      await (document as any).fonts.ready;
    }
  } catch (e) {
    // Ignore font loading errors; canvas will fall back cleanly
  }

  // 1. SCENIC BACKGROUND GRADIENT (Sage Green & Muted Blue Palette)
  const bgGrad = ctx.createLinearGradient(0, 0, 0, height);
  bgGrad.addColorStop(0.0, '#A4C3D2'); // Soft Sky Blue
  bgGrad.addColorStop(0.28, '#B8D3CE'); // Gentle Mist Seafoam
  bgGrad.addColorStop(0.65, '#9EAD91'); // Signature Background Sage
  bgGrad.addColorStop(1.0, '#758368'); // Deep Olive Ground
  ctx.fillStyle = bgGrad;
  ctx.fillRect(0, 0, width, height);

  // Soft atmospheric lighting glow at top center
  const sunGlow = ctx.createRadialGradient(540, 280, 20, 540, 280, 550);
  sunGlow.addColorStop(0, 'rgba(255, 255, 255, 0.45)');
  sunGlow.addColorStop(0.5, 'rgba(240, 235, 214, 0.18)');
  sunGlow.addColorStop(1, 'rgba(255, 255, 255, 0)');
  ctx.fillStyle = sunGlow;
  ctx.fillRect(0, 0, width, 850);

  // Decorative rolling hills silhouette
  ctx.save();
  ctx.fillStyle = 'rgba(255, 255, 255, 0.08)';
  ctx.beginPath();
  ctx.moveTo(0, 1500);
  ctx.bezierCurveTo(280, 1420, 680, 1580, width, 1480);
  ctx.lineTo(width, height);
  ctx.lineTo(0, height);
  ctx.closePath();
  ctx.fill();
  ctx.restore();

  // 2. HEADER: LOGO & SAFE ZONE COMPLIANT (y ~ 170 to 260)
  ctx.save();
  ctx.textAlign = 'center';

  // Interlocking couple rings emblem
  ctx.strokeStyle = 'rgba(255, 255, 255, 0.9)';
  ctx.lineWidth = 3.5;
  ctx.beginPath();
  ctx.arc(522, 190, 18, 0, Math.PI * 2);
  ctx.stroke();
  ctx.beginPath();
  ctx.arc(558, 190, 18, 0, Math.PI * 2);
  ctx.stroke();

  // Brand Name
  ctx.font = "bold 38px 'Inter', system-ui, sans-serif";
  ctx.fillStyle = '#2D3525';
  ctx.letterSpacing = '1px';
  ctx.fillText('temurasa.', 540, 245);

  // Subtitle
  ctx.font = "400 20px 'Inter', system-ui, sans-serif";
  ctx.fillStyle = 'rgba(45, 53, 37, 0.75)';
  ctx.letterSpacing = '3px';
  ctx.fillText('YOUR RELATIONSHIP STORY', 540, 275);
  ctx.restore();

  // 3. MAIN FROSTED GLASS PANEL (SAFE ZONE: y = 310, height = 1270)
  const panelX = 70;
  const panelY = 310;
  const panelW = 940;
  const panelH = 1260;
  const panelRadius = 52;

  ctx.save();
  // Drop shadow
  ctx.shadowColor = 'rgba(30, 42, 22, 0.14)';
  ctx.shadowBlur = 40;
  ctx.shadowOffsetY = 16;

  // Glass panel surface
  drawRoundedRect(ctx, panelX, panelY, panelW, panelH, panelRadius);
  ctx.fillStyle = 'rgba(255, 255, 255, 0.32)';
  ctx.fill();

  // Glass border
  ctx.shadowColor = 'transparent';
  ctx.lineWidth = 2.5;
  ctx.strokeStyle = 'rgba(255, 255, 255, 0.75)';
  ctx.stroke();
  ctx.restore();

  // 4. COUPLE NAMES (TOP OF CARD)
  ctx.save();
  ctx.textAlign = 'center';
  ctx.font = "italic 600 64px 'Playfair Display', Georgia, serif";
  ctx.fillStyle = '#2C3423';
  ctx.fillText(`${data.nameA} & ${data.nameB}`, 540, panelY + 110);

  // Small decorative line under names
  ctx.strokeStyle = 'rgba(119, 125, 75, 0.45)';
  ctx.lineWidth = 2;
  ctx.beginPath();
  ctx.moveTo(460, panelY + 135);
  ctx.lineTo(620, panelY + 135);
  ctx.stroke();
  ctx.restore();

  // 5. VARIANT SPECIFIC RENDERING
  if (variant === 'editorial') {
    // VARIANT A: MINIMAL EDITORIAL (Large Score, Clean Half-Gauge, Typography)
    const scoreY = panelY + 390;

    // Gauge Arc Background
    ctx.save();
    ctx.lineWidth = 20;
    ctx.lineCap = 'round';
    ctx.strokeStyle = 'rgba(255, 255, 255, 0.45)';
    ctx.beginPath();
    ctx.arc(540, scoreY - 20, 180, Math.PI, 0);
    ctx.stroke();

    // Gauge Arc Active Score
    const progress = Math.min(Math.max(data.overallScore / 100, 0), 1);
    const endAngle = Math.PI + Math.PI * progress;
    ctx.strokeStyle = '#777D4B'; // Olive
    ctx.beginPath();
    ctx.arc(540, scoreY - 20, 180, Math.PI, endAngle);
    ctx.stroke();
    ctx.restore();

    // Big Score Text
    ctx.save();
    ctx.textAlign = 'center';
    ctx.font = "bold 150px 'Playfair Display', Georgia, serif";
    ctx.fillStyle = '#2A3322';
    ctx.fillText(`${data.overallScore}%`, 540, scoreY + 20);

    ctx.font = "600 24px 'Inter', system-ui, sans-serif";
    ctx.fillStyle = 'rgba(42, 51, 34, 0.75)';
    ctx.letterSpacing = '5px';
    ctx.fillText('OVERALL COMPATIBILITY', 540, scoreY + 75);

    // Pill badge: Top Strength
    if (data.topCategories.length > 0) {
      const topCat = data.topCategories[0];
      const badgeY = scoreY + 140;
      drawRoundedRect(ctx, 240, badgeY, 600, 60, 30);
      ctx.fillStyle = 'rgba(255, 255, 255, 0.55)';
      ctx.fill();
      ctx.strokeStyle = 'rgba(119, 125, 75, 0.35)';
      ctx.lineWidth = 1.5;
      ctx.stroke();

      ctx.font = "500 22px 'Inter', system-ui, sans-serif";
      ctx.fillStyle = '#4A553E';
      ctx.letterSpacing = '1px';
      ctx.fillText(`Kekuatan Utama: ${topCat.categoryName} (${topCat.score}%)`, 540, badgeY + 38);
    }

    // Editorial Quotation
    const quoteY = scoreY + 310;
    ctx.font = "italic 400 36px 'Playfair Display', Georgia, serif";
    ctx.fillStyle = '#2E3726';
    const quoteLines = wrapText(
      ctx,
      '“Setiap hubungan adalah kisah istimewa yang bertumbuh lewat saling memahami.”',
      760
    );
    quoteLines.forEach((line, lIdx) => {
      ctx.fillText(line, 540, quoteY + lIdx * 52);
    });
    ctx.restore();

  } else if (variant === 'connections') {
    // VARIANT B: STRONGEST CONNECTIONS (Score + Top 3 Category Progress Bars)
    const scoreCenterY = panelY + 280;

    // Compact Score display
    ctx.save();
    ctx.textAlign = 'center';
    ctx.font = "bold 110px 'Playfair Display', Georgia, serif";
    ctx.fillStyle = '#2A3322';
    ctx.fillText(`${data.overallScore}%`, 540, scoreCenterY);

    ctx.font = "600 22px 'Inter', system-ui, sans-serif";
    ctx.fillStyle = 'rgba(42, 51, 34, 0.75)';
    ctx.letterSpacing = '4px';
    ctx.fillText('OVERALL COMPATIBILITY', 540, scoreCenterY + 45);

    // Section Title
    const secY = scoreCenterY + 130;
    ctx.font = "bold 22px 'Inter', system-ui, sans-serif";
    ctx.fillStyle = '#4E5A42';
    ctx.letterSpacing = '3px';
    ctx.fillText('YOUR STRONGEST CONNECTIONS', 540, secY);
    ctx.restore();

    // 3 Category Bars
    const barStartX = 150;
    const barWidth = 780;
    const barStartY = secY + 50;

    data.topCategories.slice(0, 3).forEach((cat, idx) => {
      const itemY = barStartY + idx * 135;

      // Card Container for each category
      ctx.save();
      drawRoundedRect(ctx, barStartX - 20, itemY - 10, barWidth + 40, 105, 24);
      ctx.fillStyle = 'rgba(255, 255, 255, 0.45)';
      ctx.fill();
      ctx.strokeStyle = 'rgba(255, 255, 255, 0.7)';
      ctx.lineWidth = 1.5;
      ctx.stroke();

      // Category Name
      ctx.textAlign = 'left';
      ctx.font = "600 24px 'Playfair Display', Georgia, serif";
      ctx.fillStyle = '#2C3423';
      ctx.fillText(cat.categoryName, barStartX + 10, itemY + 34);

      // Score Text
      ctx.textAlign = 'right';
      ctx.font = "bold 26px 'Playfair Display', Georgia, serif";
      ctx.fillStyle = '#777D4B';
      ctx.fillText(`${cat.score}%`, barStartX + barWidth - 10, itemY + 34);

      // Progress Track
      const trackY = itemY + 56;
      const trackH = 12;
      drawRoundedRect(ctx, barStartX + 10, trackY, barWidth - 20, trackH, 6);
      ctx.fillStyle = 'rgba(119, 125, 75, 0.18)';
      ctx.fill();

      // Active Progress
      const activeW = Math.max(20, ((barWidth - 20) * cat.score) / 100);
      drawRoundedRect(ctx, barStartX + 10, trackY, activeW, trackH, 6);
      ctx.fillStyle = '#777D4B';
      ctx.fill();
      ctx.restore();
    });

    // Supporting summary sentence
    ctx.save();
    ctx.textAlign = 'center';
    ctx.font = "italic 400 28px 'Playfair Display', Georgia, serif";
    ctx.fillStyle = '#313B28';
    ctx.fillText(
      '“Harmoni terkuat yang menjadi fondasi stabilitas hubungan kalian.”',
      540,
      panelY + 980
    );
    ctx.restore();

  } else {
    // VARIANT C: RELATIONSHIP QUOTE (Large Quote, Narrative Depth)
    const quoteCenterY = panelY + 360;

    // Small Score Badge at top
    ctx.save();
    drawRoundedRect(ctx, 360, panelY + 180, 360, 56, 28);
    ctx.fillStyle = 'rgba(255, 255, 255, 0.55)';
    ctx.fill();
    ctx.strokeStyle = 'rgba(119, 125, 75, 0.4)';
    ctx.lineWidth = 1.5;
    ctx.stroke();

    ctx.textAlign = 'center';
    ctx.font = "600 22px 'Inter', system-ui, sans-serif";
    ctx.fillStyle = '#39442F';
    ctx.letterSpacing = '2px';
    ctx.fillText(`${data.overallScore}% COMPATIBILITY`, 540, panelY + 216);
    ctx.restore();

    // Large decorative quotation mark
    ctx.save();
    ctx.textAlign = 'center';
    ctx.font = "400 160px 'Playfair Display', Georgia, serif";
    ctx.fillStyle = 'rgba(119, 125, 75, 0.28)';
    ctx.fillText('“', 540, quoteCenterY);
    ctx.restore();

    // The Quote Body
    ctx.save();
    ctx.textAlign = 'center';
    ctx.font = "italic 500 42px 'Playfair Display', Georgia, serif";
    ctx.fillStyle = '#26301D';

    const defaultQuote =
      data.customQuote ||
      'Kalian memiliki kemampuan berbagi nilai inti yang seirama, menjadikan setiap perbedaan sebagai ruang bertumbuh bersama.';

    const lines = wrapText(ctx, `"${defaultQuote}"`, 780);
    const startY = quoteCenterY + 40;
    lines.forEach((line, lIdx) => {
      ctx.fillText(line, 540, startY + lIdx * 64);
    });

    // Attribution
    const attrY = startY + lines.length * 64 + 60;
    ctx.font = "400 24px 'Inter', system-ui, sans-serif";
    ctx.fillStyle = 'rgba(42, 51, 34, 0.8)';
    ctx.letterSpacing = '3px';
    ctx.fillText(`— ${data.nameA} & ${data.nameB} —`, 540, attrY);
    ctx.restore();
  }

  // 6. CARD FOOTER & BRAND SIGNATURE (BOTTOM OF CARD)
  ctx.save();
  ctx.textAlign = 'center';

  // Supporting Quote
  ctx.font = "italic 400 26px 'Playfair Display', Georgia, serif";
  ctx.fillStyle = 'rgba(42, 51, 34, 0.85)';
  ctx.fillText('“Build Your Life Together.”', 540, panelY + panelH - 120);

  // Domain & Watermark
  const domain = data.domain || 'twogether.love';
  ctx.font = "500 20px 'Inter', system-ui, sans-serif";
  ctx.fillStyle = 'rgba(42, 51, 34, 0.65)';
  ctx.letterSpacing = '2px';
  ctx.fillText(domain, 540, panelY + panelH - 75);
  ctx.restore();

  // 7. BOTTOM SAFE ZONE WATERMARK (y ~ 1760)
  ctx.save();
  ctx.textAlign = 'center';
  ctx.font = "italic 400 22px 'Playfair Display', Georgia, serif";
  ctx.fillStyle = 'rgba(255, 255, 255, 0.8)';
  ctx.letterSpacing = '1px';
  ctx.fillText('Refleksi Hubungan Berdua • Temurasa', 540, 1760);
  ctx.restore();
}

/**
 * Converts a Canvas to a downloadable Blob
 */
export function canvasToBlob(
  canvas: HTMLCanvasElement,
  type = 'image/png',
  quality = 1.0
): Promise<Blob> {
  return new Promise((resolve, reject) => {
    canvas.toBlob(
      (blob) => {
        if (blob) resolve(blob);
        else reject(new Error('Canvas toBlob returned null'));
      },
      type,
      quality
    );
  });
}

/**
 * Triggers a native browser file download
 */
export function downloadCanvasImage(
  canvas: HTMLCanvasElement,
  filename = 'twogether-story.png'
): void {
  const dataUrl = canvas.toDataURL('image/png', 1.0);
  const link = document.createElement('a');
  link.download = filename;
  link.href = dataUrl;
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
}

/**
 * Web Share API: Shares the generated canvas image directly as a file.
 * Returns true if shared natively, false if unsupported.
 */
export async function shareStoryImage(
  canvas: HTMLCanvasElement,
  filename: string,
  shareTitle: string,
  shareText: string
): Promise<{ success: boolean; sharedNatively: boolean; error?: string }> {
  try {
    const blob = await canvasToBlob(canvas);
    const file = new File([blob], filename, { type: 'image/png' });

    // Check if navigator.canShare supports files
    if (
      typeof navigator !== 'undefined' &&
      navigator.canShare &&
      navigator.canShare({ files: [file] }) &&
      navigator.share
    ) {
      await navigator.share({
        title: shareTitle,
        text: shareText,
        files: [file],
      });
      return { success: true, sharedNatively: true };
    }

    // Fallback: file sharing not supported natively (e.g. desktop)
    downloadCanvasImage(canvas, filename);
    return { success: true, sharedNatively: false };
  } catch (err: any) {
    if (err.name === 'AbortError') {
      // User cancelled the share dialog
      return { success: false, sharedNatively: false, error: 'Dibatalkan oleh pengguna.' };
    }
    // Attempt download fallback
    try {
      downloadCanvasImage(canvas, filename);
      return { success: true, sharedNatively: false };
    } catch (dlErr: any) {
      return { success: false, sharedNatively: false, error: err.message };
    }
  }
}

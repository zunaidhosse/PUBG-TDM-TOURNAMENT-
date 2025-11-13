import html2canvas from 'https://esm.sh/html2canvas@1.4.1';

export function setupDownload({ captureSelector, grid, fileName }) {
  const dl = document.getElementById('download-bracket-btn');
  if (!dl) return;

  dl.onclick = async () => {
    const captureEl = document.querySelector(captureSelector);
    if (!captureEl) return;

    const gridEl = grid || captureEl.querySelector('#bracket-grid');
    if (!gridEl) return;

    // Preserve original styles
    const originalOverflow = captureEl.style.overflow;
    const originalTransform = gridEl.style.transform;
    const originalTransformOrigin = gridEl.style.transformOrigin;

    // Slightly shrink for full-fit and ensure nothing gets clipped
    const captureScale = 0.85;
    captureEl.style.overflow = 'visible';
    gridEl.style.transformOrigin = 'top left';
    gridEl.style.transform = `scale(${captureScale})`;

    // Compute dimensions from the full grid content to avoid cuts
    const rawWidth = Math.max(gridEl.scrollWidth, captureEl.scrollWidth);
    const rawHeight = Math.max(gridEl.scrollHeight, captureEl.scrollHeight);
    const width = Math.ceil(rawWidth * captureScale);
    const height = Math.ceil(rawHeight * captureScale);

    try {
      const canvas = await html2canvas(captureEl, {
        backgroundColor: '#12121c',
        scale: 2,                // high-res output
        width,
        height,
        windowWidth: width,
        windowHeight: height,
        removeContainer: true,
        useCORS: true
      });
      const link = document.createElement('a');
      link.download = fileName;
      link.href = canvas.toDataURL('image/png');
      document.body.appendChild(link);
      link.click();
      link.remove();
    } catch (e) {
      console.error('Download failed', e);
      alert('Download failed. Try again.');
    } finally {
      // Restore styles
      captureEl.style.overflow = originalOverflow;
      gridEl.style.transform = originalTransform;
      gridEl.style.transformOrigin = originalTransformOrigin;
    }
  };
}


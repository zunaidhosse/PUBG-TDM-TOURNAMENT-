import { db } from '../../core/firebase.js';
import { toast } from './toast.js';

export function initUCAdmin() {
  const offerIn = document.getElementById('uc-offer-input');
  const addOfferBtn = document.getElementById('uc-add-offer-btn');
  const offersList = document.getElementById('uc-offers-list');
  const addPkgBtn = document.getElementById('uc-add-pkg-btn');
  const pkgUC = document.getElementById('uc-pkg-uc');
  const pkgBonus = document.getElementById('uc-pkg-bonus');
  const pkgBDT = document.getElementById('uc-pkg-bdt');
  const pkgSAR = document.getElementById('uc-pkg-sar');
  const pkgList = document.getElementById('uc-packages-admin');
  const noticeIn = document.getElementById('uc-bottom-notice');
  const saveNoticeBtn = document.getElementById('uc-save-notice-btn');
  const imgTitleIn = document.getElementById('uc-img-title');
  const imgUrlIn = document.getElementById('uc-img-url');
  const addImgBtn = document.getElementById('uc-add-img-btn');
  const imgList = document.getElementById('uc-images-admin');

  const ref = db().ref('uc');

  ref.on('value', s => {
    const v = s.val() || {};
    // Offers
    if (offersList) {
      offersList.innerHTML = '';
      const arr = Array.isArray(v.offers) ? v.offers : [];
      if (!arr.length) { offersList.innerHTML = '<div class=\"registration-card\">No offers</div>'; }
      arr.forEach((t, i) => {
        const div = document.createElement('div');
        div.className = 'registration-card';
        div.innerHTML = `<div style=\"display:flex;justify-content:space-between;align-items:center;gap:8px;\">
          <span>${t}</span>
          <button class=\"btn btn-danger\">Delete</button>
        </div>`;
        div.querySelector('.btn-danger').addEventListener('click', async () => {
          const next = arr.filter((_,idx)=> idx!==i);
          try { await ref.child('offers').set(next); toast('success','Offer removed'); } catch { toast('danger','Failed'); }
        });
        offersList.appendChild(div);
      });
    }
    // Packages
    if (pkgList) {
      pkgList.innerHTML = '';
      const pkgs = Array.isArray(v.packages) ? v.packages : [];
      if (!pkgs.length) { pkgList.innerHTML = '<div class=\"registration-card\">No packages</div>'; }
      pkgs.forEach((p, i) => {
        const div = document.createElement('div');
        div.className = 'registration-card';
        div.innerHTML = `<h4>${p.uc} UC + ${p.bonus} Bonus</h4><p>BDT ${p.bdt} / SAR ${p.sar}</p><button class=\"btn btn-danger\">Delete</button>`;
        div.querySelector('.btn-danger').addEventListener('click', async () => {
          const next = pkgs.filter((_,idx)=> idx!==i);
          try { await ref.child('packages').set(next); toast('success','Package removed'); } catch { toast('danger','Failed'); }
        });
        pkgList.appendChild(div);
      });
    }
    // Notice
    if (noticeIn) noticeIn.value = v.notice || '';
    // Images (gallery)
    if (imgList) {
      imgList.innerHTML = '';
      const imgs = Array.isArray(v.images) ? v.images.slice().sort((a,b)=>(b.ts||0)-(a.ts||0)) : [];
      if (!imgs.length) { imgList.innerHTML = '<div class="registration-card">No images</div>'; }
      imgs.forEach((it, i) => {
        const div = document.createElement('div');
        div.className = 'registration-card';
        div.innerHTML = `<img src="${it.url}" style="width:100%;border-radius:6px;margin-bottom:8px;"><h4>${it.title||'Untitled'}</h4><button class="btn btn-danger">Remove</button>`;
        div.querySelector('.btn-danger').addEventListener('click', async () => {
          const next = imgs.filter((_,idx)=> idx!==i);
          try { await ref.child('images').set(next); toast('success','Image removed'); } catch { toast('danger','Failed'); }
        });
        imgList.appendChild(div);
      });
    }
  });

  if (addOfferBtn) {
    addOfferBtn.addEventListener('click', async () => {
      const t = (offerIn?.value || '').trim();
      if (!t) return toast('danger','Enter offer text');
      try {
        const snap = await ref.child('offers').once('value');
        const arr = Array.isArray(snap.val()) ? snap.val() : [];
        arr.push(t);
        await ref.child('offers').set(arr);
        offerIn.value = '';
        toast('success','Offer added');
      } catch { toast('danger','Failed'); }
    });
  }

  if (addPkgBtn) {
    addPkgBtn.addEventListener('click', async () => {
      const payload = {
        uc: Number(pkgUC?.value || 0),
        bonus: Number(pkgBonus?.value || 0),
        bdt: Number(pkgBDT?.value || 0),
        sar: Number(pkgSAR?.value || 0),
      };
      if (!payload.uc || !payload.bdt || !payload.sar) return toast('danger','Fill UC, BDT and SAR');
      try {
        const snap = await ref.child('packages').once('value');
        const arr = Array.isArray(snap.val()) ? snap.val() : [];
        arr.push(payload);
        await ref.child('packages').set(arr);
        ['uc-pkg-uc','uc-pkg-bonus','uc-pkg-bdt','uc-pkg-sar'].forEach(id=>{ const el=document.getElementById(id); if (el) el.value=''; });
        toast('success','Package added');
      } catch { toast('danger','Failed'); }
    });
  }

  if (saveNoticeBtn) {
    saveNoticeBtn.addEventListener('click', async () => {
      try { await ref.child('notice').set((noticeIn?.value || '').trim()); toast('success','Notice saved'); } catch { toast('danger','Failed'); }
    });
  }
  if (addImgBtn) {
    addImgBtn.addEventListener('click', async () => {
      const title = (imgTitleIn?.value || '').trim();
      const url = (imgUrlIn?.value || '').trim();
      if (!url) return toast('danger','Enter image URL');
      try {
        const snap = await ref.child('images').once('value');
        const arr = Array.isArray(snap.val()) ? snap.val() : [];
        arr.push({ title, url, ts: Date.now() });
        await ref.child('images').set(arr);
        if (imgTitleIn) imgTitleIn.value = ''; if (imgUrlIn) imgUrlIn.value = '';
        toast('success','Image added');
      } catch { toast('danger','Failed'); }
    });
  }
}
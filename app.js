/**
 * OpusPanel Corporate Experience Controller
 * Handles solution tabs, interactive PDF-to-slide presentation,
 * native dialog light-dismiss fallbacks, Opus APPO video chapters,
 * and tailored WhatsApp demo brief generation.
 */

(() => {
  'use strict';

  const prefersReducedMotion = () =>
    window.matchMedia('(prefers-reduced-motion: reduce)').matches;

  /* ------------------------------------------------------------------------
     1. Dialog Light-Dismiss Fallback (for Safari / browsers without closedby)
     ------------------------------------------------------------------------ */
  function attachLightDismissFallback(dialog) {
    if (!dialog || 'closedBy' in HTMLDialogElement.prototype) return;

    dialog.addEventListener('click', (event) => {
      if (event.target !== dialog) return;
      const rect = dialog.getBoundingClientRect();
      const insideContent =
        rect.top <= event.clientY &&
        event.clientY <= rect.top + rect.height &&
        rect.left <= event.clientX &&
        event.clientX <= rect.left + rect.width;

      if (!insideContent) {
        dialog.close();
      }
    });
  }

  /* ------------------------------------------------------------------------
     2. Shrinking Header Fallback (when CSS scroll-timeline is unsupported)
     ------------------------------------------------------------------------ */
  const siteHeader = document.getElementById('siteHeader');
  if (siteHeader && !CSS.supports('(animation-timeline: scroll()) and (animation-range: 0% 100%)')) {
    const syncHeaderState = () => {
      siteHeader.classList.toggle('is-scrolled', window.scrollY > 40);
    };
    window.addEventListener('scroll', syncHeaderState, { passive: true });
    syncHeaderState();
  }

  /* ------------------------------------------------------------------------
     3. Mobile Navigation Drawer
     ------------------------------------------------------------------------ */
  const mobileDrawer = document.getElementById('mobileDrawer');
  const openMenuBtn = document.getElementById('openMobileMenu');
  const closeMenuBtn = document.getElementById('closeMobileMenu');

  if (mobileDrawer && openMenuBtn) {
    attachLightDismissFallback(mobileDrawer);

    openMenuBtn.addEventListener('click', () => {
      mobileDrawer.showModal();
      openMenuBtn.setAttribute('aria-expanded', 'true');
    });

    closeMenuBtn?.addEventListener('click', () => mobileDrawer.close());

    mobileDrawer.addEventListener('close', () => {
      openMenuBtn.setAttribute('aria-expanded', 'false');
    });

    mobileDrawer.querySelectorAll('[data-drawer-link]').forEach((link) => {
      link.addEventListener('click', () => mobileDrawer.close());
    });
  }

  /* ------------------------------------------------------------------------
     4. Five-Solution Interactive Tab Explorer
     ------------------------------------------------------------------------ */
  const solutionTabs = Array.from(document.querySelectorAll('.solution-tab[role="tab"]'));
  const solutionPanels = Array.from(document.querySelectorAll('.blueprint-panel[role="tabpanel"]'));

  function activateSolution(key, shouldFocusTab = false) {
    solutionTabs.forEach((tab) => {
      const isMatch = tab.dataset.solution === key;
      tab.setAttribute('aria-selected', String(isMatch));
      tab.tabIndex = isMatch ? 0 : -1;
      if (isMatch && shouldFocusTab) {
        tab.focus();
      }
    });

    solutionPanels.forEach((panel) => {
      panel.hidden = panel.id !== `panel-${key}`;
    });
  }

  if (solutionTabs.length > 0) {
    // Initialize roving tabindex
    solutionTabs.forEach((tab) => {
      const active = tab.getAttribute('aria-selected') === 'true';
      tab.tabIndex = active ? 0 : -1;

      tab.addEventListener('click', () => {
        activateSolution(tab.dataset.solution);
      });

      tab.addEventListener('keydown', (event) => {
        const idx = solutionTabs.indexOf(tab);
        let nextIdx = -1;

        if (event.key === 'ArrowRight' || event.key === 'ArrowDown') {
          nextIdx = (idx + 1) % solutionTabs.length;
        } else if (event.key === 'ArrowLeft' || event.key === 'ArrowUp') {
          nextIdx = (idx - 1 + solutionTabs.length) % solutionTabs.length;
        } else if (event.key === 'Home') {
          nextIdx = 0;
        } else if (event.key === 'End') {
          nextIdx = solutionTabs.length - 1;
        }

        if (nextIdx >= 0) {
          event.preventDefault();
          activateSolution(solutionTabs[nextIdx].dataset.solution, true);
        }
      });
    });

    document.querySelectorAll('[data-jump-solution]').forEach((trigger) => {
      trigger.addEventListener('click', () => {
        activateSolution(trigger.dataset.jumpSolution);
      });
    });
  }

  /* ------------------------------------------------------------------------
     5. Interactive 9-Slide Presentation Deck (PDF -> Slide Stage)
     ------------------------------------------------------------------------ */
  const SLIDES = [
    {
      index: 1,
      tag: '01 / 09 • BACKOFFICE + MOBİL EKOSİSTEM',
      title: 'Ofisten Sahaya Tek Omurga',
      summary:
        'Merkez ofiste 14 kurumsal modül ve 17+ canlı rapor içeren Web & Masaüstü Backoffice ile planlayın; sahada ise pahalı el terminalleri yerine çalışanların telefon kamerasıyla okutup %100 envanter mutabakatı sağlayın.',
      solutions: ['Opus ERP', 'Opus DSS'],
      primaryDemo: 'Opus ERP',
      highlights: [
        '14 Kurumsal Modül: CRM, MRP, Depo, Üretim, Finans, Muhasebe, Kalite & İ.S.G.',
        '0 ₺ El Terminali Maliyeti: Mevcut Android & iOS telefon kamerasıyla saniyede DataMatrix.',
        '%100 Envanter Mutabakatı: Stok geçmişi ile birebir eşitlik (966 = 966).',
        '17+ Canlı Yönetici Raporu ve aktif hatlarda %92,6 OEE izlenebilirliği.'
      ]
    },
    {
      index: 2,
      tag: '02 / 09 • UÇTAN UCA SÜREÇ AKIŞI',
      title: 'Ofiste Planla & Yönet, Sahada Kamerayla Uygula',
      summary:
        'Opus ERP yalnızca bir mobil uygulama değildir. Müşteri teklifi ve satınalma siparişinden mal kabule, 4 aşamalı kaliteden üretim iş emirlerine, sevkiyat ve satış sonrası yetkili servise kadar 7 adımı tek veri omurgası üzerinde iki operasyon katmanıyla birleştirir.',
      solutions: ['Opus CRM', 'Opus ERP', 'Opus ASM'],
      primaryDemo: 'Opus CRM',
      highlights: [
        '1. CRM, Teklif, Sipariş & MRP: Tekliften eşik stok satınalma ihtiyaçlarına merkezî yönetim.',
        '2–3. Mal Kabul & 4 Aşamalı Kalite: Kapıda tekil parti/koli etiketi ve mobil D.Ö.F. süreci.',
        '4–5. Kameralı Hat Besleme & İş Emri: Lazer, abkant ve montaj hatlarına sıfır hata transfer.',
        '6–7. Sevkiyat, Finans & Satış Sonrası: Otomatik muhasebe tesellümü ve garanti/servis yönetimi.'
      ]
    },
    {
      index: 3,
      tag: '03 / 09 • SIFIR EL TERMİNALİ YATIRIMI',
      title: 'Pahalı El Terminali Yok: Mevcut Telefonunuz Yeterli',
      summary:
        'Yüksek bütçeli el terminalleri, kırılan ekranlar ve cihaz lisans maliyetleri geride kaldı. Android ve iOS telefon kamerası endüstriyel hızda DataMatrix ve QR okuyucuya dönüşür.',
      solutions: ['Opus ERP'],
      primaryDemo: 'Opus ERP',
      highlights: [
        'Seri Okuma Modu: Operatör ekrana tekrar dokunmadan kolileri peş peşe sesli/görsel onayla tarar.',
        'Akıllı Koli Bölme: Kolinin bir kısmı üretime giderse otomatik alt koli etiketi (KL-260499) üretir.',
        'Karanlık Depoda Flaşlı Vizör: Yüksek raflar ve loş ambarlarda kesintisiz okuma.',
        'Hatalı Okumaya Kilit: Yanlış ürün, mükerrer koli veya karantina stoğunu anında engeller.'
      ]
    },
    {
      index: 4,
      tag: '04 / 09 • ÜRETİM & KALİTE MÜHENDİSLİĞİ',
      title: 'Reçete (BOM) Disiplini ve 4 Katmanlı Kalite Kalkanı',
      summary:
        'Canlı İş Emri Kokpiti (IE-2026-0841) ile planlanan, üretilen, kalan ve fire adetleri operatör ekranında canlı takip edilir; kalite hammadde girişinden palet sevkiyatına kadar 4 aşamada mühürlenir.',
      solutions: ['Opus ERP'],
      primaryDemo: 'Opus ERP',
      highlights: [
        'Reçete (BOM) & Hat Yeterliliği: Paslanmaz sac, rezistans ve temperli cam için anlık stok hesabı.',
        'Tek Tuşla Eksik Malzeme Talebi: Hat stoğu eksildiğinde anında MTR transfer emri açılır.',
        'Duruş & OEE Analizi: Kalıp değişimi, bakım ve malzeme bekleme süreleri neden kodlarıyla kaydedilir.',
        '4 Aşamalı Kalite: 1. Giriş, 2. Üretim İçi, 3. Döngüsel, 4. Fotoğraflı Final & Palet Onayı.'
      ]
    },
    {
      index: 5,
      tag: '05 / 09 • WEB & MASAÜSTÜ BACKOFFICE EKRANI',
      title: '14 Kurumsal Modül, Akıllı Matris Grid & Canlı Envanter',
      summary:
        'Tarayıcıdan veya kurulu masaüstü uygulamasından çalışan Backoffice; soldaki 14 departmanlı ağaç menüden çoklu sekmeli Envanter Yönetimi matrisine kadar tek platformda hız sunar.',
      solutions: ['Opus ERP', 'Opus CRM', 'Opus ASM'],
      primaryDemo: 'Opus ERP',
      highlights: [
        '14 Ana Departman Tek Menüde: Hızlı Menü Ara ile saniyede modül ve ekran erişimi.',
        'Excel Freeze Panes & Akıllı Süzgeç: K (Kalite) ve R (Rezervasyon) rozetleriyle anlık stok kilidi.',
        'Çoklu Sekme + Dirty Guard: Kaydedilmemiş veri varken yanlışlıkla sekme kapatma/F5 koruması.',
        'Açık / Koyu Tema Desteği ile yoğun masaüstü operasyonlarında göz yormayan arayüz.'
      ]
    },
    {
      index: 6,
      tag: '06 / 09 • KARAR DESTEK & İŞ ZEKÂSI MERKEZİ',
      title: 'Tahmine Dayalı Yönetim Biter: 17+ Canlı ERP Raporu',
      summary:
        'Sahadaki her koli okutma, üretim sarfı, fire ve tahsilat hareketi anında yönetici raporlarına dönüşür. Excel dosyaları birleştirmeden fabrikanın nabzını tek kokpitte görün.',
      solutions: ['Opus DSS', 'Opus CRM'],
      primaryDemo: 'Opus DSS',
      highlights: [
        'Finans, Bütçe & Maliyet Zekâsı (5 Rapor): Bütçe sapması, canlı stok maliyeti, tahsilat ve ciro.',
        'Üretim, MPS & Verimlilik (5 Rapor): Kapasite/termin uyumu (%98,4), fire (%0,8) ve OEE (%92,6).',
        'Tedarik & Ticaret Geçmişi (6 Rapor): Sevkiyat, alış fiyat değişimi, backorder ve iade karar izi.',
        'Tam Denetim İzi (Audit Trail): Gerçek operatör adıyla kayıt geçmişi ve tek tık Excel/PDF çıktı.'
      ]
    },
    {
      index: 7,
      tag: '07 / 09 • CANLI STOK GEÇMİŞİ & RAPORLAR',
      title: 'Her Koli Hareketi Kayıt Altında: Envanter ile %100 Eşit',
      summary:
        'Sol menüde 17 canlı rapor açıkken sağdaki Stok Geçmişi ekranı; mal kabulden paletlemeye, koli bölmeden (KL-260499) sevkiyata kadar her adımı Envanter ile 966 = 966 eşitliğinde sunar.',
      solutions: ['Opus ERP', 'Opus DSS'],
      primaryDemo: 'Opus DSS',
      highlights: [
        'Net Hareket = Envanter (966 = 966): Giriş (+2.740) ve çıkış (−1.774) cebirsel toplamı daima eşit.',
        '7 = 7 Stok Kalemi, 8 = 8 Koli ve 7 = 7 Palet Eşleşmesi ile tam defter bütünlüğü.',
        'Koli Bölme İzlenebilirliği: KL-260418 kolisinden ayrılan 250 Kg yeni alt kolisiyle birlikte görünür.',
        'Tüm 17 raporda Başlangıç–Bitiş tarih aralığı ve kolon bazlı çoklu süzgeç.'
      ]
    },
    {
      index: 8,
      tag: '08 / 09 • MUTABAKAT MİMARİSİ',
      title: 'Backoffice ve Mobil Sahada Aynı Saniyede Aynı Rakam',
      summary:
        'Stok Geçmişi sistemin tek gerçek kaynağıdır; Envanter Yönetimi ve Mobil Envanter Sorgulama bu defterin anlık izdüşümüdür. Matematiksel koruma yasalarıyla fark oluşması engellenir.',
      solutions: ['Opus ERP', 'Opus DSS'],
      primaryDemo: 'Opus ERP',
      highlights: [
        'Tek Koli = Tek Lokasyon Kuralı: Fiziksel koli aynı anda iki rafta görünemez; kaynak sıfırlanır.',
        'Kütle Korunumu (ΔQ = 0) & Hayalet Hareket Yasağı: Sıfırlı kayıt veya eksi stok asla oluşmaz.',
        'Cebirsel İz Örneği (KL-260418): Mal kabulden parça bölme adımına kadar 5 adımlı şeffaf defter.',
        'Sipariş Rezervasyon Koruması: SIP-2026-1128 kilidi hem masaüstünde hem mobilde anlık görünür.'
      ]
    },
    {
      index: 9,
      tag: '09 / 09 • SATIŞ SONRASI & KURUMSAL BAŞLANGIÇ',
      title: 'Üretim Sevkiyatla Bitmez: Montaj, Garanti & Yetkili Servis',
      summary:
        'Endüstriyel mutfak ve makine projelerinde marka sadakati kurulum ve teknik servis kalitesiyle oluşur. Opus ASM servis masası, üretilen her cihazı garanti ve saha servis süreçleriyle birleştirir.',
      solutions: ['Opus ASM', 'Opus ERP'],
      primaryDemo: 'Opus ASM',
      highlights: [
        'Montaj & Kurulum Yönetimi: Müşteri lokasyonunda kurulum talepleri, ekip yönlendirme ve teslim tutanağı.',
        'Garanti & Seri No Sicili: Hangi parti hammaddeyle ve hangi hatta üretildiğini saniyede sorgulama.',
        'Yetkili Servis & Yedek Parça: Değişen rezistans/valf parçalarının doğrudan stok ve maliyetten takibi.',
        'Fabrikanızda 15 Dakikalık Canlı Demo ile kendi ürün reçeteleriniz üzerinden test imkânı.'
      ]
    }
  ];

  const scroller = document.getElementById('slidesScroller');
  const slideItems = Array.from(document.querySelectorAll('.slide-item'));
  const thumbBtns = Array.from(document.querySelectorAll('.thumb-btn[data-thumb-slide]'));
  const quickFilterBtns = Array.from(document.querySelectorAll('.deck-filter-btn[data-jump-slide]'));
  const prevSlideBtn = document.getElementById('prevSlideBtn');
  const nextSlideBtn = document.getElementById('nextSlideBtn');
  const counterEl = document.getElementById('slideCounter');
  const progressEl = document.getElementById('slideProgress');
  const toggleAutoplayBtn = document.getElementById('toggleAutoplayBtn');
  const openLightboxBtn = document.getElementById('openLightboxBtn');
  const heroOpenDeck = document.getElementById('heroOpenDeck');

  const briefTagEl = document.getElementById('briefTag');
  const briefSolutionsEl = document.getElementById('briefSolutions');
  const briefTitleEl = document.getElementById('briefTitle');
  const briefSummaryEl = document.getElementById('briefSummary');
  const briefHighlightsEl = document.getElementById('briefHighlights');
  const briefZoomBtn = document.getElementById('briefZoomBtn');
  const briefDemoBtn = document.getElementById('briefDemoBtn');

  const lightbox = document.getElementById('slideLightbox');
  const lightboxBody = document.getElementById('lightboxBody');
  const lightboxImg = document.getElementById('lightboxImg');
  const lightboxCounter = document.getElementById('lightboxCounter');
  const lightboxTitle = document.getElementById('lightboxTitle');
  const zoomBtns = Array.from(document.querySelectorAll('.zoom-pill[data-zoom-mode]'));
  const lightboxCloseBtn = document.getElementById('lightboxCloseBtn');
  const lightboxPrevBtn = document.getElementById('lightboxPrevBtn');
  const lightboxNextBtn = document.getElementById('lightboxNextBtn');

  let activeSlide = 1;
  let autoplayTimer = null;

  function formatSlideNum(n) {
    return String(n).padStart(2, '0');
  }

  function renderSlideState(slideIndex) {
    const safeIdx = Math.max(1, Math.min(SLIDES.length, slideIndex));
    activeSlide = safeIdx;
    const data = SLIDES[safeIdx - 1];

    if (counterEl) counterEl.textContent = `${formatSlideNum(safeIdx)} / 09`;
    if (progressEl) progressEl.value = safeIdx;

    if (prevSlideBtn) prevSlideBtn.disabled = safeIdx === 1;
    if (nextSlideBtn) nextSlideBtn.disabled = safeIdx === SLIDES.length;

    // Update snapped marker & thumbnail states
    slideItems.forEach((item) => {
      item.classList.toggle('is-snapped', Number(item.dataset.slideIndex) === safeIdx);
    });

    thumbBtns.forEach((btn) => {
      const isCurrent = Number(btn.dataset.thumbSlide) === safeIdx;
      if (isCurrent) {
        btn.setAttribute('aria-current', 'true');
      } else {
        btn.removeAttribute('aria-current');
      }
    });

    quickFilterBtns.forEach((btn) => {
      const target = Number(btn.dataset.jumpSlide);
      const isPressed = target === safeIdx || (target === 6 && safeIdx === 7);
      btn.setAttribute('aria-pressed', String(isPressed));
    });

    // Update synchronized brief panel
    if (briefTagEl) briefTagEl.textContent = data.tag;
    if (briefTitleEl) briefTitleEl.textContent = data.title;
    if (briefSummaryEl) briefSummaryEl.textContent = data.summary;

    if (briefSolutionsEl) {
      briefSolutionsEl.replaceChildren(
        ...data.solutions.map((name) => {
          const span = document.createElement('span');
          span.className = 'sol-tag';
          span.textContent = name;
          return span;
        })
      );
    }

    if (briefHighlightsEl) {
      briefHighlightsEl.replaceChildren(
        ...data.highlights.map((text) => {
          const li = document.createElement('li');
          const dot = document.createElement('span');
          dot.className = 'slide-bullet-dot';
          dot.setAttribute('aria-hidden', 'true');
          const copy = document.createElement('span');
          copy.textContent = text;
          li.append(dot, copy);
          return li;
        })
      );
    }

    if (briefDemoBtn) {
      briefDemoBtn.dataset.selectDemo = data.primaryDemo;
      briefDemoBtn.textContent = `${data.primaryDemo} İçin Demo Planla`;
    }

    // Keep lightbox synchronized if open
    if (lightbox?.open) {
      updateLightboxContent(safeIdx);
    }
  }

  function goToSlide(slideIndex, { scrollSection = false } = {}) {
    const targetIdx = Math.max(1, Math.min(SLIDES.length, slideIndex));
    const targetEl = slideItems[targetIdx - 1];

    if (scrollSection) {
      document.getElementById('slayt-sunumu')?.scrollIntoView({
        behavior: prefersReducedMotion() ? 'auto' : 'smooth'
      });
    }

    if (scroller && targetEl) {
      scroller.scrollTo({
        left: targetEl.offsetLeft,
        behavior: prefersReducedMotion() ? 'auto' : 'smooth'
      });
    }

    renderSlideState(targetIdx);
  }

  function stopAutoplay() {
    if (autoplayTimer) {
      clearInterval(autoplayTimer);
      autoplayTimer = null;
    }
    if (toggleAutoplayBtn) {
      toggleAutoplayBtn.setAttribute('aria-pressed', 'false');
      toggleAutoplayBtn.textContent = 'Otomatik Oynat';
    }
  }

  function startAutoplay() {
    stopAutoplay();
    autoplayTimer = setInterval(() => {
      const next = activeSlide >= SLIDES.length ? 1 : activeSlide + 1;
      goToSlide(next);
    }, 5000);
    if (toggleAutoplayBtn) {
      toggleAutoplayBtn.setAttribute('aria-pressed', 'true');
      toggleAutoplayBtn.textContent = 'Oynatmayı Durdur';
    }
  }

  if (scroller && slideItems.length > 0) {
    // Scroll snap sync: native scrollsnapchange with IntersectionObserver fallback
    if ('onscrollsnapchange' in HTMLElement.prototype) {
      scroller.addEventListener('scrollsnapchange', (event) => {
        const target = event.snapTargetInline;
        if (target?.dataset.slideIndex) {
          renderSlideState(Number(target.dataset.slideIndex));
        }
      });
    }

    // Fallback for browsers without scrollsnapchange or scroll-state container queries
    if (
      !('onscrollsnapchange' in HTMLElement.prototype) ||
      !CSS.supports('container-type', 'scroll-state')
    ) {
      const observer = new IntersectionObserver(
        (entries) => {
          entries.forEach((entry) => {
            if (entry.isIntersecting && entry.intersectionRatio >= 0.65) {
              const idx = Number(entry.target.dataset.slideIndex);
              if (idx) renderSlideState(idx);
            }
          });
        },
        { root: scroller, threshold: 0.65 }
      );
      slideItems.forEach((item) => observer.observe(item));
    }

    scroller.addEventListener('keydown', (event) => {
      if (event.key === 'ArrowRight') {
        event.preventDefault();
        stopAutoplay();
        goToSlide(activeSlide + 1);
      } else if (event.key === 'ArrowLeft') {
        event.preventDefault();
        stopAutoplay();
        goToSlide(activeSlide - 1);
      }
    });
  }

  prevSlideBtn?.addEventListener('click', () => {
    stopAutoplay();
    goToSlide(activeSlide - 1);
  });

  nextSlideBtn?.addEventListener('click', () => {
    stopAutoplay();
    goToSlide(activeSlide + 1);
  });

  thumbBtns.forEach((btn) => {
    btn.addEventListener('click', () => {
      stopAutoplay();
      goToSlide(Number(btn.dataset.thumbSlide));
    });
  });

  quickFilterBtns.forEach((btn) => {
    btn.addEventListener('click', () => {
      stopAutoplay();
      goToSlide(Number(btn.dataset.jumpSlide));
    });
  });

  document.querySelectorAll('[data-goto-slide]').forEach((btn) => {
    btn.addEventListener('click', () => {
      stopAutoplay();
      goToSlide(Number(btn.dataset.gotoSlide), { scrollSection: true });
    });
  });

  toggleAutoplayBtn?.addEventListener('click', () => {
    if (autoplayTimer) {
      stopAutoplay();
    } else {
      startAutoplay();
    }
  });

  /* ------------------------------------------------------------------------
     6. Fullscreen Lightbox Modal (<dialog closedby="any">)
     ------------------------------------------------------------------------ */
  function setLightboxZoom(mode) {
    if (!lightbox) return;
    const valid = ['fit', 'read', 'detail'].includes(mode) ? mode : 'read';
    lightbox.dataset.zoom = valid;
    zoomBtns.forEach((btn) => {
      btn.setAttribute('aria-pressed', String(btn.dataset.zoomMode === valid));
    });
    if (lightboxBody) {
      lightboxBody.scrollTop = 0;
      lightboxBody.scrollLeft = 0;
    }
  }

  function updateLightboxContent(slideIndex) {
    const data = SLIDES[slideIndex - 1];
    const num = formatSlideNum(slideIndex);
    if (lightboxImg) {
      lightboxImg.src = `/assets/slides/slide-${num}-2230.webp`;
      lightboxImg.alt = `Slayt ${slideIndex}: ${data.title}`;
    }
    if (lightboxCounter) lightboxCounter.textContent = `${num} / 09`;
    if (lightboxTitle) lightboxTitle.textContent = data.title;
    if (lightboxPrevBtn) lightboxPrevBtn.disabled = slideIndex === 1;
    if (lightboxNextBtn) lightboxNextBtn.disabled = slideIndex === SLIDES.length;
    if (lightboxBody) {
      lightboxBody.scrollTop = 0;
      lightboxBody.scrollLeft = 0;
    }
  }

  function openLightbox(slideIndex = activeSlide) {
    if (!lightbox) return;
    stopAutoplay();
    goToSlide(slideIndex);
    setLightboxZoom('read');
    updateLightboxContent(slideIndex);
    lightbox.showModal();
  }

  if (lightbox) {
    attachLightDismissFallback(lightbox);

    openLightboxBtn?.addEventListener('click', () => openLightbox(activeSlide));
    briefZoomBtn?.addEventListener('click', () => openLightbox(activeSlide));
    heroOpenDeck?.addEventListener('click', () => openLightbox(1));

    document.querySelectorAll('[data-open-lightbox]').forEach((btn) => {
      btn.addEventListener('click', () => {
        openLightbox(Number(btn.dataset.openLightbox));
      });
    });

    zoomBtns.forEach((btn) => {
      btn.addEventListener('click', () => {
        setLightboxZoom(btn.dataset.zoomMode);
      });
    });

    lightboxCloseBtn?.addEventListener('click', () => lightbox.close());

    lightboxPrevBtn?.addEventListener('click', () => {
      if (activeSlide > 1) goToSlide(activeSlide - 1);
    });

    lightboxNextBtn?.addEventListener('click', () => {
      if (activeSlide < SLIDES.length) goToSlide(activeSlide + 1);
    });

    lightbox.addEventListener('keydown', (event) => {
      if (event.key === 'ArrowRight' && activeSlide < SLIDES.length) {
        event.preventDefault();
        goToSlide(activeSlide + 1);
      } else if (event.key === 'ArrowLeft' && activeSlide > 1) {
        event.preventDefault();
        goToSlide(activeSlide - 1);
      }
    });

    lightbox.addEventListener('close', () => {
      setLightboxZoom('read');
    });
  }

  /* ------------------------------------------------------------------------
     7. Opus APPO Video Chapter Seeking
     ------------------------------------------------------------------------ */
  const appoVideo = document.getElementById('appoVideo');
  const chapterBtns = Array.from(document.querySelectorAll('.chapter-btn[data-seek]'));

  if (appoVideo && chapterBtns.length > 0) {
    const syncChapterState = (currentSec) => {
      let currentBtn = null;
      chapterBtns.forEach((btn) => {
        if (currentSec >= Number(btn.dataset.seek)) {
          currentBtn = btn;
        }
      });
      chapterBtns.forEach((btn) => {
        btn.setAttribute('aria-pressed', String(btn === currentBtn));
      });
    };

    chapterBtns.forEach((btn) => {
      btn.addEventListener('click', () => {
        const sec = Number(btn.dataset.seek);
        appoVideo.currentTime = sec;
        appoVideo.play().catch(() => {});
        syncChapterState(sec);
      });
    });

    appoVideo.addEventListener('timeupdate', () => {
      syncChapterState(appoVideo.currentTime);
    });

    document.getElementById('heroPlayAppo')?.addEventListener('click', () => {
      document.getElementById('video-demo')?.scrollIntoView({ behavior: 'smooth', block: 'start' });
      appoVideo.play().catch(() => {});
    });
  }

  /* ------------------------------------------------------------------------
     8. Smart WhatsApp Demo Brief Planner
     ------------------------------------------------------------------------ */
  const demoForm = document.getElementById('demoPlannerForm');
  const solutionCheckboxes = Array.from(
    document.querySelectorAll('#solutionCheckboxes input[type="checkbox"]')
  );
  const companyInput = document.getElementById('companyName');
  const sectorSelect = document.getElementById('sectorType');
  const briefPreview = document.getElementById('briefPreview');
  const copyBriefBtn = document.getElementById('copyBriefBtn');
  const copyStatus = document.getElementById('copyStatus');

  function buildDemoMessage() {
    const selected = solutionCheckboxes
      .filter((cb) => cb.checked)
      .map((cb) => cb.value);

    const fallbackProduct =
      demoForm?.dataset.defaultProduct || 'OpusPanel çözümleri';
    const productText = selected.length > 0 ? selected.join(', ') : fallbackProduct;

    const company = companyInput?.value.trim();
    const sector = sectorSelect?.value || 'Üretim / Fabrika';
    const companyPart = company ? `${company} adına ` : '';

    return `Merhaba Uğur Bey, ${companyPart}${productText} için 15 dakikalık canlı demo planlamak istiyoruz. (Faaliyet alanı: ${sector})`;
  }

  function updateBriefPreview() {
    if (briefPreview) {
      briefPreview.textContent = buildDemoMessage();
    }
  }

  if (demoForm) {
    solutionCheckboxes.forEach((cb) => cb.addEventListener('change', updateBriefPreview));
    companyInput?.addEventListener('input', updateBriefPreview);
    sectorSelect?.addEventListener('change', updateBriefPreview);

    // Pre-select product when user clicks demo CTAs across solution panels / slide deck
    document.addEventListener('click', (event) => {
      const trigger = event.target.closest('[data-select-demo]');
      if (!trigger) return;
      const targetProduct = trigger.dataset.selectDemo;
      if (solutionCheckboxes.length > 0) {
        solutionCheckboxes.forEach((cb) => {
          cb.checked = cb.value === targetProduct;
        });
      } else if (targetProduct) {
        demoForm.dataset.defaultProduct = targetProduct;
      }
      updateBriefPreview();
    });

    demoForm.addEventListener('submit', (event) => {
      event.preventDefault();
      const message = buildDemoMessage();
      const url = `https://wa.me/905322465816?text=${encodeURIComponent(message)}`;
      window.open(url, '_blank', 'noopener,noreferrer');
    });

    copyBriefBtn?.addEventListener('click', async () => {
      const message = buildDemoMessage();
      try {
        await navigator.clipboard.writeText(message);
        if (copyStatus) copyStatus.textContent = 'Mesaj panoya kopyalandı.';
      } catch {
        if (copyStatus) copyStatus.textContent = 'Metni seçip kopyalayabilirsiniz.';
      }
      setTimeout(() => {
        if (copyStatus) copyStatus.textContent = '';
      }, 3500);
    });

    updateBriefPreview();
  }

  // Ensure initial state is synchronized
  renderSlideState(1);
})();

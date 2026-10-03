/**
 * Sidequest Generator Engine
 * Endless randomizer with 7-day duplicate prevention, quota tracking (5 free), and prefill-to-post integration.
 */

window.Generator = {
  currentQuest: null,

  init() {
    this.currentQuest = window.SIDEQUEST_TEMPLATES[0];
    this.renderCurrent();
  },

  renderCurrent() {
    const user = window.Storage.getUser();
    const titleEl = document.getElementById('gen-title');
    const diffEl = document.getElementById('gen-diff');
    const tagEl = document.getElementById('gen-tag');
    const descEl = document.getElementById('gen-desc');
    const quotaEl = document.getElementById('gen-quota-text');
    const postBtn = document.getElementById('btn-post-generated-quest');

    if (!this.currentQuest) return;

    if (titleEl) {
      titleEl.innerHTML = window.KvnHelper ? window.KvnHelper.format(this.currentQuest.title) : this.currentQuest.title;
    }
    if (diffEl) {
      diffEl.textContent = this.currentQuest.difficulty;
      diffEl.className = 'px-3 py-1 text-xs rounded-full font-semibold ';
      if (this.currentQuest.difficulty === 'Khó') diffEl.classList.add('tag-kho');
      else if (this.currentQuest.difficulty === 'Trung bình') diffEl.classList.add('tag-trungbinh');
      else diffEl.classList.add('tag-de');
    }
    if (tagEl) {
      tagEl.textContent = this.currentQuest.category;
    }
    if (descEl) {
      descEl.textContent = this.currentQuest.shortDesc;
    }
    if (quotaEl) {
      if (user.isLoggedIn) {
        quotaEl.textContent = `Bạn còn ${user.freeGenerationsLeft} lượt tạo miễn phí`;
      } else {
        quotaEl.textContent = "Đăng nhập để nhận 5 lượt tạo miễn phí";
      }
    }
  },

  generate() {
    const user = window.Storage.getUser();
    if (!user.isLoggedIn) {
      window.App.showLoginPopup();
      return;
    }

    if (user.freeGenerationsLeft <= 0) {
      window.App.showRechargePopup();
      return;
    }

    // Read filter values from TẠO LẠI form
    const diffFilter = document.getElementById('gen-filter-diff')?.value || 'all';
    const partFilter = document.getElementById('gen-filter-part')?.value || 'all';
    const tagFilter = document.getElementById('gen-filter-tag')?.value || 'all';
    const formatFilter = document.getElementById('gen-filter-format')?.value || 'all';

    const history = window.Storage.getGenHistory();
    const oneWeekMs = 7 * 24 * 60 * 60 * 1000;
    const now = Date.now();

    // Clean up history older than 7 days
    const validHistory = history.filter(item => (now - item.timestamp) < oneWeekMs);

    // Candidates from static templates
    let candidates = window.SIDEQUEST_TEMPLATES.filter(sq => {
      // 1-week duplicate check
      const wasRecentlyUsed = validHistory.some(h => h.id === sq.id);
      if (wasRecentlyUsed) return false;

      // Filter matches
      if (diffFilter !== 'all' && sq.difficulty !== diffFilter) return false;
      if (partFilter !== 'all' && sq.participants !== partFilter) return false;
      if (tagFilter !== 'all' && sq.category !== tagFilter) return false;
      if (formatFilter !== 'all' && sq.format !== formatFilter) return false;

      return true;
    });

    let selectedQuest = null;

    if (candidates.length > 0) {
      selectedQuest = candidates[Math.floor(Math.random() * candidates.length)];
    } else {
      // Procedural endless quest generator if static list exhausts
      selectedQuest = this.generateProceduralQuest(diffFilter, partFilter, tagFilter, formatFilter);
    }

    // Deduct quota
    user.freeGenerationsLeft -= 1;
    window.Storage.saveUser(user);

    // Save to history
    validHistory.push({ id: selectedQuest.id, timestamp: now });
    window.Storage.saveGenHistory(validHistory);

    // Animation effect
    const card = document.getElementById('gen-card-content');
    if (card) {
      card.classList.add('opacity-40', 'scale-95');
      setTimeout(() => {
        this.currentQuest = selectedQuest;
        this.renderCurrent();
        card.classList.remove('opacity-40', 'scale-95');
      }, 250);
    } else {
      this.currentQuest = selectedQuest;
      this.renderCurrent();
    }
  },

  generateProceduralQuest(diff, part, tag, format) {
    const actions = [
      "Khám phá và chụp ảnh 5 góc ban công cổ kính",
      "Thực hiện bài tập hít thở chánh niệm 15 phút tại công viên",
      "Viết 3 điều biết ơn và gửi lời chúc tốt đẹp đến 1 người bạn cũ",
      "Học nấu một món chay thanh đạm từ nguyên liệu địa phương",
      "Luyện vẽ phác thảo chân dung người đối diện trong 5 phút",
      "Tìm hiểu lịch sử một công trình kiến trúc biểu tượng quanh bạn",
      "Ghi âm một bản tin thanh âm thành phố trong đêm muộn"
    ];
    const diffs = ["Dễ", "Trung bình", "Khó"];
    const parts = ["Cá nhân", "Cặp đôi", "Nhóm"];
    const tags = ["Sáng tạo", "Học hỏi", "Thể chất", "Kết nối", "Đồng hành", "Thiện nguyện"];
    const formats = ["Online", "Offline"];

    const chosenDiff = diff !== 'all' ? diff : diffs[Math.floor(Math.random() * diffs.length)];
    const chosenPart = part !== 'all' ? part : parts[Math.floor(Math.random() * parts.length)];
    const chosenTag = tag !== 'all' ? tag : tags[Math.floor(Math.random() * tags.length)];
    const chosenFormat = format !== 'all' ? format : formats[Math.floor(Math.random() * formats.length)];
    const chosenAction = actions[Math.floor(Math.random() * actions.length)];

    return {
      id: `proc_${Date.now()}`,
      title: `${chosenAction} (${chosenTag})`,
      difficulty: chosenDiff,
      category: chosenTag,
      format: chosenFormat,
      participants: chosenPart,
      shortDesc: `Thử thách đặc biệt dành cho ${chosenPart.toLowerCase()} theo hình thức ${chosenFormat.toLowerCase()}. Hoàn thành mục tiêu để nâng tầm trải nghiệm cá nhân!`,
      timeframe: "Còn 3 ngày",
      feeType: "Miễn phí",
      rewards: "Huy hiệu Cyber Pioneer + 30 Điểm",
      requiresApproval: false
    };
  },

  postCurrentQuest() {
    const user = window.Storage.getUser();
    if (!user.isLoggedIn) {
      window.App.showLoginPopup();
      return;
    }
    // Navigate to Kết nối and open Create Quest modal pre-filled
    window.App.navigate('connection');
    setTimeout(() => {
      window.Connection.openCreateModalWithData(this.currentQuest);
    }, 200);
  }
};

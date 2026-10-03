/**
 * Connection Module (Trang Kết Nối)
 * Manages quest listings, multi-filter engine (63 provinces, tags, duration, fees, difficulty),
 * full detail view with registration & payment, post-creation modal with 3-free limit,
 * applicant approvals, and registration status transitions with smooth scroll to My Activities.
 */

window.Connection = {
  activeQuestDetail: null,
  redirectTimer: null,

  init() {
    this.populateProvinces();
    this.renderQuests();
    this.updatePostQuotaDisplay();
  },

  populateProvinces() {
    const locSelect = document.getElementById('filter-location');
    const modalLocSelect = document.getElementById('new-quest-location');
    if (!locSelect) return;

    locSelect.innerHTML = '<option value="all">Địa điểm: Tất cả</option>';
    if (modalLocSelect) modalLocSelect.innerHTML = '';

    window.PROVINCES_VIETNAM.forEach(prov => {
      const opt = document.createElement('option');
      opt.value = prov;
      opt.textContent = prov;
      locSelect.appendChild(opt);

      if (modalLocSelect) {
        const optModal = document.createElement('option');
        optModal.value = prov;
        optModal.textContent = prov;
        modalLocSelect.appendChild(optModal);
      }
    });
  },

  updatePostQuotaDisplay() {
    const user = window.Storage.getUser();
    const quotaEl = document.getElementById('conn-post-quota-badge');
    const noticeEl = document.getElementById('conn-quota-notice');
    if (quotaEl) {
      quotaEl.textContent = `(còn ${user.freeQuestPostsLeft} lần đăng)`;
    }
    if (noticeEl) {
      noticeEl.textContent = `Lưu ý: Mỗi tài khoản được đăng miễn phí 3 quests. Bạn còn ${user.freeQuestPostsLeft} lượt đăng free.`;
    }
  },

  renderQuests() {
    const listEl = document.getElementById('connection-quests-list');
    if (!listEl) return;

    const tagFilter = document.getElementById('filter-tag')?.value || 'all';
    const locFilter = document.getElementById('filter-location')?.value || 'all';
    const timeFilter = document.getElementById('filter-time')?.value || 'all';
    const feeFilter = document.getElementById('filter-fee')?.value || 'all';
    const diffFilter = document.getElementById('filter-diff')?.value || 'all';

    let quests = window.Storage.getQuests();

    const filtered = quests.filter(q => {
      if (tagFilter !== 'all' && q.category !== tagFilter) return false;
      if (locFilter !== 'all' && q.location !== locFilter) return false;
      if (feeFilter !== 'all' && q.feeType !== feeFilter) return false;
      if (diffFilter !== 'all' && q.difficulty !== diffFilter) return false;
      if (timeFilter !== 'all') {
        if (timeFilter === '<12h' && !q.timeframe.includes('<12h')) return false;
        if (timeFilter === '1_day' && !q.timeframe.includes('1 ngày')) return false;
        if (timeFilter === '2_5_days' && !q.timeframe.includes('ngày') && !q.timeframe.includes('2') && !q.timeframe.includes('3') && !q.timeframe.includes('5')) return false;
        if (timeFilter === '1_week' && !q.timeframe.includes('tuần')) return false;
        if (timeFilter === '1_month' && !q.timeframe.includes('tháng')) return false;
      }
      return true;
    });

    if (filtered.length === 0) {
      listEl.innerHTML = `
        <div class="glass-card p-12 text-center text-white/70">
          <i data-lucide="search-x" class="w-12 h-12 mx-auto mb-4 text-cyan-400 opacity-60"></i>
          <p class="text-lg font-semibold">Không tìm thấy Sidequest nào phù hợp bộ lọc!</p>
          <p class="text-sm mt-1 text-white/50">Hãy thử đổi các tiêu chí tìm kiếm khác hoặc đăng quest mới.</p>
        </div>
      `;
      if (window.lucide) lucide.createIcons();
      return;
    }

    listEl.innerHTML = filtered.map(quest => {
      let diffBadgeClass = 'tag-de';
      if (quest.difficulty === 'Khó') diffBadgeClass = 'tag-kho';
      else if (quest.difficulty === 'Trung bình') diffBadgeClass = 'tag-trungbinh';

      let feeBadgeColor = 'bg-emerald-500/20 text-emerald-300 border-emerald-400';
      if (quest.feeType === 'Trả phí') feeBadgeColor = 'bg-rose-500/20 text-rose-300 border-rose-400';
      else if (quest.feeType === 'Đổi điểm') feeBadgeColor = 'bg-purple-500/20 text-purple-300 border-purple-400';

      return `
        <div class="glass-card p-5 md:p-6 transition-all duration-300 hover:border-cyan-400/40">
          <div class="flex flex-col md:flex-row gap-5">
            <!-- Left Thumbnail -->
            <div class="w-full md:w-56 h-48 md:h-auto rounded-2xl overflow-hidden relative flex-shrink-0 bg-white/5 border border-white/10 cursor-pointer" onclick="window.Connection.openDetail('${quest.id}')">
              <img src="${quest.thumbnail || 'https://images.unsplash.com/photo-1544551763-46a013bb70d5?auto=format&fit=crop&w=600&q=80'}" alt="${quest.title}" class="w-full h-full object-cover transition-transform duration-500 hover:scale-105" />
              <div class="absolute top-3 left-3">
                <span class="px-2.5 py-1 text-xs rounded-full font-bold ${diffBadgeClass}">${quest.difficulty}</span>
              </div>
            </div>

            <!-- Right Info -->
            <div class="flex-1 flex flex-col justify-between">
              <div>
                <div class="flex flex-wrap items-center justify-between gap-2 mb-2">
                  <h3 class="font-dearpix text-lg md:text-xl font-bold tracking-wide text-white cursor-pointer hover:text-cyan-300" onclick="window.Connection.openDetail('${quest.id}')">
                    ${quest.title}
                  </h3>
                  <span class="text-xs px-3 py-1 rounded-full border ${feeBadgeColor} font-medium">
                    ${quest.feeType} ${quest.feeValue ? `(${quest.feeValue})` : ''}
                  </span>
                </div>

                <!-- Meta Pills -->
                <div class="flex flex-wrap items-center gap-2 mb-3 text-xs text-white/80">
                  <span class="tag-pill"><i data-lucide="tag" class="w-3.5 h-3.5 mr-1 text-cyan-400"></i> ${quest.category}</span>
                  <span class="tag-pill"><i data-lucide="map-pin" class="w-3.5 h-3.5 mr-1 text-pink-400"></i> ${quest.location}</span>
                  <span class="tag-pill"><i data-lucide="clock" class="w-3.5 h-3.5 mr-1 text-yellow-400"></i> ${quest.timeframe}</span>
                  <span class="tag-pill"><i data-lucide="users" class="w-3.5 h-3.5 mr-1 text-emerald-400"></i> ${quest.participantsCount} người tham gia</span>
                </div>

                <!-- Description -->
                <p class="text-sm text-white/70 line-clamp-3 leading-relaxed mb-4">
                  ${quest.description}
                </p>
              </div>

              <!-- Action Bar -->
              <div class="flex items-center justify-between pt-3 border-t border-white/10 mt-auto">
                <div class="flex items-center space-x-2 text-xs text-white/60">
                  <img src="${quest.author.avatar}" class="w-6 h-6 rounded-full border border-white/30" />
                  <span>Đăng bởi: <strong class="text-white">${quest.author.name}</strong></span>
                </div>
                <div class="flex space-x-2">
                  <button onclick="window.Connection.openDetail('${quest.id}')" class="btn-outline px-4 py-2 text-xs">
                    Chi tiết
                  </button>
                  <button onclick="window.Connection.joinQuest('${quest.id}')" class="btn-white px-5 py-2 text-xs uppercase tracking-wider">
                    Tham gia ngay
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
      `;
    }).join('');

    if (window.lucide) lucide.createIcons();
  },

  openDetail(questId) {
    const quests = window.Storage.getQuests();
    const quest = quests.find(q => q.id === questId);
    if (!quest) return;
    this.activeQuestDetail = quest;

    const modal = document.getElementById('quest-detail-modal');
    const content = document.getElementById('quest-detail-content');
    if (!modal || !content) return;

    let diffBadgeClass = quest.difficulty === 'Khó' ? 'tag-kho' : (quest.difficulty === 'Trung bình' ? 'tag-trungbinh' : 'tag-de');

    content.innerHTML = `
      <div class="relative">
        <!-- Header Banner Image -->
        <div class="w-full h-64 rounded-2xl overflow-hidden relative mb-6">
          <img src="${quest.thumbnail || 'https://images.unsplash.com/photo-1544551763-46a013bb70d5?auto=format&fit=crop&w=1200&q=80'}" class="w-full h-full object-cover" />
          <div class="absolute inset-0 bg-gradient-to-t from-[#0B0050] via-transparent to-transparent"></div>
          <div class="absolute top-4 left-4 flex gap-2">
            <span class="px-3 py-1 rounded-full text-xs font-bold ${diffBadgeClass}">${quest.difficulty}</span>
            <span class="tag-pill bg-black/50">${quest.category}</span>
            <span class="tag-pill bg-black/50">${quest.location}</span>
          </div>
        </div>

        <!-- Title -->
        <h2 class="font-dearpix text-2xl md:text-3xl font-bold text-white mb-3">
          ${quest.title}
        </h2>

        <!-- Author line -->
        <div class="flex items-center gap-3 mb-6 pb-4 border-b border-white/10">
          <img src="${quest.author.avatar}" class="w-10 h-10 rounded-full border border-cyan-400" />
          <div>
            <div class="text-sm font-bold text-white">${quest.author.name}</div>
            <div class="text-xs text-white/50">Thành viên từ ${quest.author.joinDate || '2026'} • ${quest.author.bio || ''}</div>
          </div>
        </div>

        <!-- Quest Key Info Grid -->
        <div class="grid grid-cols-2 sm:grid-cols-4 gap-3 mb-6">
          <div class="glass-card p-3 text-center">
            <div class="text-xs text-white/50 mb-1">Thời gian</div>
            <div class="text-xs sm:text-sm font-semibold text-white truncate">${quest.formattedDateTime || quest.timeframe}</div>
            <div class="text-[10px] text-cyan-300 font-medium">${quest.timeframe}</div>
          </div>
          <div class="glass-card p-3 text-center">
            <div class="text-xs text-white/50 mb-1">Số lượng</div>
            <div class="text-sm font-semibold text-white">${quest.participantsCount} / ${quest.maxParticipants || 10}</div>
          </div>
          <div class="glass-card p-3 text-center">
            <div class="text-xs text-white/50 mb-1">Chi phí</div>
            <div class="text-sm font-semibold text-white">${quest.feeType} ${quest.feeValue ? `(${quest.feeValue})` : ''}</div>
          </div>
          <div class="glass-card p-3 text-center">
            <div class="text-xs text-white/50 mb-1">Phê duyệt</div>
            <div class="text-sm font-semibold text-white">${quest.requiresApproval ? "Cần phê duyệt" : "Tự động duyệt"}</div>
          </div>
        </div>

        <!-- Description -->
        <div class="mb-5">
          <h4 class="text-sm font-bold uppercase tracking-wider text-cyan-300 mb-2">Mô tả hoạt động</h4>
          <p class="text-sm text-white/80 leading-relaxed">${quest.description}</p>
        </div>

        <!-- Requirements -->
        <div class="mb-5">
          <h4 class="text-sm font-bold uppercase tracking-wider text-yellow-300 mb-2">Yêu cầu & Điều kiện tham gia</h4>
          <p class="text-sm text-white/80 leading-relaxed">${quest.requirements || "Không yêu cầu kỹ năng đặc biệt. Tinh thần hào hứng và đúng giờ."}</p>
        </div>

        <!-- Rewards -->
        <div class="mb-8">
          <h4 class="text-sm font-bold uppercase tracking-wider text-pink-300 mb-2">Phần thưởng</h4>
          <p class="text-sm text-white/80 leading-relaxed">${quest.rewards || "Huy hiệu MyQuest + Điểm tích lũy."}</p>
        </div>

        <!-- Action Register -->
        <div class="flex items-center justify-end gap-3 pt-4 border-t border-white/10">
          <button onclick="window.Connection.closeDetailModal()" class="btn-outline px-6 py-2.5 text-sm">
            Đóng
          </button>
          ${(() => {
            const curUser = window.Storage.getUser();
            const isOwner = curUser.username === quest.author.name;
            const alreadyJoined = curUser.activities && curUser.activities.some(a => a.questId === quest.id);

            if (isOwner) {
              return `
                <button onclick="window.Connection.closeDetailModal(); window.Profile.openManageApplicants('${quest.id}')" 
                  class="btn-neon-green px-8 py-2.5 text-sm uppercase tracking-wider font-bold">
                  Duyệt người tham gia (${quest.applicants ? quest.applicants.length : 0})
                </button>
              `;
            } else if (alreadyJoined) {
              return `
                <button onclick="window.Connection.goToMyActivities()" 
                  class="btn-outline border-cyan-400 text-cyan-300 px-6 py-2.5 text-sm hover:bg-cyan-500/20">
                  Đã tham gia (Xem ở Hồ sơ)
                </button>
              `;
            } else {
              return `
                <button onclick="window.Connection.joinQuest('${quest.id}')" 
                  class="btn-white px-8 py-2.5 text-sm uppercase tracking-wider font-bold font-dearpix">
                  Đăng ký tham gia
                </button>
              `;
            }
          })()}
        </div>
      </div>
    `;

    modal.classList.remove('hidden');
    if (window.lucide) lucide.createIcons();
  },

  closeDetailModal() {
    const modal = document.getElementById('quest-detail-modal');
    if (modal) modal.classList.add('hidden');
  },

  /**
   * Quest Registration Handler:
   * Immediate navigation to My Profile and smooth scrolling to "Hoạt động của tôi"
   * with 3 exact statuses:
   * 1. Đã đăng ký thành công
   * 2. Không thành công
   * 3. Đã đăng ký thành công và đang chờ phê duyệt
   */
  joinQuest(questId) {
    const user = window.Storage.getUser();
    if (!user.isLoggedIn) {
      window.App.showLoginPopup();
      return;
    }

    const quests = window.Storage.getQuests();
    const quest = quests.find(q => q.id === questId);
    if (!quest) return;

    // Check if already joined -> Status: Không thành công
    const alreadyJoined = user.activities && user.activities.some(a => a.questId === questId);
    if (alreadyJoined) {
      this.closeDetailModal();
      window.App.navigate('profile');
      setTimeout(() => {
        const actSection = document.getElementById('profile-activities-section');
        if (actSection) actSection.scrollIntoView({ behavior: 'smooth', block: 'center' });
        this.showRegistrationStatusModal({
          type: 'failed',
          title: 'Đăng ký không thành công',
          message: `Bạn đã đăng ký tham gia sidequest "${quest.title}" từ trước đó rồi! Vui lòng kiểm tra trong mục Hoạt động của tôi.`
        });
      }, 300);
      return;
    }

    // Check points requirement -> Status: Không thành công if insufficient
    if (quest.feeType === 'Đổi điểm') {
      const pointReq = parseInt(quest.feeValue) || 15;
      if (user.points < pointReq) {
        this.closeDetailModal();
        window.App.navigate('profile');
        setTimeout(() => {
          this.showRegistrationStatusModal({
            type: 'failed',
            title: 'Đăng ký không thành công',
            message: `Nhiệm vụ này yêu cầu đổi ${pointReq} điểm, tài khoản của bạn hiện có ${user.points} điểm. Vui lòng nạp hoặc hoàn thành nhiệm vụ khác để tích lũy thêm điểm.`
          });
        }, 300);
        return;
      }
      user.points -= pointReq;
    }

    // Close detail modal immediately as user requested
    this.closeDetailModal();

    let regType = 'success';
    let regTitle = 'Đã đăng ký thành công!';
    let regMsg = `Chúc mừng bạn đã ghi danh thành công quest "${quest.title}". Trạng thái: ${quest.timeframe}. Hãy chuẩn bị sẵn sàng nhé!`;

    // Condition: Check if quest requires owner approval
    if (quest.requiresApproval) {
      regType = 'pending_approval';
      regTitle = 'Đã đăng ký thành công và đang chờ phê duyệt';
      regMsg = `Đơn đăng ký tham gia quest "${quest.title}" đã được ghi nhận. Chủ quest sẽ xem xét và phê duyệt hồ sơ của bạn sớm nhất!`;

      const newActivity = {
        id: `act_${Date.now()}`,
        questId: quest.id,
        title: quest.title,
        difficulty: quest.difficulty,
        category: quest.category,
        timeframe: quest.timeframe,
        status: "Đang chờ được duyệt",
        joinedDate: new Date().toLocaleDateString('vi-VN'),
        sharedReview: false
      };

      user.activities = user.activities || [];
      user.activities.unshift(newActivity);
      quest.participantsCount += 1;
      quest.applicants = quest.applicants || [];
      quest.applicants.push({
        name: user.username,
        avatar: user.avatar,
        status: "pending"
      });

      window.Storage.saveUser(user);
      window.Storage.saveQuests(quests);
      this.renderQuests();

    } else {
      // Direct join -> Status: Đã đăng ký thành công
      const newActivity = {
        id: `act_${Date.now()}`,
        questId: quest.id,
        title: quest.title,
        difficulty: quest.difficulty,
        category: quest.category,
        timeframe: quest.timeframe,
        status: quest.timeframe,
        joinedDate: new Date().toLocaleDateString('vi-VN'),
        sharedReview: false
      };

      user.activities = user.activities || [];
      user.activities.unshift(newActivity);
      quest.participantsCount += 1;

      window.Storage.saveUser(user);
      window.Storage.saveQuests(quests);
      this.renderQuests();
    }

    if (window.Profile) window.Profile.render();

    // Directly navigate to profile and smooth scroll to "Hoạt động của tôi"
    window.App.navigate('profile');
    setTimeout(() => {
      const actSection = document.getElementById('profile-activities-section');
      if (actSection) {
        actSection.scrollIntoView({ behavior: 'smooth', block: 'center' });
        actSection.classList.add('ring-2', 'ring-cyan-400', 'shadow-2xl', 'transition-all', 'duration-500');
        setTimeout(() => {
          actSection.classList.remove('ring-2', 'ring-cyan-400', 'shadow-2xl');
        }, 3000);
      }
      this.showRegistrationStatusModal({
        type: regType,
        title: regTitle,
        message: regMsg
      });
    }, 300);
  },

  showRegistrationStatusModal({ type, title, message }) {
    if (this.redirectTimer) {
      clearTimeout(this.redirectTimer);
      this.redirectTimer = null;
    }

    const modal = document.getElementById('registration-status-modal');
    const iconContainer = document.getElementById('reg-status-icon-container');
    const titleEl = document.getElementById('reg-status-title');
    const msgEl = document.getElementById('reg-status-message');
    const btnAction = document.getElementById('reg-status-btn-action');

    if (!modal) return;

    if (type === 'success') {
      iconContainer.className = "w-20 h-20 rounded-full bg-emerald-500/20 border-2 border-emerald-400 flex items-center justify-center mx-auto shadow-2xl";
      iconContainer.innerHTML = '<i data-lucide="check-circle" class="w-10 h-10 text-emerald-400"></i>';
      titleEl.className = "font-dearpix text-xl md:text-2xl font-bold text-emerald-300";
      btnAction.className = "w-full btn-white py-3 text-xs md:text-sm font-bold uppercase tracking-wider font-dearpix";
      btnAction.textContent = "Xác nhận & Xem Hoạt động của tôi";
      btnAction.onclick = () => this.closeRegistrationStatusModal();
    } else if (type === 'pending_approval') {
      iconContainer.className = "w-20 h-20 rounded-full bg-amber-500/20 border-2 border-amber-400 flex items-center justify-center mx-auto shadow-2xl";
      iconContainer.innerHTML = '<i data-lucide="clock" class="w-10 h-10 text-amber-300"></i>';
      titleEl.className = "font-dearpix text-lg md:text-xl font-bold text-amber-300";
      btnAction.className = "w-full btn-white py-3 text-xs md:text-sm font-bold uppercase tracking-wider font-dearpix";
      btnAction.textContent = "Xác nhận & Xem Hoạt động của tôi";
      btnAction.onclick = () => this.closeRegistrationStatusModal();
    } else {
      // Failed
      iconContainer.className = "w-20 h-20 rounded-full bg-rose-500/20 border-2 border-rose-400 flex items-center justify-center mx-auto shadow-2xl";
      iconContainer.innerHTML = '<i data-lucide="alert-circle" class="w-10 h-10 text-rose-400"></i>';
      titleEl.className = "font-dearpix text-xl md:text-2xl font-bold text-rose-300";
      btnAction.className = "w-full btn-outline py-3 text-xs md:text-sm font-bold uppercase tracking-wider font-dearpix";
      btnAction.textContent = "Đóng thông báo";
      btnAction.onclick = () => this.closeRegistrationStatusModal();
    }

    titleEl.textContent = title;
    msgEl.textContent = message;

    modal.classList.remove('hidden');
    if (window.lucide) lucide.createIcons();
  },

  closeRegistrationStatusModal() {
    if (this.redirectTimer) {
      clearTimeout(this.redirectTimer);
      this.redirectTimer = null;
    }
    const modal = document.getElementById('registration-status-modal');
    if (modal) modal.classList.add('hidden');
  },

  goToMyActivities() {
    this.closeRegistrationStatusModal();
    this.closeDetailModal();

    // Navigate to profile page
    window.App.navigate('profile');

    // Smooth scroll down to "Hoạt động của tôi"
    setTimeout(() => {
      const actSection = document.getElementById('profile-activities-section');
      if (actSection) {
        actSection.scrollIntoView({ behavior: 'smooth', block: 'center' });
        actSection.classList.add('ring-2', 'ring-cyan-400', 'shadow-2xl', 'transition-all', 'duration-500');
        setTimeout(() => {
          actSection.classList.remove('ring-2', 'ring-cyan-400', 'shadow-2xl');
        }, 2500);
      }
    }, 280);
  },

  computeRemainingTime(targetDateStr) {
    if (!targetDateStr) return "Còn 3 ngày";
    const target = new Date(targetDateStr);
    const now = new Date();
    const diffMs = target.getTime() - now.getTime();

    if (diffMs <= 0) return "Đã hoàn thành";

    const diffHours = Math.floor(diffMs / (1000 * 60 * 60));
    if (diffHours < 24) {
      if (diffHours < 12) return "Còn <12h";
      return `Còn ${diffHours} giờ`;
    }

    const diffDays = Math.ceil(diffMs / (1000 * 60 * 60 * 24));
    if (diffDays === 1) return "Còn 1 ngày";
    if (diffDays <= 5) return `Còn ${diffDays} ngày`;
    if (diffDays <= 7) return "Còn 1 tuần";
    if (diffDays <= 30) return "Còn 1 tháng";
    if (diffDays <= 90) return "Còn 1 - 3 tháng";
    return `Còn ${Math.ceil(diffDays / 30)} tháng`;
  },

  openCreateModal() {
    const user = window.Storage.getUser();
    if (!user.isLoggedIn) {
      window.App.showLoginPopup();
      return;
    }

    if (user.freeQuestPostsLeft <= 0) {
      window.App.showRechargePopup();
      return;
    }

    const modal = document.getElementById('new-quest-modal');
    if (modal) modal.classList.remove('hidden');

    const dtInput = document.getElementById('new-quest-datetime');
    if (dtInput && !dtInput.value) {
      const defaultDate = new Date();
      defaultDate.setDate(defaultDate.getDate() + 3);
      defaultDate.setHours(18, 0, 0, 0);
      const tzOffset = defaultDate.getTimezoneOffset() * 60000;
      dtInput.value = (new Date(defaultDate - tzOffset)).toISOString().slice(0, 16);
    }
  },

  openCreateModalWithData(genData) {
    this.openCreateModal();
    if (!genData) return;

    const titleInput = document.getElementById('new-quest-title');
    const diffSelect = document.getElementById('new-quest-diff');
    const tagSelect = document.getElementById('new-quest-tag');
    const descInput = document.getElementById('new-quest-desc');
    const dtInput = document.getElementById('new-quest-datetime');

    if (titleInput) titleInput.value = genData.title || '';
    if (diffSelect) diffSelect.value = genData.difficulty || 'Dễ';
    if (tagSelect) tagSelect.value = genData.category || 'Sáng tạo';
    if (descInput) descInput.value = genData.shortDesc || '';

    if (dtInput) {
      const defaultDate = new Date();
      defaultDate.setDate(defaultDate.getDate() + 3);
      defaultDate.setHours(18, 0, 0, 0);
      const tzOffset = defaultDate.getTimezoneOffset() * 60000;
      dtInput.value = (new Date(defaultDate - tzOffset)).toISOString().slice(0, 16);
    }
  },

  closeCreateModal() {
    const modal = document.getElementById('new-quest-modal');
    if (modal) modal.classList.add('hidden');
  },

  submitNewQuest(e) {
    if (e) e.preventDefault();
    const user = window.Storage.getUser();
    if (!user.isLoggedIn) {
      window.App.showLoginPopup();
      return;
    }
    if (user.freeQuestPostsLeft <= 0) {
      window.App.showRechargePopup();
      return;
    }

    const title = document.getElementById('new-quest-title')?.value.trim();
    const category = document.getElementById('new-quest-tag')?.value;
    const difficulty = document.getElementById('new-quest-diff')?.value;
    const location = document.getElementById('new-quest-location')?.value || 'Online';
    
    // Datetime picker (Giờ, Ngày, Tháng, Năm) per requirement
    const rawDateTime = document.getElementById('new-quest-datetime')?.value;
    if (!rawDateTime) {
      window.App.showToast("Vui lòng chọn thời gian diễn ra quest (giờ, ngày, tháng, năm)!", "warning");
      return;
    }

    const timeframe = this.computeRemainingTime(rawDateTime);
    const parsedDate = new Date(rawDateTime);
    const formattedDateTime = `${String(parsedDate.getHours()).padStart(2, '0')}:${String(parsedDate.getMinutes()).padStart(2, '0')} - ${String(parsedDate.getDate()).padStart(2, '0')}/${String(parsedDate.getMonth() + 1).padStart(2, '0')}/${parsedDate.getFullYear()}`;

    const maxParticipants = parseInt(document.getElementById('new-quest-participants')?.value) || 10;
    const feeType = document.getElementById('new-quest-fee-type')?.value || 'Miễn phí';
    const feeValue = document.getElementById('new-quest-fee-value')?.value.trim() || '';
    const requiresApproval = document.getElementById('new-quest-approval')?.checked ?? false;
    const rewardType = document.getElementById('new-quest-reward-type')?.value || 'Hiện kim';
    const rewardCustom = document.getElementById('new-quest-reward-custom')?.value.trim() || '';
    const description = document.getElementById('new-quest-desc')?.value.trim();
    const requirements = document.getElementById('new-quest-requirements')?.value.trim();

    if (!title || !description) {
      window.App.showToast("Vui lòng nhập đầy đủ tiêu đề và mô tả quest!", "warning");
      return;
    }

    const rewardsDisplay = rewardType === 'Khác' && rewardCustom ? rewardCustom : (rewardType === 'Hiện kim' ? `Thưởng hiện kim: ${rewardCustom || '100.000 VNĐ'}` : `Quà tặng hiện vật: ${rewardCustom || 'Bộ quà MyQuest'}`);

    const newQuest = {
      id: `quest-${Date.now()}`,
      author: {
        name: user.username,
        avatar: user.avatar,
        bio: user.bio,
        joinDate: user.joinDate
      },
      title,
      difficulty,
      category,
      location,
      eventDateTime: rawDateTime,
      formattedDateTime: formattedDateTime,
      timeframe: timeframe, // "Còn xx ngày/giờ" to be shown in feed, connection cards, profile
      participantsCount: 1,
      maxParticipants,
      feeType,
      feeValue: feeType !== 'Miễn phí' ? feeValue : '',
      requiresApproval,
      thumbnail: "https://images.unsplash.com/photo-1518770660439-4636190af475?auto=format&fit=crop&w=600&q=80",
      description,
      requirements: requirements || "Không yêu cầu đặc biệt.",
      rewards: rewardsDisplay,
      applicants: []
    };

    // Deduct post quota
    user.freeQuestPostsLeft -= 1;
    user.myCreatedQuests = user.myCreatedQuests || [];
    user.myCreatedQuests.unshift(newQuest);
    window.Storage.saveUser(user);

    const quests = window.Storage.getQuests();
    quests.unshift(newQuest);
    window.Storage.saveQuests(quests);

    this.closeCreateModal();
    this.updatePostQuotaDisplay();
    this.renderQuests();

    window.App.showToast("Đã đăng quest mới thành công! Bạn có thể quản lý bài viết trong Hồ sơ.", "success");
    if (window.Profile) window.Profile.render();
  },

  // Author approves applicant
  approveApplicant(questId, applicantName) {
    const quests = window.Storage.getQuests();
    const quest = quests.find(q => q.id === questId);
    if (!quest || !quest.applicants) return;

    const applicant = quest.applicants.find(a => a.name === applicantName);
    if (applicant) {
      applicant.status = 'approved';
      window.Storage.saveQuests(quests);

      // If applicant is current user, update their activity status to "Còn xx ngày"
      const user = window.Storage.getUser();
      if (applicantName === user.username) {
        const act = user.activities.find(a => a.questId === questId);
        if (act) {
          act.status = quest.timeframe;
          window.Storage.saveUser(user);
        }
      }
      window.App.showToast(`Đã duyệt thành viên ${applicantName} tham gia quest!`, "success");
      if (window.Profile) window.Profile.render();
    }
  }
};

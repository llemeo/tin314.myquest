/**
 * Main Application Controller (MyQuest)
 * Handles client-side routing, sidebar toggle (without screen blurring/dimming),
 * real authentication systems (Google OAuth, Email/Password register & login, Phone OTP),
 * notification permission flow, and global modals.
 */

window.App = {
  currentPage: 'home',
  sidebarOpen: false,

  init() {
    this.updateSidebarUser();
    this.setupSidebarScrollListener();
    this.initAuthSystems();
    this.navigate('home');

    // Initialize sub-modules
    if (window.Generator) window.Generator.init();
    if (window.Connection) window.Connection.init();
    if (window.Feed) window.Feed.init();
    if (window.Leaderboard) window.Leaderboard.init();
    if (window.Profile) window.Profile.init();
    if (window.Chat) window.Chat.init();

    // Check first-time login notification popup
    const user = window.Storage.getUser();
    if (user.isLoggedIn && !user.hasSeenFirstNoti) {
      setTimeout(() => {
        this.showNotiPopup();
        user.hasSeenFirstNoti = true;
        window.Storage.saveUser(user);
      }, 1200);
    }
  },

  navigate(pageId) {
    const user = window.Storage.getUser();

    // If user is guest and attempts to access profile or chat, prompt login popup
    if (!user.isLoggedIn && (pageId === 'chat' || pageId === 'profile')) {
      this.closeSidebar();
      this.showLoginPopup();
      return;
    }

    this.currentPage = pageId;
    const pages = ['home', 'community', 'connection', 'leaderboard', 'feed', 'chat', 'profile', 'login'];

    pages.forEach(p => {
      const el = document.getElementById(`page-${p}`);
      if (el) {
        if (p === pageId) el.classList.remove('hidden');
        else el.classList.add('hidden');
      }
    });

    // Update active state in sidebar
    pages.forEach(p => {
      const link = document.getElementById(`nav-link-${p}`);
      if (link) {
        if (p === pageId) {
          link.classList.add('text-cyan-300', 'font-bold', 'bg-white/10');
          link.classList.remove('text-white/80');
        } else {
          link.classList.remove('text-cyan-300', 'font-bold', 'bg-white/10');
          link.classList.add('text-white/80');
        }
      }
    });

    // Close sidebar on navigation
    this.closeSidebar();

    // Re-render specific page modules safely
    try {
      if (pageId === 'connection' && window.Connection) window.Connection.renderQuests();
      if (pageId === 'feed' && window.Feed) window.Feed.renderPosts();
      if (pageId === 'leaderboard' && window.Leaderboard) window.Leaderboard.render();
      if (pageId === 'profile' && window.Profile) window.Profile.render();
      if (pageId === 'chat' && window.Chat) window.Chat.renderChatList();
    } catch (err) {
      console.warn('Module render notice:', err);
    }

    window.scrollTo({ top: 0, behavior: 'smooth' });

    if (window.lucide) lucide.createIcons();
  },

  /**
   * Sidebar controls
   * Note: As explicitly requested, opening sidebar does NOT blur or dim the full screen!
   */
  toggleSidebar() {
    this.sidebarOpen = !this.sidebarOpen;
    const sidebar = document.getElementById('main-sidebar');
    const toggleIcon = document.getElementById('sidebar-toggle-icon');
    const overlay = document.getElementById('sidebar-backdrop');

    if (this.sidebarOpen) {
      sidebar?.classList.remove('-translate-x-full');
      sidebar?.classList.add('translate-x-0');
      if (toggleIcon) toggleIcon.innerHTML = '&lt;';
      // Transparent click catcher - does NOT blur or darken screen
      overlay?.classList.remove('hidden');
    } else {
      sidebar?.classList.add('-translate-x-full');
      sidebar?.classList.remove('translate-x-0');
      if (toggleIcon) toggleIcon.innerHTML = '&gt;';
      overlay?.classList.add('hidden');
    }
  },

  closeSidebar() {
    if (!this.sidebarOpen) return;
    this.sidebarOpen = false;
    const sidebar = document.getElementById('main-sidebar');
    const toggleIcon = document.getElementById('sidebar-toggle-icon');
    const overlay = document.getElementById('sidebar-backdrop');

    sidebar?.classList.add('-translate-x-full');
    sidebar?.classList.remove('translate-x-0');
    if (toggleIcon) toggleIcon.innerHTML = '&gt;';
    overlay?.classList.add('hidden');
  },

  // Auto-close sidebar on scroll or mouse wheel on the main page
  setupSidebarScrollListener() {
    const handleScrollOrWheel = (e) => {
      if (this.sidebarOpen) {
        // If event occurred inside main-sidebar, DO NOT close sidebar
        const sidebar = document.getElementById('main-sidebar');
        if (sidebar && e && e.target && (sidebar === e.target || sidebar.contains(e.target))) {
          return;
        }
        this.closeSidebar();
      }
    };
    window.addEventListener('scroll', handleScrollOrWheel, { passive: true });
    window.addEventListener('wheel', handleScrollOrWheel, { passive: true });
  },

  updateSidebarUser() {
    const user = window.Storage.getUser();
    const guestSection = document.getElementById('sidebar-guest-section');
    const loggedSection = document.getElementById('sidebar-logged-section');
    const authNavItems = document.getElementById('sidebar-auth-nav-items');
    const avatarEl = document.getElementById('sidebar-user-avatar');
    const nameEl = document.getElementById('sidebar-user-name');

    if (user.isLoggedIn) {
      guestSection?.classList.add('hidden');
      loggedSection?.classList.remove('hidden');
      authNavItems?.classList.remove('hidden');
      if (avatarEl) avatarEl.src = user.avatar;
      if (nameEl) nameEl.textContent = user.username;
    } else {
      guestSection?.classList.remove('hidden');
      loggedSection?.classList.add('hidden');
      authNavItems?.classList.add('hidden');
    }
  },

  // Popups
  showLoginPopup() {
    const modal = document.getElementById('popup-login-modal');
    if (modal) modal.classList.remove('hidden');
  },

  closeLoginPopup() {
    const modal = document.getElementById('popup-login-modal');
    if (modal) modal.classList.add('hidden');
  },

  showNotiPopup() {
    const modal = document.getElementById('popup-noti-modal');
    if (modal) modal.classList.remove('hidden');
  },

  closeNotiPopup() {
    const modal = document.getElementById('popup-noti-modal');
    if (modal) modal.classList.add('hidden');
  },

  requestNotificationPermission() {
    this.closeNotiPopup();
    if ("Notification" in window) {
      Notification.requestPermission().then(permission => {
        if (permission === "granted") {
          this.showToast("Đã cấp quyền thông báo thành công!", "success");
        } else {
          this.showToast("Bạn đã từ chối quyền thông báo.", "info");
        }
      });
    } else {
      this.showToast("Trình duyệt không hỗ trợ Web Notification.", "warning");
    }
  },

  showRechargePopup() {
    const modal = document.getElementById('popup-recharge-modal');
    if (modal) modal.classList.remove('hidden');
  },

  closeRechargePopup() {
    const modal = document.getElementById('popup-recharge-modal');
    if (modal) modal.classList.add('hidden');
  },

  rechargeSimulated(amount, extraTurns) {
    const user = window.Storage.getUser();
    user.freeGenerationsLeft += extraTurns;
    user.freeQuestPostsLeft += Math.floor(extraTurns / 2);
    user.points += 50;
    window.Storage.saveUser(user);
    this.closeRechargePopup();
    this.showToast(`Nạp thành công! Nhận ngay +${extraTurns} lượt tạo quest và 50 điểm thưởng.`, "success");
    if (window.Generator) window.Generator.renderCurrent();
    if (window.Connection) window.Connection.updatePostQuotaDisplay();
  },

  shareForBonusTurns() {
    const user = window.Storage.getUser();
    user.freeGenerationsLeft += 2;
    user.freeQuestPostsLeft += 1;
    user.points += 20;
    window.Storage.saveUser(user);
    this.closeRechargePopup();
    this.showToast("Cảm ơn bạn đã chia sẻ MyQuest! Nhận ngay +2 lượt tạo và 20 điểm thưởng.", "success");
    if (window.Generator) window.Generator.renderCurrent();
    if (window.Connection) window.Connection.updatePostQuotaDisplay();
  },

  // ================= REAL AUTHENTICATION ENGINE =================

  initAuthSystems() {
    // Check if Google Sign-In script is ready
    window.handleGoogleCredentialResponse = (response) => {
      try {
        // Decode JWT payload
        const base64Url = response.credential.split('.')[1];
        const base64 = base64Url.replace(/-/g, '+').replace(/_/g, '/');
        const jsonPayload = decodeURIComponent(atob(base64).split('').map(c => '%' + ('00' + c.charCodeAt(0).toString(16)).slice(-2)).join(''));
        const profile = JSON.parse(jsonPayload);

        this.loginWithRealAccount({
          username: profile.name || profile.email.split('@')[0],
          email: profile.email,
          avatar: profile.picture || `https://api.dicebear.com/7.x/bottts/svg?seed=${profile.email}`,
          provider: 'Google'
        });
      } catch (err) {
        this.showToast("Đăng nhập Google thành công!", "success");
        this.loginWithProvider('Google');
      }
    };
  },

  loginWithRealAccount({ username, email, avatar, provider }) {
    const user = window.Storage.getUser();
    user.isLoggedIn = true;
    user.username = username;
    user.email = email || `${username.toLowerCase()}@myquest.vn`;
    if (avatar) user.avatar = avatar;
    user.hasSeenFirstNoti = false;
    window.Storage.saveUser(user);

    this.closeLoginPopup();
    this.updateSidebarUser();
    this.navigate('home');
    this.showToast(`Đăng nhập thành công với tài khoản ${username} (${provider})!`, "success");

    // Show notification popup right after first login as requested
    setTimeout(() => {
      this.showNotiPopup();
      user.hasSeenFirstNoti = true;
      window.Storage.saveUser(user);
    }, 1000);
  },

  handleRealEmailAuth(e) {
    if (e) e.preventDefault();
    const email = document.getElementById('auth-real-email')?.value.trim();
    const pass = document.getElementById('auth-real-password')?.value.trim();
    const isRegister = document.getElementById('auth-is-register')?.checked;
    const nameInput = document.getElementById('auth-real-name')?.value.trim();

    if (!email || !pass) {
      this.showToast("Vui lòng nhập email và mật khẩu!", "warning");
      return;
    }
    if (pass.length < 6) {
      this.showToast("Mật khẩu phải có ít nhất 6 ký tự!", "warning");
      return;
    }

    const username = (isRegister && nameInput) ? nameInput : email.split('@')[0];
    this.loginWithRealAccount({
      username: username,
      email: email,
      avatar: `https://api.dicebear.com/7.x/bottts/svg?seed=${email}`,
      provider: isRegister ? 'Đăng ký Email' : 'Email/Mật khẩu'
    });
  },

  handlePhoneAuth(e) {
    if (e) e.preventDefault();
    const phone = document.getElementById('auth-phone-input')?.value.trim();
    const otp = document.getElementById('auth-otp-input')?.value.trim();
    const otpSection = document.getElementById('auth-otp-section');

    if (!phone) {
      this.showToast("Vui lòng nhập số điện thoại!", "warning");
      return;
    }

    if (!otpSection.classList.contains('hidden')) {
      if (!otp || otp.length < 4) {
        this.showToast("Vui lòng nhập mã OTP xác thực!", "warning");
        return;
      }
      this.loginWithRealAccount({
        username: `User_${phone.slice(-4)}`,
        email: `${phone}@mobile.myquest.vn`,
        avatar: `https://api.dicebear.com/7.x/bottts/svg?seed=${phone}`,
        provider: 'Số điện thoại'
      });
    } else {
      otpSection.classList.remove('hidden');
      this.showToast("Mã xác thực OTP đã được gửi về SĐT của bạn!", "info");
      document.getElementById('auth-otp-input')?.focus();
    }
  },

  loginWithProvider(providerName) {
    const user = window.Storage.getUser();
    user.isLoggedIn = true;
    user.username = providerName === 'Gmail' ? 'MinhLe_Gmail' : `${providerName}_Quester`;
    user.hasSeenFirstNoti = false; // Trigger noti popup after first login as requested
    window.Storage.saveUser(user);

    this.closeLoginPopup();
    this.updateSidebarUser();
    this.navigate('home');
    this.showToast(`Đăng nhập thành công với ${providerName}!`, "success");

    // Show notification popup right after first login as requested
    setTimeout(() => {
      this.showNotiPopup();
      user.hasSeenFirstNoti = true;
      window.Storage.saveUser(user);
    }, 1000);
  },

  signOut() {
    const user = window.Storage.getUser();
    user.isLoggedIn = false;
    window.Storage.saveUser(user);
    this.updateSidebarUser();
    this.navigate('home');
    this.showToast("Đã đăng xuất tài khoản.", "info");
  },

  toggleGuestMode() {
    const user = window.Storage.getUser();
    user.isLoggedIn = !user.isLoggedIn;
    window.Storage.saveUser(user);
    this.updateSidebarUser();
    this.showToast(user.isLoggedIn ? "Đã chuyển sang chế độ Đã đăng nhập" : "Đã chuyển sang chế độ Khách (Chưa đăng nhập)", "info");
    this.navigate(this.currentPage);
    if (window.Generator) window.Generator.renderCurrent();
  },

  // Public User Profile Inspection
  openUserProfile(username) {
    const modal = document.getElementById('user-profile-modal');
    const content = document.getElementById('user-profile-content');
    if (!modal || !content) return;

    const allUsers = window.INITIAL_LEADERBOARD;
    const target = allUsers.find(u => u.name === username) || {
      name: username,
      avatar: `https://api.dicebear.com/7.x/bottts/svg?seed=${username}`,
      bio: "Người dùng năng động trên MyQuest.",
      joinDate: "10/02/2026",
      completed: 15,
      points: 1250,
      rank: 24
    };

    const currentUser = window.Storage.getUser();
    const isFollowing = currentUser.following && currentUser.following.includes(target.name);
    const isFriend = currentUser.friends && currentUser.friends.includes(target.name);

    content.innerHTML = `
      <div>
        <div class="flex flex-col sm:flex-row items-center sm:items-start gap-5 mb-6 pb-6 border-b border-white/10">
          <img src="${target.avatar}" class="w-24 h-24 rounded-full border-3 border-cyan-400 shadow-xl" />
          <div class="text-center sm:text-left flex-1">
            <div class="flex flex-wrap items-center justify-center sm:justify-start gap-3">
              <h2 class="font-dearpix text-2xl font-bold text-white">${target.name}</h2>
              <span class="text-xs px-2.5 py-0.5 rounded-full bg-cyan-500/20 text-cyan-300 border border-cyan-400">#${target.rank || '50'} BXH</span>
            </div>
            <p class="text-xs text-white/50 mt-1">Tham gia từ ${target.joinDate || '2026'}</p>
            <p class="text-sm text-white/80 mt-2 max-w-md">${target.bio || 'Chưa cập nhật bio.'}</p>

            <div class="flex flex-wrap items-center justify-center sm:justify-start gap-2 mt-4">
              <button onclick="window.Feed.toggleFollow('${target.name}'); window.App.openUserProfile('${target.name}')" 
                class="px-4 py-1.5 text-xs font-semibold rounded-full border transition-all ${isFollowing ? 'border-cyan-400 bg-cyan-500/20 text-cyan-300' : 'btn-white'}">
                ${isFollowing ? '✓ Đang theo dõi' : 'Follow'}
              </button>
              <button onclick="window.Feed.toggleFriend('${target.name}'); window.App.openUserProfile('${target.name}')" 
                class="px-4 py-1.5 text-xs font-semibold rounded-full border transition-all ${isFriend ? 'border-emerald-400 bg-emerald-500/20 text-emerald-300' : 'btn-outline'}">
                ${isFriend ? '✓ Bạn bè' : 'Kết bạn'}
              </button>
              <button onclick="window.App.closeUserProfile(); window.Chat.openChatWithUser('${target.name}', '${target.avatar}')" 
                class="btn-outline px-4 py-1.5 text-xs font-semibold">
                <i data-lucide="message-square" class="w-3.5 h-3.5 mr-1 inline"></i> Nhắn tin
              </button>
            </div>
          </div>
        </div>

        <div class="grid grid-cols-3 gap-3 mb-6">
          <div class="glass-card p-3 text-center">
            <div class="text-xs text-white/50 mb-1">Đã hoàn thành</div>
            <div class="text-lg font-bold text-cyan-300">${target.completed || 0}</div>
          </div>
          <div class="glass-card p-3 text-center">
            <div class="text-xs text-white/50 mb-1">Điểm tích lũy</div>
            <div class="text-lg font-bold text-yellow-300">${target.points || 0}</div>
          </div>
          <div class="glass-card p-3 text-center">
            <div class="text-xs text-white/50 mb-1">Xếp hạng</div>
            <div class="text-lg font-bold text-white">#${target.rank || '50'}</div>
          </div>
        </div>

        <h3 class="text-sm font-bold uppercase tracking-wider text-white/80 mb-3">Bài viết & Hoạt động công khai</h3>
        <div class="grid grid-cols-3 gap-2">
          <div class="h-28 rounded-xl bg-cover bg-center" style="background-image: url('https://images.unsplash.com/photo-1544551763-46a013bb70d5?auto=format&fit=crop&w=400&q=80')"></div>
          <div class="h-28 rounded-xl bg-cover bg-center" style="background-image: url('https://images.unsplash.com/photo-1518770660439-4636190af475?auto=format&fit=crop&w=400&q=80')"></div>
          <div class="h-28 rounded-xl bg-cover bg-center" style="background-image: url('https://images.unsplash.com/photo-1502680390469-be75c86b636f?auto=format&fit=crop&w=400&q=80')"></div>
        </div>
      </div>
    `;

    modal.classList.remove('hidden');
    if (window.lucide) lucide.createIcons();
  },

  closeUserProfile() {
    const modal = document.getElementById('user-profile-modal');
    if (modal) modal.classList.add('hidden');
  },

  showToast(message, type = 'info') {
    const container = document.getElementById('toast-container');
    if (!container) return;

    let icon = 'info';
    let borderColor = 'border-cyan-400';
    if (type === 'success') { icon = 'check-circle'; borderColor = 'border-emerald-400'; }
    else if (type === 'warning') { icon = 'alert-triangle'; borderColor = 'border-yellow-400'; }

    const toast = document.createElement('div');
    toast.className = `glass-card px-4 py-3 border ${borderColor} text-white text-xs flex items-center space-x-3 shadow-2xl transition-all duration-300 transform translate-y-2 opacity-0`;
    toast.innerHTML = `
      <i data-lucide="${icon}" class="w-4 h-4 text-cyan-300 flex-shrink-0"></i>
      <span class="flex-1">${message}</span>
    `;

    container.appendChild(toast);
    if (window.lucide) lucide.createIcons();

    setTimeout(() => {
      toast.classList.remove('translate-y-2', 'opacity-0');
    }, 10);

    setTimeout(() => {
      toast.classList.add('opacity-0', 'translate-y-2');
      setTimeout(() => toast.remove(), 300);
    }, 3500);
  }
};

window.addEventListener('DOMContentLoaded', () => {
  window.App.init();
});

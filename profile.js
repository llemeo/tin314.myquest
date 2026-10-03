/**
 * Profile Module (Trang Hồ Sơ Của Tôi)
 * Features dynamic stats bound to real data, activity tracking with 4 statuses,
 * "Chia sẻ trải nghiệm để nhận điểm" flow, profile edit modal,
 * and shared posts tabbed grid (KẾT NỐI | BẢNG TIN).
 */

window.Profile = {
  activeSharedTab: 'connection', // 'connection' or 'feed'

  init() {
    this.render();
  },

  switchSharedTab(tab) {
    this.activeSharedTab = tab;
    const btnConn = document.getElementById('profile-tab-connection');
    const btnFeed = document.getElementById('profile-tab-feed');
    if (tab === 'connection') {
      btnConn.className = "text-white font-bold border-b-2 border-cyan-400 pb-1";
      btnFeed.className = "text-white/60 hover:text-white pb-1";
    } else {
      btnConn.className = "text-white/60 hover:text-white pb-1";
      btnFeed.className = "text-white font-bold border-b-2 border-cyan-400 pb-1";
    }
    this.renderSharedPosts();
  },

  render() {
    const user = window.Storage.getUser();

    // Elements
    const avatarEl = document.getElementById('profile-avatar');
    const nameEl = document.getElementById('profile-username');
    const dateEl = document.getElementById('profile-join-date');
    const bioEl = document.getElementById('profile-bio');

    const statCompletedEl = document.getElementById('stat-completed-count');
    const statPointsEl = document.getElementById('stat-points-count');
    const statRankEl = document.getElementById('stat-rank-text');

    if (avatarEl) avatarEl.src = user.avatar;
    if (nameEl) nameEl.textContent = user.username;
    if (dateEl) dateEl.textContent = `Đã tham gia từ ngày ${user.joinDate || '01/01/2026'}`;
    if (bioEl) bioEl.textContent = user.bio || "Chưa có tiểu sử.";

    // Real dynamic stats calculation per user specification
    const completedQuests = (user.activities || []).filter(a => a.status === 'Đã hoàn thành' || a.status === 'Đã chia sẻ trải nghiệm');
    const completedCount = completedQuests.length;

    if (statCompletedEl) statCompletedEl.textContent = completedCount;
    if (statPointsEl) statPointsEl.textContent = user.points;
    if (statRankEl) statRankEl.textContent = "#110";

    this.renderActivities();
    this.renderSharedPosts();
  },

  renderActivities() {
    const user = window.Storage.getUser();
    const container = document.getElementById('profile-activities-list');
    if (!container) return;

    if (!user.activities || user.activities.length === 0) {
      container.innerHTML = `<p class="text-xs text-white/50 italic py-2">Bạn chưa tham gia hoạt động nào.</p>`;
      return;
    }

    container.innerHTML = user.activities.map(act => {
      let statusColor = "bg-cyan-500/20 text-cyan-300 border-cyan-400";
      if (act.status === "Đang chờ được duyệt") {
        statusColor = "bg-amber-500/20 text-amber-300 border-amber-400";
      } else if (act.status === "Đã hoàn thành") {
        statusColor = "bg-emerald-500/20 text-emerald-300 border-emerald-400";
      } else if (act.status === "Đã chia sẻ trải nghiệm") {
        statusColor = "bg-purple-500/20 text-purple-300 border-purple-400";
      }

      return `
        <div class="glass-card p-3 flex flex-col md:flex-row items-start md:items-center justify-between gap-2 hover:border-cyan-400/40 transition-all">
          <div class="cursor-pointer" onclick="window.Connection.openDetail('${act.questId}')">
            <div class="text-sm font-bold text-white hover:text-cyan-300 transition-colors">${act.title}</div>
            <div class="text-[11px] text-white/50">${act.category} • Tham gia: ${act.joinedDate}</div>
          </div>
          
          <div class="flex items-center space-x-2">
            <span class="text-xs px-2.5 py-1 rounded-full border ${statusColor} font-medium whitespace-nowrap">
              ${act.status}
            </span>

            ${act.status === "Đã hoàn thành" ? `
              <button onclick="window.Profile.openShareReviewModal('${act.id}')" 
                class="btn-white px-3 py-1 text-[11px] font-bold text-emerald-950 bg-emerald-300 hover:bg-emerald-400 whitespace-nowrap">
                Chia sẻ trải nghiệm (+25đ)
              </button>
            ` : ''}
          </div>
        </div>
      `;
    }).join('');
  },

  renderSharedPosts() {
    const container = document.getElementById('profile-shared-grid');
    if (!container) return;
    const user = window.Storage.getUser();

    if (this.activeSharedTab === 'connection') {
      const myQuests = user.myCreatedQuests || [];
      if (myQuests.length === 0) {
        container.innerHTML = `<div class="col-span-3 text-center py-8 text-white/50 text-sm">Bạn chưa đăng bài viết nào trong Kết nối.</div>`;
        return;
      }

      container.innerHTML = myQuests.map(q => `
        <div class="glass-card overflow-hidden group cursor-pointer hover:border-cyan-400 transition-all" onclick="window.Connection.openDetail('${q.id}')">
          <div class="h-32 bg-cover bg-center relative" style="background-image: url('${q.thumbnail}')">
            <div class="absolute inset-0 bg-black/40 group-hover:bg-black/20 transition-all"></div>
            <span class="absolute top-2 left-2 text-[10px] px-2 py-0.5 rounded-full font-bold ${q.difficulty === 'Khó' ? 'tag-kho' : 'tag-de'}">${q.difficulty}</span>
            <button onclick="event.stopPropagation(); window.Profile.openManageApplicants('${q.id}')" 
              class="absolute bottom-2 right-2 text-[10px] px-2.5 py-1 rounded-full bg-cyan-900/90 hover:bg-cyan-800 text-cyan-300 border border-cyan-400 transition-colors shadow">
              ${q.applicants ? q.applicants.length : 0} đơn đăng ký
            </button>
          </div>
          <div class="p-3">
            <h4 class="text-xs font-bold text-white truncate group-hover:text-cyan-300 transition-colors">${q.title}</h4>
            <p class="text-[11px] text-white/60 mt-1">${q.timeframe} • ${q.location}</p>
            <div class="mt-2 text-[11px] text-cyan-300 font-semibold flex items-center justify-between">
              <span>Xem chi tiết quest</span>
              <span>→</span>
            </div>
          </div>
        </div>
      `).join('');
    } else {
      // Feed reviews posted by user
      const posts = window.Storage.getPosts().filter(p => p.author.name === user.username);
      if (posts.length === 0) {
        container.innerHTML = `<div class="col-span-3 text-center py-8 text-white/50 text-sm">Bạn chưa có bài viết đánh giá trải nghiệm nào trên Bảng tin.</div>`;
        return;
      }

      container.innerHTML = posts.map(p => `
        <div class="glass-card overflow-hidden group cursor-pointer hover:border-cyan-400 transition-all" onclick="window.Profile.openPostDetail('${p.id}')">
          <div class="h-32 bg-cover bg-center relative" style="background-image: url('${p.images[0]}')">
            <div class="absolute inset-0 bg-black/40 group-hover:bg-black/20 transition-all"></div>
            <span class="absolute top-2 right-2 text-[10px] tag-pill bg-black/60">#${p.tag}</span>
            <div class="absolute bottom-2 left-2 text-[11px] text-white font-medium flex items-center space-x-2">
              <span>❤️ ${p.likesCount}</span>
              <span>💬 ${p.comments ? p.comments.length : 0}</span>
            </div>
          </div>
          <div class="p-3">
            <p class="text-xs text-white/80 line-clamp-2">${p.description}</p>
            <div class="mt-2 text-[11px] text-cyan-300 font-semibold flex items-center justify-between">
              <span>Xem chi tiết bài viết</span>
              <span>→</span>
            </div>
          </div>
        </div>
      `).join('');
    }
  },

  openEditModal() {
    const user = window.Storage.getUser();
    const modal = document.getElementById('profile-edit-modal');
    const nameInput = document.getElementById('edit-username');
    const bioInput = document.getElementById('edit-bio');
    if (!modal) return;

    if (nameInput) nameInput.value = user.username;
    if (bioInput) bioInput.value = user.bio || '';
    modal.classList.remove('hidden');
  },

  closeEditModal() {
    const modal = document.getElementById('profile-edit-modal');
    if (modal) modal.classList.add('hidden');
  },

  saveProfile(e) {
    if (e) e.preventDefault();
    const user = window.Storage.getUser();
    const nameInput = document.getElementById('edit-username');
    const bioInput = document.getElementById('edit-bio');

    const newName = nameInput?.value.trim();
    const newBio = bioInput?.value.trim();

    if (newName) user.username = newName;
    if (newBio !== undefined) user.bio = newBio;

    window.Storage.saveUser(user);
    this.closeEditModal();
    this.render();
    window.App.updateSidebarUser();
    window.App.showToast("Cập nhật thông tin hồ sơ thành công!", "success");
  },

  // Post Detail Modal Handler (Xem chi tiết bài viết từ Profile)
  activePostDetail: null,
  openPostDetail(postId) {
    const posts = window.Storage.getPosts();
    const post = posts.find(p => p.id === postId);
    if (!post) return;

    this.activePostDetail = post;
    const modal = document.getElementById('post-detail-modal');
    const content = document.getElementById('post-detail-content');
    if (!modal || !content) return;

    const user = window.Storage.getUser();
    const isLiked = post.isLiked;

    content.innerHTML = `
      <div class="space-y-4">
        <!-- Post Header -->
        <div class="flex items-center justify-between border-b border-white/10 pb-3">
          <div class="flex items-center space-x-3 cursor-pointer" onclick="window.App.openUserProfile('${post.author.name}')">
            <img src="${post.author.avatar}" class="w-11 h-11 rounded-full border-2 border-cyan-400" />
            <div>
              <div class="font-bold text-white text-sm hover:text-cyan-300">${post.author.name}</div>
              <div class="text-[11px] text-white/50">${post.time || 'Vừa xong'} • #${post.tag}</div>
            </div>
          </div>
          <span class="tag-pill bg-cyan-900/40 border-cyan-400 text-cyan-300 text-xs">
            #${post.tag}
          </span>
        </div>

        <!-- Completed Quest Badge -->
        ${post.questCompleted ? `
          <div class="p-2.5 rounded-xl bg-emerald-500/10 border border-emerald-400/40 flex items-center space-x-2 text-xs">
            <span class="text-emerald-400 font-bold">✓ Đã hoàn thành sidequest:</span>
            <span class="text-white font-medium truncate">${post.questCompleted}</span>
          </div>
        ` : ''}

        <!-- Post Content / Text -->
        <p class="text-sm text-white/90 leading-relaxed whitespace-pre-line">
          ${post.description}
        </p>

        <!-- Media Gallery (Images & Videos) -->
        ${post.videos && post.videos.length > 0 ? `
          <div class="rounded-xl overflow-hidden bg-black/60 max-h-72 flex items-center justify-center">
            <video src="${post.videos[0]}" controls class="max-h-72 w-full object-contain"></video>
          </div>
        ` : ''}

        ${post.images && post.images.length > 0 ? `
          <div class="grid ${post.images.length > 1 ? 'grid-cols-2' : 'grid-cols-1'} gap-2 rounded-xl overflow-hidden">
            ${post.images.map((img, idx) => `
              <div class="relative ${post.images.length === 1 ? 'h-64' : 'h-44'} bg-black/40 rounded-lg overflow-hidden group">
                <img src="${img}" class="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300 cursor-pointer" 
                  onclick="window.open('${img}', '_blank')" title="Xem ảnh gốc" />
              </div>
            `).join('')}
          </div>
        ` : ''}

        <!-- Likes & Comments Bar -->
        <div class="flex items-center justify-between py-2 border-y border-white/10 text-xs">
          <div class="flex items-center space-x-4">
            <button onclick="window.Profile.toggleLikePostDetail('${post.id}')" 
              class="flex items-center space-x-1.5 transition-colors ${isLiked ? 'text-rose-400 font-bold' : 'text-white/70 hover:text-rose-300'}">
              <span>${isLiked ? '❤️' : '🤍'}</span>
              <span>${post.likesCount || 0} Yêu thích</span>
            </button>
            <span class="text-white/50">•</span>
            <span class="text-white/70">💬 ${(post.comments || []).length} Bình luận</span>
          </div>
          <button onclick="window.Profile.closePostDetail(); window.Feed.openShareModal('${post.id}')" 
            class="text-xs text-cyan-300 hover:text-cyan-200 flex items-center space-x-1">
            <span>🔗 Chia sẻ</span>
          </button>
        </div>

        <!-- Comments Section -->
        <div>
          <h4 class="text-xs font-bold uppercase tracking-wider text-white/70 mb-2">Bình luận</h4>
          <div id="post-detail-comments-list" class="space-y-2 max-h-48 overflow-y-auto pr-1">
            ${(!post.comments || post.comments.length === 0) ? `
              <p class="text-xs text-white/40 italic py-2">Chưa có bình luận nào. Hãy là người đầu tiên!</p>
            ` : post.comments.map(c => `
              <div class="glass-card p-2.5 flex items-start space-x-2.5">
                <img src="${c.avatar || 'https://api.dicebear.com/7.x/bottts/svg?seed=' + c.author}" class="w-7 h-7 rounded-full border border-white/20 mt-0.5" />
                <div class="flex-1 min-w-0">
                  <div class="flex items-center justify-between">
                    <span class="font-bold text-white text-xs">${c.author}</span>
                    <span class="text-[10px] text-white/40">${c.time || 'Vừa xong'}</span>
                  </div>
                  <p class="text-xs text-white/80 mt-0.5 leading-relaxed">${c.text}</p>
                </div>
              </div>
            `).join('')}
          </div>

          <!-- Add Comment Input -->
          <form onsubmit="window.Profile.submitCommentInDetail(event, '${post.id}')" class="flex items-center space-x-2 pt-3">
            <input id="post-detail-comment-input" type="text" required placeholder="Viết bình luận của bạn..." 
              class="flex-1 glass-input px-3.5 py-2 text-xs text-white placeholder-white/50" />
            <button type="submit" class="btn-white px-5 py-2 text-xs font-bold uppercase font-dearpix">Gửi</button>
          </form>
        </div>
      </div>
    `;

    modal.classList.remove('hidden');
    if (window.lucide) lucide.createIcons();
  },

  closePostDetail() {
    const modal = document.getElementById('post-detail-modal');
    if (modal) modal.classList.add('hidden');
    this.activePostDetail = null;
  },

  toggleLikePostDetail(postId) {
    const posts = window.Storage.getPosts();
    const post = posts.find(p => p.id === postId);
    if (!post) return;

    if (post.isLiked) {
      post.isLiked = false;
      post.likesCount = Math.max(0, (post.likesCount || 1) - 1);
    } else {
      post.isLiked = true;
      post.likesCount = (post.likesCount || 0) + 1;
    }
    window.Storage.savePosts(posts);
    this.openPostDetail(postId);
    this.renderSharedPosts();
    if (window.Feed) window.Feed.renderPosts();
  },

  submitCommentInDetail(e, postId) {
    if (e) e.preventDefault();
    const user = window.Storage.getUser();
    const input = document.getElementById('post-detail-comment-input');
    const text = input?.value.trim();
    if (!text) return;

    const posts = window.Storage.getPosts();
    const post = posts.find(p => p.id === postId);
    if (!post) return;

    post.comments = post.comments || [];
    post.comments.push({
      author: user.username,
      avatar: user.avatar,
      text: text,
      time: "Vừa xong"
    });

    window.Storage.savePosts(posts);
    input.value = '';
    this.openPostDetail(postId);
    this.renderSharedPosts();
    if (window.Feed) window.Feed.renderPosts();
    window.App.showToast("Đã gửi bình luận!", "success");
  },

  // Share Completed Quest Review to Bảng Tin with Media Attachment
  activeActivityToReview: null,
  attachedMedia: [],

  handleFileSelect(e) {
    const files = Array.from(e.target.files || []);
    if (!files.length) return;

    files.forEach(file => {
      const isVideo = file.type.startsWith('video');
      const reader = new FileReader();
      reader.onload = (event) => {
        this.attachedMedia.push({
          type: isVideo ? 'video' : 'image',
          url: event.target.result,
          name: file.name
        });
        this.renderAttachedMediaPreviews();
      };
      reader.readAsDataURL(file);
    });

    e.target.value = '';
  },

  removeAttachedMedia(index) {
    this.attachedMedia.splice(index, 1);
    this.renderAttachedMediaPreviews();
  },

  renderAttachedMediaPreviews() {
    const container = document.getElementById('review-media-previews');
    const countEl = document.getElementById('review-media-count');
    if (countEl) countEl.textContent = `${this.attachedMedia.length} tệp đã chọn`;
    if (!container) return;

    if (this.attachedMedia.length === 0) {
      container.innerHTML = '';
      return;
    }

    container.innerHTML = this.attachedMedia.map((m, idx) => `
      <div class="relative group rounded-xl overflow-hidden border border-white/20 aspect-square bg-black/40">
        ${m.type === 'video' ? `
          <video src="${m.url}" class="w-full h-full object-cover" muted></video>
          <div class="absolute inset-0 flex items-center justify-center bg-black/40 pointer-events-none">
            <span class="px-2 py-0.5 rounded-full bg-black/70 text-white text-[10px] font-bold">▶ Video</span>
          </div>
        ` : `
          <img src="${m.url}" class="w-full h-full object-cover" />
        `}
        <button type="button" onclick="window.Profile.removeAttachedMedia(${idx})" 
          class="absolute top-1 right-1 w-5 h-5 rounded-full bg-rose-600 hover:bg-rose-700 text-white text-xs flex items-center justify-center shadow-lg">
          ✕
        </button>
      </div>
    `).join('');
  },

  openShareReviewModal(activityId) {
    const user = window.Storage.getUser();
    const act = (user.activities || []).find(a => a.id === activityId);
    if (!act) return;
    this.activeActivityToReview = act;
    this.attachedMedia = [];
    this.renderAttachedMediaPreviews();

    const descInput = document.getElementById('review-content');
    if (descInput) descInput.value = '';

    const modal = document.getElementById('share-review-modal');
    const questNameEl = document.getElementById('review-quest-name');
    if (questNameEl) questNameEl.textContent = act.title;
    if (modal) modal.classList.remove('hidden');
    if (window.lucide) lucide.createIcons();
  },

  closeShareReviewModal() {
    const modal = document.getElementById('share-review-modal');
    if (modal) modal.classList.add('hidden');
    this.activeActivityToReview = null;
    this.attachedMedia = [];
  },

  submitReviewPost(e) {
    if (e) {
      e.preventDefault();
      e.stopPropagation();
    }
    const user = window.Storage.getUser();
    
    // Find target completed activity
    let act = null;
    if (this.activeActivityToReview && this.activeActivityToReview.id) {
      act = (user.activities || []).find(a => a.id === this.activeActivityToReview.id);
    }
    if (!act) {
      act = (user.activities || []).find(a => a.status === 'Đã hoàn thành');
    }
    if (!act) {
      act = {
        id: `act_${Date.now()}`,
        questId: "sq_1",
        title: "Chụp 10 khoảnh khắc bình minh thành phố",
        difficulty: "Dễ",
        category: "Sáng tạo",
        timeframe: "Đã qua",
        status: "Đã hoàn thành",
        joinedDate: "25/09/2026",
        completedDate: "26/09/2026",
        sharedReview: false
      };
      user.activities = user.activities || [];
      user.activities.push(act);
    }

    const descInput = document.getElementById('review-content');
    const desc = descInput?.value.trim();
    if (!desc) {
      window.App.showToast("Vui lòng viết vài dòng cảm nhận trải nghiệm!", "warning");
      descInput?.focus();
      return;
    }

    const media = Array.isArray(this.attachedMedia) ? this.attachedMedia : [];
    const images = media.filter(m => m.type === 'image').map(m => m.url);
    const videos = media.filter(m => m.type === 'video').map(m => m.url);

    const defaultImages = [
      "https://images.unsplash.com/photo-1502680390469-be75c86b636f?auto=format&fit=crop&w=800&q=80",
      "https://images.unsplash.com/photo-1476480862126-209bfaa8edc8?auto=format&fit=crop&w=800&q=80"
    ];

    const newPost = {
      id: `post-${Date.now()}`,
      author: {
        name: user.username,
        avatar: user.avatar,
        isFollowing: false,
        isFriend: false
      },
      time: "Vừa xong",
      tag: act.category || "Trải nghiệm",
      questCompleted: act.title,
      description: desc,
      images: images.length > 0 ? images : (videos.length > 0 ? [] : defaultImages),
      videos: videos,
      likesCount: 1,
      isLiked: false,
      comments: [],
      sharesCount: 0
    };

    // Update activity status to "Đã chia sẻ trải nghiệm"
    act.status = "Đã chia sẻ trải nghiệm";
    act.sharedReview = true;
    user.points = (user.points || 0) + 25; // Bonus reward points
    window.Storage.saveUser(user);

    const posts = window.Storage.getPosts();
    posts.unshift(newPost);
    window.Storage.savePosts(posts);

    this.closeShareReviewModal();
    this.render();
    window.App.updateSidebarUser();
    window.App.showToast("Chúc mừng! Bạn đã nhận được +25 điểm thưởng và bài viết đã lên Bảng tin!", "success");
    window.App.navigate('feed');
  },

  // Manage applicants for user's posted quest
  openManageApplicants(questId) {
    const user = window.Storage.getUser();
    const quest = (user.myCreatedQuests || []).find(q => q.id === questId);
    if (!quest) return;

    const modal = document.getElementById('manage-applicants-modal');
    const content = document.getElementById('applicants-list-content');
    const titleEl = document.getElementById('manage-quest-title');
    if (!modal || !content) return;

    if (titleEl) titleEl.textContent = `Duyệt người tham gia: ${quest.title}`;

    if (!quest.applicants || quest.applicants.length === 0) {
      content.innerHTML = `<p class="text-sm text-white/50 text-center py-6">Chưa có ai đăng ký tham gia quest này.</p>`;
    } else {
      content.innerHTML = quest.applicants.map(app => `
        <div class="flex items-center justify-between p-3 rounded-xl bg-white/5 border border-white/10">
          <div class="flex items-center space-x-3">
            <img src="${app.avatar}" class="w-9 h-9 rounded-full border border-white/20" />
            <div>
              <span class="text-sm font-bold text-white">${app.name}</span>
              <span class="text-xs block text-white/50">Trạng thái: ${app.status === 'approved' ? '<span class="text-emerald-300">Đã duyệt</span>' : '<span class="text-amber-300">Chờ duyệt</span>'}</span>
            </div>
          </div>
          <div>
            ${app.status !== 'approved' ? `
              <button onclick="window.Profile.approveUserInQuest('${quest.id}', '${app.name}')" 
                class="btn-white px-4 py-1.5 text-xs">
                Duyệt
              </button>
            ` : '<span class="text-xs text-emerald-400 font-bold">✓ Đã tham gia</span>'}
          </div>
        </div>
      `).join('');
    }

    modal.classList.remove('hidden');
  },

  closeManageApplicants() {
    const modal = document.getElementById('manage-applicants-modal');
    if (modal) modal.classList.add('hidden');
  },

  approveUserInQuest(questId, applicantName) {
    window.Connection.approveApplicant(questId, applicantName);
    this.openManageApplicants(questId);
  }
};

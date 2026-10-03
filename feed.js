/**
 * Feed Module (Trang Bảng Tin)
 * Manages post streams across tabs (Xu hướng, Quan tâm, Bạn bè),
 * keyword search across posts and usernames,
 * follow and friend toggles, image carousel controls,
 * Like, Comment, and multi-channel Share modal.
 */

window.Feed = {
  currentTab: 'trending', // 'trending', 'following', 'friends'
  activeCarouselIndices: {},
  activePostForComment: null,
  activePostForShare: null,

  init() {
    this.renderPosts();
  },

  switchTab(tab) {
    this.currentTab = tab;
    const tabs = ['trending', 'following', 'friends'];
    tabs.forEach(t => {
      const btn = document.getElementById(`feed-tab-${t}`);
      if (btn) {
        if (t === tab) {
          btn.className = "text-white font-bold border-b-2 border-cyan-400 pb-1";
        } else {
          btn.className = "text-white/60 hover:text-white pb-1";
        }
      }
    });
    this.renderPosts();
  },

  renderPosts() {
    const feedContainer = document.getElementById('feed-posts-container');
    if (!feedContainer) return;

    const user = window.Storage.getUser();
    const posts = window.Storage.getPosts();
    const searchQuery = document.getElementById('feed-search-input')?.value.toLowerCase().trim() || '';

    let filtered = posts.filter(post => {
      // Tab filter
      if (this.currentTab === 'following') {
        const isFollowed = user.following && user.following.includes(post.author.name);
        if (!isFollowed && post.author.name !== user.username) return false;
      } else if (this.currentTab === 'friends') {
        const isFriend = user.friends && user.friends.includes(post.author.name);
        if (!isFriend && post.author.name !== user.username) return false;
      }

      // Search query filter
      if (searchQuery) {
        const matchDesc = post.description.toLowerCase().includes(searchQuery);
        const matchAuthor = post.author.name.toLowerCase().includes(searchQuery);
        const matchTag = post.tag.toLowerCase().includes(searchQuery);
        const matchQuest = (post.questCompleted || '').toLowerCase().includes(searchQuery);
        if (!matchDesc && !matchAuthor && !matchTag && !matchQuest) return false;
      }

      return true;
    });

    if (filtered.length === 0) {
      feedContainer.innerHTML = `
        <div class="glass-card p-12 text-center text-white/70">
          <i data-lucide="newspaper" class="w-12 h-12 mx-auto mb-4 text-cyan-400 opacity-60"></i>
          <p class="text-lg font-semibold">Chưa có bài viết nào trong mục này!</p>
          <p class="text-sm mt-1 text-white/50">${this.currentTab === 'friends' ? 'Hãy kết thêm bạn để xem trải nghiệm của họ.' : (this.currentTab === 'following' ? 'Hãy theo dõi thêm người dùng để xem bảng tin.' : 'Không tìm thấy bài viết phù hợp từ khóa.')}</p>
        </div>
      `;
      if (window.lucide) lucide.createIcons();
      return;
    }

    feedContainer.innerHTML = filtered.map(post => {
      const isFollowing = user.following && user.following.includes(post.author.name);
      const isFriend = user.friends && user.friends.includes(post.author.name);
      const isMe = user.username === post.author.name;

      if (this.activeCarouselIndices[post.id] === undefined) {
        this.activeCarouselIndices[post.id] = 0;
      }
      const activeIdx = this.activeCarouselIndices[post.id];
      const currentImg = post.images[activeIdx] || post.images[0];

      return `
        <div class="glass-card p-6 relative">
          <!-- Top Right Tag as requested -->
          <div class="absolute top-6 right-6 z-10">
            <span class="tag-pill bg-white/10 border-white/20 text-cyan-300">
              #${post.tag}
            </span>
          </div>

          <!-- Author Header -->
          <div class="flex items-center space-x-3 mb-4 pr-24">
            <div class="relative cursor-pointer" onclick="window.App.openUserProfile('${post.author.name}')">
              <img src="${post.author.avatar}" class="w-12 h-12 rounded-full border-2 border-white/30" />
              ${!isMe ? `
                <button onclick="event.stopPropagation(); window.Feed.toggleFollow('${post.author.name}')" 
                  title="${isFollowing ? 'Bỏ theo dõi' : 'Theo dõi'}"
                  class="absolute -bottom-1 -right-1 w-5 h-5 rounded-full ${isFollowing ? 'bg-cyan-500' : 'bg-white'} text-[#0B0050] flex items-center justify-center font-bold text-xs shadow-md">
                  ${isFollowing ? '✓' : '+'}
                </button>
              ` : ''}
            </div>
            <div>
              <div class="flex items-center space-x-2">
                <span class="font-bold text-white text-base cursor-pointer hover:text-cyan-300" onclick="window.App.openUserProfile('${post.author.name}')">
                  ${post.author.name}
                </span>
                ${!isMe ? `
                  <button onclick="window.Feed.toggleFriend('${post.author.name}')" 
                    class="text-xs px-2.5 py-0.5 rounded-full border transition-all ${isFriend ? 'border-emerald-400 text-emerald-300 bg-emerald-500/10' : 'border-white/40 text-white/80 hover:border-white'}">
                    ${isFriend ? '✓ Bạn bè' : '+ Add friend'}
                  </button>
                ` : '<span class="text-xs text-white/50">(Bạn)</span>'}
              </div>
              <div class="text-xs text-white/50 flex items-center gap-1.5 mt-0.5">
                <span>${post.time}</span>
                ${post.questCompleted ? `<span>• Hoàn thành: <strong class="text-cyan-300 font-medium">${post.questCompleted}</strong></span>` : ''}
              </div>
            </div>
          </div>

          <!-- Description -->
          <p class="text-sm text-white/85 leading-relaxed mb-4">
            ${post.description}
          </p>

          <!-- Image Carousel -->
          <div class="relative w-full h-80 rounded-2xl overflow-hidden bg-black/40 mb-4 group border border-white/10">
            <img src="${currentImg}" class="w-full h-full object-cover transition-all duration-300" />
            
            ${post.images.length > 1 ? `
              <!-- Left Arrow -->
              <button onclick="window.Feed.prevImage('${post.id}')" 
                class="absolute left-3 top-1/2 -translate-y-1/2 w-9 h-9 rounded-full bg-black/60 text-white flex items-center justify-center border border-white/20 opacity-0 group-hover:opacity-100 transition-opacity">
                ‹
              </button>
              <!-- Right Arrow -->
              <button onclick="window.Feed.nextImage('${post.id}')" 
                class="absolute right-3 top-1/2 -translate-y-1/2 w-9 h-9 rounded-full bg-black/60 text-white flex items-center justify-center border border-white/20 opacity-80 group-hover:opacity-100 transition-opacity">
                ›
              </button>
              <!-- Dots -->
              <div class="absolute bottom-3 left-1/2 -translate-x-1/2 flex space-x-1.5">
                ${post.images.map((_, i) => `
                  <div class="w-2 h-2 rounded-full ${i === activeIdx ? 'bg-cyan-400 w-4' : 'bg-white/40'} transition-all"></div>
                `).join('')}
              </div>
            ` : ''}
          </div>

          <!-- Action Buttons: Like, Comment, Share -->
          <div class="flex items-center justify-between pt-3 border-t border-white/10 text-sm">
            <div class="flex items-center space-x-6">
              <!-- Like -->
              <button onclick="window.Feed.toggleLike('${post.id}')" class="flex items-center space-x-1.5 transition-colors ${post.isLiked ? 'text-pink-400 font-bold' : 'text-white/70 hover:text-white'}">
                <i data-lucide="heart" class="w-4 h-4 ${post.isLiked ? 'fill-pink-400 text-pink-400' : ''}"></i>
                <span>${post.isLiked ? 'Đã thích' : 'Like'} (${post.likesCount})</span>
              </button>

              <!-- Comment -->
              <button onclick="window.Feed.openComments('${post.id}')" class="flex items-center space-x-1.5 text-white/70 hover:text-white transition-colors">
                <i data-lucide="message-circle" class="w-4 h-4"></i>
                <span>Comment (${post.comments ? post.comments.length : 0})</span>
              </button>
            </div>

            <!-- Share -->
            <button onclick="window.Feed.openShareModal('${post.id}')" class="flex items-center space-x-1.5 text-white/70 hover:text-cyan-300 transition-colors">
              <i data-lucide="share-2" class="w-4 h-4"></i>
              <span>Share (${post.sharesCount || 0})</span>
            </button>
          </div>
        </div>
      `;
    }).join('');

    if (window.lucide) lucide.createIcons();
  },

  nextImage(postId) {
    const posts = window.Storage.getPosts();
    const post = posts.find(p => p.id === postId);
    if (!post || !post.images) return;
    const current = this.activeCarouselIndices[postId] || 0;
    this.activeCarouselIndices[postId] = (current + 1) % post.images.length;
    this.renderPosts();
  },

  prevImage(postId) {
    const posts = window.Storage.getPosts();
    const post = posts.find(p => p.id === postId);
    if (!post || !post.images) return;
    const current = this.activeCarouselIndices[postId] || 0;
    this.activeCarouselIndices[postId] = (current - 1 + post.images.length) % post.images.length;
    this.renderPosts();
  },

  toggleLike(postId) {
    const user = window.Storage.getUser();
    if (!user.isLoggedIn) {
      window.App.showLoginPopup();
      return;
    }
    const posts = window.Storage.getPosts();
    const post = posts.find(p => p.id === postId);
    if (!post) return;

    post.isLiked = !post.isLiked;
    post.likesCount += post.isLiked ? 1 : -1;
    window.Storage.savePosts(posts);
    this.renderPosts();
  },

  toggleFollow(username) {
    const user = window.Storage.getUser();
    if (!user.isLoggedIn) {
      window.App.showLoginPopup();
      return;
    }
    user.following = user.following || [];
    const idx = user.following.indexOf(username);
    if (idx > -1) {
      user.following.splice(idx, 1);
      window.App.showToast(`Đã bỏ theo dõi ${username}`, "info");
    } else {
      user.following.push(username);
      window.App.showToast(`Đã theo dõi ${username}!`, "success");
    }
    window.Storage.saveUser(user);
    this.renderPosts();
  },

  toggleFriend(username) {
    const user = window.Storage.getUser();
    if (!user.isLoggedIn) {
      window.App.showLoginPopup();
      return;
    }
    user.friends = user.friends || [];
    const idx = user.friends.indexOf(username);
    if (idx > -1) {
      user.friends.splice(idx, 1);
      window.App.showToast(`Đã hủy kết bạn với ${username}`, "info");
    } else {
      user.friends.push(username);
      window.App.showToast(`Đã gửi lời mời kết bạn và kết nối với ${username}!`, "success");
    }
    window.Storage.saveUser(user);
    this.renderPosts();
  },

  openComments(postId) {
    const posts = window.Storage.getPosts();
    const post = posts.find(p => p.id === postId);
    if (!post) return;
    this.activePostForComment = post;

    const modal = document.getElementById('comments-modal');
    const listEl = document.getElementById('comments-list');
    const headerEl = document.getElementById('comments-header-info');
    if (!modal || !listEl) return;

    if (headerEl) {
      headerEl.textContent = `Bình luận về bài viết của ${post.author.name}`;
    }

    listEl.innerHTML = (post.comments || []).map(c => `
      <div class="flex items-start space-x-3 p-3 rounded-xl bg-white/5 border border-white/5">
        <img src="${c.avatar}" class="w-8 h-8 rounded-full border border-white/20" />
        <div class="flex-1">
          <div class="flex items-center justify-between">
            <span class="text-xs font-bold text-white">${c.author}</span>
            <span class="text-[10px] text-white/50">${c.time}</span>
          </div>
          <p class="text-xs text-white/80 mt-1">${c.text}</p>
        </div>
      </div>
    `).join('');

    modal.classList.remove('hidden');
    if (window.lucide) lucide.createIcons();
  },

  closeComments() {
    const modal = document.getElementById('comments-modal');
    if (modal) modal.classList.add('hidden');
    this.activePostForComment = null;
  },

  submitComment(e) {
    if (e) e.preventDefault();
    const user = window.Storage.getUser();
    if (!user.isLoggedIn) {
      window.App.showLoginPopup();
      return;
    }
    if (!this.activePostForComment) return;

    const input = document.getElementById('comment-input');
    const text = input?.value.trim();
    if (!text) return;

    const newComment = {
      author: user.username,
      avatar: user.avatar,
      text: text,
      time: "Vừa xong"
    };

    this.activePostForComment.comments = this.activePostForComment.comments || [];
    this.activePostForComment.comments.push(newComment);

    const posts = window.Storage.getPosts();
    const idx = posts.findIndex(p => p.id === this.activePostForComment.id);
    if (idx > -1) {
      posts[idx] = this.activePostForComment;
      window.Storage.savePosts(posts);
    }

    input.value = '';
    this.openComments(this.activePostForComment.id);
    this.renderPosts();
    window.App.showToast("Đã gửi bình luận!", "success");
  },

  openShareModal(postId) {
    const posts = window.Storage.getPosts();
    const post = posts.find(p => p.id === postId);
    if (!post) return;
    this.activePostForShare = post;

    const modal = document.getElementById('share-modal');
    if (!modal) return;

    modal.classList.remove('hidden');
  },

  closeShareModal() {
    const modal = document.getElementById('share-modal');
    if (modal) modal.classList.add('hidden');
    this.activePostForShare = null;
  },

  shareToExternal(platform) {
    if (!this.activePostForShare) return;
    this.activePostForShare.sharesCount = (this.activePostForShare.sharesCount || 0) + 1;
    const posts = window.Storage.getPosts();
    const idx = posts.findIndex(p => p.id === this.activePostForShare.id);
    if (idx > -1) {
      posts[idx] = this.activePostForShare;
      window.Storage.savePosts(posts);
    }

    if (platform === 'copy') {
      navigator.clipboard?.writeText(window.location.href);
      window.App.showToast("Đã sao chép liên kết vào bộ nhớ tạm!", "success");
    } else {
      window.App.showToast(`Đã mở chia sẻ lên ${platform.toUpperCase()}!`, "success");
    }
    this.renderPosts();
    this.closeShareModal();
  },

  shareToChat(chatId) {
    if (!this.activePostForShare) return;
    const user = window.Storage.getUser();
    if (!user.isLoggedIn) {
      window.App.showLoginPopup();
      return;
    }

    window.Chat.sharePostIntoChat(chatId, this.activePostForShare);
    this.activePostForShare.sharesCount = (this.activePostForShare.sharesCount || 0) + 1;
    const posts = window.Storage.getPosts();
    const idx = posts.findIndex(p => p.id === this.activePostForShare.id);
    if (idx > -1) {
      posts[idx] = this.activePostForShare;
      window.Storage.savePosts(posts);
    }
    this.renderPosts();
    this.closeShareModal();
    window.App.showToast("Đã chia sẻ bài viết vào tin nhắn!", "success");
    window.App.navigate('chat');
  }
};

/**
 * Chat Module (Trang Tin Nhắn)
 * Features two-column chat, text, simulated voice notes, media/GIFs,
 * shared posts from feed/quests, call and video call overlay modals.
 */

window.Chat = {
  activeChatId: 'chat-1',
  isRecordingVoice: false,
  callTimer: null,
  callDurationSeconds: 0,

  init() {
    this.renderChatList();
    this.renderActiveConversation();
  },

  renderChatList() {
    const listContainer = document.getElementById('chat-threads-list');
    if (!listContainer) return;
    const chats = window.Storage.getChats();

    listContainer.innerHTML = chats.map(c => {
      const isActive = c.id === this.activeChatId;
      return `
        <div onclick="window.Chat.selectChat('${c.id}')" 
          class="p-3.5 rounded-2xl cursor-pointer transition-all flex items-center space-x-3 ${isActive ? 'bg-white/15 border border-cyan-400/50 shadow-lg' : 'hover:bg-white/5 border border-transparent'}">
          <div class="relative">
            <img src="${c.user.avatar}" class="w-12 h-12 rounded-full border border-white/20" />
            <span class="absolute bottom-0 right-0 w-3 h-3 rounded-full ${c.user.status === 'Online' ? 'bg-emerald-400' : 'bg-gray-400'} border-2 border-[#0B0050]"></span>
          </div>
          <div class="flex-1 min-w-0">
            <div class="flex items-center justify-between">
              <span class="font-bold text-white text-sm truncate">${c.user.name}</span>
              <span class="text-[10px] text-white/50">${c.lastTime || ''}</span>
            </div>
            <p class="text-xs text-white/60 truncate mt-0.5">${c.lastMessage || 'Chưa có tin nhắn'}</p>
          </div>
          ${c.unread ? '<span class="w-2.5 h-2.5 rounded-full bg-cyan-400 animate-pulse"></span>' : ''}
        </div>
      `;
    }).join('');

    if (window.lucide) lucide.createIcons();
  },

  selectChat(chatId) {
    this.activeChatId = chatId;
    const chats = window.Storage.getChats();
    const chat = chats.find(c => c.id === chatId);
    if (chat) chat.unread = false;
    window.Storage.saveChats(chats);
    this.renderChatList();
    this.renderActiveConversation();
  },

  renderActiveConversation() {
    const headerEl = document.getElementById('chat-active-header');
    const streamEl = document.getElementById('chat-messages-stream');
    if (!headerEl || !streamEl) return;

    const chats = window.Storage.getChats();
    const chat = chats.find(c => c.id === this.activeChatId) || chats[0];
    if (!chat) return;

    // Header
    headerEl.innerHTML = `
      <div class="flex items-center space-x-3">
        <div class="relative cursor-pointer" onclick="window.App.openUserProfile('${chat.user.name}')">
          <img src="${chat.user.avatar}" class="w-10 h-10 rounded-full border border-white/20" />
          <span class="absolute bottom-0 right-0 w-2.5 h-2.5 rounded-full ${chat.user.status === 'Online' ? 'bg-emerald-400' : 'bg-gray-400'} border border-[#0B0050]"></span>
        </div>
        <div>
          <span class="font-bold text-white text-sm hover:text-cyan-300 cursor-pointer" onclick="window.App.openUserProfile('${chat.user.name}')">${chat.user.name}</span>
          <span class="text-[11px] text-white/50 block">${chat.user.status} • ${chat.user.bio || 'Quester'}</span>
        </div>
      </div>
      <!-- Actions: Call, Video Call -->
      <div class="flex items-center space-x-2">
        <button onclick="window.Chat.startCall('${chat.user.name}', false)" 
          class="w-9 h-9 rounded-full bg-white/10 hover:bg-white/20 flex items-center justify-center text-cyan-300 transition-colors" title="Gọi thoại">
          <i data-lucide="phone" class="w-4 h-4"></i>
        </button>
        <button onclick="window.Chat.startCall('${chat.user.name}', true)" 
          class="w-9 h-9 rounded-full bg-white/10 hover:bg-white/20 flex items-center justify-center text-pink-300 transition-colors" title="Gọi video">
          <i data-lucide="video" class="w-4 h-4"></i>
        </button>
      </div>
    `;

    // Messages
    streamEl.innerHTML = (chat.messages || []).map(m => {
      const isMe = m.sender === 'me';
      let contentHtml = '';

      if (m.type === 'voice') {
        contentHtml = `
          <div class="flex items-center space-x-3 py-1">
            <button onclick="window.App.showToast('Đang phát đoạn ghi âm thoại...', 'info')" class="w-8 h-8 rounded-full bg-white/20 flex items-center justify-center text-white">
              ▶
            </button>
            <div class="flex items-center space-x-1 h-6">
              <span class="w-1 h-3 bg-white/70 rounded"></span>
              <span class="w-1 h-5 bg-white rounded"></span>
              <span class="w-1 h-2 bg-white/50 rounded"></span>
              <span class="w-1 h-6 bg-cyan-300 rounded"></span>
              <span class="w-1 h-4 bg-white rounded"></span>
              <span class="w-1 h-2 bg-white/60 rounded"></span>
            </div>
            <span class="text-xs text-white/70">0:14</span>
          </div>
        `;
      } else if (m.type === 'image') {
        contentHtml = `
          <div class="rounded-xl overflow-hidden my-1 max-w-xs">
            <img src="${m.mediaUrl}" class="w-full h-auto object-cover" />
          </div>
        `;
      } else if (m.type === 'shared_post') {
        contentHtml = `
          <div class="p-3 rounded-xl bg-black/40 border border-white/20 max-w-xs text-left cursor-pointer" onclick="window.App.navigate('feed')">
            <div class="text-[10px] text-cyan-300 font-bold uppercase mb-1">Bài viết được chia sẻ</div>
            <img src="${m.postImage}" class="w-full h-28 object-cover rounded-lg mb-2" />
            <div class="text-xs font-bold text-white line-clamp-1">${m.postTitle}</div>
            <p class="text-[11px] text-white/70 line-clamp-2 mt-0.5">${m.postDesc}</p>
          </div>
        `;
      } else {
        contentHtml = `<p class="text-sm leading-relaxed">${m.text}</p>`;
      }

      return `
        <div class="flex ${isMe ? 'justify-end' : 'justify-start'} mb-4">
          ${!isMe ? `<img src="${chat.user.avatar}" class="w-8 h-8 rounded-full border border-white/20 mr-2 self-end mb-1" />` : ''}
          <div class="max-w-[75%]">
            <div class="px-4 py-2.5 rounded-2xl ${isMe ? 'bg-cyan-600 text-white rounded-br-xs shadow-md' : 'bg-white/10 text-white rounded-bl-xs border border-white/10'}">
              ${contentHtml}
            </div>
            <span class="text-[10px] text-white/40 block mt-1 ${isMe ? 'text-right' : 'text-left'}">${m.time}</span>
          </div>
        </div>
      `;
    }).join('');

    streamEl.scrollTop = streamEl.scrollHeight;
    if (window.lucide) lucide.createIcons();
  },

  sendMessage(e) {
    if (e) e.preventDefault();
    const input = document.getElementById('chat-message-input');
    const text = input?.value.trim();
    if (!text) return;

    const chats = window.Storage.getChats();
    const chat = chats.find(c => c.id === this.activeChatId);
    if (!chat) return;

    const newMsg = {
      id: `m_${Date.now()}`,
      sender: 'me',
      text: text,
      time: new Date().toLocaleTimeString('vi-VN', { hour: '2-digit', minute: '2-digit' })
    };

    chat.messages.push(newMsg);
    chat.lastMessage = text;
    chat.lastTime = "Vừa xong";
    window.Storage.saveChats(chats);

    input.value = '';
    this.renderChatList();
    this.renderActiveConversation();

    // Auto simulated reply after 2 seconds
    setTimeout(() => {
      const replies = [
        "Nghe thú vị thật đấy! Mình sẽ sắp xếp thời gian tham gia cùng bạn.",
        "Tuyệt vời! Chúc bạn hoàn thành quest xuất sắc nhé!",
        "Okie bạn, có gì cần hỗ trợ cứ nhắn mình nha!",
        "Cảm ơn bạn đã chia sẻ, mình vừa xem qua thấy rất cuốn."
      ];
      const replyMsg = {
        id: `m_rep_${Date.now()}`,
        sender: 'them',
        text: replies[Math.floor(Math.random() * replies.length)],
        time: new Date().toLocaleTimeString('vi-VN', { hour: '2-digit', minute: '2-digit' })
      };
      chat.messages.push(replyMsg);
      chat.lastMessage = replyMsg.text;
      chat.lastTime = "Vừa xong";
      window.Storage.saveChats(chats);
      this.renderChatList();
      this.renderActiveConversation();
    }, 2000);
  },

  toggleVoiceRecord() {
    this.isRecordingVoice = !this.isRecordingVoice;
    const btn = document.getElementById('chat-voice-btn');
    if (this.isRecordingVoice) {
      if (btn) btn.classList.add('text-red-400', 'animate-pulse');
      window.App.showToast("Đang thu âm voice... Nhấn lại để gửi.", "info");
    } else {
      if (btn) btn.classList.remove('text-red-400', 'animate-pulse');
      // Send simulated voice message
      const chats = window.Storage.getChats();
      const chat = chats.find(c => c.id === this.activeChatId);
      if (!chat) return;

      chat.messages.push({
        id: `v_${Date.now()}`,
        sender: 'me',
        type: 'voice',
        time: new Date().toLocaleTimeString('vi-VN', { hour: '2-digit', minute: '2-digit' })
      });
      chat.lastMessage = "🎤 [Đoạn ghi âm 0:14]";
      chat.lastTime = "Vừa xong";
      window.Storage.saveChats(chats);
      this.renderChatList();
      this.renderActiveConversation();
      window.App.showToast("Đã gửi tin nhắn thoại!", "success");
    }
  },

  sendImageSimulated() {
    const chats = window.Storage.getChats();
    const chat = chats.find(c => c.id === this.activeChatId);
    if (!chat) return;

    const sampleImages = [
      "https://images.unsplash.com/photo-1544551763-46a013bb70d5?auto=format&fit=crop&w=600&q=80",
      "https://images.unsplash.com/photo-1518770660439-4636190af475?auto=format&fit=crop&w=600&q=80",
      "https://images.unsplash.com/photo-1502680390469-be75c86b636f?auto=format&fit=crop&w=600&q=80"
    ];
    const chosen = sampleImages[Math.floor(Math.random() * sampleImages.length)];

    chat.messages.push({
      id: `img_${Date.now()}`,
      sender: 'me',
      type: 'image',
      mediaUrl: chosen,
      time: new Date().toLocaleTimeString('vi-VN', { hour: '2-digit', minute: '2-digit' })
    });
    chat.lastMessage = "📷 [Hình ảnh]";
    chat.lastTime = "Vừa xong";
    window.Storage.saveChats(chats);
    this.renderChatList();
    this.renderActiveConversation();
    window.App.showToast("Đã gửi hình ảnh!", "success");
  },

  sharePostIntoChat(chatId, post) {
    const chats = window.Storage.getChats();
    const chat = chats.find(c => c.id === chatId) || chats[0];
    if (!chat) return;

    chat.messages.push({
      id: `sp_${Date.now()}`,
      sender: 'me',
      type: 'shared_post',
      postTitle: post.title || post.questCompleted || `Bài viết từ ${post.author.name}`,
      postDesc: post.description,
      postImage: post.images ? post.images[0] : (post.thumbnail || 'https://images.unsplash.com/photo-1544551763-46a013bb70d5?auto=format&fit=crop&w=600&q=80'),
      time: new Date().toLocaleTimeString('vi-VN', { hour: '2-digit', minute: '2-digit' })
    });
    chat.lastMessage = "🔗 [Chia sẻ bài viết]";
    chat.lastTime = "Vừa xong";
    window.Storage.saveChats(chats);
    this.selectChat(chat.id);
  },

  // Open direct chat with any user
  openChatWithUser(userName, userAvatar) {
    const chats = window.Storage.getChats();
    let chat = chats.find(c => c.user.name === userName);
    if (!chat) {
      chat = {
        id: `chat_${Date.now()}`,
        user: {
          name: userName,
          avatar: userAvatar || `https://api.dicebear.com/7.x/bottts/svg?seed=${userName}`,
          status: "Online",
          bio: "Thành viên MyQuest"
        },
        lastMessage: "Bắt đầu cuộc trò chuyện",
        lastTime: "Mới",
        unread: false,
        messages: []
      };
      chats.unshift(chat);
      window.Storage.saveChats(chats);
    }
    window.App.navigate('chat');
    this.selectChat(chat.id);
  },

  // Calls Simulation
  startCall(userName, isVideo = false) {
    const modal = document.getElementById('call-simulation-modal');
    const nameEl = document.getElementById('call-user-name');
    const titleEl = document.getElementById('call-title');
    const timerEl = document.getElementById('call-timer');
    if (!modal) return;

    if (nameEl) nameEl.textContent = userName;
    if (titleEl) titleEl.textContent = isVideo ? "Cuộc gọi Video..." : "Cuộc gọi thoại...";
    if (timerEl) timerEl.textContent = "Đang kết nối...";

    modal.classList.remove('hidden');

    this.callDurationSeconds = 0;
    setTimeout(() => {
      if (timerEl) timerEl.textContent = "00:01";
      this.callTimer = setInterval(() => {
        this.callDurationSeconds++;
        const mins = String(Math.floor(this.callDurationSeconds / 60)).padStart(2, '0');
        const secs = String(this.callDurationSeconds % 60).padStart(2, '0');
        if (timerEl) timerEl.textContent = `${mins}:${secs}`;
      }, 1000);
    }, 1500);
  },

  endCall() {
    if (this.callTimer) {
      clearInterval(this.callTimer);
      this.callTimer = null;
    }
    const modal = document.getElementById('call-simulation-modal');
    if (modal) modal.classList.add('hidden');
    window.App.showToast("Cuộc gọi đã kết thúc", "info");
  }
};

/**
 * LocalStorage and State Management for MyQuest
 */

const STORAGE_KEYS = {
  USER: 'myquest_user',
  QUESTS: 'myquest_quests',
  POSTS: 'myquest_posts',
  CHATS: 'myquest_chats',
  GENERATED_HISTORY: 'myquest_gen_history'
};

const defaultUser = {
  isLoggedIn: true,
  username: "LeVuMinh",
  avatar: "https://api.dicebear.com/7.x/bottts/svg?seed=LeVuMinh",
  bio: "Cyberpunk sidequester | Khám phá các góc phố & thử thách mới lạ mỗi tuần.",
  joinDate: "05/09/2026",
  points: 45,
  freeGenerationsLeft: 5,
  freeQuestPostsLeft: 3,
  hasSeenFirstNoti: true,
  following: ["ArtisanZero", "PixelQueen"],
  friends: ["ArtisanZero"],
  // Real activities representing user's quests:
  activities: [
    {
      id: "act-1",
      questId: "quest-101",
      title: "Đua thuyền Kayak hoàng hôn Hồ Tây",
      difficulty: "Trung bình",
      category: "Thể chất",
      timeframe: "Còn 2 ngày",
      status: "Đang chờ được duyệt", // Owner requires approval
      joinedDate: "28/09/2026"
    },
    {
      id: "act-2",
      questId: "quest-102",
      title: "Trao đổi sách cũ & Cà phê Boardgame",
      difficulty: "Dễ",
      category: "Kết nối",
      timeframe: "Còn 3 ngày",
      status: "Còn 3 ngày", // Direct join
      joinedDate: "29/09/2026"
    },
    {
      id: "act-3",
      questId: "sq_1",
      title: "Chụp 10 khoảnh khắc bình minh thành phố",
      difficulty: "Dễ",
      category: "Sáng tạo",
      timeframe: "Đã qua",
      status: "Đã hoàn thành", // Completed, eligible for "Chia sẻ trải nghiệm"
      joinedDate: "25/09/2026",
      completedDate: "26/09/2026",
      sharedReview: false
    }
  ],
  myCreatedQuests: [
    {
      id: "my-quest-1",
      title: "Khám phá ẩm thực đêm hẻm Sài Gòn",
      difficulty: "Dễ",
      category: "Kết nối",
      location: "TP. Hồ Chí Minh",
      timeframe: "Còn 4 ngày",
      participantsCount: 4,
      maxParticipants: 6,
      feeType: "Miễn phí",
      requiresApproval: true,
      thumbnail: "https://images.unsplash.com/photo-1555396273-367ea4eb4db5?auto=format&fit=crop&w=600&q=80",
      description: "Cùng dạo quanh các quán ăn vặt và trò chuyện cuối tuần.",
      applicants: [
        { name: "KuroShinobi", avatar: "https://api.dicebear.com/7.x/bottts/svg?seed=KuroShinobi", status: "pending" },
        { name: "NeonRider", avatar: "https://api.dicebear.com/7.x/bottts/svg?seed=NeonRider", status: "approved" }
      ]
    }
  ]
};

window.Storage = {
  getUser() {
    const raw = localStorage.getItem(STORAGE_KEYS.USER);
    if (!raw) {
      localStorage.setItem(STORAGE_KEYS.USER, JSON.stringify(defaultUser));
      return defaultUser;
    }
    try {
      return JSON.parse(raw);
    } catch {
      return defaultUser;
    }
  },
  saveUser(user) {
    localStorage.setItem(STORAGE_KEYS.USER, JSON.stringify(user));
  },
  getQuests() {
    const raw = localStorage.getItem(STORAGE_KEYS.QUESTS);
    if (!raw) {
      localStorage.setItem(STORAGE_KEYS.QUESTS, JSON.stringify(window.INITIAL_QUESTS));
      return window.INITIAL_QUESTS;
    }
    try { return JSON.parse(raw); } catch { return window.INITIAL_QUESTS; }
  },
  saveQuests(quests) {
    localStorage.setItem(STORAGE_KEYS.QUESTS, JSON.stringify(quests));
  },
  getPosts() {
    const raw = localStorage.getItem(STORAGE_KEYS.POSTS);
    if (!raw) {
      localStorage.setItem(STORAGE_KEYS.POSTS, JSON.stringify(window.INITIAL_POSTS));
      return window.INITIAL_POSTS;
    }
    try { return JSON.parse(raw); } catch { return window.INITIAL_POSTS; }
  },
  savePosts(posts) {
    localStorage.setItem(STORAGE_KEYS.POSTS, JSON.stringify(posts));
  },
  getChats() {
    const raw = localStorage.getItem(STORAGE_KEYS.CHATS);
    if (!raw) {
      localStorage.setItem(STORAGE_KEYS.CHATS, JSON.stringify(window.INITIAL_CHATS));
      return window.INITIAL_CHATS;
    }
    try { return JSON.parse(raw); } catch { return window.INITIAL_CHATS; }
  },
  saveChats(chats) {
    localStorage.setItem(STORAGE_KEYS.CHATS, JSON.stringify(chats));
  },
  getGenHistory() {
    const raw = localStorage.getItem(STORAGE_KEYS.GENERATED_HISTORY);
    if (!raw) return [];
    try { return JSON.parse(raw); } catch { return []; }
  },
  saveGenHistory(hist) {
    localStorage.setItem(STORAGE_KEYS.GENERATED_HISTORY, JSON.stringify(hist));
  }
};

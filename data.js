/**
 * MyQuest Comprehensive Data Source
 * Contains sidequest templates, 63 Vietnam provinces, initial sample quests, feed posts, leaderboard and chats.
 */

window.PROVINCES_VIETNAM = [
  "Online", "Hà Nội", "TP. Hồ Chí Minh", "Đà Nẵng", "Hải Phòng", "Cần Thơ",
  "An Giang", "Bà Rịa - Vũng Tàu", "Bắc Giang", "Bắc Kạn", "Bạc Liêu", "Bắc Ninh",
  "Bến Tre", "Bình Định", "Bình Dương", "Bình Phước", "Bình Thuận", "Cà Mau",
  "Cao Bằng", "Đắk Lắk", "Đắk Nông", "Điện Biên", "Đồng Nai", "Đồng Tháp",
  "Gia Lai", "Hà Giang", "Hà Nam", "Hà Tĩnh", "Hải Dương", "Hậu Giang",
  "Hòa Bình", "Hưng Yên", "Khánh Hòa", "Kiên Giang", "Kon Tum", "Lai Châu",
  "Lâm Đồng", "Lạng Sơn", "Lào Cai", "Long An", "Nam Định", "Nghệ An",
  "Ninh Bình", "Ninh Thuận", "Phú Thọ", "Phú Yên", "Quảng Bình", "Quảng Nam",
  "Quảng Ngãi", "Quảng Ninh", "Quảng Trị", "Sóc Trăng", "Sơn La", "Tây Ninh",
  "Thái Bình", "Thái Nguyên", "Thanh Hóa", "Thừa Thiên Huế", "Tiền Giang",
  "Trà Vinh", "Tuyên Quang", "Vĩnh Long", "Vĩnh Phúc", "Yên Bái"
];

// Rich sidequest generator templates (endless combinations)
window.SIDEQUEST_TEMPLATES = [
  {
    id: "sq_1",
    title: "Chụp 10 khoảnh khắc bình minh thành phố",
    difficulty: "Dễ",
    category: "Sáng tạo",
    format: "Offline",
    participants: "Cá nhân",
    shortDesc: "Thức dậy lúc 5h30 sáng và ghi lại 10 bức ảnh góc phố thân quen trong nắng sớm tĩnh lặng.",
    timeframe: "Còn 2 ngày",
    feeType: "Miễn phí",
    rewards: "Huy hiệu Cyber Dawn Hunter + 20 Điểm",
    requiresApproval: false
  },
  {
    id: "sq_2",
    title: "Thử thách chạy bộ 5KM ngắm hoàng hôn",
    difficulty: "Trung bình",
    category: "Thể chất",
    format: "Offline",
    participants: "Cặp đôi",
    shortDesc: "Cùng một người bạn đồng hành hoàn thành cự ly 5km quanh công viên hoặc bờ hồ vào chiều tà.",
    timeframe: "Còn 1 ngày",
    feeType: "Miễn phí",
    rewards: "Quà tặng bình nước thể thao neon + 35 Điểm",
    requiresApproval: true
  },
  {
    id: "sq_3",
    title: "Vẽ bản đồ Cyberpunk cho quán cà phê yêu thích",
    difficulty: "Khó",
    category: "Sáng tạo",
    format: "Online",
    participants: "Cá nhân",
    shortDesc: "Thiết kế một bản đồ phong cách tương lai mini hoặc sketch isometric quán quen của bạn.",
    timeframe: "Còn 5 ngày",
    feeType: "Đổi điểm",
    feeValue: "15 điểm",
    rewards: "Bộ cọ vẽ digital độc quyền + 80 Điểm",
    requiresApproval: true
  },
  {
    id: "sq_4",
    title: "Workshop học lập trình Web Cyberpunk từ số 0",
    difficulty: "Trung bình",
    category: "Học hỏi",
    format: "Online",
    participants: "Nhóm",
    shortDesc: "Tham gia cùng nhóm 4 người xây dựng một giao diện tương tác phong cách neon trong 3 giờ.",
    timeframe: "Còn 1 tuần",
    feeType: "Trả phí",
    feeValue: "50.000 VNĐ",
    rewards: "Chứng chỉ hoàn thành + Template Source Code",
    requiresApproval: false
  },
  {
    id: "sq_5",
    title: "Chiến dịch nhặt rác xanh bờ kênh cuối tuần",
    difficulty: "Dễ",
    category: "Thiện nguyện",
    format: "Offline",
    participants: "Nhóm",
    shortDesc: "Cùng biệt đội tình nguyện làm sạch 2km bờ kè và phân loại rác tái chế cùng người dân địa phương.",
    timeframe: "Còn 3 ngày",
    feeType: "Miễn phí",
    rewards: "Áo thun MyQuest Green Warrior + 50 Điểm",
    requiresApproval: false
  },
  {
    id: "sq_6",
    title: "Trò chuyện ngẫu nhiên với 1 người lạ về ước mơ",
    difficulty: "Trung bình",
    category: "Kết nối",
    format: "Offline",
    participants: "Cá nhân",
    shortDesc: "Bước ra khỏi vùng an toàn, lắng nghe câu chuyện cuộc đời của một người bạn gặp tại thư viện hay trạm chờ xe bus.",
    timeframe: "Còn <12h",
    feeType: "Miễn phí",
    rewards: "Huy hiệu Empathy Master + 30 Điểm",
    requiresApproval: true
  },
  {
    id: "sq_7",
    title: "Thử thách 24 giờ không dùng mạng xã hội",
    difficulty: "Khó",
    category: "Đồng hành",
    format: "Online",
    participants: "Cặp đôi",
    shortDesc: "Cùng một người bạn đồng hành khóa toàn bộ MXH giải trí trong 24h và ghi chép lại cảm xúc suy nghĩ.",
    timeframe: "Còn 2 ngày",
    feeType: "Miễn phí",
    rewards: "Sổ tay hành trình + 60 Điểm",
    requiresApproval: false
  },
  {
    id: "sq_8",
    title: "Đạp xe đêm khám phá góc phố không ngủ",
    difficulty: "Trung bình",
    category: "Thể chất",
    format: "Offline",
    participants: "Nhóm",
    shortDesc: "Chuyến đạp xe 15km xuyên màn đêm thành phố từ 22h00 đến nửa đêm, tận hưởng làn gió mát và ánh đèn neon rực rỡ.",
    timeframe: "Còn 1 ngày",
    feeType: "Miễn phí",
    rewards: "Móc khóa đèn LED phát quang + 40 Điểm",
    requiresApproval: true
  },
  {
    id: "sq_9",
    title: "Quyên góp 5 cuốn sách cũ cho tủ sách vùng cao",
    difficulty: "Dễ",
    category: "Thiện nguyện",
    format: "Offline",
    participants: "Cá nhân",
    shortDesc: "Chọn ra những cuốn sách bạn yêu thích để gửi gắm tri thức và niềm vui đến các em nhỏ có hoàn cảnh khó khăn.",
    timeframe: "Còn 1 tuần",
    feeType: "Miễn phí",
    rewards: "Thư cảm ơn từ ban tổ chức + 45 Điểm",
    requiresApproval: false
  },
  {
    id: "sq_10",
    title: "Sáng tác một đoạn nhạc Lofi Cyberpunk 1 phút",
    difficulty: "Khó",
    category: "Sáng tạo",
    format: "Online",
    participants: "Cá nhân",
    shortDesc: "Sử dụng bất kỳ phần mềm DAW nào phối giai điệu chill kèm tiếng mưa hoặc âm thanh đường phố tương lai.",
    timeframe: "Còn 1 tháng",
    feeType: "Miễn phí",
    rewards: "Đăng tải lên MyQuest Official Playlist + 100 Điểm",
    requiresApproval: true
  }
];

// Initial Connected Quests (Trang Kết Nối)
window.INITIAL_QUESTS = [
  {
    id: "quest-101",
    author: {
      name: "CyberRonin",
      avatar: "https://api.dicebear.com/7.x/bottts/svg?seed=CyberRonin",
      bio: "Sidequest explorer & neon runner",
      joinDate: "15/01/2026"
    },
    title: "Đua thuyền Kayak hoàng hôn Hồ Tây",
    difficulty: "Trung bình",
    category: "Thể chất",
    location: "Hà Nội",
    timeframe: "Còn 2 ngày",
    participantsCount: 8,
    maxParticipants: 12,
    feeType: "Trả phí",
    feeValue: "120.000 VNĐ",
    requiresApproval: true,
    thumbnail: "https://images.unsplash.com/photo-1544551763-46a013bb70d5?auto=format&fit=crop&w=600&q=80",
    description: "Một buổi chiều giải phóng năng lượng trên mặt nước hồ Tây lộng gió. Trải nghiệm chèo kayak ngắm nhìn hoàng hôn rực đỏ buông xuống chân trời thành phố. Trang bị phao bơi an toàn đầy đủ.",
    requirements: "Biết bơi cơ bản, mang theo quần áo khô thay thế, đến đúng giờ 16:30 tại bến thuyền.",
    rewards: "Quà lưu niệm vòng tay dạ quang + 40 Điểm MyQuest",
    applicants: [
      { name: "NeonRider", avatar: "https://api.dicebear.com/7.x/bottts/svg?seed=NeonRider", status: "pending" },
      { name: "AoiKitsune", avatar: "https://api.dicebear.com/7.x/bottts/svg?seed=AoiKitsune", status: "approved" }
    ]
  },
  {
    id: "quest-102",
    author: {
      name: "PixelQueen",
      avatar: "https://api.dicebear.com/7.x/bottts/svg?seed=PixelQueen",
      bio: "Digital artist & book lover",
      joinDate: "02/02/2026"
    },
    title: "Trao đổi sách cũ & Cà phê Boardgame cuối tuần",
    difficulty: "Dễ",
    category: "Kết nối",
    location: "TP. Hồ Chí Minh",
    timeframe: "Còn 3 ngày",
    participantsCount: 15,
    maxParticipants: 20,
    feeType: "Miễn phí",
    feeValue: "0 VNĐ",
    requiresApproval: false,
    thumbnail: "https://images.unsplash.com/photo-1524995997946-a1c2e315a42f?auto=format&fit=crop&w=600&q=80",
    description: "Mang theo ít nhất 1 cuốn sách bạn tâm đắc để trao đổi ngẫu nhiên cùng người tham gia khác. Sau đó chúng ta cùng chơi các tựa boardgame chiến thuật nhẹ nhàng và thưởng thức cà phê.",
    requirements: "Mang theo tối thiểu 1 cuốn sách sạch sẽ, tinh thần cởi mở vui vẻ.",
    rewards: "Tặng bookmark thiết kế độc quyền MyQuest",
    applicants: []
  },
  {
    id: "quest-103",
    author: {
      name: "GlitchHunter",
      avatar: "https://api.dicebear.com/7.x/bottts/svg?seed=GlitchHunter",
      bio: "Bug bounty hunter & game dev",
      joinDate: "20/03/2026"
    },
    title: "Hackathon Game 48h: Chủ đề Thành Phố Cyber",
    difficulty: "Khó",
    category: "Sáng tạo",
    location: "Online",
    timeframe: "Còn 1 tuần",
    participantsCount: 24,
    maxParticipants: 30,
    feeType: "Đổi điểm",
    feeValue: "30 điểm",
    requiresApproval: true,
    thumbnail: "https://images.unsplash.com/photo-1511512578047-dfb367046420?auto=format&fit=crop&w=600&q=80",
    description: "Cùng lập team 2-3 người để tạo ra một bản mẫu minigame phong cách pixel hoặc cyberpunk trong vòng 48 giờ. Có mentor hỗ trợ và trao đổi kinh nghiệm.",
    requirements: "Có kiến thức cơ bản về Unity, Godot hoặc Javascript Canvas/Phaser.",
    rewards: "Giải thưởng tiền mặt 3.000.000 VNĐ cho team quán quân + Kỷ niệm chương",
    applicants: []
  },
  {
    id: "quest-104",
    author: {
      name: "GreenVibes",
      avatar: "https://api.dicebear.com/7.x/bottts/svg?seed=GreenVibes",
      bio: "Môi trường xanh cho tương lai",
      joinDate: "10/01/2026"
    },
    title: "Trồng 100 cây xanh tại đồi sinh thái",
    difficulty: "Trung bình",
    category: "Thiện nguyện",
    location: "Đà Nẵng",
    timeframe: "Còn 5 ngày",
    participantsCount: 18,
    maxParticipants: 25,
    feeType: "Miễn phí",
    feeValue: "0 VNĐ",
    requiresApproval: false,
    thumbnail: "https://images.unsplash.com/photo-1542601906990-b4d3fb778b09?auto=format&fit=crop&w=600&q=80",
    description: "Hoạt động phủ xanh đồi trọc kết hợp dã ngoại ngoài trời. Ban tổ chức đã chuẩn bị sẵn cây giống, găng tay, dụng cụ đào đất và bữa trưa dã ngoại ấm cúng.",
    requirements: "Sức khỏe tốt, trang phục năng động, mang mũ nón và giày thể thao.",
    rewards: "Huy hiệu Người Bảo Vệ Rừng Xanh + 50 Điểm MyQuest",
    applicants: []
  }
];

// Initial Feed Posts (Trang Bảng Tin - Chỉ đăng từ quest đã hoàn thành)
window.INITIAL_POSTS = [
  {
    id: "post-201",
    author: {
      name: "NeonWalker",
      avatar: "https://api.dicebear.com/7.x/bottts/svg?seed=NeonWalker",
      isFollowing: false,
      isFriend: false
    },
    time: "2 giờ trước",
    tag: "Thể chất",
    questCompleted: "Thử thách chạy bộ 5KM ngắm hoàng hôn",
    description: "Vừa hoàn thành sidequest chạy bộ 5km chiều nay cùng một người bạn mới quen qua MyQuest! Cảm giác ngắm hoàng hôn buông xuống cầu Long Biên thật tuyệt vời, năng lượng tích cực ngập tràn! Đã nhận được 35 điểm thưởng và huy hiệu siêu xịn ✨🏃‍♂️",
    images: [
      "https://images.unsplash.com/photo-1502680390469-be75c86b636f?auto=format&fit=crop&w=800&q=80",
      "https://images.unsplash.com/photo-1476480862126-209bfaa8edc8?auto=format&fit=crop&w=800&q=80",
      "https://images.unsplash.com/photo-1461896836934-ffe607ba8211?auto=format&fit=crop&w=800&q=80"
    ],
    likesCount: 142,
    isLiked: false,
    comments: [
      { author: "CyberRonin", avatar: "https://api.dicebear.com/7.x/bottts/svg?seed=CyberRonin", text: "Quá đỉnh luôn bạn ơi, hôm nào giao lưu cung đường hồ Tây nhé!", time: "1 giờ trước" },
      { author: "Kira_99", avatar: "https://api.dicebear.com/7.x/bottts/svg?seed=Kira_99", text: "Hoàng hôn đẹp quá, nhìn có động lực xỏ giày chạy ghê!", time: "30 phút trước" }
    ],
    sharesCount: 19
  },
  {
    id: "post-202",
    author: {
      name: "ArtisanZero",
      avatar: "https://api.dicebear.com/7.x/bottts/svg?seed=ArtisanZero",
      isFollowing: true,
      isFriend: true
    },
    time: "5 giờ trước",
    tag: "Sáng tạo",
    questCompleted: "Vẽ bản đồ Cyberpunk cho quán cà phê",
    description: "Cuối cùng cũng hoàn thành sidequest vẽ isometric map cho The Hidden Cafe phong cách Neo-Tokyo! Cảm ơn anh chủ quán đã tài trợ ly cold brew thơm phức trong lúc sketch. Điểm thưởng MyQuest đã được cộng ngay khi hoàn thành nhiệm vụ 🎨☕",
    images: [
      "https://images.unsplash.com/photo-1550745165-9bc0b252726f?auto=format&fit=crop&w=800&q=80",
      "https://images.unsplash.com/photo-1518770660439-4636190af475?auto=format&fit=crop&w=800&q=80"
    ],
    likesCount: 238,
    isLiked: true,
    comments: [
      { author: "PixelQueen", avatar: "https://api.dicebear.com/7.x/bottts/svg?seed=PixelQueen", text: "Tone màu tím neon lên chi tiết xuất sắc quá!", time: "4 giờ trước" }
    ],
    sharesCount: 37
  },
  {
    id: "post-203",
    author: {
      name: "Solaris_VN",
      avatar: "https://api.dicebear.com/7.x/bottts/svg?seed=Solaris_VN",
      isFollowing: false,
      isFriend: false
    },
    time: "1 ngày trước",
    tag: "Thiện nguyện",
    questCompleted: "Chiến dịch nhặt rác xanh bờ kênh",
    description: "Chủ nhật ý nghĩa cùng 15 bạn tình nguyện viên MyQuest gom được gần 80kg rác tái chế quanh bờ kênh Nhiêu Lộc. Thành phố sạch hơn và mọi người đều gắn kết hơn bao giờ hết!",
    images: [
      "https://images.unsplash.com/photo-1532996122724-e3c354a0b15b?auto=format&fit=crop&w=800&q=80",
      "https://images.unsplash.com/photo-1618477461853-cf6ed80faba5?auto=format&fit=crop&w=800&q=80"
    ],
    likesCount: 310,
    isLiked: false,
    comments: [
      { author: "GreenVibes", avatar: "https://api.dicebear.com/7.x/bottts/svg?seed=GreenVibes", text: "Cảm ơn team mình rất nhiều, tuần sau tiếp tục nhé!", time: "22 giờ trước" }
    ],
    sharesCount: 54
  }
];

// Leaderboard Top 20 Data
window.INITIAL_LEADERBOARD = [
  { rank: 1, name: "KuroShinobi", avatar: "https://api.dicebear.com/7.x/bottts/svg?seed=KuroShinobi", points: 2840, completed: 48, bio: "Top 1 Quester mùa này! Chinh phục mọi thử thách.", joinDate: "01/01/2026" },
  { rank: 2, name: "AoiKitsune", avatar: "https://api.dicebear.com/7.x/bottts/svg?seed=AoiKitsune", points: 2510, completed: 42, bio: "Đam mê leo núi và nhiếp ảnh đường phố.", joinDate: "10/01/2026" },
  { rank: 3, name: "NeonRider", avatar: "https://api.dicebear.com/7.x/bottts/svg?seed=NeonRider", points: 2390, completed: 39, bio: "Đạp xe đêm và sidequest phiêu lưu khắp Việt Nam.", joinDate: "15/01/2026" },
  { rank: 4, name: "CyberRonin", avatar: "https://api.dicebear.com/7.x/bottts/svg?seed=CyberRonin", points: 1980, completed: 33, bio: "Full-stack quester & boardgame fan.", joinDate: "20/01/2026" },
  { rank: 5, name: "PixelQueen", avatar: "https://api.dicebear.com/7.x/bottts/svg?seed=PixelQueen", points: 1850, completed: 30, bio: "Họa sĩ tự do, thích làm nhiệm vụ sáng tạo.", joinDate: "25/01/2026" },
  { rank: 6, name: "ZenMaster", avatar: "https://api.dicebear.com/7.x/bottts/svg?seed=ZenMaster", points: 1720, completed: 28, bio: "Thiền định và khám phá bản thân mỗi ngày.", joinDate: "01/02/2026" },
  { rank: 7, name: "Solaris_VN", avatar: "https://api.dicebear.com/7.x/bottts/svg?seed=Solaris_VN", points: 1640, completed: 27, bio: "Tình nguyện viên năng nổ.", joinDate: "05/02/2026" },
  { rank: 8, name: "EchoPulse", avatar: "https://api.dicebear.com/7.x/bottts/svg?seed=EchoPulse", points: 1530, completed: 25, bio: "Âm nhạc và podcast creator.", joinDate: "12/02/2026" },
  { rank: 9, name: "Vortex99", avatar: "https://api.dicebear.com/7.x/bottts/svg?seed=Vortex99", points: 1470, completed: 24, bio: "Thích thử thách thể lực khó.", joinDate: "18/02/2026" },
  { rank: 10, name: "LunaSky", avatar: "https://api.dicebear.com/7.x/bottts/svg?seed=LunaSky", points: 1390, completed: 22, bio: "Dạo chơi dưới ánh trăng thành thị.", joinDate: "22/02/2026" },
  { rank: 11, name: "ByteCrush", avatar: "https://api.dicebear.com/7.x/bottts/svg?seed=ByteCrush", points: 1310, completed: 21, bio: "Coder ban ngày, thám tử ban đêm.", joinDate: "01/03/2026" },
  { rank: 12, name: "NovaStrike", avatar: "https://api.dicebear.com/7.x/bottts/svg?seed=NovaStrike", points: 1240, completed: 20, bio: "Thể thao mạo hiểm & leo núi trong nhà.", joinDate: "05/03/2026" },
  { rank: 13, name: "ChronoDrift", avatar: "https://api.dicebear.com/7.x/bottts/svg?seed=ChronoDrift", points: 1180, completed: 19, bio: "Người sưu tầm kỷ niệm qua từng quest.", joinDate: "08/03/2026" },
  { rank: 14, name: "MysticFox", avatar: "https://api.dicebear.com/7.x/bottts/svg?seed=MysticFox", points: 1120, completed: 18, bio: "Học ngoại ngữ và kết nối văn hóa.", joinDate: "12/03/2026" },
  { rank: 15, name: "ShadowBlade", avatar: "https://api.dicebear.com/7.x/bottts/svg?seed=ShadowBlade", points: 1060, completed: 17, bio: "Trầm tính nhưng luôn hoàn thành đúng hạn.", joinDate: "15/03/2026" },
  { rank: 16, name: "AuraGlow", avatar: "https://api.dicebear.com/7.x/bottts/svg?seed=AuraGlow", points: 990, completed: 16, bio: "Năng lượng tích cực lan tỏa đến mọi người.", joinDate: "19/03/2026" },
  { rank: 17, name: "HyperSpeed", avatar: "https://api.dicebear.com/7.x/bottts/svg?seed=HyperSpeed", points: 940, completed: 15, bio: "Chạy nhanh như chớp!", joinDate: "21/03/2026" },
  { rank: 18, name: "TerraFirma", avatar: "https://api.dicebear.com/7.x/bottts/svg?seed=TerraFirma", points: 890, completed: 14, bio: "Yêu cây cỏ và làm vườn ban công.", joinDate: "24/03/2026" },
  { rank: 19, name: "Starlight_01", avatar: "https://api.dicebear.com/7.x/bottts/svg?seed=Starlight_01", points: 840, completed: 13, bio: "Chụp ảnh thiên văn & ngắm sao.", joinDate: "26/03/2026" },
  { rank: 20, name: "ZeroGravity", avatar: "https://api.dicebear.com/7.x/bottts/svg?seed=ZeroGravity", points: 800, completed: 12, bio: "Bay bổng và không ngừng tìm kiếm điều mới lạ.", joinDate: "28/03/2026" }
];

// Initial Messages Threads
window.INITIAL_CHATS = [
  {
    id: "chat-1",
    user: {
      name: "CyberRonin",
      avatar: "https://api.dicebear.com/7.x/bottts/svg?seed=CyberRonin",
      status: "Online",
      bio: "Sidequest explorer"
    },
    lastMessage: "Hẹn gặp bạn 16h30 ở bến thuyền nhé!",
    lastTime: "10:24",
    unread: true,
    messages: [
      { id: "m1", sender: "them", text: "Chào bạn! Bạn cũng tham gia quest chèo kayak cuối tuần này đúng không?", time: "09:45" },
      { id: "m2", sender: "me", text: "Đúng rồi bạn ơi, mình vừa được duyệt hồ sơ sáng nay!", time: "09:48" },
      { id: "m3", sender: "them", text: "Tuyệt quá, mình đi chung một thuyền đôi nha. Mình có mang theo máy ảnh chống nước chụp vài pô hình kỷ niệm!", time: "10:15" },
      { id: "m4", sender: "me", text: "Quá tuyệt luôn! Mình mang áo mưa mini với nước ép nha.", time: "10:20" },
      { id: "m5", sender: "them", text: "Hẹn gặp bạn 16h30 ở bến thuyền nhé!", time: "10:24" }
    ]
  },
  {
    id: "chat-2",
    user: {
      name: "PixelQueen",
      avatar: "https://api.dicebear.com/7.x/bottts/svg?seed=PixelQueen",
      status: "Offline",
      bio: "Digital artist & book lover"
    },
    lastMessage: "Cuốn sách bạn mang theo là thể loại gì thế?",
    lastTime: "Hôm qua",
    unread: false,
    messages: [
      { id: "m21", sender: "them", text: "Chào bạn! Bạn tham gia buổi trao đổi sách thứ 7 tuần này chứ?", time: "Hôm qua 15:30" },
      { id: "m22", sender: "them", text: "Cuốn sách bạn mang theo là thể loại gì thế?", time: "Hôm qua 15:31" }
    ]
  },
  {
    id: "chat-3",
    user: {
      name: "AoiKitsune",
      avatar: "https://api.dicebear.com/7.x/bottts/svg?seed=AoiKitsune",
      status: "Online",
      bio: "Đam mê leo núi và nhiếp ảnh"
    },
    lastMessage: "Okela, check post mình vừa chia sẻ nhé!",
    lastTime: "2 ngày trước",
    unread: false,
    messages: [
      { id: "m31", sender: "them", text: "Chào mừng bạn đến với MyQuest! Cần kinh nghiệm hoàn thành quest cứ hỏi mình nhé.", time: "2 ngày trước" },
      { id: "m32", sender: "me", text: "Cảm ơn bạn nhiều nha!", time: "2 ngày trước" },
      { id: "m33", sender: "them", text: "Okela, check post mình vừa chia sẻ nhé!", time: "2 ngày trước" }
    ]
  }
];

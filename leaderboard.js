/**
 * Leaderboard Module (Trang Bảng Xếp Hạng)
 * Features metallic Gold/Silver/Bronze podium, top 20 list, user ranking at bottom,
 * and clickable public profile inspection with follow/friend/message capabilities.
 */

window.Leaderboard = {
  currentPeriod: 'week', // 'week', 'month', 'quarter', 'year'

  init() {
    this.render();
  },

  switchPeriod(period) {
    this.currentPeriod = period;
    const periods = ['week', 'month', 'quarter', 'year'];
    periods.forEach(p => {
      const btn = document.getElementById(`lb-tab-${p}`);
      if (btn) {
        if (p === period) {
          btn.className = "btn-white px-5 py-1.5 text-xs font-bold shadow-lg";
        } else {
          btn.className = "btn-outline px-5 py-1.5 text-xs font-medium text-white/70";
        }
      }
    });
    this.render();
  },

  getData() {
    // Return sorted leaderboard based on period with subtle multiplier for variation
    const base = window.INITIAL_LEADERBOARD;
    const factor = this.currentPeriod === 'year' ? 4.5 : (this.currentPeriod === 'quarter' ? 2.8 : (this.currentPeriod === 'month' ? 1.6 : 1.0));
    return base.map((item, idx) => ({
      ...item,
      points: Math.round(item.points * factor),
      completed: Math.round(item.completed * (this.currentPeriod === 'week' ? 1 : (this.currentPeriod === 'month' ? 2 : 5)))
    }));
  },

  render() {
    const list = this.getData();
    const top1 = list[0];
    const top2 = list[1];
    const top3 = list[2];

    // Render Podium
    const p1Avatar = document.getElementById('podium-1-avatar');
    const p1Name = document.getElementById('podium-1-name');
    const p1Points = document.getElementById('podium-1-points');

    const p2Avatar = document.getElementById('podium-2-avatar');
    const p2Name = document.getElementById('podium-2-name');
    const p2Points = document.getElementById('podium-2-points');

    const p3Avatar = document.getElementById('podium-3-avatar');
    const p3Name = document.getElementById('podium-3-name');
    const p3Points = document.getElementById('podium-3-points');

    if (p1Name) {
      p1Name.textContent = top1.name;
      p1Avatar.src = top1.avatar;
      p1Points.textContent = `${top1.points.toLocaleString()} pts`;
      p1Name.onclick = () => window.App.openUserProfile(top1.name);
      p1Avatar.onclick = () => window.App.openUserProfile(top1.name);
    }
    if (p2Name) {
      p2Name.textContent = top2.name;
      p2Avatar.src = top2.avatar;
      p2Points.textContent = `${top2.points.toLocaleString()} pts`;
      p2Name.onclick = () => window.App.openUserProfile(top2.name);
      p2Avatar.onclick = () => window.App.openUserProfile(top2.name);
    }
    if (p3Name) {
      p3Name.textContent = top3.name;
      p3Avatar.src = top3.avatar;
      p3Points.textContent = `${top3.points.toLocaleString()} pts`;
      p3Name.onclick = () => window.App.openUserProfile(top3.name);
      p3Avatar.onclick = () => window.App.openUserProfile(top3.name);
    }

    // Render list #4 to #20
    const listContainer = document.getElementById('leaderboard-list-container');
    if (listContainer) {
      const rest = list.slice(3, 20);
      listContainer.innerHTML = rest.map(u => `
        <div class="glass-card px-5 py-3.5 flex items-center justify-between transition-all hover:border-cyan-400/40 cursor-pointer" onclick="window.App.openUserProfile('${u.name}')">
          <div class="flex items-center space-x-4">
            <span class="font-kvn text-sm md:text-base font-bold text-white/70 w-8">#${u.rank}</span>
            <img src="${u.avatar}" class="w-10 h-10 rounded-full border border-white/20" />
            <div>
              <div class="font-bold text-white text-sm hover:text-cyan-300 transition-colors">${u.name}</div>
              <div class="text-[11px] text-white/50">${u.completed} quests đã hoàn thành</div>
            </div>
          </div>
          <div class="text-right">
            <span class="font-bold text-cyan-300 text-sm">${u.points.toLocaleString()}</span>
            <span class="text-[11px] text-white/50 block">điểm</span>
          </div>
        </div>
      `).join('');
    }

    // Render User Ranking at Bottom (if not in top 20)
    const userRankContainer = document.getElementById('user-personal-rank');
    if (userRankContainer) {
      const user = window.Storage.getUser();
      const completedCount = (user.activities || []).filter(a => a.status === 'Đã hoàn thành' || a.status === 'Đã chia sẻ trải nghiệm').length;
      userRankContainer.innerHTML = `
        <div class="glass-section p-4 border border-cyan-400/40 bg-cyan-950/20 flex items-center justify-between">
          <div class="flex items-center space-x-3">
            <div class="px-3 py-1 rounded-xl bg-cyan-500/20 border border-cyan-400 text-cyan-300 font-bold text-sm">
              Thứ hạng: #110
            </div>
            <img src="${user.avatar}" class="w-10 h-10 rounded-full border-2 border-cyan-400" />
            <div>
              <div class="font-bold text-white text-sm">${user.username} <span class="text-xs text-white/50 font-normal">(Bạn)</span></div>
              <div class="text-[11px] text-white/60">${completedCount} quests hoàn thành</div>
            </div>
          </div>
          <div class="text-right">
            <div class="text-sm font-bold text-white">${user.points} điểm</div>
            <div class="text-[10px] text-cyan-300/80">Cần 755 điểm để vào Top 20</div>
          </div>
        </div>
      `;
    }

    if (window.lucide) lucide.createIcons();
  }
};

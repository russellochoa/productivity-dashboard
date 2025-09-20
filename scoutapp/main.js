const accountStages = [
  {
    id: 'elite',
    title: 'Elite',
    status: 'Active',
    summary: 'Full networking privileges with unlimited messaging and scouting exports.',
    messaging: 'Messaging open to the entire player pool.',
    degradeLabel: 'Downgrade to Competitive',
    savedLimit: Infinity,
    requireSavedForMessaging: false,
    messagingDisabled: false
  },
  {
    id: 'competitive',
    title: 'Competitive',
    status: 'Active',
    summary: 'Keep your staff aligned with light limits and outreach analytics.',
    messaging: 'Messaging open with weekly outreach reminders.',
    degradeLabel: 'Downgrade to Basic',
    savedLimit: 40,
    requireSavedForMessaging: false,
    messagingDisabled: false
  },
  {
    id: 'basic',
    title: 'Basic',
    status: 'Limited',
    summary: 'Profiles stay visible while messaging is limited to saved prospects.',
    messaging: 'Messaging limited to saved prospects. Save a player to start conversations.',
    degradeLabel: 'Deactivate to Dormant',
    savedLimit: 12,
    requireSavedForMessaging: true,
    messagingDisabled: false
  },
  {
    id: 'dormant',
    title: 'Dormant',
    status: 'Inactive',
    summary: 'Account hidden from discovery until reactivated. Messaging is paused.',
    messaging: 'Messaging disabled while dormant. Reactivate to reopen conversations.',
    degradeLabel: null,
    savedLimit: 12,
    requireSavedForMessaging: true,
    messagingDisabled: true
  }
];

const roleCopy = {
  scout: {
    heroSubtitle: 'Discover rising stars, manage relationships, and keep your shortlists ready for the next transfer window.',
    accountSummary: 'Manage your plan, access, and communication limits in one place. Downgrade when a recruiting cycle slows down, then reactivate instantly before the next window opens.',
    roleChip: 'Scout workspace',
    toast: 'Scout workspace engaged.'
  },
  player: {
    heroSubtitle: 'Showcase your story with verified highlights, advanced metrics, and direct access to the scouts looking for your profile.',
    accountSummary: 'Control how scouts experience your profile. Pause outreach during recovery spells, then reactivate before trials or showcases.',
    roleChip: 'Player workspace',
    toast: 'Player workspace engaged.'
  }
};

const rawPlayers = [
  {
    id: 'liam-carter',
    name: 'Liam Carter',
    position: 'Striker',
    positionGroup: 'forward',
    club: 'River City FC',
    league: 'USL Championship',
    location: 'Austin, USA',
    age: 22,
    height: "6'1\"",
    footedness: 'Right',
    availability: 'Open to MLS summer window transfer',
    lastUpdated: 'May 28, 2024',
    highlightUrl: 'https://www.youtube.com/embed/IyR_uYsRdPs?rel=0&modestbranding=1',
    keyStats: [
      { label: 'Goals', value: '18' },
      { label: 'Assists', value: '9' },
      { label: 'Rating', value: '7.84' }
    ],
    stats: [
      { label: 'Goals', value: '18', context: 'USL Championship — 2023/24' },
      { label: 'Assists', value: '9', context: 'USL Championship — 2023/24' },
      { label: 'Shots on target', value: '64%', context: 'Career high' },
      { label: 'xG per 90', value: '0.74', context: 'Top 5 in league' },
      { label: 'Pressures won', value: '47', context: 'Final third' },
      { label: 'Sprint speed', value: '34.1 km/h', context: 'GPS tracker' }
    ],
    tags: ['Pressing forward', 'MLS ready', 'Leadership'],
    bio: 'High-tempo striker who thrives pressing from the front. Attacks inside channels, links quickly, and finishes confidently with either foot.',
    highlightNotes: [
      'Hat trick vs. Phoenix Rising (Apr 2024)',
      'Led team in expected goals and sprints per 90',
      'Captain for River City FC with 88% availability'
    ],
    metrics: [
      { label: 'Top speed', value: '34.1 km/h' },
      { label: 'Sprints per 90', value: '23' },
      { label: 'Conversion rate', value: '27%' },
      { label: 'Weak foot rating', value: '4 / 5' }
    ],
    contact: [
      { type: 'Agent', value: 'Sarah Coleman — Next Level Sports' },
      { type: 'Email', value: 'scarter@nextlevelsports.com' },
      { type: 'Phone', value: '+1 (555) 234-8876' }
    ],
    achievements: [
      '2023 USL Young Player of the Year',
      'Called into U.S. U-23 national team camp (Jan 2024)'
    ],
    fixtures: [
      { opponent: 'Sacramento Republic', date: 'Jun 18', competition: 'USL Championship' },
      { opponent: 'El Paso Locomotive', date: 'Jun 24', competition: 'USL Championship' }
    ],
    searchKeywords: ['liam carter', 'river city fc', 'forward', 'striker', 'pressing', 'mls', 'usl championship', 'texas']
  },
  {
    id: 'mateo-ruiz',
    name: 'Mateo Ruiz',
    position: 'Central Midfielder',
    positionGroup: 'midfield',
    club: 'CF Monterrey U-23',
    league: 'Liga MX U-23',
    location: 'Monterrey, Mexico',
    age: 20,
    height: "5'10\"",
    footedness: 'Left',
    availability: 'Loan-friendly — open to USL & MLS NEXT Pro opportunities',
    lastUpdated: 'May 26, 2024',
    highlightUrl: 'https://www.youtube.com/embed/IyR_uYsRdPs?rel=0&modestbranding=1',
    keyStats: [
      { label: 'Assists', value: '12' },
      { label: 'xA / 90', value: '0.32' },
      { label: 'Prog. passes', value: '7.8' }
    ],
    stats: [
      { label: 'Chances created', value: '54', context: 'Liga MX U-23 — 2023/24' },
      { label: 'Progressive passes', value: '7.8', context: 'Per 90 minutes' },
      { label: 'Assists', value: '12', context: 'All competitions' },
      { label: 'Pass completion', value: '89%', context: 'Central third' },
      { label: 'Ball recoveries', value: '8.6', context: 'Per 90 minutes' },
      { label: 'Expected assists', value: '0.32', context: 'Per 90 minutes' }
    ],
    tags: ['Tempo setter', 'Left-footed', 'Press resistant'],
    bio: 'Two-way midfielder comfortable breaking lines off the dribble or with disguised passing angles. Calm under pressure and vocal organizing teammates.',
    highlightNotes: [
      'Nine progressive passes in U-23 semifinal win',
      '90th percentile for deep completions in Liga MX U-23',
      'Captains the U-23 side during transition phases'
    ],
    metrics: [
      { label: 'Pass completion', value: '91% short / 84% long' },
      { label: 'Progressive carries', value: '5.2 per 90' },
      { label: 'Press resistance', value: '92nd percentile' },
      { label: 'Defensive duels won', value: '62%' }
    ],
    contact: [
      { type: 'Club liaison', value: 'Ana Torres — CF Monterrey Development' },
      { type: 'Email', value: 'atorres@cfm.mx' },
      { type: 'WhatsApp', value: '+52 55 1234 7788' }
    ],
    achievements: [
      '2024 Liga MX U-23 Midfielder of the Tournament',
      'Called into Mexico U-21 national team (Mar 2024)'
    ],
    fixtures: [
      { opponent: 'Club León U-23', date: 'Jun 20', competition: 'Liga MX U-23 Playoffs' },
      { opponent: 'Atlas U-23', date: 'Jun 27', competition: 'Liga MX U-23 Playoffs' }
    ],
    searchKeywords: ['mateo ruiz', 'cf monterrey', 'midfielder', 'left foot', 'liga mx', 'playmaker', 'mexico']
  },
  {
    id: 'dante-wallace',
    name: 'Dante Wallace',
    position: 'Center Back',
    positionGroup: 'defense',
    club: 'Queen City Athletic',
    league: 'USL League One',
    location: 'Charlotte, USA',
    age: 24,
    height: "6'3\"",
    footedness: 'Right',
    availability: 'Monitoring Championship & MLS NEXT Pro interest',
    lastUpdated: 'May 20, 2024',
    highlightUrl: 'https://www.youtube.com/embed/IyR_uYsRdPs?rel=0&modestbranding=1',
    keyStats: [
      { label: 'Duels won', value: '74%' },
      { label: 'Aerials', value: '72%' },
      { label: 'Rating', value: '7.58' }
    ],
    stats: [
      { label: 'Duels won', value: '74%', context: 'Defensive duels 2023/24' },
      { label: 'Aerial success', value: '72%', context: 'Season average' },
      { label: 'Long pass accuracy', value: '68%', context: 'Over 30 metres' },
      { label: 'Blocks', value: '1.9', context: 'Per 90 minutes' },
      { label: 'Interceptions', value: '7.2', context: 'Per 90 minutes' },
      { label: 'Line-breaking passes', value: '8', context: 'Per match vs high press' }
    ],
    tags: ['Ball-playing CB', 'Set piece threat', 'Leadership'],
    bio: 'Commanding center back who breaks lines with his passing. Vocal organizer with excellent timing and range in aerial duels.',
    highlightNotes: [
      'Match-winning header in League One semifinal (Oct 2023)',
      'Captained Queen City Athletic to league-best defense',
      'Consistently among top 5 defenders in acceleration metrics'
    ],
    metrics: [
      { label: 'Clearances', value: '6.8 per 90' },
      { label: 'Progressive passes', value: '7.1 per 90' },
      { label: 'Top vertical leap', value: '76 cm' },
      { label: 'Left-foot distribution', value: '82% accuracy' }
    ],
    contact: [
      { type: 'Agency', value: 'Jordan Blake — Backline Sports Group' },
      { type: 'Email', value: 'jblake@backlinegroup.com' },
      { type: 'Phone', value: '+1 (704) 555-0198' }
    ],
    achievements: [
      '2023 USL League One Best XI',
      'Led defense with league-low xGA (2023)'
    ],
    fixtures: [
      { opponent: 'Greenville Triumph', date: 'Jun 22', competition: 'USL League One' },
      { opponent: 'Richmond Kickers', date: 'Jun 29', competition: 'USL League One' }
    ],
    searchKeywords: ['dante wallace', 'center back', 'queen city athletic', 'defender', 'usl league one', 'ball playing']
  },
  {
    id: 'koji-tanaka',
    name: 'Koji Tanaka',
    position: 'Goalkeeper',
    positionGroup: 'goalkeeper',
    club: 'Yokohama Metro FC',
    league: 'J2 League',
    location: 'Yokohama, Japan',
    age: 25,
    height: "6'2\"",
    footedness: 'Left',
    availability: 'Monitoring interest for winter transfer window',
    lastUpdated: 'May 18, 2024',
    highlightUrl: 'https://www.youtube.com/embed/IyR_uYsRdPs?rel=0&modestbranding=1',
    keyStats: [
      { label: 'Clean sheets', value: '11' },
      { label: 'Save %', value: '78%' },
      { label: 'Launch acc.', value: '58%' }
    ],
    stats: [
      { label: 'Clean sheets', value: '11', context: 'J2 League 2023/24' },
      { label: 'Save percentage', value: '78%', context: 'All competitions' },
      { label: 'Sweeper actions', value: '2.4', context: 'Per 90 minutes' },
      { label: 'Pass completion', value: '86%', context: 'Short distribution' },
      { label: 'Launch accuracy', value: '58%', context: 'Long distribution' },
      { label: 'Crosses claimed', value: '1.8', context: 'Per 90 minutes' }
    ],
    tags: ['Sweeper keeper', 'Left-footed', 'Calm under pressure'],
    bio: 'Modern goalkeeper comfortable initiating build-up with either foot. Commands his box and scans early to trigger transition passes.',
    highlightNotes: [
      'Player of the Match vs Tokyo Verdy (12 saves)',
      'Led Yokohama Metro to best defensive record since 2019',
      'Completed 87% of passes under pressure last month'
    ],
    metrics: [
      { label: 'Penalty saves', value: '3 / 5 this season' },
      { label: 'Avg. starting position', value: '17.6 m' },
      { label: 'Launch accuracy', value: '58%' },
      { label: 'Passes per game', value: '42' }
    ],
    contact: [
      { type: 'Club contact', value: 'Hiroshi Sato — Yokohama Metro FC' },
      { type: 'Email', value: 'hsato@yokometro.jp' },
      { type: 'Phone', value: '+81 45-555-0199' }
    ],
    achievements: [
      "2023 Emperor's Cup semifinal standout (10 saves)",
      'Named to J2 League Team of the Month (Mar 2024)'
    ],
    fixtures: [
      { opponent: 'Vegalta Sendai', date: 'Jun 21', competition: 'J2 League' },
      { opponent: 'Ventforet Kofu', date: 'Jun 28', competition: 'J2 League' }
    ],
    searchKeywords: ['koji tanaka', 'goalkeeper', 'yokohama metro', 'japan', 'sweeper keeper', 'left foot']
  }
];

const players = rawPlayers.map(player => {
  const keywordString = [
    player.name,
    player.club,
    player.league,
    player.position,
    player.location,
    player.availability,
    player.footedness,
    ...(player.tags || []),
    ...(player.searchKeywords || [])
  ]
    .filter(Boolean)
    .join(' ')
    .toLowerCase();

  return {
    ...player,
    searchIndex: keywordString
  };
});

const playerMap = new Map(players.map(player => [player.id, player]));

const state = {
  role: 'scout',
  stageIndex: 0,
  currentPlayerId: players[0] ? players[0].id : null,
  filters: {
    position: 'all',
    foot: 'all',
    search: ''
  },
  savedProspects: new Map(),
  messages: [],
  degradeHistory: []
};

const elements = {};
let toastTimeoutId = null;
let searchDebounceId = null;

const formatDate = new Intl.DateTimeFormat('en-US', { month: 'short', day: 'numeric' });
const formatDateTime = new Intl.DateTimeFormat('en-US', { month: 'short', day: 'numeric', hour: 'numeric', minute: '2-digit' });

function cacheElements() {
  elements.heroSubtitle = document.getElementById('hero-subtitle');
  elements.accountSummary = document.getElementById('account-summary');
  elements.accountRoleChip = document.getElementById('account-role-chip');
  elements.accountStatus = document.getElementById('account-status');
  elements.accountStatusDot = document.getElementById('account-status-dot');
  elements.accountTier = document.getElementById('account-tier');
  elements.accountImpact = document.getElementById('account-impact');
  elements.accountSavedCount = document.getElementById('account-saved-count');
  elements.accountCapacity = document.getElementById('account-capacity');
  elements.degradeButton = document.getElementById('degrade-account');
  elements.restoreButton = document.getElementById('restore-account');
  elements.degradeHistory = document.getElementById('degrade-history');
  elements.playerList = document.getElementById('player-list');
  elements.filterPosition = document.getElementById('filter-position');
  elements.filterFoot = document.getElementById('filter-foot');
  elements.filterSearch = document.getElementById('filter-search');
  elements.detailPosition = document.getElementById('detail-position');
  elements.detailName = document.getElementById('detail-name');
  elements.detailLocation = document.getElementById('detail-location');
  elements.detailAvailability = document.getElementById('detail-availability');
  elements.detailUpdated = document.getElementById('detail-updated');
  elements.highlightContainer = document.getElementById('highlight-container');
  elements.detailStats = document.getElementById('detail-stats');
  elements.playerTags = document.getElementById('player-tags');
  elements.detailBio = document.getElementById('detail-bio');
  elements.detailHighlightNotes = document.getElementById('detail-highlight-notes');
  elements.detailMetrics = document.getElementById('detail-metrics');
  elements.detailContact = document.getElementById('detail-contact');
  elements.detailHonors = document.getElementById('detail-honors');
  elements.detailFixtures = document.getElementById('detail-fixtures');
  elements.saveProspect = document.getElementById('save-prospect');
  elements.openMessage = document.getElementById('open-message');
  elements.savedContainer = document.getElementById('saved-prospects');
  elements.savedEmpty = document.getElementById('saved-empty');
  elements.savedCountBadge = document.getElementById('saved-count');
  elements.messageForm = document.getElementById('message-form');
  elements.messagePlayer = document.getElementById('message-player');
  elements.messageChannel = document.getElementById('message-channel');
  elements.messageSubject = document.getElementById('message-subject');
  elements.messageBody = document.getElementById('message-body');
  elements.submitMessage = document.getElementById('submit-message');
  elements.messageFeedback = document.getElementById('message-feedback');
  elements.messageHistory = document.getElementById('message-history');
  elements.messagingAvailability = document.getElementById('messaging-availability');
  elements.toastShell = document.getElementById('toast-shell');
  elements.toastContent = document.getElementById('toast-content');
}

function attachEventListeners() {
  document.querySelectorAll('[data-role-toggle]').forEach(button => {
    button.addEventListener('click', () => {
      const role = button.dataset.role;
      if (role) {
        setRole(role);
      }
    });
  });

  if (elements.degradeButton) {
    elements.degradeButton.addEventListener('click', degradeAccount);
  }
  if (elements.restoreButton) {
    elements.restoreButton.addEventListener('click', restoreAccount);
  }

  if (elements.filterPosition) {
    elements.filterPosition.addEventListener('change', event => {
      state.filters.position = event.target.value || 'all';
      applyFilters();
    });
  }

  if (elements.filterFoot) {
    elements.filterFoot.addEventListener('change', event => {
      state.filters.foot = event.target.value || 'all';
      applyFilters();
    });
  }

  if (elements.filterSearch) {
    elements.filterSearch.addEventListener('input', event => {
      const value = event.target.value || '';
      clearTimeout(searchDebounceId);
      searchDebounceId = setTimeout(() => {
        state.filters.search = value;
        applyFilters();
      }, 160);
    });
  }

  if (elements.playerList) {
    elements.playerList.addEventListener('click', event => {
      const card = event.target.closest('[data-player-id]');
      if (!card) return;
      const playerId = card.dataset.playerId;
      if (playerId) {
        showPlayerDetail(playerId);
      }
    });
  }

  if (elements.saveProspect) {
    elements.saveProspect.addEventListener('click', () => {
      if (state.currentPlayerId) {
        handleSaveProspect(state.currentPlayerId);
      }
    });
  }

  if (elements.openMessage) {
    elements.openMessage.addEventListener('click', () => {
      if (state.currentPlayerId) {
        handleOpenMessage(state.currentPlayerId);
      }
    });
  }

  if (elements.savedContainer) {
    elements.savedContainer.addEventListener('click', event => {
      const removeButton = event.target.closest('[data-remove-prospect]');
      const openButton = event.target.closest('[data-open-prospect]');
      const card = event.target.closest('[data-player-id]');
      if (!card) return;
      const playerId = card.dataset.playerId;
      if (removeButton && playerId) {
        removeProspect(playerId);
      } else if (openButton && playerId) {
        showPlayerDetail(playerId);
        const detailSection = document.getElementById('player-detail');
        if (detailSection && detailSection.scrollIntoView) {
          detailSection.scrollIntoView({ behavior: 'smooth', block: 'start' });
        }
      }
    });

    elements.savedContainer.addEventListener('change', event => {
      const noteField = event.target.closest('textarea[data-prospect-note]');
      if (!noteField) return;
      const card = noteField.closest('[data-player-id]');
      if (!card) return;
      const playerId = card.dataset.playerId;
      const entry = state.savedProspects.get(playerId);
      if (!entry) return;
      entry.note = noteField.value;
      entry.updatedAt = new Date();
      showToast('Notebook note updated.', 'success');
    });
  }

  if (elements.messageForm) {
    elements.messageForm.addEventListener('submit', handleMessageSubmit);
  }
}

function setRole(role) {
  if (!roleCopy[role]) return;
  if (state.role === role) {
    updateRoleUI();
    return;
  }
  state.role = role;
  updateRoleUI();
  showToast(roleCopy[role].toast, 'info');
}

function updateRoleUI() {
  const copy = roleCopy[state.role];
  if (!copy) return;
  if (elements.heroSubtitle) {
    elements.heroSubtitle.textContent = copy.heroSubtitle;
  }
  if (elements.accountSummary) {
    elements.accountSummary.textContent = copy.accountSummary;
  }
  if (elements.accountRoleChip) {
    elements.accountRoleChip.textContent = copy.roleChip;
  }
  document.querySelectorAll('[data-role-toggle]').forEach(button => {
    const isActive = button.dataset.role === state.role;
    button.classList.toggle('is-active', isActive);
    button.setAttribute('aria-pressed', String(isActive));
  });
}

function degradeAccount() {
  if (state.stageIndex >= accountStages.length - 1) {
    showToast('Account already dormant. Reactivate to unlock features.', 'warning');
    return;
  }
  state.stageIndex += 1;
  state.degradeHistory.push({
    type: 'downgrade',
    stageIndex: state.stageIndex,
    timestamp: new Date()
  });
  updateAccountPanel();
  updateMessagingAccess();
  const stage = accountStages[state.stageIndex];
  showToast(`Account downgraded to ${stage.title}.`, 'warning');
}

function restoreAccount() {
  if (state.stageIndex === 0) {
    showToast('Elite tier already active.', 'info');
    return;
  }
  state.stageIndex = 0;
  state.degradeHistory.push({
    type: 'reactivate',
    stageIndex: state.stageIndex,
    timestamp: new Date()
  });
  updateAccountPanel();
  updateMessagingAccess();
  showToast('Elite tier reactivated. Full access restored.', 'success');
}

function updateAccountPanel() {
  const stage = accountStages[state.stageIndex];
  if (!stage) return;

  if (elements.accountTier) {
    elements.accountTier.textContent = stage.title;
  }
  if (elements.accountImpact) {
    elements.accountImpact.textContent = stage.summary;
  }
  if (elements.accountStatus) {
    elements.accountStatus.textContent = stage.status;
  }
  if (elements.accountStatusDot) {
    const color = stage.status === 'Active' ? '#22c55e' : stage.status === 'Limited' ? '#fbbf24' : '#f87171';
    elements.accountStatusDot.style.backgroundColor = color;
  }
  if (elements.degradeButton) {
    elements.degradeButton.textContent = stage.degradeLabel || 'Dormant tier active';
    elements.degradeButton.disabled = !stage.degradeLabel;
  }
  if (elements.restoreButton) {
    elements.restoreButton.classList.toggle('hidden', state.stageIndex === 0);
  }
  renderDegradeHistory();
  renderSavedProspects();
}

function renderDegradeHistory() {
  if (!elements.degradeHistory) return;
  if (!state.degradeHistory.length) {
    elements.degradeHistory.innerHTML = '<li class="text-slate-500">No changes recorded yet — you\'re running the Elite tier.</li>';
    return;
  }

  const items = [...state.degradeHistory]
    .slice()
    .sort((a, b) => b.timestamp - a.timestamp)
    .map(entry => {
      const stage = accountStages[entry.stageIndex];
      const label = entry.type === 'reactivate'
        ? 'Reactivated Elite tier'
        : `Downgraded to ${stage ? stage.title : 'next tier'}`;
      const stamp = formatDateTime.format(entry.timestamp);
      return `
        <li class="rounded-2xl border border-emerald-500/20 bg-slate-950/50 px-4 py-3 text-sm">
          <p class="font-semibold text-emerald-200">${label}</p>
          <p class="mt-1 text-xs uppercase tracking-[0.35em] text-slate-500">${stamp}</p>
        </li>
      `;
    })
    .join('');

  elements.degradeHistory.innerHTML = items;
}

function applyFilters() {
  const { position, foot, search } = state.filters;
  const normalizedSearch = (search || '').trim().toLowerCase();

  const filtered = players.filter(player => {
    const matchesPosition = position === 'all' || player.positionGroup === position;
    const matchesFoot = foot === 'all' || player.footedness.toLowerCase() === foot;
    const matchesSearch = !normalizedSearch || player.searchIndex.includes(normalizedSearch);
    return matchesPosition && matchesFoot && matchesSearch;
  });

  renderPlayerGrid(filtered);

  let nextId = state.currentPlayerId;
  if (!filtered.some(player => player.id === state.currentPlayerId)) {
    nextId = filtered.length ? filtered[0].id : null;
  }

  showPlayerDetail(nextId);
}

function renderPlayerGrid(list) {
  if (!elements.playerList) return;
  if (!list.length) {
    elements.playerList.innerHTML = `
      <p class="rounded-2xl border border-dashed border-emerald-500/30 bg-slate-950/60 p-6 text-center text-sm text-slate-400">
        No players match your filters yet. Adjust the filters or clear your search.
      </p>
    `;
    return;
  }

  const cards = list.map(player => {
    const isActive = player.id === state.currentPlayerId;
    const stats = player.keyStats
      .map(stat => `
        <div class="player-card__stat">
          <span class="label">${stat.label}</span>
          <span class="value">${stat.value}</span>
        </div>
      `)
      .join('');

    return `
      <button type="button" class="player-card${isActive ? ' active' : ''}" data-player-id="${player.id}">
        <div class="player-card__header">
          <div>
            <p class="player-card__position">${player.position}</p>
            <p class="player-card__name">${player.name}</p>
          </div>
          <p class="player-card__club">${player.club}</p>
        </div>
        <div class="player-card__stats">${stats}</div>
        <p class="player-card__footer">Last updated ${player.lastUpdated}</p>
      </button>
    `;
  }).join('');

  elements.playerList.innerHTML = cards;
}

function showPlayerDetail(playerId) {
  state.currentPlayerId = playerId || null;
  highlightActiveCard();
  const player = playerId ? playerMap.get(playerId) : null;

  if (!player) {
    if (elements.detailPosition) elements.detailPosition.textContent = 'Select a profile';
    if (elements.detailName) elements.detailName.textContent = 'No player selected';
    if (elements.detailLocation) elements.detailLocation.textContent = 'Choose a player from the prospect board to load their scouting report.';
    if (elements.detailAvailability) elements.detailAvailability.textContent = '';
    if (elements.detailUpdated) elements.detailUpdated.textContent = '';
    if (elements.highlightContainer) {
      elements.highlightContainer.innerHTML = `
        <div class="flex flex-col items-center justify-center text-center text-sm text-slate-400">
          <span class="text-lg font-semibold text-slate-300">Highlight hub</span>
          <span class="mt-1 text-xs uppercase tracking-[0.4em] text-slate-500">Select a player to load match footage</span>
        </div>
      `;
    }
    clearDetailSections();
    updateActionButtons(null);
    return;
  }

  if (elements.detailPosition) {
    elements.detailPosition.textContent = `${player.position} • ${player.club}`;
  }
  if (elements.detailName) {
    elements.detailName.textContent = player.name;
  }
  if (elements.detailLocation) {
    const locationBits = [player.location, `${player.age} yrs`, player.height, `${player.footedness}-footed`].filter(Boolean);
    elements.detailLocation.textContent = locationBits.join(' • ');
  }
  if (elements.detailAvailability) {
    elements.detailAvailability.textContent = player.availability || '';
  }
  if (elements.detailUpdated) {
    elements.detailUpdated.textContent = player.lastUpdated ? `Updated ${player.lastUpdated}` : '';
  }

  renderHighlight(player);
  renderDetailStats(player);
  renderTags(player);
  if (elements.detailBio) {
    elements.detailBio.textContent = player.bio || '';
  }
  renderHighlightNotes(player);
  renderMetrics(player);
  renderContact(player);
  renderHonors(player);
  renderFixtures(player);
  updateActionButtons(player);
}

function clearDetailSections() {
  if (elements.detailStats) elements.detailStats.innerHTML = '';
  if (elements.playerTags) elements.playerTags.innerHTML = '';
  if (elements.detailBio) elements.detailBio.textContent = '';
  if (elements.detailHighlightNotes) elements.detailHighlightNotes.innerHTML = '';
  if (elements.detailMetrics) elements.detailMetrics.innerHTML = '';
  if (elements.detailContact) elements.detailContact.innerHTML = '';
  if (elements.detailHonors) elements.detailHonors.innerHTML = '';
  if (elements.detailFixtures) elements.detailFixtures.innerHTML = '';
}

function renderHighlight(player) {
  if (!elements.highlightContainer) return;
  if (player.highlightUrl) {
    elements.highlightContainer.innerHTML = `
      <iframe
        src="${player.highlightUrl}"
        title="${player.name} highlight reel"
        loading="lazy"
        allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
        allowfullscreen
      ></iframe>
    `;
  } else {
    elements.highlightContainer.innerHTML = `
      <div class="flex h-full flex-col items-center justify-center gap-2 text-center text-sm text-slate-400">
        <span class="text-lg font-semibold text-slate-300">No highlight uploaded yet</span>
        <span class="text-xs uppercase tracking-[0.4em] text-slate-500">Request footage from the player</span>
      </div>
    `;
  }
}

function renderDetailStats(player) {
  if (!elements.detailStats) return;
  if (!player.stats || !player.stats.length) {
    elements.detailStats.innerHTML = '<p class="text-sm text-slate-400">Stats coming soon.</p>';
    return;
  }
  const stats = player.stats.map(stat => `
    <div class="stat-card">
      <p class="stat-label">${stat.label}</p>
      <p class="stat-number">${stat.value}</p>
      ${stat.context ? `<p class="stat-context">${stat.context}</p>` : ''}
    </div>
  `).join('');
  elements.detailStats.innerHTML = stats;
}

function renderTags(player) {
  if (!elements.playerTags) return;
  if (!player.tags || !player.tags.length) {
    elements.playerTags.innerHTML = '';
    return;
  }
  elements.playerTags.innerHTML = player.tags.map(tag => `<span class="tag-chip">${tag}</span>`).join('');
}

function renderHighlightNotes(player) {
  if (!elements.detailHighlightNotes) return;
  if (!player.highlightNotes || !player.highlightNotes.length) {
    elements.detailHighlightNotes.innerHTML = '';
    return;
  }
  const list = player.highlightNotes.map(note => `<li>• ${note}</li>`).join('');
  elements.detailHighlightNotes.innerHTML = list;
}

function renderMetrics(player) {
  if (!elements.detailMetrics) return;
  if (!player.metrics || !player.metrics.length) {
    elements.detailMetrics.innerHTML = '';
    return;
  }
  const metrics = player.metrics.map(metric => `
    <div class="metric-row">
      <dt>${metric.label}</dt>
      <dd>${metric.value}</dd>
    </div>
  `).join('');
  elements.detailMetrics.innerHTML = metrics;
}

function renderContact(player) {
  if (!elements.detailContact) return;
  if (!player.contact || !player.contact.length) {
    elements.detailContact.innerHTML = '';
    return;
  }
  const items = player.contact.map(item => `
    <li class="flex flex-col">
      <span class="text-xs uppercase tracking-[0.35em] text-slate-500">${item.type}</span>
      <span class="text-sm text-slate-200">${item.value}</span>
    </li>
  `).join('');
  elements.detailContact.innerHTML = items;
}

function renderHonors(player) {
  if (!elements.detailHonors) return;
  if (!player.achievements || !player.achievements.length) {
    elements.detailHonors.innerHTML = '';
    return;
  }
  const items = player.achievements.map(item => `<li class="rounded-2xl border border-emerald-500/30 bg-emerald-500/10 px-3 py-2">${item}</li>`).join('');
  elements.detailHonors.innerHTML = items;
}

function renderFixtures(player) {
  if (!elements.detailFixtures) return;
  if (!player.fixtures || !player.fixtures.length) {
    elements.detailFixtures.innerHTML = '';
    return;
  }
  const items = player.fixtures.map(fixture => `
    <li class="rounded-2xl border border-slate-600/40 bg-slate-900/70 px-3 py-3">
      <p class="text-sm text-slate-200">${fixture.opponent}</p>
      <p class="text-xs uppercase tracking-[0.35em] text-slate-500">${fixture.date} • ${fixture.competition}</p>
    </li>
  `).join('');
  elements.detailFixtures.innerHTML = items;
}

function highlightActiveCard() {
  if (!elements.playerList) return;
  elements.playerList.querySelectorAll('.player-card').forEach(card => {
    const isActive = card.dataset.playerId === state.currentPlayerId;
    card.classList.toggle('active', isActive);
  });
}

function updateActionButtons(player) {
  if (!elements.saveProspect || !elements.openMessage) return;
  const stage = accountStages[state.stageIndex];
  const saved = player ? state.savedProspects.has(player.id) : false;
  const limit = stage.savedLimit;
  const reachedLimit = Number.isFinite(limit) && state.savedProspects.size >= limit;

  if (!player) {
    elements.saveProspect.disabled = true;
    elements.saveProspect.textContent = 'Save to notebook';
    elements.openMessage.disabled = true;
    elements.openMessage.textContent = 'Compose message';
    return;
  }

  if (stage.messagingDisabled && stage.id === 'dormant') {
    elements.saveProspect.disabled = true;
    elements.saveProspect.textContent = 'Reactivate to save prospects';
  } else if (saved) {
    elements.saveProspect.disabled = true;
    elements.saveProspect.textContent = 'Saved in notebook';
  } else if (reachedLimit) {
    elements.saveProspect.disabled = true;
    elements.saveProspect.textContent = 'Notebook limit reached';
  } else {
    elements.saveProspect.disabled = false;
    elements.saveProspect.textContent = 'Save to notebook';
  }

  const requiresSaved = stage.requireSavedForMessaging;
  const canMessage = !stage.messagingDisabled && (!requiresSaved || saved);
  elements.openMessage.disabled = !canMessage;
  elements.openMessage.textContent = stage.messagingDisabled
    ? 'Messaging paused'
    : requiresSaved && !saved
      ? 'Save to message'
      : 'Compose message';
}

function handleSaveProspect(playerId) {
  const player = playerMap.get(playerId);
  if (!player) return;
  const stage = accountStages[state.stageIndex];
  if (stage.messagingDisabled && stage.id === 'dormant') {
    showToast('Account dormant — reactivate to save prospects.', 'warning');
    return;
  }
  const alreadySaved = state.savedProspects.has(playerId);
  if (alreadySaved) {
    showToast('Already saved in your notebook.', 'info');
    return;
  }
  const limit = stage.savedLimit;
  if (Number.isFinite(limit) && state.savedProspects.size >= limit) {
    showToast('You reached your notebook limit for this tier.', 'warning');
    return;
  }

  state.savedProspects.set(playerId, {
    playerId,
    savedAt: new Date(),
    note: '',
    stageSnapshot: stage.id
  });
  renderSavedProspects();
  updateMessagingAccess();
  showToast(`${player.name} added to your notebook.`, 'success');
}

function removeProspect(playerId) {
  const player = playerMap.get(playerId);
  if (!state.savedProspects.has(playerId)) return;
  state.savedProspects.delete(playerId);
  renderSavedProspects();
  updateMessagingAccess();
  showToast(`${player ? player.name : 'Prospect'} removed from notebook.`, 'info');
}

function renderSavedProspects() {
  if (!elements.savedContainer) return;
  const entries = Array.from(state.savedProspects.values()).sort((a, b) => b.savedAt - a.savedAt);
  const stage = accountStages[state.stageIndex];
  const limit = stage.savedLimit;
  const capacityLabel = limit === Infinity ? 'Unlimited' : `${state.savedProspects.size} / ${limit}`;

  if (elements.accountSavedCount) {
    elements.accountSavedCount.textContent = String(state.savedProspects.size);
  }
  if (elements.accountCapacity) {
    elements.accountCapacity.textContent = capacityLabel;
  }
  if (elements.savedCountBadge) {
    elements.savedCountBadge.textContent = `${state.savedProspects.size} saved`;
  }

  if (!entries.length) {
    elements.savedContainer.innerHTML = '';
    if (elements.savedEmpty) elements.savedEmpty.classList.remove('hidden');
    updateActionButtons(playerMap.get(state.currentPlayerId));
    return;
  }

  if (elements.savedEmpty) {
    elements.savedEmpty.classList.add('hidden');
  }

  const cards = entries.map(entry => {
    const player = playerMap.get(entry.playerId);
    if (!player) return '';
    const savedOn = entry.savedAt ? formatDate.format(entry.savedAt) : '';
    const keyStat = player.keyStats && player.keyStats.length ? `${player.keyStats[0].label}: ${player.keyStats[0].value}` : '';
    return `
      <div class="notebook-card" data-player-id="${player.id}">
        <div class="flex items-start justify-between gap-3">
          <div>
            <p class="text-xs uppercase tracking-[0.35em] text-emerald-200">${player.position}</p>
            <p class="mt-1 text-lg font-semibold text-white">${player.name}</p>
            <p class="text-xs text-slate-400">${player.club}</p>
          </div>
          <button type="button" class="btn-outline" data-remove-prospect>Remove</button>
        </div>
        <p class="mt-3 text-xs uppercase tracking-[0.35em] text-slate-500">Saved ${savedOn}</p>
        <p class="mt-2 text-xs text-slate-400">${keyStat}</p>
        <label class="mt-4 block text-xs uppercase tracking-[0.35em] text-slate-500">Notebook note
          <textarea data-prospect-note class="mt-2" placeholder="Add tactical fit or next steps">${entry.note || ''}</textarea>
        </label>
        <div class="mt-4 flex items-center justify-between text-xs text-slate-400">
          <span>${player.availability || ''}</span>
          <button type="button" class="btn-outline" data-open-prospect>Open profile</button>
        </div>
      </div>
    `;
  }).join('');

  elements.savedContainer.innerHTML = cards;
  updateActionButtons(playerMap.get(state.currentPlayerId));
}

function updateMessagingAccess() {
  const stage = accountStages[state.stageIndex];
  if (!stage) return;
  const requiresSaved = stage.requireSavedForMessaging;
  const savedEntries = Array.from(state.savedProspects.keys());
  const recipients = stage.messagingDisabled
    ? []
    : requiresSaved
      ? savedEntries.map(id => playerMap.get(id)).filter(Boolean)
      : players;

  if (elements.messagingAvailability) {
    const baseMessage = stage.messaging;
    const needsSave = requiresSaved && !stage.messagingDisabled && !recipients.length;
    elements.messagingAvailability.textContent = needsSave
      ? `${baseMessage} Save a player to unlock this panel.`
      : baseMessage;
  }

  if (elements.messagePlayer) {
    const options = recipients.map(player => `<option value="${player.id}">${player.name} — ${player.position}</option>`).join('');
    elements.messagePlayer.innerHTML = options || '<option value="" disabled>No eligible prospects</option>';
    const currentSelection = recipients.find(player => player.id === state.currentPlayerId);
    if (currentSelection) {
      elements.messagePlayer.value = currentSelection.id;
    } else if (recipients.length) {
      elements.messagePlayer.value = recipients[0].id;
    } else {
      elements.messagePlayer.value = '';
    }
    elements.messagePlayer.disabled = stage.messagingDisabled || !recipients.length;
  }

  if (elements.messageChannel) {
    const allowedChannels = stage.messagingDisabled
      ? []
      : stage.id === 'basic'
        ? ['Direct Message', 'Email Intro']
        : ['Direct Message', 'Email Intro', 'WhatsApp Call'];
    elements.messageChannel.innerHTML = allowedChannels.map(channel => `<option value="${channel}">${channel}</option>`).join('');
    elements.messageChannel.disabled = stage.messagingDisabled || !allowedChannels.length;
  }

  const fields = [elements.messageSubject, elements.messageBody, elements.submitMessage];
  fields.forEach(field => {
    if (!field) return;
    field.disabled = stage.messagingDisabled || (stage.requireSavedForMessaging && !state.savedProspects.size);
  });

  if (elements.messageForm) {
    elements.messageForm.classList.toggle('opacity-40', stage.messagingDisabled);
    elements.messageForm.classList.toggle('pointer-events-none', stage.messagingDisabled);
  }

  updateActionButtons(playerMap.get(state.currentPlayerId));
}

function handleMessageSubmit(event) {
  event.preventDefault();
  const stage = accountStages[state.stageIndex];
  if (stage.messagingDisabled) {
    showToast('Messaging disabled while the account is dormant. Reactivate to reach out.', 'warning');
    return;
  }

  const playerId = elements.messagePlayer ? elements.messagePlayer.value : '';
  const channel = elements.messageChannel ? elements.messageChannel.value : '';
  const subject = elements.messageSubject ? elements.messageSubject.value.trim() : '';
  const body = elements.messageBody ? elements.messageBody.value.trim() : '';

  if (!playerId) {
    showToast('Select a player before sending a message.', 'warning');
    return;
  }
  if (stage.requireSavedForMessaging && !state.savedProspects.has(playerId)) {
    showToast('Save this prospect before messaging on the Basic tier.', 'warning');
    return;
  }
  if (!subject || !body) {
    showToast('Add a subject and message body before sending.', 'warning');
    return;
  }

  const message = {
    id: Date.now(),
    playerId,
    channel,
    subject,
    body,
    timestamp: new Date()
  };
  state.messages.unshift(message);
  if (state.messages.length > 10) {
    state.messages.length = 10;
  }
  renderMessageHistory();

  if (elements.messageForm) {
    elements.messageForm.reset();
  }
  if (elements.messageFeedback) {
    elements.messageFeedback.textContent = `Message staged for ${playerMap.get(playerId)?.name || 'prospect'} via ${channel}.`;
    elements.messageFeedback.classList.remove('hidden');
    setTimeout(() => {
      elements.messageFeedback.classList.add('hidden');
    }, 4000);
  }
  updateMessagingAccess();
  showToast(`Message staged for ${playerMap.get(playerId)?.name || 'prospect'}.`, 'success');
}

function renderMessageHistory() {
  if (!elements.messageHistory) return;
  if (!state.messages.length) {
    elements.messageHistory.innerHTML = '<li class="text-slate-500">No messages yet. Reach out to a prospect to populate this feed.</li>';
    return;
  }
  const items = state.messages.slice(0, 5).map(entry => {
    const player = playerMap.get(entry.playerId);
    const name = player ? player.name : 'Archived prospect';
    const stamp = formatDateTime.format(entry.timestamp);
    return `
      <li class="message-history-item">
        <strong>${name}</strong> · <span>${entry.channel}</span>
        <p class="mt-2 text-sm text-slate-300">${entry.subject}</p>
        <p class="mt-1 text-xs text-slate-400">${entry.body}</p>
        <time>${stamp}</time>
      </li>
    `;
  }).join('');
  elements.messageHistory.innerHTML = items;
}

function handleOpenMessage(playerId) {
  const stage = accountStages[state.stageIndex];
  const player = playerMap.get(playerId);
  if (!player) return;
  if (stage.messagingDisabled) {
    showToast('Messaging disabled while the account is dormant.', 'warning');
    return;
  }
  if (stage.requireSavedForMessaging && !state.savedProspects.has(playerId)) {
    showToast('Save this player to unlock messaging on the Basic tier.', 'warning');
    return;
  }
  if (elements.messagePlayer) {
    const option = Array.from(elements.messagePlayer.options).find(opt => opt.value === playerId);
    if (option) {
      elements.messagePlayer.value = playerId;
    }
  }
  if (elements.messageSubject) {
    elements.messageSubject.focus();
  }
  if (elements.messageForm && elements.messageForm.scrollIntoView) {
    elements.messageForm.scrollIntoView({ behavior: 'smooth', block: 'start' });
  }
  showToast(`Composing message to ${player.name}.`, 'info');
}

function showToast(message, tone = 'info') {
  if (!elements.toastShell || !elements.toastContent) return;
  elements.toastContent.textContent = message;
  if (tone === 'info') {
    delete elements.toastShell.dataset.tone;
  } else {
    elements.toastShell.dataset.tone = tone;
  }
  elements.toastShell.classList.remove('hidden');
  elements.toastShell.style.opacity = '1';
  elements.toastShell.style.transform = 'translate(-50%, 0)';
  clearTimeout(toastTimeoutId);
  toastTimeoutId = setTimeout(() => {
    elements.toastShell.style.opacity = '0';
    elements.toastShell.style.transform = 'translate(-50%, -12px)';
    setTimeout(() => {
      elements.toastShell.classList.add('hidden');
    }, 320);
  }, 3400);
}

function initializeApp() {
  cacheElements();
  attachEventListeners();
  updateRoleUI();
  updateAccountPanel();
  renderSavedProspects();
  renderMessageHistory();
  applyFilters();
  updateMessagingAccess();
}

document.addEventListener('DOMContentLoaded', initializeApp);

// Main Application Script
document.addEventListener('DOMContentLoaded', function() {
    // Initialize application
    initializeApp();
});

function initializeApp() {
    // Navigation
    setupNavigation();
    
    // Authentication
    setupAuth();
    
    // Initialize data
    initializeData();
    
    // Setup pages
    setupMarketplace();
    setupDashboard();
    setupTeamManagement();
    setupCreateMatch();
    
    // Setup modals
    setupModals();
    
    // Check if user is logged in
    checkAuthStatus();
    
    // Load initial data
    updateHomeStats();
    loadMatches();
}

// ============= NAVIGATION =============
function setupNavigation() {
    const navLinks = document.querySelectorAll('.nav-link');
    const mobileMenuBtn = document.querySelector('.mobile-menu-btn');
    const sections = document.querySelectorAll('.page-section');
    
    // Navigation click handlers
    navLinks.forEach(link => {
        link.addEventListener('click', function(e) {
            e.preventDefault();
            const targetId = this.getAttribute('href').substring(1);
            
            // Update active nav link
            navLinks.forEach(l => l.classList.remove('active'));
            this.classList.add('active');
            
            // Show target section
            sections.forEach(section => {
                section.classList.remove('active');
                if (section.id === targetId) {
                    section.classList.add('active');
                    
                    // Load section-specific data
                    switch(targetId) {
                        case 'marketplace':
                            loadMatches();
                            break;
                        case 'dashboard':
                            loadDashboardData();
                            break;
                        case 'team':
                            loadTeamData();
                            break;
                    }
                }
            });
            
            // Close mobile menu
            closeMobileMenu();
        });
    });
    
    // Mobile menu toggle
    mobileMenuBtn.addEventListener('click', function() {
        const navLinksContainer = document.querySelector('.nav-links');
        const authSection = document.querySelector('.auth-section');
        
        navLinksContainer.classList.toggle('show-mobile');
        authSection.classList.toggle('show-mobile');
    });
    
    // Hero buttons
    document.getElementById('hero-marketplace').addEventListener('click', () => {
        document.querySelector('[href="#marketplace"]').click();
    });
    
    document.getElementById('hero-register').addEventListener('click', () => {
        showModal('register-modal');
    });
}

function closeMobileMenu() {
    const navLinksContainer = document.querySelector('.nav-links');
    const authSection = document.querySelector('.auth-section');
    
    navLinksContainer.classList.remove('show-mobile');
    authSection.classList.remove('show-mobile');
}

// ============= AUTHENTICATION =============
function setupAuth() {
    const loginBtn = document.getElementById('login-btn');
    const registerBtn = document.getElementById('register-btn');
    const logoutBtn = document.getElementById('logout-btn');
    const showRegister = document.getElementById('show-register');
    const showLogin = document.getElementById('show-login');
    
    // Login button
    loginBtn.addEventListener('click', () => showModal('login-modal'));
    
    // Register button
    registerBtn.addEventListener('click', () => showModal('register-modal'));
    
    // Logout button
    logoutBtn.addEventListener('click', logoutUser);
    
    // Switch between login and register modals
    showRegister.addEventListener('click', (e) => {
        e.preventDefault();
        closeAllModals();
        showModal('register-modal');
    });
    
    showLogin.addEventListener('click', (e) => {
        e.preventDefault();
        closeAllModals();
        showModal('login-modal');
    });
    
    // Login form submission
    document.getElementById('login-form').addEventListener('submit', function(e) {
        e.preventDefault();
        const email = document.getElementById('login-email').value;
        const password = document.getElementById('login-password').value;
        
        // Simple validation
        if (!email || !password) {
            showToast('Please fill in all fields', 'error');
            return;
        }
        
        // Check credentials
        const users = getUsers();
        const user = users.find(u => u.email === email && u.password === password);
        
        if (user) {
            // Remove password from user object
            const { password, ...userWithoutPassword } = user;
            setCurrentUser(userWithoutPassword);
            updateAuthUI();
            closeAllModals();
            showToast('Login successful!', 'success');
            loadUserData(userWithoutPassword);
            updateHomeStats();
        } else {
            showToast('Invalid email or password', 'error');
        }
    });
    
    // Register form submission
    document.getElementById('register-form').addEventListener('submit', function(e) {
        e.preventDefault();
        const school = document.getElementById('register-school').value;
        const email = document.getElementById('register-email').value;
        const password = document.getElementById('register-password').value;
        const sport = document.getElementById('register-sport').value;
        const location = document.getElementById('register-location').value;
        
        // Simple validation
        if (!school || !email || !password || !sport || !location) {
            showToast('Please fill in all fields', 'error');
            return;
        }
        
        // Email validation
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        if (!emailRegex.test(email)) {
            showToast('Please enter a valid email address', 'error');
            return;
        }
        
        // Check if user already exists
        const users = getUsers();
        if (users.some(u => u.email === email)) {
            showToast('Email already registered', 'error');
            return;
        }
        
        // Create new user
        const newUser = {
            id: Date.now(),
            school: school,
            email: email,
            password: password,
            sport: sport,
            location: location,
            role: 'coach',
            createdAt: new Date().toISOString()
        };
        
        // Add to users
        users.push(newUser);
        localStorage.setItem('users', JSON.stringify(users));
        
        // Remove password from user object for session
        const { password: _, ...userWithoutPassword } = newUser;
        setCurrentUser(userWithoutPassword);
        
        // Create default team for user
        createDefaultTeam(newUser);
        
        // Update UI
        updateAuthUI();
        
        // Close modal
        closeAllModals();
        
        // Show success message
        showToast('Registration successful!', 'success');
        
        // Load user data
        loadUserData(userWithoutPassword);
        updateHomeStats();
    });
}

// Get users from localStorage
function getUsers() {
    return JSON.parse(localStorage.getItem('users')) || [];
}

// Set current user
function setCurrentUser(user) {
    localStorage.setItem('currentUser', JSON.stringify(user));
}

// Get current user
function getCurrentUser() {
    return JSON.parse(localStorage.getItem('currentUser'));
}

// Create default team for new user
function createDefaultTeam(user) {
    const teamName = `${user.school} ${user.sport.charAt(0).toUpperCase() + user.sport.slice(1)} Team`;
    
    const defaultTeam = {
        id: user.id,
        schoolId: user.id,
        school: user.school,
        sport: user.sport,
        location: user.location,
        teamName: teamName,
        players: [],
        stats: {
            wins: 0,
            losses: 0,
            draws: 0
        },
        matchHistory: [],
        createdAt: new Date().toISOString()
    };
    
    // Save team
    const teams = getTeams();
    teams.push(defaultTeam);
    localStorage.setItem('teams', JSON.stringify(teams));
    localStorage.setItem(`team_${user.id}`, JSON.stringify(defaultTeam));
    
    return defaultTeam;
}

// Logout user
function logoutUser() {
    localStorage.removeItem('currentUser');
    updateAuthUI();
    showToast('Logged out successfully', 'info');
    resetUserData();
}

// Check authentication status
function checkAuthStatus() {
    const user = getCurrentUser();
    if (user) {
        updateAuthUI();
        loadUserData(user);
    }
}

// Update authentication UI
function updateAuthUI() {
    const user = getCurrentUser();
    const userInfo = document.getElementById('user-info');
    const authButtons = document.getElementById('auth-buttons');
    const usernameDisplay = document.getElementById('username-display');
    
    if (user) {
        userInfo.classList.remove('hidden');
        authButtons.classList.add('hidden');
        usernameDisplay.textContent = user.school;
        
        // Enable protected features
        enableProtectedFeatures();
    } else {
        userInfo.classList.add('hidden');
        authButtons.classList.remove('hidden');
        
        // Disable protected features
        disableProtectedFeatures();
    }
}

function enableProtectedFeatures() {
    // Enable create match button
    const createMatchBtn = document.querySelector('[href="#create-match"]');
    if (createMatchBtn) {
        createMatchBtn.classList.remove('disabled');
    }
    
    // Enable add player button
    const addPlayerBtn = document.getElementById('add-player-btn');
    if (addPlayerBtn) {
        addPlayerBtn.disabled = false;
    }
    
    // Enable add result button
    const addResultBtn = document.getElementById('add-result');
    if (addResultBtn) {
        addResultBtn.disabled = false;
    }
}

function disableProtectedFeatures() {
    // Disable create match button
    const createMatchBtn = document.querySelector('[href="#create-match"]');
    if (createMatchBtn) {
        createMatchBtn.classList.add('disabled');
    }
    
    // Disable add player button
    const addPlayerBtn = document.getElementById('add-player-btn');
    if (addPlayerBtn) {
        addPlayerBtn.disabled = true;
    }
    
    // Disable add result button
    const addResultBtn = document.getElementById('add-result');
    if (addResultBtn) {
        addResultBtn.disabled = true;
    }
}

// Load user data
function loadUserData(user) {
    loadTeamData();
}

// Reset user data
function resetUserData() {
    document.getElementById('team-name').textContent = 'Your Team';
    document.getElementById('school-name').textContent = '-';
    document.getElementById('sport-type').textContent = '-';
    document.getElementById('player-count').textContent = '0';
    clearMatchesList();
}

// ============= DATA INITIALIZATION =============
function initializeData() {
    // Initialize users if not exists
    if (!localStorage.getItem('users')) {
        const defaultUsers = [
            {
                id: 1,
                school: 'Greenwood High',
                email: 'coach@greenwood.edu',
                password: 'password123',
                sport: 'football',
                location: 'north',
                role: 'coach',
                createdAt: '2024-01-15T10:00:00Z'
            },
            {
                id: 2,
                school: 'Central Academy',
                email: 'coach@central.edu',
                password: 'password123',
                sport: 'basketball',
                location: 'central',
                role: 'coach',
                createdAt: '2024-01-20T14:30:00Z'
            }
        ];
        localStorage.setItem('users', JSON.stringify(defaultUsers));
    }
    
    // Initialize teams if not exists
    if (!localStorage.getItem('teams')) {
        const defaultTeams = [
            {
                id: 1,
                schoolId: 1,
                school: 'Greenwood High',
                sport: 'football',
                location: 'north',
                teamName: 'Greenwood Lions',
                players: [
                    { 
                        id: 1, 
                        name: 'John Smith', 
                        jerseyNumber: 7, 
                        position: 'Forward', 
                        contact: '9876543210',
                        email: 'john@greenwood.edu',
                        available: true,
                        stats: { goals: 5, assists: 3, matchesPlayed: 8 }
                    },
                    { 
                        id: 2, 
                        name: 'Mike Johnson', 
                        jerseyNumber: 1, 
                        position: 'Goalkeeper', 
                        contact: '9876543211',
                        email: 'mike@greenwood.edu',
                        available: true,
                        stats: { goals: 0, assists: 1, matchesPlayed: 8 }
                    }
                ],
                stats: {
                    wins: 5,
                    losses: 2,
                    draws: 1
                },
                matchHistory: [
                    { 
                        id: 101, 
                        date: '2024-02-15', 
                        opponent: 'Central Academy', 
                        venue: 'Home', 
                        score: '2-1', 
                        result: 'win',
                        yourScore: 2,
                        opponentScore: 1
                    }
                ],
                createdAt: '2024-01-15T10:00:00Z'
            }
        ];
        localStorage.setItem('teams', JSON.stringify(defaultTeams));
    }
    
    // Initialize matches if not exists
    if (!localStorage.getItem('matches')) {
        const defaultMatches = [
            {
                id: 1,
                sport: 'football',
                date: '2024-03-25',
                time: '15:00',
                venue: 'Greenwood High Stadium',
                address: '123 Sports Avenue, North Area',
                area: 'north',
                homeTeam: 'Greenwood High',
                awayTeam: null,
                maxPlayers: 11,
                description: 'Friendly football match. Bring your own kit.',
                status: 'open',
                createdBy: 1,
                createdAt: '2024-03-20T10:00:00Z',
                distance: 2.5
            },
            {
                id: 2,
                sport: 'basketball',
                date: '2024-03-26',
                time: '17:00',
                venue: 'Central Academy Gym',
                address: '456 Court Street, Central Area',
                area: 'central',
                homeTeam: 'Central Academy',
                awayTeam: null,
                maxPlayers: 10,
                description: 'Competitive basketball match. Professional court.',
                status: 'open',
                createdBy: 2,
                createdAt: '2024-03-21T14:30:00Z',
                distance: 3.2
            },
            {
                id: 3,
                sport: 'cricket',
                date: '2024-03-27',
                time: '10:00',
                venue: 'Sunrise Cricket Ground',
                address: '789 Bat Road, East Area',
                area: 'east',
                homeTeam: 'Sunrise International',
                awayTeam: null,
                maxPlayers: 22,
                description: '20 overs match. Pitch provided.',
                status: 'open',
                createdBy: 3,
                createdAt: '2024-03-22T09:15:00Z',
                distance: 5.7
            },
            {
                id: 4,
                sport: 'volleyball',
                date: '2024-03-28',
                time: '16:00',
                venue: 'Northside Sports Complex',
                address: '321 Net Boulevard, North Area',
                area: 'north',
                homeTeam: 'Northside College',
                awayTeam: null,
                maxPlayers: 12,
                description: 'Indoor volleyball. Professional net.',
                status: 'open',
                createdBy: 4,
                createdAt: '2024-03-23T16:45:00Z',
                distance: 1.8
            }
        ];
        localStorage.setItem('matches', JSON.stringify(defaultMatches));
    }
}

// Get teams from localStorage
function getTeams() {
    return JSON.parse(localStorage.getItem('teams')) || [];
}

// Get matches from localStorage
function getMatches() {
    return JSON.parse(localStorage.getItem('matches')) || [];
}

// Save matches to localStorage
function saveMatches(matches) {
    localStorage.setItem('matches', JSON.stringify(matches));
}

// Update home stats
function updateHomeStats() {
    const matches = getMatches();
    const users = getUsers();
    const teams = getTeams();
    
    // Calculate total players
    let totalPlayers = 0;
    teams.forEach(team => {
        totalPlayers += (team.players || []).length;
    });
    
    // Count active matches (open matches)
    const activeMatches = matches.filter(m => m.status === 'open').length;
    
    // Update stats
    document.getElementById('total-matches').textContent = matches.length;
    document.getElementById('total-schools').textContent = users.length;
    document.getElementById('total-players').textContent = totalPlayers;
    document.getElementById('active-matches').textContent = activeMatches;
}

// ============= MARKETPLACE =============
function setupMarketplace() {
    const searchInput = document.getElementById('search-matches');
    const sportFilter = document.getElementById('sport-filter');
    const distanceFilter = document.getElementById('distance-filter');
    const refreshBtn = document.getElementById('refresh-matches');
    const viewBtns = document.querySelectorAll('.view-btn');
    const zoomInBtn = document.getElementById('zoom-in');
    const zoomOutBtn = document.getElementById('zoom-out');
    const centerMapBtn = document.getElementById('center-map');
    
    // Search functionality
    searchInput.addEventListener('input', filterMatches);
    
    // Filter functionality
    sportFilter.addEventListener('change', filterMatches);
    distanceFilter.addEventListener('change', filterMatches);
    
    // Refresh button
    refreshBtn.addEventListener('click', loadMatches);
    
    // View toggle
    viewBtns.forEach(btn => {
        btn.addEventListener('click', function() {
            viewBtns.forEach(b => b.classList.remove('active'));
            this.classList.add('active');
            const view = this.dataset.view;
            const matchesList = document.getElementById('matches-list');
            matchesList.className = `matches-container ${view}-view`;
        });
    });
    
    // Map controls
    zoomInBtn.addEventListener('click', zoomInMap);
    zoomOutBtn.addEventListener('click', zoomOutMap);
    centerMapBtn.addEventListener('click', centerMap);
    
    // Location options in create match form
    const locationOptions = document.querySelectorAll('.location-option');
    locationOptions.forEach(option => {
        option.addEventListener('click', function() {
            locationOptions.forEach(opt => opt.classList.remove('selected'));
            this.classList.add('selected');
            document.getElementById('venue-area').value = this.dataset.location;
        });
    });
}

// Load matches
function loadMatches() {
    const matchesList = document.getElementById('matches-list');
    matchesList.innerHTML = `
        <div class="loading">
            <div class="spinner"></div>
            <p>Loading matches...</p>
        </div>
    `;
    
    // Simulate loading delay
    setTimeout(() => {
        const matches = getOpenMatches();
        displayMatches(matches);
        updateMapWithMatches(matches);
    }, 500);
}

// Get open matches
function getOpenMatches() {
    const matches = getMatches();
    return matches.filter(match => match.status === 'open');
}

// Get match by ID
function getMatchById(id) {
    const matches = getMatches();
    return matches.find(match => match.id === id);
}

// Display matches in list
function displayMatches(matches) {
    const matchesList = document.getElementById('matches-list');
    const user = getCurrentUser();
    
    if (matches.length === 0) {
        matchesList.innerHTML = `
            <div class="no-matches">
                <i class="fas fa-futbol fa-3x"></i>
                <h3>No matches found</h3>
                <p>Try adjusting your filters or create a match!</p>
                ${user ? `<button class="btn btn-primary" onclick="document.querySelector('[href=\\'#create-match\\']').click()">
                    <i class="fas fa-plus"></i> Create Match
                </button>` : ''}
            </div>
        `;
        return;
    }
    
    let html = '';
    matches.forEach(match => {
        const date = new Date(match.date).toLocaleDateString('en-US', {
            weekday: 'short',
            month: 'short',
            day: 'numeric'
        });
        
        const distance = match.distance ? `<span class="distance-badge">${match.distance}km</span>` : '';
        const userSchool = user ? user.school : '';
        const canAccept = user && match.homeTeam !== userSchool && match.status === 'open';
        
        html += `
            <div class="match-card" data-match-id="${match.id}" onclick="showMatchDetails(${match.id})">
                <div class="match-header">
                    <span class="match-sport">${getSportIcon(match.sport)} ${match.sport.toUpperCase()}</span>
                    <span class="match-date">${date}</span>
                </div>
                <div class="match-teams">
                    <div class="team">
                        <strong>${match.homeTeam}</strong>
                        <small>Home</small>
                    </div>
                    <div class="vs">VS</div>
                    <div class="team">
                        <strong>${match.awayTeam || 'Available'}</strong>
                        <small>Away</small>
                    </div>
                </div>
                <div class="match-details">
                    <div class="match-detail">
                        <i class="fas fa-clock"></i>
                        <span>${match.time}</span>
                    </div>
                    <div class="match-detail">
                        <i class="fas fa-map-marker-alt"></i>
                        <span>${match.venue}</span>
                    </div>
                    <div class="match-detail">
                        <i class="fas fa-users"></i>
                        <span>Max: ${match.maxPlayers || 'Unlimited'}</span>
                    </div>
                    ${distance ? `
                    <div class="match-detail">
                        <i class="fas fa-road"></i>
                        <span>${distance}</span>
                    </div>
                    ` : ''}
                </div>
                ${match.description ? `<p class="match-description">${match.description}</p>` : ''}
                <div class="match-actions">
                    ${canAccept ? `
                    <button class="btn btn-primary btn-small" onclick="event.stopPropagation(); acceptMatch(${match.id})">
                        <i class="fas fa-check"></i> Accept
                    </button>
                    ` : ''}
                    <button class="btn btn-secondary btn-small" onclick="event.stopPropagation(); showMatchDetails(${match.id})">
                        <i class="fas fa-info-circle"></i> Details
                    </button>
                </div>
            </div>
        `;
    });
    
    matchesList.innerHTML = html;
}

// Filter matches
function filterMatches() {
    const searchTerm = document.getElementById('search-matches').value.toLowerCase();
    const sportFilter = document.getElementById('sport-filter').value;
    const distanceFilter = parseInt(document.getElementById('distance-filter').value);
    const user = getCurrentUser();
    
    const matches = getOpenMatches();
    const filteredMatches = matches.filter(match => {
        // Search filter
        if (searchTerm && !match.venue.toLowerCase().includes(searchTerm) && 
            !match.homeTeam.toLowerCase().includes(searchTerm)) {
            return false;
        }
        
        // Sport filter
        if (sportFilter && match.sport !== sportFilter) {
            return false;
        }
        
        // Distance filter
        if (distanceFilter && match.distance && match.distance > distanceFilter) {
            return false;
        }
        
        return true;
    });
    
    displayMatches(filteredMatches);
    updateMapWithMatches(filteredMatches);
}

// Update map with matches
function updateMapWithMatches(matches) {
    const mapContainer = document.getElementById('map-visualization');
    const user = getCurrentUser();
    
    // Clear existing markers
    const existingMarkers = mapContainer.querySelectorAll('.match-marker');
    existingMarkers.forEach(marker => marker.remove());
    
    // Update stats
    document.getElementById('matches-nearby').textContent = matches.length;
    
    let closestDistance = Infinity;
    let closestMatch = null;
    
    // Add markers for each match
    matches.forEach(match => {
        // Calculate position based on area
        const position = getPositionFromArea(match.area);
        
        // Create marker
        const marker = document.createElement('div');
        marker.className = `match-marker ${match.status}`;
        marker.innerHTML = getSportIcon(match.sport);
        marker.style.left = `${position.x}%`;
        marker.style.top = `${position.y}%`;
        marker.title = `${match.venue} - ${match.sport}`;
        
        // Add click event
        marker.addEventListener('click', (e) => {
            e.stopPropagation();
            showMatchDetails(match.id);
        });
        
        mapContainer.appendChild(marker);
        
        // Calculate distance if user location available
        if (user && user.location) {
            const distance = calculateAreaDistance(user.location, match.area);
            match.distance = distance;
            
            if (distance < closestDistance) {
                closestDistance = distance;
                closestMatch = match;
            }
        }
    });
    
    // Update closest match
    if (closestMatch) {
        document.getElementById('closest-match').textContent = `${closestDistance}km`;
    } else {
        document.getElementById('closest-match').textContent = '--';
    }
}

// Get position from area
function getPositionFromArea(area) {
    const positions = {
        'north': { x: 50, y: 16 },
        'south': { x: 50, y: 84 },
        'east': { x: 84, y: 50 },
        'west': { x: 16, y: 50 },
        'central': { x: 50, y: 50 },
        'northeast': { x: 84, y: 16 },
        'northwest': { x: 16, y: 16 },
        'southeast': { x: 84, y: 84 },
        'southwest': { x: 16, y: 84 }
    };
    return positions[area] || { x: 50, y: 50 };
}

// Calculate distance between areas
function calculateAreaDistance(area1, area2) {
    const distances = {
        'north-north': 0,
        'north-south': 8,
        'north-east': 4,
        'north-west': 4,
        'north-central': 2,
        'south-south': 0,
        'south-north': 8,
        'south-east': 4,
        'south-west': 4,
        'south-central': 2,
        'east-east': 0,
        'east-west': 8,
        'east-north': 4,
        'east-south': 4,
        'east-central': 2,
        'west-west': 0,
        'west-east': 8,
        'west-north': 4,
        'west-south': 4,
        'west-central': 2,
        'central-central': 0,
        'central-north': 2,
        'central-south': 2,
        'central-east': 2,
        'central-west': 2
    };
    
    const key = `${area1}-${area2}`;
    return distances[key] || distances[`${area2}-${area1}`] || 5;
}

// Map zoom functions
let mapZoom = 1;
function zoomInMap() {
    if (mapZoom < 3) {
        mapZoom += 0.5;
        updateMapZoom();
    }
}

function zoomOutMap() {
    if (mapZoom > 0.5) {
        mapZoom -= 0.5;
        updateMapZoom();
    }
}

function centerMap() {
    mapZoom = 1;
    updateMapZoom();
    showToast('Map centered', 'info');
}

function updateMapZoom() {
    const mapGrid = document.querySelector('.map-grid');
    mapGrid.style.transform = `scale(${mapZoom})`;
    document.getElementById('map-zoom').textContent = `${mapZoom}x`;
}

// Show match details
function showMatchDetails(matchId) {
    const match = getMatchById(matchId);
    if (!match) {
        showToast('Match not found', 'error');
        return;
    }
    
    const user = getCurrentUser();
    const canAccept = user && match.homeTeam !== user.school && match.status === 'open';
    
    const date = new Date(match.date).toLocaleDateString('en-US', {
        weekday: 'long',
        year: 'numeric',
        month: 'long',
        day: 'numeric'
    });
    
    let html = `
        <div class="match-details-modal">
            <div class="match-header">
                <span class="match-sport">${getSportIcon(match.sport)} ${match.sport.toUpperCase()}</span>
                <span class="match-status ${match.status}">${match.status.toUpperCase()}</span>
            </div>
            
            <div class="match-teams-large">
                <div class="team-large">
                    <h4>${match.homeTeam}</h4>
                    <p>Home Team</p>
                </div>
                <div class="vs-large">VS</div>
                <div class="team-large">
                    <h4>${match.awayTeam || 'Available'}</h4>
                    <p>Away Team</p>
                </div>
            </div>
            
            <div class="match-info-grid">
                <div class="info-item">
                    <i class="fas fa-calendar"></i>
                    <div>
                        <strong>Date</strong>
                        <p>${date}</p>
                    </div>
                </div>
                <div class="info-item">
                    <i class="fas fa-clock"></i>
                    <div>
                        <strong>Time</strong>
                        <p>${match.time}</p>
                    </div>
                </div>
                <div class="info-item">
                    <i class="fas fa-map-marker-alt"></i>
                    <div>
                        <strong>Venue</strong>
                        <p>${match.venue}</p>
                    </div>
                </div>
                ${match.address ? `
                <div class="info-item">
                    <i class="fas fa-location-dot"></i>
                    <div>
                        <strong>Address</strong>
                        <p>${match.address}</p>
                    </div>
                </div>
                ` : ''}
                <div class="info-item">
                    <i class="fas fa-users"></i>
                    <div>
                        <strong>Max Players</strong>
                        <p>${match.maxPlayers || 'Unlimited'}</p>
                    </div>
                </div>
                ${match.distance ? `
                <div class="info-item">
                    <i class="fas fa-road"></i>
                    <div>
                        <strong>Distance</strong>
                        <p>${match.distance} km away</p>
                    </div>
                </div>
                ` : ''}
                <div class="info-item">
                    <i class="fas fa-map"></i>
                    <div>
                        <strong>Area</strong>
                        <p>${match.area ? match.area.charAt(0).toUpperCase() + match.area.slice(1) : 'Not specified'}</p>
                    </div>
                </div>
            </div>
            
            ${match.description ? `
            <div class="match-description-large">
                <h4>Additional Details</h4>
                <p>${match.description}</p>
            </div>
            ` : ''}
            
            <div class="modal-actions">
                ${canAccept ? `
                <button class="btn btn-primary" onclick="acceptMatch(${match.id}); closeAllModals();">
                    <i class="fas fa-check"></i> Accept Match
                </button>
                ` : ''}
                <button class="btn btn-secondary" onclick="closeAllModals()">
                    Close
                </button>
            </div>
        </div>
    `;
    
    document.getElementById('match-details-content').innerHTML = html;
    showModal('match-details-modal');
}

// Accept match
function acceptMatch(matchId) {
    const user = getCurrentUser();
    
    if (!user) {
        showToast('Please login to accept matches', 'error');
        showModal('login-modal');
        return;
    }
    
    const match = getMatchById(matchId);
    if (!match) {
        showToast('Match not found', 'error');
        return;
    }
    
    if (match.homeTeam === user.school) {
        showToast('Cannot accept your own match', 'error');
        return;
    }
    
    if (match.status !== 'open') {
        showToast('Match is no longer available', 'error');
        return;
    }
    
    // Update match
    match.awayTeam = user.school;
    match.status = 'confirmed';
    match.acceptedAt = new Date().toISOString();
    
    // Update in storage
    updateMatch(match);
    
    showToast('Match accepted successfully!', 'success');
    
    // Refresh matches list
    loadMatches();
    
    // Add to team's match history
    addMatchToTeamHistory(match, user);
}

// Update match in storage
function updateMatch(updatedMatch) {
    const matches = getMatches();
    const index = matches.findIndex(match => match.id === updatedMatch.id);
    if (index !== -1) {
        matches[index] = updatedMatch;
        saveMatches(matches);
    }
}

// Add match to team history
function addMatchToTeamHistory(match, user) {
    const teamData = localStorage.getItem(`team_${user.id}`);
    if (!teamData) return;
    
    const team = JSON.parse(teamData);
    if (!team.matchHistory) team.matchHistory = [];
    
    const teamMatch = {
        id: match.id,
        date: match.date,
        opponent: match.homeTeam,
        venue: match.venue,
        type: 'away',
        status: 'upcoming',
        sport: match.sport
    };
    
    team.matchHistory.push(teamMatch);
    localStorage.setItem(`team_${user.id}`, JSON.stringify(team));
}

// ============= DASHBOARD =============
function setupDashboard() {
    const addResultBtn = document.getElementById('add-result');
    const exportBtn = document.getElementById('export-stats');
    const seasonSelect = document.getElementById('season-select');
    
    addResultBtn.addEventListener('click', () => showModal('add-result-modal'));
    exportBtn.addEventListener('click', exportStats);
    seasonSelect.addEventListener('change', loadDashboardData);
    
    // Add result form
    document.getElementById('add-result-form').addEventListener('submit', function(e) {
        e.preventDefault();
        addMatchResult();
    });
}

// Load dashboard data
function loadDashboardData() {
    const user = getCurrentUser();
    if (!user) {
        showToast('Please login to view dashboard', 'error');
        document.querySelector('[href="#home"]').click();
        return;
    }
    
    // Load team data
    const teamData = localStorage.getItem(`team_${user.id}`);
    if (teamData) {
        const team = JSON.parse(teamData);
        updateDashboardStats(team);
        loadMatchHistory(team);
        loadTopPerformers(team);
        createPerformanceChart(team);
    } else {
        // Create default team if doesn't exist
        const defaultTeam = createDefaultTeam(user);
        updateDashboardStats(defaultTeam);
        loadMatchHistory(defaultTeam);
        loadTopPerformers(defaultTeam);
        createPerformanceChart(defaultTeam);
    }
}

// Update dashboard stats
function updateDashboardStats(team) {
    document.getElementById('wins-count').textContent = team.stats.wins;
    document.getElementById('losses-count').textContent = team.stats.losses;
    document.getElementById('draws-count').textContent = team.stats.draws;
    
    const totalMatches = team.stats.wins + team.stats.losses + team.stats.draws;
    const winRate = totalMatches > 0 ? Math.round((team.stats.wins / totalMatches) * 100) : 0;
    document.getElementById('win-rate').textContent = `${winRate}%`;
    
    // Update team section as well
    document.getElementById('team-wins').textContent = team.stats.wins;
    document.getElementById('team-losses').textContent = team.stats.losses;
    document.getElementById('team-draws').textContent = team.stats.draws;
}

// Load match history
function loadMatchHistory(team) {
    const matchesHistory = document.getElementById('matches-history');
    const matches = team.matchHistory || [];
    
    if (matches.length === 0) {
        matchesHistory.innerHTML = `
            <tr>
                <td colspan="6" class="text-center">
                    <p>No match history yet</p>
                    <button class="btn btn-primary btn-small" onclick="showModal('add-result-modal')">
                        <i class="fas fa-plus"></i> Add First Result
                    </button>
                </td>
            </tr>
        `;
        return;
    }
    
    let html = '';
    matches.forEach(match => {
        const resultClass = match.result === 'win' ? 'result-win' : 
                          match.result === 'loss' ? 'result-loss' : 'result-draw';
        
        html += `
            <tr>
                <td>${new Date(match.date).toLocaleDateString()}</td>
                <td>${match.opponent}</td>
                <td>${match.venue}</td>
                <td>${match.score}</td>
                <td class="${resultClass}">${match.result.toUpperCase()}</td>
                <td>
                    <button class="btn-icon" onclick="editMatchResult('${match.id}')" title="Edit">
                        <i class="fas fa-edit"></i>
                    </button>
                    <button class="btn-icon danger" onclick="deleteMatchResult('${match.id}')" title="Delete">
                        <i class="fas fa-trash"></i>
                    </button>
                </td>
            </tr>
        `;
    });
    
    matchesHistory.innerHTML = html;
}

// Add match result
function addMatchResult() {
    const user = getCurrentUser();
    if (!user) return;
    
    const opponent = document.getElementById('result-opponent').value;
    const date = document.getElementById('result-date').value;
    const yourScore = parseInt(document.getElementById('your-score').value);
    const opponentScore = parseInt(document.getElementById('opponent-score').value);
    const venue = document.getElementById('result-venue').value;
    
    let result = 'draw';
    if (yourScore > opponentScore) result = 'win';
    if (yourScore < opponentScore) result = 'loss';
    
    const matchResult = {
        id: Date.now(),
        date: date,
        opponent: opponent,
        venue: venue || 'Home Ground',
        score: `${yourScore} - ${opponentScore}`,
        result: result,
        yourScore: yourScore,
        opponentScore: opponentScore
    };
    
    // Get team data
    let teamData = localStorage.getItem(`team_${user.id}`);
    if (!teamData) {
        teamData = createDefaultTeam(user);
    }
    
    const team = JSON.parse(teamData);
    
    // Initialize arrays if they don't exist
    if (!team.matchHistory) team.matchHistory = [];
    if (!team.stats) team.stats = { wins: 0, losses: 0, draws: 0 };
    
    // Add match to history
    team.matchHistory.unshift(matchResult);
    
    // Update stats
    if (result === 'win') team.stats.wins++;
    if (result === 'loss') team.stats.losses++;
    if (result === 'draw') team.stats.draws++;
    
    // Save updated team
    localStorage.setItem(`team_${user.id}`, JSON.stringify(team));
    
    // Update UI
    updateDashboardStats(team);
    loadMatchHistory(team);
    createPerformanceChart(team);
    
    // Close modal and reset form
    closeAllModals();
    document.getElementById('add-result-form').reset();
    
    showToast('Match result added successfully!', 'success');
}

// Create performance chart
function createPerformanceChart(team) {
    const chartContainer = document.getElementById('performanceChart');
    
    // Simple chart using divs
    const totalMatches = team.stats.wins + team.stats.losses + team.stats.draws;
    
    if (totalMatches === 0) {
        chartContainer.innerHTML = `
            <div class="no-data-chart" style="text-align: center; padding: 2rem; color: var(--light-text);">
                <i class="fas fa-chart-pie fa-3x"></i>
                <p>No match data yet</p>
            </div>
        `;
        return;
    }
    
    const winPercent = (team.stats.wins / totalMatches) * 100;
    const lossPercent = (team.stats.losses / totalMatches) * 100;
    const drawPercent = (team.stats.draws / totalMatches) * 100;
    
    chartContainer.innerHTML = `
        <div class="chart-bar win" style="height: ${winPercent}%">
            <div class="chart-bar-value">${team.stats.wins}</div>
            <div class="chart-bar-label">Wins</div>
        </div>
        <div class="chart-bar draw" style="height: ${drawPercent}%">
            <div class="chart-bar-value">${team.stats.draws}</div>
            <div class="chart-bar-label">Draws</div>
        </div>
        <div class="chart-bar loss" style="height: ${lossPercent}%">
            <div class="chart-bar-value">${team.stats.losses}</div>
            <div class="chart-bar-label">Losses</div>
        </div>
    `;
}

// Load top performers
function loadTopPerformers(team) {
    const topPlayersContainer = document.getElementById('top-players');
    const players = team.players || [];
    
    if (players.length === 0) {
        topPlayersContainer.innerHTML = `
            <div class="no-players" style="text-align: center; padding: 2rem; color: var(--light-text);">
                <i class="fas fa-user-friends fa-3x"></i>
                <p>No players in team</p>
                <button class="btn btn-primary btn-small" onclick="showModal('add-player-modal')">
                    <i class="fas fa-user-plus"></i> Add Players
                </button>
            </div>
        `;
        return;
    }
    
    // Sort players by jersey number (or any metric)
    const sortedPlayers = [...players].sort((a, b) => {
        return (b.jerseyNumber || 0) - (a.jerseyNumber || 0);
    }).slice(0, 3);
    
    let html = '';
    sortedPlayers.forEach(player => {
        html += `
            <div class="player-card">
                <div class="player-avatar">
                    ${player.name.charAt(0)}
                </div>
                <div class="player-name">${player.name}</div>
                <div class="player-position">${player.position}</div>
                <div class="player-stats">
                    <div class="player-stat">
                        <span class="player-stat-value">${player.jerseyNumber || '--'}</span>
                        <span class="player-stat-label">Jersey</span>
                    </div>
                    <div class="player-stat">
                        <span class="player-stat-value">${player.available ? 'Yes' : 'No'}</span>
                        <span class="player-stat-label">Available</span>
                    </div>
                </div>
            </div>
        `;
    });
    
    topPlayersContainer.innerHTML = html;
}

// Export stats
function exportStats() {
    const user = getCurrentUser();
    if (!user) {
        showToast('Please login to export stats', 'error');
        return;
    }
    
    const teamData = localStorage.getItem(`team_${user.id}`);
    if (!teamData) {
        showToast('No team data found', 'error');
        return;
    }
    
    const team = JSON.parse(teamData);
    const dataStr = JSON.stringify(team, null, 2);
    
    // Create download link
    const dataUri = 'data:application/json;charset=utf-8,'+ encodeURIComponent(dataStr);
    const exportFileDefaultName = `${user.school}_stats_${new Date().toISOString().split('T')[0]}.json`;
    
    const linkElement = document.createElement('a');
    linkElement.setAttribute('href', dataUri);
    linkElement.setAttribute('download', exportFileDefaultName);
    linkElement.click();
    
    showToast('Stats exported successfully!', 'success');
}

// ============= TEAM MANAGEMENT =============
function setupTeamManagement() {
    const addPlayerBtn = document.getElementById('add-player-btn');
    const importBtn = document.getElementById('import-roster');
    const searchPlayers = document.getElementById('search-players');
    const positionFilter = document.getElementById('position-filter');
    
    addPlayerBtn.addEventListener('click', () => showModal('add-player-modal'));
    importBtn.addEventListener('click', importRoster);
    searchPlayers.addEventListener('input', filterPlayers);
    positionFilter.addEventListener('change', filterPlayers);
    
    // Add player form
    document.getElementById('add-player-form').addEventListener('submit', function(e) {
        e.preventDefault();
        addPlayer();
    });
}

// Load team data
function loadTeamData() {
    const user = getCurrentUser();
    if (!user) {
        showToast('Please login to view team', 'error');
        document.querySelector('[href="#home"]').click();
        return;
    }
    
    const teamData = localStorage.getItem(`team_${user.id}`);
    if (teamData) {
        const team = JSON.parse(teamData);
        updateTeamUI(team);
        loadPlayers(team.players);
        createAvailabilityChart(team);
    } else {
        // Create default team
        const defaultTeam = createDefaultTeam(user);
        updateTeamUI(defaultTeam);
        loadPlayers(defaultTeam.players);
        createAvailabilityChart(defaultTeam);
    }
}

// Update team UI
function updateTeamUI(team) {
    document.getElementById('team-name').textContent = team.teamName;
    document.getElementById('school-name').textContent = team.school;
    document.getElementById('sport-type').textContent = team.sport.charAt(0).toUpperCase() + team.sport.slice(1);
    document.getElementById('player-count').textContent = team.players ? team.players.length : 0;
}

// Add player
function addPlayer() {
    const user = getCurrentUser();
    if (!user) {
        showToast('Please login to add players', 'error');
        return;
    }
    
    const name = document.getElementById('player-name').value;
    const jersey = parseInt(document.getElementById('player-jersey').value);
    const position = document.getElementById('player-position').value;
    const contact = document.getElementById('player-contact').value;
    const email = document.getElementById('player-email').value;
    const available = document.getElementById('player-available').checked;
    
    // Get team data
    let teamData = localStorage.getItem(`team_${user.id}`);
    if (!teamData) {
        teamData = createDefaultTeam(user);
    }
    
    const team = JSON.parse(teamData);
    
    // Initialize players array if it doesn't exist
    if (!team.players) team.players = [];
    
    // Check if jersey number is already taken
    const jerseyTaken = team.players.some(player => player.jerseyNumber === jersey);
    if (jerseyTaken) {
        showToast('Jersey number already taken', 'error');
        return;
    }
    
    // Create new player
    const player = {
        id: Date.now(),
        name: name,
        jerseyNumber: jersey,
        position: position,
        contact: contact,
        email: email,
        available: available,
        stats: {
            goals: 0,
            assists: 0,
            matchesPlayed: 0
        }
    };
    
    // Add player to team
    team.players.push(player);
    
    // Update team in local storage
    localStorage.setItem(`team_${user.id}`, JSON.stringify(team));
    
    // Update UI
    updateTeamUI(team);
    loadPlayers(team.players);
    createAvailabilityChart(team);
    
    // Close modal and reset form
    closeAllModals();
    document.getElementById('add-player-form').reset();
    
    showToast('Player added successfully!', 'success');
}

// Load players
function loadPlayers(players) {
    const roster = document.getElementById('players-roster');
    
    if (!players || players.length === 0) {
        roster.innerHTML = `
            <tr>
                <td colspan="6" class="text-center">
                    <p>No players in roster</p>
                    <button class="btn btn-primary btn-small" onclick="showModal('add-player-modal')">
                        <i class="fas fa-user-plus"></i> Add First Player
                    </button>
                </td>
            </tr>
        `;
        return;
    }
    
    let html = '';
    players.forEach(player => {
        html += `
            <tr>
                <td>${player.jerseyNumber}</td>
                <td>
                    <strong>${player.name}</strong>
                    ${player.email ? `<br><small>${player.email}</small>` : ''}
                </td>
                <td>${player.position}</td>
                <td>${player.contact || '-'}</td>
                <td>
                    <span class="availability-dot ${player.available ? 'available' : 'unavailable'}"></span>
                    ${player.available ? 'Available' : 'Unavailable'}
                </td>
                <td>
                    <button class="btn-icon" onclick="editPlayer(${player.id})" title="Edit">
                        <i class="fas fa-edit"></i>
                    </button>
                    <button class="btn-icon danger" onclick="deletePlayer(${player.id})" title="Delete">
                        <i class="fas fa-trash"></i>
                    </button>
                </td>
            </tr>
        `;
    });
    
    roster.innerHTML = html;
}

// Create availability chart
function createAvailabilityChart(team) {
    const chartContainer = document.getElementById('availabilityChart');
    const players = team.players || [];
    
    if (players.length === 0) {
        chartContainer.innerHTML = `
            <div class="no-data-chart" style="text-align: center; padding: 2rem; color: var(--light-text);">
                <i class="fas fa-user-slash fa-3x"></i>
                <p>No player data</p>
            </div>
        `;
        return;
    }
    
    const availableCount = players.filter(p => p.available).length;
    const unavailableCount = players.length - availableCount;
    const availablePercent = (availableCount / players.length) * 100;
    const unavailablePercent = (unavailableCount / players.length) * 100;
    
    chartContainer.innerHTML = `
        <div class="simple-chart">
            <div class="availability-summary">
                <div class="availability-stat">
                    <span class="stat-value">${availableCount}</span>
                    <span class="stat-label">Available</span>
                </div>
                <div class="availability-stat">
                    <span class="stat-value">${unavailableCount}</span>
                    <span class="stat-label">Unavailable</span>
                </div>
            </div>
            <div class="availability-bars">
                <div class="availability-bar available" style="width: ${availablePercent}%">
                    <span>${availablePercent.toFixed(0)}%</span>
                </div>
                <div class="availability-bar unavailable" style="width: ${unavailablePercent}%">
                    <span>${unavailablePercent.toFixed(0)}%</span>
                </div>
            </div>
        </div>
    `;
}

// Filter players
function filterPlayers() {
    const searchTerm = document.getElementById('search-players').value.toLowerCase();
    const positionFilter = document.getElementById('position-filter').value;
    
    const user = getCurrentUser();
    if (!user) return;
    
    const teamData = localStorage.getItem(`team_${user.id}`);
    if (!teamData) return;
    
    const team = JSON.parse(teamData);
    const players = team.players || [];
    
    const filteredPlayers = players.filter(player => {
        // Search filter
        if (searchTerm && !player.name.toLowerCase().includes(searchTerm) && 
            !player.position.toLowerCase().includes(searchTerm)) {
            return false;
        }
        
        // Position filter
        if (positionFilter && player.position !== positionFilter) {
            return false;
        }
        
        return true;
    });
    
    loadPlayers(filteredPlayers);
}

// Import roster (placeholder)
function importRoster() {
    showToast('Import feature coming soon!', 'info');
}

// Edit player (placeholder)
function editPlayer(playerId) {
    showToast('Edit player feature coming soon!', 'info');
}

// Delete player
function deletePlayer(playerId) {
    if (!confirm('Are you sure you want to delete this player?')) return;
    
    const user = getCurrentUser();
    if (!user) return;
    
    const teamData = localStorage.getItem(`team_${user.id}`);
    if (!teamData) return;
    
    const team = JSON.parse(teamData);
    if (!team.players) return;
    
    // Remove player
    team.players = team.players.filter(p => p.id !== playerId);
    
    // Save updated team
    localStorage.setItem(`team_${user.id}`, JSON.stringify(team));
    
    // Update UI
    updateTeamUI(team);
    loadPlayers(team.players);
    createAvailabilityChart(team);
    
    showToast('Player deleted successfully', 'success');
}

// Edit match result (placeholder)
function editMatchResult(matchId) {
    showToast('Edit match result feature coming soon!', 'info');
}

// Delete match result
function deleteMatchResult(matchId) {
    if (!confirm('Are you sure you want to delete this match result?')) return;
    
    const user = getCurrentUser();
    if (!user) return;
    
    const teamData = localStorage.getItem(`team_${user.id}`);
    if (!teamData) return;
    
    const team = JSON.parse(teamData);
    if (!team.matchHistory) return;
    
    // Find match to get result for stats update
    const matchIndex = team.matchHistory.findIndex(m => m.id === matchId);
    if (matchIndex === -1) return;
    
    const match = team.matchHistory[matchIndex];
    
    // Update stats
    if (match.result === 'win') team.stats.wins--;
    if (match.result === 'loss') team.stats.losses--;
    if (match.result === 'draw') team.stats.draws--;
    
    // Remove match
    team.matchHistory.splice(matchIndex, 1);
    
    // Save updated team
    localStorage.setItem(`team_${user.id}`, JSON.stringify(team));
    
    // Update UI
    updateDashboardStats(team);
    loadMatchHistory(team);
    createPerformanceChart(team);
    
    showToast('Match result deleted successfully', 'success');
}

// ============= CREATE MATCH =============
function setupCreateMatch() {
    const matchForm = document.getElementById('match-form');
    const cancelBtn = document.getElementById('cancel-match');
    
    // Form submission
    matchForm.addEventListener('submit', function(e) {
        e.preventDefault();
        createMatch();
    });
    
    // Cancel button
    cancelBtn.addEventListener('click', function() {
        matchForm.reset();
        resetFormToDefaults();
        updateMatchPreview();
    });
    
    // Real-time preview
    const formInputs = matchForm.querySelectorAll('input, select, textarea');
    formInputs.forEach(input => {
        input.addEventListener('input', updateMatchPreview);
        input.addEventListener('change', updateMatchPreview);
    });
    
    // Set default values
    resetFormToDefaults();
    updateMatchPreview();
}

// Reset form to defaults
function resetFormToDefaults() {
    // Set default date to tomorrow
    const tomorrow = new Date();
    tomorrow.setDate(tomorrow.getDate() + 1);
    const dateString = tomorrow.toISOString().split('T')[0];
    document.getElementById('match-date').value = dateString;
    document.getElementById('match-date').min = dateString;
    
    // Set default time to 15:00
    document.getElementById('match-time').value = '15:00';
    
    // Set default location to central
    const locationOptions = document.querySelectorAll('.location-option');
    locationOptions.forEach(opt => opt.classList.remove('selected'));
    document.querySelector('.location-option[data-location="central"]').classList.add('selected');
    document.getElementById('venue-area').value = 'central';
}

// Update match preview
function updateMatchPreview() {
    const sport = document.getElementById('match-sport').value;
    const date = document.getElementById('match-date').value;
    const time = document.getElementById('match-time').value;
    const venue = document.getElementById('venue-name').value;
    const area = document.getElementById('venue-area').value;
    const description = document.getElementById('match-description').value;
    
    const preview = document.getElementById('match-preview');
    
    if (!sport && !date && !time && !venue) {
        preview.innerHTML = `
            <div class="preview-content">
                <p class="text-center">Fill the form to see preview</p>
            </div>
        `;
        return;
    }
    
    let html = '<div class="preview-content">';
    
    if (sport) {
        html += `<div class="preview-sport"><span>${sport.toUpperCase()}</span></div>`;
    }
    
    if (date) {
        const formattedDate = new Date(date).toLocaleDateString('en-US', {
            weekday: 'long',
            year: 'numeric',
            month: 'long',
            day: 'numeric'
        });
        html += `<div class="preview-date"><i class="fas fa-calendar"></i><span>${formattedDate}</span></div>`;
    }
    
    if (time) {
        html += `<div class="preview-time"><i class="fas fa-clock"></i><span>${time}</span></div>`;
    }
    
    if (venue) {
        html += `<div class="preview-venue"><i class="fas fa-map-marker-alt"></i><span>${venue}</span></div>`;
    }
    
    if (area) {
        const user = getCurrentUser();
        if (user && user.location) {
            const distance = calculateAreaDistance(user.location, area);
            html += `<div class="preview-distance"><i class="fas fa-road"></i><span>${distance} km away</span></div>`;
        }
    }
    
    if (description) {
        html += `<div class="preview-description"><p>${description}</p></div>`;
    }
    
    html += '</div>';
    preview.innerHTML = html;
}

// Create match
function createMatch() {
    const user = getCurrentUser();
    if (!user) {
        showToast('Please login to create matches', 'error');
        showModal('login-modal');
        return;
    }
    
    // Get form values
    const sport = document.getElementById('match-sport').value;
    const date = document.getElementById('match-date').value;
    const time = document.getElementById('match-time').value;
    const venue = document.getElementById('venue-name').value;
    const address = document.getElementById('venue-address').value;
    const area = document.getElementById('venue-area').value;
    const maxPlayers = document.getElementById('max-players').value;
    const description = document.getElementById('match-description').value;
    
    // Validation
    if (!sport || !date || !time || !venue) {
        showToast('Please fill in all required fields', 'error');
        return;
    }
    
    // Create match object
    const match = {
        id: Date.now(),
        sport: sport,
        date: date,
        time: time,
        venue: venue,
        address: address,
        area: area,
        homeTeam: user.school,
        awayTeam: null,
        maxPlayers: maxPlayers ? parseInt(maxPlayers) : null,
        description: description,
        status: 'open',
        createdBy: user.id,
        createdAt: new Date().toISOString()
    };
    
    // Calculate distance for current user
    if (user.location && area) {
        match.distance = calculateAreaDistance(user.location, area);
    }
    
    // Save match
    const matches = getMatches();
    matches.push(match);
    saveMatches(matches);
    
    // Reset form
    document.getElementById('match-form').reset();
    resetFormToDefaults();
    
    showToast('Match created successfully!', 'success');
    updateMatchPreview();
    
    // Switch to marketplace and refresh
    setTimeout(() => {
        document.querySelector('[href="#marketplace"]').click();
        loadMatches();
    }, 1000);
}

// ============= MODALS =============
function setupModals() {
    // Close modal buttons
    document.querySelectorAll('.close-modal').forEach(btn => {
        btn.addEventListener('click', closeAllModals);
    });
    
    // Close modal when clicking outside
    document.querySelectorAll('.modal').forEach(modal => {
        modal.addEventListener('click', function(e) {
            if (e.target === this) {
                closeAllModals();
            }
        });
    });
    
    // Escape key to close modals
    document.addEventListener('keydown', function(e) {
        if (e.key === 'Escape') {
            closeAllModals();
        }
    });
}

// Show modal
function showModal(modalId) {
    closeAllModals();
    const modal = document.getElementById(modalId);
    if (modal) {
        modal.classList.add('active');
        document.body.style.overflow = 'hidden';
    }
}

// Close all modals
function closeAllModals() {
    document.querySelectorAll('.modal').forEach(modal => {
        modal.classList.remove('active');
    });
    document.body.style.overflow = 'auto';
}

// ============= UTILITIES =============
// Show toast notification
function showToast(message, type = 'info') {
    const container = document.getElementById('toast-container');
    
    const toast = document.createElement('div');
    toast.className = `toast ${type}`;
    
    const icon = type === 'success' ? 'fa-check-circle' : 
                 type === 'error' ? 'fa-exclamation-circle' : 'fa-info-circle';
    
    toast.innerHTML = `
        <div class="toast-icon">
            <i class="fas ${icon}"></i>
        </div>
        <div class="toast-message">
            <strong>${type.charAt(0).toUpperCase() + type.slice(1)}</strong>
            <p>${message}</p>
        </div>
    `;
    
    container.appendChild(toast);
    
    // Remove toast after 5 seconds
    setTimeout(() => {
        if (toast.parentNode === container) {
            container.removeChild(toast);
        }
    }, 5000);
}

// Get sport icon
function getSportIcon(sport) {
    const icons = {
        football: '⚽',
        basketball: '🏀',
        cricket: '🏏',
        volleyball: '🏐',
        hockey: '🏑',
        badminton: '🏸',
        tennis: '🎾'
    };
    return icons[sport] || '🏆';
}

// Clear matches list
function clearMatchesList() {
    document.getElementById('matches-list').innerHTML = '';
}

// ============= INITIALIZATION =============
// Add CSS for simple charts
function addChartStyles() {
    const style = document.createElement('style');
    style.textContent = `
        .simple-chart {
            width: 100%;
        }
        
        .availability-summary {
            display: flex;
            justify-content: space-around;
            margin-bottom: 2rem;
        }
        
        .availability-stat {
            text-align: center;
        }
        
        .availability-stat .stat-value {
            display: block;
            font-size: 2rem;
            font-weight: 700;
            color: var(--primary-color);
        }
        
        .availability-stat .stat-label {
            font-size: 0.875rem;
            color: var(--light-text);
        }
        
        .availability-bars {
            display: flex;
            height: 40px;
            border-radius: 20px;
            overflow: hidden;
            background: var(--light-bg);
        }
        
        .availability-bar {
            display: flex;
            align-items: center;
            justify-content: center;
            color: white;
            font-weight: 600;
            font-size: 0.875rem;
            transition: width 0.3s ease;
        }
        
        .availability-bar.available {
            background: var(--success);
        }
        
        .availability-bar.unavailable {
            background: var(--danger);
        }
        
        .no-data-chart {
            display: flex;
            flex-direction: column;
            align-items: center;
            justify-content: center;
            height: 100%;
            color: var(--light-text);
        }
        
        .no-data-chart i {
            margin-bottom: 1rem;
        }
        
        .no-players {
            text-align: center;
            padding: 2rem;
            color: var(--light-text);
        }
        
        .no-players i {
            margin-bottom: 1rem;
        }
    `;
    document.head.appendChild(style);
}

// Initialize chart styles
addChartStyles();

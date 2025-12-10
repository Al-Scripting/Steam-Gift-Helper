import React, { useState, useEffect, useMemo } from 'react';
import { 
  Search, 
  Gift, 
  Heart, 
  Clock, 
  Trophy, 
  Gamepad2, 
  Star, 
  TrendingUp, 
  AlertCircle,
  User,
  Menu,
  X
} from 'lucide-react';

// --- MOCK DATA ECOSYSTEM ---

const MOCK_GAME_DATABASE = [
  { id: 1, title: "Elden Ring", genre: "RPG", price: 59.99, rating: 95, image: "https://images.unsplash.com/photo-1542751371-adc38448a05e?auto=format&fit=crop&q=80&w=300&h=150" },
  { id: 2, title: "Stardew Valley", genre: "Simulation", price: 14.99, rating: 98, image: "https://images.unsplash.com/photo-1593305841991-05c2e401908f?auto=format&fit=crop&q=80&w=300&h=150" },
  { id: 3, title: "Counter-Strike 2", genre: "FPS", price: 0.00, rating: 88, image: "https://images.unsplash.com/photo-1624138784181-dc7f5b75e52e?auto=format&fit=crop&q=80&w=300&h=150" },
  { id: 4, title: "Civilization VI", genre: "Strategy", price: 59.99, rating: 90, image: "https://images.unsplash.com/photo-1552820728-8b83bb6b773f?auto=format&fit=crop&q=80&w=300&h=150" },
  { id: 5, title: "Cyberpunk 2077", genre: "RPG", price: 59.99, rating: 86, image: "https://images.unsplash.com/photo-1538481199705-c710c4e965fc?auto=format&fit=crop&q=80&w=300&h=150" },
  { id: 6, title: "Hollow Knight", genre: "Platformer", price: 14.99, rating: 97, image: "https://images.unsplash.com/photo-1500964757637-c85e8a162699?auto=format&fit=crop&q=80&w=300&h=150" },
  { id: 7, title: "Baldur's Gate 3", genre: "RPG", price: 59.99, rating: 96, image: "https://images.unsplash.com/photo-1605901309584-818e25960b8f?auto=format&fit=crop&q=80&w=300&h=150" },
  { id: 8, title: "Factorio", genre: "Strategy", price: 35.00, rating: 98, image: "https://images.unsplash.com/photo-1614294149010-950b698f72c0?auto=format&fit=crop&q=80&w=300&h=150" },
  { id: 9, title: "Valorant", genre: "FPS", price: 0.00, rating: 80, image: "https://images.unsplash.com/photo-1542751371-adc38448a05e?auto=format&fit=crop&q=80&w=300&h=150" },
  { id: 10, title: "Animal Crossing", genre: "Simulation", price: 59.99, rating: 90, image: "https://images.unsplash.com/photo-1579373903781-fd5c0c30c4cd?auto=format&fit=crop&q=80&w=300&h=150" },
];

const MOCK_USERS = {
  "strategypro": {
    id: "76561198000000001",
    username: "StrategyPro",
    avatar: "https://api.dicebear.com/7.x/avataaars/svg?seed=StrategyPro",
    level: 42,
    status: "online",
    gamesOwned: [
      { id: 4, title: "Civilization VI", playtime: 850, lastPlayed: "2 days ago", genre: "Strategy" },
      { id: 8, title: "Factorio", playtime: 400, lastPlayed: "Yesterday", genre: "Strategy" },
      { id: 2, title: "Stardew Valley", playtime: 50, lastPlayed: "3 months ago", genre: "Simulation" }
    ],
    wishlist: [
      { id: 7, title: "Baldur's Gate 3", price: 59.99, added: "1 week ago" }
    ]
  },
  "fpsking": {
    id: "76561198000000002",
    username: "FpsKing",
    avatar: "https://api.dicebear.com/7.x/avataaars/svg?seed=FpsKing",
    level: 15,
    status: "in-game",
    gameStatus: "Counter-Strike 2",
    gamesOwned: [
      { id: 3, title: "Counter-Strike 2", playtime: 1200, lastPlayed: "Now", genre: "FPS" },
      { id: 9, title: "Valorant", playtime: 600, lastPlayed: "2 weeks ago", genre: "FPS" },
      { id: 5, title: "Cyberpunk 2077", playtime: 20, lastPlayed: "1 year ago", genre: "RPG" }
    ],
    wishlist: [
      { id: 1, title: "Elden Ring", price: 59.99, added: "2 days ago" }
    ]
  },
  "cozygamer": {
    id: "76561198000000003",
    username: "CozyGamer",
    avatar: "https://api.dicebear.com/7.x/avataaars/svg?seed=CozyGamer",
    level: 28,
    status: "offline",
    gamesOwned: [
      { id: 2, title: "Stardew Valley", playtime: 500, lastPlayed: "Yesterday", genre: "Simulation" },
      { id: 10, title: "Animal Crossing", playtime: 300, lastPlayed: "1 week ago", genre: "Simulation" },
      { id: 6, title: "Hollow Knight", playtime: 15, lastPlayed: "1 month ago", genre: "Platformer" }
    ],
    wishlist: [
      { id: 4, title: "Civilization VI", price: 59.99, added: "1 month ago" },
      { id: 1, title: "Elden Ring", price: 59.99, added: "3 months ago" } // Atypical interest
    ]
  }
};

// --- COMPONENTS ---

const StatCard = ({ icon: Icon, label, value, subtext, color = "blue" }) => (
  <div className="bg-gray-800/50 backdrop-blur-sm p-4 rounded-xl border border-gray-700/50 hover:border-gray-600 transition-all duration-300">
    <div className="flex items-start justify-between">
      <div>
        <p className="text-gray-400 text-sm font-medium mb-1">{label}</p>
        <h3 className="text-2xl font-bold text-white mb-1">{value}</h3>
        {subtext && <p className="text-xs text-gray-500">{subtext}</p>}
      </div>
      <div className={`p-2 rounded-lg bg-${color}-500/10`}>
        <Icon className={`w-5 h-5 text-${color}-400`} />
      </div>
    </div>
  </div>
);

const GameCard = ({ game, rank }) => (
  <div className="flex items-center gap-4 p-3 rounded-lg bg-gray-800/30 hover:bg-gray-800/60 transition-colors border border-transparent hover:border-gray-700 group">
    <div className="flex-shrink-0 relative">
      <div className="w-16 h-20 rounded bg-gray-700 overflow-hidden shadow-lg relative">
        <div className="absolute inset-0 flex items-center justify-center text-gray-500 text-xs text-center p-1">
          {game.title}
        </div>
        {/* Placeholder for actual game art */}
        <div className={`absolute inset-0 bg-gradient-to-br from-blue-900 to-gray-900 opacity-80 group-hover:opacity-60 transition-opacity`} />
        {rank && (
          <div className="absolute top-0 left-0 bg-yellow-500/90 text-black font-bold text-xs px-1.5 py-0.5 rounded-br">
            #{rank}
          </div>
        )}
      </div>
    </div>
    <div className="flex-1 min-w-0">
      <h4 className="text-white font-medium truncate">{game.title}</h4>
      <div className="flex items-center gap-3 text-sm text-gray-400 mt-1">
        <span className="flex items-center gap-1">
          <Clock className="w-3 h-3" />
          {game.playtime}h
        </span>
        <span className="flex items-center gap-1">
          <Gamepad2 className="w-3 h-3" />
          {game.genre}
        </span>
      </div>
    </div>
    <div className="text-right text-xs text-gray-500 hidden sm:block">
      Last played<br />
      <span className="text-gray-300">{game.lastPlayed}</span>
    </div>
  </div>
);

const RecommendationCard = ({ title, reason, game, matchScore }) => (
  <div className="relative overflow-hidden rounded-xl border border-blue-500/30 bg-gradient-to-br from-gray-800 to-gray-900 p-1 shadow-2xl">
    <div className="absolute top-0 right-0 -mt-2 -mr-2 w-24 h-24 bg-blue-500/20 blur-3xl rounded-full pointer-events-none"></div>
    
    <div className="relative bg-gray-900/90 rounded-lg p-5 h-full flex flex-col">
      <div className="flex justify-between items-start mb-4">
        <div>
          <h3 className="text-blue-400 text-sm font-bold tracking-wider uppercase mb-1">{title}</h3>
          <h2 className="text-2xl font-bold text-white">{game.title}</h2>
        </div>
        <div className="flex flex-col items-end">
          <div className="text-2xl font-bold text-green-400">{matchScore}%</div>
          <span className="text-xs text-green-500/70 uppercase font-bold tracking-wider">Match</span>
        </div>
      </div>

      <div className="flex gap-2 mb-4">
        <span className="px-2 py-1 rounded bg-gray-800 text-gray-300 text-xs font-medium border border-gray-700">
          {game.genre}
        </span>
        <span className="px-2 py-1 rounded bg-gray-800 text-yellow-500 text-xs font-medium border border-gray-700 flex items-center gap-1">
          <Star className="w-3 h-3 fill-current" /> {game.rating}%
        </span>
        <span className="px-2 py-1 rounded bg-gray-800 text-green-400 text-xs font-medium border border-gray-700">
          ${game.price}
        </span>
      </div>
      
      <p className="text-gray-400 text-sm leading-relaxed mb-6 flex-grow">
        {reason}
      </p>

      <button className="w-full py-3 rounded-lg bg-blue-600 hover:bg-blue-500 text-white font-bold transition-all shadow-lg shadow-blue-900/20 flex items-center justify-center gap-2 group">
        <Gift className="w-4 h-4 group-hover:scale-110 transition-transform" />
        Gift on Steam
      </button>
    </div>
  </div>
);

const App = () => {
  const [searchQuery, setSearchQuery] = useState("");
  const [userData, setUserData] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [activeTab, setActiveTab] = useState('overview');

  // --- LOGIC ---

  const handleSearch = async (e, directQuery = null) => {
    if (e) e.preventDefault();
    const activeQuery = directQuery || searchQuery;
    setLoading(true);
    setError(null);
    setUserData(null);
    
    // 1. USE DIRECT VALUE IF AVAILABLE
    console.log("Searching for:", activeQuery); // <--- LOOK FOR THIS IN CONSOLE

    setLoading(true);
    setError(null);
    setUserData(null);

    // 2. CHECK MOCK DATA
    const lowerQuery = activeQuery.toLowerCase().trim();
    if (MOCK_USERS[lowerQuery]) {
      setTimeout(() => {
        setUserData(MOCK_USERS[lowerQuery]);
        setLoading(false);
      }, 500);
      return; 
    }

    // 3. CALL SERVER
    try {
      const response = await fetch(`http://localhost:5000/api/search/${activeQuery}`);
      const data = await response.json();

      if (!response.ok) throw new Error(data.error || 'Failed to fetch data');

      // Sort Wishlist: Recently Added First (Descending order of dateAdded)
      const sortedWishlist = (data.wishlist || []).sort((a, b) => b.dateAdded - a.dateAdded);

      const realUser = {
        id: data.user.steamid,
        username: data.user.personaname,
        avatar: data.user.avatarfull,
        level: "??", 
        status: data.user.personastate === 1 ? 'online' : 'offline',
        gamesOwned: data.games.map(g => ({
            id: g.appid,
            title: g.name,
            playtime: Math.round(g.playtime_forever / 60),
            genre: "Unknown", 
            // We'll use a placeholder image from Steam's CDN
            image: `https://steamcdn-a.akamaihd.net/steam/apps/${g.appid}/header.jpg`
        })),
        wishlist: sortedWishlist
      };

      setUserData(realUser);
    } catch (err) {
      console.error(err);
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };
  
  
  const analysis = useMemo(() => {
    if (!userData) return null;

    // 1. Calculate Genre Weights (Normalized)
    const genrePlaytime = {};
    let totalPlaytime = 0;

    userData.gamesOwned.forEach(game => {
      // Since real API doesn't give genre easily, we simulate it for the "Unknown" ones
      // In a real production app, you'd have a separate database for this.
      // For now, we will assume the mock database genres if matches, or "General"
      const mockMatch = MOCK_GAME_DATABASE.find(m => m.title === game.title);
      const genre = mockMatch ? mockMatch.genre : "General"; 
      
      genrePlaytime[genre] = (genrePlaytime[genre] || 0) + game.playtime;
      totalPlaytime += game.playtime;
    });

    // Normalize: Create a score from 0.0 to 1.0 for each genre
    // Example: If I play RPGs for 80 hours out of 100 total, my RPG weight is 0.8
    const genreWeights = {};
    Object.keys(genrePlaytime).forEach(genre => {
      genreWeights[genre] = totalPlaytime > 0 ? (genrePlaytime[genre] / totalPlaytime) : 0;
    });

    const favoriteGenre = Object.keys(genrePlaytime).reduce((a, b) => genrePlaytime[a] > genrePlaytime[b] ? a : b, "General");

    // 2. Generate Recommendations with Weighted Scores
    const ownedIds = new Set(userData.gamesOwned.map(g => g.id));
    
    // Strategy A: Wishlist (High Score)
    const wishlistRecs = userData.wishlist.slice(0, 3).map(w => ({
      game: { ...w, genre: "Wishlist" }, // Pass the wishlist object format
      reason: `They added this to their wishlist on ${new Date(w.dateAdded * 1000).toLocaleDateString()}. Recent interest!`,
      score: 100, // Always top priority
      type: "Wishlist",
      link: `https://store.steampowered.com/app/${w.id}`
    }));

    // Strategy B: Weighted Discovery
    const genreRecs = MOCK_GAME_DATABASE
      .filter(g => !ownedIds.has(g.id))
      .map(g => {
        const affinity = genreWeights[g.genre] || 0.1; // Default low affinity
        // Score = (Game Rating * 0.4) + (User Affinity * 60)
        // This balances "Good Game" vs "Genre they actually play"
        const weightedScore = (g.rating * 0.4) + (affinity * 100 * 0.6);
        
        return {
          game: g,
          reason: `Calculated affinity: ${(affinity * 100).toFixed(0)}%. This matches their playstyle behavior.`,
          score: weightedScore,
          type: "Smart Match",
          link: `https://store.steampowered.com/app/${g.id}` // Link fix
        };
      });

    const allRecommendations = [...wishlistRecs, ...genreRecs].sort((a, b) => b.score - a.score);

    return {
      favoriteGenre,
      totalPlaytime,
      recommendations: allRecommendations.slice(0, 3)
    };
  }, [userData]);

  return (
    <div className="min-h-screen bg-[#1b2838] text-gray-100 font-sans selection:bg-blue-500/30">
      
      {/* Navigation */}
      <nav className="sticky top-0 z-50 bg-[#171a21]/95 backdrop-blur border-b border-gray-800 shadow-xl">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-16">
            <div className="flex items-center gap-3">
              <Gift className="w-8 h-8 text-blue-500" />
              <span className="text-xl font-bold tracking-tight bg-gradient-to-r from-blue-400 to-blue-200 bg-clip-text text-transparent">
                SteamGifter
              </span>
            </div>
            
            <div className="hidden md:flex items-center space-x-8 text-sm font-medium text-gray-400">
              <a href="#" className="hover:text-white transition-colors">Store</a>
              <a href="#" className="hover:text-white transition-colors">Community</a>
              <a href="#" className="text-white">Gifting Lab</a>
            </div>

            <div className="flex items-center gap-4">
              <div className="h-8 w-8 rounded-full bg-gradient-to-tr from-blue-600 to-cyan-400 border-2 border-white/10" />
            </div>
          </div>
        </div>
      </nav>

      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        
        {/* Search Hero */}
        {!userData && !loading && (
          <div className="flex flex-col items-center justify-center min-h-[60vh] text-center space-y-8 animate-fade-in">
            <div className="space-y-4 max-w-2xl">
              <h1 className="text-5xl md:text-6xl font-black text-white tracking-tight">
                Find the <span className="text-blue-500">perfect game</span><br />
                for your friends.
              </h1>
              <p className="text-xl text-gray-400">
                Analyze libraries, check wishlists, and get AI-powered gift recommendations instantly.
              </p>
            </div>

            <form onSubmit={handleSearch} className="w-full max-w-xl relative group">
              <div className="absolute -inset-1 bg-gradient-to-r from-blue-600 to-cyan-600 rounded-xl blur opacity-25 group-hover:opacity-50 transition duration-1000"></div>
              <div className="relative flex items-center bg-[#2a475e] rounded-xl overflow-hidden shadow-2xl border border-gray-700">
                <Search className="w-6 h-6 text-gray-400 ml-4" />
                <input
                  type="text"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  placeholder="Enter Steam Username (e.g., StrategyPro)..."
                  className="w-full bg-transparent border-none text-white px-4 py-4 focus:ring-0 placeholder-gray-400 text-lg outline-none"
                />
                <button 
                  type="submit"
                  className="bg-blue-600 hover:bg-blue-500 text-white px-8 py-4 font-bold transition-colors"
                >
                  Analyze
                </button>
              </div>
            </form>

            <div className="flex flex-wrap justify-center gap-3 text-sm text-gray-500">
              <span>Try searching:</span>
              {['StrategyPro', 'FpsKing', 'CozyGamer'].map(user => (
                <button 
                  key={user}
                  onClick={() => { 
                    setSearchQuery(user); // Update the input box visually
                    handleSearch(null, user); // Run the search immediately with the value
                  }}
                  className="text-blue-400 hover:text-blue-300 hover:underline cursor-pointer"
                >
                  {user}
                </button>
              ))}
            </div>

            {error && (
              <div className="bg-red-500/10 text-red-400 px-6 py-3 rounded-lg border border-red-500/20 flex items-center gap-2">
                <AlertCircle className="w-5 h-5" />
                {error}
              </div>
            )}
          </div>
        )}

        {/* Loading State */}
        {loading && (
          <div className="flex flex-col items-center justify-center min-h-[50vh] space-y-6">
            <div className="relative">
              <div className="w-16 h-16 border-4 border-blue-500/30 border-t-blue-500 rounded-full animate-spin"></div>
              <div className="absolute inset-0 flex items-center justify-center">
                <Gamepad2 className="w-6 h-6 text-blue-500 animate-pulse" />
              </div>
            </div>
            <p className="text-gray-400 animate-pulse">Scanning Steam Library...</p>
          </div>
        )}

        {/* Results Dashboard */}
        {userData && analysis && (
          <div className="animate-fade-in space-y-8">
            
            {/* Header / New Search */}
            <div className="flex items-center justify-between">
              <button 
                onClick={() => setUserData(null)}
                className="text-gray-400 hover:text-white flex items-center gap-2 text-sm font-medium transition-colors"
              >
                <Search className="w-4 h-4" /> Search another user
              </button>
              <div className="text-xs text-gray-500 bg-gray-800/50 px-3 py-1 rounded-full border border-gray-700">
                Simulated Data Mode
              </div>
            </div>

            {/* Profile Header */}
            <div className="bg-gradient-to-r from-[#2a475e] to-[#1b2838] p-6 rounded-2xl border border-gray-700 shadow-xl flex flex-col md:flex-row items-center md:items-start gap-6">
              <div className="relative">
                <img 
                  src={userData.avatar} 
                  alt={userData.username} 
                  className="w-24 h-24 rounded-lg border-2 border-blue-400 shadow-lg"
                />
                <div className={`absolute bottom-0 right-0 w-4 h-4 rounded-full border-2 border-[#2a475e] ${userData.status === 'online' ? 'bg-blue-400' : userData.status === 'in-game' ? 'bg-green-500' : 'bg-gray-500'}`} />
              </div>
              
              <div className="flex-1 text-center md:text-left">
                <h2 className="text-3xl font-bold text-white mb-1">{userData.username}</h2>
                <div className="flex flex-wrap items-center justify-center md:justify-start gap-4 text-sm text-gray-300">
                  <span className="flex items-center gap-1">
                    <Trophy className="w-4 h-4 text-yellow-500" />
                    Level {userData.level}
                  </span>
                  <span className="text-gray-500">|</span>
                  <span className="text-blue-300">
                    {userData.status === 'in-game' ? `Playing ${userData.gameStatus}` : userData.status}
                  </span>
                </div>
              </div>

              <div className="flex gap-4">
                <div className="text-center px-6 py-2 bg-black/20 rounded-lg">
                  <div className="text-2xl font-bold text-white">{userData.gamesOwned.length}</div>
                  <div className="text-xs text-gray-400 uppercase tracking-wider">Games</div>
                </div>
                <div className="text-center px-6 py-2 bg-black/20 rounded-lg">
                  <div className="text-2xl font-bold text-white">{analysis.totalPlaytime}h</div>
                  <div className="text-xs text-gray-400 uppercase tracking-wider">Hours</div>
                </div>
              </div>
            </div>

            {/* Analytics Grid */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <StatCard 
                icon={TrendingUp} 
                label="Favorite Genre" 
                value={analysis.favoriteGenre} 
                subtext="Based on total playtime"
                color="green"
              />
              <StatCard 
                icon={Heart} 
                label="Wishlist Items" 
                value={userData.wishlist.length} 
                subtext="High priority gifts"
                color="pink"
              />
              <StatCard 
                icon={Star} 
                label="Avg Game Rating" 
                value="92%" 
                subtext="They have good taste"
                color="yellow"
              />
            </div>

            {/* Main Content Area */}
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
              
              {/* Left Column: Recommendations (The Core Feature) */}
              <div className="lg:col-span-2 space-y-6">
                <div className="flex items-center gap-3 mb-2">
                  <Gift className="w-6 h-6 text-blue-400" />
                  <h3 className="text-xl font-bold text-white">Gift Recommendations</h3>
                </div>
                
                <div className="grid grid-cols-1 gap-6">
                  {analysis.recommendations.map((rec, idx) => (
                    <RecommendationCard 
                      key={idx}
                      title={`Recommendation #${idx + 1}: ${rec.type}`}
                      reason={rec.reason}
                      game={rec.game}
                      matchScore={rec.score.toFixed(0)} // Round the score
                      link={rec.link} // Pass the link!
                    />
                  ))}
                </div>
              </div>

              {/* Right Column: Library & Details */}
              <div className="space-y-8">
                
                {/* Most Played */}
                <div className="bg-[#171a21] rounded-xl border border-gray-800 p-5">
                  <h3 className="text-lg font-bold text-white mb-4 flex items-center gap-2">
                    <Clock className="w-5 h-5 text-gray-400" />
                    Most Played
                  </h3>
                  <div className="space-y-3">
                    {[...userData.gamesOwned]
                      .sort((a, b) => b.playtime - a.playtime)
                      .slice(0, 5)
                      .map((game, idx) => (
                        <GameCard key={game.id} game={game} rank={idx + 1} />
                    ))}
                  </div>
                </div>

                {/* Wishlist Preview */}
                <div className="bg-[#171a21] rounded-xl border border-gray-800 p-5">
                   <h3 className="text-lg font-bold text-white mb-4 flex items-center gap-2">
                    <Heart className="w-5 h-5 text-pink-500" />
                    Wishlist
                  </h3>
                  {userData.wishlist.length > 0 ? (
                    <div className="space-y-3">
                      {userData.wishlist.map(game => (
                        <div key={game.id} className="flex justify-between items-center p-3 bg-gray-800/30 rounded border border-gray-700">
                          <span className="font-medium text-sm text-blue-300">{game.title}</span>
                          <span className="text-xs font-bold text-gray-400">${game.price}</span>
                        </div>
                      ))}
                    </div>
                  ) : (
                    <div className="text-center py-8 text-gray-500 text-sm italic">
                      No public wishlist items found.
                    </div>
                  )}
                </div>

              </div>
            </div>

          </div>
        )}
      </main>
    </div>
  );
};

export default App;
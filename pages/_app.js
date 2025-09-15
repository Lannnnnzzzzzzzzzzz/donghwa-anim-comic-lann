// pages/_app.js
import { useState, useEffect } from 'react';
import { useRouter } from 'next/router';
import Head from 'next/head';
import '../styles/globals.css';

function MyApp({ Component, pageProps }) {
  const [darkMode, setDarkMode] = useState(true);
  const [searchOpen, setSearchOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [searchResults, setSearchResults] = useState({});
  const [loading, setLoading] = useState(false);
  const [activeSearchTab, setActiveSearchTab] = useState('anime');
  const router = useRouter();

  // Initialize dark mode
  useEffect(() => {
    const isDark = localStorage.getItem('darkMode') === 'true';
    setDarkMode(isDark === null ? true : isDark);
  }, []);

  // Apply dark mode class to body
  useEffect(() => {
    if (darkMode) {
      document.documentElement.classList.add('dark');
    } else {
      document.documentElement.classList.remove('dark');
    }
    localStorage.setItem('darkMode', darkMode);
  }, [darkMode]);

  // Handle search
  const handleSearch = async () => {
    if (!searchQuery.trim()) return;
    
    setLoading(true);
    try {
      const results = {};
      
      // Search Anime
      if (activeSearchTab === 'anime' || activeSearchTab === 'all') {
        const animeRes = await fetch(`https://www.sankavollerei.com/anime/episode/${searchQuery}?page=1`);
        if (animeRes.ok) {
          results.anime = await animeRes.json();
        }
      }
      
      // Search Donghua
      if (activeSearchTab === 'donghua' || activeSearchTab === 'all') {
        const donghuaRes = await fetch(`https://www.sankavollerei.com/anime/donghua/search/${searchQuery}/1`);
        if (donghuaRes.ok) {
          results.donghua = await donghuaRes.json();
        }
      }
      
      // Search Comic
      if (activeSearchTab === 'comic' || activeSearchTab === 'all') {
        const comicRes = await fetch(`https://www.sankavollerei.com/comic/search?q=${searchQuery}`);
        if (comicRes.ok) {
          results.comic = await comicRes.json();
        }
      }
      
      setSearchResults(results);
    } catch (error) {
      console.error('Search error:', error);
    } finally {
      setLoading(false);
    }
  };

  // Toggle dark mode
  const toggleDarkMode = () => {
    setDarkMode(!darkMode);
  };

  return (
    <div className={`min-h-screen ${darkMode ? 'dark bg-gray-900 text-white' : 'bg-gray-100 text-gray-900'}`}>
      <Head>
        <title>LNNZEPHRY - Streaming All-in-One</title>
        <meta name="description" content="Streaming platform for Anime, Donghua, and Comic" />
        <link rel="icon" href="/favicon.ico" />
      </Head>

      {/* Header */}
      <header className="sticky top-0 z-50 bg-gray-800 dark:bg-gray-900 shadow-lg">
        <div className="container mx-auto px-4 py-3 flex items-center justify-between">
          <div className="flex items-center space-x-2">
            <button 
              onClick={() => router.push('/')}
              className="text-xl font-bold text-indigo-400 hover:text-indigo-300 transition"
            >
              LNNZEPHRY
            </button>
          </div>

          {/* Navigation */}
          <nav className="hidden md:flex space-x-6">
            <button 
              onClick={() => router.push('/')}
              className={`hover:text-indigo-400 transition ${router.pathname === '/' ? 'text-indigo-400' : ''}`}
            >
              Home
            </button>
            <button 
              onClick={() => router.push('/anime')}
              className={`hover:text-indigo-400 transition ${router.pathname.startsWith('/anime') ? 'text-indigo-400' : ''}`}
            >
              Anime
            </button>
            <button 
              onClick={() => router.push('/donghua')}
              className={`hover:text-indigo-400 transition ${router.pathname.startsWith('/donghua') ? 'text-indigo-400' : ''}`}
            >
              Donghua
            </button>
            <button 
              onClick={() => router.push('/comic')}
              className={`hover:text-indigo-400 transition ${router.pathname.startsWith('/comic') ? 'text-indigo-400' : ''}`}
            >
              Comic
            </button>
            <button 
              onClick={() => router.push('/schedule')}
              className={`hover:text-indigo-400 transition ${router.pathname === '/schedule' ? 'text-indigo-400' : ''}`}
            >
              Jadwal
            </button>
            <button 
              onClick={() => router.push('/genres')}
              className={`hover:text-indigo-400 transition ${router.pathname === '/genres' ? 'text-indigo-400' : ''}`}
            >
              Genre
            </button>
          </nav>

          <div className="flex items-center space-x-4">
            {/* Search Button */}
            <button 
              onClick={() => setSearchOpen(!searchOpen)}
              className="p-2 rounded-full hover:bg-gray-700 transition"
            >
              <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
                <path fillRule="evenodd" d="M8 4a4 4 0 100 8 4 4 0 000-8zM2 8a6 6 0 1110.89 3.476l4.817 4.817a1 1 0 01-1.414 1.414l-4.816-4.816A6 6 0 012 8z" clipRule="evenodd" />
              </svg>
            </button>

            {/* Dark Mode Toggle */}
            <button 
              onClick={toggleDarkMode}
              className="p-2 rounded-full hover:bg-gray-700 transition"
            >
              {darkMode ? (
                <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
                  <path fillRule="evenodd" d="M10 2a1 1 0 011 1v1a1 1 0 11-2 0V3a1 1 0 011-1zm4 8a4 4 0 11-8 0 4 4 0 018 0zm-.464 4.95l.707.707a1 1 0 001.414-1.414l-.707-.707a1 1 0 00-1.414 1.414zm2.12-10.607a1 1 0 010 1.414l-.706.707a1 1 0 11-1.414-1.414l.707-.707a1 1 0 011.414 0zM17 11a1 1 0 100-2h-1a1 1 0 100 2h1zm-7 4a1 1 0 011 1v1a1 1 0 11-2 0v-1a1 1 0 011-1zM5.05 6.464A1 1 0 106.465 5.05l-.708-.707a1 1 0 00-1.414 1.414l.707.707zm1.414 8.486l-.707.707a1 1 0 01-1.414-1.414l.707-.707a1 1 0 011.414 1.414zM4 11a1 1 0 100-2H3a1 1 0 000 2h1z" clipRule="evenodd" />
                </svg>
              ) : (
                <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
                  <path d="M17.293 13.293A8 8 0 016.707 2.707a8.001 8.001 0 1010.586 10.586z" />
                </svg>
              )}
            </button>

            {/* Mobile Menu Button */}
            <button className="md:hidden p-2 rounded-full hover:bg-gray-700 transition">
              <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
                <path fillRule="evenodd" d="M3 5a1 1 0 011-1h12a1 1 0 110 2H4a1 1 0 01-1-1zM3 10a1 1 0 011-1h12a1 1 0 110 2H4a1 1 0 01-1-1zM3 15a1 1 0 011-1h12a1 1 0 110 2H4a1 1 0 01-1-1z" clipRule="evenodd" />
              </svg>
            </button>
          </div>
        </div>

        {/* Search Overlay */}
        {searchOpen && (
          <div className="fixed inset-0 bg-black bg-opacity-75 z-50 flex items-start justify-center pt-20">
            <div className="bg-gray-800 dark:bg-gray-900 w-full max-w-3xl rounded-lg shadow-xl p-6">
              <div className="flex justify-between items-center mb-4">
                <h2 className="text-xl font-bold">Search</h2>
                <button 
                  onClick={() => setSearchOpen(false)}
                  className="p-2 rounded-full hover:bg-gray-700 transition"
                >
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
                    <path fillRule="evenodd" d="M4.293 4.293a1 1 0 011.414 0L10 8.586l4.293-4.293a1 1 0 111.414 1.414L11.414 10l4.293 4.293a1 1 0 01-1.414 1.414L10 11.414l-4.293 4.293a1 1 0 01-1.414-1.414L8.586 10 4.293 5.707a1 1 0 010-1.414z" clipRule="evenodd" />
                  </svg>
                </button>
              </div>

              {/* Search Input */}
              <div className="flex mb-4">
                <input
                  type="text"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  onKeyPress={(e) => e.key === 'Enter' && handleSearch()}
                  placeholder="Search Anime, Donghua, or Comic..."
                  className="flex-grow px-4 py-2 bg-gray-700 text-white rounded-l-lg focus:outline-none focus:ring-2 focus:ring-indigo-500"
                />
                <button
                  onClick={handleSearch}
                  disabled={loading}
                  className="bg-indigo-600 hover:bg-indigo-700 px-4 py-2 rounded-r-lg transition disabled:opacity-50"
                >
                  {loading ? 'Searching...' : 'Search'}
                </button>
              </div>

              {/* Search Tabs */}
              <div className="flex border-b border-gray-700 mb-4">
                {['all', 'anime', 'donghua', 'comic'].map((tab) => (
                  <button
                    key={tab}
                    onClick={() => setActiveSearchTab(tab)}
                    className={`px-4 py-2 font-medium capitalize ${activeSearchTab === tab ? 'text-indigo-400 border-b-2 border-indigo-400' : 'text-gray-400 hover:text-white'}`}
                  >
                    {tab}
                  </button>
                ))}
              </div>

              {/* Search Results */}
              <div className="max-h-96 overflow-y-auto">
                {loading ? (
                  <div className="flex justify-center py-8">
                    <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-indigo-500"></div>
                  </div>
                ) : (
                  <>
                    {searchResults.anime && (
                      <div className="mb-6">
                        <h3 className="text-lg font-semibold mb-2">Anime Results</h3>
                        <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
                          {searchResults.anime.map((item) => (
                            <div 
                              key={item.id} 
                              className="bg-gray-700 rounded-lg overflow-hidden cursor-pointer hover:bg-gray-600 transition"
                              onClick={() => {
                                router.push(`/anime/${item.slug}`);
                                setSearchOpen(false);
                              }}
                            >
                              <div className="aspect-w-3 aspect-h-4 bg-gray-600">
                                <img 
                                  src={item.thumbnail} 
                                  alt={item.title} 
                                  className="w-full h-48 object-cover"
                                />
                              </div>
                              <div className="p-2">
                                <h4 className="font-medium truncate">{item.title}</h4>
                                <p className="text-sm text-gray-400 truncate">{item.episode}</p>
                              </div>
                            </div>
                          ))}
                        </div>
                      </div>
                    )}

                    {searchResults.donghua && (
                      <div className="mb-6">
                        <h3 className="text-lg font-semibold mb-2">Donghua Results</h3>
                        <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
                          {searchResults.donghua.map((item) => (
                            <div 
                              key={item.id} 
                              className="bg-gray-700 rounded-lg overflow-hidden cursor-pointer hover:bg-gray-600 transition"
                              onClick={() => {
                                router.push(`/donghua/${item.slug}`);
                                setSearchOpen(false);
                              }}
                            >
                              <div className="aspect-w-3 aspect-h-4 bg-gray-600">
                                <img 
                                  src={item.thumbnail} 
                                  alt={item.title} 
                                  className="w-full h-48 object-cover"
                                />
                              </div>
                              <div className="p-2">
                                <h4 className="font-medium truncate">{item.title}</h4>
                                <p className="text-sm text-gray-400 truncate">{item.status}</p>
                              </div>
                            </div>
                          ))}
                        </div>
                      </div>
                    )}

                    {searchResults.comic && (
                      <div className="mb-6">
                        <h3 className="text-lg font-semibold mb-2">Comic Results</h3>
                        <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
                          {searchResults.comic.map((item) => (
                            <div 
                              key={item.id} 
                              className="bg-gray-700 rounded-lg overflow-hidden cursor-pointer hover:bg-gray-600 transition"
                              onClick={() => {
                                router.push(`/comic/${item.slug}`);
                                setSearchOpen(false);
                              }}
                            >
                              <div className="aspect-w-3 aspect-h-4 bg-gray-600">
                                <img 
                                  src={item.thumbnail} 
                                  alt={item.title} 
                                  className="w-full h-48 object-cover"
                                />
                              </div>
                              <div className="p-2">
                                <h4 className="font-medium truncate">{item.title}</h4>
                                <p className="text-sm text-gray-400 truncate">{item.chapter}</p>
                              </div>
                            </div>
                          ))}
                        </div>
                      </div>
                    )}

                    {!Object.keys(searchResults).length && searchQuery && (
                      <div className="text-center py-8 text-gray-400">
                        No results found for "{searchQuery}"
                      </div>
                    )}
                  </>
                )}
              </div>
            </div>
          </div>
        )}
      </header>

      {/* Mobile Navigation */}
      <div className="md:hidden fixed bottom-0 left-0 right-0 bg-gray-800 dark:bg-gray-900 z-40 border-t border-gray-700">
        <div className="grid grid-cols-6 gap-1 p-2">
          <button 
            onClick={() => router.push('/')}
            className={`flex flex-col items-center justify-center p-2 rounded-lg ${router.pathname === '/' ? 'text-indigo-400 bg-gray-700' : 'text-gray-400'}`}
          >
            <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
              <path d="M10.707 2.293a1 1 0 00-1.414 0l-7 7a1 1 0 001.414 1.414L4 10.414V17a1 1 0 001 1h2a1 1 0 001-1v-2a1 1 0 011-1h2a1 1 0 011 1v2a1 1 0 001 1h2a1 1 0 001-1v-6.586l.293.293a1 1 0 001.414-1.414l-7-7z" />
            </svg>
            <span className="text-xs mt-1">Home</span>
          </button>
          <button 
            onClick={() => router.push('/anime')}
            className={`flex flex-col items-center justify-center p-2 rounded-lg ${router.pathname.startsWith('/anime') ? 'text-indigo-400 bg-gray-700' : 'text-gray-400'}`}
          >
            <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
              <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM9.555 7.168A1 1 0 008 8v4a1 1 0 001.555.832l3-2a1 1 0 000-1.664l-3-2z" clipRule="evenodd" />
            </svg>
            <span className="text-xs mt-1">Anime</span>
          </button>
          <button 
            onClick={() => router.push('/donghua')}
            className={`flex flex-col items-center justify-center p-2 rounded-lg ${router.pathname.startsWith('/donghua') ? 'text-indigo-400 bg-gray-700' : 'text-gray-400'}`}
          >
            <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
              <path d="M2 6a2 2 0 012-2h6a2 2 0 012 2v8a2 2 0 01-2 2H4a2 2 0 01-2-2V6zM14 6a2 2 0 012-2h2a2 2 0 012 2v8a2 2 0 01-2 2h-2a2 2 0 01-2-2V6z" />
            </svg>
            <span className="text-xs mt-1">Donghua</span>
          </button>
          <button 
            onClick={() => router.push('/comic')}
            className={`flex flex-col items-center justify-center p-2 rounded-lg ${router.pathname.startsWith('/comic') ? 'text-indigo-400 bg-gray-700' : 'text-gray-400'}`}
          >
            <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
              <path d="M9 4.804A7.968 7.968 0 005.5 4c-1.255 0-2.443.29-3.5.804v10A7.969 7.969 0 015.5 14c1.669 0 3.218.51 4.5 1.385A7.962 7.962 0 0114.5 14c1.255 0 2.443.29 3.5.804v-10A7.968 7.968 0 0014.5 4c-1.255 0-2.443.29-3.5.804V12a1 1 0 11-2 0V4.804z" />
            </svg>
            <span className="text-xs mt-1">Comic</span>
          </button>
          <button 
            onClick={() => router.push('/schedule')}
            className={`flex flex-col items-center justify-center p-2 rounded-lg ${router.pathname === '/schedule' ? 'text-indigo-400 bg-gray-700' : 'text-gray-400'}`}
          >
            <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
              <path fillRule="evenodd" d="M6 2a1 1 0 00-1 1v1H4a2 2 0 00-2 2v10a2 2 0 002 2h12a2 2 0 002-2V6a2 2 0 00-2-2h-1V3a1 1 0 10-2 0v1H7V3a1 1 0 00-1-1zm0 5a1 1 0 000 2h8a1 1 0 100-2H6z" clipRule="evenodd" />
            </svg>
            <span className="text-xs mt-1">Jadwal</span>
          </button>
          <button 
            onClick={() => router.push('/genres')}
            className={`flex flex-col items-center justify-center p-2 rounded-lg ${router.pathname === '/genres' ? 'text-indigo-400 bg-gray-700' : 'text-gray-400'}`}
          >
            <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
              <path fillRule="evenodd" d="M3 5a1 1 0 011-1h12a1 1 0 110 2H4a1 1 0 01-1-1zM3 10a1 1 0 011-1h12a1 1 0 110 2H4a1 1 0 01-1-1zM3 15a1 1 0 011-1h12a1 1 0 110 2H4a1 1 0 01-1-1z" clipRule="evenodd" />
            </svg>
            <span className="text-xs mt-1">Genre</span>
          </button>
        </div>
      </div>

      {/* Main Content */}
      <main className="container mx-auto px-4 py-6 pb-20 md:pb-6">
        <Component {...pageProps} />
      </main>

      {/* Footer */}
      <footer className="bg-gray-800 dark:bg-gray-900 py-6 border-t border-gray-700">
        <div className="container mx-auto px-4 text-center text-gray-400">
          <p>C 2025 LNNZEPHRY</p>
        </div>
      </footer>
    </div>
  );
}

export default MyApp;

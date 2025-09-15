// pages/comic/index.js
import { useState, useEffect } from 'react';
import Head from 'next/head';
import Link from 'next/link';

export default function ComicPage() {
  const [comics, setComics] = useState([]);
  const [popularComics, setPopularComics] = useState([]);
  const [latestComics, setLatestComics] = useState([]);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState('unlimited');
  const [page, setPage] = useState(1);
  const [hasMore, setHasMore] = useState(true);
  const [searchQuery, setSearchQuery] = useState('');

  useEffect(() => {
    const fetchData = async () => {
      try {
        // Fetch unlimited comics
        const unlimitedRes = await fetch(`https://www.sankavollerei.com/comic/unlimited?page=${page}`);
        if (unlimitedRes.ok) {
          const unlimitedData = await unlimitedRes.json();
          if (page === 1) {
            setComics(unlimitedData.comics || []);
          } else {
            setComics(prev => [...prev, ...(unlimitedData.comics || [])]);
          }
          setHasMore(unlimitedData.comics && unlimitedData.comics.length > 0);
        }

        // Fetch popular comics
        const popularRes = await fetch('https://www.sankavollerei.com/comic/populer');
        if (popularRes.ok) {
          const popularData = await popularRes.json();
          setPopularComics(popularData.populer || []);
        }

        // Fetch latest comics
        const latestRes = await fetch('https://www.sankavollerei.com/comic/terbaru');
        if (latestRes.ok) {
          const latestData = await latestRes.json();
          setLatestComics(latestData.terbaru || []);
        }
      } catch (error) {
        console.error('Error fetching comic data:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, [page]);

  // Infinite scroll
  useEffect(() => {
    const handleScroll = () => {
      if (
        window.innerHeight + document.documentElement.scrollTop >= 
        document.documentElement.offsetHeight - 200 &&
        hasMore &&
        activeTab === 'unlimited'
      ) {
        setPage(prev => prev + 1);
      }
    };

    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, [hasMore, activeTab]);

  // Search comics
  useEffect(() => {
    if (!searchQuery) return;
    
    const searchComics = async () => {
      setLoading(true);
      try {
        const searchRes = await fetch(`https://www.sankavollerei.com/comic/search?q=${searchQuery}`);
        if (searchRes.ok) {
          const searchData = await searchRes.json();
          setComics(searchData.comics || []);
        }
      } catch (error) {
        console.error('Error searching comics:', error);
      } finally {
        setLoading(false);
      }
    };

    const timer = setTimeout(() => {
      searchComics();
    }, 500);

    return () => clearTimeout(timer);
  }, [searchQuery]);

  // Skeleton loader
  const SkeletonLoader = () => (
    <div className="animate-pulse">
      <div className="bg-gray-800 rounded-lg overflow-hidden">
        <div className="bg-gray-700 h-48 w-full"></div>
        <div className="p-3">
          <div className="h-4 bg-gray-700 rounded mb-2"></div>
          <div className="h-3 bg-gray-700 rounded w-3/4"></div>
        </div>
      </div>
    </div>
  );

  return (
    <div>
      <Head>
        <title>Comic - LNNZEPHRY</title>
        <meta name="description" content="Baca komik dan manga terlengkap" />
      </Head>

      <div className="space-y-6">
        {/* Header */}
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
          <h1 className="text-3xl font-bold">Comic</h1>
          
          {/* Search */}
          <div className="w-full md:w-64">
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Cari komik..."
              className="w-full px-4 py-2 bg-gray-800 text-white rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500"
            />
          </div>
        </div>

        {/* Tabs */}
        <div className="flex border-b border-gray-700">
          <button 
            onClick={() => setActiveTab('unlimited')}
            className={`px-4 py-2 font-medium ${activeTab === 'unlimited' ? 'text-indigo-400 border-b-2 border-indigo-400' : 'text-gray-400 hover:text-white'}`}
          >
            Semua Komik
          </button>
          <button 
            onClick={() => setActiveTab('popular')}
            className={`px-4 py-2 font-medium ${activeTab === 'popular' ? 'text-indigo-400 border-b-2 border-indigo-400' : 'text-gray-400 hover:text-white'}`}
          >
            Populer
          </button>
          <button 
            onClick={() => setActiveTab('latest')}
            className={`px-4 py-2 font-medium ${activeTab === 'latest' ? 'text-indigo-400 border-b-2 border-indigo-400' : 'text-gray-400 hover:text-white'}`}
          >
            Terbaru
          </button>
        </div>

        {/* Content */}
        {activeTab === 'unlimited' && (
          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6 gap-4">
            {loading ? (
              Array.from({ length: 12 }).map((_, i) => <SkeletonLoader key={i} />)
            ) : (
              comics.map(comic => (
                <Link href={`/comic/${comic.slug}`} key={comic.id}>
                  <a className="bg-gray-800 rounded-lg overflow-hidden hover:bg-gray-700 transition">
                    <div className="aspect-w-3 aspect-h-4 bg-gray-700">
                      <img 
                        src={comic.thumbnail} 
                        alt={comic.title} 
                        className="w-full h-48 object-cover"
                      />
                    </div>
                    <div className="p-3">
                      <h3 className="font-medium truncate">{comic.title}</h3>
                      <p className="text-sm text-gray-400 truncate">{comic.chapter}</p>
                    </div>
                  </a>
                </Link>
              ))
            )}
          </div>
        )}

        {activeTab === 'popular' && (
          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6 gap-4">
            {loading ? (
              Array.from({ length: 12 }).map((_, i) => <SkeletonLoader key={i} />)
            ) : (
              popularComics.map(comic => (
                <Link href={`/comic/${comic.slug}`} key={comic.id}>
                  <a className="bg-gray-800 rounded-lg overflow-hidden hover:bg-gray-700 transition">
                    <div className="aspect-w-3 aspect-h-4 bg-gray-700">
                      <img 
                        src={comic.thumbnail} 
                        alt={comic.title} 
                        className="w-full h-48 object-cover"
                      />
                    </div>
                    <div className="p-3">
                      <h3 className="font-medium truncate">{comic.title}</h3>
                      <p className="text-sm text-gray-400 truncate">{comic.chapter}</p>
                    </div>
                  </a>
                </Link>
              ))
            )}
          </div>
        )}

        {activeTab === 'latest' && (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {loading ? (
              Array.from({ length: 6 }).map((_, i) => (
                <div key={i} className="bg-gray-800 rounded-lg overflow-hidden flex">
                  <div className="w-1/3 bg-gray-700">
                    <div className="h-full w-full bg-gray-600"></div>
                  </div>
                  <div className="w-2/3 p-4">
                    <div className="h-4 bg-gray-700 rounded mb-2"></div>
                    <div className="h-3 bg-gray-700 rounded w-3/4 mb-2"></div>
                    <div className="h-3 bg-gray-700 rounded w-1/2"></div>
                  </div>
                </div>
              ))
            ) : (
              latestComics.map(comic => (
                <Link href={`/comic/${comic.slug}`} key={comic.id}>
                  <a className="bg-gray-800 rounded-lg overflow-hidden flex hover:bg-gray-700 transition">
                    <div className="w-1/3">
                      <img 
                        src={comic.thumbnail} 
                        alt={comic.title} 
                        className="h-full w-full object-cover"
                      />
                    </div>
                    <div className="w-2/3 p-4">
                      <h3 className="font-semibold truncate">{comic.title}</h3>
                      <p className="text-sm text-gray-400 mt-1">{comic.chapter}</p>
                      <p className="text-sm text-gray-400 mt-2 truncate">{comic.updated_at}</p>
                    </div>
                  </a>
                </Link>
              ))
            )}
          </div>
        )}

        {/* Load more indicator */}
        {activeTab === 'unlimited' && hasMore && (
          <div className="flex justify-center py-4">
            <div className="animate-spin rounded-full h-8 w-8 border-t-2 border-b-2 border-indigo-500"></div>
          </div>
        )}
      </div>
    </div>
  );
}

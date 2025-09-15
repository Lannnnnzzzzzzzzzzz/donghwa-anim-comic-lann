// pages/bookmarks.js
import { useState, useEffect } from 'react';
import Head from 'next/head';
import Link from 'next/link';

export default function BookmarksPage() {
  const [bookmarks, setBookmarks] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchBookmarks = () => {
      try {
        const savedBookmarks = JSON.parse(localStorage.getItem('bookmarks') || '[]');
        setBookmarks(savedBookmarks);
      } catch (error) {
        console.error('Error fetching bookmarks:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchBookmarks();
    
    // Listen for storage changes
    const handleStorageChange = () => {
      fetchBookmarks();
    };
    
    window.addEventListener('storage', handleStorageChange);
    return () => window.removeEventListener('storage', handleStorageChange);
  }, []);

  // Remove bookmark
  const removeBookmark = (id, type) => {
    const newBookmarks = bookmarks.filter(b => !(b.id === id && b.type === type));
    localStorage.setItem('bookmarks', JSON.stringify(newBookmarks));
    setBookmarks(newBookmarks);
  };

  // Group bookmarks by type
  const animeBookmarks = bookmarks.filter(b => b.type === 'anime');
  const donghuaBookmarks = bookmarks.filter(b => b.type === 'donghua');
  const comicBookmarks = bookmarks.filter(b => b.type === 'comic');

  // Skeleton loader
  const SkeletonLoader = () => (
    <div className="animate-pulse">
      <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6 gap-4">
        {Array.from({ length: 6 }).map((_, i) => (
          <div key={i} className="bg-gray-800 rounded-lg overflow-hidden">
            <div className="bg-gray-700 h-48 w-full"></div>
            <div className="p-3">
              <div className="h-4 bg-gray-700 rounded mb-2"></div>
              <div className="h-3 bg-gray-700 rounded w-3/4"></div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );

  return (
    <div>
      <Head>
        <title>Bookmark - LNNZEPHRY</title>
        <meta name="description" content="Koleksi bookmark Anda" />
      </Head>

      <div className="space-y-8">
        <h1 className="text-3xl font-bold">Bookmark</h1>

        {loading ? (
          <SkeletonLoader />
        ) : bookmarks.length === 0 ? (
          <div className="text-center py-12">
            <svg xmlns="http://www.w3.org/2000/svg" className="h-16 w-16 mx-auto text-gray-600 mb-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 5a2 2 0 012-2h10a2 2 0 012 2v16l-7-3.5L5 21V5z" />
            </svg>
            <h2 className="text-xl font-semibold mb-2">Belum ada bookmark</h2>
            <p className="text-gray-400 mb-6">Simpan anime, donghua, atau komik favorit Anda dengan mengeklik ikon bookmark</p>
            <div className="flex justify-center gap-4">
              <Link href="/anime">
                <a className="bg-indigo-600 hover:bg-indigo-700 text-white px-6 py-3 rounded-lg font-medium transition">
                  Jelajahi Anime
                </a>
              </Link>
              <Link href="/donghua">
                <a className="bg-purple-600 hover:bg-purple-700 text-white px-6 py-3 rounded-lg font-medium transition">
                  Jelajahi Donghua
                </a>
              </Link>
              <Link href="/comic">
                <a className="bg-pink-600 hover:bg-pink-700 text-white px-6 py-3 rounded-lg font-medium transition">
                  Jelajahi Comic
                </a>
              </Link>
            </div>
          </div>
        ) : (
          <>
            {/* Anime Bookmarks */}
            {animeBookmarks.length > 0 && (
              <div>
                <div className="flex justify-between items-center mb-4">
                  <h2 className="text-xl font-semibold">Anime</h2>
                  <span className="text-sm text-gray-400">{animeBookmarks.length} item</span>
                </div>
                <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6 gap-4">
                  {animeBookmarks.map(bookmark => (
                    <div key={`anime-${bookmark.id}`} className="bg-gray-800 rounded-lg overflow-hidden relative group">
                      <button 
                        onClick={() => removeBookmark(bookmark.id, bookmark.type)}
                        className="absolute top-2 right-2 p-1 bg-black bg-opacity-50 rounded-full opacity-0 group-hover:opacity-100 transition z-10"
                      >
                        <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 text-yellow-400" viewBox="0 0 20 20" fill="currentColor">
                          <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                        </svg>
                      </button>
                      <Link href={`/anime/${bookmark.id}`}>
                        <a className="block">
                          <div className="aspect-w-3 aspect-h-4 bg-gray-700">
                            <img 
                              src={bookmark.thumbnail} 
                              alt={bookmark.title} 
                              className="w-full h-48 object-cover"
                            />
                          </div>
                          <div className="p-3">
                            <h3 className="font-medium truncate">{bookmark.title}</h3>
                            <p className="text-xs text-gray-400">
                              {new Date(bookmark.timestamp).toLocaleDateString()}
                            </p>
                          </div>
                        </a>
                      </Link>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* Donghua Bookmarks */}
            {donghuaBookmarks.length > 0 && (
              <div>
                <div className="flex justify-between items-center mb-4">
                  <h2 className="text-xl font-semibold">Donghua</h2>
                  <span className="text-sm text-gray-400">{donghuaBookmarks.length} item</span>
                </div>
                <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6 gap-4">
                  {donghuaBookmarks.map(bookmark => (
                    <div key={`donghua-${bookmark.id}`} className="bg-gray-800 rounded-lg overflow-hidden relative group">
                      <button 
                        onClick={() => removeBookmark(bookmark.id, bookmark.type)}
                        className="absolute top-2 right-2 p-1 bg-black bg-opacity-50 rounded-full opacity-0 group-hover:opacity-100 transition z-10"
                      >
                        <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 text-yellow-400" viewBox="0 0 20 20" fill="currentColor">
                          <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                        </svg>
                      </button>
                      <Link href={`/donghua/${bookmark.id}`}>
                        <a className="block">
                          <div className="aspect-w-3 aspect-h-4 bg-gray-700">
                            <img 
                              src={bookmark.thumbnail} 
                              alt={bookmark.title} 
                              className="w-full h-48 object-cover"
                            />
                          </div>
                          <div className="p-3">
                            <h3 className="font-medium truncate">{bookmark.title}</h3>
                            <p className="text-xs text-gray-400">
                              {new Date(bookmark.timestamp).toLocaleDateString()}
                            </p>
                          </div>
                        </a>
                      </Link>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* Comic Bookmarks */}
            {comicBookmarks.length > 0 && (
              <div>
                <div className="flex justify-between items-center mb-4">
                  <h2 className="text-xl font-semibold">Comic</h2>
                  <span className="text-sm text-gray-400">{comicBookmarks.length} item</span>
                </div>
                <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6 gap-4">
                  {comicBookmarks.map(bookmark => (
                    <div key={`comic-${bookmark.id}`} className="bg-gray-800 rounded-lg overflow-hidden relative group">
                      <button 
                        onClick={() => removeBookmark(bookmark.id, bookmark.type)}
                        className="absolute top-2 right-2 p-1 bg-black bg-opacity-50 rounded-full opacity-0 group-hover:opacity-100 transition z-10"
                      >
                        <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 text-yellow-400" viewBox="0 0 20 20" fill="currentColor">
                          <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                        </svg>
                      </button>
                      <Link href={`/comic/${bookmark.id}`}>
                        <a className="block">
                          <div className="aspect-w-3 aspect-h-4 bg-gray-700">
                            <img 
                              src={bookmark.thumbnail} 
                              alt={bookmark.title} 
                              className="w-full h-48 object-cover"
                            />
                          </div>
                          <div className="p-3">
                            <h3 className="font-medium truncate">{bookmark.title}</h3>
                            <p className="text-xs text-gray-400">
                              {new Date(bookmark.timestamp).toLocaleDateString()}
                            </p>
                          </div>
                        </a>
                      </Link>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </>
        )}
      </div>
    </div>
  );
}

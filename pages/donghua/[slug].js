// pages/donghua/[slug].js
import { useState, useEffect } from 'react';
import { useRouter } from 'next/router';
import Head from 'next/head';
import Link from 'next/link';

export default function DonghuaDetail() {
  const router = useRouter();
  const { slug } = router.query;
  const [donghua, setDonghua] = useState(null);
  const [episodes, setEpisodes] = useState([]);
  const [loading, setLoading] = useState(true);
  const [currentEpisode, setCurrentEpisode] = useState(null);
  const [playerOpen, setPlayerOpen] = useState(false);
  const [bookmark, setBookmark] = useState(false);

  useEffect(() => {
    if (!slug) return;

    const fetchData = async () => {
      try {
        // Fetch donghua detail
        const detailRes = await fetch(`https://www.sankavollerei.com/anime/donghua/detail/${slug}`);
        if (detailRes.ok) {
          const detailData = await detailRes.json();
          setDonghua(detailData);
        }

        // Fetch episodes
        const episodeRes = await fetch(`https://www.sankavollerei.com/anime/donghua/episode/${slug}`);
        if (episodeRes.ok) {
          const episodeData = await episodeRes.json();
          setEpisodes(episodeData.episodes || []);
        }

        // Check bookmark
        const bookmarks = JSON.parse(localStorage.getItem('bookmarks') || '[]');
        setBookmark(bookmarks.some(b => b.id === slug && b.type === 'donghua'));
      } catch (error) {
        console.error('Error fetching donghua detail:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, [slug]);

  // Toggle bookmark
  const toggleBookmark = () => {
    const bookmarks = JSON.parse(localStorage.getItem('bookmarks') || '[]');
    
    if (bookmark) {
      // Remove bookmark
      const newBookmarks = bookmarks.filter(b => !(b.id === slug && b.type === 'donghua'));
      localStorage.setItem('bookmarks', JSON.stringify(newBookmarks));
      setBookmark(false);
    } else {
      // Add bookmark
      const newBookmark = {
        id: slug,
        type: 'donghua',
        title: donghua?.title,
        thumbnail: donghua?.thumbnail,
        timestamp: new Date().toISOString()
      };
      localStorage.setItem('bookmarks', JSON.stringify([...bookmarks, newBookmark]));
      setBookmark(true);
    }
  };

  // Watch episode
  const watchEpisode = (episode) => {
    setCurrentEpisode(episode);
    setPlayerOpen(true);
    
    // Add to history
    const history = JSON.parse(localStorage.getItem('history') || '[]');
    const newHistory = {
      id: slug,
      type: 'donghua',
      title: donghua?.title,
      thumbnail: donghua?.thumbnail,
      episode: episode.title,
      timestamp: new Date().toISOString()
    };
    
    // Remove if already exists
    const filteredHistory = history.filter(h => !(h.id === slug && h.type === 'donghua' && h.episode === episode.title));
    localStorage.setItem('history', JSON.stringify([newHistory, ...filteredHistory].slice(0, 50)));
  };

  // Skeleton loader
  const SkeletonLoader = () => (
    <div className="animate-pulse">
      <div className="flex flex-col md:flex-row gap-6 mb-8">
        <div className="w-full md:w-1/3">
          <div className="bg-gray-700 rounded-lg w-full h-96"></div>
        </div>
        <div className="w-full md:w-2/3">
          <div className="h-8 bg-gray-700 rounded w-3/4 mb-4"></div>
          <div className="h-4 bg-gray-700 rounded w-1/2 mb-6"></div>
          
          <div className="space-y-3">
            <div className="h-4 bg-gray-700 rounded"></div>
            <div className="h-4 bg-gray-700 rounded"></div>
            <div className="h-4 bg-gray-700 rounded w-5/6"></div>
          </div>
          
          <div className="flex gap-3 mt-6">
            <div className="h-10 bg-gray-700 rounded w-32"></div>
            <div className="h-10 bg-gray-700 rounded w-32"></div>
          </div>
        </div>
      </div>
      
      <div className="mb-6">
        <div className="h-6 bg-gray-700 rounded w-48 mb-4"></div>
        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6 gap-4">
          {Array.from({ length: 12 }).map((_, i) => (
            <div key={i} className="bg-gray-700 rounded-lg h-16"></div>
          ))}
        </div>
      </div>
    </div>
  );

  if (loading) {
    return (
      <div className="container mx-auto px-4 py-6">
        <SkeletonLoader />
      </div>
    );
  }

  if (!donghua) {
    return (
      <div className="container mx-auto px-4 py-6 text-center">
        <h1 className="text-2xl font-bold mb-4">Donghua tidak ditemukan</h1>
        <Link href="/donghua">
          <a className="text-indigo-400 hover:text-indigo-300">Kembali ke daftar donghua</a>
        </Link>
      </div>
    );
  }

  return (
    <div>
      <Head>
        <title>{donghua.title} - Donghua - LNNZEPHRY</title>
        <meta name="description" content={`Nonton ${donghua.title} subtitle Indonesia`} />
      </Head>

      {/* Video Player Modal */}
      {playerOpen && currentEpisode && (
        <div className="fixed inset-0 bg-black bg-opacity-90 z-50 flex items-center justify-center p-4">
          <div className="w-full max-w-4xl">
            <div className="flex justify-between items-center mb-4">
              <h2 className="text-xl font-bold">{donghua.title} - {currentEpisode.title}</h2>
              <button 
                onClick={() => setPlayerOpen(false)}
                className="p-2 rounded-full hover:bg-gray-800 transition"
              >
                <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                </svg>
              </button>
            </div>
            
            <div className="aspect-w-16 aspect-h-9 bg-black rounded-lg overflow-hidden">
              <iframe 
                src={currentEpisode.url} 
                className="w-full h-full"
                frameBorder="0"
                allowFullScreen
              ></iframe>
            </div>
            
            <div className="mt-4 flex justify-between">
              <div>
                {episodes.findIndex(ep => ep.id === currentEpisode.id) > 0 && (
                  <button 
                    onClick={() => {
                      const prevIndex = episodes.findIndex(ep => ep.id === currentEpisode.id) - 1;
                      watchEpisode(episodes[prevIndex]);
                    }}
                    className="bg-gray-800 hover:bg-gray-700 px-4 py-2 rounded-lg transition mr-2"
                  >
                    Episode Sebelumnya
                  </button>
                )}
              </div>
              
              <div>
                {episodes.findIndex(ep => ep.id === currentEpisode.id) < episodes.length - 1 && (
                  <button 
                    onClick={() => {
                      const nextIndex = episodes.findIndex(ep => ep.id === currentEpisode.id) + 1;
                      watchEpisode(episodes[nextIndex]);
                    }}
                    className="bg-gray-800 hover:bg-gray-700 px-4 py-2 rounded-lg transition"
                  >
                    Episode Selanjutnya
                  </button>
                )}
              </div>
            </div>
          </div>
        </div>
      )}

      <div className="container mx-auto px-4 py-6">
        <div className="flex flex-col md:flex-row gap-6 mb-8">
          <div className="w-full md:w-1/3">
            <div className="bg-gray-800 rounded-lg overflow-hidden sticky top-24">
              <img 
                src={donghua.thumbnail} 
                alt={donghua.title} 
                className="w-full h-auto"
              />
              <div className="p-4">
                <div className="flex justify-between items-center mb-4">
                  <span className={`px-3 py-1 rounded-full text-sm font-medium ${
                    donghua.status === 'Ongoing' ? 'bg-green-900 text-green-300' : 'bg-blue-900 text-blue-300'
                  }`}>
                    {donghua.status}
                  </span>
                  <button 
                    onClick={toggleBookmark}
                    className="p-2 rounded-full hover:bg-gray-700 transition"
                  >
                    {bookmark ? (
                      <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 text-yellow-400" viewBox="0 0 20 20" fill="currentColor">
                        <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                      </svg>
                    ) : (
                      <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11.049 2.927c.3-.921 1.603-.921 1.902 0l1.519 4.674a1 1 0 00.95.69h4.915c.969 0 1.371 1.24.588 1.81l-3.976 2.888a1 1 0 00-.363 1.118l1.518 4.674c.3.922-.755 1.688-1.538 1.118l-3.976-2.888a1 1 0 00-1.176 0l-3.976 2.888c-.783.57-1.838-.197-1.538-1.118l1.518-4.674a1 1 0 00-.363-1.118l-3.976-2.888c-.784-.57-.38-1.81.588-1.81h4.914a1 1 0 00.951-.69l1.519-4.674z" />
                      </svg>
                    )}
                  </button>
                </div>
                
                <div className="space-y-3">
                  <div>
                    <h3 className="text-sm text-gray-400">Rating</h3>
                    <div className="flex items-center">
                      <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 text-yellow-400" viewBox="0 0 20 20" fill="currentColor">
                        <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                      </svg>
                      <span className="ml-1">{donghua.rating || 'N/A'}</span>
                    </div>
                  </div>
                  
                  <div>
                    <h3 className="text-sm text-gray-400">Tahun Rilis</h3>
                    <p>{donghua.year || 'N/A'}</p>
                  </div>
                  
                  <div>
                    <h3 className="text-sm text-gray-400">Studio</h3>
                    <p>{donghua.studio || 'N/A'}</p>
                  </div>
                  
                  <div>
                    <h3 className="text-sm text-gray-400">Genre</h3>
                    <div className="flex flex-wrap gap-2 mt-1">
                      {donghua.genres?.map(genre => (
                        <span key={genre} className="px-2 py-1 bg-gray-700 text-xs rounded">
                          {genre}
                        </span>
                      ))}
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
          
          <div className="w-full md:w-2/3">
            <h1 className="text-3xl font-bold mb-2">{donghua.title}</h1>
            <p className="text-gray-400 mb-6">{donghua.chinese_title}</p>
            
            <div className="mb-6">
              <h2 className="text-xl font-semibold mb-3">Sinopsis</h2>
              <p className="text-gray-300 leading-relaxed">{donghua.synopsis}</p>
            </div>
            
            <div className="mb-6">
              <div className="flex justify-between items-center mb-4">
                <h2 className="text-xl font-semibold">Episode List</h2>
                <span className="text-sm text-gray-400">{episodes.length} Episode</span>
              </div>
              
              <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-3">
                {episodes.map(episode => (
                  <button
                    key={episode.id}
                    onClick={() => watchEpisode(episode)}
                    className="bg-gray-800 hover:bg-indigo-900 text-indigo-300 py-3 rounded-lg transition text-center"
                  >
                    {episode.title}
                  </button>
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

import { useState, useEffect } from 'react';
import Head from 'next/head';
import Link from 'next/link';

export default function GenresPage() {
  const [animeGenres, setAnimeGenres] = useState([]);
  const [donghuaGenres, setDonghuaGenres] = useState([]);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState('anime');

  useEffect(() => {
    const fetchGenres = async () => {
      try {
        // Fetch anime genres
        const animeRes = await fetch('https://www.sankavollerei.com/anime/genre');
        if (animeRes.ok) {
          const animeData = await animeRes.json();
          setAnimeGenres(animeData.genre || []);
        }

        // Fetch donghua genres
        const donghuaRes = await fetch('https://www.sankavollerei.com/anime/donghua/genres');
        if (donghuaRes.ok) {
          const donghuaData = await donghuaRes.json();
          setDonghuaGenres(donghuaData.genres || []);
        }
      } catch (error) {
        console.error('Error fetching genres:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchGenres();
  }, []);

  // Skeleton loader
  const SkeletonLoader = () => (
    <div className="animate-pulse">
      <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6 gap-4">
        {Array.from({ length: 12 }).map((_, i) => (
          <div key={i} className="bg-gray-800 rounded-lg h-24"></div>
        ))}
      </div>
    </div>
  );

  return (
    <div>
      <Head>
        <title>Genre - LNNZEPHRY</title>
        <meta name="description" content="Jelajahi anime dan donghua berdasarkan genre" />
      </Head>

      <div className="space-y-6">
        <h1 className="text-3xl font-bold">Genre</h1>

        {/* Tabs */}
        <div className="flex border-b border-gray-700">
          <button 
            onClick={() => setActiveTab('anime')}
            className={`px-4 py-2 font-medium ${activeTab === 'anime' ? 'text-indigo-400 border-b-2 border-indigo-400' : 'text-gray-400 hover:text-white'}`}
          >
            Anime
          </button>
          <button 
            onClick={() => setActiveTab('donghua')}
            className={`px-4 py-2 font-medium ${activeTab === 'donghua' ? 'text-indigo-400 border-b-2 border-indigo-400' : 'text-gray-400 hover:text-white'}`}
          >
            Donghua
          </button>
        </div>

        {/* Content */}
        {loading ? (
          <SkeletonLoader />
        ) : (
          <>
            {activeTab === 'anime' && (
              <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6 gap-4">
                {animeGenres.map(genre => (
                  <Link href={`/anime/genre/${genre.slug}`} key={genre.id}>
                    <a className="bg-gray-800 hover:bg-indigo-900 text-indigo-300 rounded-lg p-4 text-center transition">
                      <h3 className="font-medium">{genre.name}</h3>
                    </a>
                  </Link>
                ))}
              </div>
            )}

            {activeTab === 'donghua' && (
              <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6 gap-4">
                {donghuaGenres.map(genre => (
                  <Link href={`/donghua/genre/${genre.slug}`} key={genre.id}>
                    <a className="bg-gray-800 hover:bg-indigo-900 text-indigo-300 rounded-lg p-4 text-center transition">
                      <h3 className="font-medium">{genre.name}</h3>
                    </a>
                  </Link>
                ))}
              </div>
            )}
          </>
        )}
      </div>
    </div>
  );
}

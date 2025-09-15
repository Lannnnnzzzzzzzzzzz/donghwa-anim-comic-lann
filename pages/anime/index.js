import { useState, useEffect } from 'react';
import Head from 'next/head';
import Link from 'next/link';
import { useRouter } from 'next/router';

export default function AnimePage() {
  const router = useRouter();
  const [animeList, setAnimeList] = useState([]);
  const [ongoingAnime, setOngoingAnime] = useState([]);
  const [completedAnime, setCompletedAnime] = useState([]);
  const [genres, setGenres] = useState([]);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState('all');
  const [page, setPage] = useState(1);
  const [hasMore, setHasMore] = useState(true);
  const [selectedGenre, setSelectedGenre] = useState('');
  const [selectedYear, setSelectedYear] = useState('');

  useEffect(() => {
    const fetchData = async () => {
      try {
        // Fetch all anime
        const allRes = await fetch(`https://www.sankavollerei.com/anime/unlimited?page=${page}`);
        if (allRes.ok) {
          const allData = await allRes.json();
          if (page === 1) {
            setAnimeList(allData.anime || []);
          } else {
            setAnimeList(prev => [...prev, ...(allData.anime || [])]);
          }
          setHasMore(allData.anime && allData.anime.length > 0);
        }

        // Fetch ongoing anime
        const ongoingRes = await fetch(`https://www.sankavollerei.com/anime/ongoing-anime?page=1`);
        if (ongoingRes.ok) {
          const ongoingData = await ongoingRes.json();
          setOngoingAnime(ongoingData.ongoing || []);
        }

        // Fetch completed anime
        const completedRes = await fetch(`https://www.sankavollerei.com/anime/complete-anime/1`);
        if (completedRes.ok) {
          const completedData = await completedRes.json();
          setCompletedAnime(completedData.complete || []);
        }

        // Fetch genres
        const genresRes = await fetch('https://www.sankavollerei.com/anime/genre');
        if (genresRes.ok) {
          const genresData = await genresRes.json();
          setGenres(genresData.genre || []);
        }
      } catch (error) {
        console.error('Error fetching anime data:', error);
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
        activeTab === 'all'
      ) {
        setPage(prev => prev + 1);
      }
    };

    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, [hasMore, activeTab]);

  // Filter by genre
  useEffect(() => {
    const fetchByGenre = async () => {
      if (!selectedGenre) return;
      
      setLoading(true);
      try {
        const res = await fetch(`https://www.sankavollerei.com/anime/genre/${selectedGenre}?page=1`);
        if (res.ok) {
          const data = await res.json();
          setAnimeList(data.anime || []);
        }
      } catch (error) {
        console.error('Error fetching anime by genre:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchByGenre();
  }, [selectedGenre]);

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
        <title>Anime - LNNZEPHRY</title>
        <meta name="description" content="Nonton anime subtitle Indonesia terlengkap" />
      </Head>

      <div className="space-y-6">
        {/* Header */}
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
          <h1 className="text-3xl font-bold">Anime</h1>
          
          {/* Filters */}
          <div className="flex flex-wrap gap-3">
            <select 
              value={selectedGenre} 
              onChange={(e) => setSelectedGenre(e.target.value)}
              className="bg-gray-800 text-white px-3 py-2 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500"
            >
              <option value="">Semua Genre</option>
              {genres.map(genre => (
                <option key={genre.id} value={genre.slug}>{genre.name}</option>
              ))}
            </select>
            
            <select 
              value={selectedYear} 
              onChange={(e) => setSelectedYear(e.target.value)}
              className="bg-gray-800 text-white px-3 py-2 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500"
            >
              <option value="">Semua Tahun</option>
              {Array.from({ length: 10 }, (_, i) => new Date().getFullYear() - i).map(year => (
                <option key={year} value={year}>{year}</option>
              ))}
            </select>
          </div>
        </div>

        {/* Tabs */}
        <div className="flex border-b border-gray-700">
          <button 
            onClick={() => setActiveTab('all')}
            className={`px-4 py-2 font-medium ${activeTab === 'all' ? 'text-indigo-400 border-b-2 border-indigo-400' : 'text-gray-400 hover:text-white'}`}
          >
            Semua Anime
          </button>
          <button 
            onClick={() => setActiveTab('ongoing')}
            className={`px-4 py-2 font-medium ${activeTab === 'ongoing' ? 'text-indigo-400 border-b-2 border-indigo-400' : 'text-gray-400 hover:text-white'}`}
          >
            Sedang Tayang
          </button>
          <button 
            onClick={() => setActiveTab('completed')}
            className={`px-4 py-2 font-medium ${activeTab === 'completed' ? 'text-indigo-400 border-b-2 border-indigo-400' : 'text-gray-400 hover:text-white'}`}
          >
            Tamat
          </button>
        </div>

        {/* Content */}
        {activeTab === 'all' && (
          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6 gap-4">
            {loading ? (
              Array.from({ length: 12 }).map((_, i) => <SkeletonLoader key={i} />)
            ) : (
              animeList.map(anime => (
                <Link href={`/anime/${anime.slug}`} key={anime.id}>
                  <a className="bg-gray-800 rounded-lg overflow-hidden hover:bg-gray-700 transition">
                    <div className="aspect-w-3 aspect-h-4 bg-gray-700">
                      <img 
                        src={anime.thumbnail} 
                        alt={anime.title} 
                        className="w-full h-48 object-cover"
                      />
                    </div>
                    <div className="p-3">
                      <h3 className="font-medium truncate">{anime.title}</h3>
                      <p className="text-sm text-gray-400 truncate">{anime.episode}</p>
                    </div>
                  </a>
                </Link>
              ))
            )}
          </div>
        )}

        {activeTab === 'ongoing' && (
          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6 gap-4">
            {loading ? (
              Array.from({ length: 12 }).map((_, i) => <SkeletonLoader key={i} />)
            ) : (
              ongoingAnime.map(anime => (
                <Link href={`/anime/${anime.slug}`} key={anime.id}>
                  <a className="bg-gray-800 rounded-lg overflow-hidden hover:bg-gray-700 transition">
                    <div className="aspect-w-3 aspect-h-4 bg-gray-700">
                      <img 
                        src={anime.thumbnail} 
                        alt={anime.title} 
                        className="w-full h-48 object-cover"
                      />
                    </div>
                    <div className="p-3">
                      <h3 className="font-medium truncate">{anime.title}</h3>
                      <p className="text-sm text-gray-400 truncate">{anime.episode}</p>
                    </div>
                  </a>
                </Link>
              ))
            )}
          </div>
        )}

        {activeTab === 'completed' && (
          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6 gap-4">
            {loading ? (
              Array.from({ length: 12 }).map((_, i) => <SkeletonLoader key={i} />)
            ) : (
              completedAnime.map(anime => (
                <Link href={`/anime/${anime.slug}`} key={anime.id}>
                  <a className="bg-gray-800 rounded-lg overflow-hidden hover:bg-gray-700 transition">
                    <div className="aspect-w-3 aspect-h-4 bg-gray-700">
                      <img 
                        src={anime.thumbnail} 
                        alt={anime.title} 
                        className="w-full h-48 object-cover"
                      />
                    </div>
                    <div className="p-3">
                      <h3 className="font-medium truncate">{anime.title}</h3>
                      <p className="text-sm text-gray-400 truncate">{anime.episode}</p>
                    </div>
                  </a>
                </Link>
              ))
            )}
          </div>
        )}

        {/* Load more indicator */}
        {activeTab === 'all' && hasMore && (
          <div className="flex justify-center py-4">
            <div className="animate-spin rounded-full h-8 w-8 border-t-2 border-b-2 border-indigo-500"></div>
          </div>
        )}
      </div>
    </div>
  );
}

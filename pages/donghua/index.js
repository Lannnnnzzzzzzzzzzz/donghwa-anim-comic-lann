import { useState, useEffect } from 'react';
import Head from 'next/head';
import Link from 'next/link';

export default function DonghuaPage() {
  const [donghuaList, setDonghuaList] = useState([]);
  const [ongoingDonghua, setOngoingDonghua] = useState([]);
  const [completedDonghua, setCompletedDonghua] = useState([]);
  const [genres, setGenres] = useState([]);
  const [years, setYears] = useState([]);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState('home');
  const [page, setPage] = useState(1);
  const [hasMore, setHasMore] = useState(true);
  const [selectedGenre, setSelectedGenre] = useState('');
  const [selectedYear, setSelectedYear] = useState('');

  useEffect(() => {
    const fetchData = async () => {
      try {
        // Fetch home donghua
        const homeRes = await fetch(`https://www.sankavollerei.com/anime/donghua/home/${page}`);
        if (homeRes.ok) {
          const homeData = await homeRes.json();
          if (page === 1) {
            setDonghuaList(homeData.donghua || []);
          } else {
            setDonghuaList(prev => [...prev, ...(homeData.donghua || [])]);
          }
          setHasMore(homeData.donghua && homeData.donghua.length > 0);
        }

        // Fetch ongoing donghua
        const ongoingRes = await fetch(`https://www.sankavollerei.com/anime/donghua/ongoing/1`);
        if (ongoingRes.ok) {
          const ongoingData = await ongoingRes.json();
          setOngoingDonghua(ongoingData.donghua || []);
        }

        // Fetch completed donghua
        const completedRes = await fetch(`https://www.sankavollerei.com/anime/donghua/completed/1`);
        if (completedRes.ok) {
          const completedData = await completedRes.json();
          setCompletedDonghua(completedData.donghua || []);
        }

        // Fetch genres
        const genresRes = await fetch('https://www.sankavollerei.com/anime/donghua/genres');
        if (genresRes.ok) {
          const genresData = await genresRes.json();
          setGenres(genresData.genres || []);
        }
      } catch (error) {
        console.error('Error fetching donghua data:', error);
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
        activeTab === 'home'
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
        const res = await fetch(`https://www.sankavollerei.com/anime/donghua/genres/${selectedGenre}/1`);
        if (res.ok) {
          const data = await res.json();
          setDonghuaList(data.donghua || []);
        }
      } catch (error) {
        console.error('Error fetching donghua by genre:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchByGenre();
  }, [selectedGenre]);

  // Filter by year
  useEffect(() => {
    const fetchByYear = async () => {
      if (!selectedYear) return;
      
      setLoading(true);
      try {
        const res = await fetch(`https://www.sankavollerei.com/anime/donghua/seasons/${selectedYear}`);
        if (res.ok) {
          const data = await res.json();
          setDonghuaList(data.donghua || []);
        }
      } catch (error) {
        console.error('Error fetching donghua by year:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchByYear();
  }, [selectedYear]);

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
        <title>Donghua - LNNZEPHRY</title>
        <meta name="description" content="Nonton donghua subtitle Indonesia terlengkap" />
      </Head>

      <div className="space-y-6">
        {/* Header */}
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
          <h1 className="text-3xl font-bold">Donghua</h1>
          
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
            onClick={() => setActiveTab('home')}
            className={`px-4 py-2 font-medium ${activeTab === 'home' ? 'text-indigo-400 border-b-2 border-indigo-400' : 'text-gray-400 hover:text-white'}`}
          >
            Semua Donghua
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
        {activeTab === 'home' && (
          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6 gap-4">
            {loading ? (
              Array.from({ length: 12 }).map((_, i) => <SkeletonLoader key={i} />)
            ) : (
              donghuaList.map(donghua => (
                <Link href={`/donghua/${donghua.slug}`} key={donghua.id}>
                  <a className="bg-gray-800 rounded-lg overflow-hidden hover:bg-gray-700 transition">
                    <div className="aspect-w-3 aspect-h-4 bg-gray-700">
                      <img 
                        src={donghua.thumbnail} 
                        alt={donghua.title} 
                        className="w-full h-48 object-cover"
                      />
                    </div>
                    <div className="p-3">
                      <h3 className="font-medium truncate">{donghua.title}</h3>
                      <p className="text-sm text-gray-400 truncate">{donghua.status}</p>
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
              ongoingDonghua.map(donghua => (
                <Link href={`/donghua/${donghua.slug}`} key={donghua.id}>
                  <a className="bg-gray-800 rounded-lg overflow-hidden hover:bg-gray-700 transition">
                    <div className="aspect-w-3 aspect-h-4 bg-gray-700">
                      <img 
                        src={donghua.thumbnail} 
                        alt={donghua.title} 
                        className="w-full h-48 object-cover"
                      />
                    </div>
                    <div className="p-3">
                      <h3 className="font-medium truncate">{donghua.title}</h3>
                      <p className="text-sm text-gray-400 truncate">{donghua.status}</p>
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
              completedDonghua.map(donghua => (
                <Link href={`/donghua/${donghua.slug}`} key={donghua.id}>
                  <a className="bg-gray-800 rounded-lg overflow-hidden hover:bg-gray-700 transition">
                    <div className="aspect-w-3 aspect-h-4 bg-gray-700">
                      <img 
                        src={donghua.thumbnail} 
                        alt={donghua.title} 
                        className="w-full h-48 object-cover"
                      />
                    </div>
                    <div className="p-3">
                      <h3 className="font-medium truncate">{donghua.title}</h3>
                      <p className="text-sm text-gray-400 truncate">{donghua.status}</p>
                    </div>
                  </a>
                </Link>
              ))
            )}
          </div>
        )}

        {/* Load more indicator */}
        {activeTab === 'home' && hasMore && (
          <div className="flex justify-center py-4">
            <div className="animate-spin rounded-full h-8 w-8 border-t-2 border-b-2 border-indigo-500"></div>
          </div>
        )}
      </div>
    </div>
  );
}

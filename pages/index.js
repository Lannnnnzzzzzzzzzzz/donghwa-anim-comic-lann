import { useState, useEffect } from 'react';
import Head from 'next/head';
import Link from 'next/link';

export default function Home() {
  const [popularAnime, setPopularAnime] = useState([]);
  const [popularDonghua, setPopularDonghua] = useState([]);
  const [popularComics, setPopularComics] = useState([]);
  const [latestAnime, setLatestAnime] = useState([]);
  const [latestDonghua, setLatestDonghua] = useState([]);
  const [latestComics, setLatestComics] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchData = async () => {
      try {
        // Fetch popular anime
        const animeRes = await fetch('https://www.sankavollerei.com/anime/home');
        if (animeRes.ok) {
          const animeData = await animeRes.json();
          setPopularAnime(animeData.popular || []);
          setLatestAnime(animeData.latest || []);
        }

        // Fetch popular donghua
        const donghuaRes = await fetch('https://www.sankavollerei.com/anime/donghua/home/1');
        if (donghuaRes.ok) {
          const donghuaData = await donghuaRes.json();
          setPopularDonghua(donghuaData.popular || []);
          setLatestDonghua(donghuaData.latest || []);
        }

        // Fetch popular comics
        const comicsRes = await fetch('https://www.sankavollerei.com/comic/populer');
        if (comicsRes.ok) {
          const comicsData = await comicsRes.json();
          setPopularComics(comicsData.popular || []);
        }

        // Fetch latest comics
        const latestComicsRes = await fetch('https://www.sankavollerei.com/comic/terbaru');
        if (latestComicsRes.ok) {
          const latestComicsData = await latestComicsRes.json();
          setLatestComics(latestComicsData.terbaru || []);
        }
      } catch (error) {
        console.error('Error fetching data:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, []);

  // Skeleton loader
  const SkeletonLoader = () => (
    <div className="animate-pulse">
      <div className="bg-gray-700 rounded-lg overflow-hidden">
        <div className="bg-gray-600 h-48 w-full"></div>
        <div className="p-3">
          <div className="h-4 bg-gray-600 rounded mb-2"></div>
          <div className="h-3 bg-gray-600 rounded w-3/4"></div>
        </div>
      </div>
    </div>
  );

  return (
    <div>
      <Head>
        <title>LNNZEPHRY - Streaming All-in-One</title>
        <meta name="description" content="Streaming platform for Anime, Donghua, and Comic" />
      </Head>

      <div className="space-y-10">
        {/* Hero Section */}
        <section className="relative rounded-xl overflow-hidden">
          <div className="bg-gradient-to-r from-indigo-900 to-purple-900 p-8 md:p-12">
            <h1 className="text-3xl md:text-4xl font-bold mb-4">Streaming All-in-One untuk Anime, Donghua, dan Comic</h1>
            <p className="text-lg text-gray-200 mb-6 max-w-2xl">
              Nikmati koleksi terlengkap anime Jepang, donghua Tiongkok, dan komik favorit Anda dalam satu platform.
            </p>
            <div className="flex flex-wrap gap-4">
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
        </section>

        {/* Popular Anime Section */}
        <section>
          <div className="flex justify-between items-center mb-4">
            <h2 className="text-2xl font-bold">Anime Populer</h2>
            <Link href="/anime">
              <a className="text-indigo-400 hover:text-indigo-300 transition">Lihat Semua</a>
            </Link>
          </div>
          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6 gap-4">
            {loading ? (
              Array.from({ length: 6 }).map((_, i) => <SkeletonLoader key={i} />)
            ) : (
              popularAnime.map((anime) => (
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
        </section>

        {/* Popular Donghua Section */}
        <section>
          <div className="flex justify-between items-center mb-4">
            <h2 className="text-2xl font-bold">Donghua Populer</h2>
            <Link href="/donghua">
              <a className="text-indigo-400 hover:text-indigo-300 transition">Lihat Semua</a>
            </Link>
          </div>
          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6 gap-4">
            {loading ? (
              Array.from({ length: 6 }).map((_, i) => <SkeletonLoader key={i} />)
            ) : (
              popularDonghua.map((donghua) => (
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
        </section>

        {/* Popular Comics Section */}
        <section>
          <div className="flex justify-between items-center mb-4">
            <h2 className="text-2xl font-bold">Comic Populer</h2>
            <Link href="/comic">
              <a className="text-indigo-400 hover:text-indigo-300 transition">Lihat Semua</a>
            </Link>
          </div>
          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6 gap-4">
            {loading ? (
              Array.from({ length: 6 }).map((_, i) => <SkeletonLoader key={i} />)
            ) : (
              popularComics.map((comic) => (
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
        </section>

        {/* Latest Releases Section */}
        <section>
          <h2 className="text-2xl font-bold mb-4">Terbaru dari Semua Kategori</h2>
          
          {/* Tabs */}
          <div className="flex border-b border-gray-700 mb-6">
            <button className="px-4 py-2 font-medium text-indigo-400 border-b-2 border-indigo-400">
              Semua
            </button>
            <button className="px-4 py-2 font-medium text-gray-400 hover:text-white">
              Anime
            </button>
            <button className="px-4 py-2 font-medium text-gray-400 hover:text-white">
              Donghua
            </button>
            <button className="px-4 py-2 font-medium text-gray-400 hover:text-white">
              Comic
            </button>
          </div>
          
          {/* Content */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {loading ? (
              Array.from({ length: 6 }).map((_, i) => (
                <div key={i} className="bg-gray-800 rounded-lg overflow-hidden flex">
                  <div className="w-1/3 bg-gray-700">
                    <div className="h-full w-full bg-gray-600"></div>
                  </div>
                  <div className="w-2/3 p-4">
                    <div className="h-4 bg-gray-600 rounded mb-2"></div>
                    <div className="h-3 bg-gray-600 rounded w-3/4 mb-2"></div>
                    <div className="h-3 bg-gray-600 rounded w-1/2"></div>
                  </div>
                </div>
              ))
            ) : (
              <>
                {/* Mix of latest content */}
                {latestAnime.slice(0, 2).map((anime) => (
                  <Link href={`/anime/${anime.slug}`} key={`anime-${anime.id}`}>
                    <a className="bg-gray-800 rounded-lg overflow-hidden flex hover:bg-gray-700 transition">
                      <div className="w-1/3">
                        <img 
                          src={anime.thumbnail} 
                          alt={anime.title} 
                          className="h-full w-full object-cover"
                        />
                      </div>
                      <div className="w-2/3 p-4">
                        <span className="text-xs font-semibold px-2 py-1 bg-indigo-900 text-indigo-300 rounded">Anime</span>
                        <h3 className="font-semibold mt-2 truncate">{anime.title}</h3>
                        <p className="text-sm text-gray-400 mt-1">{anime.episode}</p>
                      </div>
                    </a>
                  </Link>
                ))}
                
                {latestDonghua.slice(0, 2).map((donghua) => (
                  <Link href={`/donghua/${donghua.slug}`} key={`donghua-${donghua.id}`}>
                    <a className="bg-gray-800 rounded-lg overflow-hidden flex hover:bg-gray-700 transition">
                      <div className="w-1/3">
                        <img 
                          src={donghua.thumbnail} 
                          alt={donghua.title} 
                          className="h-full w-full object-cover"
                        />
                      </div>
                      <div className="w-2/3 p-4">
                        <span className="text-xs font-semibold px-2 py-1 bg-purple-900 text-purple-300 rounded">Donghua</span>
                        <h3 className="font-semibold mt-2 truncate">{donghua.title}</h3>
                        <p className="text-sm text-gray-400 mt-1">{donghua.status}</p>
                      </div>
                    </a>
                  </Link>
                ))}
                
                {latestComics.slice(0, 2).map((comic) => (
                  <Link href={`/comic/${comic.slug}`} key={`comic-${comic.id}`}>
                    <a className="bg-gray-800 rounded-lg overflow-hidden flex hover:bg-gray-700 transition">
                      <div className="w-1/3">
                        <img 
                          src={comic.thumbnail} 
                          alt={comic.title} 
                          className="h-full w-full object-cover"
                        />
                      </div>
                      <div className="w-2/3 p-4">
                        <span className="text-xs font-semibold px-2 py-1 bg-pink-900 text-pink-300 rounded">Comic</span>
                        <h3 className="font-semibold mt-2 truncate">{comic.title}</h3>
                        <p className="text-sm text-gray-400 mt-1">{comic.chapter}</p>
                      </div>
                    </a>
                  </Link>
                ))}
              </>
            )}
          </div>
        </section>
      </div>
    </div>
  );
}

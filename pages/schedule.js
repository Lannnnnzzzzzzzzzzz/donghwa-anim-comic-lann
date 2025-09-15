import { useState, useEffect } from 'react';
import Head from 'next/head';

export default function SchedulePage() {
  const [schedule, setSchedule] = useState({});
  const [loading, setLoading] = useState(true);
  const [activeDay, setActiveDay] = useState('');

  useEffect(() => {
    const fetchSchedule = async () => {
      try {
        const res = await fetch('https://www.sankavollerei.com/anime/schedule');
        if (res.ok) {
          const data = await res.json();
          setSchedule(data.schedule || {});
          
          // Set active day to today
          const days = ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'];
          const today = days[new Date().getDay()];
          setActiveDay(today);
        }
      } catch (error) {
        console.error('Error fetching schedule:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchSchedule();
  }, []);

  // Skeleton loader
  const SkeletonLoader = () => (
    <div className="animate-pulse">
      <div className="bg-gray-800 rounded-lg overflow-hidden mb-4">
        <div className="h-6 bg-gray-700 rounded w-32 mb-4"></div>
        <div className="space-y-4">
          {Array.from({ length: 5 }).map((_, i) => (
            <div key={i} className="flex items-center">
              <div className="w-16 h-16 bg-gray-700 rounded-lg mr-4"></div>
              <div className="flex-grow">
                <div className="h-4 bg-gray-700 rounded w-3/4 mb-2"></div>
                <div className="h-3 bg-gray-700 rounded w-1/2"></div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );

  return (
    <div>
      <Head>
        <title>Jadwal Rilis - LNNZEPHRY</title>
        <meta name="description" content="Jadwal rilis anime terbaru" />
      </Head>

      <div className="space-y-6">
        <h1 className="text-3xl font-bold">Jadwal Rilis Anime</h1>

        {/* Day Selector */}
        <div className="flex flex-wrap gap-2">
          {Object.keys(schedule).map(day => (
            <button
              key={day}
              onClick={() => setActiveDay(day)}
              className={`px-4 py-2 rounded-lg transition ${
                activeDay === day 
                  ? 'bg-indigo-600 text-white' 
                  : 'bg-gray-800 text-gray-300 hover:bg-gray-700'
              }`}
            >
              {day}
            </button>
          ))}
        </div>

        {/* Schedule Content */}
        {loading ? (
          <SkeletonLoader />
        ) : (
          <div className="bg-gray-800 rounded-lg overflow-hidden">
            <div className="p-4 border-b border-gray-700">
              <h2 className="text-xl font-semibold">{activeDay}</h2>
            </div>
            
            <div className="p-4">
              {schedule[activeDay]?.length > 0 ? (
                <div className="space-y-4">
                  {schedule[activeDay].map((anime, index) => (
                    <div key={index} className="flex items-center p-3 bg-gray-700 rounded-lg hover:bg-gray-600 transition">
                      <div className="w-16 h-16 bg-gray-600 rounded-lg overflow-hidden mr-4 flex-shrink-0">
                        <img 
                          src={anime.thumbnail} 
                          alt={anime.title} 
                          className="w-full h-full object-cover"
                        />
                      </div>
                      <div className="flex-grow">
                        <h3 className="font-semibold">{anime.title}</h3>
                        <p className="text-sm text-gray-400">{anime.time} • Episode {anime.episode}</p>
                      </div>
                      <div className="ml-4">
                        <span className="px-2 py-1 bg-indigo-900 text-indigo-300 text-xs rounded">
                          {anime.type}
                        </span>
                      </div>
                    </div>
                  ))}
                </div>
              ) : (
                <div className="text-center py-8 text-gray-400">
                  Tidak ada jadwal rilis untuk hari ini
                </div>
              )}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

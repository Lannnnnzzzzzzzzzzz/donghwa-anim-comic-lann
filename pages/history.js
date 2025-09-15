// pages/history.js
import { useState, useEffect } from 'react';
import Head from 'next/head';
import Link from 'next/link';

export default function HistoryPage() {
  const [history, setHistory] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchHistory = () => {
      try {
        const savedHistory = JSON.parse(localStorage.getItem('history') || '[]');
        setHistory(savedHistory);
      } catch (error) {
        console.error('Error fetching history:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchHistory();
    
    // Listen for storage changes
    const handleStorageChange = () => {
      fetchHistory();
    };
    
    window.addEventListener('storage', handleStorageChange);
    return () => window.removeEventListener('storage', handleStorageChange);
  }, []);

  // Clear history
  const clearHistory = () => {
    localStorage.removeItem('history');
    setHistory([]);
  };

  // Remove history item
  const removeHistoryItem = (id, type, episode) => {
    const newHistory = history.filter(h => !(h.id === id && h.type === type && h.episode === episode));
    localStorage.setItem('history', JSON.stringify(newHistory));
    setHistory(newHistory);
  };

  // Group history by date
  const groupedHistory = history.reduce((groups, item) => {
    const date = new Date(item.timestamp).toLocaleDateString();
    if (!groups[date]) {
      groups[date] = [];
    }
    groups[date].push(item);
    return groups;
  }, {});

  // Sort dates in descending order
  const sortedDates = Object.keys(groupedHistory).sort((a, b) => {
    return new Date(b) - new Date(a);
  });

  // Skeleton loader
  const SkeletonLoader = () => (
    <div className="animate-pulse">
      <div className="space-y-4">
        {Array.from({ length: 5 }).map((_, i) => (
          <div key={i} className="bg-gray-800 rounded-lg p-4 flex">
            <div className="w-16 h-16 bg-gray-700 rounded-lg mr-4"></div>
            <div className="flex-grow">
              <div className="h-4 bg-gray-700 rounded w-3/4 mb-2"></div>
              <div className="h-3 bg-gray-700 rounded w-1/2"></div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );

  return (
    <div>
      <Head>
        <title>Riwayat - LNNZEPHRY</title>
        <meta name="description" content="Riwayat menonton dan membaca Anda" />
      </Head>

      <div className="space-y-6">
        <div className="flex justify-between items-center">
          <h1 className="text-3xl font-bold">Riwayat</h1>
          {history.length > 0 && (
            <button 
              onClick={clearHistory}
              className="text-red-400 hover:text-red-300 transition"
            >
              Hapus Semua
            </button>
          )}
        </div>

        {loading ? (
          <SkeletonLoader />
        ) : history.length === 0 ? (
          <div className="text-center py-12">
            <svg xmlns="http://www.w3.org/2000/svg" className="h-16 w-16 mx-auto text-gray-600 mb-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
            <h2 className="text-xl font-semibold mb-2">Belum ada riwayat</h2>
            <p className="text-gray-400 mb-6">Riwayat menonton dan membaca Anda akan muncul di sini</p>
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
          <div className="space-y-8">
            {sortedDates.map(date => (
              <div key={date}>
                <h2 className="text-lg font-semibold mb-4">{date}</h2>
                <div className="space-y-4">
                  {groupedHistory[date].map((item, index) => (
                    <div key={index} className="bg-gray-800 rounded-lg p-4 flex items-center hover:bg-gray-700 transition group">
                      <div className="w-16 h-16 bg-gray-700 rounded-lg overflow-hidden mr-4 flex-shrink-0">
                        <img 
                          src={item.thumbnail} 
                          alt={item.title} 
                          className="w-full h-full object-cover"
                        />
                      </div>
                      <div className="flex-grow">
                        <Link href={`/${item.type}/${item.id}`}>
                          <a className="font-semibold hover:text-indigo-400 transition">
                            {item.title}
                          </a>
                        </Link>
                        <div className="text-sm text-gray-400 mt-1">
                          {item.type === 'anime' || item.type === 'donghua' ? (
                            <span>Episode: {item.episode}</span>
                          ) : (
                            <span>Chapter: {item.episode}</span>
                          )}
                          <span className="mx-2">•</span>
                          <span>{new Date(item.timestamp).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}</span>
                        </div>
                      </div>
                      <button 
                        onClick={() => removeHistoryItem(item.id, item.type, item.episode)}
                        className="p-2 rounded-full hover:bg-gray-600 opacity-0 group-hover:opacity-100 transition"
                      >
                        <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
                          <path fillRule="evenodd" d="M9 2a1 1 0 00-.894.553L7.382 4H4a1 1 0 000 2v10a2 2 0 002 2h8a2 2 0 002-2V6a1 1 0 100-2h-3.382l-.724-1.447A1 1 0 0011 2H9zM7 8a1 1 0 012 0v6a1 1 0 11-2 0V8zm5-1a1 1 0 00-1 1v6a1 1 0 102 0V8a1 1 0 00-1-1z" clipRule="evenodd" />
                        </svg>
                      </button>
                    </div>
                  ))}
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}

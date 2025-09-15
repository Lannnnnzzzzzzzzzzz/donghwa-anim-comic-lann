import { useState, useEffect } from 'react';
import { useRouter } from 'next/router';
import Head from 'next/head';
import Link from 'next/link';

export default function ComicDetail() {
  const router = useRouter();
  const { slug } = router.query;
  const [comic, setComic] = useState(null);
  const [chapters, setChapters] = useState([]);
  const [loading, setLoading] = useState(true);
  const [currentChapter, setCurrentChapter] = useState(null);
  const [readerOpen, setReaderOpen] = useState(false);
  const [bookmark, setBookmark] = useState(false);

  useEffect(() => {
    if (!slug) return;

    const fetchData = async () => {
      try {
        // Fetch comic detail
        const detailRes = await fetch(`https://www.sankavollerei.com/comic/comic/${slug}`);
        if (detailRes.ok) {
          const detailData = await detailRes.json();
          setComic(detailData);
          setChapters(detailData.chapters || []);
        }

        // Check bookmark
        const bookmarks = JSON.parse(localStorage.getItem('bookmarks') || '[]');
        setBookmark(bookmarks.some(b => b.id === slug && b.type === 'comic'));
      } catch (error) {
        console.error('Error fetching comic detail:', error);
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
      const newBookmarks = bookmarks.filter(b => !(b.id === slug && b.type === 'comic'));
      localStorage.setItem('bookmarks', JSON.stringify(newBookmarks));
      setBookmark(false);
    } else {
      // Add bookmark
      const newBookmark = {
        id: slug,
        type: 'comic',
        title: comic?.title,
        thumbnail: comic?.thumbnail,
        timestamp: new Date().toISOString()
      };
      localStorage.setItem('bookmarks', JSON.stringify([...bookmarks, newBookmark]));
      setBookmark(true);
    }
  };

  // Read chapter
  const readChapter = (chapter) => {
    setCurrentChapter(chapter);
    setReaderOpen(true);
    
    // Add to history
    const history = JSON.parse(localStorage.getItem('history') || '[]');
    const newHistory = {
      id: slug,
      type: 'comic',
      title: comic?.title,
      thumbnail: comic?.thumbnail,
      chapter: chapter.title,
      timestamp: new Date().toISOString()
    };
    
    // Remove if already exists
    const filteredHistory = history.filter(h => !(h.id === slug && h.type === 'comic' && h.chapter === chapter.title));
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

  if (!comic) {
    return (
      <div className="container mx-auto px-4 py-6 text-center">
        <h1 className="text-2xl font-bold mb-4">Komik tidak ditemukan</h1>
        <Link href="/comic">
          <a className="text-indigo-400 hover:text-indigo-300">Kembali ke daftar komik</a>
        </Link>
      </div>
    );
  }

  return (
    <div>
      <Head>
        <title>{comic.title} - Comic - LNNZEPHRY</title>
        <meta name="description" content={`Baca ${comic.title} bahasa Indonesia`} />
      </Head>

      {/* Comic Reader Modal */}
      {readerOpen && currentChapter && (
        <ComicReader 
          comic={comic} 
          chapter={currentChapter} 
          chapters={chapters}
          onClose={() => setReaderOpen(false)}
          onChapterChange={(chapter) => {
            setCurrentChapter(chapter);
            readChapter(chapter);
          }}
        />
      )}

      <div className="container mx-auto px-4 py-6">
        <div className="flex flex-col md:flex-row gap-6 mb-8">
          <div className="w-full md:w-1/3">
            <div className="bg-gray-800 rounded-lg overflow-hidden sticky top-24">
              <img 
                src={comic.thumbnail} 
                alt={comic.title} 
                className="w-full h-auto"
              />
              <div className="p-4">
                <div className="flex justify-between items-center mb-4">
                  <span className={`px-3 py-1 rounded-full text-sm font-medium ${
                    comic.status === 'Ongoing' ? 'bg-green-900 text-green-300' : 'bg-blue-900 text-blue-300'
                  }`}>
                    {comic.status}
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
                      <span className="ml-1">{comic.rating || 'N/A'}</span>
                    </div>
                  </div>
                  
                  <div>
                    <h3 className="text-sm text-gray-400">Author</h3>
                    <p>{comic.author || 'N/A'}</p>
                  </div>
                  
                  <div>
                    <h3 className="text-sm text-gray-400">Status</h3>
                    <p>{comic.status || 'N/A'}</p>
                  </div>
                  
                  <div>
                    <h3 className="text-sm text-gray-400">Genre</h3>
                    <div className="flex flex-wrap gap-2 mt-1">
                      {comic.genres?.map(genre => (
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
            <h1 className="text-3xl font-bold mb-2">{comic.title}</h1>
            <p className="text-gray-400 mb-6">{comic.alternative_title}</p>
            
            <div className="mb-6">
              <h2 className="text-xl font-semibold mb-3">Sinopsis</h2>
              <p className="text-gray-300 leading-relaxed">{comic.synopsis}</p>
            </div>
            
            <div className="mb-6">
              <div className="flex justify-between items-center mb-4">
                <h2 className="text-xl font-semibold">Chapter List</h2>
                <span className="text-sm text-gray-400">{chapters.length} Chapter</span>
              </div>
              
              <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-3">
                {chapters.map(chapter => (
                  <button
                    key={chapter.id}
                    onClick={() => readChapter(chapter)}
                    className="bg-gray-800 hover:bg-indigo-900 text-indigo-300 py-3 rounded-lg transition text-center"
                  >
                    {chapter.title}
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

// Comic Reader Component
function ComicReader({ comic, chapter, chapters, onClose, onChapterChange }) {
  const [images, setImages] = useState([]);
  const [loading, setLoading] = useState(true);
  const [currentPage, setCurrentPage] = useState(0);
  const [settings, setSettings] = useState({
    fit: 'width',
    background: 'dark'
  });

  useEffect(() => {
    const fetchChapterImages = async () => {
      try {
        const chapterRes = await fetch(`https://www.sankavollerei.com/comic/chapter/${comic.slug}-${chapter.slug}`);
        if (chapterRes.ok) {
          const chapterData = await chapterRes.json();
          setImages(chapterData.images || []);
        }
      } catch (error) {
        console.error('Error fetching chapter images:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchChapterImages();
  }, [comic.slug, chapter.slug]);

  // Handle keyboard navigation
  useEffect(() => {
    const handleKeyDown = (e) => {
      if (e.key === 'ArrowRight' && currentPage < images.length - 1) {
        setCurrentPage(prev => prev + 1);
      } else if (e.key === 'ArrowLeft' && currentPage > 0) {
        setCurrentPage(prev => prev - 1);
      } else if (e.key === 'Escape') {
        onClose();
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [currentPage, images.length, onClose]);

  // Navigate to next/prev chapter
  const goToNextChapter = () => {
    const currentIndex = chapters.findIndex(c => c.id === chapter.id);
    if (currentIndex < chapters.length - 1) {
      onChapterChange(chapters[currentIndex + 1]);
      setCurrentPage(0);
    }
  };

  const goToPrevChapter = () => {
    const currentIndex = chapters.findIndex(c => c.id === chapter.id);
    if (currentIndex > 0) {
      onChapterChange(chapters[currentIndex - 1]);
      setCurrentPage(0);
    }
  };

  return (
    <div className="fixed inset-0 bg-black z-50 flex flex-col">
      {/* Reader Header */}
      <div className="bg-gray-900 p-4 flex justify-between items-center">
        <div>
          <h2 className="text-xl font-bold">{comic.title}</h2>
          <p className="text-gray-400">{chapter.title}</p>
        </div>
        
        <div className="flex items-center space-x-4">
          <div className="text-sm">
            {currentPage + 1} / {images.length}
          </div>
          
          <div className="flex space-x-2">
            <button 
              onClick={() => setSettings({...settings, fit: settings.fit === 'width' ? 'height' : 'width'})}
              className="p-2 rounded-full hover:bg-gray-800 transition"
              title="Toggle fit mode"
            >
              <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
                <path fillRule="evenodd" d="M4 4a2 2 0 00-2 2v8a2 2 0 002 2h12a2 2 0 002-2V6a2 2 0 00-2-2H4zm12 10H4V6h12v8z" clipRule="evenodd" />
              </svg>
            </button>
            
            <button 
              onClick={() => setSettings({...settings, background: settings.background === 'dark' ? 'white' : 'dark'})}
              className="p-2 rounded-full hover:bg-gray-800 transition"
              title="Toggle background"
            >
              <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
                <path fillRule="evenodd" d="M10 2a1 1 0 011 1v1a1 1 0 11-2 0V3a1 1 0 011-1zm4 8a4 4 0 11-8 0 4 4 0 018 0zm-.464 4.95l.707.707a1 1 0 001.414-1.414l-.707-.707a1 1 0 00-1.414 1.414zm2.12-10.607a1 1 0 010 1.414l-.706.707a1 1 0 11-1.414-1.414l.707-.707a1 1 0 011.414 0zM17 11a1 1 0 100-2h-1a1 1 0 100 2h1zm-7 4a1 1 0 011 1v1a1 1 0 11-2 0v-1a1 1 0 011-1zM5.05 6.464A1 1 0 106.465 5.05l-.708-.707a1 1 0 00-1.414 1.414l.707.707zm1.414 8.486l-.707.707a1 1 0 01-1.414-1.414l.707-.707a1 1 0 011.414 1.414zM4 11a1 1 0 100-2H3a1 1 0 000 2h1z" clipRule="evenodd" />
              </svg>
            </button>
            
            <button 
              onClick={onClose}
              className="p-2 rounded-full hover:bg-gray-800 transition"
            >
              <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
                <path fillRule="evenodd" d="M4.293 4.293a1 1 0 011.414 0L10 8.586l4.293-4.293a1 1 0 111.414 1.414L11.414 10l4.293 4.293a1 1 0 01-1.414 1.414L10 11.414l-4.293 4.293a1 1 0 01-1.414-1.414L8.586 10 4.293 5.707a1 1 0 010-1.414z" clipRule="evenodd" />
              </svg>
            </button>
          </div>
        </div>
      </div>
      
      {/* Reader Content */}
      <div className={`flex-grow overflow-auto ${settings.background === 'dark' ? 'bg-black' : 'bg-white'}`}>
        {loading ? (
          <div className="flex justify-center items-center h-full">
            <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-indigo-500"></div>
          </div>
        ) : (
          <div className="flex flex-col items-center">
            {images.map((image, index) => (
              <div 
                key={index} 
                className={`mb-4 ${currentPage === index ? 'block' : 'hidden'}`}
              >
                <img 
                  src={image} 
                  alt={`Page ${index + 1}`}
                  className={`max-w-full ${settings.fit === 'width' ? 'w-full' : 'h-screen'}`}
                />
              </div>
            ))}
          </div>
        )}
      </div>
      
      {/* Reader Navigation */}
      <div className="bg-gray-900 p-4 flex justify-between items-center">
        <button 
          onClick={goToPrevChapter}
          disabled={chapters.findIndex(c => c.id === chapter.id) === 0}
          className="px-4 py-2 bg-gray-800 hover:bg-gray-700 rounded-lg transition disabled:opacity-50 disabled:cursor-not-allowed"
        >
          Chapter Sebelumnya
        </button>
        
        <div className="flex space-x-2">
          <button 
            onClick={() => setCurrentPage(prev => Math.max(0, prev - 1))}
            disabled={currentPage === 0}
            className="p-2 rounded-full bg-gray-800 hover:bg-gray-700 transition disabled:opacity-50 disabled:cursor-not-allowed"
          >
            <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
              <path fillRule="evenodd" d="M12.707 5.293a1 1 0 010 1.414L9.414 10l3.293 3.293a1 1 0 01-1.414 1.414l-4-4a1 1 0 010-1.414l4-4a1 1 0 011.414 0z" clipRule="evenodd" />
            </svg>
          </button>
          
          <button 
            onClick={() => setCurrentPage(prev => Math.min(images.length - 1, prev + 1))}
            disabled={currentPage === images.length - 1}
            className="p-2 rounded-full bg-gray-800 hover:bg-gray-700 transition disabled:opacity-50 disabled:cursor-not-allowed"
          >
            <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
              <path fillRule="evenodd" d="M7.293 14.707a1 1 0 010-1.414L10.586 10 7.293 6.707a1 1 0 011.414-1.414l4 4a1 1 0 010 1.414l-4 4a1 1 0 01-1.414 0z" clipRule="evenodd" />
            </svg>
          </button>
        </div>
        
        <button 
          onClick={goToNextChapter}
          disabled={chapters.findIndex(c => c.id === chapter.id) === chapters.length - 1}
          className="px-4 py-2 bg-gray-800 hover:bg-gray-700 rounded-lg transition disabled:opacity-50 disabled:cursor-not-allowed"
        >
          Chapter Selanjutnya
        </button>
      </div>
    </div>
  );
}

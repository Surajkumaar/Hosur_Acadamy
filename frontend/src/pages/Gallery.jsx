import React, { useState } from 'react';
import { Image as ImageIcon, Eye } from 'lucide-react';
import { Button } from '../components/ui/button';
import { Badge } from '../components/ui/badge';
import { mockData } from '../components/mock/mockData';

const Gallery = () => {
  const [selectedImage, setSelectedImage] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const gallery = mockData.gallery;

  const handleImageClick = (image) => {
    setSelectedImage(image);
  };

  const closeModal = () => {
    setSelectedImage(null);
  };

  const getCategoryIcon = (category) => {
    switch (category) {
      case 'classroom':
        return '🎓';
      case 'laboratory':
        return '🔬';
      case 'events':
        return '🎉';
      case 'workshop':
        return '🛠️';
      case 'facility':
        return '🏢';
      case 'counseling':
        return '💬';
      default:
        return '📸';
    }
  };

  const getCategoryColor = (category) => {
    switch (category) {
      case 'classroom':
        return 'bg-blue-100 text-blue-800';
      case 'laboratory':
        return 'bg-green-100 text-green-800';
      case 'events':
        return 'bg-purple-100 text-purple-800';
      case 'workshop':
        return 'bg-orange-100 text-orange-800';
      case 'facility':
        return 'bg-gray-100 text-gray-800';
      case 'counseling':
        return 'bg-pink-100 text-pink-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  };

  if (loading) {
    return <div className="min-h-screen flex items-center justify-center">Loading gallery...</div>;
  }

  if (error) {
    return <div className="min-h-screen flex items-center justify-center text-red-500">Error: {error}</div>;
  }

  return (
    <div className="min-h-screen bg-white">
      {/* Hero Section */}
      <section className="relative bg-gradient-to-br from-[#0052CC] via-[#002357] to-[#0052CC] text-white py-20">
        <div className="absolute inset-0 bg-black bg-opacity-20"></div>
        <div className="relative container mx-auto px-4">
          <div className="text-center max-w-4xl mx-auto">
            <Badge className="bg-[#39C93D] text-white px-4 py-2 text-sm font-medium mb-6 hover:bg-[#39C93D] cursor-default">
              Our Gallery
            </Badge>
            <h1 className="text-4xl lg:text-6xl font-bold mb-6">
              Moments That
              <span className="block text-[#39C93D]">Inspire Excellence</span>
            </h1>
            <p className="text-xl text-gray-200 leading-relaxed">
              Explore our vibrant campus life, academic achievements, and memorable moments
            </p>
          </div>
        </div>
      </section>

      {/* Gallery Grid */}
      <section className="py-20">
        <div className="container mx-auto px-4">
          {gallery.length === 0 ? (
            <div className="text-center py-16">
              <ImageIcon className="h-16 w-16 text-gray-400 mx-auto mb-4" />
              <h3 className="text-xl font-semibold text-gray-700 mb-2">No images found</h3>
              <p className="text-gray-600">Gallery content will be available soon</p>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
              {gallery.map((item) => (
                <div 
                  key={item.id} 
                  className="group relative overflow-hidden rounded-lg shadow-lg hover:shadow-xl transition-all duration-300 transform hover:-translate-y-2 cursor-pointer"
                  onClick={() => handleImageClick(item)}
                >
                  <div className="relative overflow-hidden">
                    <img
                      src={item.image}
                      alt={item.title}
                      className="w-full h-64 object-cover group-hover:scale-110 transition-transform duration-300"
                    />
                    <div className="absolute inset-0 bg-black bg-opacity-0 group-hover:bg-opacity-40 transition-opacity duration-300 flex items-center justify-center">
                      <Eye className="h-8 w-8 text-white opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
                    </div>
                  </div>
                  
                  <div className="absolute top-4 left-4">
                    <Badge className={`${getCategoryColor(item.category)} text-xs`}>
                      {getCategoryIcon(item.category)} {item.category.charAt(0).toUpperCase() + item.category.slice(1)}
                    </Badge>
                  </div>
                  
                  <div className="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-black via-black/50 to-transparent p-4">
                    <h3 className="text-white font-semibold text-lg mb-1">{item.title}</h3>
                    <p className="text-gray-200 text-sm">{item.description}</p>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </section>

      {/* Image Modal */}
      {selectedImage && (
        <div className="fixed inset-0 bg-black bg-opacity-90 z-50 flex items-center justify-center p-4" onClick={closeModal}>
          <div className="relative max-w-4xl max-h-full">
            <button
              onClick={closeModal}
              className="absolute top-4 right-4 text-white bg-black bg-opacity-50 rounded-full p-2 hover:bg-opacity-70 transition-colors z-10"
            >
              <svg className="h-6 w-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
              </svg>
            </button>
            
            <img
              src={selectedImage.image}
              alt={selectedImage.title}
              className="max-w-full max-h-full object-contain"
              onClick={(e) => e.stopPropagation()}
            />
            
            <div className="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-black via-black/70 to-transparent p-6">
              <div className="text-white">
                <Badge className={`${getCategoryColor(selectedImage.category)} mb-2`}>
                  {getCategoryIcon(selectedImage.category)} {selectedImage.category.charAt(0).toUpperCase() + selectedImage.category.slice(1)}
                </Badge>
                <h3 className="text-2xl font-bold mb-2">{selectedImage.title}</h3>
                <p className="text-gray-200">{selectedImage.description}</p>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* CTA Section */}
      <section className="py-20 bg-gradient-to-r from-[#0052CC] to-[#39C93D] text-white">
        <div className="container mx-auto px-4 text-center">
          <h2 className="text-4xl font-bold mb-4">
            Be Part of Our Success Story
          </h2>
          <p className="text-xl mb-8 max-w-2xl mx-auto">
            Join our vibrant community and create your own memorable moments
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Button 
              size="lg" 
              className="bg-white text-[#0052CC] hover:bg-gray-100 px-8 py-4 text-lg font-semibold transition-all duration-300 transform hover:scale-105"
              onClick={() => window.location.href = '/#inquiry-form'}
            >
              Join Us Today
            </Button>
            <Button 
              size="lg" 
              variant="outline" 
              className="border-white text-white hover:bg-white hover:text-[#0052CC] px-8 py-4 text-lg font-semibold transition-all duration-300"
              onClick={() => window.location.href = '/courses'}
            >
              Explore Courses
            </Button>
          </div>
        </div>
      </section>
    </div>
  );
};

export default Gallery;
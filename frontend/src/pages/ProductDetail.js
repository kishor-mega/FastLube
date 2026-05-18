import React, { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import { ArrowLeft, Package, Star, Phone, MapPin, Mail } from 'lucide-react';
import api from '../api/client';
import LoadingSpinner from '../components/common/LoadingSpinner';

const ProductDetail = () => {
  const { id } = useParams();
  const [product, setProduct] = useState(null);
  const [loading, setLoading] = useState(true);
  const [selectedImage, setSelectedImage] = useState(0);

  useEffect(() => {
    fetchProduct();
  }, [id]);

  const fetchProduct = async () => {
    try {
      const response = await api.get(`/api/products/${id}`);
      setProduct(response.data);
    } catch (error) {
      console.error('Error fetching product:', error);
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return <LoadingSpinner />;
  }

  if (!product) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <Package className="mx-auto h-12 w-12 text-gray-400" />
          <h3 className="mt-2 text-sm font-medium text-gray-900">Product not found</h3>
          <Link to="/products" className="mt-4 btn-primary">
            Back to Products
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Back Button */}
        <Link
          to="/products"
          className="inline-flex items-center text-primary-600 hover:text-primary-500 mb-6"
        >
          <ArrowLeft className="w-4 h-4 mr-2" />
          Back to Products
        </Link>

        <div className="bg-white rounded-lg shadow-sm border border-gray-200 overflow-hidden">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 p-6">
            {/* Product Images */}
            <div className="space-y-4">
              <div className="aspect-w-1 aspect-h-1 w-full overflow-hidden rounded-lg bg-gray-200">
                {product.images && product.images.length > 0 ? (
                  <img
                    src={product.images[selectedImage]}
                    alt={product.name}
                    className="h-96 w-full object-cover"
                  />
                ) : (
                  <div className="h-96 w-full flex items-center justify-center bg-gray-200">
                    <Package className="h-24 w-24 text-gray-400" />
                  </div>
                )}
              </div>
              
              {/* Image Thumbnails */}
              {product.images && product.images.length > 1 && (
                <div className="flex space-x-2 overflow-x-auto">
                  {product.images.map((image, index) => (
                    <button
                      key={index}
                      onClick={() => setSelectedImage(index)}
                      className={`flex-shrink-0 w-20 h-20 rounded-lg overflow-hidden border-2 ${
                        selectedImage === index ? 'border-primary-500' : 'border-gray-200'
                      }`}
                    >
                      <img
                        src={image}
                        alt={`${product.name} ${index + 1}`}
                        className="w-full h-full object-cover"
                      />
                    </button>
                  ))}
                </div>
              )}
            </div>

            {/* Product Info */}
            <div className="space-y-6">
              <div>
                <h1 className="text-3xl font-bold text-gray-900">{product.name}</h1>
                <p className="text-lg text-gray-600 capitalize mt-1">
                  {product.category.replace('-', ' ')} • {product.brand}
                </p>
              </div>

              <div className="flex items-center space-x-4">
                <span className="text-3xl font-bold text-gray-900">Inr{product.price}</span>
                {product.originalPrice && product.originalPrice > product.price && (
                  <span className="text-xl text-gray-500 line-through">Inr{product.originalPrice}</span>
                )}
              </div>

              {product.rating && product.rating.average > 0 && (
                <div className="flex items-center">
                  <div className="flex items-center">
                    {[...Array(5)].map((_, i) => (
                      <Star
                        key={i}
                        className={`w-5 h-5 ${
                          i < Math.floor(product.rating.average)
                            ? 'text-yellow-400 fill-current'
                            : 'text-gray-300'
                        }`}
                      />
                    ))}
                  </div>
                  <span className="ml-2 text-sm text-gray-600">
                    {product.rating.average.toFixed(1)} ({product.rating.count} reviews)
                  </span>
                </div>
              )}

              <div>
                <h3 className="text-lg font-medium text-gray-900 mb-2">Description</h3>
                <p className="text-gray-600">{product.description}</p>
              </div>

              {/* Specifications */}
              {product.specifications && (
                <div>
                  <h3 className="text-lg font-medium text-gray-900 mb-2">Specifications</h3>
                  <div className="grid grid-cols-2 gap-4">
                    {product.specifications.weight && (
                      <div>
                        <span className="text-sm font-medium text-gray-500">Weight:</span>
                        <span className="ml-2 text-sm text-gray-900">{product.specifications.weight}</span>
                      </div>
                    )}
                    {product.specifications.dimensions && (
                      <div>
                        <span className="text-sm font-medium text-gray-500">Dimensions:</span>
                        <span className="ml-2 text-sm text-gray-900">{product.specifications.dimensions}</span>
                      </div>
                    )}
                    {product.specifications.material && (
                      <div>
                        <span className="text-sm font-medium text-gray-500">Material:</span>
                        <span className="ml-2 text-sm text-gray-900">{product.specifications.material}</span>
                      </div>
                    )}
                    {product.specifications.compatibility && (
                      <div>
                        <span className="text-sm font-medium text-gray-500">Compatibility:</span>
                        <span className="ml-2 text-sm text-gray-900">{product.specifications.compatibility}</span>
                      </div>
                    )}
                  </div>
                </div>
              )}

              {/* Stock Status */}
              <div>
                <span className="text-sm font-medium text-gray-500">Availability:</span>
                <span className={`ml-2 text-sm font-medium ${
                  product.quantity > 0 ? 'text-green-600' : 'text-red-600'
                }`}>
                  {product.quantity > 0 ? `In Stock (${product.quantity} available)` : 'Out of Stock'}
                </span>
              </div>

              {/* Retailer Info */}
              {product.retailer && (
                <div className="border-t pt-6">
                  <h3 className="text-lg font-medium text-gray-900 mb-3">Sold by</h3>
                  <div className="flex items-start space-x-3">
                    <div className="flex-1">
                      <p className="font-medium text-gray-900">{product.retailer.name}</p>
                      {product.retailer.phone && (
                        <div className="flex items-center mt-1">
                          <Phone className="w-4 h-4 text-gray-400 mr-2" />
                          <span className="text-sm text-gray-600">{product.retailer.phone}</span>
                        </div>
                      )}
                      {product.retailer.address && (
                        <div className="flex items-center mt-1">
                          <MapPin className="w-4 h-4 text-gray-400 mr-2" />
                          <span className="text-sm text-gray-600">
                            {product.retailer.address.city}, {product.retailer.address.state}
                          </span>
                        </div>
                      )}
                    </div>
                  </div>
                </div>
              )}

              {/* Actions */}
              <div className="flex space-x-4 pt-6 border-t">
                <button
                  disabled={product.quantity === 0}
                  className="flex-1 btn-primary disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  Contact Retailer
                </button>
                <button className="btn-secondary">
                  Add to Wishlist
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ProductDetail;

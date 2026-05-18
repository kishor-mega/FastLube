import React, { useState, useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { useForm } from 'react-hook-form';
import { Plus, X, Upload, Package, ArrowLeft } from 'lucide-react';
import api from '../../api/client';
import toast from 'react-hot-toast';
import LoadingSpinner from '../../components/common/LoadingSpinner';

const EditProduct = () => {
  const navigate = useNavigate();
  const { id } = useParams();
  const [isLoading, setIsLoading] = useState(false);
  const [loading, setLoading] = useState(true);
  const [images, setImages] = useState([]);
  const [imageUrls, setImageUrls] = useState([]);
  const [existingImages, setExistingImages] = useState([]);

  const {
    register,
    handleSubmit,
    formState: { errors },
    setValue
  } = useForm();

  const categories = [
    { value: 'engine-oil', label: 'Engine Oil' },
    { value: 'brake-pads', label: 'Brake Pads' },
    { value: 'air-filters', label: 'Air Filters' },
    { value: 'spark-plugs', label: 'Spark Plugs' },
    { value: 'batteries', label: 'Batteries' },
    { value: 'tires', label: 'Tires' },
    { value: 'other', label: 'Other' }
  ];

  useEffect(() => {
    fetchProduct();
  }, [id]);

  const fetchProduct = async () => {
    try {
      const response = await api.get(`/api/products/${id}`);
      const product = response.data;
      
      // Populate form fields
      setValue('name', product.name);
      setValue('description', product.description);
      setValue('price', product.price);
      setValue('originalPrice', product.originalPrice);
      setValue('quantity', product.quantity);
      setValue('category', product.category);
      setValue('brand', product.brand);
      setValue('model', product.model);
      setValue('weight', product.specifications?.weight);
      setValue('dimensions', product.specifications?.dimensions);
      setValue('material', product.specifications?.material);
      setValue('compatibility', product.specifications?.compatibility);
      setValue('tags', product.tags?.join(', '));
      
      // Set existing images
      setExistingImages(product.images || []);
      
    } catch (error) {
      console.error('Error fetching product:', error);
      toast.error('Failed to load product');
      navigate('/retailer/products');
    } finally {
      setLoading(false);
    }
  };

  const handleImageChange = (e) => {
    const files = Array.from(e.target.files);
    const newImages = [...images, ...files];
    setImages(newImages);

    // Create preview URLs
    const newUrls = files.map(file => URL.createObjectURL(file));
    setImageUrls([...imageUrls, ...newUrls]);
  };

  const removeNewImage = (index) => {
    const newImages = images.filter((_, i) => i !== index);
    const newUrls = imageUrls.filter((_, i) => i !== index);
    setImages(newImages);
    setImageUrls(newUrls);
  };

  const removeExistingImage = (index) => {
    const newExistingImages = existingImages.filter((_, i) => i !== index);
    setExistingImages(newExistingImages);
  };

  const onSubmit = async (data) => {
    const allImages = [...existingImages, ...imageUrls];
    if (allImages.length === 0) {
      toast.error('Please keep at least one image');
      return;
    }

    setIsLoading(true);
    try {
      // Convert new images to base64
      const imagePromises = images.map(file => {
        return new Promise((resolve) => {
          const reader = new FileReader();
          reader.onloadend = () => resolve(reader.result);
          reader.readAsDataURL(file);
        });
      });

      const base64Images = await Promise.all(imagePromises);
      const finalImages = [...existingImages, ...base64Images];

      const productData = {
        ...data,
        price: parseFloat(data.price),
        originalPrice: data.originalPrice ? parseFloat(data.originalPrice) : undefined,
        quantity: parseInt(data.quantity),
        images: finalImages,
        specifications: {
          weight: data.weight,
          dimensions: data.dimensions,
          material: data.material,
          compatibility: data.compatibility
        },
        tags: data.tags ? data.tags.split(',').map(tag => tag.trim()) : []
      };

      await api.put(`/api/products/${id}`, productData);
      toast.success('Product updated successfully!');
      navigate('/retailer/products');
    } catch (error) {
      console.error('Error updating product:', error);
      toast.error(error.response?.data?.message || 'Failed to update product');
    } finally {
      setIsLoading(false);
    }
  };

  if (loading) {
    return <LoadingSpinner />;
  }

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="mb-8">
          <button
            onClick={() => navigate('/retailer/products')}
            className="inline-flex items-center text-primary-600 hover:text-primary-500 mb-4"
          >
            <ArrowLeft className="w-4 h-4 mr-2" />
            Back to Products
          </button>
          <div className="flex items-center space-x-3">
            <div className="w-10 h-10 bg-primary-100 rounded-lg flex items-center justify-center">
              <Package className="w-5 h-5 text-primary-600" />
            </div>
            <h1 className="text-3xl font-bold text-gray-900">Edit Product</h1>
          </div>
          <p className="text-gray-600">Update your product information</p>
        </div>

        <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
          <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
            {/* Basic Information */}
            <div>
              <h3 className="text-lg font-medium text-gray-900 mb-4">Basic Information</h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <label htmlFor="name" className="form-label">
                    Product Name *
                  </label>
                  <input
                    id="name"
                    type="text"
                    className={`input-field ${errors.name ? 'border-red-500' : ''}`}
                    placeholder="Enter product name"
                    {...register('name', {
                      required: 'Product name is required',
                      minLength: {
                        value: 3,
                        message: 'Name must be at least 3 characters'
                      }
                    })}
                  />
                  {errors.name && (
                    <p className="mt-1 text-sm text-red-600">{errors.name.message}</p>
                  )}
                </div>

                <div>
                  <label htmlFor="category" className="form-label">
                    Category *
                  </label>
                  <select
                    id="category"
                    className={`input-field ${errors.category ? 'border-red-500' : ''}`}
                    {...register('category', {
                      required: 'Category is required'
                    })}
                  >
                    <option value="">Select a category</option>
                    {categories.map((category) => (
                      <option key={category.value} value={category.value}>
                        {category.label}
                      </option>
                    ))}
                  </select>
                  {errors.category && (
                    <p className="mt-1 text-sm text-red-600">{errors.category.message}</p>
                  )}
                </div>

                <div>
                  <label htmlFor="brand" className="form-label">
                    Brand *
                  </label>
                  <input
                    id="brand"
                    type="text"
                    className={`input-field ${errors.brand ? 'border-red-500' : ''}`}
                    placeholder="Enter brand name"
                    {...register('brand', {
                      required: 'Brand is required'
                    })}
                  />
                  {errors.brand && (
                    <p className="mt-1 text-sm text-red-600">{errors.brand.message}</p>
                  )}
                </div>

                <div>
                  <label htmlFor="model" className="form-label">
                    Model
                  </label>
                  <input
                    id="model"
                    type="text"
                    className="input-field"
                    placeholder="Enter model (optional)"
                    {...register('model')}
                  />
                </div>
              </div>
            </div>

            {/* Description */}
            <div>
              <label htmlFor="description" className="form-label">
                Description *
              </label>
              <textarea
                id="description"
                rows={4}
                className={`input-field ${errors.description ? 'border-red-500' : ''}`}
                placeholder="Enter detailed product description"
                {...register('description', {
                  required: 'Description is required',
                  minLength: {
                    value: 10,
                    message: 'Description must be at least 10 characters'
                  }
                })}
              />
              {errors.description && (
                <p className="mt-1 text-sm text-red-600">{errors.description.message}</p>
              )}
            </div>

            {/* Pricing and Inventory */}
            <div>
              <h3 className="text-lg font-medium text-gray-900 mb-4">Pricing & Inventory</h3>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                <div>
                  <label htmlFor="price" className="form-label">
                    Price *
                  </label>
                  <div className="relative">
                    <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                      <span className="text-gray-500">₹</span>
                    </div>
                    <input
                      id="price"
                      type="number"
                      step="0.01"
                      min="0"
                      className={`input-field pl-8 ${errors.price ? 'border-red-500' : ''}`}
                      placeholder="0.00"
                      {...register('price', {
                        required: 'Price is required',
                        min: {
                          value: 0,
                          message: 'Price must be positive'
                        }
                      })}
                    />
                  </div>
                  {errors.price && (
                    <p className="mt-1 text-sm text-red-600">{errors.price.message}</p>
                  )}
                </div>

                <div>
                  <label htmlFor="originalPrice" className="form-label">
                    Original Price
                  </label>
                  <div className="relative">
                    <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                      <span className="text-gray-500">₹</span>
                    </div>
                    <input
                      id="originalPrice"
                      type="number"
                      step="0.01"
                      min="0"
                      className="input-field pl-8"
                      placeholder="0.00"
                      {...register('originalPrice')}
                    />
                  </div>
                </div>

                <div>
                  <label htmlFor="quantity" className="form-label">
                    Quantity *
                  </label>
                  <input
                    id="quantity"
                    type="number"
                    min="0"
                    className={`input-field ${errors.quantity ? 'border-red-500' : ''}`}
                    placeholder="0"
                    {...register('quantity', {
                      required: 'Quantity is required',
                      min: {
                        value: 0,
                        message: 'Quantity must be non-negative'
                      }
                    })}
                  />
                  {errors.quantity && (
                    <p className="mt-1 text-sm text-red-600">{errors.quantity.message}</p>
                  )}
                </div>
              </div>
            </div>

            {/* Images */}
            <div>
              <label className="form-label">Product Images</label>
              
              {/* Existing Images */}
              {existingImages.length > 0 && (
                <div className="mb-4">
                  <h4 className="text-sm font-medium text-gray-700 mb-2">Current Images:</h4>
                  <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                    {existingImages.map((url, index) => (
                      <div key={`existing-${index}`} className="relative group">
                        <img
                          src={url}
                          alt={`Current ${index + 1}`}
                          className="w-full h-24 object-cover rounded-lg"
                        />
                        <button
                          type="button"
                          onClick={() => removeExistingImage(index)}
                          className="absolute top-1 right-1 w-6 h-6 bg-red-500 text-white rounded-full flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity"
                        >
                          <X className="w-4 h-4" />
                        </button>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {/* Upload New Images */}
              <div className="border-2 border-dashed border-gray-300 rounded-lg p-6">
                <div className="text-center">
                  <Upload className="mx-auto h-12 w-12 text-gray-400" />
                  <div className="mt-4">
                    <label htmlFor="images" className="btn-primary cursor-pointer">
                      <Plus className="w-4 h-4 mr-2" />
                      Add More Images
                    </label>
                    <input
                      id="images"
                      type="file"
                      multiple
                      accept="image/*"
                      className="hidden"
                      onChange={handleImageChange}
                    />
                  </div>
                  <p className="mt-2 text-sm text-gray-600">
                    PNG, JPG, GIF up to 10MB each
                  </p>
                </div>
              </div>

              {/* New Image Previews */}
              {imageUrls.length > 0 && (
                <div className="mt-4">
                  <h4 className="text-sm font-medium text-gray-700 mb-2">New Images:</h4>
                  <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                    {imageUrls.map((url, index) => (
                      <div key={`new-${index}`} className="relative group">
                        <img
                          src={url}
                          alt={`New ${index + 1}`}
                          className="w-full h-24 object-cover rounded-lg"
                        />
                        <button
                          type="button"
                          onClick={() => removeNewImage(index)}
                          className="absolute top-1 right-1 w-6 h-6 bg-red-500 text-white rounded-full flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity"
                        >
                          <X className="w-4 h-4" />
                        </button>
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </div>

            {/* Specifications */}
            <div>
              <h3 className="text-lg font-medium text-gray-900 mb-4">Specifications</h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <label htmlFor="weight" className="form-label">Weight</label>
                  <input
                    id="weight"
                    type="text"
                    className="input-field"
                    placeholder="e.g., 1.5 kg"
                    {...register('weight')}
                  />
                </div>

                <div>
                  <label htmlFor="dimensions" className="form-label">Dimensions</label>
                  <input
                    id="dimensions"
                    type="text"
                    className="input-field"
                    placeholder="e.g., 10 x 5 x 2 cm"
                    {...register('dimensions')}
                  />
                </div>

                <div>
                  <label htmlFor="material" className="form-label">Material</label>
                  <input
                    id="material"
                    type="text"
                    className="input-field"
                    placeholder="e.g., Steel, Aluminum"
                    {...register('material')}
                  />
                </div>

                <div>
                  <label htmlFor="compatibility" className="form-label">Compatibility</label>
                  <input
                    id="compatibility"
                    type="text"
                    className="input-field"
                    placeholder="e.g., Toyota Camry 2018-2022"
                    {...register('compatibility')}
                  />
                </div>
              </div>
            </div>

            {/* Additional Information */}
            <div>
              <label htmlFor="tags" className="form-label">Tags</label>
              <input
                id="tags"
                type="text"
                className="input-field"
                placeholder="Enter tags separated by commas"
                {...register('tags')}
              />
              <p className="mt-1 text-sm text-gray-500">
                Separate tags with commas (e.g., premium, synthetic, high-performance)
              </p>
            </div>

            {/* Form Actions */}
            <div className="flex justify-end space-x-4 pt-6 border-t border-gray-200">
              <button
                type="button"
                onClick={() => navigate('/retailer/products')}
                className="btn-secondary"
              >
                Cancel
              </button>
              <button
                type="submit"
                disabled={isLoading}
                className="btn-primary disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {isLoading ? 'Updating Product...' : 'Update Product'}
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
};

export default EditProduct;

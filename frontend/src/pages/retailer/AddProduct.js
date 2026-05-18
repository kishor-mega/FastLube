import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useForm } from 'react-hook-form';
import { Plus, X, Upload, Package } from 'lucide-react';
import api from '../../api/client';
import toast from 'react-hot-toast';

const AddProduct = () => {
  const navigate = useNavigate();
  const [isLoading, setIsLoading] = useState(false);
  const [images, setImages] = useState([]);
  const [imageUrls, setImageUrls] = useState([]);

  const {
    register,
    handleSubmit,
    formState: { errors },
    reset
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

  const handleImageChange = (e) => {
    const files = Array.from(e.target.files);
    const newImages = [...images, ...files];
    setImages(newImages);

    // Create preview URLs
    const newUrls = files.map(file => URL.createObjectURL(file));
    setImageUrls([...imageUrls, ...newUrls]);
  };

  const removeImage = (index) => {
    const newImages = images.filter((_, i) => i !== index);
    const newUrls = imageUrls.filter((_, i) => i !== index);
    setImages(newImages);
    setImageUrls(newUrls);
  };

  const onSubmit = async (data) => {
    if (images.length === 0) {
      toast.error('Please upload at least one image');
      return;
    }

    setIsLoading(true);
    try {
      // Convert images to base64 for demo purposes
      // In production, you'd upload to a cloud service
      const imagePromises = images.map(file => {
        return new Promise((resolve) => {
          const reader = new FileReader();
          reader.onloadend = () => resolve(reader.result);
          reader.readAsDataURL(file);
        });
      });

      const base64Images = await Promise.all(imagePromises);

      const productData = {
        ...data,
        price: parseFloat(data.price),
        quantity: parseInt(data.quantity),
        images: base64Images,
        specifications: {
          weight: data.weight,
          dimensions: data.dimensions,
          material: data.material,
          compatibility: data.compatibility
        },
        tags: data.tags ? data.tags.split(',').map(tag => tag.trim()) : []
      };

      const response = await api.post('/api/products', productData);
      toast.success('Product created successfully!');
      navigate('/retailer/products');
    } catch (error) {
      console.error('Error creating product:', error);
      toast.error(error.response?.data?.message || 'Failed to create product');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="mb-8">
          <div className="flex items-center space-x-3 mb-4">
            <div className="w-10 h-10 bg-primary-100 rounded-lg flex items-center justify-center">
              <Package className="w-5 h-5 text-primary-600" />
            </div>
            <h1 className="text-3xl font-bold text-gray-900">Add New Product</h1>
          </div>
          <p className="text-gray-600">Create a new product listing for your inventory</p>
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
              <label className="form-label">
                Product Images *
              </label>
              <div className="border-2 border-dashed border-gray-300 rounded-lg p-6">
                <div className="text-center">
                  <Upload className="mx-auto h-12 w-12 text-gray-400" />
                  <div className="mt-4">
                    <label htmlFor="images" className="btn-primary cursor-pointer">
                      <Plus className="w-4 h-4 mr-2" />
                      Upload Images
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

              {/* Image Previews */}
              {imageUrls.length > 0 && (
                <div className="mt-4">
                  <h4 className="text-sm font-medium text-gray-700 mb-2">Uploaded Images:</h4>
                  <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                    {imageUrls.map((url, index) => (
                      <div key={index} className="relative group">
                        <img
                          src={url}
                          alt={`Preview ${index + 1}`}
                          className="w-full h-24 object-cover rounded-lg"
                        />
                        <button
                          type="button"
                          onClick={() => removeImage(index)}
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
                  <label htmlFor="weight" className="form-label">
                    Weight
                  </label>
                  <input
                    id="weight"
                    type="text"
                    className="input-field"
                    placeholder="e.g., 1.5 kg"
                    {...register('weight')}
                  />
                </div>

                <div>
                  <label htmlFor="dimensions" className="form-label">
                    Dimensions
                  </label>
                  <input
                    id="dimensions"
                    type="text"
                    className="input-field"
                    placeholder="e.g., 10 x 5 x 2 cm"
                    {...register('dimensions')}
                  />
                </div>

                <div>
                  <label htmlFor="material" className="form-label">
                    Material
                  </label>
                  <input
                    id="material"
                    type="text"
                    className="input-field"
                    placeholder="e.g., Steel, Aluminum"
                    {...register('material')}
                  />
                </div>

                <div>
                  <label htmlFor="compatibility" className="form-label">
                    Compatibility
                  </label>
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
              <label htmlFor="tags" className="form-label">
                Tags
              </label>
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
                {isLoading ? 'Creating Product...' : 'Create Product'}
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
};

export default AddProduct; 
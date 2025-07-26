import { useState, useEffect } from 'react';
import {
  getImages,
  uploadImage as uploadImageApi,
  deleteImage as deleteImageApi
} from '../utils/api';

export const useImages = () => {
  const [images, setImages] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const fetchImages = async () => {
    setLoading(true);
    try {
      const data = await getImages();
      setImages(data);
      setError(null);
    } catch (err) {
      setError(err.message || 'Failed to fetch images');
    }
    setLoading(false);
  };

  useEffect(() => {
    fetchImages();
  }, []);

  const uploadImage = async (imageData) => {
    const image = await uploadImageApi(imageData);
    setImages((prev) => [image, ...prev]);
    return image;
  };

  const deleteImage = async (id) => {
    await deleteImageApi(id);
    setImages((prev) => prev.filter((img) => img._id !== id));
  };

  return { images, loading, error, fetchImages, uploadImage, deleteImage };
};

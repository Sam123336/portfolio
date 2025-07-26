import { useState, useEffect } from 'react';
import axios from 'axios';
import {
  getMusic,
  uploadMusic as uploadMusicApi,
  deleteMusic as deleteMusicApi
} from '../utils/api';

export const useMusic = () => {
  const [musicList, setMusicList] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const fetchMusic = async () => {
    setLoading(true);
    try {
      const data = await getMusic();
      setMusicList(data);
      setError(null);
    } catch (err) {
      setError(err.message || 'Failed to fetch music');
    }
    setLoading(false);
  };

  useEffect(() => {
    fetchMusic();
  }, []);

  const uploadMusic = async (musicData) => {
    const music = await uploadMusicApi(musicData);
    setMusicList((prev) => [music, ...prev]);
    return music;
  };

  const deleteMusic = async (id) => {
    await deleteMusicApi(id);
    setMusicList((prev) => prev.filter((m) => m._id !== id));
  };

  return { musicList, loading, error, fetchMusic, uploadMusic, deleteMusic };
};

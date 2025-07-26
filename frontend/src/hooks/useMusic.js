import { useState, useEffect } from 'react';
import axios from 'axios';
import {
  getMusic,
  uploadMusic as uploadMusicApi,
  deleteMusic as deleteMusicApi,
  setDefaultMusic as setDefaultMusicApi
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

  const setDefaultMusic = async (id) => {
    const response = await setDefaultMusicApi(id);
    // Update the music list to reflect the new default
    setMusicList((prev) => prev.map((music) => ({
      ...music,
      isDefault: music._id === id
    })));
    return response;
  };

  return { musicList, loading, error, fetchMusic, uploadMusic, deleteMusic, setDefaultMusic };
};

import React, { createContext, useContext, useState, useRef, useCallback, useEffect } from 'react';
import { api } from '../utils/api'; // Assuming your api utility is correctly set up

const MusicContext = createContext();

export const useMusic = () => useContext(MusicContext);

export const MusicProvider = ({ children }) => {
  const [musicUrl, setMusicUrl] = useState(null);
  const [isPlaying, setIsPlaying] = useState(false);
  const audioRef = useRef(null);

  const fetchAndSetMusic = useCallback(async () => {
    try {
      const response = await api.get('/music/default');
      if (response.data && response.data.url) {
        setMusicUrl(response.data.url);
        return response.data.url;
      }
    } catch (error) {
      console.error('Failed to fetch default music:', error);
    }
    return null;
  }, []);

  const playMusic = useCallback(() => {
    if (audioRef.current) {
      audioRef.current.play().catch(e => console.error("Audio play failed:", e));
      setIsPlaying(true);
    }
  }, []);

  const stopMusic = useCallback(() => {
    if (audioRef.current) {
      audioRef.current.pause();
      audioRef.current.currentTime = 0;
      setIsPlaying(false);
    }
  }, []);

  const handleConsent = useCallback(async (consent) => {
    if (consent) {
      const url = await fetchAndSetMusic();
      if (url) {
        // We need to wait for the audio element to be rendered with the new src
        // The play logic will be handled in a useEffect within the provider
      }
    }
  }, [fetchAndSetMusic]);
  
  useEffect(() => {
    if (musicUrl && audioRef.current) {
      audioRef.current.src = musicUrl;
      playMusic();
    }
  }, [musicUrl, playMusic]);

  const value = {
    isPlaying,
    playMusic,
    stopMusic,
    handleConsent,
  };

  return (
    <MusicContext.Provider value={value}>
      {children}
      {musicUrl && <audio ref={audioRef} loop />}
    </MusicContext.Provider>
  );
};

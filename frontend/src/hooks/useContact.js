import { useState } from 'react';
import { sendContact as sendContactApi } from '../utils/api';

const useContact = () => {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const sendContact = async (form) => {
    setLoading(true);
    try {
      await sendContactApi(form);
      setError(null);
    } catch (err) {
      setError(err.message || 'Failed to send message');
    }
    setLoading(false);
  };

  return { sendContact, loading, error };
};

export default useContact;

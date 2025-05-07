'use client';

import { useState } from 'react';

export default function ClassificationForm() {
  const [text, setText] = useState('');
  const [result, setResult] = useState('');
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setResult('');

    try {
      const response = await fetch('http://localhost:5000/classify', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ text }),
      });

      if (!response.ok) {
        throw new Error('Failed to classify');
      }

      const data = await response.json();
      console.log(data);
      console.log(data.classification_result);
      setResult(data || 'No result returned');
    } catch (error) {
      setResult('Error: ' + error.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="p-4 max-w-md mx-auto">
      <form onSubmit={handleSubmit} className="space-y-4">
        <textarea
          className="w-full p-2 border border-gray-300 rounded"
          rows={6}
          placeholder="Paste news article here..."
          value={text}
          onChange={(e) => setText(e.target.value)}
          required
        />
        <button
          type="submit"
          className="w-full bg-blue-600 text-white py-2 px-4 rounded hover:bg-blue-700"
          disabled={loading}
        >
          {loading ? 'Classifying...' : 'Classify'}
        </button>
      </form>

      {result && (
        <div className="mt-4 p-3 bg-gray-100 border rounded text-center text-gray-800">
          <strong>News Type:</strong> {result.news_type}<br />
          {result.authenticity && (
            <>
              <strong>Authenticity:</strong> {result.authenticity}<br />
            </>
          )}
        </div>
      )}

    </div>
  );
}

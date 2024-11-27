import React, { useEffect, useState } from 'react';

const DocumentDetail = ({ documentId }) => {
  const [document, setDocument] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  useEffect(() => {
    const loadDocument = async () => {
      if (!documentId) return;

      setLoading(true);
      setError(null);

      try {
        const response = await fetch(`${process.env.REACT_BASE_URL}/api/documents/${documentId}`);
        
        if (!response.ok) {
          throw new Error('Document not found');
        }
        
        const data = await response.json();
        setDocument(data);
      } catch (err) {
        setDocument(null);
        setError(err.message || 'Something went wrong');
      } finally {
        setLoading(false);
      }
    };

    loadDocument();
  }, [documentId]);

  if (!documentId) {
    return <p className="text-center text-xl font-medium text-gray-500">Select a document to view details.</p>;
  }

  if (loading) {
    return <p className="text-center text-xl text-gray-500">Loading document...</p>;
  }

  if (error) {
    return <p className="text-center text-xl text-red-500">{error}</p>;  // Show error if there is any
  }

  return document ? (
    <div className="bg-gradient-to-r from-purple-600 to-blue-600 h-screen flex justify-center items-center">
      <div className="border border-gray-300 p-6 rounded-lg shadow-lg bg-white space-y-6 text-center max-w-lg w-full">
        <div className="text-2xl font-semibold text-purple-700">{document.name}</div>
        <div className="text-gray-500">
          <span className="font-medium text-gray-700">Created:</span> {new Date(document.created_at).toLocaleString()}
        </div>
        <div className="text-gray-700">
          <span className="font-medium text-gray-700">Content:</span>
          <div className="mt-2 p-4 bg-gray-100 rounded-md text-sm text-gray-800">
            {document.content}
          </div>
        </div>
      </div>
    </div>
  ) : (
    <p className="text-center text-xl font-medium text-gray-500">No document found.</p>
  );
};

export default DocumentDetail;

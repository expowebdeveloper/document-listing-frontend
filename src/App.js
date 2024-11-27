import React, { useState } from "react";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import DocumentList from "./Components/DocumentList";
import DocumentDetail from "./Components/DocumentDetail";
import DocumentForm from "./Components/DocumentForm";

function App() {
  const [documents, setDocuments] = useState([]);
  const [selectedDocument, setSelectedDocument] = useState(null);

  const addDocument = (newDocument) => {
    setDocuments([...documents, newDocument]);
  };


  return (
    <>
      <BrowserRouter>
        <Routes>
          <Route
            path="/"
            element={<DocumentList onSelect={setSelectedDocument} documents={documents} setDocuments={setDocuments} />}
          />
          <Route path="/add" element={<DocumentForm onAdd={addDocument} />} />
          <Route
            path="/detail"
            element={<DocumentDetail documentId={selectedDocument} />}
          />
        </Routes>
      </BrowserRouter>
    </>
  );
}

export default App;

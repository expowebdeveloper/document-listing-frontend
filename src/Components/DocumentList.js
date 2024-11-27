import React, { useState, useEffect, useMemo } from "react";
import { useTable, useSortBy } from "react-table";
import { useNavigate } from "react-router-dom";
import { BiSearch } from "react-icons/bi";
import { FaEye } from "react-icons/fa";
import { RiDeleteBin6Line } from "react-icons/ri";
import Modal from "./Modal";
import ReactPaginate from "react-paginate";

const DocumentList = ({ onSelect, documents, setDocuments }) => {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [search, setSearch] = useState("");
  const [debouncedSearch, setDebouncedSearch] = useState(search);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [documentToDelete, setDocumentToDelete] = useState(null);
  const [currentPage, setCurrentPage] = useState(0);
  const itemsPerPage = 10;

  const navigate = useNavigate();

  useEffect(() => {
    const timeoutId = setTimeout(() => {
      setDebouncedSearch(search);
    }, 500);

    return () => clearTimeout(timeoutId);
  }, [search]);

  useEffect(() => {
    const loadDocuments = async () => {
      setLoading(true);
      try {
        const apiUrl = debouncedSearch
          ? `${process.env.REACT_BASE_URL}/api/documents?search=${encodeURIComponent(debouncedSearch)}`
          : `${process.env.REACT_BASE_URL}/api/documents`;

        const response = await fetch(apiUrl);
        if (!response.ok) {
          throw new Error("Failed to fetch documents.");
        }
        const data = await response.json();
        setDocuments(data.documents);
      } catch (err) {
        setError("Failed to fetch documents.");
      } finally {
        setLoading(false);
      }
    };

    loadDocuments();
  }, [debouncedSearch, setDocuments]);

  const handleDelete = (id) => {
    setDocumentToDelete(id);
    setIsModalOpen(true);
  };

  const confirmDelete = async () => {
    try {
      const response = await fetch(`${process.env.REACT_BASE_URL}/api/documents/${documentToDelete}`, {
        method: 'DELETE',
      });

      if (!response.ok) {
        throw new Error("Failed to delete document.");
      }

      setDocuments(documents.filter((doc) => doc.id !== documentToDelete));
      setIsModalOpen(false);
    } catch (err) {
      setError("Failed to delete the document.");
    }
  };

  const cancelDelete = () => {
    setIsModalOpen(false);
  };

  const handleView = (id) => {
    onSelect(id);
    navigate("/detail");
  };

  const filteredDocuments = useMemo(
    () =>
      documents.filter((doc) =>
        doc.name.toLowerCase().includes(debouncedSearch.toLowerCase())
      ),
    [documents, debouncedSearch]
  );

  const handlePageChange = ({ selected }) => {
    setCurrentPage(selected);
  };

  const currentDocuments = useMemo(() => {
    const offset = currentPage * itemsPerPage;
    return filteredDocuments.slice(offset, offset + itemsPerPage);
  }, [filteredDocuments, currentPage]);

  const columns = useMemo(
    () => [
      {
        Header: "Name",
        accessor: "name",
      },
      {
        Header: "Created Date",
        accessor: "created_at",
        Cell: ({ value }) => new Date(value).toLocaleDateString(),
      },
      {
        Header: "Size (KB)",
        accessor: "size",
      },
      {
        Header: "Actions",
        id: "actions",
        Cell: ({ row }) => (
          <div className="space-x-2">
            <button
              onClick={() => handleView(row.original.id)}
              className="bg-blue-500 text-white p-2 rounded-full hover:bg-blue-600"
            >
              <FaEye />
            </button>
            <button
              onClick={() => handleDelete(row.original.id)}
              className="bg-red-500 text-white p-2 rounded-full hover:bg-red-600"
            >
              <RiDeleteBin6Line />
            </button>
          </div>
        ),
      },
    ],
    [onSelect, documents]
  );

  const tableInstance = useTable(
    {
      columns,
      data: currentDocuments,
      initialState: { sortBy: [{ id: "name", desc: false }] },
    },
    useSortBy
  );

  const { getTableProps, getTableBodyProps, headerGroups, rows, prepareRow } =
    tableInstance;

  return (
    <div className="bg-gradient-to-r from-purple-600 to-blue-600 min-h-screen flex flex-col">
      <div className="flex justify-between items-center p-6 bg-blue-700 text-white">
        <h1 className="text-3xl font-semibold">Document Management</h1>
        <button
          onClick={() => navigate("/add")}
          className="bg-green-500 px-4 py-2 text-white rounded-lg hover:bg-green-600"
        >
          Add Document
        </button>
      </div>

      <div className="p-6 flex-1">
        <div className="relative mb-4">
          <input
            type="text"
            placeholder="Search documents..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="p-3 rounded-lg w-full pl-10"
          />
          <BiSearch className="absolute top-4 left-3 text-gray-500 text-xl" />
        </div>

        {loading ? (
          <div className="flex justify-center items-center">
            <div className="w-10 h-10 rounded-full animate-spin" />
          </div>
        ) : error ? (
          <p className="text-red-500">{error}</p>
        ) : (
          <table
            {...getTableProps()}
            className="min-w-full bg-white shadow-md rounded-lg overflow-hidden"
          >
            <thead className="bg-gray-100">
              {headerGroups.map((headerGroup) => (
                <tr {...headerGroup.getHeaderGroupProps()}>
                  {headerGroup.headers.map((column) => (
                    <th
                      {...column.getHeaderProps(column.getSortByToggleProps())}
                      className="px-6 py-3 text-left font-medium text-gray-600 cursor-pointer"
                    >
                      {column.render("Header")}
                      <span>
                        {column.isSorted
                          ? column.isSortedDesc
                            ? " 🔽"
                            : " 🔼"
                          : ""}
                      </span>
                    </th>
                  ))}
                </tr>
              ))}
            </thead>
            <tbody {...getTableBodyProps()}>
              {rows.map((row) => {
                prepareRow(row);
                return (
                  <tr {...row.getRowProps()} className="hover:bg-gray-50">
                    {row.cells.map((cell) => (
                      <td {...cell.getCellProps()} className="px-6 py-3">
                        {cell.render("Cell")}
                      </td>
                    ))}
                  </tr>
                );
              })}
            </tbody>
          </table>
        )}
         <ReactPaginate
          previousLabel={"← Previous"}
          nextLabel={"Next →"}
          pageCount={Math.ceil(filteredDocuments.length / itemsPerPage)}
          onPageChange={handlePageChange}
          containerClassName={"flex justify-center mt-6"}
          pageClassName={"mx-2 p-2 cursor-pointer border"}
          activeClassName={"bg-blue-600 text-white"}
          previousClassName={"mx-2 p-2 cursor-pointer border"}
          nextClassName={"mx-2 p-2 cursor-pointer border"}
        />
      </div>

      <Modal
        isOpen={isModalOpen}
        onClose={cancelDelete}
        onConfirm={confirmDelete}
        documentName={documents.find((doc) => doc.id === documentToDelete)?.name}
      />
    </div>
  );
};

export default DocumentList;

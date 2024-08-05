import { useState, useEffect } from "react";
import axios from "axios";

const TableData = () => {
  const [data, setData] = useState([]);
  const [currentPage, setCurrentPage] = useState(1);
  const [itemsPerPage] = useState(10);
  const [searchTerm, setSearchTerm] = useState(""); // New state for search
  const [filteredData, setFilteredData] = useState([]);

  const fetchData = async () => {
    try {
      const response = await axios.get(import.meta.env.VITE_JAKARTA_TESTING);
      setData(response.data.data);
      setFilteredData(response.data.data);
    } catch (error) {
      console.error("Error fetching data:", error);
    }
  };

  useEffect(() => {
    fetchData();
  }, []);

  useEffect(() => {
    // Filter data based on search term
    const lowercasedSearchTerm = searchTerm.toLowerCase();
    const newFilteredData = data.filter(
      (item) =>
        item.question.toLowerCase().includes(lowercasedSearchTerm) ||
        item.answer.toLowerCase().includes(lowercasedSearchTerm) ||
        item.updated_answer.toLowerCase().includes(lowercasedSearchTerm) ||
        item.sites_url.some((url) =>
          url.toLowerCase().includes(lowercasedSearchTerm)
        )
    );
    setFilteredData(newFilteredData);
    setCurrentPage(1); // Reset to first page when search term changes
  }, [searchTerm, data]);

  // Get current items
  const indexOfLastItem = currentPage * itemsPerPage;
  const indexOfFirstItem = indexOfLastItem - itemsPerPage;
  const currentItems = filteredData.slice(indexOfFirstItem, indexOfLastItem);

  const paginate = (pageNumber) => setCurrentPage(pageNumber);

  return (
    <div className="container mx-auto px-4">
      {/* Search Input */}
      
      <div className="relative mb-4">
        <input
          type="text"
          color=""
          placeholder="Search..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          className="border border-purple-500 shadow-sm text-purple-500 rounded-md pl-10 pr-4 py-2 w-[300px]"
        />
        <svg
          className="absolute top-1/2 left-3 transform -translate-y-1/2 w-5 h-5 text-purple-500"
          fill="none"
          stroke="currentColor"
          viewBox="0 0 24 24"
          xmlns="http://www.w3.org/2000/svg"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth="2"
            d="M11 4a7 7 0 100 14 7 7 0 000-14zm0 14a7 7 0 01-7-7 7 7 0 0114 0 7 7 0 01-7 7z"
          />
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth="2"
            d="M21 21l-4.35-4.35"
          />
        </svg>
      </div>

      <div className="overflow-x-auto rounded">
        <table className="min-w-full">
          <thead className="bg-purple-700 border border-purple-700 text-white">
            <tr>
              <th className="py-3 px-4 border-b text-sm md:text-base">
                SL_No.
              </th>
              <th className="py-3 px-4 border-b text-sm md:text-base">
                Question
              </th>
              <th className="py-3 px-4 border-b text-sm md:text-base">
                Answer
              </th>
              <th className="py-3 px-4 border-b text-sm md:text-base">
                Sites_url
              </th>
              <th className="py-3 px-4 border-b text-sm md:text-base">
                Updated_answer
              </th>
            </tr>
          </thead>
          <tbody>
            {currentItems.map((item, index) => (
              <tr
                key={item.id}
                className="odd:bg-gray-100 even:bg-gray-200 hover:bg-blue-100 transition duration-200"
              >
                <td className="py-3 px-4 border-b text-sm md:text-base">
                  {index + 1}
                </td>
                <td className="py-3 px-4 border-b text-sm md:text-base">
                  {highlightSearchTerm(item.question, searchTerm)}
                </td>
                <td className="py-3 px-4 border-b text-sm md:text-base">
                  <TruncatedContent
                    content={item.answer}
                    searchTerm={searchTerm}
                  />
                </td>
                <td className="py-3 px-4 border-b text-sm md:text-base">
                  {item.sites_url.map((url, index) => (
                    <div key={index}>
                      <a
                        href={url}
                        className="text-blue-900 font-semibold hover:underline hover:text-red-500"
                        target="_blank"
                        rel="noopener noreferrer"
                      >
                        {highlightSearchTerm(url, searchTerm)}
                      </a>
                      {index < item.sites_url.length - 1 && <br />}
                    </div>
                  ))}
                </td>
                <td className="py-3 px-4 border-b text-sm md:text-base">
                  {highlightSearchTerm(item.updated_answer, searchTerm)}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
      <div className="flex justify-center mt-6">
        <Pagination
          itemsPerPage={itemsPerPage}
          totalItems={filteredData.length}
          paginate={paginate}
          currentPage={currentPage}
        />
      </div>
    </div>
  );
};

// eslint-disable-next-line react/prop-types
const TruncatedContent = ({ content, searchTerm }) => {
  const [isExpanded, setIsExpanded] = useState(false);

  // Ensure content is a string
  const safeContent = typeof content === "string" ? content : "";

  // // Highlight search term in content
  // const highlightedContent = highlightSearchTerm(safeContent, searchTerm);

  // Split content into words for truncation
  const words = safeContent.split(" ");
  const truncatedContent = words.slice(0, 20).join(" ");
  const fullContent = words.join(" ");

  return (
    <div>
      {isExpanded ? (
        <div>
          {highlightSearchTerm(fullContent, searchTerm)}
          <button
            onClick={() => setIsExpanded(false)}
            className="text-blue-500 hover:underline mt-2"
          >
            Show less
          </button>
        </div>
      ) : (
        <div>
          {highlightSearchTerm(truncatedContent, searchTerm)}...
          <button
            onClick={() => setIsExpanded(true)}
            className="text-blue-500 hover:underline mt-2"
          >
            Show more
          </button>
        </div>
      )}
    </div>
  );
};

// eslint-disable-next-line react/prop-types
const Pagination = ({ itemsPerPage, totalItems, paginate, currentPage }) => {
  const pageNumbers = [];

  for (let i = 1; i <= Math.ceil(totalItems / itemsPerPage); i++) {
    pageNumbers.push(i);
  }

  return (
    <nav>
      <ul className="flex flex-wrap justify-center gap-1">
        {pageNumbers.map((number) => (
          <li
            key={number}
            className={`${
              currentPage === number
                ? "bg-blue-500 text-white"
                : "bg-white text-blue-500"
            } px-2 py-1 text-xs sm:text-sm md:text-base border border-gray-300 cursor-pointer rounded-md hover:bg-blue-100 hover:text-blue-600 transition-colors`}
          >
            <a onClick={() => paginate(number)}>{number}</a>
          </li>
        ))}
      </ul>
    </nav>
  );
};

// Highlight search term utility function
const highlightSearchTerm = (text, searchTerm) => {
  if (!searchTerm) return text;
  const regex = new RegExp(`(${searchTerm})`, "gi");
  return text.split(regex).map((part, index) =>
    regex.test(part) ? (
      <mark key={index} className="bg-purple-900 p-1 rounded-full text-white ">
        {part}
      </mark>
    ) : (
      part
    )
  );
};

export default TableData;




import { useState, useEffect } from "react";
import axios from "axios";
import right from "../../assets/currenct-icon.png";
import wrong from "../../assets/wrong-icon.png";

const ScrapData = () => {
  const [data, setData] = useState([]);
  const [currentPage, setCurrentPage] = useState(1);
  const [itemsPerPage] = useState(10);
  const [searchTerm, setSearchTerm] = useState("");
  const [filteredData, setFilteredData] = useState([]);
  const [status, setStatus] = useState({});
  const [savePayload, setSavePayload] = useState([]);

  const saveApiCall = async () => {
    console.log(savePayload);
  
    try {
      const formData = new FormData();
      // Append the payload data to the FormData object
      savePayload.forEach(item => {
        formData.append('data[]', JSON.stringify(item));
        console.log(formData)
      });
      
      
      const saveResponse = await axios.post(
        "https://inspireddashboard.pharynxai.in/scrape_data/scrapping/update",
        formData,
        {
          headers: {
            'Content-Type': 'multipart/form-data',
          },
        }
      );
      console.log(saveResponse.data);
      alert(saveResponse.data)

    } catch (error) {
      console.error("Error saving data:", error);
    }
  };
  
  const handleStatusChange = (itemId, statusType) => {
    const updatedPayload = [...savePayload];
    const existingIndex = updatedPayload.findIndex(
      (payloadItem) => payloadItem.id === itemId
    );
    
    if (existingIndex >= 0) {
      updatedPayload[existingIndex] = { id: itemId, status: statusType };
    } else {
      updatedPayload.push({ id: itemId, status: statusType });
    }
  
    setSavePayload(updatedPayload);
    setStatus((prevStatus) => ({
      ...prevStatus,
      [itemId]: statusType,
    }));
    saveApiCall();
  };
  
  const fetchData = async () => {
    try {
      const response = await axios.get(
        "https://inspireddashboard.pharynxai.in/scrape_data/scrapping/get"
      );
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
    const lowercasedSearchTerm = searchTerm.toLowerCase();
    const newFilteredData = data.filter((item) =>
      item.question.toLowerCase().includes(lowercasedSearchTerm) ||
      item.answer.toLowerCase().includes(lowercasedSearchTerm) ||
      item.updated_answer.toLowerCase().includes(lowercasedSearchTerm) ||
      item.url.toLowerCase().includes(lowercasedSearchTerm) ||
      item.sites_url.some((url) => url.toLowerCase().includes(lowercasedSearchTerm))
    );
    setFilteredData(newFilteredData);
    setCurrentPage(1);
  }, [searchTerm, data]);

  const indexOfLastItem = currentPage * itemsPerPage;
  const indexOfFirstItem = indexOfLastItem - itemsPerPage;
  const currentItems = filteredData.slice(indexOfFirstItem, indexOfLastItem);

  const paginate = (pageNumber) => setCurrentPage(pageNumber);

  return (
    <div className="bg-gradient-to-r mt-1 h-full from-blue-100 to-blue-400 rounded-lg shadow-xl p-6">
      <div className="container mx-auto px-4">
        <div className="flex justify-between">
          <div className="relative mb-4">
            <input
              type="text"
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

          {/* <div>
            <button
              onClick={saveApiCall}
              className="bg-purple-900 text-white py-2 px-4 rounded-md hover:bg-yellow-600 focus:outline-none focus:ring-2 focus:ring-green-400 font-bold"
            >
              Save
            </button>
          </div> */}
          
        </div>

        <div className="overflow-x-auto rounded justify-center items-center max-h-[calc(100vh-250px)]">
          <table className="min-w-full">
            <thead className="bg-purple-700 border border-purple-700 text-white">
              <tr>
                <th className="py-3 px-4 border-b text-sm md:text-base">SL_No.</th>
                <th className="py-3 px-4 border-b text-sm md:text-base">Question</th>
                <th className="py-3 px-4 border-b text-sm md:text-base">Answer</th>
                {/* <th className="py-3 px-4 border-b text-sm md:text-base">Url</th> */}
                <th className="py-3 px-4 border-b text-sm md:text-base">Site_url</th>
                <th className="py-3 px-4 border-b text-sm md:text-base">Updated Answer</th>
                <th className="py-3 px-4 border-b text-sm md:text-base">Status</th>
              </tr>
            </thead>
            <tbody>
              {currentItems.map((item, index) => (
                <tr
                key={item.id}
                className={`odd:bg-gray-100 even:bg-gray-200 hover:bg-blue-100 text-center transition duration-200 ${
                  status[item.id] === "right"
                    ? "bg-green-100"
                    : status[item.id] === "wrong"
                    ? "bg-red-100"
                    : ""
                }`}
              >
                  <td className="py-3 px-4 border-b text-center text-sm md:text-base">
                    {item.id}
                  </td>
                  <td className="py-3 px-4 border-b text-sm md:text-base">
                    <TruncatedContent content={item.question} searchTerm={searchTerm} />
                  </td>
                  <td className="py-3 px-4 border-b text-sm md:text-base">
                    <TruncatedContent content={item.answer} searchTerm={searchTerm} />
                  </td>
                  {/* <td className="py-3 px-4 border-b text-sm md:text-base">
                    <a
                      href={item.url}
                      className="text-blue-900 font-semibold hover:underline hover:text-red-500"
                      target="_blank"
                      rel="noopener noreferrer"
                    >
                      {item.url}
                    </a>
                  </td> */}
                  <td className="py-3 px-4 border-b text-sm md:text-base">
                    {item.sites_url.map((url, index) => (
                      <div key={index}>
                        <a
                          href={url}
                          className="text-blue-900 font-semibold hover:underline hover:text-red-500"
                          target="_blank"
                          rel="noopener noreferrer"
                        >
                          {url}
                        </a>
                      </div>
                    ))}
                  </td>
                  <td className="py-3 px-4 border-b text-sm md:text-base">
                    <TruncatedContent content={item.updated_answer} searchTerm={searchTerm} />
                  </td>
                  <td className="py-3 px-4 border-b flex justify-center items-center text-sm md:text-base">
        {item.updated_answer && (
          <div className="flex space-x-5">
            <button
            
              onClick={() => handleStatusChange(item.id, "yes")}
              className={`bg-white py-1 px-3 rounded-full hover:bg-gray-200 focus:outline-none focus:ring-2 ${
                status[item.staus] === "yes"
                  ? "border-green-400"
                  : "border-transparent"
              }`}
            >
              <img src={right} alt="" className="w-4 h-4" />
            </button>
            <button
              onClick={() => handleStatusChange(item.id, "no")}
              className={`bg-white py-1 px-3 rounded-full hover:bg-gray-200 focus:outline-none focus:ring-2 ${
                status[item.status] === "no"
                  ? "border-red-400"
                  : "border-transparent"
              }`}
            >
              <img src={wrong} alt="" className="w-4 h-4" />
            </button>
          </div>
        )}
      </td>
                </tr>
              ))}
            </tbody>
          </table>
          <div className="fixed bottom-5 justify-center items-center">
            <Pagination
              itemsPerPage={itemsPerPage}
              totalItems={filteredData.length}
              paginate={paginate}
              currentPage={currentPage}
            />
          </div>
        </div>
      </div>
    </div>
  );
};

const TruncatedContent = ({ content, searchTerm }) => {
  const [isExpanded, setIsExpanded] = useState(false);
  const safeContent = typeof content === "string" ? content : "";
  const words = safeContent.split(" ");
  const truncatedContent =
    words.slice(0, 20).join(" ") + (words.length > 20 ? "..." : "");
  const fullContent = words.join(" ");

  return (
    <div>
      {isExpanded ? (
        <div>
          {highlightSearchTerm(fullContent, searchTerm)}
          <button
            className="ml-2 text-purple-700 hover:underline"
            onClick={() => setIsExpanded(false)}
          >
            Show less
          </button>
        </div>
      ) : (
        <div className="truncated-content">
          {highlightSearchTerm(truncatedContent, searchTerm)}
          {words.length > 20 && (
            <button
              className="ml-2 text-purple-700 hover:underline"
              onClick={() => setIsExpanded(true)}
            >
              Show more
            </button>
          )}
        </div>
      )}
    </div>
  );
};

const highlightSearchTerm = (text, searchTerm) => {
  if (!searchTerm) return text;

  const regex = new RegExp(`(${searchTerm})`, "gi");
  const parts = text.split(regex);

  return parts.map((part, index) =>
    regex.test(part) ? (
      <mark key={index} className="bg-yellow-300">
        {part}
      </mark>
    ) : (
      part
    )
  );
};

const Pagination = ({ itemsPerPage, totalItems, paginate, currentPage }) => {
  const pageNumbers = [];
  for (let i = 1; i <= Math.ceil(totalItems / itemsPerPage); i++) {
    pageNumbers.push(i);
  }

  return (
    <nav>
      <ul className="pagination flex space-x-4">
        {pageNumbers.map((number) => (
          <li key={number} className="page-item">
            <button
              onClick={() => paginate(number)}
              className={`page-link ${
                number === currentPage
                  ? "bg-purple-700 text-white"
                  : "bg-white text-purple-700"
              } py-2 px-4 rounded-md hover:bg-purple-900 hover:text-white focus:outline-none focus:ring-2`}
            >
              {number}
            </button>
          </li>
        ))}
      </ul>
    </nav>
  );
};

export default ScrapData;

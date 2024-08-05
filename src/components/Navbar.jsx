import { Link } from "react-router-dom";

const Navbar = () => {
  return (
    <nav className="bg-gray-800 p-4 w-full fixed ">
      <div className="container mx-auto flex items-center gap-20">
        <div className="text-white text-2xl font-bold">
          <Link to="/">SCRAPED DATA</Link>
        </div>

        {/* <div>
          <Link to="/" className="text-gray-300 font-semibold hover:bg-gray-700 hover:text-white px-3 py-2 rounded-md">
            Home
          </Link>
          <Link to="/scrap-data" className="text-gray-300 font-semibold hover:bg-gray-700 hover:text-white px-3 py-2 rounded-md">
            Scrap Data
          </Link>
        </div> */}
        
      </div>
    </nav>
  );
};

export default Navbar;

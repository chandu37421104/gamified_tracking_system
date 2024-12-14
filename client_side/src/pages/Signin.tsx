
import { useState } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import { useAuth } from "../context/AuthContext"; // Import AuthContext
import { Link } from "react-router-dom";

const API_BASE_URL = process.env.REACT_APP_API_URL || "http://localhost:5000/api";

export const Signin = () => {
  const navigate = useNavigate(); // Use navigate for programmatic navigation
  const { login } = useAuth(); // Get login function from AuthContext
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState<string | null>(null);

  const handleSigninClick = async () => {
    setError(null); // Clear previous errors

    try {
      // API request to login
      const response = await axios.post(`${API_BASE_URL}/auth/login`, {
        email,
        password,
      });

      const { token, user } = response.data;

      // Save the token and user data using AuthContext
      login(user, token);

      // Redirect user based on role
      switch (user.role) {
        case "student":
          navigate("/dashboard");
          break;
        case "faculty":
          navigate("/facultydashboard");
          break;
        case "PI":
          navigate("/pidashboard");
          break;
        case "admin":
          navigate("/admindashboard");
          break;
        default:
          navigate("/");
          break;
      }
    } catch (err) {
      setError("Invalid email or password");
    }
  };

  return (
    <div className="h-screen flex justify-center flex-col bg-white">
      <div className="flex justify-center">
        <div className="w-full max-w-md px-8">
          {/* Header Section */}
          <div className="flex flex-col items-center mb-8">
            <img
              src="https://dxbhsrqyrr690.cloudfront.net/sidearm.nextgen.sites/beaconsathletics.com/responsive_2020/images/svgs/logo_main.svg"
              className="h-24"
              alt="University of Massachusetts Boston"
            />
            <h1 className="text-2xl font-semibold text-center text-gray-900">
              University of Massachusetts Boston
            </h1>
          </div>

          {/* Error Message */}
          {error && (
            <div className="mb-4 text-red-500 text-sm text-center">{error}</div>
          )}

          {/* Sign-In Form */}
          <div>
            <label className="block mb-2 text-sm text-black font-semibold pt-4">
              Username
            </label>
            <input
              type="text"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5"
              placeholder="email@umb.edu"
              required
            />

            <label className="block mb-2 text-sm text-black font-semibold pt-4">
              Password
            </label>
            <input
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5"
              placeholder="password"
              required
            />

            {/* Forgot Password Link */}
            <div className="flex items-center justify-between mt-4">
              <Link to="/forgotpassword" className="text-blue-500 hover:underline">
                Forgot your password?
              </Link>
            </div>

            {/* Sign-In Button */}
            <button
              type="button"
              onClick={handleSigninClick}
              className="mt-8 w-full text-white bg-gray-800 hover:bg-gray-900 focus:outline-none focus:ring-4 focus:ring-gray-300 font-medium rounded-lg text-sm px-5 py-2.5 me-2 mb-2"
            >
              Sign In
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Signin;

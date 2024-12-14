
import { useState } from "react";
import { Link } from "react-router-dom";
import axios from "axios";

const API_BASE_URL = process.env.REACT_APP_API_URL || "http://localhost:5000/api";

export const ForgotPassword = () => {
  const [email, setEmail] = useState("");
  const [successMessage, setSuccessMessage] = useState("");
  const [errorMessage, setErrorMessage] = useState("");
  const [loading, setLoading] = useState(false);

  // Handle form submission
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setSuccessMessage("");
    setErrorMessage("");

    try {
      await axios.post(`${API_BASE_URL}/auth/reset-password`, { email });
      setSuccessMessage("A reset link has been sent to your email address.");
      setEmail(""); // Clear the input field after successful submission
    } catch (error: any) {
      setErrorMessage(
        error.response?.data?.error || "Failed to send reset link. Please try again."
      );
    } finally {
      setLoading(false);
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

          {/* Form Section */}
          <div className="pt-4">
            <form onSubmit={handleSubmit}>
              <div>
                <label className="block mb-2 text-sm text-black font-semibold">
                  Email Address
                </label>
                <input
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5"
                  placeholder="email@umb.edu"
                  required
                />
              </div>

              {/* Display Success or Error Message */}
              {successMessage && (
                <p className="text-green-500 text-sm mt-2">{successMessage}</p>
              )}
              {errorMessage && (
                <p className="text-red-500 text-sm mt-2">{errorMessage}</p>
              )}

              {/* Submit Button */}
              <button
                type="submit"
                className={`mt-8 w-full text-white bg-gray-800 hover:bg-gray-900 focus:outline-none focus:ring-4 focus:ring-gray-300 font-medium rounded-lg text-sm px-5 py-2.5 mb-2 ${
                  loading ? "opacity-50 cursor-not-allowed" : ""
                }`}
                disabled={loading}
              >
                {loading ? "Sending..." : "Send Reset Link"}
              </button>
            </form>

            {/* Back to Sign In */}
            <Link to="/signin">
              <p className="text-blue-500 text-center mt-4 hover:underline">
                Back to Sign In
              </p>
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
};

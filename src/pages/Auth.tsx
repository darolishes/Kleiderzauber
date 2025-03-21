import React, { useState, useEffect } from "react";
import { useNavigate, useSearchParams } from "react-router-dom";
import { useAuthStore } from "../store/authStore";
import { LoginForm, RegisterForm } from "../components/auth";

type AuthTab = "login" | "register";

const Auth: React.FC = () => {
  const [searchParams] = useSearchParams();
  const [activeTab, setActiveTab] = useState<AuthTab>("login");
  const navigate = useNavigate();
  const { user, isLoading } = useAuthStore();

  useEffect(() => {
    // Check if tab is specified in URL
    const tab = searchParams.get("tab") as AuthTab;
    if (tab && (tab === "login" || tab === "register")) {
      setActiveTab(tab);
    }
  }, [searchParams]);

  useEffect(() => {
    if (user) {
      navigate("/wardrobe");
    }
  }, [user, navigate]);

  if (isLoading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-indigo-600"></div>
      </div>
    );
  }

  return (
    <div className="min-h-screen flex items-center justify-center py-12 px-4 sm:px-6 lg:px-8 bg-gray-50">
      <div className="max-w-md w-full space-y-8">
        <div>
          <h1 className="text-3xl font-extrabold text-center text-gray-900">
            Kleiderzauber
          </h1>
          <p className="mt-2 text-center text-sm text-gray-600">
            Your virtual wardrobe app
          </p>
        </div>

        <div className="bg-white shadow-md rounded-lg overflow-hidden">
          <div className="flex border-b">
            <button
              className={`flex-1 py-3 px-4 text-center font-medium ${
                activeTab === "login"
                  ? "text-indigo-600 border-b-2 border-indigo-600"
                  : "text-gray-500 hover:text-gray-700"
              }`}
              onClick={() => setActiveTab("login")}
            >
              Log In
            </button>
            <button
              className={`flex-1 py-3 px-4 text-center font-medium ${
                activeTab === "register"
                  ? "text-indigo-600 border-b-2 border-indigo-600"
                  : "text-gray-500 hover:text-gray-700"
              }`}
              onClick={() => setActiveTab("register")}
            >
              Register
            </button>
          </div>

          <div className="p-6">
            {activeTab === "login" ? <LoginForm /> : <RegisterForm />}
          </div>
        </div>

        <div className="text-center mt-4">
          <p className="text-sm text-gray-600">
            {activeTab === "login" ? (
              <>
                Don't have an account?{" "}
                <button
                  className="text-indigo-600 hover:text-indigo-800 font-medium"
                  onClick={() => setActiveTab("register")}
                >
                  Register
                </button>
              </>
            ) : (
              <>
                Already have an account?{" "}
                <button
                  className="text-indigo-600 hover:text-indigo-800 font-medium"
                  onClick={() => setActiveTab("login")}
                >
                  Log In
                </button>
              </>
            )}
          </p>
        </div>
      </div>
    </div>
  );
};

export default Auth;

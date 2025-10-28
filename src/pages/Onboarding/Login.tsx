import { useNavigate } from "react-router-dom";
import HeaderNav from "../../components/Partials/HeaderNav";

export default function Login() {
    const navigate = useNavigate();

    return (
        <div className="font-montserrat min-h-screen bg-white flex flex-col">
        {/* Header */}
        <div className="px-2 bg-white">
            <HeaderNav title="" backRoute="/" />
        </div>

        {/* Main content */}
        <div className="flex-grow flex flex-col p-5 px-8 bg-white">
            <h1 className="text-4xl font-extrabold text-black">Katcha Chill</h1>
            <p className="text-lg font-medium text-gray-800">stay consistent with ease</p>

            {/* Toggle Buttons */}
            <div className="flex gap-2 mt-5">
                <button className="bg-black text-white px-4 py-3 rounded-full font-normal text-base">Login</button>
                <button className="bg-gray-200 text-black px-4 py-3 rounded-full font-normal text-base">Sign Up</button>
            </div>

            {/* Input Fields */}
            <div className="text-left space-y-4 mt-6">
                <div>
                    <label className="block text-sm font-semibold text-gray-700">Email</label>
                    <input
                    type="text"
                    placeholder="Enter your email..."
                    className="w-full border border-gray-300 rounded-lg px-3 py-2 mt-1 focus:ring-2 focus:ring-black focus:outline-none"
                    />
                </div>

                <div>
                    <label className="block text-sm font-semibold text-gray-700">Password</label>
                    <input
                    type="password"
                    placeholder="Enter your password..."
                    className="w-full border border-gray-300 rounded-lg px-3 py-2 mt-1 focus:ring-2 focus:ring-black focus:outline-none"
                    />
                </div>

                <div className="text-right">
                    <a href="#" className="text-sm text-gray-600 hover:underline">
                    Forgot Password?
                    </a>
                </div>
            </div>

            {/* Login Button */}
            <button
                onClick={() => navigate("/home")}
                className="w-full bg-black text-white py-3 rounded-lg font-medium my-9 text-base"
            >
                Login
            </button>

            {/* Sign Up */}
            <p className="text-sm text-black mt-6 text-center">
                Don't have an account?{" "}
                <a href="#" className="font-bold text-black hover:underline">
                    Sign up.
                </a>
            </p>
            </div>

            {/* Footer (sticks to bottom) */}
            <footer className="text-xs text-black text-center px-8 py-4">
                By continuing, you agree to our{" "}
                <a href="#" className="underline font-bold">
                Terms of Service
                </a>{" "}
                and{" "}
                <a href="#" className="underline font-bold">
                Privacy Policy
                </a>
                .
            </footer>
        </div>
    );
}

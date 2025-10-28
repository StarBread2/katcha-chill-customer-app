import { useNavigate } from "react-router-dom";
import { supabase } from "../../lib/supabaseClient"; // ✅ import this
import { KatchaChillLogo_Image, Google_Icon } from "../../assets/index.ts";

export default function Onboarding1() {
    const navigate = useNavigate();

    const handleGoogleLogin = async () => {
        // const { data, error } = await supabase.auth.signInWithOAuth({
        const { error } = await supabase.auth.signInWithOAuth({
        provider: "google",
        options: {
            redirectTo: `${window.location.origin}/home`, // redirect after successful login
        },
        });

        if (error) {
        console.error("Error signing in with Google:", error.message);
        alert("Failed to sign in with Google");
        }
    };

    return (
        <div className="font-montserrat flex flex-col items-center justify-center h-screen px-8 bg-white space-y-10">
        {/* 🔹 Top Section - Logo + Text */}
        <div className="w-full flex flex-col justify-start px-2">
            <img
            src={KatchaChillLogo_Image}
            alt="Katcha Chill Logo"
            className="w-[100px] h-[100px] max-w-[40vw] -ml-2 mb-3"
            />
            <div className="text-left w-[90%]">
            <h1 className="text-5xl font-bold leading-[1.1] text-black">
                smarter check-ins clearer progress
            </h1>
            <p className="text-lg font-normal text-black mt-4 leading-[1.5]">
                Hassle-free gym access with your stats in one place
            </p>
            </div>
        </div>

        {/* 🔹 Bottom Section - Button */}
        <div className="w-full flex justify-center">
            <button
            onClick={handleGoogleLogin} // ✅ Supabase OAuth login
            className="w-full inline-flex items-center justify-center gap-3 bg-white text-black text-lg font-medium py-2 rounded-full border border-black hover:bg-gray-50 active:scale-[0.98] transition-all"
            >
            <img src={Google_Icon} alt="Google Icon" className="w-5 h-5" />
            <span>Continue with Google</span>
            </button>
        </div>
        </div>
    );
}

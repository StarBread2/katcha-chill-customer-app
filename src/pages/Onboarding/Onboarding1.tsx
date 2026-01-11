import { useNavigate } from "react-router-dom";
import { supabase } from "../../lib/supabaseClient"; // ✅ import this
import { KatchaChillLogo_Image, Google_Icon, Facebook_Icon } from "../../assets/assets.ts";

export default function Onboarding1() {
    const navigate = useNavigate();

    const handleGoogleLogin = async () => 
    {
        const { error } = await supabase.auth.signInWithOAuth({
            provider: "google",
            options: {
                redirectTo: `${window.location.origin}/home`, // redirect after successful login
                queryParams: {
                    prompt: "select_account",
                },
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
            <div className="w-full flex flex-col gap-2 justify-center">
                <button
                    onClick={handleGoogleLogin}
                    className="w-full inline-flex items-center gap-6 bg-white py-2 pl-4 rounded-full border border-black
                        text-black text-base font-medium"
                >
                    <img src={Google_Icon} alt="Google Icon" className="w-5 h-5 ml-2" />
                    <span>Continue with Google</span>
                </button>

                {/* <button
                    className="w-full inline-flex items-center gap-5 bg-white py-2 pl-4 rounded-full border border-black
                        text-black text-bs font-medium"
                >
                    <img src={Facebook_Icon} alt="Google Icon" className="w-8 h-8" />
                    <span>Continue with Facebook</span>
                </button> */}
            </div>
        </div>
    );
}

import HeaderNav from "../components/Partials/HeaderNav";
import FooterButton from "../components/Partials/FooterButton.tsx";
import { Download_Icon } from "../assets/index.ts"; 
import MainDisplay_AddCredits from "../components/Add Credits/MainDisplay.tsx";

import { useUser } from "../context/UserContext";

export default function AddCredits() {
    const { qrDataUrl } = useUser();

    return (
        <div className="min-h-screen bg-white">
            <HeaderNav title="Credits" backRoute="/home" />

            <MainDisplay_AddCredits />

            <FooterButton
                icon={Download_Icon}
                label="Download QR"
                downloadDataUrl={qrDataUrl}
                downloadFilename="my-qr-code.png"
            />
        </div>
    );
}
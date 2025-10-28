import HeaderNav from "../components/Partials/HeaderNav";
import FooterButton from "../components/Partials/FooterButton.tsx";
import { Download_Icon } from "../assets/index.ts"; 
import MainDisplay_CheckIn from "../components/Check In/MainDisplay.tsx";

import { useUser } from "../context/UserContext";

export default function CheckIn() {
    const { qrDataUrl } = useUser();

    return (
        <div className="min-h-screen bg-white">
            <HeaderNav title="Check-in" backRoute="/home" />

            <MainDisplay_CheckIn />

            <FooterButton
                icon={Download_Icon}
                label="Download QR"
                downloadDataUrl={qrDataUrl}
                downloadFilename="my-qr-code.png"
            />
        </div>
    );
}
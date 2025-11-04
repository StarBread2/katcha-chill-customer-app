import React from "react";
import "../../styles/PageTransition.css";

interface PageTransitionProps {
    children: React.ReactNode;
    type?: "fade" | "slide-left" | "slide-right" | "slide-up";
}

export default function PageTransition(
{
    children,
    type = "fade",
}:
    PageTransitionProps): React.ReactElement {
    return <div className={`page-transition ${type}`}>{children}</div>;
}

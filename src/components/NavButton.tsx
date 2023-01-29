import { IonButton, IonMenuButton } from "@ionic/react";
import React, { useEffect } from "react";

export const NavButton: React.FC = () => {
    const [mQuery, setMQuery] = React.useState<any>({
        matches: window.innerWidth > 768 ? true : false,
    });

    const ua = window.navigator.userAgent;
    const iOS = !!ua.match(/iPad/i) || !!ua.match(/iPhone/i);
    // const webkit = !!ua.match(/WebKit/i);s

    useEffect(() => {
        let mediaQuery = window.matchMedia("(min-width: 768px)");
        if (iOS) {
            mediaQuery.addListener(setMQuery)
        } else {
            mediaQuery.addEventListener('change', setMQuery);
        }

        return () => {
            if (iOS) {
                mediaQuery.removeListener(setMQuery)
            } else {
                mediaQuery.removeEventListener('change', setMQuery)
            }
        };
    }, []);

    // MediaQueryListEvent { isTrusted: true, media: "(min-width: 768px)", matches: true ...}
    // console.log(mQuery.matches);
    return (
        <>
            <IonMenuButton />
        </>
    );
};
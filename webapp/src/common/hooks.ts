/**
 * @desc customized hooks.
 */
import React, {useEffect} from "react";

// From https://www.jayfreestone.com/writing/react-portals-with-hooks/
export function usePortal(id: string): HTMLDivElement {
    const rootElemRef = React.useRef(document.createElement('div'));

    useEffect(function setupElement() {
        // Look for existing target dom element to append to
        const parentElem = document.querySelector(`#${id}`);
        // Add the detached element to the parent
        if (parentElem) parentElem.appendChild(rootElemRef.current);
        // This function is run on unmount
        return function removeElement() {
            rootElemRef.current.remove();
        };
    }, []);

    return rootElemRef.current;
}


import {createBrowserHistory} from "history";

/**
 * @desc helper functions.
 */

const browserHistory = createBrowserHistory();

// From https://stackoverflow.com/questions/39501289/in-reactjs-how-to-copy-text-to-clipboard
export const copyToClipboard = (text: string): void => {
    const textField = document.createElement('textarea')
    textField.innerText = text
    document.body.appendChild(textField)
    if (window.navigator.platform === 'iPhone') {
        textField.setSelectionRange(0, 99999)
    } else {
        textField.select()
    }
    document.execCommand('copy')
    textField.remove()
}

export {browserHistory}

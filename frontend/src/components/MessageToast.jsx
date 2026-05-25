import { useContext } from "react";
import { AppContext } from "../context/appContextObject";

const MessageToast = () => {
    const { message, clearMessage } = useContext(AppContext);

    if (!message?.text) return null;

    return (
        <div className={`message-toast ${message.type}`}>
            <span>{message.text}</span>
            <button type="button" onClick={clearMessage}>x</button>
        </div>
    );
};

export default MessageToast;

import { useState } from "react";
import "./Navbar.css";
import { useFlowStore } from "../store/flowStore";

export default function Navbar() {
  const [showMessage, setShowMessage] = useState(false);
  const [messageType, setMessageType] = useState<"error" | "success">("error");
  const [messageText, setMessageText] = useState("");

  // Get validation function from Zustand store
  const validateFlow = useFlowStore((state) => state.validateFlow);

  const handleSave = () => {
    // Use Zustand store's validation logic
    const validation = validateFlow();

    if (validation.isValid) {
      // Show success message
      setMessageType("success");
      setMessageText("Flow saved successfully!");
      setShowMessage(true);

      console.log("Flow saved successfully!");
    } else {
      // Show error message
      setMessageType("error");
      setMessageText(validation.error || "Cannot save Flow");
      setShowMessage(true);
    }

    // Hide the message after 3 seconds
    setTimeout(() => setShowMessage(false), 3000);
  };

  return (
    <div className="navbar">
      {showMessage && (
        <div
          className={`message ${
            messageType === "error" ? "error-message" : "success-message"
          }`}
        >
          {messageText}
        </div>
      )}

      <div className="navbar-content">
        <div className="navbar-left">
          {/* Future: Add logo or title here */}
        </div>

        <div className="navbar-right">
          <button className="save-button" onClick={handleSave}>
            Save Changes
          </button>
        </div>
      </div>
    </div>
  );
}

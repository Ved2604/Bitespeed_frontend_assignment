import { useState } from "react";
import "./Navbar.css";

export default function Navbar() {
  const [showError, setShowError] = useState(false);

  const handleSave = () => {
    setShowError(true);
    // Hide the error after 3 seconds
    setTimeout(() => setShowError(false), 3000);
  };

  return (
    <div className="navbar">
      {showError && <div className="error-message">Cannot save Flow</div>}

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

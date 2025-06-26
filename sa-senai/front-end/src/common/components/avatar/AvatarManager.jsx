// src/common/components/avatar/AvatarManager.jsx
import React, { useState } from "react";
import PropTypes from "prop-types";
import "./AvatarManager.css";

export default function AvatarManager({ userId, initialUrl, userName, onUpdate }) {
  const [avatarUrl, setAvatarUrl] = useState(initialUrl);
  const [file, setFile]           = useState(null);
  const [error, setError]         = useState("");

  const handleFileChange = (e) => {
    setFile(e.target.files[0]);
    setError("");
  };

  const handleUpload = async () => {
    if (!file) return setError("Selecione um arquivo");
    const form = new FormData();
    form.append("avatar", file);
  
    try {
      const res = await fetch(`http://localhost:3001/clientes/${userId}/avatar`, {
        method: "POST",
        body: form,       // sem headers
      });
      if (!res.ok) throw new Error(`Status ${res.status}`);
      const { avatarUrl: url } = await res.json();
      setAvatarUrl(url);
      onUpdate({ avatar_url: url });
    } catch (err) {
      console.error("Front Upload Error:", err);
      setError("Erro ao enviar avatar");
    }
  };
  const API = import.meta.env.VITE_API_URL || "http://localhost:3001";
  return (
    <div className="avatar-manager">
      {avatarUrl 
        ? <img
        className="avatar-img"
        src={`${API}${avatarUrl}`}
        alt={userName}
      />
        : <div className="avatar-fallback">
            {userName.split(" ").map(w => w[0]).join("").slice(0,2).toUpperCase()}
          </div>
      }
      <div className="am-upload">
        <input type="file" accept="image/*" onChange={handleFileChange} />
        <button onClick={handleUpload}>Enviar Avatar</button>
        {error && <p className="error">{error}</p>}
      </div>
    </div>
  );
}

AvatarManager.propTypes = {
  userId:     PropTypes.oneOfType([PropTypes.string,PropTypes.number]).isRequired,
  initialUrl: PropTypes.string,
  userName:   PropTypes.string.isRequired,
  onUpdate:   PropTypes.func
};

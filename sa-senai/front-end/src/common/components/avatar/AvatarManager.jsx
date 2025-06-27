// src/common/components/avatar/AvatarManager.jsx
import React, { useEffect, useState } from "react";
import PropTypes               from "prop-types";
import "./AvatarManager.css";

export default function AvatarManager({
  userId,
  initialUrl,
  userName,
  onUpdate
}) {
  const API = import.meta.env.VITE_API_URL || "http://localhost:3001";

  const [avatarUrl, setAvatarUrl]  = useState(initialUrl);
  const [showUpload, setShowUpload] = useState(false);
  const [file, setFile]            = useState(null);
  const [error, setError]          = useState("");

  // sempre que mudar initialUrl, atualiza o state interno
  useEffect(() => {
    setAvatarUrl(initialUrl);
  }, [initialUrl]);

  const handleFileChange = (e) => {
    setFile(e.target.files[0]);
    setError("");
  };

  const handleUpload = async () => {
    if (!file) {
      setError("Selecione um arquivo");
      return;
    }
    const form = new FormData();
    form.append("avatar", file);

    try {
      const res = await fetch(
        `${API}/clientes/${userId}/avatar`,
        { method: "POST", body: form }
      );
      if (res.ok) {
        const { avatarUrl: newUrl } = await res.json();
         // atualiza só o avatar local
        setAvatarUrl(newUrl);
        onUpdate({ avatar_url: newUrl });
         // dispara refetch completo no pai (nome + url)
        onUpdate();
        setShowUpload(false);
        setFile(null);
      }
    } catch (err) {
      console.error("Front Upload Error:", err);
      setError("Erro ao enviar avatar");
    }
  };

  const initials = userName
    .split(" ")
    .map(w => w[0])
    .join("")
    .slice(0, 2)
    .toUpperCase();

  return (
    <div className="avatar-manager">
      <div className="avatar-display">
        {avatarUrl 
          ? <img
              className="avatar-img"
              src={`${API}${avatarUrl}`}
              alt={userName}
            />
          : <div className="avatar-fallback">{initials}</div>
        }

        {/* ESTE BOTÃO AGORA FUNCIONA */}
        <button
          className="btn-edit-avatar"
          onClick={() => {
            setShowUpload(v => !v);
            setError("");
          }}
        >
          {showUpload ? "Cancelar Imagem" : "Editar Imagem"}
        </button>
      </div>

      {showUpload && (
        <div className="am-upload">
          <input
            type="file"
            accept="image/*"
            onChange={handleFileChange}
          />
          <button className="btn-upload" onClick={handleUpload}>
            Enviar Avatar
          </button>
          {error && <p className="error">{error}</p>}
        </div>
      )}
    </div>
  );
}

AvatarManager.propTypes = {
  userId:     PropTypes.oneOfType([PropTypes.string, PropTypes.number]).isRequired,
  initialUrl: PropTypes.string,
  userName:   PropTypes.string.isRequired,
  onUpdate:   PropTypes.func.isRequired,
};

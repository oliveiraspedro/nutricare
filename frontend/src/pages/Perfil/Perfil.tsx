import './Perfil.css';
import { useState } from 'react';
import { FaUserCircle, FaEnvelope, FaPhone, FaLock, FaEdit, FaAppleAlt } from 'react-icons/fa';

const Perfil = () => {
  const [email, setEmail] = useState('max@gmail.com');
  const [telefone, setTelefone] = useState('(11) 98372-04567');
  const [senha, setSenha] = useState('**********');

  return (
    <div className="profile-container">
      {/* Header */}
      <div className="profile-header">
        <span className="profile-icon">
          {FaAppleAlt({ className: 'profile-icon' })}
        </span>
        <div>
          <h1>Meu Perfil</h1>
          <p>Informações pessoais</p>
        </div>
      </div>

      {/* Card */}
      <div className="profile-card">
        <div className="profile-user">
          <FaUserCircle className="user-avatar" />
          <h2>Max Maya</h2>
        </div>

        <div className="profile-grid">
          {/* Email */}
          <div className="input-grupo">
            <label htmlFor="email">Email</label>
            <div className="input-wrapper">
              <FaEnvelope className="input-icon" />
              <input
                id="email"
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
              />
            </div>
          </div>

          {/* Telefone */}
          <div className="input-grupo">
            <label htmlFor="telefone">Telefone</label>
            <div className="input-wrapper">
              <FaPhone className="input-icon" />
              <input
                id="telefone"
                type="text"
                value={telefone}
                onChange={(e) => setTelefone(e.target.value)}
              />
            </div>
          </div>

          {/* Senha */}
          <div className="input-grupo">
            <label htmlFor="senha">Senha</label>
            <div className="input-wrapper">
              <FaLock className="input-icon" />
              <input
                id="senha"
                type="password"
                value={senha}
                onChange={(e) => setSenha(e.target.value)}
              />
            </div>
          </div>
        </div>

        {/* Botão à esquerda */}
        <div className="edit-button-container left-align">
          <button className="edit-button">
            <FaEdit /> Editar
          </button>
        </div>
      </div>
    </div>
  );
};

export default Perfil;

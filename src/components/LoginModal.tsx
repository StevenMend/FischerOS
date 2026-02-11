import React, { useState } from 'react';
import { X, User, Users, BarChart3, Eye, EyeOff, Clock, Shield, Building } from 'lucide-react';

interface LoginModalProps {
  isOpen: boolean;
  onClose: () => void;
  loginType: 'guest' | 'staff' | 'admin';
  onLogin: (credentials: any) => void;
}

export default function LoginModal({ isOpen, onClose, loginType, onLogin }: LoginModalProps) {
  const [formData, setFormData] = useState({
    roomNumber: '',
    confirmationCode: '',
    staffId: '',
    password: '',
    department: 'Tours',
    adminEmail: '',
    adminPassword: '',
    property: 'Tamarindo Diriá',
    rememberMe: false
  });
  const [showPassword, setShowPassword] = useState(false);
  const [isRecovery, setIsRecovery] = useState(false);
  const [loading, setLoading] = useState(false);

  if (!isOpen) return null;

  const departments = ['Tours', 'Restaurants', 'Spa', 'Front Desk', 'Concierge'];
  const properties = ['Tamarindo Diriá', 'Guanacaste Resort', 'Manuel Antonio'];

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    
    // Simulate authentication delay
    await new Promise(resolve => setTimeout(resolve, 1500));
    
    const credentials = {
      type: loginType,
      ...formData,
      sessionTimeout: loginType === 'guest' ? '24hrs' : loginType === 'staff' ? '8hrs' : '4hrs'
    };
    
    onLogin(credentials);
    setLoading(false);
  };

  const getModalTitle = () => {
    switch (loginType) {
      case 'guest': return 'Acceso Huésped';
      case 'staff': return 'Portal Staff';
      case 'admin': return 'Dashboard Admin';
      default: return 'Login';
    }
  };

  const getIcon = () => {
    switch (loginType) {
      case 'guest': return <User className="w-6 h-6" />;
      case 'staff': return <Users className="w-6 h-6" />;
      case 'admin': return <BarChart3 className="w-6 h-6" />;
      default: return <User className="w-6 h-6" />;
    }
  };

  const getSessionInfo = () => {
    switch (loginType) {
      case 'guest': return { timeout: '24 horas', icon: Clock, color: 'text-green-600' };
      case 'staff': return { timeout: '8 horas (turno)', icon: Shield, color: 'text-blue-600' };
      case 'admin': return { timeout: '4 horas (seguridad)', icon: Shield, color: 'text-red-600' };
      default: return { timeout: '24 horas', icon: Clock, color: 'text-green-600' };
    }
  };

  const sessionInfo = getSessionInfo();

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4 modal-backdrop">
      <div className="bg-white rounded-2xl shadow-2xl max-w-md w-full max-h-[90vh] overflow-y-auto modal-content gpu-accelerated">
        {/* Header */}
        <div className="flex items-center justify-between p-6 border-b border-gray-200">
          <div className="flex items-center space-x-3">
            <div className="w-10 h-10 bg-primary rounded-full flex items-center justify-center text-white animate-float-subtle">
              {getIcon()}
            </div>
            <h2 className="text-xl font-bold text-primary">{getModalTitle()}</h2>
          </div>
          <button onClick={onClose} className="p-2 hover:bg-gray-100 rounded-lg transition-colors btn-premium">
            <X className="w-5 h-5 text-gray-500" />
          </button>
        </div>

        {/* Session Info */}
        <div className="px-6 py-3 bg-gray-50 border-b border-gray-200">
          <div className="flex items-center space-x-2">
            <sessionInfo.icon className={`w-4 h-4 ${sessionInfo.color}`} />
            <span className="text-sm text-gray-600">
              Sesión activa por <span className="font-medium">{sessionInfo.timeout}</span>
            </span>
          </div>
        </div>

        {/* Form */}
        <form onSubmit={handleSubmit} className="p-6 space-y-4">
          {!isRecovery ? (
            <>
              {/* Guest Login */}
              {loginType === 'guest' && (
                <>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Número de Habitación
                    </label>
                    <input
                      type="text"
                      value={formData.roomNumber}
                      onChange={(e) => setFormData({...formData, roomNumber: e.target.value})}
                      placeholder="Ej: 304"
                      className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent input-premium"
                      required
                    />
                  </div>
                  <div className="text-center text-sm text-gray-500">o</div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Código de Confirmación
                    </label>
                    <input
                      type="text"
                      value={formData.confirmationCode}
                      onChange={(e) => setFormData({...formData, confirmationCode: e.target.value})}
                      placeholder="Ej: TD-2024-001234"
                      className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent input-premium"
                    />
                  </div>
                </>
              )}

              {/* Staff Login */}
              {loginType === 'staff' && (
                <>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      ID de Staff
                    </label>
                    <input
                      type="text"
                      value={formData.staffId}
                      onChange={(e) => setFormData({...formData, staffId: e.target.value})}
                      placeholder="Ej: ANA001"
                      className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent input-premium"
                      required
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Departamento
                    </label>
                    <select
                      value={formData.department}
                      onChange={(e) => setFormData({...formData, department: e.target.value})}
                      className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent input-premium"
                    >
                      {departments.map(dept => (
                        <option key={dept} value={dept}>{dept}</option>
                      ))}
                    </select>
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Contraseña
                    </label>
                    <div className="relative">
                      <input
                        type={showPassword ? 'text' : 'password'}
                        value={formData.password}
                        onChange={(e) => setFormData({...formData, password: e.target.value})}
                        placeholder="••••••••"
                        className="w-full px-4 py-3 pr-12 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent input-premium"
                        required
                      />
                      <button
                        type="button"
                        onClick={() => setShowPassword(!showPassword)}
                        className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-500 hover:text-gray-700 btn-premium"
                      >
                        {showPassword ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
                      </button>
                    </div>
                  </div>
                </>
              )}

              {/* Admin Login */}
              {loginType === 'admin' && (
                <>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Propiedad
                    </label>
                    <select
                      value={formData.property}
                      onChange={(e) => setFormData({...formData, property: e.target.value})}
                      className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent input-premium"
                    >
                      {properties.map(prop => (
                        <option key={prop} value={prop}>{prop}</option>
                      ))}
                    </select>
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Email Administrativo
                    </label>
                    <input
                      type="email"
                      value={formData.adminEmail}
                      onChange={(e) => setFormData({...formData, adminEmail: e.target.value})}
                      placeholder="admin@tamarindodiria.com"
                      className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent input-premium"
                      required
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Contraseña
                    </label>
                    <div className="relative">
                      <input
                        type={showPassword ? 'text' : 'password'}
                        value={formData.adminPassword}
                        onChange={(e) => setFormData({...formData, adminPassword: e.target.value})}
                        placeholder="••••••••"
                        className="w-full px-4 py-3 pr-12 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent input-premium"
                        required
                      />
                      <button
                        type="button"
                        onClick={() => setShowPassword(!showPassword)}
                        className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-500 hover:text-gray-700 btn-premium"
                      >
                        {showPassword ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
                      </button>
                    </div>
                  </div>
                </>
              )}

              {/* Remember Me */}
              <div className="flex items-center space-x-2">
                <input
                  type="checkbox"
                  id="rememberMe"
                  checked={formData.rememberMe}
                  onChange={(e) => setFormData({...formData, rememberMe: e.target.checked})}
                  className="w-4 h-4 text-primary border-gray-300 rounded focus:ring-primary"
                />
                <label htmlFor="rememberMe" className="text-sm text-gray-600">
                  Recordar en este dispositivo
                </label>
              </div>

              {/* Submit Button */}
              <button
                type="submit"
                disabled={loading}
                className="w-full bg-primary text-white py-3 rounded-lg font-semibold hover:bg-primary/90 transition-colors disabled:opacity-50 disabled:cursor-not-allowed btn-premium ripple-effect"
              >
                {loading ? (
                  <div className="flex items-center justify-center space-x-2">
                    <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin"></div>
                    <span>Verificando...</span>
                  </div>
                ) : (
                  'Iniciar Sesión'
                )}
              </button>

              {/* Recovery Link */}
              <div className="text-center">
                <button
                  type="button"
                  onClick={() => setIsRecovery(true)}
                  className="text-sm text-primary hover:underline btn-premium"
                >
                  ¿Olvidaste tu contraseña?
                </button>
              </div>
            </>
          ) : (
            /* Recovery Form */
            <>
              <div className="text-center mb-4">
                <h3 className="text-lg font-semibold text-gray-900 mb-2">Recuperar Contraseña</h3>
                <p className="text-sm text-gray-600">
                  Ingresa tu información para recibir instrucciones de recuperación
                </p>
              </div>

              {loginType === 'guest' && (
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Número de Habitación o Código de Confirmación
                  </label>
                  <input
                    type="text"
                    placeholder="304 o TD-2024-001234"
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent input-premium"
                    required
                  />
                </div>
              )}

              {(loginType === 'staff' || loginType === 'admin') && (
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    {loginType === 'staff' ? 'ID de Staff' : 'Email Administrativo'}
                  </label>
                  <input
                    type={loginType === 'admin' ? 'email' : 'text'}
                    placeholder={loginType === 'staff' ? 'ANA001' : 'admin@tamarindodiria.com'}
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent input-premium"
                    required
                  />
                </div>
              )}

              <button
                type="submit"
                className="w-full bg-accent text-white py-3 rounded-lg font-semibold hover:bg-accent/90 transition-colors btn-premium ripple-effect"
              >
                Enviar Instrucciones
              </button>

              <div className="text-center">
                <button
                  type="button"
                  onClick={() => setIsRecovery(false)}
                  className="text-sm text-primary hover:underline btn-premium"
                >
                  ← Volver al login
                </button>
              </div>
            </>
          )}
        </form>
      </div>
    </div>
  );
}
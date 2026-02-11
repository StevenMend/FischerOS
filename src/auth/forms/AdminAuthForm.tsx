// src/auth/forms/AdminAuthForm.tsx - REDISEÑADO CON PALETA RESORT
import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { BarChart3, Shield, Building, Eye, EyeOff, AlertCircle, ArrowLeft, Crown } from 'lucide-react';
import { useAuth } from '../AuthProvider';
import { SITE_CONFIG } from '../../config/site';

export default function AdminAuthForm() {
  const navigate = useNavigate();
  const { loginAsAdmin, isLoading, error, clearError } = useAuth();
  
  const defaultProperty = SITE_CONFIG?.properties?.[0] || 'Tamarindo Diriá Beach Resort';
  
  const [formData, setFormData] = useState({
    email: '',
    password: '',
    property: defaultProperty
  });
  const [showPassword, setShowPassword] = useState(false);
  const [validationErrors, setValidationErrors] = useState<string[]>([]);

  const validateForm = () => {
    const errors: string[] = [];
    
    if (!formData.email.trim()) {
      errors.push('Email administrativo es requerido');
    } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.email)) {
      errors.push('Formato de email inválido');
    }
    
    if (!formData.password) {
      errors.push('Contraseña es requerida');
    } else if (formData.password.length < 8) {
      errors.push('Contraseña debe tener al menos 8 caracteres');
    }

    setValidationErrors(errors);
    return errors.length === 0;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    clearError();
    
    if (!validateForm()) return;

    try {
      await loginAsAdmin(formData.email, formData.password, formData.property);
    } catch (err) {
      // Error handled by store
    }
  };

  const handleInputChange = (field: string, value: string) => {
    setFormData({ ...formData, [field]: value });
    if (validationErrors.length > 0) {
      setValidationErrors([]);
    }
    if (error) {
      clearError();
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-surface-light via-surface to-surface-dark relative overflow-hidden flex items-center justify-center p-4">
      
      {/* Background Elements */}
      <div className="absolute inset-0 opacity-10">
        <div className="absolute top-20 left-20 w-32 h-32 bg-accent/20 rounded-full blur-3xl animate-pulse"></div>
        <div className="absolute bottom-20 right-20 w-40 h-40 bg-foreground/15 rounded-full blur-3xl animate-pulse delay-1000"></div>
      </div>

      <div className="relative z-10 w-full max-w-md">
        {/* Back Button */}
        <button
          onClick={() => navigate('/portal')}
          className="mb-4 flex items-center space-x-2 text-foreground hover:text-primary transition-colors"
        >
          <ArrowLeft className="w-4 h-4" />
          <span className="text-sm font-medium">Back to Portal</span>
        </button>

        {/* Main Form Container */}
        <div className="bg-white/95 backdrop-blur-xl rounded-2xl sm:rounded-3xl shadow-lg border border-surface-dark overflow-hidden">
          
          {/* Header - COMPACT */}
          <div className="p-5 sm:p-6 text-center border-b border-surface-dark">
            <div className="w-14 h-14 sm:w-16 sm:h-16 bg-white border-2 border-surface-dark rounded-2xl flex items-center justify-center mx-auto mb-3 shadow-sm">
              <Crown className="w-7 h-7 sm:w-8 sm:h-8 text-accent" />
            </div>
            
            <h1 className="text-2xl sm:text-3xl font-bold text-foreground mb-2">Admin Dashboard</h1>
            <p className="text-sm sm:text-base text-foreground/80 mb-3">Acceso ejecutivo - Máxima seguridad</p>
            
            <div className="inline-flex items-center space-x-2 bg-accent/10 px-3 py-1.5 rounded-full border border-accent/20 text-xs sm:text-sm">
              <Shield className="w-3 h-3 sm:w-4 sm:h-4 text-accent" />
              <span className="text-accent font-medium">
                Sesión de <strong>4h</strong> - Alta seguridad
              </span>
            </div>
          </div>

          {/* Form - COMPACT */}
          <form onSubmit={handleSubmit} className="p-5 sm:p-6 space-y-4">
            
            {/* Property Selection */}
            <div>
              <label className="flex items-center space-x-1.5 text-sm font-medium text-foreground mb-1.5">
                <Building className="w-4 h-4 text-accent" />
                <span>Propiedad</span>
              </label>
              <select
                value={formData.property}
                onChange={(e) => handleInputChange('property', e.target.value)}
                className="w-full px-3 py-2.5 text-sm border-2 border-surface-dark rounded-xl focus:ring-2 focus:ring-accent focus:border-accent bg-white/50 text-foreground"
              >
                {(SITE_CONFIG?.properties || [defaultProperty]).map(property => (
                  <option key={property} value={property}>{property}</option>
                ))}
              </select>
            </div>

            {/* Email */}
            <div>
              <label className="flex items-center space-x-1.5 text-sm font-medium text-foreground mb-1.5">
                <Shield className="w-4 h-4 text-accent" />
                <span>Email Administrativo</span>
              </label>
              <input
                type="email"
                value={formData.email}
                onChange={(e) => handleInputChange('email', e.target.value)}
                placeholder="admin@tamarindodiria.com"
                className="w-full px-3 py-2.5 text-sm border-2 border-surface-dark rounded-xl focus:ring-2 focus:ring-accent focus:border-accent bg-white/50 text-foreground placeholder-foreground/50"
                autoComplete="email"
              />
              <p className="text-xs text-foreground/70 mt-1">
                Email corporativo verificado
              </p>
            </div>

            {/* Password */}
            <div>
              <label className="block text-sm font-medium text-foreground mb-1.5">
                Contraseña Ejecutiva
              </label>
              <div className="relative">
                <input
                  type={showPassword ? 'text' : 'password'}
                  value={formData.password}
                  onChange={(e) => handleInputChange('password', e.target.value)}
                  placeholder="••••••••••••"
                  className="w-full px-3 py-2.5 text-sm border-2 border-surface-dark rounded-xl focus:ring-2 focus:ring-accent focus:border-accent bg-white/50 text-foreground placeholder-foreground/50 pr-12"
                  autoComplete="current-password"
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-3 top-1/2 transform -translate-y-1/2 text-foreground/50 hover:text-foreground transition-colors"
                >
                  {showPassword ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
                </button>
              </div>
              <p className="text-xs text-foreground/70 mt-1">
                Mínimo 8 caracteres - Máxima seguridad
              </p>
            </div>

            {/* Validation Errors */}
            {validationErrors.length > 0 && (
              <div className="p-3 bg-red-50 border-2 border-red-200 rounded-xl">
                <div className="flex items-center space-x-1.5 mb-1">
                  <AlertCircle className="w-4 h-4 text-red-500 flex-shrink-0" />
                  <span className="font-medium text-red-700 text-xs">Errores:</span>
                </div>
                <ul className="text-red-600 space-y-0.5 text-xs">
                  {validationErrors.map((error, index) => (
                    <li key={index}>• {error}</li>
                  ))}
                </ul>
              </div>
            )}

            {/* Server Error */}
            {error && (
              <div className="p-3 bg-red-50 border-2 border-red-200 rounded-xl">
                <div className="flex items-center space-x-1.5">
                  <AlertCircle className="w-4 h-4 text-red-500 flex-shrink-0" />
                  <span className="text-red-700 text-xs">{error}</span>
                </div>
              </div>
            )}

            {/* Access Info - COMPACT */}
            <div className="p-3 bg-surface/50 border-2 border-surface-dark rounded-xl">
              <p className="text-xs text-foreground font-medium mb-2">Acceso ejecutivo completo:</p>
              <div className="space-y-1.5">
                <div className="flex items-center space-x-2">
                  <div className="w-1.5 h-1.5 bg-accent rounded-full flex-shrink-0"></div>
                  <span className="text-xs text-foreground">Analytics de todo el resort</span>
                </div>
                <div className="flex items-center space-x-2">
                  <div className="w-1.5 h-1.5 bg-accent rounded-full flex-shrink-0"></div>
                  <span className="text-xs text-foreground">Performance de staff y partners</span>
                </div>
                <div className="flex items-center space-x-2">
                  <div className="w-1.5 h-1.5 bg-accent rounded-full flex-shrink-0"></div>
                  <span className="text-xs text-foreground">Revenue analytics en tiempo real</span>
                </div>
                <div className="flex items-center space-x-2">
                  <div className="w-1.5 h-1.5 bg-accent rounded-full flex-shrink-0"></div>
                  <span className="text-xs text-foreground">Configuración del sistema</span>
                </div>
              </div>
            </div>

            {/* Buttons - COMPACT */}
            <div className="flex space-x-3 pt-3">
              <button
                type="button"
                onClick={() => navigate('/portal')}
                className="flex-1 bg-white border-2 border-surface-dark text-foreground py-2.5 rounded-xl font-semibold text-sm hover:shadow-md transition-all duration-300"
              >
                Cancelar
              </button>
              <button
                type="submit"
                disabled={isLoading}
                className="flex-1 bg-white border-2 border-surface-dark text-foreground py-2.5 rounded-xl font-semibold text-sm hover:shadow-md transition-all duration-300 disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {isLoading ? (
                  <div className="flex items-center justify-center space-x-2">
                    <div className="w-4 h-4 border-2 border-foreground/30 border-t-foreground rounded-full animate-spin"></div>
                    <span>Verificando...</span>
                  </div>
                ) : (
                  'Acceso Ejecutivo'
                )}
              </button>
            </div>

            {/* Help Text */}
            <div className="pt-3 border-t border-surface-dark text-center">
              <p className="text-xs text-foreground/70">
                Próximamente: Autenticación de dos factores (2FA) requerida
              </p>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
}
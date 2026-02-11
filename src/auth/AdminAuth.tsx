// src/auth/AdminAuth.tsx - Admin Executive Dual Authentication (Completado)
import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { BarChart3, Shield, Building, Eye, EyeOff, AlertCircle, Lock, ArrowLeft } from 'lucide-react';
import { useAuth } from './AuthProvider';
import { THEME_VARIANTS } from '../lib/theme/variants';
import { SITE_CONFIG } from '../config/site';
import { ROUTE_PATHS } from '../config/routes';

export default function AdminAuth() {
  const navigate = useNavigate();
  const { loginAsAdmin, isLoading, error, clearError } = useAuth();
  const [formData, setFormData] = useState({
    email: '',
    password: '',
    property: SITE_CONFIG.properties[0]
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
      // Navigation handled by AuthProvider + routing
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
    <div className="min-h-screen bg-gradient-to-br from-amber-50 to-blue-50 flex items-center justify-center p-4">
      <div className="max-w-md w-full">
        {/* Back Button */}
        <button
          onClick={() => navigate(ROUTE_PATHS.landing)}
          className="mb-6 flex items-center space-x-2 text-primary hover:text-primary-dark transition-colors"
        >
          <ArrowLeft className="w-4 h-4" />
          <span className="text-sm font-medium">Back to Landing</span>
        </button>

        <div className="bg-white rounded-2xl shadow-xl border border-gray-100">
          {/* Header */}
          <div className="px-6 py-4 border-b border-gray-200 bg-gradient-to-r from-accent to-accent-dark text-white">
            <div className="flex items-center space-x-3">
              <div className="w-10 h-10 bg-white/20 rounded-xl flex items-center justify-center">
                <BarChart3 className="w-5 h-5" />
              </div>
              <div>
                <h2 className="text-lg font-bold">Dashboard Admin</h2>
                <p className="text-sm text-orange-100">Acceso ejecutivo - Máxima seguridad</p>
              </div>
            </div>
          </div>

          {/* Security Notice */}
          <div className="px-6 py-3 bg-red-50 border-b border-red-200">
            <div className="flex items-center space-x-2">
              <Lock className="w-4 h-4 text-red-600" />
              <span className="text-sm text-red-700">
                Sesión de <strong>4 horas</strong> - Alta seguridad
              </span>
            </div>
          </div>

          {/* Form */}
          <form onSubmit={handleSubmit} className="p-6 space-y-4">
            {/* Property Selection */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                <Building className="w-4 h-4 inline mr-1" />
                Propiedad
              </label>
              <select
                value={formData.property}
                onChange={(e) => handleInputChange('property', e.target.value)}
                className={THEME_VARIANTS.common.input.base}
              >
                {SITE_CONFIG.properties.map(property => (
                  <option key={property} value={property}>{property}</option>
                ))}
              </select>
            </div>

            {/* Email */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                <Shield className="w-4 h-4 inline mr-1" />
                Email Administrativo
              </label>
              <input
                type="email"
                value={formData.email}
                onChange={(e) => handleInputChange('email', e.target.value)}
                placeholder="admin@tamarindodiria.com"
                className={THEME_VARIANTS.common.input.base}
                autoComplete="email"
              />
              <p className="text-xs text-gray-500 mt-1">
                Email corporativo verificado
              </p>
            </div>

            {/* Password */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Contraseña Ejecutiva
              </label>
              <div className="relative">
                <input
                  type={showPassword ? 'text' : 'password'}
                  value={formData.password}
                  onChange={(e) => handleInputChange('password', e.target.value)}
                  placeholder="••••••••••••"
                  className={THEME_VARIANTS.common.input.base + ' pr-12'}
                  autoComplete="current-password"
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-500 hover:text-gray-700"
                >
                  {showPassword ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
                </button>
              </div>
              <p className="text-xs text-gray-500 mt-1">
                Mínimo 8 caracteres - Máxima seguridad
              </p>
            </div>

            {/* Validation Errors */}
            {validationErrors.length > 0 && (
              <div className="p-3 bg-red-50 border border-red-200 rounded-lg">
                <div className="flex items-center space-x-2 mb-2">
                  <AlertCircle className="w-4 h-4 text-red-500" />
                  <span className="text-sm font-medium text-red-700">Errores de validación:</span>
                </div>
                <ul className="text-xs text-red-600 space-y-1">
                  {validationErrors.map((error, index) => (
                    <li key={index}>• {error}</li>
                  ))}
                </ul>
              </div>
            )}

            {/* API Error */}
            {error && (
              <div className="p-3 bg-red-50 border border-red-200 rounded-lg">
                <div className="flex items-center space-x-2">
                  <AlertCircle className="w-4 h-4 text-red-500" />
                  <span className="text-sm text-red-700">{error}</span>
                </div>
              </div>
            )}

            {/* Admin Access Preview */}
            <div className="p-3 bg-gradient-to-r from-gray-50 to-blue-50 border border-gray-200 rounded-lg">
              <p className="text-xs text-gray-600 mb-2">Acceso ejecutivo completo:</p>
              <div className="space-y-1 text-xs">
                <div className="flex items-center space-x-1">
                  <div className="w-1 h-1 bg-purple-500 rounded-full"></div>
                  <span className="text-gray-600">Analytics de todo el resort</span>
                </div>
                <div className="flex items-center space-x-1">
                  <div className="w-1 h-1 bg-purple-500 rounded-full"></div>
                  <span className="text-gray-600">Performance de staff y partners</span>
                </div>
                <div className="flex items-center space-x-1">
                  <div className="w-1 h-1 bg-purple-500 rounded-full"></div>
                  <span className="text-gray-600">Revenue analytics en tiempo real</span>
                </div>
                <div className="flex items-center space-x-1">
                  <div className="w-1 h-1 bg-purple-500 rounded-full"></div>
                  <span className="text-gray-600">Configuración del sistema</span>
                </div>
              </div>
            </div>

            {/* Actions */}
            <div className="flex space-x-3 pt-4">
              <button
                type="button"
                onClick={() => navigate(ROUTE_PATHS.landing)}
                className="flex-1 bg-gray-100 text-gray-700 py-3 rounded-lg font-semibold hover:bg-gray-200 transition-colors"
              >
                Cancelar
              </button>
              <button
                type="submit"
                disabled={isLoading}
                className="flex-1 bg-gradient-to-r from-accent to-accent-dark text-white py-3 rounded-lg font-semibold hover:opacity-90 transition-all disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {isLoading ? (
                  <div className="flex items-center justify-center space-x-2">
                    <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin"></div>
                    <span>Verificando...</span>
                  </div>
                ) : (
                  'Acceso Ejecutivo'
                )}
              </button>
            </div>

            {/* Dual Auth Notice */}
            <div className="pt-4 border-t border-gray-200">
              <p className="text-xs text-gray-500 text-center">
                Próximamente: Autenticación de dos factores (2FA) requerida para acceso admin
              </p>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
}
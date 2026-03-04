// src/pages/admin/QRCodePage.tsx — Generate QR codes for guest portal
import React, { useRef, useState } from 'react';
import { QRCodeSVG } from 'qrcode.react';
import { Download, Copy, Check, QrCode } from 'lucide-react';
import { useAdminProperty } from '../../hooks/admin/useAdminProperty';
import { toast } from 'sonner';

export default function QRCodePage() {
  const { data: property } = useAdminProperty();
  const qrRef = useRef<HTMLDivElement>(null);
  const [copied, setCopied] = useState(false);
  const [size, setSize] = useState(256);

  const slug = property?.code || 'demo-resort';
  const baseUrl = window.location.origin;
  const guestUrl = `${baseUrl}/${slug}/guest`;

  const handleDownloadSVG = () => {
    const svgElement = qrRef.current?.querySelector('svg');
    if (!svgElement) return;
    const svgData = new XMLSerializer().serializeToString(svgElement);
    const blob = new Blob([svgData], { type: 'image/svg+xml' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `${slug}-qr-code.svg`;
    a.click();
    URL.revokeObjectURL(url);
    toast.success('SVG downloaded');
  };

  const handleDownloadPNG = () => {
    const svgElement = qrRef.current?.querySelector('svg');
    if (!svgElement) return;
    const canvas = document.createElement('canvas');
    canvas.width = size * 2;
    canvas.height = size * 2;
    const ctx = canvas.getContext('2d')!;
    const img = new Image();
    const svgData = new XMLSerializer().serializeToString(svgElement);
    img.onload = () => {
      ctx.fillStyle = 'white';
      ctx.fillRect(0, 0, canvas.width, canvas.height);
      ctx.drawImage(img, 0, 0, canvas.width, canvas.height);
      const a = document.createElement('a');
      a.href = canvas.toDataURL('image/png');
      a.download = `${slug}-qr-code.png`;
      a.click();
      toast.success('PNG downloaded');
    };
    img.src = 'data:image/svg+xml;base64,' + btoa(svgData);
  };

  const handleCopy = () => {
    navigator.clipboard.writeText(guestUrl);
    setCopied(true);
    toast.success('URL copied');
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div className="p-4 sm:p-6 lg:p-8 space-y-6">
      <h1 className="text-2xl lg:text-3xl font-bold text-accent">QR Codes</h1>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* QR Preview */}
        <div className="bg-white rounded-xl border border-gray-200 p-8 flex flex-col items-center">
          <div ref={qrRef} className="p-4 bg-white rounded-xl border-2 border-gray-100">
            <QRCodeSVG
              value={guestUrl}
              size={size}
              level="H"
              includeMargin
              fgColor="#1a2744"
            />
          </div>
          <p className="text-sm text-gray-600 mt-4 text-center font-mono break-all">{guestUrl}</p>
          <p className="text-xs text-gray-400 mt-1">Scan to open the guest portal</p>

          <div className="flex gap-3 mt-6">
            <button onClick={handleDownloadPNG} className="flex items-center gap-2 px-4 py-2 bg-accent text-white rounded-lg text-sm font-medium hover:bg-accent-dark">
              <Download className="w-4 h-4" /> PNG
            </button>
            <button onClick={handleDownloadSVG} className="flex items-center gap-2 px-4 py-2 border border-gray-300 rounded-lg text-sm font-medium hover:bg-gray-50">
              <Download className="w-4 h-4" /> SVG
            </button>
            <button onClick={handleCopy} className="flex items-center gap-2 px-4 py-2 border border-gray-300 rounded-lg text-sm font-medium hover:bg-gray-50">
              {copied ? <Check className="w-4 h-4 text-green-500" /> : <Copy className="w-4 h-4" />}
              {copied ? 'Copied' : 'URL'}
            </button>
          </div>
        </div>

        {/* Settings */}
        <div className="space-y-6">
          <div className="bg-white rounded-xl border border-gray-200 p-6">
            <h3 className="font-semibold text-gray-900 mb-4">QR Code Settings</h3>
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Size</label>
                <div className="flex gap-2">
                  {[128, 256, 512].map(s => (
                    <button
                      key={s}
                      onClick={() => setSize(s)}
                      className={`px-4 py-2 rounded-lg text-sm font-medium border ${size === s ? 'bg-accent text-white border-accent' : 'border-gray-300 hover:bg-gray-50'}`}
                    >
                      {s}px
                    </button>
                  ))}
                </div>
              </div>
            </div>
          </div>

          <div className="bg-white rounded-xl border border-gray-200 p-6">
            <h3 className="font-semibold text-gray-900 mb-4">Usage Tips</h3>
            <ul className="space-y-3 text-sm text-gray-600">
              <li className="flex items-start gap-2">
                <QrCode className="w-4 h-4 text-accent mt-0.5 shrink-0" />
                <span>Print and place in guest rooms, lobby, and restaurant tables</span>
              </li>
              <li className="flex items-start gap-2">
                <QrCode className="w-4 h-4 text-accent mt-0.5 shrink-0" />
                <span>Include in welcome packets and key card holders</span>
              </li>
              <li className="flex items-start gap-2">
                <QrCode className="w-4 h-4 text-accent mt-0.5 shrink-0" />
                <span>Add to your property's Wi-Fi landing page</span>
              </li>
              <li className="flex items-start gap-2">
                <QrCode className="w-4 h-4 text-accent mt-0.5 shrink-0" />
                <span>Use the SVG for print materials (infinite resolution)</span>
              </li>
            </ul>
          </div>
        </div>
      </div>
    </div>
  );
}

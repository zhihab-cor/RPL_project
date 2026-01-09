"use client";

import { X, Check, Info, AlertTriangle, XCircle, LogIn } from "lucide-react";
import { useEffect, useState } from "react";

export type NotificationType = "success" | "error" | "warning" | "info" | "login";

interface NotificationModalProps {
  isOpen: boolean;
  onClose: () => void;
  title: string;
  message: string;
  type?: NotificationType;
  primaryButtonText?: string;
  onPrimaryClick?: () => void;
  secondaryButtonText?: string;
  onSecondaryClick?: () => void;
}

export default function NotificationModal({
  isOpen,
  onClose,
  title,
  message,
  type = "info",
  primaryButtonText = "OK",
  onPrimaryClick,
  secondaryButtonText,
  onSecondaryClick,
}: NotificationModalProps) {
  const [show, setShow] = useState(isOpen);

  useEffect(() => {
    setShow(isOpen);
  }, [isOpen]);

  if (!show) return null;

  const handlePrimaryClick = () => {
    if (onPrimaryClick) {
      onPrimaryClick();
    } else {
      onClose();
    }
  };

  const handleSecondaryClick = () => {
    if (onSecondaryClick) {
      onSecondaryClick();
    } else {
      onClose();
    }
  };

  const getIcon = () => {
    switch (type) {
      case "success":
        return <Check className="text-green-600 w-6 h-6" />;
      case "error":
        return <XCircle className="text-red-600 w-6 h-6" />;
      case "warning":
        return <AlertTriangle className="text-yellow-600 w-6 h-6" />;
      case "login":
        return <LogIn className="text-blue-600 w-6 h-6" />;
      default:
        return <Info className="text-blue-600 w-6 h-6" />;
    }
  };

  const getBgColor = () => {
    switch (type) {
      case "success":
        return "bg-green-100";
      case "error":
        return "bg-red-100";
      case "warning":
        return "bg-yellow-100";
      case "login":
        return "bg-blue-100";
      default:
        return "bg-blue-100";
    }
  };

  const getPrimaryButtonColor = () => {
    switch (type) {
      case "success":
        return "bg-green-600 hover:bg-green-700 shadow-green-200";
      case "error":
        return "bg-red-600 hover:bg-red-700 shadow-red-200";
      case "warning":
        return "bg-yellow-600 hover:bg-yellow-700 shadow-yellow-200";
      default:
        return "bg-blue-600 hover:bg-blue-700 shadow-blue-200";
    }
  };

  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 bg-black/50 backdrop-blur-sm transition-all duration-300">
      <div className="bg-white rounded-2xl shadow-2xl w-full max-w-md p-6 transform transition-all scale-100 animate-in fade-in zoom-in duration-200">
        <div className="flex justify-between items-start mb-4">
          <div className="flex items-center gap-3">
            <div className={`${getBgColor()} p-2 rounded-full`}>
              {getIcon()}
            </div>
            <h3 className="text-xl font-bold text-gray-800">{title}</h3>
          </div>
          <button
            onClick={onClose}
            className="text-gray-400 hover:text-gray-600 transition p-1 hover:bg-gray-100 rounded-full"
          >
            <X size={24} />
          </button>
        </div>

        <p className="text-gray-600 mb-8 leading-relaxed">
          {message}
        </p>

        <div className="flex gap-3 justify-end">
          {secondaryButtonText && (
            <button
              onClick={handleSecondaryClick}
              className="px-4 py-2.5 bg-gray-100 text-gray-700 font-semibold rounded-xl hover:bg-gray-200 transition"
            >
              {secondaryButtonText}
            </button>
          )}
          <button
            onClick={handlePrimaryClick}
            className={`px-6 py-2.5 text-white font-semibold rounded-xl shadow-lg transition w-full sm:w-auto ${getPrimaryButtonColor()}`}
          >
            {primaryButtonText}
          </button>
        </div>
      </div>
    </div>
  );
}

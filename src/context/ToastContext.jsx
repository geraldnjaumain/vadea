import React, { createContext } from 'react';
import { Toaster, toast as sonnerToast } from 'sonner';
import { CheckCircle2, AlertCircle, Info, Loader2 } from 'lucide-react';

const ToastContext = createContext(null);

export const ToastProvider = ({ children }) => {
    return (
        <ToastContext.Provider value={{}}>
            {children}
            <Toaster
                position="bottom-right"
                expand={true}
                visibleToasts={6}
                toastOptions={{
                    style: {
                        background: '#0B1120', // Ink Blue
                        color: '#FFFFFF',
                        border: '1px solid rgba(255, 255, 255, 0.1)',
                        borderRadius: '12px',
                        padding: '16px',
                        boxShadow: '0 20px 25px -5px rgba(0, 0, 0, 0.5), 0 8px 10px -6px rgba(0, 0, 0, 0.5)', // Heavy shadow
                        fontFamily: 'inherit',
                        minWidth: '350px',
                    },
                    descriptionStyle: {
                        color: '#94a3b8',
                        fontSize: '0.875rem'
                    }
                }}
            />
        </ToastContext.Provider>
    );
};

export const useToast = () => {
    // Adapter to match existing API: toast.success(title, message)
    // and integrate with Sonner
    return {
        success: (title, message, options = {}) => sonnerToast.success(title, {
            description: message,
            icon: <CheckCircle2 size={20} color="#D4FF00" />, // Electric Lime
            ...options
        }),
        error: (title, message, options = {}) => sonnerToast.error(title, {
            description: message,
            icon: <AlertCircle size={20} color="#F43F5E" />, // Rose Red
            duration: 5000,
            ...options
        }),
        loading: (title, message, options = {}) => sonnerToast.loading(title, {
            description: message,
            // Sonner uses built-in spinner, but we can override icon if needed
            // icon: <Loader2 className="spin" size={20} />
            ...options
        }),
        info: (title, message, options = {}) => sonnerToast.message(title, {
            description: message,
            icon: <Info size={20} color="#3b82f6" />,
            ...options
        }),
        dismiss: (id) => sonnerToast.dismiss(id),
        // Expose raw sonner if needed
        raw: sonnerToast
    };
};

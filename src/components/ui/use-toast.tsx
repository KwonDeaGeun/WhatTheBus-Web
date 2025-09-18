import type React from "react";
import {
    createContext,
    useCallback,
    useContext,
    useRef,
    useState,
} from "react";

type ToastOptions = {
    title?: string;
    description?: string;
    variant?: "default" | "destructive";
};

type ToastMessage = ToastOptions & {
    id: number;
    timeoutId: NodeJS.Timeout;
};

type ToastContextValue = {
    toast: (opts: ToastOptions) => void;
};

const ToastContext = createContext<ToastContextValue | null>(null);

export const ToastProvider: React.FC<{ children: React.ReactNode }> = ({
    children,
}) => {
    const [messages, setMessages] = useState<ToastMessage[]>([]);
    const idRef = useRef(0);

    const toast = useCallback((opts: ToastOptions) => {
        const id = idRef.current++;
        const timeoutId = setTimeout(() => {
            setMessages((prev) => prev.filter((m) => m.id !== id));
        }, 4000);
        setMessages((prev) => [{ ...opts, id, timeoutId }, ...prev]);
    }, []);

    return (
        <ToastContext.Provider value={{ toast }}>
            {children}
            <div
                style={{
                    position: "fixed",
                    left: "50%",
                    transform: "translateX(-50%)",
                    top: 24,
                    zIndex: 9999,
                }}
            >
                {messages.map((t) => (
                    <div
                        key={t.id}
                        style={{
                            marginTop: 8,
                            background:
                                t.variant === "destructive"
                                    ? "#ef4444"
                                    : "rgba(0,0,0,0.8)",
                            color: "white",
                            padding: "10px 14px",
                            borderRadius: 8,
                            boxShadow: "0 4px 12px rgba(0,0,0,0.2)",
                            minWidth: 200,
                            textAlign: "center",
                        }}
                    >
                        {t.title ? (
                            <div style={{ fontWeight: 600 }}>{t.title}</div>
                        ) : null}
                        {t.description ? (
                            <div style={{ marginTop: 4 }}>{t.description}</div>
                        ) : null}
                    </div>
                ))}
            </div>
        </ToastContext.Provider>
    );
};

export const useToast = () => {
    const ctx = useContext(ToastContext);
    if (!ctx) {
        throw new Error("useToast must be used within ToastProvider");
    }
    return ctx;
};

export default useToast;

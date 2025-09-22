import { Settings, X } from "lucide-react";

interface SettingsButtonProps {
    showSettings: boolean;
    onToggle: () => void;
}

export const SettingsButton = ({
    showSettings,
    onToggle,
}: SettingsButtonProps) => {
    return (
        <button
            type="button"
            aria-label="설정"
            aria-haspopup="dialog"
            aria-expanded={showSettings}
            onClick={onToggle}
            style={{
                position: "fixed",
                top: 40,
                right: 12,
                zIndex: 10000,
                background: "white",
                border: "1px solid #e5e7eb",
                borderRadius: 8,
                padding: 8,
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                boxShadow: "0 2px 8px rgba(0,0,0,0.08)",
                cursor: "pointer",
            }}
        >
            {showSettings ? <X size={20} /> : <Settings size={20} />}
        </button>
    );
};

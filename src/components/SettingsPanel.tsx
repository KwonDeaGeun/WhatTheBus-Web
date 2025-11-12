import { X } from "lucide-react";
import { useTranslation } from "../contexts/LanguageContext";

type Language = "ko" | "en";

interface SettingsPanelProps {
    langId: string;
    language: Language;
    setLanguage: (lang: Language) => void;
    onClose: () => void;
}

const SettingsPanel: React.FC<SettingsPanelProps> = ({
    langId,
    language,
    setLanguage,
    onClose,
}) => {
    const { t } = useTranslation();
    return (
        <div
            role="dialog"
            aria-label="설정 패널"
            aria-modal="true"
            tabIndex={-1}
            onKeyDown={(e) => {
                if (e.key === "Escape") {
                    e.stopPropagation();
                    onClose();
                }
            }}
            style={{
                position: "fixed",
                top: 0,
                right: 0,
                bottom: 0,
                zIndex: 10000,
                background: "white",
                padding: 20,
                paddingTop: 40,
                width: "min(420px, 70vw)",
                boxShadow: "-8px 0 24px rgba(0,0,0,0.12)",
                overflowY: "auto",
            }}
        >
            <div
                style={{
                    display: "flex",
                    justifyContent: "space-between",
                    alignItems: "center",
                    marginBottom: 12,
                }}
            >
                <div style={{ fontWeight: 600 }}>{t("settings.title")}</div>
                <button
                    type="button"
                    onClick={onClose}
                    aria-label="닫기"
                    style={{
                        background: "transparent",
                        border: "none",
                        cursor: "pointer",
                    }}
                >
                    <X />
                </button>
            </div>
            <div
                style={{
                    fontSize: 15,
                    color: "#374151",
                    display: "grid",
                    gap: 12,
                }}
            >
                <div
                    style={{ display: "flex", flexDirection: "column", gap: 6 }}
                >
                    <label
                        htmlFor={langId}
                        style={{ fontSize: 14, color: "#111827" }}
                    >
                        {t("settings.language")}
                    </label>
                    <select
                        id={langId}
                        value={language}
                        onChange={(e) => setLanguage(e.target.value as Language)}
                        style={{
                            padding: 8,
                            borderRadius: 6,
                            border: "1px solid #e5e7eb",
                        }}
                    >
                        <option value="ko">{t("settings.korean")}</option>
                        <option value="en">{t("settings.english")}</option>
                    </select>
                </div>

                <div
                    style={{ height: 1, background: "#e6e6e6", width: "100%" }}
                />

                <div
                    style={{ display: "flex", flexDirection: "column", gap: 6 }}
                >
                    <div style={{ fontSize: 14, color: "#111827" }}>
                        {t("settings.contact")}
                    </div>
                    <a
                        href="https://forms.gle/your-google-form-id"
                        target="_blank"
                        rel="noopener noreferrer"
                        style={{ color: "#0ea5e9", textDecoration: "none" }}
                    >
                        {t("settings.contact")}
                    </a>
                </div>

                <div
                    style={{ height: 1, background: "#e6e6e6", width: "100%" }}
                />

                <div
                    style={{ display: "flex", flexDirection: "column", gap: 6 }}
                >
                    <div style={{ fontSize: 14, color: "#111827" }}>
                        {t("settings.userGuide")}
                    </div>
                    <div style={{ fontSize: 15, color: "#374151" }}>
                        <a
                            href="https://www.notion.so/What-The-Bus-28de74f7e03580479307d7533f1ecc0a"
                            target="_blank"
                            rel="noopener noreferrer"
                            style={{ color: "#0ea5e9", textDecoration: "none" }}
                        >
                            {t("settings.userGuide")}
                        </a>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default SettingsPanel;

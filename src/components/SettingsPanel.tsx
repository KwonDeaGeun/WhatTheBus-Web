import { X } from "lucide-react";

interface SettingsPanelProps {
    langId: string;
    language: string;
    setLanguage: (lang: string) => void;
    onClose: () => void;
}

const SettingsPanel: React.FC<SettingsPanelProps> = ({
    langId,
    language,
    setLanguage,
    onClose,
}) => {
    return (
        <div
            role="dialog"
            aria-label="설정 패널"
            style={{
                position: "fixed",
                top: 0,
                right: 0,
                bottom: 0,
                zIndex: 10000,
                background: "white",
                padding: 20,
                width: "50%",
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
                <div style={{ fontWeight: 600 }}>설정</div>
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
                        언어
                    </label>
                    <select
                        id={langId}
                        value={language}
                        onChange={(e) => setLanguage(e.target.value)}
                        style={{
                            padding: 8,
                            borderRadius: 6,
                            border: "1px solid #e5e7eb",
                        }}
                    >
                        <option value="ko">한국어</option>
                        <option value="en">English</option>
                    </select>
                </div>

                <div
                    style={{ height: 1, background: "#e6e6e6", width: "100%" }}
                />

                <div
                    style={{ display: "flex", flexDirection: "column", gap: 6 }}
                >
                    <div style={{ fontSize: 14, color: "#111827" }}>
                        문의하기
                    </div>
                    <a
                        href="https://forms.gle/your-google-form-id"
                        target="_blank"
                        rel="noopener noreferrer"
                        style={{ color: "#0ea5e9", textDecoration: "none" }}
                    >
                        문의하기(구글폼)
                    </a>
                </div>

                <div
                    style={{ height: 1, background: "#e6e6e6", width: "100%" }}
                />

                <div
                    style={{ display: "flex", flexDirection: "column", gap: 6 }}
                >
                    <div style={{ fontSize: 14, color: "#111827" }}>
                        사용 가이드
                    </div>
                    <div style={{ fontSize: 15, color: "#374151" }}>
                        <a
                            href="https://www.notion.so/your-notion-page"
                            target="_blank"
                            rel="noopener noreferrer"
                            style={{ color: "#0ea5e9", textDecoration: "none" }}
                        >
                            사용 가이드 보기 (Notion)
                        </a>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default SettingsPanel;

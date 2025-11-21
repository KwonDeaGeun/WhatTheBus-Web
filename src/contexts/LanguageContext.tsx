import { createContext, type ReactNode, useContext } from "react";

export type Language = "ko" | "en";

interface Translations {
    ko: Record<string, string>;
    en: Record<string, string>;
}

const translations: Translations = {
    ko: {
        // BusStops
        "busStops.selectStop": "버스 정류장 선택하기",
        "busStops.selectBus": "버스 선택하기",

        // Bus Stop Names
        "busStop.평화의광장": "평화의광장",
        "busStop.치과병원": "치과병원",
        "busStop.정문": "정문",
        "busStop.인문관": "인문관",
        "busStop.죽전역": "죽전역",

        // Directions
        "direction.toDKU": "단국대학교 방향",
        "direction.toJukjeon": "죽전역 방향",

        // Bus Labels
        "bus.shuttleToDKU": "셔틀버스(단국대학교 방향)",
        "bus.shuttleToJukjeon": "셔틀버스(죽전역 방향)",
        "bus.shuttle": "셔틀버스",

        // SettingsPanel
        "settings.title": "설정",
        "settings.language": "언어",
        "settings.korean": "한국어",
        "settings.english": "English",
        "settings.contact": "문의하기",
        "settings.userGuide": "사용 가이드",

        // Common
        "common.loading": "로딩 중...",
        "common.error": "오류가 발생했습니다",
        "common.noData": "데이터가 없습니다",
        "common.noArrival": "도착 정보 없음",
        "common.arrivingSoon": "곧 도착",
        "common.startPoint": "출발지"
    },
    en: {
        // BusStops
        "busStops.selectStop": "Select Bus Stop",
        "busStops.selectBus": "Select Bus",

        // Bus Stop Names
        "busStop.평화의광장": "Dankook Univ. Peace Square",
        "busStop.치과병원": "Dankook Univ. Dental Hospital",
        "busStop.정문": "Dankook Univ. Main Gate",
        "busStop.인문관": "Humanities Building",
        "busStop.죽전역": "Jukjeon Stn/ Shinsegae S. City",

        // Directions
        "direction.toDKU": "→ Dankook Univ.",
        "direction.toJukjeon": "→ Jukjeon Stn.",

        // Bus Labels
        "bus.shuttleToDKU": "Shuttle Bus (→ Dankook Univ.)",
        "bus.shuttleToJukjeon": "Shuttle Bus (→ Jukjeon Stn.)",
        "bus.shuttle": "Shuttle Bus",

        // SettingsPanel
        "settings.title": "Settings",
        "settings.language": "Language",
        "settings.korean": "한국어",
        "settings.english": "English",
        "settings.contact": "Contact Us",
        "settings.userGuide": "User Guide",

        // Common
        "common.loading": "Loading...",
        "common.error": "An error occurred",
        "common.noData": "No data available",
        "common.noArrival": "No arrival info",
        "common.arrivingSoon": "Arriving soon",
        "common.startPoint": "Start Point"
    },
};

interface LanguageContextType {
    language: Language;
    setLanguage: (lang: Language) => void;
    t: (key: string) => string;
    formatTime: (minutes: number) => string;
    formatBusNumber: (number: number) => string;
}

const LanguageContext = createContext<LanguageContextType | undefined>(
    undefined
);

interface LanguageProviderProps {
    children: ReactNode;
    language: Language;
    setLanguage: (lang: Language) => void;
}

export function LanguageProvider({
    children,
    language,
    setLanguage,
}: LanguageProviderProps) {
    const t = (key: string): string => {
        return translations[language][key] || key;
    };

    const formatTime = (minutes: number): string => {
        return language === "ko" ? `${minutes}분 남음` : `${minutes}min`;
    };

    const formatBusNumber = (number: number): string => {
        return language === "ko"
            ? `셔틀버스 ${number}`
            : `Shuttle Bus ${number}`;
    };

    return (
        <LanguageContext.Provider
            value={{ language, setLanguage, t, formatTime, formatBusNumber }}
        >
            {children}
        </LanguageContext.Provider>
    );
}

export function useTranslation() {
    const context = useContext(LanguageContext);
    if (!context) {
        throw new Error("useTranslation must be used within LanguageProvider");
    }
    return context;
}

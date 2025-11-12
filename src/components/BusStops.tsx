import { ChevronDown } from "lucide-react";
import { useEffect, useId, useRef, useState } from "react";
import busIconSvg from "../assets/busIcon.svg";
import { useTranslation } from "../contexts/LanguageContext";
import type { BusStop } from "../data/busStops";

type Props = {
    busStops: BusStop[];
    onSelect: (stop: BusStop) => void;
    onBusNumberSelect?: (n: number) => void;
    onToggleBubble?: (stop?: BusStop) => void;
    busCount?: number;
};

export default function BusStops({
    busStops,
    onSelect,
    onBusNumberSelect,
    onToggleBubble,
    busCount = 0,
}: Props) {
    const { t } = useTranslation();
    const [openStops, setOpenStops] = useState(false);
    const [openNumbers, setOpenNumbers] = useState(false);
    const listId = useId();
    const numbersId = useId();

    const [disabled, setDisabled] = useState(false);
    const disableTimeoutRef = useRef<number | null>(null);

    useEffect(() => {
        return () => {
            if (disableTimeoutRef.current !== null) {
                clearTimeout(disableTimeoutRef.current);
                disableTimeoutRef.current = null;
            }
        };
    }, []);

    const handleClick = (action?: () => void) => {
        if (disabled) return;
        setDisabled(true);
        try {
            if (action) action();
        } catch {
            /* ignore */
        }
        if (disableTimeoutRef.current !== null) {
            clearTimeout(disableTimeoutRef.current);
        }
        disableTimeoutRef.current = window.setTimeout(() => {
            setDisabled(false);
            disableTimeoutRef.current = null;
        }, 650);
    };

    const handleNumberClick = (n: number) => {
        if (onBusNumberSelect) onBusNumberSelect(n);
    };

    return (
        <div className="flex w-full flex-col items-start gap-3">
            <div className="flex w-full flex-col items-start">
                <button
                    aria-label="버스 정류장 목록 토글"
                    type="button"
                    aria-expanded={openStops}
                    aria-controls={listId}
                    disabled={disabled}
                    onClick={() =>
                        handleClick(() => {
                            const next = !openStops;
                            setOpenStops(next);
                            if (next) setOpenNumbers(false);
                        })
                    }
                    className="group inline-flex w-full cursor-pointer items-center justify-between gap-3 rounded-lg border-0 bg-transparent px-4 py-3 transition-all duration-200 hover:bg-gray-50 disabled:cursor-not-allowed disabled:opacity-60"
                >
                    <div className="inline-flex items-center gap-3">
                        <div className="flex h-8 w-8 flex-shrink-0 items-center justify-center transition-transform duration-200 group-hover:scale-110">
                            <svg
                                width="32"
                                height="32"
                                viewBox="0 0 24 24"
                                fill="none"
                                stroke="#2563eb"
                                strokeWidth="2.5"
                                strokeLinecap="round"
                                strokeLinejoin="round"
                                role="img"
                                aria-label="정류장 아이콘"
                            >
                                <title>정류장 아이콘</title>
                                <path
                                    d="M20 10c0 4.993-5.539 10.193-7.399 11.799a1 1 0 0 1-1.202 0C9.539 20.193 4 14.993 4 10a8 8 0 0 1 16 0"
                                    fill="#2563eb"
                                />
                                <circle cx="12" cy="10" r="3" fill="white" />
                            </svg>
                        </div>
                        <span
                            className={`font-semibold text-gray-800 text-lg transition-opacity duration-200 ${
                                openStops ? "hidden" : "inline"
                            }`}
                        >
                            {t("busStops.selectStop")}
                        </span>
                    </div>
                    <ChevronDown
                        className={`h-6 w-6 text-gray-600 transition-transform duration-300 ${
                            openStops ? "rotate-180" : "rotate-0"
                        }`}
                    />
                </button>

                <section
                    id={listId}
                    aria-label="버스 정류장 목록"
                    className={`grid w-full origin-top grid-cols-2 gap-3 overflow-hidden transition-[opacity,transform,max-height,margin] duration-300 ease-in-out ${
                        openStops
                            ? "mt-2 max-h-[640px] scale-y-100 opacity-100"
                            : "max-h-0 scale-y-0 opacity-0"
                    }`}
                >
                    {busStops.map((stop) => (
                        <button
                            key={stop.name}
                            type="button"
                            disabled={disabled}
                            onClick={() =>
                                handleClick(() => {
                                    onSelect(stop);
                                    if (onToggleBubble) onToggleBubble(stop);
                                })
                            }
                            className="hover:-translate-y-0.5 min-h-[56px] cursor-pointer rounded-xl border-0 bg-blue-600 px-4 py-4 font-bold text-base text-white transition-all duration-200 hover:bg-blue-700 hover:shadow-lg active:translate-y-0 disabled:cursor-not-allowed disabled:opacity-60 disabled:hover:translate-y-0 disabled:hover:shadow-none"
                        >
                            {t(`busStop.${stop.name}`)}
                        </button>
                    ))}
                </section>
            </div>

            <div className="flex w-full flex-col items-start">
                <button
                    aria-label="버스 번호 선택 토글"
                    type="button"
                    aria-expanded={openNumbers}
                    aria-controls={numbersId}
                    disabled={disabled}
                    onClick={() =>
                        handleClick(() => {
                            const next = !openNumbers;
                            setOpenNumbers(next);
                            if (next) setOpenStops(false);
                        })
                    }
                    className="group inline-flex w-full cursor-pointer items-center justify-between gap-3 rounded-lg border-0 bg-transparent px-4 py-3 transition-all duration-200 hover:bg-gray-50 disabled:cursor-not-allowed disabled:opacity-60"
                >
                    <div className="inline-flex items-center gap-3">
                        <div className="flex h-8 w-8 flex-shrink-0 items-center justify-center transition-transform duration-200 group-hover:scale-110">
                            <img
                                src={busIconSvg}
                                alt="버스"
                                style={{ width: "20px", height: "38px" }}
                            />
                        </div>
                        <span
                            className={`font-semibold text-gray-800 text-lg transition-opacity duration-200 ${
                                openNumbers ? "hidden" : "inline"
                            }`}
                        >
                            {t("busStops.selectBus")}
                        </span>
                    </div>
                    <ChevronDown
                        className={`h-6 w-6 text-gray-600 transition-transform duration-300 ${
                            openNumbers ? "rotate-180" : "rotate-0"
                        }`}
                    />
                </button>

                <section
                    id={numbersId}
                    aria-label="버스 번호 선택"
                    className={`w-full origin-top transition-all duration-300 ease-in-out ${
                        openNumbers
                            ? "mt-2 grid scale-y-100 grid-cols-3 gap-3 opacity-100"
                            : "hidden scale-y-0 opacity-0"
                    }`}
                >
                    {Array.from({ length: busCount }, (_, i) => i + 1).map(
                        (n) => (
                            <button
                                key={n}
                                type="button"
                                disabled={disabled}
                                onClick={() =>
                                    handleClick(() => handleNumberClick(n))
                                }
                                className="hover:-translate-y-0.5 min-h-[56px] cursor-pointer rounded-xl border-0 bg-blue-600 px-4 py-4 font-bold text-base text-white transition-all duration-200 hover:bg-blue-700 hover:shadow-lg active:translate-y-0 disabled:cursor-not-allowed disabled:opacity-60 disabled:hover:translate-y-0 disabled:hover:shadow-none"
                            >
                                {n}
                            </button>
                        )
                    )}
                </section>
            </div>
        </div>
    );
}

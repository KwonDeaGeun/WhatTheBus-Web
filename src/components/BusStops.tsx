import { ChevronDown } from "lucide-react";
import { useEffect, useId, useRef, useState } from "react";
import type { BusStop } from "../data/busStops";

type Props = {
    busStops: BusStop[];
    onSelect: (stop: BusStop) => void;
    onBusNumberSelect?: (n: number) => void;
    onToggleBubble?: (stop?: BusStop) => void;
};

export default function BusStops({
    busStops,
    onSelect,
    onBusNumberSelect,
    onToggleBubble,
}: Props) {
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
                        <div className="flex-shrink-0 transition-transform duration-200 group-hover:scale-110">
                            <img
                                src="/ic_busstop.svg"
                                alt="버스 정류장"
                                width={48}
                                height={48}
                                className="h-12 w-12"
                            />
                        </div>
                        <span
                            className={`font-semibold text-gray-800 text-lg transition-opacity duration-200 ${
                                openStops ? "hidden" : "inline"
                            }`}
                        >
                            버스 정류장 선택하기
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
                    className={`w-full origin-top transition-all duration-300 ease-in-out ${
                        openStops
                            ? "mt-2 grid scale-y-100 grid-cols-3 gap-3 opacity-100"
                            : "hidden scale-y-0 opacity-0"
                    }`}
                >
                    {[
                        { name: "죽전역" },
                        { name: "치과병원" },
                        { name: "정문" },
                    ].map((stop) => (
                        <button
                            key={stop.name}
                            type="button"
                            disabled={disabled}
                            onClick={() =>
                                handleClick(() => {
                                    const realStop = busStops.find(
                                        (s) => s.name === stop.name
                                    );
                                    if (realStop) {
                                        onSelect(realStop);
                                        if (onToggleBubble)
                                            onToggleBubble(realStop);
                                    }
                                })
                            }
                            className="hover:-translate-y-0.5 min-h-[56px] cursor-pointer rounded-xl border-0 bg-blue-600 px-4 py-4 font-bold text-base text-white transition-all duration-200 hover:bg-blue-700 hover:shadow-lg active:translate-y-0 disabled:cursor-not-allowed disabled:opacity-60 disabled:hover:translate-y-0 disabled:hover:shadow-none"
                        >
                            {stop.name}
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
                        <div className="flex-shrink-0 transition-transform duration-200 group-hover:scale-110">
                            <img
                                src="/ic_busfront.svg"
                                alt="버스"
                                width={48}
                                height={48}
                                className="h-12 w-12"
                            />
                        </div>
                        <span
                            className={`font-semibold text-gray-800 text-lg transition-opacity duration-200 ${
                                openNumbers ? "hidden" : "inline"
                            }`}
                        >
                            버스 선택하기
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
                    {[1, 2, 3, 4, 5].map((n) => (
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
                    ))}
                </section>
            </div>
        </div>
    );
}

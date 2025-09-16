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
        // eslint-disable-next-line no-console
        console.log(`Selected bus number: ${n}`);
    };

    return (
        <div
            style={{
                display: "flex",
                flexDirection: "column",
                alignItems: "flex-start",
                width: "100%",
                gap: 8,
            }}
        >
            <div
                style={{ display: "flex", alignItems: "center", width: "100%" }}
            >
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
                    style={{
                        display: "inline-flex",
                        alignItems: "center",
                        gap: 8,
                        padding: "8px 12px",
                        border: "none",
                        background: "transparent",
                        cursor: disabled ? "not-allowed" : "pointer",
                        opacity: disabled ? 0.6 : 1,
                    }}
                >
                    <img
                        src="/ic_busstop.svg"
                        alt="버스 정류장"
                        width={48}
                        height={48}
                    />
                    <span
                        style={{
                            color: "#333",
                            fontSize: "16px",
                            display: openStops ? "none" : "inline",
                        }}
                    >
                        버스 정류장 선택하기
                    </span>
                </button>

                <section
                    id={listId}
                    aria-label="버스 정류장 목록"
                    style={{
                        display: openStops ? "grid" : "none",
                        gridTemplateColumns: "repeat(3, 1fr)",
                        gap: "8px",
                        width: "100%",
                        marginTop: 8,
                    }}
                >
                    {/* 세 개 버튼: 죽전역, 치과병원, 정문 */}
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
                            style={{
                                padding: "16px 12px",
                                minHeight: "48px",
                                backgroundColor: "#007bff",
                                color: "white",
                                border: "none",
                                borderRadius: "4px",
                                cursor: disabled ? "not-allowed" : "pointer",
                                fontSize: "16px",
                                fontWeight: "bold",
                                opacity: disabled ? 0.6 : 1,
                            }}
                        >
                            {stop.name}
                        </button>
                    ))}
                </section>
            </div>

            <div
                style={{ display: "flex", alignItems: "center", width: "100%" }}
            >
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
                    style={{
                        display: "inline-flex",
                        alignItems: "center",
                        gap: 8,
                        padding: "8px 12px",
                        border: "none",
                        background: "transparent",
                        cursor: disabled ? "not-allowed" : "pointer",
                        opacity: disabled ? 0.6 : 1,
                    }}
                >
                    <img
                        src="/ic_busfront.svg"
                        alt="버스"
                        width={48}
                        height={48}
                    />
                    <span
                        style={{
                            color: "#333",
                            fontSize: "16px",
                            display: openNumbers ? "none" : "inline",
                        }}
                    >
                        버스 선택하기
                    </span>
                </button>

                <section
                    id={numbersId}
                    aria-label="버스 번호 선택"
                    style={{
                        display: openNumbers ? "grid" : "none",
                        gridTemplateColumns: "repeat(3, 1fr)",
                        gap: "8px",
                        width: "100%",
                        marginTop: 8,
                        alignItems: "center",
                    }}
                >
                    {[1, 2, 3, 4, 5].map((n) => (
                        <button
                            key={n}
                            type="button"
                            disabled={disabled}
                            onClick={() =>
                                handleClick(() => handleNumberClick(n))
                            }
                            style={{
                                padding: "16px 12px",
                                minHeight: "48px",
                                backgroundColor: "#007bff",
                                color: "white",
                                border: "none",
                                borderRadius: "4px",
                                cursor: disabled ? "not-allowed" : "pointer",
                                fontSize: "16px",
                                fontWeight: "bold",
                                transition: "background-color 0.15s ease",
                                opacity: disabled ? 0.6 : 1,
                            }}
                            onPointerEnter={(e) => {
                                if (disabled) return;
                                e.currentTarget.style.backgroundColor =
                                    "#0056b3";
                            }}
                            onPointerLeave={(e) => {
                                if (disabled) return;
                                e.currentTarget.style.backgroundColor =
                                    "#007bff";
                            }}
                        >
                            {n}
                        </button>
                    ))}
                </section>
            </div>
        </div>
    );
}

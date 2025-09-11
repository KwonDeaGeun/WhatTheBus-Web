import { useId, useState } from "react";
import type { BusStop } from "../data/busStops";

type Props = {
    busStops: BusStop[];
    onSelect: (stop: BusStop) => void;
    onBusNumberSelect?: (n: number) => void;
};

export default function BusStops({
    busStops,
    onSelect,
    onBusNumberSelect,
}: Props) {
    const [openStops, setOpenStops] = useState(false);
    const [openNumbers, setOpenNumbers] = useState(false);
    const listId = useId();
    const numbersId = useId();

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
                    onClick={() => {
                        const next = !openStops;
                        setOpenStops(next);
                        if (next) setOpenNumbers(false);
                    }}
                    style={{
                        display: 'inline-flex',
                        alignItems: 'center',
                        gap: 8,
                        padding: '8px 12px',
                        border: 'none',
                        background: 'transparent',
                        cursor: 'pointer',
                    }}
                >
                    <img
                        src="/ic_busstop.svg"
                        alt="버스 정류장"
                        width={48}
                        height={48}
                    />
                    <span style={{ color: '#333', fontSize: 14, display: openStops ? 'none' : 'inline' }}>버스 정류장 선택하기</span>
                </button>

                <section
                    id={listId}
                    aria-label="버스 정류장 목록"
                    style={{
                        display: openStops ? "grid" : "none",
                        gridTemplateColumns: "repeat(2, 1fr)",
                        gap: "8px",
                        width: '100%',
                        marginTop: 8,
                    }}
                >
                    {busStops.map((stop) => (
                        <button
                            key={stop.name}
                            type="button"
                            onClick={() => {
                                onSelect(stop);
                            }}
                            style={{
                                padding: "8px 12px",
                                backgroundColor: "#007bff",
                                color: "white",
                                border: "none",
                                borderRadius: "4px",
                                cursor: "pointer",
                                fontSize: "14px",
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
                    onClick={() => {
                        const next = !openNumbers;
                        setOpenNumbers(next);
                        if (next) setOpenStops(false);
                    }}
                    style={{
                        display: 'inline-flex',
                        alignItems: 'center',
                        gap: 8,
                        padding: '8px 12px',
                        border: 'none',
                        background: 'transparent',
                        cursor: 'pointer',
                    }}
                >
                    <img
                        src="/ic_busfront.svg"
                        alt="버스"
                        width={48}
                        height={48}
                    />
                    <span style={{ color: '#333', fontSize: 14, display: openNumbers ? 'none' : 'inline' }}>버스 선택하기</span>
                </button>

                <section
                    id={numbersId}
                    aria-label="버스 번호 선택"
                    style={{
                        display: openNumbers ? "grid" : "none",
                        gridTemplateColumns: "repeat(2, 1fr)",
                        gap: "8px",
                        width: '100%',
                        marginTop: 8,
                        alignItems: "center",
                    }}
                >
                    {[1, 2, 3, 4, 5].map((n) => (
                        <button
                            key={n}
                            type="button"
                            onClick={() => handleNumberClick(n)}
                            style={{
                                padding: "8px 12px",
                                backgroundColor: "#007bff",
                                color: "white",
                                border: "none",
                                borderRadius: "4px",
                                cursor: "pointer",
                                fontSize: "14px",
                                transition: "background-color 0.15s ease",
                            }}
                            onPointerEnter={(e) => {
                                e.currentTarget.style.backgroundColor = "#0056b3";
                            }}
                            onPointerLeave={(e) => {
                                e.currentTarget.style.backgroundColor = "#007bff";
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

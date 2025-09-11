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
    setOpenNumbers(false);
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
                        width: 48,
                        height: 48,
                        padding: 0,
                        border: "none",
                        background: "transparent",
                        cursor: "pointer",
                    }}
                >
                    <img
                        src="/ic_busstop.svg"
                        alt="버스 정류장"
                        width={48}
                        height={48}
                    />
                </button>

                <section
                    id={listId}
                    aria-label="버스 정류장 목록"
                    style={{
                        display: openStops ? "flex" : "none",
                        flexWrap: "wrap",
                        gap: "8px",
                        marginLeft: 12,
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
                        width: 48,
                        height: 48,
                        padding: 0,
                        border: "none",
                        background: "transparent",
                        cursor: "pointer",
                    }}
                >
                    <img
                        src="/ic_busfront.svg"
                        alt="버스"
                        width={48}
                        height={48}
                    />
                </button>

                <section
                    id={numbersId}
                    aria-label="버스 번호 선택"
                    style={{
                        display: openNumbers ? "flex" : "none",
                        gap: "8px",
                        marginLeft: 12,
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

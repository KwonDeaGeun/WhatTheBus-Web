import { useId, useState } from "react";
import type { BusStop } from "../data/busStops";

type Props = {
    busStops: BusStop[];
    onSelect: (stop: BusStop) => void;
};

export default function BusStops({ busStops, onSelect }: Props) {
    const [open, setOpen] = useState(false);
    const listId = useId();

    return (
        <div style={{ display: 'flex', alignItems: 'center', width: '100%' }}>
            <button
                type="button"
                aria-expanded={open}
                aria-controls={listId}
                onClick={() => setOpen((s) => !s)}
                style={{
                    width: 48,
                    height: 48,
                    padding: 0,
                    border: 'none',
                    background: 'transparent',
                    cursor: 'pointer'
                }}
            >
                <img src="/ic_busstop.svg" alt="버스 정류장" width={48} height={48} />
            </button>

            <section id={listId} aria-label="버스 정류장 목록" style={{
                display: open ? 'flex' : 'none',
                flexWrap: 'wrap',
                gap: '8px',
                marginLeft: 12
            }}>
                {busStops.map((stop) => (
                    <button
                        key={stop.name}
                        type="button"
                        onClick={() => {
                            onSelect(stop);
                            setOpen(false);
                        }}
                        style={{
                            padding: '8px 12px',
                            backgroundColor: '#007bff',
                            color: 'white',
                            border: 'none',
                            borderRadius: '4px',
                            cursor: 'pointer',
                            fontSize: '14px'
                        }}
                        onMouseOver={(e) => { e.currentTarget.style.backgroundColor = '#0056b3'; }}
                        onMouseOut={(e) => { e.currentTarget.style.backgroundColor = '#007bff'; }}
                        onFocus={(e) => { e.currentTarget.style.backgroundColor = '#0056b3'; }}
                        onBlur={(e) => { e.currentTarget.style.backgroundColor = '#007bff'; }}
                    >
                        {stop.name}
                    </button>
                ))}
            </section>
        </div>
    );
}

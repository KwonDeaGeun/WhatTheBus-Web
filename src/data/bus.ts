export interface Bus {
    shuttleId: string;
    lat: number;
    lng: number;
    direction: string | null;
}

export const buses: ReadonlyArray<Bus> = [
    {
        shuttleId: "bus1",
        lat: 37.323494,
        lng: 127.123008,
        direction: null,
    },
    {
        shuttleId: "bus2",
        lat: 37.323637,
        lng: 127.120047,
        direction: "단국대학교",
    },
    {
        shuttleId: "bus3",
        lat: 37.323779,
        lng: 127.117087,
        direction: "죽전역",
    },
    {
        shuttleId: "bus4",
        lat: 37.323921,
        lng: 127.114126,
        direction: "단국대학교",
    },
    {
        shuttleId: "bus5",
        lat: 37.324063,
        lng: 127.111166,
        direction: "죽전역",
    },
];

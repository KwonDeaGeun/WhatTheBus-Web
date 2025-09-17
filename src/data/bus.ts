export interface Bus {
    id: number;
    name: string;
    lat: number;
    lng: number;
    direction: string;
}

export const buses: ReadonlyArray<Bus> = [
    { id: 1, name: "bus1", lat: 37.323494, lng: 127.123008, direction: "죽전역" },
    { id: 2, name: "bus2", lat: 37.323637, lng: 127.120047, direction: "단국대학교" },
    { id: 3, name: "bus3", lat: 37.323779, lng: 127.117087, direction: "죽전역" },
    { id: 4, name: "bus4", lat: 37.323921, lng: 127.114126, direction: "단국대학교" },
    { id: 5, name: "bus5", lat: 37.324063, lng: 127.111166, direction: "죽전역" },
];

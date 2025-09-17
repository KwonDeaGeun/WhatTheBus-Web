export interface Bus {
    name: string;
    lat: number;
    lng: number;
    content: string;
}

export const busStops: Bus[] = [
    { name: "bus1", lat: 37.323494, lng: 127.123008, content: "죽전역" },
    { name: "bus2", lat: 37.323637, lng: 127.120047, content: "단국대학교" },
    { name: "bus3", lat: 37.323779, lng: 127.117087, content: "죽전역" },
    { name: "bus4", lat: 37.323921, lng: 127.114126, content: "단국대학교" },
    { name: "bus5", lat: 37.324063, lng: 127.111166, content: "죽전역" },
];

export interface Shuttle {
    shuttleId: string;
    lat: number;
    lng: number;
    direction: boolean | null;
}

export interface ArrivalBus {
    routeName: string;
    minutesLeft: number | null;
    remainingSeats: number | null;
}

export interface ArrivalStop {
    stopCode: string;
    stopName: string;
    buses: ArrivalBus[];
}

export interface ArrivalsResponse {
    updatedAt: string;
    stops: ArrivalStop[];
}

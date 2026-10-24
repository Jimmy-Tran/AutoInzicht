export type Vehicle = {
    kenteken: string;
    merk: string;
    handelsbenaming: string;
    voertuigsoort: string;
    eerste_kleur: string;
    massa_rijklaar: number;
    aantal_zitplaatsen: number;
}

export async function getVehicle(plate: string): Promise<Vehicle> {
    const response = await fetch(`/api/vehicle/${plate}`);
    if (!response.ok) {
        throw new Error(`Failed to fetch vehicle data for plate ${plate}`);
    }
    const data: Vehicle = await response.json();
    return data;
}
export type Vehicle = {
  kenteken: string | null;
  merk: string | null;
  handelsbenaming: string | null;
  voertuigsoort: string | null;

  datum_eerste_toelating_dt: string | null;
  vervaldatum_apk_dt: string | null;

  eerste_kleur: string | null;
  aantal_zitplaatsen: string | null;
  aantal_deuren: string | null;
  inrichting: string | null;

  aantal_cilinders: number | null;
  cilinderinhoud: number | null;

  massa_ledig_voertuig: number | null;
  massa_rijklaar: number | null;

  tellerstandoordeel: string | null;
  openstaande_terugroepactie_indicator: boolean | null;
  wam_verzekerd: string | null;
  typegoedkeuringsnummer: string;
  variant: string;
  uitvoering: string;
};

export type VehicleFuelType = {
  brandstof_omschrijving: string | null;
  uitlaatemissieniveau: string | null;
};

export type VehicleGearbox = {
  codetypeversnellingsbak: string;
  aantalversnellingenondergrens: number | null;
  aantalversnellingbovengrens: number | null;
};

const apiUrl = import.meta.env.VITE_API_URL ?? "http://127.0.0.1:8000";

export async function getVehicle(plate: string, signal?: AbortSignal): Promise<Vehicle> {
    const normalizedPlate = plate
      .toUpperCase()
      .replace(/[\s-]/g, "");

    if (!/^[A-Z0-9]{6}$/.test(normalizedPlate)) {
        throw new Error("Kenteken is onjuiste formaat.");
    }
  
  const response = await fetch(
    `${apiUrl}/api/vehicle/${encodeURIComponent(normalizedPlate)}`,
    {
      signal
    }
  );

  if (!response.ok) {
    throw new Error(`Failed to fetch vehicle data for plate ${plate}`);
  }

  const data: { info: Vehicle } = await response.json();

  return data.info;
}

export async function getVehicleFuelType(plate: string, signal?: AbortSignal): Promise<VehicleFuelType> {
    const normalizedPlate = plate
      .toUpperCase()
      .replace(/[\s-]/g, "");

    if (!/^[A-Z0-9]{6}$/.test(normalizedPlate)) {
        throw new Error("Kenteken is onjuiste formaat.");
    }


    const response = await fetch(
    `${apiUrl}/api/vehiclefueltype/${encodeURIComponent(normalizedPlate)}`,
    {
      signal
    }
  );

  if (!response.ok) {
    throw new Error(`Failed to fetch vehicle data for plate ${plate}`);
  }
  
  const data: {info: VehicleFuelType } = await response.json();

  return data.info;
}

export async function getGearbox(typegoedkeuringsnummer: string, variant: string, uitvoering: string, signal?: AbortSignal): Promise<VehicleGearbox> {
    const searchParams = new URLSearchParams({
        typegoedkeuringsnummer,
        variant,
        uitvoering
    });


    const response = await fetch(
    `${apiUrl}/api/vehiclegearbox?${searchParams.toString()}`,
    {
      signal
    }
  );

  if (!response.ok) {
    throw new Error(`Failed to fetch vehicle data`);
  }
  
  const data: {info: VehicleGearbox } = await response.json();

  return data.info;
}

export function getTransmissionType(codetypeversnellingsbak: string): string {
    switch (codetypeversnellingsbak) {
        case "A":
            return "Automaat";
        case "D":
            return "Automaat (Dubbele Koppeling / DSG)";
        case "C":
            return "'Continu Variabel (CVT)";
        case "CVT":
            return "Continu Variabel (CVT)";
        default:
            return "Handgeschakeld";
    }
}

export function capitalizeFirstLetter(str: string): string {
  return str.charAt(0).toUpperCase() + str.slice(1).toLowerCase();
}
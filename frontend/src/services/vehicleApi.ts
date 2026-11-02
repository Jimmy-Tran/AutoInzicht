export type Vehicle = {
    kenteken: string | null;
    merk: string | null;
    handelsbenaming: string | null;
    voertuigsoort: string | null;

    type: string | null;
    typegoedkeuringsnummer: string | null;
    variant: string | null;
    uitvoering: string | null;
    volgnummer_wijziging_eu_typegoedkeuring: string | null;

    datum_eerste_toelating_dt: string | null;
    datum_eerste_tenaamstelling_in_nederland_dt: string | null;
    datum_tenaamstelling_dt: string | null;
    vervaldatum_apk_dt: string | null;

    eerste_kleur: string;
    tweede_kleur: string;
    inrichting: string;
    aantal_zitplaatsen: string;
    aantal_deuren: string;
    aantal_wielen: string;
    wielbasis: string;

    aantal_cilinders: string;
    cilinderinhoud: string;
    vermogen_massarijklaar: string;

    massa_ledig_voertuig: string;
    massa_rijklaar: string;
    technische_max_massa_voertuig: string;
    toegestane_maximum_massa_voertuig: string;
    maximum_massa_samenstelling: string;
    maximum_trekken_massa_geremd: string;
    maximum_massa_trekken_ongeremd: string;

    bruto_bpm: string;
    europese_voertuigcategorie: string | null;
    zuinigheidsclassificatie: string | null;
    export_indicator: string | null;
    taxi_indicator: string | null;
    tenaamstellen_mogelijk: string | null;
    wacht_op_keuren: string | null;

    openstaande_terugroepactie_indicator: string | null;
    wam_verzekerd: string | null;

    tellerstandoordeel: string | null;
    code_toelichting_tellerstandoordeel: string | null;
    jaar_laatste_registratie_tellerstand: string;
    plaats_chassisnummer: string | null;
    image_url: string | null;
};

type VehicleApiResponse = {
    vehicle_license_plate: string;
    info: Omit<Vehicle, "image_url">;
    image_url: string | null;
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

export async function getVehicle(
    plate: string,
    signal?: AbortSignal
): Promise<Vehicle> {
    const normalizedPlate = plate
        .toUpperCase()
        .replace(/[\s-]/g, "");

    if (!/^[A-Z0-9]{6}$/.test(normalizedPlate)) {
        throw new Error("Kenteken is onjuiste formaat.");
    }

    const response = await fetch(
        `${apiUrl}/api/vehicle/${encodeURIComponent(normalizedPlate)}`,
        { signal }
    );

    if (!response.ok) {
        throw new Error(`Failed to fetch vehicle data for plate ${plate}`);
    }

    const data: VehicleApiResponse = await response.json();

    return {
        ...data.info,
        image_url: data.image_url,
    };
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
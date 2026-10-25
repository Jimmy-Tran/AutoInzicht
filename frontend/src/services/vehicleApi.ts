export type Vehicle = {
  merk: string | null;
  handelsbenaming: string | null;
  kenteken: string | null;
  eerste_kleur: string | null;
  datum_eerste_toelating_dt: string | null;
  inrichting: string | null;
  voertuigsoort: string | null;
  aantal_zitplaatsen: number | null;
  aantal_deuren: number | null;
  cilinderinhoud: number | null;
  aantal_cilinders: number | null;
  massa_ledig_voertuig: number | null;
  massa_rijklaar: number | null;
  maximum_trekken_massa_geremd: number | null;
  maximum_massa_trekken_ongeremd: number | null;
  vervaldatum_apk_dt: string | null;
  openstaande_terugroepactie_indicator: boolean | null;
  tellerstandoordeel: string | null;
  jaar_laatste_registratie_tellerstand: number | null;
  datum_eerste_tenaamstelling_in_nederland_dt: string | null;
  tenaamstellen_mogelijk: boolean | null;
  export_indicator: boolean | null;
  wam_verzekerd: boolean | null;
};

export async function getVehicle(plate: string, signal?: AbortSignal): Promise<Vehicle> {
  const apiUrl = import.meta.env.VITE_API_URL ?? "http://127.0.0.1:8000";
  const response = await fetch(
    `${apiUrl}/api/vehicle/${encodeURIComponent(plate)}`,
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
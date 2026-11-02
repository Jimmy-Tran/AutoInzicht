import Header from '../components/layout/Header'
import Cards from '../components/vehicle/Cards'
import VehicleStats from '../components/vehicle/VehicleStats'
import { useParams } from 'react-router-dom'
import {
    getVehicle,
    getVehicleFuelType,
    capitalizeFirstLetter,
    getGearbox,
    getTransmissionType,
    type Vehicle,
    type VehicleFuelType,
    type VehicleGearbox
} from '../services/vehicleApi'
import { useEffect, useState } from 'react';
import '../styles/VehiclePage.css';
import VehicleTabs from '../components/vehicle/VehicleTabs';

export default function VehiclePage() {
    const { license } = useParams<{ license: string }>();

    const [vehicle, setVehicle] = useState<Vehicle | null>(null);
    const [vehicleFuelType, setVehicleFuelType] = useState<VehicleFuelType | null>(null);
    const [gearbox, setGearbox] = useState<VehicleGearbox | null>(null);
    const [loading, setLoading] = useState<boolean>(true);
    const [error, setError] = useState<string | null>(null);

    useEffect(() => {
        const controller = new AbortController();

        async function fetchVehicle() {
            setLoading(true);
            setError(null);
            setVehicle(null);
            setVehicleFuelType(null);
            if (!license) {
                setError('No license plate provided');
                setLoading(false);
                return;
            }

            try {
                const vehicleData = await getVehicle(license, controller.signal);
                const vehicleFuelTypeData = await getVehicleFuelType(license, controller.signal);
                const gearboxData = await getGearbox(
                    vehicleData.typegoedkeuringsnummer,
                    vehicleData.variant,
                    vehicleData.uitvoering,
                    controller.signal
                );

                if(!controller.signal.aborted) {
                    setVehicle(vehicleData);
                    setVehicleFuelType(vehicleFuelTypeData);
                    setGearbox(gearboxData);
                }
            } catch (err) {
                if (!controller.signal.aborted) {
                    setError("Er is iets misgegaan bij het ophalen van de voertuiggegevens.");
                }
            } finally {
                if (!controller.signal.aborted) {
                    setLoading(false);
                }
            }

        }

        fetchVehicle();

        return () => controller.abort();

    }, [license]);

                useEffect(() => {
            console.log('Vehicle data:', vehicle, 'Vehicle image URL:', vehicle?.image_url);
            console.log('Vehicle fuel type data:', vehicleFuelType);
            console.log('Vehicle gearbox data:', gearbox);
            }, [vehicle, vehicleFuelType, gearbox]);

    return(
        <>
        <section className="hero">
            <Header />
            <main className="vehicle-page">
                <div className="vehicle-image">
                    {!loading && !error && vehicle && vehicle.image_url && (
                        <img src={vehicle.image_url} alt={`Voertuig ${license}`} />
                    )}
                    {!loading && !error && vehicle && !vehicle.image_url && (
                        <img src="../../images/car-placeholder.png" alt="Voertuig" />
                    )}
                </div>
                <div className="vehicle-info">
                    <div className="license-plate" aria-label={`Kenteken ${license}`}>
                        <div className="license-plate__country" aria-hidden="true">
                                <span className="license-plate__stars">★</span>
                                <span className="license-plate__nl">NL</span>
                        </div>
                                <span className="license-plate__number">
                                    {license}
                                </span>
                    </div>
                    {loading && <p>Loading...</p>}
                    {!loading && !error && vehicle && vehicleFuelType && gearbox && (
                        <>
                        <div className="vehicle-details">
                            <div>
                                <h2>{capitalizeFirstLetter(vehicle.merk + ' ' + vehicle.handelsbenaming || 'Onbekend')}</h2>
                                <p>{capitalizeFirstLetter(vehicle.eerste_kleur || 'Onbekend')}</p>
                            </div>
                            <Cards 

                                vehicleType={capitalizeFirstLetter(vehicle.inrichting || 'Onbekend')}
                                fuelType={vehicleFuelType.brandstof_omschrijving || 'Onbekend'}
                                transmission={getTransmissionType(gearbox.codetypeversnellingsbak)}
                            />
                        </div>
                        <VehicleStats 
                            datum_eerste_toelating_dt={vehicle.datum_eerste_toelating_dt}
                            aantal_zitplaatsen={vehicle.aantal_zitplaatsen}
                            wam_verzekerd={vehicle.wam_verzekerd}
                        />
                        </>
                    )}
                    {!loading && error && <p>{error}</p>}
                </div>
            </main>
            {!loading && !error && vehicle && (
                <VehicleTabs vehicle={vehicle} />
            )}  
        </section>
        </>
    )
}
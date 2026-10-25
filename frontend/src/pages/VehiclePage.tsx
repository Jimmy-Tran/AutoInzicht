import Header from '../components/layout/Header'
import { useParams } from 'react-router-dom'
import {
    getVehicle,
    type Vehicle
} from '../services/vehicleApi'
import { useEffect, useState } from 'react';

export default function VehiclePage() {
    const { license } = useParams<{ license: string }>();

    const [vehicle, setVehicle] = useState<Vehicle | null>(null);
    const [loading, setLoading] = useState<boolean>(true);
    const [error, setError] = useState<string | null>(null);

    useEffect(() => {
        const controller = new AbortController();

        async function fetchVehicle() {
            setLoading(true);
            setError(null);
            setVehicle(null);

            if (!license) {
                setError('No license plate provided');
                setLoading(false);
                return;
            }

            try {
                const vehicleData = await getVehicle(license, controller.signal);

                if(!controller.signal.aborted) {
                    setVehicle(vehicleData);
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

    return(
        <>
        <section className="hero">
            <Header />
            <p>{vehicle?.merk}</p>
        </section>
        </>
    )
}
import {
    CalendarDays,
    CheckCircle,
    CircleAlert,
    Globe,
    Euro,
    ArrowLeftRight,
    TriangleAlert,
    Gauge,
    ShieldCheck,
} from 'lucide-react';

import type { ElementType, ReactNode } from 'react';
import type { Vehicle } from '../../services/vehicleApi';
import '../../styles/VehicleAlgemeenTab.css';

type Props = {
    vehicle: Vehicle;
};

type InfoCardProps = {
    icon: ElementType;
    title: string;
    children: ReactNode;
};

function InfoCard({ icon: Icon, title, children }: InfoCardProps) {
    return (
        <article className="vehicle-info-card">
            <div className="vehicle-info-card__header">
                <div className="vehicle-info-card__icon">
                    <Icon size={23} strokeWidth={2} />
                </div>

                <h3>{title}</h3>
            </div>

            <div className="vehicle-info-card__content">
                {children}
            </div>
        </article>
    );
}

type DataItemProps = {
    label: string;
    value: string | number | null | undefined;
};

function DataItem({ label, value }: DataItemProps) {
    return (
        <div className="vehicle-data-item">
            <span className="vehicle-data-item__label">
                {label}
            </span>

            <strong className="vehicle-data-item__value">
                {value === null || value === undefined || value === ''
                    ? '-'
                    : value}
            </strong>
        </div>
    );
}

function formatDate(date: string | null | undefined): string {
    if (!date) return '-';

    const parsedDate = new Date(date);

    if (Number.isNaN(parsedDate.getTime())) {
        return date;
    }

    return new Intl.DateTimeFormat('nl-NL', {
        day: 'numeric',
        month: 'short',
        year: 'numeric',
        timeZone: 'UTC',
    }).format(parsedDate);
}

export default function VehicleAlgemeenTab({ vehicle }: Props) {
    const apkDate = vehicle.vervaldatum_apk_dt;

    const apkExpired = apkDate
        ? new Date(apkDate) < new Date(new Date().toDateString())
        : null;

    const ApkIcon = apkExpired === false ? CheckCircle : CircleAlert;

    return (
        <section className="vehicle-overview">
            <div className="vehicle-overview__grid">

                <InfoCard icon={ApkIcon} title="APK">
                    <span
                        className={`vehicle-status ${
                            apkExpired === false
                                ? 'vehicle-status--valid'
                                : apkExpired === true
                                    ? 'vehicle-status--expired'
                                    : 'vehicle-status--unknown'
                        }`}
                    >
                        {apkExpired === false
                            ? 'Geldig'
                            : apkExpired === true
                                ? 'Verlopen'
                                : 'Onbekend'}
                    </span>

                    <DataItem
                        label="Geldig tot"
                        value={formatDate(apkDate)}
                    />
                </InfoCard>

                <InfoCard
                    icon={CalendarDays}
                    title="Datum eerste toelating"
                >
                    <div className="vehicle-card__main-value">
                        {formatDate(vehicle.datum_eerste_toelating_dt)}
                    </div>

                    <span className="vehicle-data-item__label">
                        Eerste toelating
                    </span>
                </InfoCard>

                <InfoCard
                    icon={Globe}
                    title="Europese categorie"
                >
                    <div className="vehicle-card__main-value">
                        {vehicle.europese_voertuigcategorie || '-'}
                    </div>

                    <span className="vehicle-data-item__label">
                        {vehicle.europese_voertuigcategorie === 'M1'
                            ? 'Personenvervoer'
                            : 'Europese voertuigcategorie'}
                    </span>
                </InfoCard>

                <InfoCard icon={Euro} title="BPM">
                    <DataItem
                        label="Bruto BPM"
                        value={"€" + vehicle.bruto_bpm}
                    />
                </InfoCard>

                <InfoCard icon={ArrowLeftRight} title="Export">
                    <div className="vehicle-card__main-value">
                        {vehicle.export_indicator}
                    </div>
                </InfoCard>

                <InfoCard icon={TriangleAlert} title="Terugroepactie">
                    <div className="vehicle-card__main-value">
                        {vehicle.openstaande_terugroepactie_indicator}
                    </div>
                    {vehicle.openstaande_terugroepactie_indicator === 'Ja' && (
                        <span className="vehicle-data-item__label">
                            Er is een openstaande terugroepactie voor dit voertuig. Neem contact op met de dealer voor meer informatie.
                        </span>
                    )}
                </InfoCard>

                <InfoCard icon={Gauge} title="Tellerstand oordeel">
                    <DataItem
                        label=""
                        value={vehicle.tellerstandoordeel || '-'}
                    />
                    <span className="vehicle-data-item__label">
                        Laatste registratie: {vehicle.jaar_laatste_registratie_tellerstand || '-'}
                        </span>
                </InfoCard>

                <InfoCard icon={ShieldCheck} title="WAM Verzekerd">
                    <DataItem
                        label=""
                        value={vehicle.wam_verzekerd || '-'}
                    />
                </InfoCard>

            </div>
        </section>
    );
}
import '../../styles/VehicleStats.css'

type VehicleStatsProps = {
    datum_eerste_toelating_dt: string | null;
    aantal_zitplaatsen: string | null;
    wam_verzekerd: string | null;
};

export default function VehicleStats({ datum_eerste_toelating_dt, aantal_zitplaatsen, wam_verzekerd }: VehicleStatsProps) {
    const formattedDate = datum_eerste_toelating_dt ? new Date(datum_eerste_toelating_dt).toLocaleDateString('nl-NL') : 'Onbekend';
    const stats = [
        { label: 'Datum eerste toelating', value: formattedDate },
        { label: 'Aantal zitplaatsen', value: aantal_zitplaatsen || 'Onbekend' },
        { label: 'WAM verzekerd', value: wam_verzekerd === 'Ja' ? 'Ja' : 'Nee' },
    ];

    return (<div className="vehicle-stats">
        {stats.map((stat) => (
            <div key={stat.label} className="vehicle-stats__item">
                <div className="vehicle-stats__item" key={stat.label}>
                    <strong className="vehicle-stats__value">
                        {stat.value}
                    </strong>

                    <span className="vehicle-stats__label">
                        {stat.label}
                    </span>
                </div>
            </div>
        ))}
    </div>);
}
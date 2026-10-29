import { Engine, Fuel, CarFront, Icon } from 'lucide-react';
import '../../styles/Cards.css';

type VehicleBadgesProps = {
  vehicleType: string | null;
  fuelType: string | null;
  transmission: string | null;
};


export default function Cards({
    vehicleType,
    fuelType,
    transmission,
} : VehicleBadgesProps) {
    const badges = [
        {
            label: vehicleType,
            icon: CarFront,
        },
        {
            label: fuelType,
            icon: Fuel,
        },
        {
            label: transmission,
            icon: Engine,
        }
    ]

    return(
        <>
            <div className="card">
                {badges.map(({label, icon: Icon}) => 
                label ? (
                    <div className="badge" key={label}>
                        <Icon size={16} strokeWidth={2} />
                        <span>{label}</span>
                    </div>
                ) : null
                )}
            </div>
        </>
    )

}
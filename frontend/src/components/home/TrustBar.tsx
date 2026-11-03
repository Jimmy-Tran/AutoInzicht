import {
    Database, CarFront, ShieldCheck,
} from 'lucide-react';
import "../../styles/TrustBar.css"

const items = [
    {
        icon: Database,
        label: "RDW open  data",
    },
    {
        icon: CarFront,
        label: "Inzicht in voertuiggegevens",
    },
    {
        icon: ShieldCheck,
        label: "Gratis kentekencheck",
    },
];

export default function TrustBar() {
    return (
        <div className="trust-bar">
            {items.map((item, index) => {
                const Icon = item.icon;
                return (
                    <div className="trust-item" key={index}>
                        <Icon size={24} />
                        <span className="trust-label">{item.label}</span>
                    </div>
                )
            })}
            </div>
    )
}
import '../../styles/VehicleTabs.css';
import { useState } from 'react';
import VehicleAlgemeenTab from './VehicleAlgemeenTab';
import type { Vehicle } from '../../services/vehicleApi';

export type vehicleTab = 'algemeen' | 'technisch' | 'geschiedenis';

export default function VehicleTabs({ vehicle }: { vehicle: Vehicle }) {
    const [activeTab, setActiveTab] = useState<vehicleTab>('algemeen');
    
    const tabs: 
    {
        id: vehicleTab;
        label: string;
    }[] = [
        { id: 'algemeen', label: 'Algemeen' },
        { id: 'technisch', label: 'Technisch' },
        { id: 'geschiedenis', label: 'Geschiedenis' },
    ];

    return(
        <section className="vehicle-tabs">
            <div className="vehicle-tabs__header">
                {tabs.map((tab) => (
                    <button
                        key={tab.id}
                        className={`vehicle-tabs__button ${activeTab === tab.id ? 'vehicle-tabs__button--active' : ''}`}
                        onClick={() => setActiveTab(tab.id)}
                    >
                        {tab.label}
                    </button>
                ))}
            </div>
            <div className="vehicle-tabs__content">
                {activeTab === 'algemeen' && (
                    <VehicleAlgemeenTab vehicle={vehicle} />
                )}
                </div>
        </section>
    )
}
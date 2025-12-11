import React from 'react';
import { Calendar as CalendarIcon, Clock, Sun } from 'lucide-react';
import '../../styles/ViewSwitcher.css';

const ViewSwitcher = ({ currentView, onViewChange }) => {
    const views = [
        { id: 'dayGridMonth', label: 'Month', icon: CalendarIcon },
        { id: 'timeGridWeek', label: 'Week', icon: Clock },
        { id: 'timeGridDay', label: 'Day', icon: Sun },
    ];

    return (
        <div className="view-switcher">
            {views.map((view) => {
                const Icon = view.icon;
                return (
                    <button
                        key={view.id}
                        className={`view-button ${currentView === view.id ? 'active' : ''}`}
                        onClick={() => onViewChange(view.id)}
                    >
                        <Icon size={16} />
                        <span>{view.label}</span>
                    </button>
                );
            })}
        </div>
    );
};

export default ViewSwitcher;

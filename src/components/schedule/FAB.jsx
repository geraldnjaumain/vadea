import React from 'react';
import { Plus } from 'lucide-react';
import '../styles/FAB.css';

const FAB = ({ onClick }) => {
    return (
        <button className="fab" onClick={onClick} aria-label="Add event">
            <Plus size={24} />
        </button>
    );
};

export default FAB;

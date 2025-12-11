import React, { useState, useRef, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Settings, LogOut, User } from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import { supabase } from '../lib/supabaseClient';
import '../styles/ProfileDropdown.css';

const ProfileDropdown = () => {
    const { user } = useAuth();
    const navigate = useNavigate();
    const [isOpen, setIsOpen] = useState(false);
    const dropdownRef = useRef(null);

    // Close dropdown when clicking outside
    useEffect(() => {
        const handleClickOutside = (event) => {
            if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
                setIsOpen(false);
            }
        };

        if (isOpen) {
            document.addEventListener('mousedown', handleClickOutside);
        }

        return () => {
            document.removeEventListener('mousedown', handleClickOutside);
        };
    }, [isOpen]);

    const handleLogout = async () => {
        await supabase.auth.signOut();
        navigate('/login');
    };

    const getInitials = () => {
        const name = user?.user_metadata?.full_name || user?.email || 'User';
        return name.split(' ').map(n => n[0]).join('').toUpperCase().slice(0, 2);
    };

    return (
        <div className="profile-dropdown-container" ref={dropdownRef}>
            <button
                className="profile-trigger"
                onClick={() => setIsOpen(!isOpen)}
                aria-label="Open profile menu"
            >
                <div className="profile-avatar">
                    {user?.user_metadata?.avatar_url ? (
                        <img src={user.user_metadata.avatar_url} alt="Profile" />
                    ) : (
                        <div className="profile-initials">{getInitials()}</div>
                    )}
                </div>
                <div className="profile-info">
                    <div className="profile-name">{user?.user_metadata?.full_name || 'User'}</div>
                    <div className="profile-email">{user?.email}</div>
                </div>
            </button>

            {isOpen && (
                <div className="profile-dropdown-menu">
                    <Link to="/app/settings" className="dropdown-item" onClick={() => setIsOpen(false)}>
                        <Settings size={18} />
                        <span>Settings</span>
                    </Link>
                    <button className="dropdown-item danger" onClick={handleLogout}>
                        <LogOut size={18} />
                        <span>Log Out</span>
                    </button>
                </div>
            )}
        </div>
    );
};

export default ProfileDropdown;

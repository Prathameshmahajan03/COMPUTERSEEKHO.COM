import React, { createContext, useState, useEffect } from 'react';

export const LanguageContext = createContext();

export const LanguageProvider = ({ children }) => {
    // Default to 'en'
    const [language, setLanguage] = useState('en');
    const [labels, setLabels] = useState({});

    useEffect(() => {
        fetchLabels(language);
    }, [language]);

    const fetchLabels = async (lang) => {
        try {
            // Adjust usage of localhost URL as needed or import api service
            const response = await fetch(`http://localhost:8080/i18n/messages?lang=${lang}`);
            if (response.ok) {
                const data = await response.json();
                setLabels(data);
            } else {
                console.error("Failed to fetch labels");
            }
        } catch (error) {
            console.error("Error fetching labels:", error);
        }
    };

    const toggleLanguage = () => {
        setLanguage((prev) => (prev === 'en' ? 'hi' : 'en'));
    };

    return (
        <LanguageContext.Provider value={{ language, labels, toggleLanguage }}>
            {children}
        </LanguageContext.Provider>
    );
};

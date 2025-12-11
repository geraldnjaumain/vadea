import { useEffect } from 'react';

export const useSmartPaste = (onUrlDetected) => {
    useEffect(() => {
        const handlePaste = async (e) => {
            const text = e.clipboardData.getData('text');

            // URL detection regex
            const urlRegex = /(https?:\/\/[^\s]+)/g;
            const urls = text.match(urlRegex);

            if (urls && urls.length > 0) {
                e.preventDefault();

                for (const url of urls) {
                    // Fetch OpenGraph metadata
                    try {
                        const metadata = await fetchUrlMetadata(url);
                        onUrlDetected({ url, metadata });
                    } catch (error) {
                        console.error('Failed to fetch metadata:', error);
                        onUrlDetected({ url, metadata: null });
                    }
                }
            }
        };

        window.addEventListener('paste', handlePaste);
        return () => window.removeEventListener('paste', handlePaste);
    }, [onUrlDetected]);
};

const fetchUrlMetadata = async (url) => {
    try {
        // Use a CORS proxy or backend endpoint to fetch OG data
        // For now, return basic data
        const domain = new URL(url).hostname;
        return {
            title: `Link from ${domain}`,
            description: url,
            image: null,
        };
    } catch (error) {
        return {
            title: 'Pasted Link',
            description: url,
            image: null,
        };
    }
};

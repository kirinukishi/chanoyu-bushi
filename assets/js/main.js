document.addEventListener('DOMContentLoaded', () => {
    const observerOptions = {
        root: null,
        rootMargin: '0px',
        threshold: 0.1
    };

    const observer = new IntersectionObserver((entries, observer) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.classList.add('is-visible');
                observer.unobserve(entry.target); // Animate only once
            }
        });
    }, observerOptions);

    const elements = document.querySelectorAll('.fade-in-on-scroll');
    elements.forEach(el => observer.observe(el));

    // Availability Check from Google Sheets
    const SHEET_CSV_URL = 'https://docs.google.com/spreadsheets/d/e/2PACX-1vQs5Fyt3R9IoY8kDf5r7ncndH3HsrOZS4M4H4R9thTYA-Nc8VFwDMEhOKBpyfAgwHFORnPAHD2Gr9Ys/pub?output=csv';

    async function checkAvailability() {
        try {
            const response = await fetch(SHEET_CSV_URL);
            const data = await response.text();

            // Parse CSV (Simple parsing assuming standard format)
            const rows = data.split('\n').slice(1); // Skip header if present

            rows.forEach(row => {
                const [id, status] = row.split(',').map(item => item.trim());

                if (id && status) {
                    const card = document.querySelector(`.schedule-card[data-id="${id}"]`);
                    if (card) {
                        const badge = card.querySelector('.status-badge');

                        if (status.toLowerCase() === 'full') {
                            // Update to Full Badge
                            badge.classList.remove('available');
                            badge.classList.add('full');
                            badge.innerHTML = '満席<br><span>Full</span>';
                            badge.href = 'javascript:void(0)'; // Disable link
                            badge.style.cursor = 'default';
                            badge.style.backgroundColor = '#666'; // Gray out
                            badge.style.pointerEvents = 'none';
                        }
                    }
                }
            });

        } catch (error) {
            console.error('Error fetching availability:', error);
        }
    }

    // Run check
    checkAvailability();
});

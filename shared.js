document.addEventListener('DOMContentLoaded', () => {
    const darkModeToggle = document.getElementById('darkModeToggle');
    const body = document.body;
    const scrollToTopBtn = document.getElementById('scrollToTopBtn');

    // Scroll to top functionality
    window.addEventListener('scroll', () => {
        if (window.pageYOffset > 100) {
            scrollToTopBtn.classList.add('show');
        } else {
            scrollToTopBtn.classList.remove('show');
        }
    });

    scrollToTopBtn.addEventListener('click', () => {
        window.scrollTo({
            top: 0,
            behavior: 'smooth'
        });
    });

    // Dark mode toggle functionality
    function updateDarkModeIcon() {
        if (body.classList.contains('dark-mode')) {
            darkModeToggle.innerHTML = '<i class="fas fa-sun" aria-hidden="true"></i>';
            darkModeToggle.setAttribute('aria-label', 'עבור למצב יום');
        } else {
            darkModeToggle.innerHTML = '<i class="fas fa-moon" aria-hidden="true"></i>';
            darkModeToggle.setAttribute('aria-label', 'עבור למצב לילה');
        }
    }

    darkModeToggle.addEventListener('click', () => {
        body.classList.toggle('dark-mode');
        if (body.classList.contains('dark-mode')) {
            localStorage.setItem('darkMode', 'enabled');
        } else {
            localStorage.setItem('darkMode', null);
        }
        updateDarkModeIcon();
    });

    // Initial dark mode check
    if (localStorage.getItem('darkMode') === 'enabled') {
        body.classList.add('dark-mode');
    }
    updateDarkModeIcon();
});
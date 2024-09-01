// Create and append accessibility menu
function createAccessibilityMenu() {
    const menuHtml = `
    <div id="accessibility-menu" class="accessibility-menu">
        <button id="accessibility-toggle" aria-label="פתח תפריט נגישות">
            <i class="fas fa-universal-access"></i>
        </button>
        <div class="accessibility-options">
            <button id="increase-text" aria-label="הגדל טקסט"><i class="fas fa-plus"></i> הגדל טקסט</button>
            <button id="decrease-text" aria-label="הקטן טקסט"><i class="fas fa-minus"></i> הקטן טקסט</button>
            <button id="high-contrast" aria-label="ניגודיות גבוהה"><i class="fas fa-adjust"></i> ניגודיות גבוהה</button>
            <button id="grayscale" aria-label="גווני אפור"><i class="fas fa-gray"></i> גווני אפור</button>
            <button id="readable-font" aria-label="גופן קריא"><i class="fas fa-font"></i> גופן קריא</button>
            <button id="links-underline" aria-label="הדגש קישורים"><i class="fas fa-underline"></i> הדגש קישורים</button>
            <button id="text-spacing" aria-label="ריווח טקסט"><i class="fas fa-text-width"></i> ריווח טקסט</button>
            <button id="reset" aria-label="איפוס הגדרות"><i class="fas fa-undo"></i> איפוס הגדרות</button>
        </div>
    </div>
    `;

    document.body.insertAdjacentHTML('beforeend', menuHtml);

    // Add event listeners
    document.getElementById('accessibility-toggle').addEventListener('click', toggleMenu);
    document.getElementById('increase-text').addEventListener('click', () => adjustFontSize(1));
    document.getElementById('decrease-text').addEventListener('click', () => adjustFontSize(-1));
    document.getElementById('high-contrast').addEventListener('click', toggleHighContrast);
    document.getElementById('grayscale').addEventListener('click', toggleGrayscale);
    document.getElementById('readable-font').addEventListener('click', toggleReadableFont);
    document.getElementById('links-underline').addEventListener('click', toggleLinksUnderline);
    document.getElementById('text-spacing').addEventListener('click', toggleTextSpacing);
    document.getElementById('reset').addEventListener('click', resetAccessibility);
}

// Toggle menu visibility
function toggleMenu() {
    const menu = document.querySelector('.accessibility-options');
    menu.classList.toggle('show');
}

// Adjust font size
function adjustFontSize(change) {
    const body = document.body;
    const currentSize = parseFloat(window.getComputedStyle(body, null).getPropertyValue('font-size'));
    body.style.fontSize = (currentSize + change) + 'px';
}

// Toggle high contrast
function toggleHighContrast() {
    document.body.classList.toggle('high-contrast');
}

// Toggle grayscale
function toggleGrayscale() {
    document.body.classList.toggle('grayscale');
}

// Toggle readable font
function toggleReadableFont() {
    document.body.classList.toggle('readable-font');
}

// Toggle links underline
function toggleLinksUnderline() {
    document.body.classList.toggle('underline-links');
}

// Toggle text spacing
function toggleTextSpacing() {
    document.body.classList.toggle('increased-spacing');
}

// Reset all accessibility settings
function resetAccessibility() {
    document.body.classList.remove('high-contrast', 'grayscale', 'readable-font', 'underline-links', 'increased-spacing');
    document.body.style.fontSize = '';
}

// Initialize menu when DOM is loaded
document.addEventListener('DOMContentLoaded', createAccessibilityMenu);
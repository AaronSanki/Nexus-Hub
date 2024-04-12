document.addEventListener("DOMContentLoaded", function() {
    const filters = document.querySelectorAll('.filter.translucent');
    const nextButton = document.getElementById('nextFilters');
    const prevButton = document.getElementById('prevFilters');
    const filtersToShow = window.innerWidth <= 460 ? 3 : 4;
    let startIndex = 0;

    function updateFilterVisibility() {
        for (let i = 0; i < filters.length; i++) {
            if (i >= startIndex && i < startIndex + filtersToShow) {
                filters[i].style.display = 'inline-block'; // Display filters in the range
            } else {
                filters[i].style.display = 'none'; // Hide filters outside the range
            }
        }
    }

    function updateButtonVisibility() {
        prevButton.style.display = startIndex === 0 ? 'none' : 'inline-block'; // Show or hide previous button based on startIndex
        nextButton.style.display = startIndex + filtersToShow >= filters.length ? 'none' : 'inline-block'; // Show or hide next button based on startIndex
    }

    nextButton.addEventListener('click', function() {
        startIndex += 1;
        updateFilterVisibility();
        updateButtonVisibility();
    });

    prevButton.addEventListener('click', function() {
        startIndex -= 1;
        updateFilterVisibility();
        updateButtonVisibility();
    });

    // Initially show the first set of filters
    updateFilterVisibility();
    updateButtonVisibility();
});
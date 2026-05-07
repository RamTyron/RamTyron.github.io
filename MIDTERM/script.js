const mealContainer = document.getElementById('meal-container');
const searchInput = document.getElementById('searchInput');
const recipeModal = new bootstrap.Modal(document.getElementById('recipeModal'));
let mealsData = [];

// 1. Initialize data from API
async function fetchInitialData() {
    try {
        const response = await fetch('https://www.themealdb.com/api/json/v1/1/search.php?f=a');
        const data = await response.json();
        mealsData = data.meals || [];
        renderCards(mealsData);
    } catch (error) {
        mealContainer.innerHTML = `<p class="text-center text-danger">Unable to load recipes at this time.</p>`;
    }
}

// 2. Function to Render the Grid
function renderCards(meals) {
    if (meals.length === 0) {
        mealContainer.innerHTML = '<div class="col-12 text-center py-5"><h5>No recipes found.</h5></div>';
        return;
    }

    mealContainer.innerHTML = meals.map((meal, index) => `
        <div class="col-md-6 col-lg-4">
            <div class="card h-100 meal-card" onclick="openDetails(${index})">
                <img src="${meal.strMealThumb}" class="card-img-top meal-img" alt="${meal.strMeal}">
                <div class="card-body">
                    <div class="d-flex justify-content-between align-items-start mb-2">
                        <span class="badge bg-primary-soft text-primary border border-primary-subtle">${meal.strCategory}</span>
                        <small class="text-muted">${meal.strArea}</small>
                    </div>
                    <h5 class="fw-bold mb-1">${meal.strMeal}</h5>
                    <p class="text-muted small">View full recipe &rarr;</p>
                </div>
            </div>
        </div>
    `).join('');
}

// 3. Function to handle Modal content
window.openDetails = (index) => {
    const m = mealsData[index];
    const modalTarget = document.getElementById('modal-content');

    modalTarget.innerHTML = `
        <img src="${m.strMealThumb}" class="modal-main-img">
        <div class="px-2">
            <h2 class="fw-bold mb-2">${m.strMeal}</h2>
            <div class="mb-4">
                <span class="badge bg-primary px-3 py-2">${m.strCategory}</span>
                <span class="badge bg-secondary px-3 py-2 ms-2">${m.strArea}</span>
            </div>
            
            <h5 class="fw-bold">Instructions</h5>
            <p class="instruction-full">${m.strInstructions}</p>
            
            <div class="mt-4 pb-3">
                <a href="${m.strYoutube}" target="_blank" class="btn btn-danger w-100 py-2 fw-bold">
                    Watch Video Tutorial
                </a>
            </div>
        </div>
    `;
    
    recipeModal.show();
};

// 4. Real-time Search Filter
searchInput.addEventListener('input', (e) => {
    const term = e.target.value.toLowerCase();
    const filtered = mealsData.filter(m => 
        m.strMeal.toLowerCase().includes(term) || 
        m.strCategory.toLowerCase().includes(term)
    );
    renderCards(filtered);
});

// Start the app
fetchInitialData();
const search = document.getElementById('search'),
    submit = document.getElementById('submit'),
    random = document.getElementById('random'),
    mealsEl = document.getElementById('meals'),
    resultHeading = document.getElementById('result-heading'),
    single_meal = document.getElementById('single-meal');

function searchMeal(e) {
    e.preventDefault();

    // clear single meal
    single_meal.innerHTML = '';
    //get search term
    const term = search.value;
    //check for empty
    if (term.trim()) {
        fetch(`https://www.themealdb.com/api/json/v1/1/search.php?s=${term}`)
            .then(res => {
                return res.json()
            })
            .then(data => {
                console.log(data);
                resultHeading.innerHTML = `<h2>Search result for '${term}'</h2>`

                if (data.meals === null) {
                    resultHeading.innerHTML = `<h2>No search results. Try again.</h2>`;
                } else {
                    mealsEl.innerHTML = data.meals.map(meal => `
                        <div class='meal'>
                            <img src="${meal.strMealThumb}" alt="${meal.strMeal}"/>
                            <div class="meal-info" data-mealID="${meal.idMeal}" >
                                <h4>${meal.strMeal}</h4 >
                            </div>
                        </div>`
                    ).join(''); // because we want string output
                }
            })
        //clear search text 
        search.value = '';
    } else {
        alert('Please enter search value')
    }

}

function getMealById(mealId) {
    fetch(`https://www.themealdb.com/api/json/v1/1/lookup.php?i=${mealId}`)
        .then(res => res.json())
        .then(data => {
            const meal = data.meals[0];

            addMealToDOM(meal)
        })
}


function addMealToDOM(meal) {
    const ingredients = [];

    for (var i = 1; i <= 20; i++) {
        if (meal[`strIngredient${i}`]) {
            ingredients.push(`${meal[`strIngredient${i}`]} -  ${meal[`strMeasure${i}`]}`)
        } else {
            break;
        }
    }

    single_meal.innerHTML = `
    <h1>${meal.strMeal} </h1>
    <img src="${meal.strMealThumb}"/>
    <div class="single-meal-info">
    ${meal.strCategory ? `<p> ${meal.strCategory} </p>` : ''}
    ${meal.strArea ? `<p> ${meal.strArea} </p>` : ''}
    </div>

    <div class="main">
    <p>${meal.strInstructions}</p>
    <h2>Ingredients</h2>
    <ul>
    ${ ingredients.map(ing => `<li>${ing}</li>`).join('')}
    </ul >
    </div >
    `
}

//EVENT LISTENER
submit.addEventListener('submit', searchMeal)

mealsEl.addEventListener('click', e => {
    const mealInfo = e.path.find(item => {
        if (item.classList) {
            return item.classList.contains('meal-info'); //returns the item that has meal-info in its classlist
        } else {
            return false
        }
    })

    if (mealInfo) {
        var mealId = mealInfo.getAttribute('data-mealid');
    }
    getMealById(mealId)
})
import { async } from "regenerator-runtime"
import { API_URL, RESULTS_PER_PAGE, KEY } from "./config";
import { getJSON, sendJSON } from "./helpers";

export const state = {
    recipe: {},
    search: {
        query: '',
        results: [],
        currentPage: 1,
        resultsPerPage: RESULTS_PER_PAGE,
    },
    bookmarks: [],
}

const createRecipeObj = function(data){
    const {recipe} = data.data;
    return {
        id: recipe.id,
        title: recipe.title,
        publisher: recipe.publisher,
        sourceUrl: recipe.source_url,
        image: recipe.image_url,
        servings: recipe.servings,
        cookingTime: recipe.cooking_time,
        ingredients: recipe.ingredients,
        ...(recipe.key && { key: recipe.key}),
    };
}

export const loadRecipe = async function(id){
    try{
        const data = await getJSON(`${API_URL}${id}?key=${KEY}`);
        state.recipe = createRecipeObj(data);
        if(state.bookmarks.some(recipe => recipe.id === id))
            state.recipe.bookmarked = true;
        else
            state.recipe.bookmarked = false;
    } catch (err) {
        throw err;
    }
}

export const loadSearchResult = async function(queryParam){
    try {
        state.search.query = queryParam;
        const data = await getJSON(`${API_URL}?search=${queryParam}&key=${KEY}`);
        state.search.results = data.data.recipes.map(rec =>
        state.recipe = {
            id: rec.id,
            title: rec.title,
            publisher: rec.publisher,
            image: rec.image_url,
            ...(rec.key && { key: rec.key}),
        });
    } catch (err){
        throw err; 
    }
}

export const getSearchResultsPage = function(reqPage = state.search.currentPage) {
    state.search.currentPage = reqPage;
    return state.search.results.slice(state.search.resultsPerPage * (reqPage - 1), 
                                      state.search.resultsPerPage * reqPage);
}

export const updateServings = function(qServings){
    state.recipe.ingredients.forEach(ing =>
        ing.quantity *= qServings / state.recipe.servings);
    state.recipe.servings = qServings;
}

export const addBookmark = function(recipe){
    state.bookmarks.push(recipe);
    if(recipe.id === state.recipe.id)
        state.recipe.bookmarked = true;
}

export const deleteBookmark = function(id) {
    const idx = state.bookmarks.findIndex(el => el.id === id);
    state.bookmarks.splice(idx, 1);
    if(id === state.recipe.id)
        state.recipe.bookmarked = false;
}

export const persistBookmarks = function() {
    localStorage.setItem('bookmarks', JSON.stringify(state.bookmarks));
}

export const loadBookmarks = function() {
    const storedBookmarks = localStorage.getItem('bookmarks');
    if(storedBookmarks)
        state.bookmarks = JSON.parse(storedBookmarks);
}

export const uploadRecipe = async function(newRecipe) {
    try {
        const ingredients = Object.entries(newRecipe)
                                .filter(entry => entry[0].startsWith('ingredient') 
                                                && entry[1] !== '')
                                .map(ing => {
                                    const ingArray = ing[1].split(',').map(el => el.trim());
                                    if(ingArray.length !== 3) 
                                        throw new Error('Wrong ingredient format, use the correct one!');
                                    const [quantity, unit, description] = ingArray;
                                    return { quantity: quantity ? +quantity : null, unit, description };
                                });
        const recipe = {
            title: newRecipe.title,
            source_url: newRecipe.sourceUrl,
            image_url: newRecipe.image,
            publisher: newRecipe.publisher,
            cooking_time: +newRecipe.cookingTime,
            servings: +newRecipe.servings,
            ingredients
        };
        const resp = await sendJSON(`${API_URL}?key=${KEY}`, recipe);
        state.recipe = createRecipeObj(resp);
        addBookmark(state.recipe);
        persistBookmarks();
    } catch (err) {
        throw err;
    }
}
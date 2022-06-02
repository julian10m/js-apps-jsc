import { async } from "regenerator-runtime"
import { API_URL, RESULTS_PER_PAGE } from "./config";
import { getJSON } from "./helpers";

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

export const loadRecipe = async function(id){
    try{
        const data = await getJSON(`${API_URL}${id}`);
        let {recipe} = data.data;
        state.recipe = {
            id: recipe.id,
            title: recipe.title,
            publisher: recipe.publisher,
            sourceUrl: recipe.source_url,
            image: recipe.image_url,
            servings: recipe.servings,
            cookingTime: recipe.cooking_time,
            ingredients: recipe.ingredients
        };
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
        const data = await getJSON(`${API_URL}?search=${queryParam}`);
        state.search.results = data.data.recipes.map(rec =>
        state.recipe = {
            id: rec.id,
            title: rec.title,
            publisher: rec.publisher,
            image: rec.image_url,
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
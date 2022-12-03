import * as model from './model.js'
import recipeView from './views/recipeView.js';
import searchView from './views/searchView.js';
import resultsView from './views/resultsView.js';
import paginationView from './views/paginationView.js';
import bookmarksView from './views/bookmarksView.js';
import addRecipeView from './views/addRecipeView.js';
import { MODAL_CLOSE_SEC } from './config.js';
import 'core-js/stable';
import 'regenerator-runtime/runtime';

if(module.hot){
    module.hot.accept();
}

const controlRecipes = async function(){
    try{
        const id = window.location.hash.slice(1);
        if(!id) 
            return;
        recipeView.renderSpinner();
        resultsView.update(model.getSearchResultsPage());
        bookmarksView.update(model.state.bookmarks);
        await model.loadRecipe(id);
        recipeView.render(model.state.recipe);
    } catch (err) {
        recipeView.renderError();
    }
};

const controlSearchResults = async function(){
    try {
        resultsView.renderSpinner();
        const queryParam = searchView.getQuery();
        await model.loadSearchResult(queryParam);
        resultsView.render(model.getSearchResultsPage(1));
        paginationView.render(model.state.search);
    } catch (err) {
        resultsView.renderError();
        paginationView.renderError();
    }
};

const controlPagination = function(gotoPage){
    resultsView.render(model.getSearchResultsPage(gotoPage));
    paginationView.render(model.state.search);
};

const controlServings = function(qServings){
    model.updateServings(qServings);
    recipeView.update(model.state.recipe);
};

const controlBookmarksUpdate = function(){
    if(!model.state.recipe.bookmarked)
        model.addBookmark(model.state.recipe);
    else 
        model.deleteBookmark(model.state.recipe.id);
    model.persistBookmarks()
    recipeView.update(model.state.recipe);
    bookmarksView.render(model.state.bookmarks);
};

const controlStorageLoading = function () {
    model.loadBookmarks();
    bookmarksView.render(model.state.bookmarks);
};

const controlAddRecipe = async function(newRecipe){
    try {
        addRecipeView.renderSpinner();
        await model.uploadRecipe(newRecipe);
        recipeView.render(model.state.recipe);
        addRecipeView.renderMessage();
        bookmarksView.render(model.state.bookmarks);
        window.history.pushState(null, '', `#${model.state.recipe.id}`);
        setTimeout(function(){
            addRecipeView.toggleWindow(),
            MODAL_CLOSE_SEC * 1000
        });
    } catch (err) {
        console.error(err);
        addRecipeView.renderError(err.message);
    }
};

(function(){
    bookmarksView.addLoadHandler(controlStorageLoading);
    recipeView.addHandlerRender(controlRecipes);
    recipeView.addHandlerUpdateServings(controlServings);
    recipeView.addHandlerBookmark(controlBookmarksUpdate);
    searchView.addHandlerSearch(controlSearchResults);
    paginationView.addHandlerClick(controlPagination);
    addRecipeView.addHandlerUpload(controlAddRecipe);
})();

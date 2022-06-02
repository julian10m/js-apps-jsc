import * as model from './model.js'
import recipeView from './views/recipeView.js';
import searchView from './views/searchView.js';
import resultsView from './views/resultsView.js';
import paginationView from './views/paginationView.js';
import bookmarksView from './views/bookmarksView.js';

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
        if(!queryParam) return;
        await model.loadSearchResult(queryParam);
        resultsView.render(model.getSearchResultsPage(1));
        paginationView.render(model.state.search);
    } catch (err) {
        resultsView.renderError();
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

const controlBookmarks = function(){
    if(!model.state.recipe.bookmarked)
        model.addBookmark(model.state.recipe);
    else 
        model.deleteBookmark(model.state.recipe.id);
    recipeView.update(model.state.recipe);
    bookmarksView.render(model.state.bookmarks);
};

(function(){
    recipeView.addHandlerRender(controlRecipes);
    recipeView.addHandlerUpdateServings(controlServings);
    recipeView.addHandlerBookmark(controlBookmarks);
    searchView.addHandlerSearch(controlSearchResults);
    paginationView.addHandlerClick(controlPagination);
})();



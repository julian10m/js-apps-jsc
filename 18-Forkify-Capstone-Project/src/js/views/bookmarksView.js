import PreviewView from './previewView.js';

class BookmarksView extends PreviewView {
    _parentElement = document.querySelector('.bookmarks__list');
    _errorMessage = 'No bookmarks yet, find a recipe you like and add it :)';

    addLoadHandler(handler) {
        window.addEventListener('load', handler);
    }
}

export default new BookmarksView();
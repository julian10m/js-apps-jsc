import PreviewView from './previewView.js';
import icons from 'url:../../img/icons.svg';

class ResultsView extends PreviewView {
    _parentElement = document.querySelector('.results');
    _errorMessage = 'No recipes found for your query, please try another!';
}

export default new ResultsView();
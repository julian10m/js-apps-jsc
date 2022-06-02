import View from './view';
import icons from 'url:../../img/icons.svg';

class PaginationView extends View {
    _parentElement = document.querySelector('.pagination');

    addHandlerClick(handler) {
        this._parentElement.addEventListener('click', function(e) {
            const btn = e.target.closest('.btn--inline');
            if(!btn) return;
            handler(+btn.dataset.goto);
        });
    }

    _generateMarkup() {
        const currentPage = this._data.currentPage;
        const numPages = Math.ceil(this._data.results.length / this._data.resultsPerPage);
        if (numPages === 1) 
            return '';
        if (currentPage === 1 && numPages > 1)
            return this._generateMarkupNextPage(currentPage);
        if (currentPage === numPages && numPages > 1) 
            return this._generateMarkupPreviousPage(currentPage);
        return [ this._generateMarkupPreviousPage(currentPage),
                 this._generateMarkupNextPage(currentPage)].join('');
    }

    _generateMarkupNextPage(currentPage) {
        return `
        <button data-goto="${currentPage + 1}" class="btn--inline pagination__btn--next">
            <span>Page ${currentPage + 1}</span>
            <svg class="search__icon">
                <use href="${icons}#icon-arrow-right"></use>
            </svg>
        </button>   
        `
    }

    _generateMarkupPreviousPage(currentPage) {
        return `
        <button data-goto="${currentPage - 1}" class="btn--inline pagination__btn--prev">
            <svg class="search__icon">
                <use href="${icons}#icon-arrow-left"></use>
            </svg>
            <span>Page ${currentPage - 1}</span>
        </button>
        `
    }
}

export default new PaginationView();
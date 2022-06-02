import icons from 'url:../../img/icons.svg';

export default class View {
    _data;
    _message = '';
    
    render(data) {
        if(!data || (Array.isArray(data) && data.length === 0)) return this.renderError();
        this._data = data;
        this._reload(this._generateMarkup());
    }

    update(data) {
        this._data = data;
        const newMarkupDom = document.createRange().createContextualFragment(this._generateMarkup());
        const newElements = Array.from(newMarkupDom.querySelectorAll('*'));
        const curElements = Array.from(this._parentElement.querySelectorAll('*'));
        newElements.forEach((newEl, i) => {
            const curEl = curElements[i];
            if(!newEl.isEqualNode(curEl)) {
                Array.from(newEl.attributes).forEach(attr =>
                    curEl.setAttribute(attr.name, attr.value));
                if(newEl.firstChild?.nodeValue.trim() !== '')
                    curEl.textContent = newEl.textContent;
            }
        })
    }

    _clear(){
        this._parentElement.innerHTML = '';
    }

    _insert(markup) {
        this._parentElement.insertAdjacentHTML('afterbegin', markup);
    }

    _reload(markup) {
        this._clear();
        this._insert(markup);
    }

    renderSpinner(parentEl) {
        const markup = `       
        <div class="spinner">
            <svg>
            <use href="${icons}.svg#icon-loader"></use>
            </svg>
        </div>
        `;
        this._reload(markup);        
    }

    renderError(message = this._errorMessage){
        this.renderMessage('error', message);
    }

    renderMessage(msgClass = 'message', message = this._message){
        const markup = `
        <div class="${msgClass}">
         <div>
           <svg>
             <use href="${icons}.svg#icon-alert-triangle"></use>
           </svg>
         </div>
         <p>${message}</p>
       </div>
       `
       this._reload(markup);
    }
}


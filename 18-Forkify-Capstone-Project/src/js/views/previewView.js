import View from "./view.js";
import icons from 'url:../../img/icons.svg';

export default class PreviewView extends View {
    _generateMarkup() {
        return this._data.map(this._generateMarkupPreview).join('') 
    }
    _generateMarkupPreview(recipe){
        const id = window.location.hash.slice(1);
        return `
        <li class="preview">
            <a class="preview__link ${recipe.id === id ? 'preview__link--active' : ''}" href="#${recipe.id}">
              <figure class="preview__fig">
                <img src="${recipe.image}" alt="${recipe.title}" />
              </figure>
              <div class="preview__data">
                <h4 class="preview__title">${recipe.title}</h4>
                <p class="preview__publisher">${recipe.publisher}</p>
                <div class="recipe__user-generated ${recipe.key ? '': 'hidden'}">
                    <svg>
                    <use href="${icons}.svg#icon-user"></use>
                    </svg>
                </div>
              </div>
            </a>
          </li>
        `;
        // preview__link--active
    //     <div class="preview__user-generated">
    //     <svg>
    //       <use href="${icons}#icon-user"></use>
    //     </svg>
    //   </div>
    }
}
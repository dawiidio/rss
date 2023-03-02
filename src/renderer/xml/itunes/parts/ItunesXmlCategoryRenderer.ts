import { BaseXml2Renderer } from '~/renderer/xml/BaseXml2Renderer';
import { ItunesCategoryObject } from '../../../../external/ItunesCategory';
import { replaceSpecialChars } from '~/common';

export class ItunesXmlCategoryRenderer extends BaseXml2Renderer {

    constructor(
        public categories: Partial<ItunesCategoryObject>
    ) {
        super();
    }

    static fromProps(categories: Partial<ItunesCategoryObject>): ItunesXmlCategoryRenderer {
        return new ItunesXmlCategoryRenderer(
            categories
        );
    }

    protected renderCategory(text: string, childCategories: string[] = []): string {
        return this.renderTag('itunes:category', childCategories.map(c => this.renderCategory(c)).join('\n') || undefined, {
            text: replaceSpecialChars(text)
        });
    }

    protected renderCategories() {
        return Object
            .entries(this.categories)
            .reduce((acc, [key, subcategories]) =>
                acc + this.renderCategory(key, subcategories), ''
            );
    }

    render(): string {
        return this.renderCategories();
    }

    toString() {
        return this.render();
    }
}

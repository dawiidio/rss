import { ICategoryProps, IGuidProps, IImageProps } from '~/IRssCommon';
import { BaseXml2Renderer } from '~/renderer/xml/BaseXml2Renderer';
import { IEpisodeSourceProps } from '~/IEpisodeProps';

export class XmlCategoryRenderer extends BaseXml2Renderer {

    constructor(
        public categories: ICategoryProps[]
    ) {
        super();
    }

    static fromProps(categories: ICategoryProps[]): XmlCategoryRenderer {
        return new XmlCategoryRenderer(
            categories
        );
    }

    protected renderCategory({ value, domain }: ICategoryProps): string {
        return this.renderTag('category', value, {
            domain,
        });
    }

    protected renderCategories() {
        return this.categories
            .reduce((acc, category) =>
                acc + this.renderCategory(category), '',
            );
    }

    render(): string {
        return this.renderCategories();
    }

    toString() {
        return this.render();
    }
}

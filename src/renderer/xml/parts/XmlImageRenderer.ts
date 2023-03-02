import { IImageProps } from '~/IRssCommon';
import { BaseXml2Renderer } from '~/renderer/xml/BaseXml2Renderer';

export class XmlImageRenderer extends BaseXml2Renderer implements IImageProps {

    constructor(
        public url: string,

        public title: string,

        public link: string,

        public width?: number,

        public height?: number,

        public description: string = '',

    ) {
        super();
    }

    static fromProps({ url, height, title, width, link, description }: IImageProps): XmlImageRenderer {
        return new XmlImageRenderer(
            url,
            title,
            link,
            width,
            height,
            description
        );
    }

    render(): string {
        const {
            url,
            title,
            link,
            width,
            height,
            description
        } = this;

        return this.renderTag('image', undefined, {
            url,
            title,
            link,
            width,
            height,
            description
        })
    }

    toString() {
        return this.render();
    }
}

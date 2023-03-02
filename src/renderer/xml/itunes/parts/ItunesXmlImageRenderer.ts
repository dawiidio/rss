import { XmlImageRenderer } from '~/renderer/xml/parts/XmlImageRenderer';

export class ItunesXmlImageRenderer extends XmlImageRenderer {
    render(): string {
        return this.renderTag('itunes:image', undefined, {
            href: this.url
        });
    }
}

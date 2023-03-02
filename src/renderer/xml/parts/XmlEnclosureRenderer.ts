import { BaseXml2Renderer } from '~/renderer/xml/BaseXml2Renderer';
import { IEpisodeEnclosure } from '~/IEpisodeProps';

export class XmlEnclosureRenderer extends BaseXml2Renderer implements IEpisodeEnclosure {

    constructor(
        public url: string,
        public type?: string,
        public length?: number,
    ) {
        super();
    }

    static fromProps({ url, type, length }: IEpisodeEnclosure): XmlEnclosureRenderer {
        return new XmlEnclosureRenderer(
            url,
            type,
            length,
        );
    }

    render(): string {
        const {
            url,
            type,
            length,
        } = this;

        return this.renderTag('enclosure', undefined, {
            url,
            type,
            length,
        });
    }

    toString() {
        return this.render();
    }
}

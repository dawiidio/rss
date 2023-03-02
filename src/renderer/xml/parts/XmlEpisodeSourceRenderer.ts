import { IImageProps } from '~/IRssCommon';
import { BaseXml2Renderer } from '~/renderer/xml/BaseXml2Renderer';
import { IEpisodeSourceProps } from '~/IEpisodeProps';

export class XmlEpisodeSourceRenderer extends BaseXml2Renderer implements IEpisodeSourceProps {

    constructor(
        public url: string,
        public text: string = '',
    ) {
        super();
    }

    static fromProps({ url, text }: IEpisodeSourceProps): XmlEpisodeSourceRenderer {
        return new XmlEpisodeSourceRenderer(
            url,
            text
        );
    }

    render(): string {
        const {
            url,
            text
        } = this;

        return this.renderTag('source', text, {
            url,
        })
    }

    toString() {
        return this.render();
    }
}

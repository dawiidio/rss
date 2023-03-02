import { IGuidProps, IImageProps } from '~/IRssCommon';
import { BaseXml2Renderer } from '~/renderer/xml/BaseXml2Renderer';
import { IEpisodeSourceProps } from '~/IEpisodeProps';

export class XmlEpisodeGuidRenderer extends BaseXml2Renderer implements IGuidProps {

    constructor(
        public value: string,
        public isPermaLink?: boolean,
    ) {
        super();
    }

    static fromProps({ value, isPermaLink }: IGuidProps): XmlEpisodeGuidRenderer {
        return new XmlEpisodeGuidRenderer(
            value,
            isPermaLink
        );
    }

    render(): string {
        const {
            value,
            isPermaLink
        } = this;

        return this.renderTag('source', value, {
            isPermaLink: typeof isPermaLink === 'boolean' ? String(isPermaLink) : undefined,
        })
    }

    toString() {
        return this.render();
    }
}

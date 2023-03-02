import { ICloudProps } from '~/IRssCommon';
import { BaseXml2Renderer } from '~/renderer/xml/BaseXml2Renderer';

export class XmlCloudRenderer extends BaseXml2Renderer implements ICloudProps {

    constructor(
        public domain: string,
        public path: string,
        public registerProcedure: string,
        public port: number = 80,
        public protocol: string = 'xml-rpc',
    ) {
        super();
    }

    static fromProps({ protocol, path, port, registerProcedure, domain }: ICloudProps): XmlCloudRenderer {
        return new XmlCloudRenderer(
            domain,
            path,
            registerProcedure,
            port,
            protocol
        );
    }

    render(): string {
        const {
            domain,
            path,
            registerProcedure,
            port,
            protocol
        } = this;

        return this.renderTag('cloud', undefined, {
            domain,
            path,
            registerProcedure,
            port,
            protocol
        });
    }

    toString() {
        return this.render();
    }
}

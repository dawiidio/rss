import { Renderer } from '~/renderer/Renderer';
import { XmlRss2Renderer } from '~/renderer/xml/XmlRss2Renderer';
import { HtmlRss2Renderer } from '~/renderer/html/HtmlRss2Renderer';
import { ItunesXmlRss2Renderer } from '~/renderer/xml/itunes/ItunesXmlRss2Renderer';
import { UiRenderer } from '~/renderer/UiRenderer';

export type IBuiltinRendererType = 'xml' | 'xml:itunes' | 'html';

export function getRenderer(type: 'html'): UiRenderer;
export function getRenderer(type: 'xml' | 'xml:itunes'): Renderer;
export function getRenderer(type: IBuiltinRendererType): Renderer | UiRenderer {
    switch (type) {
        case 'html':
            return new HtmlRss2Renderer();
        case 'xml':
            return new XmlRss2Renderer();
        case 'xml:itunes':
            return new ItunesXmlRss2Renderer();
        default:
            throw new Error(`Unknown renderer type ${type}`);
    }
}

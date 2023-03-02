import { XmlRenderingContext } from '~/renderer/xml/XmlRenderingContext';

export type HtmlChildrenFn = (ctx: HtmlRenderingContext) => HtmlRenderingContext
export type HtmlChildrenType = string | number | undefined | HtmlChildrenFn;

export class HtmlRenderingContext extends XmlRenderingContext {

}

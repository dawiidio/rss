
export type XmlChildrenFn = (ctx: XmlRenderingContext) => XmlRenderingContext
export type XmlChildrenType = string | number | undefined | XmlChildrenFn;

export interface IReservedAttributes {
    forceTagClosing?: boolean
}

const RESERVED_ATTRS: Array<keyof IReservedAttributes> = ['forceTagClosing'];

export type IAttributes = IReservedAttributes & Record<string, string | number | undefined | boolean>;

export class XmlRenderingContext {
    string: string = '';

    protected renderAttributes(attributes: IAttributes) {
        return Object.entries(attributes)
            .filter(([, val]) => val !== undefined && val !== '')
            .reduce((acc, [key, val], i) => {
                if (RESERVED_ATTRS.includes(key as keyof IReservedAttributes))
                    return acc;

                return acc + `${i === 0 ? '' : ' '}${key}="${String(val)}"`;
            }, '');
    }

    render(tagName: string, children?: XmlChildrenType, attributes: IAttributes = {}): this {
        const attributesString = this.renderAttributes(attributes);
        const tagHasContent = Boolean(children);
        const renderClosing = attributes.forceTagClosing || tagHasContent;
        const tagStart = `<${tagName}${attributesString ? ` ${attributesString}` : ''}${renderClosing ? '' : ' /'}>`;
        const tagEnd = renderClosing ? `</${tagName}>` : '';
        const renderedTagContent = (typeof children === 'function') ? children(new XmlRenderingContext()).string : children;
        const tagContent = tagHasContent && !attributes.forceTagClosing ? renderedTagContent : '';

        // in case of empty tag just don't render it
        if (attributesString.trim() === '' && !children)
            return this;

        this.string += `${tagStart}${tagContent}${tagEnd}`;

        return this;
    }

    renderIf(condition: any) {
        return Boolean(condition) ? this.render.bind(this) : () => this;
    }

    renderStringIf(condition: any) {
        return Boolean(condition) ? this.renderString.bind(this) : () => this;
    }

    renderString(str: string) {
        this.string += str;

        return this;
    }
}

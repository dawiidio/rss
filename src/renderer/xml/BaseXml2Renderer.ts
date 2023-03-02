/**
 * @deprecated
 * @description use XmlRenderingContext instead
 */
export abstract class BaseXml2Renderer {

    renderAttributes(attributes: Record<string, string | number | undefined>) {
        return Object.entries(attributes)
            .filter(([, val]) => val !== undefined && val !== '')
            .reduce((acc, [key, val], i) => {
                return acc + `${i === 0 ? '' : ' '}${key}="${val}"`;
            }, '');
    }

    renderTag(tagName: string, value: string | number | undefined, attributes: Record<string, string | number | undefined> = {}): string {
        const attributesString = this.renderAttributes(attributes);
        const tagHasContent = Boolean(value);
        const tagStart = `<${tagName}${attributesString ? ` ${attributesString}` : ''}${tagHasContent ? '' : ' /'}>`;
        const tagEnd = tagHasContent ? `</${tagName}>` : '';
        const tagContent = tagHasContent ? value : '';

        // in case of empty tag just don't render it
        if (attributesString.trim() === '' && !value)
            return '';

        return `${tagStart}${tagContent}${tagEnd}`;
    }

    spawnRenderingSubcontext(tagPrefix: string = '') {
        let that = this;
        return new class {
            value: string = '';

            tagPrefix: string = tagPrefix;

            renderTag(tagName: string, value: string | number | undefined, attributes: Record<string, string | number> = {}) {
                this.value += that.renderTag(`${this.tagPrefix}${tagName}`, value, attributes);
                return this;
            }

            joinString(str: string) {
                this.value += str;
                return this;
            }

            toString() {
                return this.value;
            }
        }
    }
}

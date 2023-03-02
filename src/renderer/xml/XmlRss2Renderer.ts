import { Renderer } from '~/renderer/Renderer';
import { IChannelProps } from '~/IChannelProps';
import { IEpisodeEnclosure, IEpisodeProps, IEpisodeSourceProps } from '~/IEpisodeProps';
import { Episode } from '~/Episode';
import { Channel } from '~/Channel';
import { ICategoryProps, ICloudProps, IGuidProps, IImageProps, IPersonProps } from '~/IRssCommon';
import { XmlImageRenderer } from '~/renderer/xml/parts/XmlImageRenderer';
import { Person } from '~/common';
import { XmlCloudRenderer } from '~/renderer/xml/parts/XmlCloudRenderer';
import { XmlEpisodeSourceRenderer } from '~/renderer/xml/parts/XmlEpisodeSourceRenderer';
import { XmlEnclosureRenderer } from '~/renderer/xml/parts/XmlEnclosureRenderer';
import { XmlEpisodeGuidRenderer } from '~/renderer/xml/parts/XmlEpisodeGuidRenderer';
import { XmlCategoryRenderer } from '~/renderer/xml/parts/XmlCategoryRenderer';
import { XmlRenderingContext } from '~/renderer/xml/XmlRenderingContext';

export class XmlRss2Renderer extends Renderer {

    getChannelRenderableValue(channel: Channel, key: keyof IChannelProps): string {
        return channel.props[key] ? String(channel.props[key]) : '';
    }

    getEpisodeRenderableValue(episode: Episode, key: keyof IEpisodeProps): string {
        return episode.props[key] ? String(episode.props[key]) : '';
    }

    renderHeader(channel: Channel): string {
        return `<?xml version="1.0" encoding="UTF-8"?>
<rss version="2.0" xmlns:itunes="http://www.itunes.com/dtds/podcast-1.0.dtd" xmlns:content="http://purl.org/rss/1.0/modules/content/">`;
    }

    renderChannelHeader(channel: Channel): string {
        return '<channel>';
    }

    renderChannelContent(channel: Channel): string {
        const context = new XmlRenderingContext();

        const {
            image,
            webMaster,
            managingEditor,
            category = [],
            cloud,
        } = channel.props;

        context
            .render('title', this.getChannelRenderableValue(channel, 'title'))
            .render('link', this.getChannelRenderableValue(channel, 'link'))
            .render('description', this.parseDescription(this.getChannelRenderableValue(channel, 'description')))
            .renderString(this.renderCategory(category))
            .render('language', this.getChannelRenderableValue(channel, 'language'))
            .render('copyright', this.getChannelRenderableValue(channel, 'copyright'))
            .renderString(image ? this.renderImage(image) : '')
            .renderString(webMaster ? this.renderPerson('webMaster', webMaster) : '')
            .renderString(managingEditor ? this.renderPerson('managingEditor', managingEditor) : '')
            .render('pubDate', this.getChannelRenderableValue(channel, 'pubDate'))
            .render('lastBuildDate', this.getChannelRenderableValue(channel, 'lastBuildDate'))
            .render('generator', this.getChannelRenderableValue(channel, 'generator'))
            .render('docs', this.getChannelRenderableValue(channel, 'docs'))
            .renderString(cloud ? this.renderCloud(cloud) : '')
            .render('ttl', this.getChannelRenderableValue(channel, 'ttl'))
            .render('rating', this.getChannelRenderableValue(channel, 'rating'))
            .render('textInput', this.getChannelRenderableValue(channel, 'textInput'))
            .render('skipHours', this.getChannelRenderableValue(channel, 'skipHours'))
            .render('skipDays', this.getChannelRenderableValue(channel, 'skipDays'));

        return context.string;
    }

    renderChannelFooter(channel: Channel): string {
        return '</channel>';
    }

    renderEpisodeHeader(episode: Episode): string {
        return '<item>';
    }

    renderEpisodeContent(episode: Episode): string {
        const context = new XmlRenderingContext();

        const {
            source,
            enclosure,
            author,
            category = [],
            guid,
        } = episode.props;

        context
            .render('title', this.getEpisodeRenderableValue(episode, 'title'))
            .render('description', this.parseDescription(this.getEpisodeRenderableValue(episode, 'description')))
            .render('link', this.getEpisodeRenderableValue(episode, 'link'))
            .render('comments', this.getEpisodeRenderableValue(episode, 'comments'))
            .render('pubDate', this.getEpisodeRenderableValue(episode, 'pubDate'))
            .renderString(source ? this.renderEpisodeSource(source) : '')
            .renderString(enclosure ? this.renderEpisodeEnclosure(enclosure) : '')
            .renderString(author ? this.renderPerson('author', author) : '')
            .renderString(this.renderCategory(category))
            .renderString(guid ? this.renderEpisodeGuid(guid) : '');

        return context.string;
    }

    renderEpisodeFooter(episode: Episode): string {
        return '</item>';
    }

    renderFooter(channel: Channel): string {
        return `</rss>`;
    }

    containsHtml(str: string): boolean {
        return str.includes('<');
    }

    renderHtmlContent(str: string) {
        return `<![CDATA[${str}]]>`;
    }

    render(channel: Channel): string {
        let rssString = '';

        rssString += this.renderHeader(channel);
        rssString += this.renderChannelHeader(channel);
        rssString += this.renderChannelContent(channel);
        rssString += channel.episodes.map(episode =>
            `${this.renderEpisodeHeader(episode)}${this.renderEpisodeContent(episode)}${this.renderEpisodeFooter(episode)}`,
        );
        rssString += this.renderChannelFooter(channel);
        rssString += this.renderFooter(channel);

        return rssString;
    }

    protected renderCategory(categories: ICategoryProps[]): string {
        return String(XmlCategoryRenderer.fromProps(categories));
    }

    protected parseDescription(val: string): string {
        return this.containsHtml(val)
            ? this.renderHtmlContent(val)
            : val;
    }

    protected renderImage(image: IImageProps): string {
        return String(XmlImageRenderer.fromProps(image));
    }

    protected renderPerson(tagName: 'managingEditor' | 'webMaster' | 'author', person: IPersonProps) {
        const context = new XmlRenderingContext();

        return context.render(tagName, String(Person.fromProps(person))).string;
    }

    protected renderCloud(cloud: ICloudProps): string {
        return String(XmlCloudRenderer.fromProps(cloud));
    }

    protected renderEpisodeSource(source: IEpisodeSourceProps): string {
        return String(XmlEpisodeSourceRenderer.fromProps(source));
    }

    protected renderEpisodeEnclosure(enclosure: IEpisodeEnclosure): string {
        return String(XmlEnclosureRenderer.fromProps(enclosure));
    }

    protected renderEpisodeGuid(guidOrString: IGuidProps | string): string {
        const guid: IGuidProps = typeof guidOrString === 'string' ? { value: guidOrString } : guidOrString;

        return String(XmlEpisodeGuidRenderer.fromProps(guid));
    }
}

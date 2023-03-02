import { Channel } from '~/Channel';
import { Episode } from '~/Episode';
import { IPagination, UiRenderer } from '~/renderer/UiRenderer';
import { ICategoryProps } from '~/IRssCommon';
import { HtmlRenderingContext } from '~/renderer/html/HtmlRenderingContext';
import {
    IOverrideType,
    parseHMSToHtmlDurationString,
    parseHMSToReadableString,
    parsePublishDateToReadableString,
    parseSecondsToHMS,
    Person, sanitizeHtmlString,
} from '~/common';


export interface IHtmlRss2RendererOptions {

    trimEpisodeDescInListTo: number;

    cssClassPrefix: string;
}

const defaultOptions: IHtmlRss2RendererOptions = {
    cssClassPrefix: 'rss2-html-',
    trimEpisodeDescInListTo: 200,
};

export class HtmlRss2Renderer extends UiRenderer<IHtmlRss2RendererOptions> {
    constructor(options: Partial<IHtmlRss2RendererOptions> = {}) {
        super({ ...defaultOptions, ...options });
    }

    renderCategories(categories: ICategoryProps[]): string {
        const renderingContext = new HtmlRenderingContext();

        renderingContext.render(
            'div',
            ctx => {
                categories.map(({ value }) => ctx.render('span', value));
                return ctx;
            },
            {
                class: this.getCssClass('categories'),
            },
        );

        return renderingContext.string;
    }

    renderFooter(channel: Channel): string {
        return `</section>`;
    }

    renderHeader(channel: Channel): string {
        return `<section class='rss2-html-items-list'>`;
    }

    renderChannelHeader(channel: Channel): string {
        const {
            title,
            category = [],
            image,
        } = channel.props;
        const author = channel.getValueFromOverrides(IOverrideType.itunes, 'author') as Person | undefined;

        const renderingContext = new HtmlRenderingContext();

        renderingContext.render(
            'header',

            ctx => ctx
                .renderIf(image)('img', undefined, {
                    src: image?.url,
                    width: image?.width,
                    height: image?.height,
                    alt: image?.description,
                    title: image?.title,
                    ...this.getCssClassAttributes('channel-image'),
                })
                .render(
                    'div',
                    ctxHeaderContent => ctxHeaderContent
                        .render('h1', title, this.getCssClassAttributes('channel-title'))
                        .renderIf(author)('h2', author?.name, {
                            title: 'Author',
                            ...this.getCssClassAttributes({
                                'channel-author': true,
                                subtitle: true,
                            }),
                        })
                        .renderString(this.renderCategories(category)),
                    this.getCssClassAttributes('header-content'),
                ),
            {
                class: this.getCssClass({
                    'header': true,
                    'header-with-image': image,
                }),
            },
        );

        return renderingContext.string;
    }

    renderChannelBody(channel: Channel): string {
        const renderingContext = new HtmlRenderingContext();
        const {
            description,
        } = channel.props;

        return renderingContext
            .render(
                'div',
                ctx => ctx
                    .render('div', description, { class: this.getCssClass('description') }),
                this.getCssClassAttributes('body-container'),
            ).string;
    }

    renderEpisodeList(channel: Channel, { itemsPerPage, offset }: IPagination): string {
        const renderingContext = new HtmlRenderingContext();

        renderingContext.render(
            'div',
            channel.episodes
                .slice(offset, itemsPerPage)
                .map((episode) => this.renderEpisodeListItem(episode))
                .join(''),
            {
                class: this.getCssClass('episode-list'),
            },
        );

        return renderingContext.string;
    }

    renderAudioPlayer(episode: Episode): string {
        const renderingContext = new HtmlRenderingContext();
        const {
            enclosure
        } = episode.props;

        return renderingContext
            .renderIf(enclosure?.url)('audio', undefined, {
                src: enclosure?.url,
                controls: true,
                forceTagClosing: true,
                ...this.getCssClassAttributes('episode-page-player')
            }).string;
    }

    renderEpisodePage(channel: Channel, episode: Episode): string {
        const renderingContext = new HtmlRenderingContext();
        const img = episode.getValueFromOverrides('itunes', 'image');
        const {
            title,
            category,
            description,
        } = episode.props;
        const {
            title: channelTitle,
            link: channelLink,
        } = channel.props;


        return renderingContext
            .render(
                'section',
                sectionCtx =>
                    sectionCtx
                        .render(
                            'header',
                            headerCtx => headerCtx
                                .renderIf(img)('img', undefined, { src: img, ...this.getCssClassAttributes('episode-page-image') })
                                .render(
                                    'div',
                                    headerContentCtx => headerContentCtx
                                        .render('h1', title, this.getCssClassAttributes('episode-page-title'))
                                        .render(
                                            'a',
                                            ctx => ctx
                                                .render(
                                                    'h2',
                                                    channelTitle,
                                                    this.getCssClassAttributes('episode-page-channel-title'),
                                                ),
                                            {
                                                href: channelLink,
                                                ...this.getCssClassAttributes('episode-page-channel-link'),
                                            },
                                        )
                                        .render('div', this.renderAudioPlayer(episode), this.getCssClassAttributes('episode-page-player'))
                                        .render('div', this.renderEpisodeMeta(episode), this.getCssClassAttributes('episode-page-meta')),
                                    this.getCssClassAttributes('episode-page-header-content')),
                            this.getCssClassAttributes('episode-page-header'),
                        )
                        .render('div', description || '', this.getCssClassAttributes('episode-page-description'))
                        .renderStringIf(category)(this.renderCategories(category || []))
                        .renderString(this.renderCopyrightFooter(channel))
                ,
                this.getCssClassAttributes('episode-page'),
            ).string;
    }

    getCssClassAttributes(className: string | Record<string, any>) {
        return {
            class: this.getCssClass(className),
        };
    }

    renderPagination(channel: Channel, { activeItem, itemsPerPage, getPaginationUrl }: IPagination): string {
        const renderingContext = new HtmlRenderingContext();
        const pages = Math.ceil(channel.episodes.length / itemsPerPage);

        renderingContext.render(
            'div',
            ctx => {
                new Array(pages)
                    .fill(0)
                    .map((v, i) => i + 1)
                    .map((i) => {
                        ctx.render('a', i, {
                            ...this.getCssClassAttributes({ 'pagination-active-link': activeItem === i }),
                            href: getPaginationUrl(i, activeItem === i),
                        });
                    });

                return ctx;
            },
            this.getCssClassAttributes('episode-list-pagination'),
        );

        return renderingContext.string;
    }

    sliceAndSanitizeDescription(description: string): string {
        const sanitizedDesc = sanitizeHtmlString(description);
        const threeDots = sanitizedDesc.length > this.options.trimEpisodeDescInListTo;

        return sanitizeHtmlString(description).slice(0, this.options.trimEpisodeDescInListTo) + (threeDots ? '...' : '');
    }

    renderEpisodeMeta(episode: Episode): string {
        const renderingContext = new HtmlRenderingContext();
        const episodeDuration = episode.getValueFromOverrides(IOverrideType.itunes, 'duration');
        const {
            pubDate,
            author,
            enclosure,
        } = episode.props;

        return renderingContext
            .renderIf(episodeDuration)(
                'div',
                ctx => ctx
                    .render('span', 'Duration: ', this.getCssClassAttributes('episode-meta-item-label'))
                    .render('time', parseHMSToReadableString(parseSecondsToHMS(episodeDuration as number || 0)), {
                        datetime: parseHMSToHtmlDurationString(parseSecondsToHMS(episodeDuration as number || 0)),
                        ...this.getCssClassAttributes('episode-meta-item-value'),
                    })
                ,
                this.getCssClassAttributes('episode-meta-item'),
            )
            .renderIf(pubDate)(
                'div',
                ctx => ctx
                    .render('span', 'Date: ', this.getCssClassAttributes('episode-meta-item-label'))
                    .render('time', parsePublishDateToReadableString(pubDate as string), {
                        datetime: parsePublishDateToReadableString(pubDate as string),
                        ...this.getCssClassAttributes('episode-meta-item-value'),
                    })
                ,
                this.getCssClassAttributes('episode-meta-item'),
            )
            .renderIf(author)(
                'div',
                ctx => ctx
                    .render('span', 'Author: ', this.getCssClassAttributes('episode-meta-item-label'))
                    .render('span', Person.fromProps(author as Person).name, this.getCssClassAttributes('episode-meta-item-value'))
                ,
                this.getCssClassAttributes('episode-meta-item'),
            ).string;
    }

    renderEpisodeListItem(episode: Episode): string {
        const renderingContext = new HtmlRenderingContext();
        const img = episode.getValueFromOverrides('itunes', 'image');
        const {
            title,
            pubDate,
            link,
            category,
            author,
            enclosure,
            description,
        } = episode.props;

        renderingContext.render(
            'article',
            ctxArticle => {
                ctxArticle.render('a', ctxA => {
                        ctxA
                            .renderIf(img)('img', undefined, { src: img, ...this.getCssClassAttributes('episode-image') })
                            .render(
                                'div',
                                ctxContentDiv => {
                                    ctxContentDiv
                                        .render('h3', title, this.getCssClassAttributes('episode-title'))
                                        .render(
                                            'div',
                                            this.renderEpisodeMeta(episode),
                                            {
                                                class: this.getCssClass({
                                                    'episode-meta': true,
                                                }),
                                            },
                                        )
                                        .render('div', this.sliceAndSanitizeDescription(description || ''), this.getCssClassAttributes('episode-description'))
                                        .renderStringIf(category)(this.renderCategories(category || []));

                                    return ctxContentDiv;
                                },
                                this.getCssClassAttributes({
                                    'episode-content': true,
                                }),
                            );

                        return ctxA;
                    },
                    {
                        ...this.getCssClassAttributes('episode-link'),
                        href: link,
                    },
                );

                return ctxArticle;
            },
            this.getCssClassAttributes({
                'episode': true,
                'episode-with-image': img,
                'episode-with-enclosure': enclosure,
            }),
        );

        return renderingContext.string;
    }

    renderCopyrightFooter(channel: Channel): string {
        const renderingContext = new HtmlRenderingContext();
        const { copyright } = channel.props;

        return renderingContext.render(
            'div',
            ctx => ctx
                .render('span', copyright),
            this.getCssClassAttributes('copyright-footer'),
        ).string;
    }

    renderChannelPage(channel: Channel, pagination: IPagination): string {
        const renderingContext = new HtmlRenderingContext();

        renderingContext
            .renderString(this.renderHeader(channel))
            .renderString(this.renderChannelHeader(channel))
            .renderString(this.renderChannelBody(channel))
            .renderString(this.renderEpisodeList(channel, pagination))
            .renderString(this.renderPagination(channel, pagination))
            .renderString(this.renderCopyrightFooter(channel))
            .renderString(this.renderFooter(channel));

        return renderingContext.string;
    }

    protected getCssClass(className: string | Record<string, any>) {
        if (typeof className === 'string') {
            return `${this.options.cssClassPrefix}${className}`;
        }

        return Object.entries(className)
            .reduce(
                (acc, [key, value], i) => ([
                    ...acc,
                    ...Boolean(value) ? [`${this.options.cssClassPrefix}${key}`] : [],
                ]),
                [] as string[],
            )
            .join(' ');
    }
}

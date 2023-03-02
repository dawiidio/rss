import { XmlRss2Renderer } from '~/renderer/xml/XmlRss2Renderer';
import { Channel } from '~/Channel';
import { Person, replaceSpecialChars } from '~/common';
import { ItunesCategoryObject } from '~/external/ItunesCategory';
import { ItunesXmlCategoryRenderer } from '~/renderer/xml/itunes/parts/ItunesXmlCategoryRenderer';
import { IPersonProps } from '~/IRssCommon';
import { Episode } from '~/Episode';
import { IOverrideType } from '~/common';
import { XmlRenderingContext } from '~/renderer/xml/XmlRenderingContext';

export class ItunesXmlRss2Renderer extends XmlRss2Renderer {
    static sanitizeText(val: string | number | undefined): string | undefined {
        if (val === undefined) {
            return undefined;
        }

        return replaceSpecialChars(String(val));
    }

    protected renderItunesCategory(category: Partial<ItunesCategoryObject>): string {
        return String(ItunesXmlCategoryRenderer.fromProps(category));
    }

    protected renderItunesOwner(person: IPersonProps) {
        const context = new XmlRenderingContext();

        return context.render(
            'itunes:owner',
                ctx => ctx
                .render('itunes:email', person.email)
                .render('itunes:name', person.name)
        ).string;
    }

    renderChannelContent(channel: Channel): string {
        const originalStringContent = super.renderChannelContent(channel);
        const context = new XmlRenderingContext();

        const category = channel.getValueFromOverrides(IOverrideType.itunes, 'category');
        const explicit = channel.getValueFromOverrides(IOverrideType.itunes, 'explicit');
        const author = channel.getValueFromOverrides(IOverrideType.itunes, 'author');
        const owner = channel.getValueFromOverrides(IOverrideType.itunes, 'owner');
        const newFeedUrl = channel.getValueFromOverrides(IOverrideType.itunes, 'new-feed-url') as string | undefined;
        const block = channel.getValueFromOverrides(IOverrideType.itunes, 'block') as boolean | undefined;
        const complete = channel.getValueFromOverrides(IOverrideType.itunes, 'complete') as boolean | undefined;
        const itunesImage = channel.getValueFromOverrides(IOverrideType.itunes, 'image') as string | undefined;

        context
            .renderString(originalStringContent)
            .render('itunes:title', ItunesXmlRss2Renderer.sanitizeText(
                channel.resolveValue('title', IOverrideType.itunes)
            ))
            .render('itunes:type', ItunesXmlRss2Renderer.sanitizeText(
                channel.getStringValueFromOverrides(IOverrideType.itunes, 'type')
            ))

            .renderString(category ? this.renderItunesCategory(category as Partial<ItunesCategoryObject>) : '')
            .render('itunes:explicit', typeof explicit === 'boolean' ? String(explicit) : undefined)
            .render('itunes:block', typeof block === 'boolean' ? String(block) : undefined)
            .render('itunes:complete', typeof block === 'boolean' ? String(complete) : undefined)
            .render('itunes:author', author ? String(Person.fromProps(author as IPersonProps).name) : '')
            .renderString( owner ? this.renderItunesOwner(Person.fromProps(owner as IPersonProps)) : '')
            .render('itunes:new-feed-url', newFeedUrl ?? undefined)
            .render('itunes:image', undefined, {
                href: itunesImage
            });

        return context.string;
    }

    renderEpisodeContent(episode: Episode): string {
        const originalStringContent = super.renderEpisodeContent(episode);
        const context = new XmlRenderingContext();

        const explicit = episode.getValueFromOverrides(IOverrideType.itunes, 'explicit');
        const block = episode.getValueFromOverrides(IOverrideType.itunes, 'block');

        context
            .renderString(originalStringContent)
            .render('itunes:title', ItunesXmlRss2Renderer.sanitizeText(
                String(episode.resolveValue('title', IOverrideType.itunes))
            ))
            .render('itunes:episode',
                episode.getStringValueFromOverrides(IOverrideType.itunes, 'episode')
            )
            .render('itunes:season',
                episode.getStringValueFromOverrides(IOverrideType.itunes, 'season')
            )
            .render('itunes:episodeType',
                episode.getStringValueFromOverrides(IOverrideType.itunes, 'episodeType')
            )
            .render('itunes:image', undefined, {
                href: episode.getStringValueFromOverrides(IOverrideType.itunes, 'image')
            })
            .render('itunes:duration',
                episode.getStringValueFromOverrides(IOverrideType.itunes, 'duration')
            )
            .render('itunes:explicit', typeof explicit === 'boolean' ? String(explicit) : undefined)
            .render('itunes:block', typeof block === 'boolean' ? String(block) : undefined)


        return context.string;
    }
}

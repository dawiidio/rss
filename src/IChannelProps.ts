import { ItunesCategoryObject } from '~/external/ItunesCategory';
import { IEpisodeProps } from '~/IEpisodeProps';
import { Rfc5646LanguageTags } from './external/rfc5646LanguageTags';
import { ICategoryProps, ICloudProps, IImageProps, IPersonProps } from '~/IRssCommon';
import { IOverrideType } from '~/common';

type ItunesChannelType = 'episodic' | 'serial';

export interface ItunesChannelProps {
    type: ItunesChannelType;

    category: Partial<ItunesCategoryObject>;

    explicit: boolean;

    author: IPersonProps;

    owner: IPersonProps;

    title: string;

    'new-feed-url': string;

    block: boolean;

    complete: boolean;

    image: string;

}

export interface IChannelProps {

    /**
     * The name of the channel. It's how people refer to your service. If you have an HTML website that contains the same information as your RSS file, the title of your channel should be the same as the title of your website.
     */
    title: string;

    /**
     * The URL to the HTML website corresponding to the channel
     */
    link: string;

    /**
     * Phrase or sentence describing the channel
     */
    description: string;

    /**
     * Specify one or more categories that the channel belongs to. Follows the same rules as the <item>-level category element
     */
    category?: ICategoryProps[];

    /**
     * The language the channel is written in. This allows aggregators to group all Italian language sites, for example, on a single page. A list of allowable values for this element, as provided by Netscape, is here. You may also use values defined by the W3C
     */
    language?: Rfc5646LanguageTags;

    /**
     * Copyright notice for content in the channel
     */
    copyright?: string;

    /**
     * list of <item> objects specified in RSS2 documentation
     */
    items: IEpisodeProps[];

    /**
     * Specifies a GIF, JPEG or PNG image that can be displayed with the channel
     */
    image?: IImageProps;

    /**
     * Email address for person responsible for editorial content
     */
    managingEditor?: IPersonProps;

    /**
     * Email address for person responsible for technical issues relating to channel
     */
    webMaster?: IPersonProps;

    /**
     * The publication date for the content in the channel. For example, the New York Times publishes on a daily basis, the publication date flips once every 24 hours. That's when the pubDate of the channel changes. All date-times in RSS conform to the Date and Time Specification of RFC 822, with the exception that the year may be expressed with two characters or four characters (four preferred)
     */
    pubDate?: string;

    /**
     * The last time the content of the channel changed
     */
    lastBuildDate?: string;

    /**
     * A string indicating the program used to generate the channel
     */
    generator?: string;

    /**
     * A URL that points to the documentation for the format used in the RSS file. It's probably a pointer to this page. It's for people who might stumble across an RSS file on a Web server 25 years from now and wonder what it is.
     */
    docs?: string;

    /**
     * Allows processes to register with a cloud to be notified of updates to the channel, implementing a lightweight publish-subscribe protocol for RSS feeds
     */
    cloud?: ICloudProps;

    /**
     * ttl stands for time to live. It's a number of minutes that indicates how long a channel can be cached before refreshing from the source
     */
    ttl?: string;

    /**
     * The PICS rating for the channel
     */
    rating?: string;

    /**
     * Specifies a text input box that can be displayed with the channel
     *
     * @deprecated
     */
    textInput?: any;

    /**
     * A hint for aggregators telling them which hours they can skip
     */
    skipHours?: string;

    /**
     * A hint for aggregators telling them which days they can skip
     */
    skipDays?: string;

    overrides?: Partial<IChannelOverrides>;
}

export interface IChannelOverrides {
    [IOverrideType.itunes]: Partial<ItunesChannelProps>;
}

import { ICategoryProps, IGuidProps, IPersonProps } from '~/IRssCommon';

export type ItunesEpisodeType = 'full' | 'bonus' | 'trailer';

export interface ItunesEpisodeProps {

    image?: string;

    explicit?: boolean;

    title?: string;

    episode?: number | string;

    season?: number | string;

    episodeType?: ItunesEpisodeType;

    block?: boolean;

    duration?: string | number;
}

export interface IEpisodeEnclosure {
    url: string;

    length?: number;

    type?: string;
}

export interface IEpisodeSourceProps {
    url: string

    text?: string
}

export interface IEpisodeProps {

    /**
     * @description The title of the item
     *
     * @example Venice Film Festival Tries to Quit Sinking
     */
    title: string;

    /**
     * @description The item synopsis
     *
     * @example My description of podcast episode
     */
    description: string;

    /**
     * @description The URL of the item
     *
     * @example http://nytimes.com/2004/12/07FEST.html
     */
    link: string

    /**
     * @description Its value is the name of the RSS channel that the item came from, derived from its <title>. It has one required attribute, url, which links to the XMLization of the source
     *
     * @example <source url="http://www.tomalak.org/links2.xml">Tomalak's Realm</source>
     */
    source?: IEpisodeSourceProps

    /**
     * @description It's the email address of the author of the item. For newspapers and magazines syndicating via RSS, the author is the person who wrote the article that the <item> describes. For collaborative weblogs, the author of the item might be different from the managing editor or webmaster. For a weblog authored by a single individual it would make sense to omit the <author> element.
     *
     * @example <author>lawyer@boyer.net (Lawyer Boyer)</author>
     */
    author?: IPersonProps

    /**
     * @description Describes a media object that is attached to the item
     *
     * @example <enclosure url="http://www.scripting.com/mp3s/weatherReportSuite.mp3" length="12216320" type="audio/mpeg" />
     */
    enclosure?: IEpisodeEnclosure;

    /**
     * @description The value of the element is a forward-slash-separated string that identifies a hierarchic location in the indicated taxonomy. Processors may establish conventions for the interpretation of categories. Two examples are provided below:
     *
     *  @example <category>Grateful Dead</category>
     *  @example <category domain="http://www.fool.com/cusips">MSFT</category>
     *
     *  @description You may include as many category elements as you need to, for different domains, and to have an item cross-referenced in different parts of the same domain
     */
    category?: ICategoryProps[];

    /**
     * @description Generally in RSS2 spec `guid` field is optional, but this library requires guid to be filled
     *
     * @description guid stands for globally unique identifier. It's a string that uniquely identifies the item. When present, an aggregator may choose to use this string to determine if an item is new
     *
     * @example <guid>http://some.server.com/weblogItem3207</guid>
     *
     * @description There are no rules for the syntax of a guid. Aggregators must view them as a string. It's up to the source of the feed to establish the uniqueness of the string
     * @description If the guid element has an attribute named "isPermaLink" with a value of true, the reader may assume that it is a permalink to the item, that is, a url that can be opened in a Web browser, that points to the full item described by the <item> element. An example:
     *
     * @example <guid isPermaLink="true">http://inessential.com/2002/09/01.php#a2</guid>
     *
     * @description isPermaLink is optional, its default value is true. If its value is false, the guid may not be assumed to be a url, or a url to anything in particular
     *
     */
    guid: IGuidProps | string;

    /**
     * @description Indicates when the item was published
     *
     * @example Sun, 19 May 2002 15:21:36 GMT
     */
    pubDate?: string;

    /**
     * @description If present, it is the url of the comments page for the item
     *
     * @see https://cyber.harvard.edu/rss/rss.html#comments
     */
    comments?: string;

    overrides?: Partial<IEpisodeOverrides>
}

export interface IEpisodeOverrides {
    itunes: Partial<ItunesEpisodeProps>;
}


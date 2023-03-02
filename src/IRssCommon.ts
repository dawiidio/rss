export interface IPermalinkProps {
    isPermalink: boolean

    link: string
}

export interface IPersonProps {

    name: string;

    email?: string;
}

export interface IGuidProps {
    value: string

    isPermaLink?: boolean
}


export interface ICategoryProps {
    domain?: string

    value: string
}

export interface ICloudProps {
    domain: string

    port: number

    path: string

    registerProcedure: string

    protocol: string
}

export interface IImageProps {
    /**
     * @description is the URL of a GIF, JPEG or PNG image that represents the channel. Maximum value for width is 144, default value is 88
     */
    url: string

    /**
     * @description describes the image, it's used in the ALT attribute of the HTML <img> tag when the channel is rendered in HTML
     */
    title: string

    /**
     * @description is the URL of the site, when the channel is rendered, the image is a link to the site. (Note, in practice the image <title> and <link> should have the same value as the channel's <title> and <link>
     */
    link: string

    /**
     * @description Maximum value for width is 144, default value is 88
     */
    width?: number

    /**
     * @description Maximum value for height is 400, default value is 31
     */
    height?: number

    /**
     * @description contains text that is included in the TITLE attribute of the link formed around the image in the HTML rendering
     */
    description?: string
}

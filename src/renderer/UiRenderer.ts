import { Episode } from '~/Episode';
import { Channel } from '~/Channel';

export type IPaginationUrlFactory = (page: number, active: boolean) => string;

export interface IPagination {
    activeItem: number;

    itemsPerPage: number;

    offset: number;

    getPaginationUrl: IPaginationUrlFactory
}

export abstract class UiRenderer<T = any> {
    constructor(public options: T) {}
    abstract renderEpisodePage(channel: Channel, episode: Episode): string;

    abstract renderChannelPage(channel: Channel, pagination: IPagination): string;

    abstract renderEpisodeListItem(episode: Episode): string;

    static isUiRenderer(predicate: any): predicate is UiRenderer {
        return predicate instanceof UiRenderer;
    }
}

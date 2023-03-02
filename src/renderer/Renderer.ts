import type { IChannelProps } from '~/IChannelProps';
import { IEpisodeProps } from '~/IEpisodeProps';
import { Channel } from '~/Channel';
import { Episode } from '~/Episode';

export abstract class Renderer {
    abstract getChannelRenderableValue(channel: Channel, key: keyof IChannelProps): string;

    abstract getEpisodeRenderableValue(channel: Episode, key: keyof IEpisodeProps): string;

    abstract renderHeader(channel: Channel): string;

    abstract renderChannelHeader(channel: Channel): string;

    abstract renderChannelContent(channel: Channel): string;

    abstract renderChannelFooter(channel: Channel): string;

    abstract renderEpisodeHeader(episode: Episode): string;

    abstract renderEpisodeContent(episode: Episode): string;

    abstract renderEpisodeFooter(episode: Episode): string;

    abstract renderFooter(channel: Channel): string;

    abstract render(channel: Channel): string;

    static isRenderer(predicate: any): predicate is Renderer {
        return predicate instanceof Renderer;
    }
}

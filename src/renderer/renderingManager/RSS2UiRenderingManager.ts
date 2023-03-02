import { Channel } from '~/Channel';
import { IPagination, UiRenderer } from '~/renderer/UiRenderer';
import { IChannelProps } from '~/IChannelProps';

export class RSS2UiRenderingManager {
    public readonly channel: Channel;

    constructor(public readonly renderer: UiRenderer, channelProps: IChannelProps) {
        this.channel = Channel.fromProps(channelProps);
    }

    renderEpisodePage(guid: string): string {
        const episode = this.channel.getEpisodeByGuid(guid);

        if (!episode) {
            throw new Error(`Episode with ${guid} not found`);
        }

        return this.renderer.renderEpisodePage(this.channel, episode);
    }

    renderChannelPage(pagination: IPagination): string {
        return this.renderer.renderChannelPage(this.channel, pagination);
    }
}

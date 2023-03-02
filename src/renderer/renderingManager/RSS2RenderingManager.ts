import { Channel } from '~/Channel';
import { Renderer } from '~/renderer/Renderer';
import { IChannelProps } from '~/IChannelProps';

export class RSS2RenderingManager {
    public readonly channel: Channel;

    constructor(public readonly renderer: Renderer, channelProps: IChannelProps) {
        this.channel = Channel.fromProps(channelProps);
    }

    render(): string {
        return this.renderer.render(this.channel);
    }
}

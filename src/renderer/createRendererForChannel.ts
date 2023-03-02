import { UiRenderer } from '~/renderer/UiRenderer';
import { IChannelProps } from '~/IChannelProps';
import { Renderer } from '~/renderer/Renderer';
import { RSS2UiRenderingManager } from '~/renderer/renderingManager/RSS2UiRenderingManager';
import { RSS2RenderingManager } from '~/renderer/renderingManager/RSS2RenderingManager';

export function createRendererForChannel(renderer: UiRenderer, props: IChannelProps): RSS2UiRenderingManager;
export function createRendererForChannel(renderer: Renderer, props: IChannelProps): RSS2RenderingManager;
export function createRendererForChannel(renderer: UiRenderer | Renderer, props: IChannelProps): RSS2RenderingManager | RSS2UiRenderingManager {
    if (Renderer.isRenderer(renderer)) {
        return new RSS2RenderingManager(renderer, props);
    } else if (UiRenderer.isUiRenderer(renderer)) {
        return new RSS2UiRenderingManager(renderer, props);
    }

    throw new Error(`Unknown renderer type`);
}

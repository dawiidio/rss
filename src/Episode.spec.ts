import { describe, expect, it } from 'vitest';
import { Episode } from './Episode';
import { testChannel } from './testUtils';
import { IEpisodeProps } from './IEpisodeProps';
import { IOverrideType } from './common';

describe('Episode', () => {
    const episodeProps = testChannel.items.at(0) as IEpisodeProps;

    it('should return episode guid from props', async () => {
        const episode = new Episode(episodeProps);

        expect(episode.guid).toBe(episodeProps.guid);
    });

    it('should resolve value from overrides', async () => {
        const episode = new Episode({
            ...episodeProps,
            overrides: {
                itunes: {
                    title: 'Itunes title',
                }
            }
        });

        expect(episode.resolveValue('title', IOverrideType.itunes)).toBe('Itunes title');
    });

    it('should get value from overrides', async () => {
        const episode = new Episode({
            ...episodeProps,
            overrides: {
                itunes: {
                    image: 'https://domain.com/image.png'
                }
            }
        });

        expect(episode.getValueFromOverrides(IOverrideType.itunes, 'image')).toBe('https://domain.com/image.png');
    });

    it('should return undefined on attempt to get value which was not set in overrides', async () => {
        const episode = new Episode(episodeProps);

        expect(episode.getValueFromOverrides(IOverrideType.itunes, 'image')).toBeUndefined();
    });

    it('should return stringified value', async () => {
        const episode = new Episode({
            ...episodeProps,
            overrides: {
                itunes: {
                    season: 3
                }
            }
        });

        expect(episode.getStringValueFromOverrides(IOverrideType.itunes, 'season')).toBe('3');
    });

});

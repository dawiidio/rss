import { IChannelOverrides, IChannelProps } from '~/IChannelProps';
import { Episode } from '~/Episode';
import { Person, IOverrideType } from '~/common';

export class Channel {
    public props: IChannelProps;
    constructor(
        props: IChannelProps,
        public episodes: Episode[] = [],
    ) {
        this.props = {
            ...props,
            webMaster: new Person(props.webMaster?.name, props.webMaster?.email),
            managingEditor: new Person(props.managingEditor?.name, props.managingEditor?.email),
        };
    }

    resolveValue(key: keyof IChannelProps, overridingType?: IOverrideType): IChannelProps[typeof key] | undefined {
        const overrides = (overridingType && this.props.overrides)
            ? this.props.overrides[overridingType]
            : undefined;

        // @ts-ignore
        return (overrides && overrides[key]) || this.props[key];
    }

    getStringValueFromOverrides(overrideType: keyof IChannelOverrides, overrideKey: keyof IChannelOverrides[typeof overrideType]): string | undefined {
        const { overrides: o } = this.props;
        // @ts-ignore
        return o === undefined ? '' : String(o[overrideType][overrideKey]);
    }

    getValueFromOverrides(overrideType: keyof IChannelOverrides, overrideKey: keyof IChannelOverrides[typeof overrideType]): IChannelOverrides[typeof overrideType][typeof overrideKey] | undefined {
        const { overrides: o } = this.props;
        // @ts-ignore
        return o && o[overrideType] && o[overrideType][overrideKey];
    }

    getEpisodeByGuid(guid: string): Episode | undefined {
        return this.episodes.find(({ props: { guid: predicate } }) => predicate === guid);
    }

    static fromProps(props: IChannelProps): Channel {
        const episodes = props.items.map(e => new Episode(e));

        return new Channel(props, episodes);
    }
}

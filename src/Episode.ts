import { IEpisodeOverrides, IEpisodeProps } from '~/IEpisodeProps';
import { IOverrideType } from '~/common';

export class Episode {
    public readonly props: IEpisodeProps;

    constructor(props: IEpisodeProps) {
        this.props = { ...props };
    }

    public get guid(): string {
        const { guid } = this.props;

        return typeof guid === 'string' ? guid : guid.value;
    }

    resolveValue(key: keyof IEpisodeProps, overridingType?: IOverrideType): IEpisodeProps[typeof key] | undefined {
        const overrides = (overridingType && this.props.overrides)
            ? this.props.overrides[overridingType]
            : undefined;

        // @ts-ignore
        return (overrides && overrides[key]) || this.props[key];
    }

    getStringValueFromOverrides(overrideType: keyof IEpisodeOverrides, overrideKey: keyof IEpisodeOverrides[typeof overrideType]): string | undefined {
        const { overrides: o } = this.props;
        // @ts-ignore
        return o === undefined ? '' : String(o[overrideType][overrideKey] || '');
    }

    getValueFromOverrides(overrideType: keyof IEpisodeOverrides, overrideKey: keyof IEpisodeOverrides[typeof overrideType]): IEpisodeOverrides[typeof overrideType][typeof overrideKey] | undefined {
        const { overrides: o } = this.props;
        // @ts-ignore
        return o && o[overrideType] && o[overrideType][overrideKey];
    }
}

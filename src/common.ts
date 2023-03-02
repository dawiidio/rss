import { IPersonProps } from '~/IRssCommon';
import dayjs from 'dayjs';
import format from 'dayjs/plugin/customParseFormat';
import sanitizeHtml from 'sanitize-html';

dayjs.extend(format);

export enum IOverrideType {
    itunes = 'itunes'
}

export const sanitizeHtmlString = (str: string): string => {
    return sanitizeHtml(str);
};

export const replaceSpecialChars = (str: string): string => str
    .replaceAll('&', '&amp;')
    .replaceAll('"', '&quot;')
    .replaceAll('<', '&lt;')
    .replaceAll('>', '&gt;')
    .replaceAll('\'', '&apos;')
    .replaceAll('℗', '&#x2117;')
    .replaceAll('™', '&#x2122;')
    .replaceAll('©', '&#xA9;');


// hms = Hours:Minutes:Seconds = 01:34:12
export const parseSecondsToHMS = (seconds: number) => new Date(seconds * 1000).toISOString().slice(11, 19);

/**
 *
 * @param hms {string} accepts `h:m:s`, `m:s` or `s`;
 */
export const parseHMSToSeconds = (hms: string): number => {
    const split = hms.split(':');

    if (split.length === 1) {
        split.unshift('0', '0');
    } else if (split.length === 2) {
        split.unshift('0');
    }

    const [h, m, s] = split;

    return parseInt(s) + (parseInt(m) * 60) + (parseInt(h) * 60 * 60);
};

/**
 *
 * @param mb {number} file size in megabytes
 */
export const megabytesToBytes = (mb: number): number => Math.ceil(mb * 1024 * 1024);

export const parseHMSToHtmlDurationString = (hms: string) => {
    const htmlDurationFormat = hms
        .replace(':', 'H')
        .replace(':', 'M')
        .replace(':', 'S');

    return `PT${htmlDurationFormat}`;
};

export const parseHMSToReadableString = (hms: string): string => hms
    .split(':')
    .reduce((acc, val, i) => {
        switch (i) {
            case 0:
                return acc + (parseInt(val) > 0 ? `${val}h ` : '');
            case 1:
                return acc + (parseInt(val) > 0 ? `${val}m ` : '');
            case 2:
                return acc + (parseInt(val) > 0 ? `${val}s` : '');
            default:
                return acc;
        }
    }, '');

/**
 *
 * @param date {string} UTC string: Wed, 14 Jun 2017 07:00:00 GMT
 */
export const parsePublishDateToReadableString = (date: string): string => {
    return dayjs(date).format('DD.MM.YYYY');
};


/**
 *
 * @param dateToParse {string} In format DD.MM.YYYY
 * @param time {string} In format HH:mm:ss
 */
export const parseToRSSDateFormat = (dateToParse: string, time = '12:00:00'): string => {
    return dayjs(`${dateToParse} ${time}`, 'DD.MM.YYYY HH:mm:ss').toDate().toUTCString();
};

export class Person implements IPersonProps {
    constructor(
        public name: string = '',

        public email: string = '',
    ) {
    }

    static fromString(str: string): Person {
        const [email, ...rest] = str.split(' ');

        const match = rest.join(' ').match(/\((?<name>[\w\s]+)\)/);
        const { name } = (match?.groups)
            ? match.groups as { name: string }
            : { name: '' };

        return new Person(name, email);
    }

    static fromProps({ name, email }: IPersonProps) {
        return new Person(
            name,
            email,
        );
    }

    toString() {
        if (!this.email && !this.name)
            return '';

        return `${this.email} (${this.name})`;
    }
}


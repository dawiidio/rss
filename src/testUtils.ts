import { IPersonProps } from '~/IRssCommon';
import { IChannelProps } from '~/IChannelProps';
import { IOverrideType, parseToRSSDateFormat } from '~/common';

const person: IPersonProps = {
    name: 'John Doe',
    email: 'podcast@dawiid.io',
};

export const testChannel: IChannelProps = {
    title: 'John Doe podcast',
    description: 'Lorem ipsum dolor sit amet, consectetur adipisicing elit. Architecto cumque dolor, eos id in, incidunt iste itaque laboriosam magnam minima nesciunt perferendis porro possimus quasi quisquam rem temporibus, vitae voluptate.',
    language: 'pl',
    image: {
        url: 'https://domain.com/image.jpg',
        link: 'https://domain.com/',
        title: 'Podcast image',
        description: 'Image for podcast',
    },
    pubDate: 'Tue, 07 May 2019 12:00:00 GMT',
    copyright: 'John Doe © 2023',
    cloud: {
        domain: 'domain.com',
        port: 80,
        protocol: 'xml+rss',
        path: '/api/rss',
        registerProcedure: 'mySoapProcedure',
    },
    link: 'https://domain.com/podcast',
    category: [
        {
            value: 'Technology',
        },
        {
            value: 'Natural Sciences',
        },
        {
            value: 'Programming',
        },
        {
            value: 'Frontend',
        },
        {
            value: 'AI',
        },
        {
            value: 'Personal Journals',
        },
        {
            value: 'Tech News',
        },
        {
            value: 'Design',
        },
        {
            value: 'Self-Improvement',
        },
        {
            value: 'Education',
        },
        {
            value: 'Science',
        },
        {
            value: 'Society',
        },
    ],
    generator: 'dawiidio/rss',
    managingEditor: person,
    webMaster: person,
    items: [
        {
            title: 'Lorem ipsum dolor',
            description: 'Lorem ipsum dolor sit amet, consectetur adipisicing elit. Architecto cumque dolor, eos id in, incidunt iste itaque laboriosam magnam minima nesciunt perferendis porro possimus quasi quisquam rem temporibus, vitae voluptate.',
            link: 'https://domain.com/podcast/my-guid-1',
            guid: 'my-guid-1',
            pubDate: parseToRSSDateFormat('01.03.2023'),
            author: person,
            enclosure: {
                type: 'audio/mp3',
                length: 1024,
                url: 'https://domain.com/static/podcast.mp3',
            },
            category: [
                {
                    value: 'Technology',
                    domain: 'test.com',
                },
                {
                    value: 'Technology',
                },
                {
                    value: 'Programming',
                },
            ],
            overrides: {
                itunes: {
                    image: 'https://domain.com/static/image.jpg'
                }
            }
        },
    ],
    overrides: {
        [IOverrideType.itunes]: {
            owner: {
                name: 'Company.com',
                email: 'company@email.com',
            },
            category: {
                Technology: [],
                Education: ['Self-Improvement'],
                News: ['Tech News'],
                Arts: ['Design'],
                Business: ['Entrepreneurship'],
                Science: ['Natural Sciences', 'Mathematics', 'Chemistry', 'Astronomy'],
                'Society & Culture': ['Personal Journals'],
            },
            author: person,
            image: 'https://domain.com/',
            type: 'episodic',
            explicit: false,
        },
    },
};

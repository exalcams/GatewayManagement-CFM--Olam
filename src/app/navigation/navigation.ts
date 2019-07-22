import { FuseNavigation } from '@fuse/types';

export const navigation: FuseNavigation[] = [
    {
        id       : 'applications',
        title    : 'Applications',
        translate: 'NAV.APPLICATIONS',
        type     : 'group',
        children : [
            {
                id       : 'dashboard',
                title    : 'Dashboard',
                translate: 'NAV.SAMPLE.TITLE',
                type     : 'item',
                icon     : 'dashboard',
                url      : '/dashboard',
            },
            {
                id       : 'transaction',
                title    : 'Hovering Vehicles',
                translate: 'NAV.SAMPLE.TITLE',
                type     : 'item',
                icon     : ' shopping_basket ',
                url      : '/transaction',
                // badge    : {
                //     title    : '25',
                //     translate: 'NAV.SAMPLE.BADGE',
                //     bg       : '#F44336',
                //     fg       : '#FFFFFF'
                // }
            },
            // {
            //     id       : 'gpstracking',
            //     title    : 'GPS Tracking',
            //     translate: 'NAV.SAMPLE.TITLE',
            //     type     : 'item',
            //     icon     : 'update',
            //     url      : '/gpstracking',
            // },
            {
                id       : 'configuration',
                title    : 'Configuration',
                translate: 'NAV.SAMPLE.TITLE',
                type     : 'item',
                icon     : 'settings',
                url      : '/configuration',
            },
            {
                id       : 'qrequest',
                title    : 'Q-Request',
                translate: 'NAV.SAMPLE.TITLE',
                type     : 'item',
                icon     : 'playlist_add',
                url      : '/qrequest',
            },
            {
                id       : 'qapprove',
                title    : 'Q-Approve',
                translate: 'NAV.SAMPLE.TITLE',
                type     : 'item',
                icon     : 'playlist_add_check',
                url      : '/qapprove',
            },
            {
                id       : 'qvisualization',
                title    : 'Q-Visualization',
                translate: 'NAV.SAMPLE.TITLE',
                type     : 'item',
                icon     : 'playlist_play',
                url      : '/qvisualization',
            }
        ]
    }
];

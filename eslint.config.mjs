import configure, { configs } from '@onefinity/eslint-config';

export default configure([configs.react, {
    ignores: [
        '**/*.d.ts',
        '**/*.js'
    ],
    rules: {
        'react/react-in-jsx-scope': 'off',
        'react/no-unescaped-entities': 'off',
        '@onefinity/eslint-config/import-grouping': ['error', {
            groups: [{
                matches: /^(?:\w|@\w).*$/.source
            }, {
                label: 'Constants',
                matches: /\/constants/.source
            }, {
                label: 'Components',
                matches: /\/(components|containers)/.source
            }, {
                label: 'Helpers',
                matches: /\/helpers/.source
            }, {
                label: 'Services',
                matches: /\/services/.source
            }, {
                label: 'Styles',
                matches: /\/(scss|styles.module.scss)/.source
            }, {
                label: 'Types',
                matches: /\/types/.source
            }]
        }]
    }
}]);

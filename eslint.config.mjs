import configure, { configs } from '@onefinity/eslint-config';

export default configure([{
    ignores: [
        '**/*.d.ts',
        '**/*.js'
    ]
}, configs.react, {
    rules: {
        'react/react-in-jsx-scope': 'off',
        'react/no-unescaped-entities': 'off',
        'unicorn/filename-case': ['error', {
            cases: {
                camelCase: true,
                pascalCase: true
            }
        }],
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
                label: 'Hooks',
                matches: /\/hooks/.source
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

import reactPlugin from 'eslint-plugin-react';
import configure, { configs } from '@onefinity/eslint-config';

import propsInline from './eslint-rules/jsx-props-inline/index.js'; // eslint-disable-line @onefinity/eslint-config/import-grouping
import componentPropsString from './eslint-rules/use-component-props-string/index.js';

export default configure([{
    ignores: [
        '**/*.d.ts',
        '**/*.js',
        'eslint-rules/**'
    ]
}, configs.react, {
    plugins: {
        react: reactPlugin,
        sprout: {
            rules: {
                'jsx-props-inline': propsInline,
                'use-component-props-string': componentPropsString
            }
        }
    },
    settings: {
        react: {
            version: '19.2.7'
        }
    },
    rules: {
        'react/react-in-jsx-scope': 'off',
        'react/no-unescaped-entities': 'off',
        'react/jsx-fragments': ['error', 'element'],
        'react/function-component-definition': ['error', {
            namedComponents: 'arrow-function',
            unnamedComponents: 'arrow-function'
        }],
        '@stylistic/jsx-max-props-per-line': 'off',
        '@stylistic/jsx-first-prop-new-line': 'off',
        '@stylistic/jsx-closing-bracket-location': 'off',
        'object-property-newline': 'off',
        'sprout/jsx-props-inline': 'error',
        'sprout/use-component-props-string': 'error',
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

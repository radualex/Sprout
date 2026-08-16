import reactPlugin from 'eslint-plugin-react';
import configure, { configs } from '@onefinity/eslint-config';

import propsInline from './eslint-rules/jsx-props-inline/index.js'; // eslint-disable-line @onefinity/eslint-config/import-grouping
import componentPropsString from './eslint-rules/use-component-props-string/index.js';
import noLiteralClassname from './eslint-rules/no-literal-classname/index.js';
import noInlineObjectLiteral from './eslint-rules/no-inline-object-literal/index.js';
import noInlineHandlers from './eslint-rules/no-inline-handlers/index.js';
import noClassnameTernary from './eslint-rules/no-classname-ternary/index.js';

export default configure([{
    ignores: [
        '**/*.d.ts',
        '**/*.js',
        'eslint-rules/**',
        '.next/**',
        'src/js/lib/db/auth-schema.ts'
    ]
}, configs.react, {
    plugins: {
        react: reactPlugin,
        sprout: {
            rules: {
                'jsx-props-inline': propsInline,
                'use-component-props-string': componentPropsString,
                'no-literal-classname': noLiteralClassname,
                'no-inline-object-literal': noInlineObjectLiteral,
                'no-inline-handlers': noInlineHandlers,
                'no-classname-ternary': noClassnameTernary
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
        'curly': ['error', 'all'],
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
        'sprout/no-literal-classname': 'error',
        'sprout/no-inline-object-literal': 'error',
        'sprout/no-inline-handlers': 'error',
        'sprout/no-classname-ternary': 'error',
        '@typescript-eslint/naming-convention': ['error', {
            selector: 'variable',
            format: ['camelCase', 'PascalCase', 'UPPER_CASE'],
            leadingUnderscore: 'forbid',
            trailingUnderscore: 'forbid'
        }, {
            selector: 'parameter',
            format: ['camelCase', 'PascalCase', 'UPPER_CASE'],
            leadingUnderscore: 'forbid',
            trailingUnderscore: 'forbid'
        }, {
            selector: 'function',
            format: ['camelCase', 'PascalCase', 'UPPER_CASE'],
            leadingUnderscore: 'forbid',
            trailingUnderscore: 'forbid'
        }],
        '@stylistic/padding-line-between-statements': ['error', {
            blankLine: 'always',
            prev: '*',
            next: 'return'
        }],
        'unicorn/catch-error-name': 'off',
        'unicorn/filename-case': ['error', {
            cases: {
                camelCase: true,
                pascalCase: true,
                kebabCase: true
            }
        }],
        '@onefinity/eslint-config/import-grouping': ['error', {
            groups: [{
                matches: /^(?:\w|@\w).*$/.source
            }, {
                label: 'Schema',
                matches: /\/auth-schema/.source
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
                label: 'Database',
                matches: /(?:\/lib\/db|\/db\/|\.\/index|\.\/schema)/.source
            }, {
                label: 'Auth',
                matches: /(?:\/lib\/auth|\/auth\/|\.\.\/auth)/.source
            }, {
                label: 'Styles',
                matches: /\/(scss|styles.module.scss)/.source
            }, {
                label: 'Types',
                matches: /\/types/.source
            }]
        }]
    }
}, {
    // Turbopack requires the proxy matcher to be a static string constant; the
    // rule would force a String.raw template literal (a runtime call) which
    // breaks `next build`.
    files: ['src/proxy.ts'],
    rules: {
        'unicorn/prefer-string-raw': 'off'
    }
}]);

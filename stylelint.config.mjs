export default {
    extends: [
        '@onefinity/stylelint-config',
        '@dreamsicle.io/stylelint-config-tailwindcss'
    ],
    rules: {
        'declaration-property-value-disallowed-list': {
            display: ['inline-block']
        },
        // The shared config extends the SCSS preset, whose `scss/at-rule-no-unknown`
        // rule does not know the Tailwind v4 directives. Allow them explicitly so
        // the Tailwind entry and component modules lint cleanly.
        'scss/at-rule-no-unknown': [true, {
            ignoreAtRules: [
                'apply',
                'custom-variant',
                'reference',
                'source',
                'theme',
                'utility',
                'variant'
            ]
        }]
    },
    overrides: [{
        files: ['**/*.module.css'],
        rules: {
            'selector-class-pattern': ['^[a-z][a-zA-Z0-9]*$', {
                resolveNestedSelectors: true
            }]
        }
    }]
};

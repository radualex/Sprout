export default {
    extends: '@onefinity/stylelint-config',
    rules: {
        'declaration-property-value-disallowed-list': {
            display: ['inline-block']
        },
        // Next resolves the `@/` alias to the full filename, so @use must
        // include the `.module.scss` extension (the alias won't resolve otherwise).
        'scss/load-partial-extension': undefined
    }
};

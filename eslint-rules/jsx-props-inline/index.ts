import type { TSESLint, TSESTree } from '@typescript-eslint/utils';

const MESSAGE_ID = 'props-inline';

type MessageIds = typeof MESSAGE_ID;

const rule: TSESLint.RuleModule<MessageIds> = {
    meta: {
        type: 'layout',
        fixable: 'code',
        docs: {
            description: 'Enforce that JSX props are written inline on a single line.'
        },
        schema: [],
        messages: {
            [MESSAGE_ID]: 'All props must be inline on a single line.'
        }
    },
    create(context) {
        return {
            JSXOpeningElement(node: TSESTree.JSXOpeningElement) {
                const { attributes } = node;
                if (attributes.length === 0) {
                    return;
                }

                const firstLine = attributes[0].loc.start.line;
                const spansMultipleLines = attributes.some((attribute) => {
                    return attribute.loc.start.line !== firstLine || attribute.loc.end.line !== firstLine;
                });

                if (!spansMultipleLines) {
                    return;
                }

                context.report({
                    node,
                    messageId: MESSAGE_ID,
                    fix(fixer) {
                        const sourceCode = context.sourceCode;
                        const text = sourceCode.getText(node);

                        if (text.includes('\n')) {
                            const attributeTexts = attributes.map((attribute) => {
                                return sourceCode.getText(attribute);
                            });
                            if (attributeTexts.some((attributeText) => {
                                return attributeText.includes('\n');
                            })) {
                                return null;
                            }
                        }

                        const joined = ` ${attributes.map((attribute) => {
                            return sourceCode.getText(attribute);
                        }).join(' ')} `;
                        const tagName = sourceCode.getText(node.name);
                        return fixer.replaceText(node, `<${tagName}${joined}>`);
                    }
                });
            }
        };
    }
};

export default rule;

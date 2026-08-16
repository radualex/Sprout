import type { TSESLint, TSESTree } from '@typescript-eslint/utils';

const MESSAGE_ID = 'inline-object';

type MessageIds = typeof MESSAGE_ID;

const rule: TSESLint.RuleModule<MessageIds> = {
    meta: {
        type: 'layout',
        docs: {
            description: 'Disallow single-line object literals; every property must be on its own line.'
        },
        schema: [],
        messages: {
            [MESSAGE_ID]: 'Object literal must span multiple lines (one property per line).'
        }
    },
    create(context) {
        return {
            ObjectExpression(node: TSESTree.ObjectExpression) {
                if (node.properties.length === 0) {
                    return;
                }
                if (node.loc.start.line !== node.loc.end.line) {
                    return;
                }
                context.report({ node, messageId: MESSAGE_ID });
            }
        };
    }
};

export default rule;

import type { TSESLint, TSESTree } from '@typescript-eslint/utils';

const MESSAGE_ID = 'inline-handler';

type MessageIds = typeof MESSAGE_ID;

const rule: TSESLint.RuleModule<MessageIds> = {
    meta: {
        type: 'problem',
        docs: {
            description: 'Disallow inline event-handler functions in JSX props.'
        },
        schema: [],
        messages: {
            [MESSAGE_ID]: 'Inline event handler. Extract it to a named `handle*` arrow function wrapped in useCallback.'
        }
    },
    create(context) {
        return {
            JSXAttribute(node: TSESTree.JSXAttribute) {
                const { name, value } = node;
                if (name.type !== 'JSXIdentifier' || !name.name.startsWith('on')) {
                    return;
                }
                if (value?.type !== 'JSXExpressionContainer') {
                    return;
                }
                const { expression } = value;
                if (
                    expression.type === 'ArrowFunctionExpression'
                    || expression.type === 'FunctionExpression'
                ) {
                    context.report({ node, messageId: MESSAGE_ID });
                }
            }
        };
    }
};

export default rule;

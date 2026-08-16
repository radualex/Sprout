import type { TSESLint, TSESTree } from '@typescript-eslint/utils';

const MESSAGE_ID = 'classname-ternary';

type MessageIds = typeof MESSAGE_ID;

const BANNED_TYPES = new Set([
    'ConditionalExpression',
    'TemplateLiteral',
    'LogicalExpression',
    'CallExpression'
]);

function isAllowed(node: TSESTree.JSXExpressionContainer): boolean {
    return !BANNED_TYPES.has(node.expression.type);
}

const rule: TSESLint.RuleModule<MessageIds> = {
    meta: {
        type: 'problem',
        docs: {
            description: 'Require className to be a single styles.x (or a classNames() result); no ternary or concatenated class strings.'
        },
        schema: [],
        messages: {
            [MESSAGE_ID]: 'Build className with classNames(styles.root, ...) or use a single styles.x inline.'
        }
    },
    create(context) {
        return {
            JSXAttribute(node: TSESTree.JSXAttribute) {
                const { name, value } = node;
                if (name.type !== 'JSXIdentifier' || name.name !== 'className') {
                    return;
                }
                if (value?.type === 'JSXExpressionContainer' && !isAllowed(value)) {
                    context.report({ node, messageId: MESSAGE_ID });
                }
            }
        };
    }
};

export default rule;
import type { TSESLint, TSESTree } from '@typescript-eslint/utils';

const MESSAGE_ID = 'literal-classname';

type MessageIds = typeof MESSAGE_ID;

const rule: TSESLint.RuleModule<MessageIds> = {
    meta: {
        type: 'problem',
        docs: {
            description: 'Disallow hard-coded string className values; use CSS module classes instead.'
        },
        schema: [],
        messages: {
            [MESSAGE_ID]: 'Hard-coded className string. Use a class from a *.module.scss stylesheet (styles.x).'
        }
    },
    create(context) {
        return {
            JSXAttribute(node: TSESTree.JSXAttribute) {
                const { name, value } = node;
                if (name.type !== 'JSXIdentifier' || name.name !== 'className') {
                    return;
                }
                if (value?.type === 'Literal' && typeof value.value === 'string') {
                    context.report({ node, messageId: MESSAGE_ID });
                }
            }
        };
    }
};

export default rule;

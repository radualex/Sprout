import type { TSESLint, TSESTree } from '@typescript-eslint/utils';

const MESSAGE_ID = 'use-tag-string';
const MESSAGE_ID_AMBIGUOUS = 'ambiguous-tag';

type MessageIds = typeof MESSAGE_ID | typeof MESSAGE_ID_AMBIGUOUS;

const ELEMENT_TO_TAG: Record<string, string> = {
    HTMLAnchorElement: 'a',
    HTMLAreaElement: 'area',
    HTMLAudioElement: 'audio',
    HTMLBaseElement: 'base',
    HTMLBodyElement: 'body',
    HTMLBRElement: 'br',
    HTMLButtonElement: 'button',
    HTMLCanvasElement: 'canvas',
    HTMLDataElement: 'data',
    HTMLDataListElement: 'datalist',
    HTMLDetailsElement: 'details',
    HTMLDialogElement: 'dialog',
    HTMLDivElement: 'div',
    HTMLDListElement: 'dl',
    HTMLEmbedElement: 'embed',
    HTMLFieldSetElement: 'fieldset',
    HTMLFormElement: 'form',
    HTMLHRElement: 'hr',
    HTMLIFrameElement: 'iframe',
    HTMLImageElement: 'img',
    HTMLInputElement: 'input',
    HTMLLabelElement: 'label',
    HTMLLegendElement: 'legend',
    HTMLLIElement: 'li',
    HTMLLinkElement: 'link',
    HTMLMapElement: 'map',
    HTMLMenuElement: 'menu',
    HTMLMeterElement: 'meter',
    HTMLModElement: 'ins',
    HTMLObjectElement: 'object',
    HTMLOListElement: 'ol',
    HTMLOptGroupElement: 'optgroup',
    HTMLOptionElement: 'option',
    HTMLOutputElement: 'output',
    HTMLParagraphElement: 'p',
    HTMLPictureElement: 'picture',
    HTMLPreElement: 'pre',
    HTMLProgressElement: 'progress',
    HTMLQuoteElement: 'blockquote',
    HTMLScriptElement: 'script',
    HTMLSelectElement: 'select',
    HTMLSlotElement: 'slot',
    HTMLSourceElement: 'source',
    HTMLSpanElement: 'span',
    HTMLStyleElement: 'style',
    HTMLTableElement: 'table',
    HTMLTableCaptionElement: 'caption',
    HTMLTableDataCellElement: 'td',
    HTMLTableHeaderCellElement: 'th',
    HTMLTableRowElement: 'tr',
    HTMLTemplateElement: 'template',
    HTMLTextAreaElement: 'textarea',
    HTMLTimeElement: 'time',
    HTMLTitleElement: 'title',
    HTMLTrackElement: 'track',
    HTMLUListElement: 'ul',
    HTMLVideoElement: 'video'
};

/** Element interfaces that map to multiple possible tags. */
const AMBIGUOUS_ELEMENTS = [
    'HTMLHeadingElement'
];

/**
 * Extract the `ComponentProps` name from either a TSTypeReference typeName
 * (TSQualifiedName/Identifier) or a TSInterfaceHeritage expression
 * (MemberExpression/Identifier). Returns the name if it refers to
 * `ComponentProps`, otherwise undefined.
 */
function getComponentPropsName(nameNode: TSESTree.Expression | TSESTree.EntityName): string | undefined {
    if (!nameNode) {
        return undefined;
    }
    if (nameNode.type === 'Identifier') {
        return nameNode.name === 'ComponentProps' ? nameNode.name : undefined;
    }
    if (nameNode.type === 'TSQualifiedName') {
        return nameNode.right.name === 'ComponentProps' ? nameNode.right.name : undefined;
    }
    if (nameNode.type === 'MemberExpression' && !nameNode.computed) {
        return nameNode.property.name === 'ComponentProps' ? nameNode.property.name : undefined;
    }
    return undefined;
}

const rule: TSESLint.RuleModule<MessageIds> = {
    meta: {
        type: 'suggestion',
        fixable: 'code',
        docs: {
            description: 'Require React.ComponentProps to use the string-literal tag form.'
        },
        schema: [],
        messages: {
            [MESSAGE_ID]: 'Use React.ComponentProps<\'{{tag}}\'> instead of React.ComponentProps<{{element}}>.',
            [MESSAGE_ID_AMBIGUOUS]: 'Use a tag-string form of React.ComponentProps instead of React.ComponentProps<{{element}}>.'
        }
    },
    create(context) {
        function check(node: TSESTree.TSTypeReference | TSESTree.TSInterfaceHeritage) {
            const nameNode = node.type === 'TSTypeReference' ? node.typeName : node.expression;
            if (!getComponentPropsName(nameNode)) {
                return;
            }

            const typeArguments = node.typeArguments;
            const firstArgument = typeArguments?.params[0];
            if (!firstArgument || firstArgument.type !== 'TSTypeReference') {
                return;
            }

            const typeName = firstArgument.typeName;
            const elementName = typeName.type === 'Identifier' ? typeName.name : undefined;
            if (!elementName) {
                return;
            }

            const tag = ELEMENT_TO_TAG[elementName];
            if (tag) {
                context.report({
                    node: firstArgument,
                    messageId: MESSAGE_ID,
                    data: { tag, element: elementName },
                    fix(fixer) {
                        return fixer.replaceText(firstArgument, `'${tag}'`);
                    }
                });
                return;
            }

            if (AMBIGUOUS_ELEMENTS.includes(elementName)) {
                context.report({
                    node: firstArgument,
                    messageId: MESSAGE_ID_AMBIGUOUS,
                    data: { element: elementName }
                });
            }
        }

        return {
            TSTypeReference: check,
            TSInterfaceHeritage: check
        };
    }
};

export default rule;

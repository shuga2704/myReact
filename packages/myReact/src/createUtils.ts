export const createElement = (type: any, props: any, ...children: any) => {
    return {
        type,
        props: {
            ...props,
            children: children.map((child: any) =>
                typeof child === 'object' ? child : createTextElement(child),
            ),
        },
    };
};

export const createTextElement = (text: any) => {
    return {
        type: 'TEXT_ELEMENT',
        props: {
            nodeValue: text,
            children: [],
        },
    };
};

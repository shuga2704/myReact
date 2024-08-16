export function shouldSetTextContent(type: any, props: any) {
    return (
        typeof props.children === 'string' || typeof props.children === 'number'
    );
}

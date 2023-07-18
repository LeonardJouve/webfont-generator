import fs from 'fs';
import SvgPath from 'svgpath';
import {
    SvgNodeTags,
    REQUIRED_ATTRIBUTES,
    type CircleNode,
    type EllipseNode,
    type LineNode,
    type PolygonNode,
    type PolylineNode,
    type RectangleNode,
    type SvgNode,
    type Node,
    type Icon,
    type ViewBox,
} from '../types/svg';

const SVG_EXTENSION = /\.svg$/;

export const getIcons = (iconsPath: string): Icon[] => {
    const icons = fs.readdirSync(iconsPath, {encoding: 'utf-8'});
    return icons.
        filter((icon) => SVG_EXTENSION.test(icon)).
        map((icon) => {
            const svg = fs.readFileSync(`${iconsPath}/${icon}`, {encoding: 'utf-8'});
            const {x, y, width} = getSvgViewBox(svg);
            const path =  scalePath(getIconPath(svg), 1000 / width, x + width / 2, y);
            const name = icon.replaceAll('_', '-').replace(SVG_EXTENSION, '');
            return {
                name,
                path,
                width,
            };
        });
};

const getSvgViewBox = (svg: string): ViewBox => {
    const svgNode = getNodes(svg).find((node) => node.name === 'svg');
    if (!svgNode) {
        throw new Error('Invalid svg. Unable to find <svg> tag.');
    }
    const {content} = svgNode;
    const viewBox = getAttribute(content, 'viewBox');
    if (viewBox) {
        const viewBoxArray = viewBox.split(' ');
        if (viewBoxArray.length < 4) {
            throw new Error(`Invalid viewBox attribute. It must containe 4 numbers. ${viewBox}`);
        }
        return {
            x: Number(viewBoxArray[0]),
            y: Number(viewBoxArray[1]),
            width: Number(viewBoxArray[2]),
        };
    }
    const width = getAttribute(content, 'width');
    if (!width) {
        throw new Error('Svg must contain at least width or viewBox attribute');
    }
    return {
        width: Number(width),
        x: 0,
        y: 0,
    };
};

const scalePath = (path: string, scale: number, x: number, y: number) => new SvgPath(path).
    translate(-x, -y).
    scale(scale).
    abs().
    round(1).
    toString();

const getIconPath = (svg: string): string => getPaths(svg).join(' ');

const getPaths = (svg: string): string[] => getNodes(svg).
    filter(({name}) => isValidNode(name)).
    map(({name, content}) => new SvgPath(parseNode(name as SvgNodeTags, content)).
        abs().
        toString());

const isValidNode = (name: string) => (Object.values(SvgNodeTags) as string[]).includes(name);

const getNodes = (svg: string): Node[] => {
    const nodes: Node[] = [];
    let index = 0;
    let node: Node|null;
    while (node = getNode(svg, index)) {
        index = node.end;
        nodes.push(node);
    }
    return nodes;
};

const OPEN_TAG = /<\w+/;
const CLOSE_TAG = '>';
const TAG =  /(?!<)\w+(?=\s)/;

const getNode = (svg: string, start: number): Node|null => {
    const slice = svg.substring(start);
    const open = slice.search(OPEN_TAG);
    const close = slice.indexOf(CLOSE_TAG, open) + 1;
    if (!slice || open === -1 || close === -1) {
        return null;
    }
    const content = slice.slice(open, close);
    const tagMatch = TAG.exec(content);
    if (!tagMatch || !tagMatch.length) {
        throw new Error(`Invalid tag ${content}`);
    }
    const [name] = tagMatch;
    return {
        name,
        content,
        end: start + close,
    };
};

const parseNode = (name: SvgNodeTags, content: string): string => {
    const {tag, attributes} = getAttributes(name, content);
    switch (tag) {
    case SvgNodeTags.GLYPH:
    case SvgNodeTags.PATH:
        return attributes.d;
    case SvgNodeTags.CIRCLE:
        return circleToPath(attributes);
    case SvgNodeTags.ELLIPSE:
        return ellipseToPath(attributes);
    case SvgNodeTags.RECTANGLE:
        return rectangleToPath(attributes);
    case SvgNodeTags.POLYGON:
        return polygonToPath(attributes);
    case SvgNodeTags.POLYLINE:
        return polylineToPath(attributes);
    case SvgNodeTags.LINE:
        return lineToPath(attributes);
    }
};

const getAttributes = (tag: SvgNodeTags, content: string): SvgNode => {
    const requiredAttributes = REQUIRED_ATTRIBUTES[tag];
    const attributes = Object.keys(requiredAttributes).reduce((acc, requiredAttribute) => {
        const attribute = getAttribute(content, requiredAttribute);
        if (!attribute) {
            throw new Error(`Invalid attribute ${requiredAttribute} ${attribute} in ${content}`);
        }
        let value;
        if (requiredAttributes[requiredAttribute as keyof typeof requiredAttributes] === 'number') {
            value = Number(attribute);
        } else {
            value = attribute;
        }
        return {
            ...acc,
            [requiredAttribute]: value,
        };
    }, {});
    return {
        tag,
        attributes,
    } as SvgNode;
};

const getAttribute = (node: string, attribute: string, delimiter = '\"'): string|null => {
    const patternStart = `${attribute}=${delimiter}`;
    const start = node.indexOf(patternStart);
    const end = node.indexOf(delimiter, start + patternStart.length);
    const value = node.slice(start + patternStart.length, end);
    if (start === -1 || end === -1 || !value) {
        if (delimiter === '\"') {
            return getAttribute(node, attribute, '\'');
        }
        return null;
    }
    return value;
};

const circleToPath = ({cx, cy, r}: CircleNode['attributes']): string => `M ${cx - r}, ${cy} a ${r} ${r} 0 1 0 ${2 * r} 0 a ${r} ${r} 0 1 0 ${-2 * r} 0`;

const ellipseToPath = ({cx, cy, rx, ry}: EllipseNode['attributes']): string => `M ${cx - rx} ${cy} a ${rx} ${ry} 0 1 0 ${2 * rx} 0 a ${rx} ${ry} 0 1 0 ${-2 * rx} 0`;

const rectangleToPath = ({x, y, width, height}: RectangleNode['attributes']): string => `M ${x} ${y} h ${width} v ${height} H ${x} Z`;

const lineToPath = ({x1, y1, x2, y2}: LineNode['attributes']): string => `M ${x1} ${y1} L ${x2} ${y2}`;

const polygonToPath = ({points}: PolygonNode['attributes']): string => ['M', ...points.split(/[\s|,]/), 'z'].
    map((point, index) => `${index && !(index % 2) ? 'L ' : ''}${point}`).
    join(' ');

const polylineToPath = ({points}: PolylineNode['attributes']): string => ['M', ...points.split(/[\s|,]/)].
    map((point, index) => `${index && !(index % 2) ? 'L ' : ''}${point}`).
    join(' ');

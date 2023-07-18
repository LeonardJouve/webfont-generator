import {CircleNode, EllipseNode, LineNode, PolygonNode, PolylineNode, RectangleNode, SvgNode} from 'types/svg';

export default class SvgParser {
    nodes: SvgNode[];

    static parseSvg(svg: string): SvgParser {
        const nodes: SvgNode[] = [];
        return new SvgParser(nodes);
    };

    static getAttribute(node: string, attribute: string): number {
        const patternStart = `${attribute}="`;
        const start = node.indexOf(patternStart) + patternStart.length;
        const end = node.indexOf('"', start);
        return Number(node.slice(start, end)) || 0;
    }

    constructor (nodes: SvgNode[]) {
        this.nodes = nodes;
    }

    mergePaths(): string {
        return '';
    }

    circleToPath = (attributes: CircleNode['attributes']): string => {
        const {cx, cy, r} = attributes;
        if (cx === undefined || cy === undefined || r === undefined) {
            throw new Error(`Invalid circle: cx = ${cx} cy = ${cy} r = ${r}`);
        }
        // return `M ${cx} ${cy} m ${r}, 0 a ${r},${r} 0 1,1 -(${r} * 2),0 a ${r},${r} 0 1,1  (${r} * 2),0`;
        return `M ${cx - r}, ${cy} a ${r} ${r} 0 1 0 ${2 * r} 0 a ${r} ${r} 0 1 0 ${-2 * r} 0`;
    };

    ellipseToPath = (attributes: EllipseNode['attributes']): string => {
        const {cx, cy, rx, ry} = attributes;
        return `M ${cx - rx} ${cy} a ${rx} ${ry} 0 1 0 ${2 * rx} 0 a ${rx} ${ry} 0 1 0 ${-2 * rx} 0`;
    };

    getRectanglePath = (attributes: RectangleNode['attributes']): string => {
        const {x, y, width, height} = attributes;
        return `M ${x} ${y} h ${width} v ${height} H ${x} Z`;
    };

    getLinePath = (attributes: LineNode['attributes']): string => {
        const {x1, y1, x2, y2} = attributes;
        return `M ${x1} ${y1} L ${x2} ${y2}`;
    };

    getPolygonPath = (attributes: PolygonNode['attributes']): string => {
        const points = String(attributes.points).
            split(/[\s|,]/).
            map((point, index) => `${index && !(index % 2) ? 'L ' : ''}${point}`);
        return `M ${points.join(' ')} z`;
    };

    getPolylinePath = (attributes: PolylineNode['attributes']): string => {
        const points = String(attributes.points).
            split(/[\s|,]/).
            map((point, index) => `${index && !(index % 2) ? 'L ' : ''}${point}`);
        return `M ${points.join(' ')}`;
    };
}

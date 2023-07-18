export type ViewBox = {
    x: number;
    y: number;
    width: number;
}

export type Icon = {
    name: string;
    path: string;
    width: number;
};

export enum SvgNodeTags {
    PATH = 'path',
    GLYPH = 'glyph',
    CIRCLE = 'circle',
    ELLIPSE = 'ellipse',
    RECTANGLE = 'rectangle',
    POLYGON = 'polygon',
    POLYLINE = 'polyline',
    LINE = 'line',
}

export type Node = {
    name: string;
    content: string;
    end: number;
};

export type SvgNode = PathNode | GlyphNode | CircleNode | EllipseNode | RectangleNode | PolygonNode | PolylineNode | LineNode;

export const REQUIRED_ATTRIBUTES = {
    [SvgNodeTags.PATH]: {
        d: 'string',
    },
    [SvgNodeTags.GLYPH]: {
        d: 'string',
    },
    [SvgNodeTags.CIRCLE]: {
        cx: 'number',
        cy: 'number',
        r: 'number',
    },
    [SvgNodeTags.ELLIPSE]: {
        cx: 'number',
        cy: 'number',
        rx: 'number',
        ry: 'number',
    },
    [SvgNodeTags.RECTANGLE]: {
        x: 'number',
        y: 'number',
        width: 'number',
        height: 'number',
    },
    [SvgNodeTags.POLYGON]: {
        points: 'string',
    },
    [SvgNodeTags.POLYLINE]: {
        points: 'string',
    },
    [SvgNodeTags.LINE]: {
        x1: 'number',
        y1: 'number',
        x2: 'number',
        y2: 'number',
    }
};

export type PathNode = {
    tag: SvgNodeTags.PATH;
    attributes: Record<keyof typeof REQUIRED_ATTRIBUTES[SvgNodeTags.PATH], string>;
};

export type GlyphNode = {
    tag: SvgNodeTags.GLYPH;
    attributes: Record<keyof typeof REQUIRED_ATTRIBUTES[SvgNodeTags.GLYPH], string>;
};

export type CircleNode = {
    tag: SvgNodeTags.CIRCLE,
    attributes: Record<keyof typeof REQUIRED_ATTRIBUTES[SvgNodeTags.CIRCLE], number>;
};

export type EllipseNode = {
    tag: SvgNodeTags.ELLIPSE;
    attributes: Record<keyof typeof REQUIRED_ATTRIBUTES[SvgNodeTags.ELLIPSE], number>;
};

export type RectangleNode = {
    tag: SvgNodeTags.RECTANGLE;
    attributes: Record<keyof typeof REQUIRED_ATTRIBUTES[SvgNodeTags.RECTANGLE], number>;
};

export type PolygonNode = {
    tag: SvgNodeTags.POLYGON;
    attributes: Record<keyof typeof REQUIRED_ATTRIBUTES[SvgNodeTags.POLYGON], string>;
};

export type PolylineNode = {
    tag: SvgNodeTags.POLYLINE;
    attributes: Record<keyof typeof REQUIRED_ATTRIBUTES[SvgNodeTags.POLYLINE], string>;
};

export type LineNode = {
    tag: SvgNodeTags.LINE;
    attributes: Record<keyof typeof REQUIRED_ATTRIBUTES[SvgNodeTags.LINE], number>;
};

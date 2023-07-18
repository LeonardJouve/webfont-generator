enum SvgNodeTypes {
    PATH = 'path',
    GLYPH = 'glyph',
    CIRCLE = 'circle',
    ELLIPSE = 'ellipse',
    RECTANGLE = 'rectangle',
    POLYGON = 'polygon',
    POLYLINE = 'polyline',
    LINE = 'line',
}

export type SvgNode = PathNode | GlyphNode | CircleNode | EllipseNode | RectangleNode | PolygonNode | PolylineNode | LineNode;

type Attributes<T extends Record<string, string>> = {[K in keyof T as T[K] extends string ? Lowercase<T[K]> : never]: number};

enum PathAttributes {
    D = 'd',
}

export type PathNode = {
    type: SvgNodeTypes.PATH;
    attributes: Attributes<typeof PathAttributes>;
};

enum GlyphAttributes {
    D = 'd',
}

export type GlyphNode = {
    type: SvgNodeTypes.GLYPH;
    attributes: Attributes<typeof GlyphAttributes>;
};

enum CircleAttributes {
    CX = 'cx',
    CY = 'cy',
    R = 'r',
}

export type CircleNode = {
    type: SvgNodeTypes.CIRCLE,
    attributes: Attributes<typeof CircleAttributes>;
};

enum EllipseAttributes {
    CX = 'cx',
    CY = 'cy',
    RX = 'rx',
    RY = 'ry',
}

export type EllipseNode = {
    type: SvgNodeTypes.ELLIPSE;
    attributes: Attributes<typeof EllipseAttributes>;
};

enum RectangleAttributes {
    X = 'x',
    Y = 'y',
    WIDTH = 'width',
    HEIGHT = 'height',
}

export type RectangleNode = {
    type: SvgNodeTypes.RECTANGLE;
    attributes: Attributes<typeof RectangleAttributes>;
};

enum PolygonAttributes {
    POINTS = 'points',
}

export type PolygonNode = {
    type: SvgNodeTypes.POLYGON;
    attributes: Attributes<typeof PolygonAttributes>;
};

enum PolylineAttributes {
    POINTS = 'points',
}

export type PolylineNode = {
    type: SvgNodeTypes.POLYLINE;
    attributes: Attributes<typeof PolylineAttributes>;
};

enum LineAttributes {
    X1 = 'x1',
    Y1 = 'y1',
    X2 = 'x2',
    Y2 = 'y2',
}

export type LineNode = {
    type: SvgNodeTypes.LINE;
    attributes: Attributes<typeof LineAttributes>;
};

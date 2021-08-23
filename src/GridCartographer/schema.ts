import { Edge, InBlockEdge, Marker, Terrain } from "./enums";

export interface Bounds {
  /** The x co-ordinate of the left-most occupied tile. */
  x0: number;

  /** The y co-ordinate of the top or bottom most occupied tile as defined by the co-ordinate space specified by the origin attribute of the setup object/element. */
  y0: number;

  /** The number of tiles in each row. */
  width: number;

  /** The number of rows from y0 to the last occupied row on this floor. */
  height: number;
}

export interface Cell {
  /** The index of the custom tile used by this cell. A value from 0 to 7999. Only color custom tiles can be used with tilemaps. This attribute will be omitted for empty cells and the cell can be interpreted as having an empty or default appearance if required. */
  i?: number;

  /** A string of characters that indicate special attribute flags assigned to this tile. Multiple characters can be present and will always appear in the order listed. Meanings are:
    • h Tile is horizontally flipped.
    • v Tile is vertically flipped.
    • r Tile is rotated 90 degrees clockwise. */
  sp?: string;
}

export interface Entry {
  /** The index number of the palette entry. */
  i: number;

  /** The color value of the entry expressed in HTML notation #RRGGBB. */
  rgb: string;

  /** If set to 1 this indicates a color that has been edited. */
  edit?: "1";
}

export interface Export {
  /** The friendly version number of Grid Cartographer used to export the document. This takes the form year.month.suffix. */
  from: string;

  /** The date of export in YYYY-MM-DD format. */
  date: string;

  /** The (local) time of export in HH:MM:SS format. */
  time: string;
}

export interface Floor {
  /** The number of the floor. Negative values are basements, zero is the ground floor and positive values are the floors above. */
  index: number;

  tiles: {
    bounds: Bounds;
    rows?: Row[];
  };

  notes: Note[];
}

export interface Map {
  export: Export;
  regions: Region[];
  palette?: Entry[];
}

export interface Note {
  /** The X co-ordinate of the note. */
  x: number;

  /** The Y co-ordinate of the note given in the co-ordinate space specified by the origin attribute of the setup element. */
  y: number;

  __data?: string;
}

export interface Region {
  /** The floor count of this region. Excluding ground floor if disabled. */
  floor_count: number;

  /** The index of the lowest floor. Negative values are basements. */
  lowest_floor: number;

  /** The shape of the grid used for all floors in this region. */
  grid_shape: "square" | "hexh" | "hexv";

  /** The name of a region or tilemap. */
  name: string;

  setup: {
    /** Either tl or bl which, respectively, specify either a top-left or bottom-left grid origin. */
    origin: "tl" | "bl";
  };

  floors: Floor[];
}

export interface Row {
  /** The offset to the first non-empty tile on this row. Calculate the absolute x position using bounds.x0 + start. */
  start: number;

  /** The y co-ordinate of the row in the co-ordinate space specified by the origin attribute of the setup element. */
  y: number;

  tdata: Tile[];
}

export interface Tile {
  /** A standard marker is present. */
  m?: Marker;

  /** A custom color marker is present. This is a value from 0 to 8191 corresponding to the index of the custom tile used in the color list. See the custom element for more information. */
  mcc?: number;

  /** A custom monochrome marker is present. This is a value from 0 to 8191 corresponding to the index of the custom tile used in the monochrome list. See the custom element for more information. */
  mcm?: number;

  /** The color of the marker layer. This is a palette index from 0 to 255. See the palette element below for more information. Note that color custom markers are not tinted and should ignore this value. */
  mc?: number;

  /** An in-block edge is present. */
  ibe?: "1";

  /** The style of the in-block edge of this tile. Corner edges don't have a style (only wall) and this attribute will not be present for these edges. */
  ibs?: InBlockEdge;

  /** The color of the in-block edge. This is a palette index from 0 to 255. See the palette element below for more information. */
  ibc?: number;

  /** A standard terrain type is present. */
  t?: Terrain;

  /** A custom monochrome terrain is present. This is a value from 0 to 7999 corresponding to the index of the custom tile used in the monochrome list. See the custom element for more information. */
  tcm?: number;

  /** A custom color terrain is present. This is a value from 0 to 7999 corresponding to the index of the custom tile used in the color list. See the custom element for more information. */
  tcc?: number;

  /** The color of the terrain layer. This is a palette index from 0 to 255. See the palette element section below for more information. Note that color custom terrain is not tinted and should ignore this value. */
  tc?: number;

  /** The style of the R edge of this tile. */
  r?: Edge;

  /** The style of the I edge of this tile. */
  i?: Edge;

  /** The style of the B edge of this tile. */
  b?: Edge;

  /** The color of the R edge. This is a palette index from 0 to 255. See the palette element section below for more information. See the tile data model document for the location of the R edge for the grid shape used. */
  rc?: number;

  /** The color of the I edge. This is a palette index from 0 to 255. See the palette element section below for more information. See the tile data model document for the location of the I edge for the grid shape used. */
  ic?: number;

  /** The color of the B edge. This is a palette index from 0 to 255. See the palette element section below for more information. See the tile data model document for the location of the B edge for the grid shape used. */
  bc?: number;

  /** If set to 1 this signifies the tile is dark. */
  d?: "1";

  /** A value composed from characters r, g and/or b that specify which of the three colored FX flags have been assigned to this tile. Multiple characters can be present and assigned to the tile. */
  fx?: string;

  /** If set to 1 this signifies the tile has a ceiling. */
  c?: "1";

  /** A string of characters that indicate special attribute flags assigned to this tile (custom tiles only). Multiple characters can be present and will always appear in the order listed. Meanings are:
    • h Tile is horizontally flipped.
    • v Tile is vertically flipped.
    • r Tile is rotated 90 degrees clockwise. */
  sp?: string;

  /** If the terrain snipper tool has been used on this tile to remove some part of the ground, this element is present. It can have one of two values: tl or br which represent whether the top/left or bottom/right of the tile is still visible. */
  snip?: "tl" | "br";

  /** Elevation of this tile, an integer value from 1 to 255. Tiles with an elevation of 0 will not have this attribute. */
  el?: number;
}

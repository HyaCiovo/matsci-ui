import { BufferGeometry, Float32BufferAttribute, Vector2, Vector3 } from 'three';

type FrenetFrames = {
  tangents: Vector3[];
  normals: Vector3[];
  binormals: Vector3[];
};

type CurveLike = {
  computeFrenetFrames: (segments: number, closed: boolean) => FrenetFrames;
  getPointAt: (t: number, target: Vector3) => Vector3;
  toJSON: () => unknown;
};

type RadiusTubeParameters = {
  path: CurveLike;
  tubularSegments: number;
  radius: number;
  radialSegments: number;
  closed: boolean;
};

export class RadiusTubeBufferGeometry extends BufferGeometry {
  override type = 'RadiusTubeBufferGeometry';
  declare parameters: RadiusTubeParameters;
  tangents: Vector3[] = [];
  normals: Vector3[] = [];
  binormals: Vector3[] = [];

  constructor(
    path: CurveLike,
    tubularSegments = 64,
    radius = 1,
    radialSegments = 8,
    closed = false,
    taper: (radius: number, segmentIndex: number) => number = (r) => r
  ) {
    super();

    this.parameters = {
      path,
      tubularSegments,
      radius,
      radialSegments,
      closed
    };

    const frames = path.computeFrenetFrames(tubularSegments, closed);
    this.tangents = frames.tangents;
    this.normals = frames.normals;
    this.binormals = frames.binormals;

    const vertex = new Vector3();
    const normal = new Vector3();
    const uv = new Vector2();
    let point = new Vector3();

    const vertices: number[] = [];
    const normals: number[] = [];
    const uvs: number[] = [];
    const indices: number[] = [];

    const generateSegment = (segmentIndex: number) => {
      point = path.getPointAt(segmentIndex / tubularSegments, point);

      const segmentNormal = frames.normals[segmentIndex];
      const segmentBinormal = frames.binormals[segmentIndex];

      for (let radialIndex = 0; radialIndex <= radialSegments; radialIndex++) {
        const angle = (radialIndex / radialSegments) * Math.PI * 2;
        const sin = Math.sin(angle);
        const cos = -Math.cos(angle);

        normal.x = cos * segmentNormal.x + sin * segmentBinormal.x;
        normal.y = cos * segmentNormal.y + sin * segmentBinormal.y;
        normal.z = cos * segmentNormal.z + sin * segmentBinormal.z;
        normal.normalize();

        normals.push(normal.x, normal.y, normal.z);

        const currentRadius = taper(radius, segmentIndex);
        vertex.x = point.x + currentRadius * normal.x;
        vertex.y = point.y + currentRadius * normal.y;
        vertex.z = point.z + currentRadius * normal.z;

        vertices.push(vertex.x, vertex.y, vertex.z);
      }
    };

    const generateUVs = () => {
      for (let segmentIndex = 0; segmentIndex <= tubularSegments; segmentIndex++) {
        for (let radialIndex = 0; radialIndex <= radialSegments; radialIndex++) {
          uv.x = segmentIndex / tubularSegments;
          uv.y = radialIndex / radialSegments;
          uvs.push(uv.x, uv.y);
        }
      }
    };

    const generateIndices = () => {
      for (let segmentIndex = 1; segmentIndex <= tubularSegments; segmentIndex++) {
        for (let radialIndex = 1; radialIndex <= radialSegments; radialIndex++) {
          const a = (radialSegments + 1) * (segmentIndex - 1) + (radialIndex - 1);
          const b = (radialSegments + 1) * segmentIndex + (radialIndex - 1);
          const c = (radialSegments + 1) * segmentIndex + radialIndex;
          const d = (radialSegments + 1) * (segmentIndex - 1) + radialIndex;

          indices.push(a, b, d);
          indices.push(b, c, d);
        }
      }
    };

    for (let segmentIndex = 0; segmentIndex < tubularSegments; segmentIndex++) {
      generateSegment(segmentIndex);
    }

    generateSegment(closed ? 0 : tubularSegments);
    generateUVs();
    generateIndices();

    this.setIndex(indices);
    this.setAttribute('position', new Float32BufferAttribute(vertices, 3));
    this.setAttribute('normal', new Float32BufferAttribute(normals, 3));
    this.setAttribute('uv', new Float32BufferAttribute(uvs, 2));
  }

  override toJSON() {
    const data = super.toJSON();
    (data as any).path = this.parameters.path.toJSON();
    return data as any;
  }
}

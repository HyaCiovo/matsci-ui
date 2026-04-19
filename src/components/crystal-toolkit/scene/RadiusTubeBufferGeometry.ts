import {
  BufferGeometry,
  Float32BufferAttribute,
  Vector2,
  Vector3,
} from 'three';

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

type RadiusTubeGeometry = BufferGeometry & {
  type: string;
  parameters: RadiusTubeParameters;
  tangents: Vector3[];
  normals: Vector3[];
  binormals: Vector3[];
};

export function RadiusTubeBufferGeometry(
  this: RadiusTubeGeometry,
  path: CurveLike,
  tubularSegments?: number,
  radius?: number,
  radialSegments?: number,
  closed?: boolean,
  taper?: (radius: number, segmentIndex: number) => number
) {
  BufferGeometry.call(this);

  this.type = 'RadiusTubeBufferGeometry';
  this.parameters = {
    path,
    tubularSegments: tubularSegments ?? 64,
    radius: radius ?? 1,
    radialSegments: radialSegments ?? 8,
    closed: closed ?? false,
  };

  const resolvedTubularSegments = this.parameters.tubularSegments;
  const resolvedRadius = this.parameters.radius;
  const resolvedRadialSegments = this.parameters.radialSegments;
  const resolvedClosed = this.parameters.closed;
  const taperFn = taper ?? ((r: number) => r);

  const frames = path.computeFrenetFrames(resolvedTubularSegments, resolvedClosed);

  // expose internals

  this.tangents = frames.tangents;
  this.normals = frames.normals;
  this.binormals = frames.binormals;

  // helper variables

  const vertex = new Vector3();
  const normal = new Vector3();
  const uv = new Vector2();
  let P = new Vector3();

  // buffer

  const vertices: number[] = [];
  const normals: number[] = [];
  const uvs: number[] = [];
  const indices: number[] = [];

  // create buffer data

  generateBufferData();

  // build geometry

  this.setIndex(indices);
  this.setAttribute('position', new Float32BufferAttribute(vertices, 3));
  this.setAttribute('normal', new Float32BufferAttribute(normals, 3));
  this.setAttribute('uv', new Float32BufferAttribute(uvs, 2));

  // functions

  function generateBufferData() {
    for (let i = 0; i < resolvedTubularSegments; i++) {
      generateSegment(i);
    }

    // if the geometry is not closed, generate the last row of vertices and normals
    // at the regular position on the given path
    //
    // if the geometry is closed, duplicate the first row of vertices and normals (uvs will differ)

    generateSegment(resolvedClosed === false ? resolvedTubularSegments : 0);

    // uvs are generated in a separate function.
    // this makes it easy compute correct values for closed geometries

    generateUVs();

    // finally create faces

    generateIndices();
  }

  function generateSegment(i: number) {
    // we use getPointAt to sample evenly distributed points from the given path

    P = path.getPointAt(i / resolvedTubularSegments, P);

    // retrieve corresponding normal and binormal

    const N = frames.normals[i];
    const B = frames.binormals[i];

    // generate normals and vertices for the current segment

    for (let j = 0; j <= resolvedRadialSegments; j++) {
      const v = (j / resolvedRadialSegments) * Math.PI * 2;

      const sin = Math.sin(v);
      const cos = -Math.cos(v);

      // normal

      normal.x = cos * N.x + sin * B.x;
      normal.y = cos * N.y + sin * B.y;
      normal.z = cos * N.z + sin * B.z;
      normal.normalize();

      normals.push(normal.x, normal.y, normal.z);

      // vertex

      const currentRadius = taperFn(resolvedRadius, i);
      vertex.x = P.x + currentRadius * normal.x;
      vertex.y = P.y + currentRadius * normal.y;
      vertex.z = P.z + currentRadius * normal.z;

      vertices.push(vertex.x, vertex.y, vertex.z);
    }
  }

  function generateIndices() {
    for (let j = 1; j <= resolvedTubularSegments; j++) {
      for (let i = 1; i <= resolvedRadialSegments; i++) {
        const a = (resolvedRadialSegments + 1) * (j - 1) + (i - 1);
        const b = (resolvedRadialSegments + 1) * j + (i - 1);
        const c = (resolvedRadialSegments + 1) * j + i;
        const d = (resolvedRadialSegments + 1) * (j - 1) + i;

        // faces

        indices.push(a, b, d);
        indices.push(b, c, d);
      }
    }
  }

  function generateUVs() {
    for (let i = 0; i <= resolvedTubularSegments; i++) {
      for (let j = 0; j <= resolvedRadialSegments; j++) {
        uv.x = i / resolvedTubularSegments;
        uv.y = j / resolvedRadialSegments;

        uvs.push(uv.x, uv.y);
      }
    }
  }
}

RadiusTubeBufferGeometry.prototype = Object.create(BufferGeometry.prototype);
RadiusTubeBufferGeometry.prototype.constructor = RadiusTubeBufferGeometry;

RadiusTubeBufferGeometry.prototype.toJSON = function () {
  const data = BufferGeometry.prototype.toJSON.call(this);
  (data as any).path = (this as RadiusTubeGeometry).parameters.path.toJSON();
  return data as any;
};

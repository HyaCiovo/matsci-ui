import * as THREE from 'three';
import { CSS2DObject } from 'three/examples/jsm/renderers/CSS2DRenderer.js';
import { rgb } from 'd3-color';

type TooltipJson = {
  color?: string;
  tooltip?: string;
} & Record<string, any>;

export class TooltipHelper {
  private tooltipedJsonObject: TooltipJson | null = null;
  private tooltipedThreeObject: THREE.Object3D | null = null;
  public readonly tooltip;

  constructor() {
    const label = document.createElement('div');
    label.className = 'ms-tooltiptext';
    const hoverLabel = document.createElement('span');
    hoverLabel.className = '';
    label.appendChild(hoverLabel);
    const labelObject = new CSS2DObject(label);
    this.tooltip = labelObject;
    this.moveOffscreen();
  }

  private setMeshColor(mesh: THREE.Mesh, colorValue: string) {
    const material = mesh.material;
    if (Array.isArray(material)) {
      material.forEach((item) => {
        if ('color' in item) {
          (item as THREE.MeshStandardMaterial).color = new THREE.Color(colorValue);
        }
      });
      return;
    }
    if ('color' in material) {
      (material as THREE.MeshStandardMaterial).color = new THREE.Color(colorValue);
    }
  }

  public updateTooltip(point: THREE.Vector3, jsonObject: TooltipJson, sceneObject: THREE.Object3D) {
    if (!(this.tooltipedJsonObject === jsonObject)) {
      sceneObject.children.forEach((c) => {
        if (c instanceof THREE.Mesh && typeof jsonObject.color === 'string') {
          const color = rgb(jsonObject.color).brighter(1);
          this.setMeshColor(c, color.formatHex());
        }
      });
      this.tooltipedJsonObject = jsonObject;
      this.tooltipedThreeObject = sceneObject;
    }
    this.tooltip.position.x = point.x;
    this.tooltip.position.y = point.y;
    this.tooltip.position.z = point.z;
    // TODO(chab) support markdown ?
    this.tooltip.element.textContent = typeof jsonObject.tooltip === 'string' ? jsonObject.tooltip : '';
  }

  /**
   *
   * Return true if the tooltip was removed
   */
  public hideTooltipIfNeeded(): boolean {
    if (this.tooltipedThreeObject) {
      this.tooltipedThreeObject.children.forEach((c) => {
        if (c instanceof THREE.Mesh && typeof this.tooltipedJsonObject?.color === 'string') {
          this.setMeshColor(c, this.tooltipedJsonObject.color);
        }
      });
      this.tooltipedThreeObject = null;
      this.tooltipedJsonObject = null;
      this.moveOffscreen();
      return true;
    }
    return false;
  }

  private moveOffscreen() {
    this.tooltip.translateX(Number.MAX_SAFE_INTEGER);
    this.tooltip.translateY(Number.MAX_SAFE_INTEGER);
    this.tooltip.translateZ(Number.MAX_SAFE_INTEGER);
  }
}

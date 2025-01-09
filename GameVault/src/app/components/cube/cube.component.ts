import { Component, ElementRef, ViewChild, AfterViewInit } from '@angular/core';
import * as THREE from 'three';
import { OBJLoader } from 'three/examples/jsm/loaders/OBJLoader';

@Component({
  selector: 'app-cube',
  template: '<canvas #canvas></canvas>',
  styleUrls: ['./cube.component.scss']
})
export class CubeComponent implements AfterViewInit {
  @ViewChild('canvas', {static: true}) private canvasRef: ElementRef<HTMLCanvasElement>;

  private renderer: THREE.WebGLRenderer;
  private camera: THREE.PerspectiveCamera;
  private scene: THREE.Scene;
  private mesh: THREE.Mesh;

  private models = [
    { model: 'assets/models/Grass_Block.obj', texture: 'assets/models/Grass_Block_TEX.png', rotationSpeed: 0.01 },
    { model: 'assets/models/Grass_Block.obj', texture: 'assets/models/Grass_Block_TEX.png', rotationSpeed: 0.01 },
    { model: 'assets/models/Grass_Block.obj', texture: 'assets/models/question.png', rotationSpeed: 0.01 },
  ];
  private selectedModel: any;

  ngAfterViewInit(): void {
    this.selectedModel = this.models[Math.floor(Math.random() * this.models.length)];
    this.init();
    this.animate();
  }

  private init(): void {
    this.renderer = new THREE.WebGLRenderer({
      canvas: this.canvasRef.nativeElement,
      alpha: true,
    });
    this.renderer.setSize(600, 600);
  
    this.camera = new THREE.PerspectiveCamera(30, 1, 0.1, 1000);
    this.camera.position.set(0, 0, 7);
    this.camera.rotation.set(-0.5, 0, 0);
  
    this.scene = new THREE.Scene();
  
    const directionalLight = new THREE.DirectionalLight(0xffffff, 0.6);
    directionalLight.position.set(1, 1, 1);
    this.scene.add(directionalLight);
  
    const ambientLight = new THREE.AmbientLight(0xffffff, 0.5);
    this.scene.add(ambientLight);
  
    const objLoader = new OBJLoader();
    objLoader.load(this.selectedModel.model, obj => {
      const material = new THREE.MeshPhongMaterial();
      const textureLoader = new THREE.TextureLoader();
      textureLoader.load(this.selectedModel.texture, texture => {
        material.map = texture;
        this.mesh = obj.children[0] as THREE.Mesh;
        this.mesh.material = material;
        this.mesh.position.set(0, -4.5, 0);
        this.scene.add(this.mesh);
      });
    });
  }
  
  private animate(): void {
    requestAnimationFrame(() => this.animate());
    if (this.mesh) {
      this.mesh.rotation.y += this.selectedModel.rotationSpeed;
    }
    this.renderer.render(this.scene, this.camera);
  }
}

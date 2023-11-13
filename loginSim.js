import './simStyle.css';
import * as THREE from 'three';
import {OrbitControls} from 'three/examples/jsm/controls/OrbitControls';


const windowValues = {
  width: innerWidth,
  height: innerHeight
}

const scene = new THREE.Scene()
const camera = new THREE.PerspectiveCamera(120, window.innerWidth / window.innerHeight, 0.1,100000000000)

//initialising the text renderer and window space for rendering
const labelRenderer = new CSS2DRenderer()

labelRenderer.setSize(window.innerWidth, window.innerHeight)
labelRenderer.domElement.style.position = 'absolute';
labelRenderer.domElement.style.top = '0px';
document.body.appendChild(labelRenderer.domElement);



//initialising the renderer and the window space for rendering
const renderer = new THREE.WebGLRenderer({
  canvas: document.querySelector('#bg1'),
  antialias: true,
  logarithmicDepthBuffer: true,
});

renderer.setPixelRatio(window.devicePixelRatio)
renderer.setSize(windowValues.width, windowValues.height)
camera.position.set(0,0,850000)
//camera.position.set(0,10000000,0)

const controls = new OrbitControls( camera, renderer.domElement );
controls.autoRotate = true
controls.autoRotateSpeed = 0.7


const light = new THREE.AmbientLight()
scene .add(light)

function starGenerate(){
  function gaussianRandom(mean=0, stdev=1) {
         const u = 1 - Math.random(); // Converting [0,1) to (0,1]
         const v = Math.random();
         const z = Math.sqrt( -2.0 * Math.log( u ) ) * Math.cos( 2.0 * Math.PI * v );
         // Transform to the desired mean and standard deviation:
         return z * stdev + mean;
  }
  const particleGeometry = new THREE.BufferGeometry()
  const particleNumber = 10000
  const particlePositions = new Float32Array( particleNumber * 3)
  for(let i=0; i<particleNumber; i++){
       particlePositions[i] = ((gaussianRandom() - 0.5) * 1000000000000)
     }
  const particleMaterial = new THREE.PointsMaterial({
  size: 0.005,
  transparent: true,
  blending: THREE.AdditiveBlending,
  })
  particleGeometry.setAttribute('position', new THREE.BufferAttribute(particlePositions, 3))
 const particleMesh = new THREE.Points(particleGeometry, particleMaterial)
  return particleMesh

}

//animation function, acts like a pygame event loop
function animate() {
    requestAnimationFrame(animate)

    window.addEventListener("resize", () => {
        windowValues.width = innerWidth
        windowValues.height = innerHeight
         
        camera.aspect = windowValues.width / windowValues.height
        camera.updateProjectionMatrix()
        renderer.setSize(windowValues.width, windowValues.height)
        labelRenderer.setSize(windowValues.width, windowValues.height)
        var xdistance = document.getElementById("Ib")
        if(windowValues.width < window.width/2){
          
  
        }
       
      
      })

    renderer.render(scene, camera)
    controls.update()
}

scene.add(starGenerate())
animate();
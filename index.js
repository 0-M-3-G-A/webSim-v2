import './simStyle.css';
import { CSS2DRenderer, CSS2DObject } from 'three/examples/jsm/renderers/CSS2DRenderer';
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
//controls.autoRotateSpeed = 120 * Clock.getDelta()


// class to construct the planets and later to use when when creating their orbits and orbit animations
class Planets{
  constructor(radius, mass, orbitalVelocity, color, distanceFromSun, orbitInclination, orbitPeriod, texture, light){
    this.radius = radius
    this.mass = mass
    this.orbitalVelocity = orbitalVelocity
    this.color = color
    this.distanceFromSun = distanceFromSun
    this.orbitInclination = orbitInclination
    this.orbitPeriod = orbitPeriod
    this.texture = texture
    this.light = light
  }
  createPlanet(){
    const texture = new THREE.TextureLoader().load(this.texture)
    const geometry = new THREE.SphereGeometry(this.radius, 64, 32)
    const material = new THREE.MeshLambertMaterial({map: texture})
    const sphere = new THREE.Mesh(geometry, material)
    return sphere
  }
  createEllipses(){
      const curve = new THREE.EllipseCurve(
        (-this.distanceFromSun), 0,
        this.distanceFromSun * 2, this.distanceFromSun,
        0, 2 * Math.PI,
        false,
        0 
      )
      
      const points = curve.getPoints(100000);
      const geometry = new THREE.BufferGeometry().setFromPoints(points);
      const material = new THREE.MeshBasicMaterial({color: 0xff0000});
      const ellipse = new THREE.Line(geometry, material)
      return ellipse
  }
   createRings(rI, rO){
    const satRing = []
    for(let i=0; i< rI.length; i++){
     const geometry = new THREE.RingGeometry(rI[i], rO[i],32, 32)
     const material = new THREE.MeshBasicMaterial({color: 0xffff00, side: THREE.DoubleSide})
     const ring = new THREE.Mesh(geometry, material)
     satRing.push(ring)
    }
     return satRing
   }
  orbitCurrentTime(){
    let time = Date.now() / (1000 * 3600 * 24 * this.orbitPeriod)
    return time
  }
  bounds(){
    const box = new THREE.Box3()
    return box
  }
}
// each planet is renderd out, might convert each planet into its class later down the line for better manipulation and modulation
// colours are tempory each planet and the sun will have layers and texture mapping for reaslistic visuals
let sunParameters = new Planets((695700),(1.989 * Math.pow(10,30)), (0),  (0xffff00), (0),(0),(0),("https://th.bing.com/th/id/R.8f0db307e884452b6f8549c3ac317fad?rik=bm5yBl3OXKYWqQ&riu=http%3a%2f%2fwww.nasa.gov%2fimages%2fcontent%2f700328main_20121014_003615_flat.jpg&ehk=umGDcSqj6GKzvPg7GFQ%2fxFG0TqJMIdn9pLL2DTDQF%2fA%3d&risl=&pid=ImgRaw&r=0"), (true))
let sun = sunParameters.createPlanet()
sun.position.set(0,0,0)

// const sunLight = new THREE.PointLight((0xffffff), 1000000,1000000000000000, 0)
// scene.add(sunLight)
// sun.add(sunLight)

const light = new THREE.AmbientLight()
scene .add(light)

const su = document.createElement('p')
su.id = "su"
su.textContent = "Sun"
su.style.color='#FFFFFF'
const sunLabel = new CSS2DObject(su)
sun.add(sunLabel)
sunLabel.position.set(0,0,3000)

let mercuryParameters = new Planets((2439.5),(0.300 * Math.pow(10,24)), (0),  (0x808080), (57.9 * Math.pow(10,6)),(7 * (Math.PI/180)), (88))
let mercury = mercuryParameters.createPlanet()
let mercuryEllipse = mercuryParameters.createEllipses()
mercuryEllipse.rotateY(mercuryParameters.orbitInclination)


const me  = document.createElement('p')
me.id = "me"
me.textContent = "Mercury"
me.style.color='#FFFFFF'
const mercuryLabel = new CSS2DObject(me)
mercury.add(mercuryLabel)


let venusParameters = new Planets((6052),(4.87 * Math.pow(10,24)), (0),  (0xffffe5), (108.2 * Math.pow(10,6)), (3.4 * (Math.PI/180)), (224.7))
let venus = venusParameters.createPlanet()
let venusEllipse = venusParameters.createEllipses()
venusEllipse.rotateY(venusParameters.orbitInclination)


const ve  = document.createElement('p')
ve.id = "ve"
ve.textContent = "Venus"
ve.style.color='#FFFFFF'
const venusLabel = new CSS2DObject(ve)
venus.add(venusLabel)

let earthParameters = new Planets((6378),(5.97 * Math.pow(10,24)), (0),  (0x0000ff), (149.6 * Math.pow(10,6)), 0, (365.2))
let earth = earthParameters.createPlanet();
let earthEllipse = earthParameters.createEllipses()


const ea  = document.createElement('p')
ea.id = "ea"
ea.textContent = "Earth"
ea.style.color='#FFFFFF'
const earthLabel = new CSS2DObject(ea)
earth.add(earthLabel)


let marsParameters = new Planets((3396),(0.642 * Math.pow(10,24)), (0),  (0xff0000), (228 * Math.pow(10,6)), (1.8 * (Math.PI/180)), (687))
let mars = marsParameters.createPlanet()
let marsEllipse = marsParameters.createEllipses()
marsEllipse.rotateY(marsParameters.orbitInclination)


const ma  = document.createElement('p')
ma.id = "ma"
ma.textContent = "Mars"
ma.style.color='#FFFFFF'
const marsLabel = new CSS2DObject(ma)
mars.add(marsLabel)


let jupitarParameters = new Planets((74192),(1898 * Math.pow(10,24)), (0),  (0xffd700), (778.5 * Math.pow(10,6)), (1.3 * (Math.PI/180)), (4331))
let jupitar = jupitarParameters.createPlanet()
let jupitarEllipse = jupitarParameters.createEllipses()
jupitarEllipse.rotateY(jupitarParameters.orbitInclination)


const ju  = document.createElement('p')
ju.id = "ju"
ju.textContent = "Jupitar"
ju.style.color='#FFFFFF'
const jupitarLabel = new CSS2DObject(ju)
jupitar.add(jupitarLabel)


let saturnParameters = new Planets((60268), (578 * Math.pow(10,24)), (0),  (0xe5e500), (1432 * Math.pow(10,6)), (2.5 * (Math.PI/180)), (10747))
let saturn = saturnParameters.createPlanet()
let saturnEllipse = saturnParameters.createEllipses()
saturnEllipse.rotateY(saturnParameters.orbitInclination)
let saturnInnerRingRadius = [122340, 91975, 74658, 66900]
let saturnOuterRingRadius = [136780, 117506, 91975, 74510]
let saturnRings = saturnParameters.createRings(saturnInnerRingRadius, saturnOuterRingRadius)

const sa  = document.createElement('p')
sa.id = "sa"
sa.textContent = "Saturn"
sa.style.color='#FFFFFF'
const saturnLabel = new CSS2DObject(sa)
saturn.add(saturnLabel)


let uranusParameters = new Planets((25559), (86.8 * Math.pow(10,24)), (0),  (0xb2b2ff), (2867 * Math.pow(10,6)), (0.8 * (Math.PI/180)), (30589))
let uranus = uranusParameters.createPlanet()
let uranusBound = uranusParameters.bounds()
let uranusEllipse = uranusParameters.createEllipses()
uranusEllipse.rotateY(uranusParameters.orbitInclination)


const ur  = document.createElement('p')
ur.id = "ur"
ur.textContent = "Uranus"
ur.style.color='#FFFFFF'
const uranusLabel = new CSS2DObject(ur)
uranus.add(uranusLabel)


let neptuneParameters = new Planets((24764), (102 * Math.pow(10,24)), (0),  (0xf0ffff), (4515 * Math.pow(10,6)), (1.8 * (Math.PI/180)),(59800))
let neptune = neptuneParameters.createPlanet()
let neptuneEllipse = neptuneParameters.createEllipses()
neptuneEllipse.rotateY(neptuneParameters.orbitInclination)


const ne  = document.createElement('p')
ne.id = "ne"
ne.textContent = "Neptune"
ne.style.color='#FFFFFF'
const neptuneLabel = new CSS2DObject(ne)
neptune.add(neptuneLabel)

const solarSystem = [sun, mercury, venus, earth, mars, jupitar, saturn, uranus, neptune ]
for (let items of solarSystem){
  scene.add(items)
}


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

    //planet orbit animation
    function orbitQuaternion(angle, position){
      const quaternion = new THREE.Quaternion()
      quaternion.setFromAxisAngle(new THREE.Vector3(0,1,0), angle)
      position.applyQuaternion(quaternion) 
    }
    
    mercury.position.set((( 2 * Math.cos(mercuryParameters.orbitCurrentTime()) * mercuryParameters.distanceFromSun) - mercuryParameters.distanceFromSun),((Math.sin(mercuryParameters.orbitCurrentTime()) * mercuryParameters.distanceFromSun)),0)
    orbitQuaternion(mercuryParameters.orbitInclination, mercury.position)
    venus.position.set(((2 * Math.cos(venusParameters.orbitCurrentTime()) * venusParameters.distanceFromSun) - venusParameters.distanceFromSun),(Math.sin(venusParameters.orbitCurrentTime()) * venusParameters.distanceFromSun),0)
    orbitQuaternion(venusParameters.orbitInclination, venus.position)
    earth.position.set(((2 * Math.cos(earthParameters.orbitCurrentTime()) * earthParameters.distanceFromSun) - earthParameters.distanceFromSun), (Math.sin(earthParameters.orbitCurrentTime()) * earthParameters.distanceFromSun),0)
    mars.position.set(((2 * Math.cos(marsParameters.orbitCurrentTime()) * marsParameters.distanceFromSun) - marsParameters.distanceFromSun),(Math.sin(marsParameters.orbitCurrentTime()) * marsParameters.distanceFromSun),0)
    orbitQuaternion(marsParameters.orbitInclination, mars.position)
    jupitar.position.set(((2 * Math.cos(jupitarParameters.orbitCurrentTime()) * jupitarParameters.distanceFromSun) - jupitarParameters.distanceFromSun),(Math.sin(jupitarParameters.orbitCurrentTime()) * jupitarParameters.distanceFromSun),0)
    orbitQuaternion(jupitarParameters.orbitInclination, jupitar.position)
    saturn.position.set(((2 * Math.cos(saturnParameters.orbitCurrentTime()) * saturnParameters.distanceFromSun) - saturnParameters.distanceFromSun),(Math.sin(saturnParameters.orbitCurrentTime()) * saturnParameters.distanceFromSun),0)
    orbitQuaternion(saturnParameters.orbitInclination, saturn.position)
    uranus.position.set(((2 * Math.cos(uranusParameters.orbitCurrentTime()) * uranusParameters.distanceFromSun) - uranusParameters.distanceFromSun),(Math.sin(uranusParameters.orbitCurrentTime()) * uranusParameters.distanceFromSun),0)
    orbitQuaternion(uranusParameters.orbitInclination, uranus.position)
    neptune.position.set(((2 * Math.cos(neptuneParameters.orbitCurrentTime()) * neptuneParameters.distanceFromSun) - neptuneParameters.distanceFromSun),(Math.sin(neptuneParameters.orbitCurrentTime()) * neptuneParameters.distanceFromSun),0)
    orbitQuaternion(neptuneParameters.orbitInclination, neptune.position)

    renderer.render(scene, camera)
    controls.update()
}

scene.add(starGenerate())
animate();
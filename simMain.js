import './simStyle.css';
// import { CSS2DRenderer, CSS2DObject } from 'three/examples/jsm/renderers/CSS2DRenderer';
import { CSS2DRenderer, CSS2DObject } from 'three/addons/renderers/CSS2DRenderer.js';
import * as THREE from 'three';
import { TrackballControls } from 'three/addons/controls/TrackballControls.js';





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
  canvas: document.querySelector('#bg'),
  antialias: true,
  logarithmicDepthBuffer: true,
});

renderer.setPixelRatio(window.devicePixelRatio)
renderer.setSize(windowValues.width, windowValues.height)
camera.position.set(0,0,10000000)
//camera.position.set(0,10000000,0)

const controls = new TrackballControls(camera, renderer.domElement)
controls.noPan = true
controls.rotateSpeed = 3
controls.dollySpeed = 2



// class to construct the planets and later to use when when creating their orbits and orbit animations
class Planets{
  constructor(radius, mass, orbitalVelocity, color, distanceFromSun, orbitInclination, orbitPeriod){
    this.radius = radius
    this.mass = mass
    this.orbitalVelocity = orbitalVelocity
    this.color = color
    this.distanceFromSun = distanceFromSun
    this.orbitInclination = orbitInclination
    this.orbitPeriod = orbitPeriod 
  }
  createPlanet(){
    const geometry = new THREE.SphereGeometry(this.radius, 64, 32)
    const material = new THREE.MeshBasicMaterial({color: this.color})
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
let sunParameters = new Planets((695700),(1.989 * Math.pow(10,30)), (0),  (0xffff00))
let sun = sunParameters.createPlanet()
let sunBound = sunParameters.bounds()
sun.position.set(0,0,0)

const su = document.createElement('p')
su.id = "su"
su.textContent = "Sun"
su.style.color='#FFFFFF'
const sunLabel = new CSS2DObject(su)
sun.add(sunLabel)
sunLabel.position.set(0,0,3000)

let mercuryParameters = new Planets((2439.5),(0.300 * Math.pow(10,24)), (0),  (0x808080), (57.9 * Math.pow(10,6)),(7 * (Math.PI/180)), (88))
let mercury = mercuryParameters.createPlanet()
let mA = new THREE.AxesHelper(10000)
mercury.add(mA)
scene.add(mA)
let mercuryBound = mercuryParameters.bounds()
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
let venusBound = venusParameters.bounds()
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
let earthBound = earthParameters.bounds()
let earthEllipse = earthParameters.createEllipses()


const ea  = document.createElement('p')
ea.id = "ea"
ea.textContent = "Earth"
ea.style.color='#FFFFFF'
const earthLabel = new CSS2DObject(ea)
earth.add(earthLabel)


let marsParameters = new Planets((3396),(0.642 * Math.pow(10,24)), (0),  (0xff0000), (228 * Math.pow(10,6)), (1.8 * (Math.PI/180)), (687))
let mars = marsParameters.createPlanet()
let marsBound = marsParameters.bounds()
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
let jupitarBound = jupitarParameters.bounds()
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
let saturnBound = saturnParameters.bounds()
let saturnEllipse = saturnParameters.createEllipses()
saturnEllipse.rotateY(saturnParameters.orbitInclination)
let saturnInnerRingRadius = [122340, 91975, 74658, 66900]
let saturnOuterRingRadius = [136780, 117506, 91975, 74510]
let saturnRings = saturnParameters.createRings(saturnInnerRingRadius, saturnOuterRingRadius)

 for(let i=0; i<saturnRings.length; i++){
    saturn.add(saturnRings[i])
 }


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
let neptuneBound = neptuneParameters.bounds()
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

const labels = [sunLabel, mercuryLabel, venusLabel, earthLabel, marsLabel, jupitarLabel, saturnLabel, uranusLabel, neptuneLabel]
for (let items of labels){
  scene.add(items)
}

const ellipses = [ mercuryEllipse, venusEllipse, earthEllipse, marsEllipse, jupitarEllipse, saturnEllipse, uranusEllipse, neptuneEllipse]
for (let items of ellipses){ 
  scene.add(items)
}



const sunHelper = new THREE.Box3Helper(sunBound, 0xffff00)
scene.add(sunHelper)
const merHelper = new THREE.Box3Helper(mercuryBound, 0xffff00)
scene.add(merHelper)
const venHelper = new THREE.Box3Helper(venusBound, 0xffff00)
scene.add(venHelper)
const earHelper = new THREE.Box3Helper(earthBound, 0xffff00) 
scene.add(earHelper)
const marHelper = new THREE.Box3Helper(marsBound, 0xffff00) 
scene.add(marHelper)
const jupHelper = new THREE.Box3Helper(jupitarBound, 0xffff00) 
scene.add(jupHelper)
const satHelper = new THREE.Box3Helper(saturnBound, 0xffff00) 
scene.add(satHelper)
const uncHelper = new THREE.Box3Helper( uranusBound, 0xffff00) 
scene.add(uncHelper)
const nepHelper = new THREE.Box3Helper(neptuneBound, 0xffff00) 
scene.add(nepHelper)

// function starGenerate(pN){
//   function gaussianRandom(mean=0, stdev=1) {
//          const u = 1 - Math.random(); // Converting [0,1) to (0,1]
//          const v = Math.random();
//          const z = Math.sqrt( -2.0 * Math.log( u ) ) * Math.cos( 2.0 * Math.PI * v );
//          // Transform to the desired mean and standard deviation:
//          return z * stdev + mean;
//   }
//   function generateSize(){
//     const Sizes = [10000000000,27.5,6]
//     const chosenSize = Sizes[Math.random()*2]
//     return chosenSize
//   }
//   const particleGeometry = new THREE.BufferGeometry()
//   // const particleNumber = 10000
//   const particlePositions = new Float32Array( pN * 3)
//   for(let i=0; i<pN; i++){
//        particlePositions[i] = ((gaussianRandom() - 0.5) * 1000000000000)
//      }
//   // const particleMaterial = new THREE.PointsMaterial({
//   // size: x,
//   // transparent: true,
//   // blending: THREE.AdditiveBlending,
//   // })
//   const particleMaterial = new THREE.PointsMaterial()
//   particleMaterial.size = generateSize()
//   // const sizes = [660,27.5,7]
//   // const particleSize = new Float32Array(pN)
//   // for(let i=0; i<pN; i++){
//   //   particleSize[i]= sizes[Math.random()*2]
//   // }
//   particleGeometry.setAttribute('position', new THREE.BufferAttribute(particlePositions, 3))
//    //particleMaterial.setAttribute('size', new THREE.BufferAttribute(particleSize, 1))
//  const particleMesh = new THREE.Points(particleGeometry, particleMaterial)
//   return particleMesh

// }

 function sG(sN){
   function gaussianRandom(mean=0, stdev=1) {
     const u = 1 - Math.random(); // Converting [0,1) to (0,1]
    const v = Math.random();
     const z = Math.sqrt( -2.0 * Math.log( u ) ) * Math.cos( 2.0 * Math.PI * v );
     // Transform to the desired mean and standard deviation:
     return z * stdev + mean;
   }
//   // function randomiser(){
//   //   const size = [ 66000000000000 , 27500, 700 ]
//   //   const color = [0xFF0000, 0x0000FF, 0xFFFF00]
//   //   var random = []
//   //   random.push(size[Math.random()*2])
//   //   random.push(color[Math.random()*2])
//   //   return random
//   // }
//   // const Size = [ 66000000000000 , 27500, 700 ]
//   // const Color = [0xFF0000, 0x0000FF, 0xFFFF00]
//   // var a =  Size[Math.random()*2]
//   // var b =Color[Math.random()*2]
   const starPositions = new Float32Array(sN * 3)
   for(let i=0; i<sN; i++){
     starPositions[i] = ((gaussianRandom() - 0.5) * 1000000000000)
   }
 
//   // for(let i=0; i<sN; i++){
//   //   const Size = [ 660000, 27.5, 7 ]
//   //   const Color = [0xFF0000, 0x0000FF, 0xFFFF00]
//   //   var a =  Size[Math.floor(Math.random()*2)]
//   //   var b =  Color[Math.floor(Math.random()*2)]
//   //   console.log(a)
//   //   console.log(b)
//   //   const particleGeometry = new THREE.BufferGeometry()
//   //   const particleMaterial = new THREE.PointsMaterial({
//   //      size: a,
//   //      transparent: true,
//   //      blending: THREE.AdditiveBlending,
//   //      color: b

//   // })
//   const Size = [ 660000000000, 27.5, 7 ]
//   const Color = [0xFF0000, 0x0000FF, 0xFFFF00]
//   const sizeArray = new Float32Array(sN)
//   for(let i=0; i<sN; i++){
//     sizeArray[i] = Size[Math.floor(Math.random()*2)]
//   }
   const particleGeometry = new THREE.BufferGeometry()
   const particleMaterial = new THREE.PointsMaterial({
     transparent: true,
     blending: THREE.AdditiveBlending,
   })

   particleGeometry.setAttribute('position', new THREE.BufferAttribute(starPositions, 3))
   particleGeometry.setAttribute('size', new THREE.BufferAttribute(sizeArray, 1) )
   const particleMesh = new THREE.Points(particleGeometry, particleMaterial)
   return particleMesh
  
 }







//animation function, acts like a pygame event loop
function animate() {
    requestAnimationFrame(animate)

    sunBound.setFromObject(sun)
    mercuryBound.setFromObject(mercury)
    venusBound.setFromObject(venus)
    earthBound.setFromObject(earth)
    marsBound.setFromObject(mars)
    jupitarBound.setFromObject(jupitar)
    saturnBound.setFromObject(saturn)
    uranusBound.setFromObject(uranus)
    neptuneBound.setFromObject(neptune)

    
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

    //planet orbit animation, uses quaternion number system for rotation 
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
    
    mercuryLabel.position.set(mercury.position.x, mercury.position.y, mercury.position.z)
    venusLabel.position.set(venus.position.x, venus.position.y, venus.position.z )
    earthLabel.position.set(earth.position.x, earth.position.y, earth.position.z)
    marsLabel.position.set(mars.position.x, mars.position.y, mars.position.z)
    jupitarLabel.position.set(jupitar.position.x, jupitar.position.y, jupitar.position.z)
    saturnLabel.position.set(saturn.position.x, saturn.position.y, saturn.position.z)
    uranusLabel.position.set(uranus.position.x, uranus.position.y, uranus.position.z)
    neptuneLabel.position.set(neptune.position.x, neptune.position.y, neptune.position.z)





    function cameraControl( object1, object2, object3, object4, object5, object6, object7, object8){
      document.addEventListener("click", function(e) {
        function checkNum(Object, Size, Center){
          if(Object.position.x >= 0){
          
            camera.lookAt(Center.x, Center.y, Center.z)
            camera.position.set(((Object.position.x) - Size.x/2), Center.y, Center.z)
            camera.updateProjectionMatrix()
          }else {
  
            camera.lookAt(Center.x, Center.y, Center.z)
            camera.position.set(((Object.position.x) + Size.x/2), Center.y, Center.z)
            camera.updateProjectionMatrix()
          }
        }
        function checkHideButton(){
           if(hideButton.style.left === "15px"){
             hideButton.style.transform="translateX(455px)"
            hideButtonSign1.style.opacity = "0"
            hideButtonSign2.style.opacity = "1"
           } 
         }
        var x = e.target.id
        var hideButton = document.getElementById("hBu")
        var hideButtonSign1 = document.getElementById("hideButtonIcon1")
        var hideButtonSign2 = document.getElementById("hideButtonIcon2")
            switch(x){
              case "su":
               
                const sizeSu = sunBound.getSize(new THREE.Vector3())
                const centerSu = sunBound.getCenter(new THREE.Vector3())
                 controls.target.set(0,0,0);
                 controls.minDistance = 850000
                 controls.update()
                 camera.position.set(sizeSu.x/2,0,0);
                 camera.updateProjectionMatrix()

                 checkHideButton()
                 document.getElementById("iB").style.display = "block"
                 document.getElementById("textInfo").innerText = "sun"
                 
                 break;
               case "me":
                  const sizeMe = mercuryBound.getSize(new THREE.Vector3())
                  const centerMe = mercuryBound.getCenter(new THREE.Vector3())
                 controls.target.set(object1.position.x, object1.position.y, object1.position.z);
                 controls.minDistance = 3000
                 controls.update();
                 checkNum(object1, sizeMe, centerMe)
     
                checkHideButton()
                 document.getElementById("iB").style.display = "block"
                 document.getElementById("textInfo").innerText = "Mercury "

                 break;
               case "ve":
                const sizeV = venusBound.getSize(new THREE.Vector3())
                const centerV =venusBound.getCenter(new THREE.Vector3())
                controls.target.set(object2.position.x, object2.position.y, object2.position.z)
                controls.minDistance = 9000
                controls.update()
                checkNum(object2, sizeV, centerV)

                checkHideButton()
                document.getElementById("iB").style.display = "block"
                document.getElementById("textInfo").innerText = "Venus"

                break;
               case "ea":
                 const sizeE = earthBound.getSize(new THREE.Vector3())
                 const centerE = earthBound.getCenter(new THREE.Vector3())
                 controls.target.set(object3.position.x, object3.position.y, object3.position.z);
                 controls.minDistance = 8000
                 controls.update()
                 checkNum(object3, sizeE, centerE)

                 checkHideButton()
                 document.getElementById("iB").style.display = "block"
                 document.getElementById("textInfo").innerText = "Earth"

                 break;
               case "ma":
                const sizeMa = marsBound.getSize(new THREE.Vector3())
                const centerMa = marsBound.getCenter(new THREE.Vector3())
                controls.target.set(object4.position.x, object4.position.y, object4.position.z)
                controls.minDistance = 4200
                controls.update()
                checkNum(object4, sizeMa, centerMa)

                checkHideButton()
                document.getElementById("iB").style.display = "block"
                document.getElementById("textInfo").innerText = "Mars"

                 break;
               case "ju":
                const sizeJ = jupitarBound.getSize(new THREE.Vector3())
                const centerJ = jupitarBound.getCenter(new THREE.Vector3())
                controls.target.set(object5.position.x, object5.position.y, object5.position.z)
                controls.minDistance = 93000
                controls.update()
                checkNum(object5, sizeJ, centerJ)

                checkHideButton()
                document.getElementById("iB").style.display = "block"
                document.getElementById("textInfo").innerText = "Jupitar"

                 break;
               case "sa":
                const sizeSa = saturnBound.getSize(new THREE.Vector3())
                const centerSa = saturnBound.getCenter(new THREE.Vector3())
                controls.target.set(object6.position.x, object6.position.y, object6.position.z)
                controls.minDistance = 74000
                controls.update()
                checkNum(object6, sizeSa, centerSa)
                
                checkHideButton()
                document.getElementById("iB").style.display = "block"
                document.getElementById("textInfo").innerText = "Saturn"

                 break;
               case "ur":
                const sizeU = uranusBound.getSize(new THREE.Vector3())
                const centerU = uranusBound.getCenter(new THREE.Vector3())
                controls.target.set(object7.position.x, object7.position.y, object7.position.z)
                controls.minDistance = 32000
                controls.update()
                checkNum(object7, sizeU, centerU)

                checkHideButton()
                document.getElementById("iB").style.display = "block"
                document.getElementById("textInfo").innerText = "Uranus"

                  break;
               case "ne":
                const sizeN = neptuneBound.getSize(new THREE.Vector3())
                const centerN = neptuneBound.getCenter(new THREE.Vector3())
                controls.target.set(object8.position.x, object8.position.y, object8.position.z)
                controls.minDistance = 30000
                controls.update()
                checkNum(object8, sizeN, centerN)

                checkHideButton()
                document.getElementById("iB").style.display = "block"
                document.getElementById("textInfo").innerText = "Neptune"

                 break;
            }}
            )
          }

          for(let i=0; i<saturnRings.length; i++){
            saturnRings[i].position.set(saturn.position.x, saturn.position.y, saturn.position.z)
            scene.add(saturnRings[i])
         }
    
          cameraControl(mercury, venus, earth, mars, jupitar, saturn, uranus, neptune)
    
   
    controls.update();
    labelRenderer.render(scene, camera)
    renderer.render(scene, camera)
}

// scene.add(starGenerate(10000))
scene.add(sG(10000))
//sG(1000)

animate();




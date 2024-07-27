const trailEffect = new Image()
trailEffect.src = '../Images/Cover.png'

trailEffect.addEventListener('load', function(){
    const canvas = document.getElementById('Logo')
    const ctx = canvas.getContext('2d')
    canvas.width = 500
    canvas.height = 500
    //const gradient1 = ctx.createLinearGradient(0, 0, canvas.width, canvas.height)
    //gradient1.addColorStop(0.2, 'red')
    //gradient1.addColorStop(0.5, 'green')
    //gradient1.addColorStop(0.8, 'blue')

    ctx.drawImage(trailEffect, 0, 0, canvas.width, canvas.height)
    const pixels = ctx.getImageData(0, 0, canvas.width, canvas.height)
    ctx.clearRect(0, 0, canvas.width, canvas.height)
    
    const numberOfParticles = 2500
    let particlesArray = []
    const symbols = ['']
    let mappedImage = []
    for (let y = 0; y < canvas.height; y++ ){
        let row = []
        for (let x = 0; x < canvas.width; x++){
            const red = pixels.data[(y * 4 * pixels.width) + (x * 4)]
            const green = pixels.data[(y * 4 * pixels.width) + (x * 4 + 1)]
            const blue = pixels.data[(y * 4 * pixels.width) + (x * 4 + 2)]
            const brightness = calculateRelativeBrightness(red, green, blue)
            const cellBrightness = brightness
            const cellColor = 'rgb(' + red + ', ' + green + ', ' + blue + ')'
            const cell = [cellBrightness, cellColor]
            row.push(cell)
        }
        mappedImage.push(row)
    }

    function calculateRelativeBrightness(red, green, blue){
        return Math.sqrt(
            (red * red) * 0.299 +
            (green * green) * 0.587 +
            (blue * blue) * 0.114 
        ) / 105
    }

    class Particle {
        constructor(){
            this.x = Math.random() * canvas.width
            this.y = 0
            this.speed = 0
            this.velocity = Math.random() * 2.1
            this.size = Math.random() * 2 + 1
            this.position1 = Math.floor(this.y)
            this.position2 = Math.floor(this.x)
            this.symbols = symbols[Math.floor(Math.random() * symbols.length)]
            this.angle = 0
        }
        update(){
            this.position1 = Math.floor(this.y)
            this.position2 = Math.floor(this.x)
            if((mappedImage[this.position1])&&(mappedImage[this.position1][this.position2])){
                this.speed = mappedImage[this.position1][this.position2][0]
            }            
            let movement = this.speed + this.velocity // Set movement to be the sum of speed and velocity
            this.angle = Math.PI / 2; // Set angle to be 90 degrees (vertical)
        
            this.y += movement
            if (this.y >= canvas.height){
                this.y = 0
                this.x = Math.random() * canvas.width
            }
        }
        draw(){
            ctx.beginPath()
            if((mappedImage[this.position1])&&(mappedImage[this.position1][this.position2])){
                ctx.fillStyle = mappedImage[this.position1][this.position2][1]
                //ctx.strokeStyle = mappedImage[this.position1][this.position2][1]
            }
            //ctx.fillStyle = gradient1
            ctx.arc(this.x, this.y, this.size, 0, Math.PI * 2)
            //ctx.fillText(this.symbols, this.x, this.y)
            ctx.fill()
        }
    }
    function init(){
        for(let i = 0; i < numberOfParticles; i++){
            particlesArray.push(new Particle)
        }
    }
    init()

    function animate(){
        //ctx.drawImage(myLogo, 0, 0, canvas.width, canvas.height)
        ctx.globalAlpha = 0.05
        ctx.fillStyle = 'rgba(0, 0, 0,0)'
        ctx.fillRect(0, 0, canvas.width, canvas.height)
        ctx.globalAlpha = 0.04
        for(let i = 0; i < particlesArray.length; i++){
            particlesArray[i].update()
            ctx.globalAlpha = particlesArray[i] * 0.5
            particlesArray[i].draw()
        }
        requestAnimationFrame(animate)
    }
    animate()

})
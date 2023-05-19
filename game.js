class Barrier extends Phaser.GameObjects.Container {
    constructor(scene, config) {
        super(scene);
        this.config = config;
        
        if (this.config.deadly == true) {
            this.barrier = scene.physics.add.sprite(0, 0, config.texture)
                .setScale(config.scaleX, config.scaleY)
                .setImmovable()
                .setTint(0xFF3000)
                .setOrigin(0, 0);
        } else if (this.config.deadly == false) {
            if (this.config.goal != true) {
                this.barrier = scene.physics.add.sprite(0, 0, config.texture)
                    .setScale(config.scaleX, config.scaleY)
                    .setImmovable()
                    .clearTint()
                    .setOrigin(0, 0);
            } else {
                this.barrier = scene.physics.add.sprite(0, 0, config.texture)
                    .setScale(config.scaleX, config.scaleY)
                    .setTint(0x00FF66)
                    .setOrigin(0, 0);
            }
        }

        if (config.switch == true) {
            this.barrier
                .setTint(0x0000FF) 
                .setInteractive()
                .on("pointerdown", () => {
                    console.log("hello");
                })          
        }

        if (config.superJump == true) {
            this.barrier
                .setTint(0xFFBF00)
        }
        
        this.add(this.barrier);
    }
    

}


class baseScene extends Phaser.Scene {
    constructor(key) {
        super(key)
        this.sceneKey = key;
    }

    preload() {
        this.load.path = "./assets/";
        this.load.image("char", "tileLight.png");
    }

    
    create() {

        this.leftPress = false
        this.left = this.add.sprite(600, 100, "char")
            .setInteractive()
            .setAlpha(.5)
            .setTint(0x00FF00)
            .on('pointerdown', () => {
                this.left.setTint(0xFF0000);
                this.leftPress = true
            })
            .on('pointerup', () => {
                this.left.setTint(0x00FF00)
                this.leftPress = false
            })

        this.rightPress = false
        this.right = this.add.sprite(800, 100, "char")
            .setInteractive()
            .setAlpha(.5)
            .setTint(0x00FF00)
            .on('pointerdown', () => {
                this.right.setTint(0xFF0000);
                this.rightPress = true
            })
            .on('pointerup', () => {
                this.right.setTint(0x00FF00)
                this.rightPress = false
            })

        this.spacePress = false
        this.spacebar = this.add.sprite(700, 200, "char")
            .setScale(3, .5)
            .setInteractive()
            .setAlpha(.5)
            .setTint(0x00FF00)
            .on('pointerdown', () => {
                this.spacebar.setTint(0xFF0000);
                this.spacePress = true
            })
            .on('pointerup', () => {
                this.spacebar.setTint(0x00FF00)
                this.spacePress = false
            })
        
        this.onEnter()

    }

    update() {
        this.player1.setVelocityX(0);
        let d = this.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.D)
        let a = this.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.A)
        let w = this.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.W)
        let space = this.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.SPACE)
        let one = this.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.ONE)
        let two = this.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.TWO)

        if (d.isDown || this.rightPress == true) {
            console.log("updating");
            this.player1.setVelocityX(600);
            // debugger;
        }

        if (a.isDown || this.leftPress == true) {
            this.player1.setVelocityX(-600);
        }

        if (space.isDown || this.spacePress == true) {
            if (this.isJumping !== true && this.player1.body.velocity.y == 0) {
                this.player1.setVelocityY(-500);
                this.isJumping = true;
                console.log("jump");
            }
        } else {
            this.isJumping = false
        }

        let itemCheck = this.checkBounds(this.player1, this.item.barrier)

        if (itemCheck) {
            this.superJumpItem = true
            this.player1.setTint(0xA020F0)
            this.item.destroy()
        }

        if (this.player1.body.velocity.y != 0 && this.superJumpItem == true && (w.isDown || this.spacePress == true)) {
            if (this.superJump !== true && this.isJumping == true) {
                this.player1.setVelocity(this.player1.body.velocity.x * 2.5, this.player1.body.velocity.y * 2.5);
                this.superJump = true;
                console.log("jump");
            }
        } else {
            if (this.player1.body.velocity.y == 0) {
                this.superJump = false;
            }
        }

        // console.log(this.player1.body.velocity.x);

        
        let switchCheck = this.checkBounds(this.player1, this.switch.barrier)

        if (switchCheck) {
            this.switch.barrier
                .setInteractive()
                .on("pointerdown", () => {
                    console.log("wazzap");
                    this.obstacle.destroy();
                })
        } 

        if (this.checkBounds(this.player1, this.obstacle.barrier)) {
            this.gotoScene(key);
        };

        if (this.checkBounds(this.player1, this.goal.barrier) || two.isDown) {
            console.log("win!");
            this.player1.setGravity(0).setVelocity(0);
            this.sceneArr = this.sceneKey.split('')
            this.gotoScene("scene" + ((this.sceneArr[5] * 1) + 1)) 
        }

        if (one.isDown) {
            console.log("back");
            this.sceneArr = this.sceneKey.split('')
            this.gotoScene("scene" + ((this.sceneArr[5] * 1) - 1));
        }

        if (this.checkBounds(this.player1, this.obstacle.barrier)) {
            this.gotoScene(this.sceneKey)
        }

    }

    onEnter(){}

    checkBounds(target, bounds) {
        if (this.physics.overlap(target, bounds)) {
            return true;
        } else {
            return false;
        }
    };

    gotoScene(key) {
        this.cameras.main.fade(1000, 0, 0, 0);
        this.time.delayedCall(1000, () => {
            this.scene.start(key);
        });
    }

    
}

class scene1 extends baseScene {
    constructor() {
        super('scene1')
    }

    onEnter() {

        this.convo = this.add.text(
            0,
            0,
            "Welcome to my physics game! Press 'A' and 'D' to move and 'SPACEBAR' to jump! Alternatively, you can use the green buttons at the top of the screen. To proceed, head to the green portal.",
            {
                font: "30px bold",
                color: "#00000",
                wordWrap: { width: 1000, useAdvancedWrap: true }
            }
        )
        
        this.convo.setOrigin(0.5, 0.5).setPosition(this.cameras.main.centerX, this.cameras.main.centerY)

        this.barrierGroup = this.add.group();
            
        this.barrier3 = this.add.existing(new Barrier(this,{texture: "char", scaleX: 15, scaleY: 1, deadly: false}))
            .setPosition(0, 800);

        this.obstacle = this.add.existing(new Barrier(this,{texture: "char", scaleX: 0.5, scaleY: 0.5, deadly: true}))
            .setPosition(-600, -200);
        
        this.goal = this.add.existing(new Barrier(this,{texture: "char", scaleX: 0.5, scaleY: 4, deadly: false, goal: true}))
            .setPosition(1300, 500);

        this.switch = this.add.existing(new Barrier(this,{texture: "char", scaleX: 0.5, scaleY: 0.5, deadly: false, switch: true}))
            .setPosition(-950, -500);

        this.item = this.add.existing(new Barrier(this,{texture: "char", scaleX: 0.5, scaleY: 0.5, deadly: false, superJump: true}))
            .setPosition(-950, -1000);

        this.barrierGroup
            .add(this.barrier3.barrier)

        this.player1 = this.physics.add.sprite(0, 0, "char")
            .setOrigin(0.5, 0.5)
            .setPosition(200, 700)
            .setGravityY(500)

        this.colliding = this.physics.add.collider(this.player1, this.barrierGroup);
    }
}

class scene2 extends baseScene {
    constructor() {
        super('scene2')
    }

    onEnter() {
        
        this.barrierGroup = this.add.group();

        this.barrier2 = this.add.existing(new Barrier(this,{texture: "char", scaleX: 8, scaleY: 1, deadly: false}))
            .setPosition(-100, 500);
            
        this.barrier3 = this.add.existing(new Barrier(this,{texture: "char", scaleX: 8, scaleY: 1, deadly: false}))
            .setPosition(600, 800);
        
        this.barrier4 = this.add.existing(new Barrier(this,{texture: "char", scaleX: 0.75, scaleY: 4, deadly: false}))
            .setPosition(600, 400);

        this.obstacle = this.add.existing(new Barrier(this,{texture: "char", scaleX: 0.5, scaleY: 0.5, deadly: true}))
            .setPosition(-600, -200);
        
        this.goal = this.add.existing(new Barrier(this,{texture: "char", scaleX: 0.5, scaleY: 4, deadly: false, goal: true}))
            .setPosition(1300, 500);

        this.switch = this.add.existing(new Barrier(this,{texture: "char", scaleX: 0.5, scaleY: 0.5, deadly: false, switch: true}))
            .setPosition(-950, -500);

        this.item = this.add.existing(new Barrier(this,{texture: "char", scaleX: 0.5, scaleY: 0.5, deadly: false, superJump: true}))
            .setPosition(-950, -1000);

        this.barrierGroup
            .add(this.barrier2.barrier)
            .add(this.barrier3.barrier)
            .add(this.barrier4.barrier)

        this.player1 = this.physics.add.sprite(0, 0, "char")
            .setOrigin(0.5, 0.5)
            .setPosition(200, 400)
            .setGravityY(500)

        this.colliding = this.physics.add.collider(this.player1, this.barrierGroup);
    }
}

class scene3 extends baseScene {
    constructor() {
        super('scene3')
    }

    onEnter() {

        this.convo = this.add.text(
            0,
            0,
            'Good job! You jumped! Now its gonna get a bit harder… Click the switch in the next level to remove the obstacle.',
            {
                font: "30px bold",
                color: "#00000",
                wordWrap: { width: 1000, useAdvancedWrap: true }
            }
        )

        this.convo.setOrigin(0.5, 0.5).setPosition(this.cameras.main.centerX, this.cameras.main.centerY)

        this.barrierGroup = this.add.group();
            
        this.barrier3 = this.add.existing(new Barrier(this,{texture: "char", scaleX: 15, scaleY: 1, deadly: false}))
            .setPosition(0, 800);

        this.obstacle = this.add.existing(new Barrier(this,{texture: "char", scaleX: 0.5, scaleY: 0.5, deadly: true}))
            .setPosition(-600, -200);
        
        this.goal = this.add.existing(new Barrier(this,{texture: "char", scaleX: 0.5, scaleY: 4, deadly: false, goal: true}))
            .setPosition(1300, 500);

        this.switch = this.add.existing(new Barrier(this,{texture: "char", scaleX: 0.5, scaleY: 0.5, deadly: false, switch: true}))
            .setPosition(-950, -500);

        this.item = this.add.existing(new Barrier(this,{texture: "char", scaleX: 0.5, scaleY: 0.5, deadly: false, superJump: true}))
            .setPosition(-950, -1000);

        this.barrierGroup
            .add(this.barrier3.barrier)

        this.player1 = this.physics.add.sprite(0, 0, "char")
            .setOrigin(0.5, 0.5)
            .setPosition(200, 700)
            .setGravityY(500)

        this.colliding = this.physics.add.collider(this.player1, this.barrierGroup);

    }
}

class scene4 extends baseScene {
    constructor() {
        super('scene4')
    }

    onEnter() {

        this.barrierGroup = this.add.group();

        this.barrier2 = this.add.existing(new Barrier(this,{texture: "char", scaleX: 8, scaleY: 1, deadly: false}))
            .setPosition(0, 800);

        this.barrier4 = this.add.existing(new Barrier(this,{texture: "char", scaleX: 2, scaleY: 1, deadly: false}))
            .setPosition(900, 600);

        this.barrier6 = this.add.existing(new Barrier(this,{texture: "char", scaleX: 6, scaleY: 1, deadly: false}))
            .setPosition(0, 450);

        this.barrier7 = this.add.existing(new Barrier(this,{texture: "char", scaleX: 4, scaleY: 1, deadly: false}))
            .setPosition(800, 300);

        this.obstacle = this.add.existing(new Barrier(this,{texture: "char", scaleX: 1, scaleY: 3, deadly: true}))
            .setPosition(600, 200);
        
        this.goal = this.add.existing(new Barrier(this,{texture: "char", scaleX: 1, scaleY: 4, deadly: false, goal: true}))
            .setPosition(1200, 0);

        this.switch = this.add.existing(new Barrier(this,{texture: "char", scaleX: 0.5, scaleY: 0.5, deadly: false, switch: true}))
            .setPosition(950, 500);

        this.item = this.add.existing(new Barrier(this,{texture: "char", scaleX: 0.5, scaleY: 0.5, deadly: false, superJump: true}))
            .setPosition(950, 1000);


        this.barrierGroup
            .add(this.barrier2.barrier)
            .add(this.barrier4.barrier)
            .add(this.obstacle.barrier)
            .add(this.barrier6.barrier)
            .add(this.barrier7.barrier)

            
        this.player1 = this.physics.add.sprite(0, 0, "char")
            .setOrigin(0.5, 0.5)
            .setPosition(200, 600)
            .setGravityY(500)
            // .setCollideWorldBounds(true)

        this.colliding = this.physics.add.collider(this.player1, this.barrierGroup);

    }
}

class scene5 extends baseScene {
    constructor() {
        super('scene5')
    }

    onEnter() {

        this.convo = this.add.text(
            0,
            0,
            "Wow you did it! That was a little more challenging, huh? Now its time to get serious. Grab the orange item in the next scene and you can super jump (press 'W' while jumping)! Pretty cool, innit? Be careful, though, you go the furthest when your velocitys the highest.",
            {
                font: "30px bold",
                color: "#00000",
                wordWrap: { width: 1000, useAdvancedWrap: true }
            }
        )

        this.convo.setOrigin(0.5, 0.5).setPosition(this.cameras.main.centerX, this.cameras.main.centerY)

        this.barrierGroup = this.add.group();
            
        this.barrier3 = this.add.existing(new Barrier(this,{texture: "char", scaleX: 15, scaleY: 1, deadly: false}))
            .setPosition(0, 800);

        this.obstacle = this.add.existing(new Barrier(this,{texture: "char", scaleX: 0.5, scaleY: 0.5, deadly: true}))
            .setPosition(-600, -200);
        
        this.goal = this.add.existing(new Barrier(this,{texture: "char", scaleX: 0.5, scaleY: 4, deadly: false, goal: true}))
            .setPosition(1300, 500);

        this.switch = this.add.existing(new Barrier(this,{texture: "char", scaleX: 0.5, scaleY: 0.5, deadly: false, switch: true}))
            .setPosition(-950, -500);

        this.item = this.add.existing(new Barrier(this,{texture: "char", scaleX: 0.5, scaleY: 0.5, deadly: false, superJump: true}))
            .setPosition(-950, -1000);

        this.barrierGroup
            .add(this.barrier3.barrier)

        this.player1 = this.physics.add.sprite(0, 0, "char")
            .setOrigin(0.5, 0.5)
            .setPosition(200, 700)
            .setGravityY(500)

        this.colliding = this.physics.add.collider(this.player1, this.barrierGroup);
    }
}

class scene6 extends baseScene {
    constructor() {
        super("scene6");
    }

    onEnter() {
        this.barrierGroup = this.add.group();

        this.barrier2 = this.add.existing(new Barrier(this,{texture: "char", scaleX: 8, scaleY: 1, deadly: false}))
            .setPosition(-600, 800);
        
        this.barrier3 = this.add.existing(new Barrier(this,{texture: "char", scaleX: 8, scaleY: 1, deadly: false}))
            .setPosition(1100, 800);

        this.barrier4 = this.add.existing(new Barrier(this,{texture: "char", scaleX: 8, scaleY: .5, deadly: false}))
            .setPosition(1100, 200);

        this.barrier5 = this.add.existing(new Barrier(this,{texture: "char", scaleX: 8, scaleY: .5, deadly: false}))
            .setPosition(-600, 200);

        this.obstacle = this.add.existing(new Barrier(this,{texture: "char", scaleX: .5, scaleY: 3, deadly: true}))
            .setPosition(150, -50);

        this.goal = this.add.existing(new Barrier(this,{texture: "char", scaleX: 1, scaleY: 2, deadly: false, goal: true}))
            .setPosition(-50, 0);

        this.switch = this.add.existing(new Barrier(this,{texture: "char", scaleX: 0.5, scaleY: 0.5, deadly: false, switch: true}))
            .setPosition(1150, 75);

        this.item = this.add.existing(new Barrier(this,{texture: "char", scaleX: 0.5, scaleY: 0.5, deadly: false, superJump: true}))
            .setPosition(1150, 700);


        this.barrierGroup
            .add(this.barrier2.barrier)
            .add(this.barrier3.barrier)
            .add(this.barrier4.barrier)
            .add(this.barrier5.barrier)
            .add(this.obstacle.barrier)


        this.player1 = this.physics.add.sprite(0, 0, "char")
            .setOrigin(0.5, 0.5)
            .setPosition(150, 600)
            .setGravityY(625)

        this.colliding = this.physics.add.collider(this.player1, this.barrierGroup);

    }
   
}

class scene7 extends baseScene {
    constructor() {
        super('scene7')
    }

    onEnter() {

        this.convo = this.add.text(
            0,
            0,
            "You beat my game!! Congrats!! If you want to play the levels again, press '1' and '2' on your keyboard or refresh the page to cycle through the levels",
            {
                font: "30px bold",
                color: "#00000",
                wordWrap: { width: 1000, useAdvancedWrap: true }
            }
        )

        this.convo.setOrigin(0.5, 0.5).setPosition(this.cameras.main.centerX, this.cameras.main.centerY)

        this.barrierGroup = this.add.group();
            
        this.barrier3 = this.add.existing(new Barrier(this,{texture: "char", scaleX: 15, scaleY: 1, deadly: false}))
            .setPosition(0, 800);

        this.obstacle = this.add.existing(new Barrier(this,{texture: "char", scaleX: 0.5, scaleY: 0.5, deadly: true}))
            .setPosition(-600, -200);
        
        this.goal = this.add.existing(new Barrier(this,{texture: "char", scaleX: 0.5, scaleY: 4, deadly: false, goal: true}))
            .setPosition(1300, 500);

        this.switch = this.add.existing(new Barrier(this,{texture: "char", scaleX: 0.5, scaleY: 0.5, deadly: false, switch: true}))
            .setPosition(-950, -500);

        this.item = this.add.existing(new Barrier(this,{texture: "char", scaleX: 0.5, scaleY: 0.5, deadly: false, superJump: true}))
            .setPosition(-950, -1000);

        this.barrierGroup
            .add(this.barrier3.barrier)

        this.player1 = this.physics.add.sprite(0, 0, "char")
            .setOrigin(0.5, 0.5)
            .setPosition(200, 700)
            .setGravityY(500)

        this.colliding = this.physics.add.collider(this.player1, this.barrierGroup);
    }
}

let config = {
    type: Phaser.WEBGL,
    width: 1350,
    height: 825,
    backgroundColor: 0x0FFFFF,
    scene: [scene1, scene2, scene3, scene4, scene5, scene6, scene7],
    physics: {
        default: 'arcade',
        arcade: {
            debug: true

        }
    },
}

let game = new Phaser.Game(config);
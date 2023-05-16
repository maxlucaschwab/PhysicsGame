class Barrier extends Phaser.GameObjects.Container {
    constructor(scene, config) {
        super(scene);
        this.config = config;

        this.tile = 6 * 16;

        // this.barrier = scene.physics.add.sprite(0, 0, config.texture)
        //     .setScale(config.scaleX, config.scaleY)
        //     .setImmovable();
        
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
        
        this.add(this.barrier);
    }
    

}

// class Avatar extends Phaser.GameObjects.Sprite {
//     constructor(scene, config) {
//         super(scene);
//         this.config = config;
//     }

//     preload() {
//         this.load.path = "./assets/";
//         this.load.image("char", "tileLight.png");
//     }

//     create() {
//         this.avatar = this.add.sprite(0, 0, "char");
//         this.add(this.avatar);
//     }
// }


class baseScene extends Phaser.Scene {
    constructor() {
        super("baseScene");
    }

    preload() {
        this.load.path = "./assets/";
        this.load.image("char", "tileLight.png");
    }

    // gotoScene(key) {
    //     this.cameras.main.fade(this.transitionDuration, 0, 0, 0);
    //     this.time.delayedCall(this.transitionDuration, () => {
    //         this.scene.start(key, { inventory: this.inventory });
    //     });
    // }

    // checkDeadly(player, tile) {
    //     console.log(tile.config.deadly);
    //     if (tile.config.deadly == true) {
    //         player.setGravity(0, 0).setVelocity(0).setTint(0xFF3000);
    //         this.tweens.add({
    //             targets: player,
    //             y: `-=${2 * this.s}`,
    //             alpha: { from: 1, to: 0 },
    //             duration: 500,
    //             onComplete: () => player.destroy(),
    //             // onComplete: () => this.gotoScene("scene1")
    //         })
    //     }
    // }
    
    create() {

        this.leftPress = false
        this.left = this.add.sprite(600, 100, "char")
            .setInteractive()
            .on('pointerdown', () => {
                this.left.setTint(0xFF0000);
                this.leftPress = true
            })
            .on('pointerup', () => {
                this.left.clearTint()
                this.leftPress = false
            })

        this.rightPress = false
        this.right = this.add.sprite(800, 100, "char")
            .setInteractive()
            .on('pointerdown', () => {
                this.right.setTint(0xFF0000);
                this.rightPress = true
            })
            .on('pointerup', () => {
                this.right.clearTint()
                this.rightPress = false
            })

    }

    update() {
        this.player1.setVelocityX(0);
        let d = this.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.D)
        let a = this.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.A)
        let space = this.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.SPACE)

        if (d.isDown || this.rightPress == true) {
            console.log("updating");
            this.player1.setVelocityX(600);
            // debugger;
        }

        if (a.isDown) {
            this.player1.setVelocityX(-600);
        }

        if (space.isDown || this.leftPress == true) {
            if (this.isJumping !== true && this.player1.body.velocity.y == 0) {
                this.player1.setVelocityY(-500);
                this.isJumping = true;
                console.log("jump");
            }
        } else {
            this.isJumping = false
        }

        if (this.checkBounds(this.player1, this.goal.barrier)) {
            console.log("win!");
            this.player1.setGravity(0).setVelocity(0);
            this.gotoScene("scene2")
        }
        
        if (this.checkBounds(this.player1, this.switch.barrier)) {
            this.switch.barrier
                .setInteractive()
                .on("pointerdown", () => {
                    console.log("wazzap");
                    this.obstacle.destroy();
                })
        }
    }

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
        super("scene1")
    }

    create() {

        this.barrierGroup = this.add.group();

        this.barrier2 = this.add.existing(new Barrier(this,{texture: "char", scaleX: 8, scaleY: 1, deadly: false}))
            .setPosition(0, 800);

        this.barrier3 = this.add.existing(new Barrier(this,{texture: "char", scaleX: 2, scaleY: 1, deadly: true}))
            .setPosition(800, 800);

        this.barrier4 = this.add.existing(new Barrier(this,{texture: "char", scaleX: 2, scaleY: 1, deadly: false}))
            .setPosition(900, 600);

        this.obstacle = this.add.existing(new Barrier(this,{texture: "char", scaleX: 1, scaleY: 3, deadly: true}))
            .setPosition(600, 200);
        
        this.barrier6 = this.add.existing(new Barrier(this,{texture: "char", scaleX: 6, scaleY: 1, deadly: false}))
            .setPosition(0, 450);

        this.barrier7 = this.add.existing(new Barrier(this,{texture: "char", scaleX: 4, scaleY: 1, deadly: false}))
            .setPosition(800, 300);

        this.goal = this.add.existing(new Barrier(this,{texture: "char", scaleX: 1, scaleY: 4, deadly: false, goal: true}))
            .setPosition(1200, 0);

        this.switch = this.add.existing(new Barrier(this,{texture: "char", scaleX: 0.5, scaleY: 0.5, deadly: false, switch: true}))
            .setPosition(950, 500);


        this.barrierGroup
            .add(this.barrier2.barrier)
            .add(this.barrier3.barrier)
            .add(this.barrier4.barrier)
            .add(this.obstacle.barrier)
            .add(this.barrier6.barrier)
            .add(this.barrier7.barrier)

    

        // this.barrier = this.physics.add.sprite(0, 0, "char")
        //     .setScale(15, 1)
        //     .setPosition(this.cameras.main.centerX, 800)
        //     .setImmovable();
            
        this.player1 = this.physics.add.sprite(0, 0, "char")
            .setOrigin(0.5, 0.5)
            .setPosition(200, 600)
            .setGravityY(500)
            // .setCollideWorldBounds(true)

        this.colliding = this.physics.add.collider(this.player1, this.barrierGroup);

        this.isJumping = false;
        

        // console.log(this.barrier2.deadly);

        console.log(this.switch.barrier);
    }
}

class scene2 extends baseScene {
    constructor() {
        super("scene2");
    }
}

let config = {
    type: Phaser.WEBGL,
    width: 1350,
    height: 825,
    backgroundColor: 0x0FFFFF,
    scene: [scene1],
    physics: {
        default: 'arcade',
        arcade: {
            debug: true

        }
    },
}

let game = new Phaser.Game(config);
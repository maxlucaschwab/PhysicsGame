class Barrier extends Phaser.GameObjects.Container {
    constructor(scene, config) {
        super(scene);
        this.config = config;

        this.barrier = scene.physics.add.sprite(0, 0, config.texture)
            .setScale(config.scaleX, config.scaleY)
            .setImmovable();
        
        if (this.config.deadly == true) {
            this.barrier.setTint(0xFF3000);
        } else {
            this.barrier.clearTint();
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
}

class scene1 extends baseScene {
    constructor() {
        super("scene1")
    }

    preload() {
        this.load.path = "./assets/";
        this.load.image("char", "tileLight.png");
    }

    create() {
        let barrier1 = new Barrier(this,{texture: "char", scaleX: 15, scaleY: 1, deadly: false});  

        this.barrier2 = this.add.existing(barrier1)
            .setPosition(this.cameras.main.centerX, 800)
        
        


        // this.barrier = this.physics.add.sprite(0, 0, "char")
        //     .setScale(15, 1)
        //     .setPosition(this.cameras.main.centerX, 800)
        //     .setImmovable();
            
        this.player1 = this.physics.add.sprite(0, 0, "char")
            .setOrigin(0.5, 0.5)
            .setPosition(this.cameras.main.centerX, 500)
            .setGravityY(500)
            .setCollideWorldBounds(true);

        this.physics.add.collider(this.player1, this.barrier2.barrier);

        this.isJumping = false;
        
    }

    update() {
        
        this.player1.setVelocityX(0);
        let d = this.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.D)
        let a = this.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.A)
        let space = this.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.SPACE)

        if (d.isDown) {
            console.log("updating");
            this.player1.setVelocityX(600);
            // debugger;
        }

        if (a.isDown) {
            this.player1.setVelocityX(-600);
        }

        if (space.isDown) {
            if (this.isJumping !== true && this.player1.body.velocity.y == 0) {
                this.player1.setVelocityY(-500);
                this.isJumping = true;
                console.log("jump");
            }
        } else {
            this.isJumping = false
        }

        // if (this.player1.body.velocity.y != 0) {
        //     console.log(this.player1.body.velocity.y);
        //     this.jumped = true
        // }


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
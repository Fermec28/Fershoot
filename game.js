// #region Ball
    function Ball(id,px,py,color= "black"){
        this.id = id;
        this.color= color;     
        this.draw($('#shooter').position());    
        let distance= (Math.pow((px-$('#shooter').position().left),2) + Math.pow((py-$('#shooter').position().top)),2)
        distance= Math.pow(distance,0.5)
        this.deltax = (px-$('#shooter').position().left)/distance;
        this.deltay = (py-$('#shooter').position().top)/distance;
    }
    Ball.prototype.draw= function(position){
        $(".app").append(`<div class="ball ${this.color}" id=ball-${this.id} style="left: ${position.left} ; top: ${position.top} ;"></div>`)
        this.$self= $(`#ball-${this.id}`)
    }
    Ball.prototype.move= function(left,top){    
        this.$self.css({left:left,top:top});
    }
    Ball.prototype.calculateMov= function(){
        totaly= $(".app").height() ;
        totalx= $(".app").width();     
        posx= this.$self.position().left
        posy= this.$self.position().top    
        posx += (this.deltax)*0.1
        posy +=  (this.deltay)*0.1
        //make the 4 cases  posy <0 pos y >height pos x < 0 posx > width
        this.deltax = (posx > totalx- (totalx*0.07) || posx<1) ? (this.deltax)*-1 : (this.deltax);
        if(posy > totaly-8 || posy < 1 ){ 
            this.delete() 
        }     
        this.move(posx,posy)
    }
    Ball.prototype.delete = function(){
        this.deltay=0
        this.deltax=0
        $(`#ball-${this.id}`).remove();
    }
// #endregion 

// #region Enemy
    var Enemy = function(id){
        this.id = id;
        posi= Math.random()*$(".app").width()+1 - $(".app").width()*0.07;
        this.xi=  posi>=0?posi : $(".app").width()*0.07;
        this.deltax=Math.random()*2 - 1;
        this.deltay=Math.random();
        this.color= this.randomColor()
        this.draw() // draw enemy in board
        this.init() // init function
    }
    Enemy.prototype.draw= function(){
        $(".app").append(`<div class="enemy ${this.color}" id=enemy-${this.id} style="left: ${this.xi} ; top:0 ;"></div>`)
        this.$self= $(`#enemy-${this.id}`)
    }

    Enemy.prototype.init = function(){

    }

    Enemy.prototype.move = function(){
        totaly= $(".app").height() ;
        totalx= $(".app").width(); 
        posx = this.$self.position().left 
        posx+= this.deltax/(this.deltay)
        posy = this.$self.position().top  
        posy += this.deltay=== 0? 0:1 
        this.deltax = (posx > totalx- (totalx*0.07) || posx<1) ? (this.deltax)*-1 : (this.deltax);
        if(posy > totaly-15 || posy < 1 ){       
            this.delete(); 
        }
        this.$self.css({left:posx,top:posy});     
    }

    Enemy.prototype.delete = function(){
        this.deltay=0
        this.deltax=0
        $(`#enemy-${this.id}`).remove();
    }

    Enemy.prototype.randomColor= function(){
        radomColor= Math.random()*3
        color="";
        console.log(parseInt(radomColor))
        switch(parseInt(radomColor)){
            case 0: 
                color="blue"; 
                break;
            case 1: 
                color="red"; 
                break;
            case 2: 
                color="black";
                break;
        }
        return color;
    }

// #endregion 

// #region Game
    var Game= function(){
        this.numenemy=0;
        this.numball=0;
        this.balls=[]
        this.enemys=[]
        this.init()
        this.color="black"
    }

    Game.prototype.numballincrement= function(){
        this.numball += 1;
        return this.numball;
    }

    Game.prototype.numenemyincrement= function(){
        this.numenemy += 1;
        return this.numenemy;
    }
    Game.prototype.setMouse = function(x,y){
        this.x= x;
        this.y= y;

    }


    Game.prototype.init = function(){
        self= this;
        $( document ).on( "mousemove", function( event ) {
            self.setMouse( event.pageX, event.pageY )
        });
        $(document).keydown(function (e) {
            if (e.keyCode == 32){
                self.balls.push(new Ball(self.numballincrement(),self.x,self.y,self.color))            
            };
        });

        $("#blue-selector").click(function(){
            self.color="blue"
        })

        $("#black-selector").click(function(){
            self.color="black"
        })

        $("#red-selector").click(function(){
            self.color="red"
        })

        setInterval(function(){ 
            self.balls.forEach(function(element,idex,object){
                if (element.deltax ===0 && element.deltay ===0) {
                    object.splice(idex,1);                
                }
                else{
                    element.calculateMov()
                    if (self.detectCollision(element)) {
                        element.delete();
                        object.splice(idex,1);
                        
                    }
                }
            });

            self.enemys.forEach(function(element,idex,object){
                if (element.deltax ===0 && element.deltay ===0) {
                    object.splice(idex,1);                
                }
                else{            
                element.move();}
            });
        }, 33);

        setInterval(function(){
            if(parseInt(Math.random()*10)===2){
                enemy=self.numenemyincrement();                
                self.enemys.push(new Enemy(enemy))
            }
        },150)
    }

    Game.prototype.detectCollision= function(ball){
        ballx=  ball.$self.position().left
        bally= ball.$self.position().top
        collision= false    
        this.enemys.forEach(function(element,idex,object){
            if(element.color=== ball.color){
                elementx= element.$self.position().left
                elementy= element.$self.position().top

                distance=  Math.pow((bally-elementy),2)  + Math.pow((ballx-elementx),2)
                distance = Math.pow(distance,0.5)

                if (distance<=25 ) {
                    object.splice(idex,1);
                    element.delete();
                    collision=true;
                    return;
                }  
            }
        })

        return collision
    }
// #endregion

$(document).ready(function(){
    game= new Game();   
})
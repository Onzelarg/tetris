var cellSize=30;
var width=10;
var height=20;
var _grid;
var newPiece=true;
var currentPiece;
var buttonPressed;
var fps=5;
var isGaming=true;

class grid{

    constructor(){
        this.cells=[];
        for (let i = 0; i < height; i++) {
            for (let j = 0; j < width; j++) {
                let x=j*cellSize;
                let y=i*cellSize;
                let _cell=new cell(x,y);
                this.cells.push(_cell);
            }
        }
    }

    draw(){
        for (let i = 0; i < this.cells.length; i++) {
            if(!this.cells[i].blank) {
                fill(this.cells[i].color,1);
                rectangle(this.cells[i].x,this.cells[i].y,cellSize-2,cellSize-2,"","",1);
            }
        }
    }

    checkLine(){
        for (let i = 0; i < height; i++) {
            let lines=0;
            let y=i*width;
            for (let j = 0; j < width; j++) {
                if(!this.cells[y+j].blank) lines++;
            }
            if(lines==10) this.moveDown(i);
        }
    }

    moveDown(row){
        clear(1);
        noFill();
        engine.background.draw_grid(1);
        for (let i = row; i > 1; i--) {
            let currentRow=i*width;
            let previousRow=currentRow-width;
            for (let j = 0; j < width; j++) {
                this.cells[currentRow+j].color=this.cells[previousRow+j].color;
                this.cells[currentRow+j].blank=this.cells[previousRow+j].blank;
                // if(i==row) this.cells[currentRow+j].blank=true;
                // if(!this.cells[previousRow+j].blank){
                //     this.cells[currentRow+j].color=this.cells[previousRow+j].color;
                //     this.cells[currentRow+j].blank=false;
                // }
            }
            
        }
    }


}


class cell{
    
    constructor(x,y){
        this.blank=true;
        this.x=x;
        this.y=y;
    }

    set(color){
        this.color=color;
        this.blank=false;
    }

}

class pieces{

    constructor(cells,color){
        this.cells=cells;
        this.color=color;
        this.x=3;
        this.y=0;
        this.collided=false;
        newPiece=false;
    }

    draw(){
        fill(this.color);
        for (let i = 0; i < this.cells.length; i++) {
            for (let j = 0; j < this.cells[i].length; j++) {
                if(this.cells[i][j]==1) rectangle((this.x-1)*cellSize+j*cellSize+1,(this.y-1)*cellSize+i*cellSize+1,cellSize-2,cellSize-2);
            }
        }
    }

    left(){
        if(!this.sideCollision(1)) currentPiece.x--;
    }

    right(){
        if(!this.sideCollision(0)) currentPiece.x++;
    }

    down(){
        if(this.collision()){
            this.freeze();
        }else{
            this.y++;
        }
    }

    rotate(){
        let rotated=this.cells[0].map((val, index) => this.cells.map(row => row[index]).reverse());
        if(!this.sideCollision(2,rotated)) this.cells=rotated;
    }

    sideCollision(direction,_arr){
        let arr=this.cells;
        if(_arr) arr=_arr;
        for (let j = 0; j < arr.length; j++) {
            for (let k = 0; k < arr[j].length; k++) {
                let a=this.x-1+k;
                let b=this.x+1+k;
                if(arr[j][k]==1 && ((a<1 && (direction==1 || direction==2)) || (b>width && (direction==0 || direction==2)))) return true;
            }
        }
        return false;
    }

    collision(){
        for (let i = 0; i < this.cells.length; i++) {
            for (let j = 0; j < this.cells[i].length; j++) {
                if(this.cells[i][j]==1){
                    if(this.y+i+1==height || !_grid.cells[((i+this.y+1)*width)+(j+this.x-1)].blank) {
                        if(this.y==0) isGaming=false;
                        return true;
                    }
                }
            } 
        }
        return false;
    }

    freeze(){
        this.collided=true;
        newPiece=true;
        for (let j = 0; j < this.cells.length; j++) {
            for (let k = 0; k < this.cells[j].length; k++) {
                if(this.cells[j][k]==1) {
                    _grid.cells[((j+this.y)*width)+(k+this.x-1)].blank=false;
                    _grid.cells[((j+this.y)*width)+(k+this.x-1)].color=this.color;
                }
            }
        }
        _grid.checkLine();
        _grid.draw();
    }



}



const iPiece={
    form: [ 
    [0,1,0,0],
    [0,1,0,0],
    [0,1,0,0],
    [0,1,0,0],],
    color: Red
};

const tPiece={
    form: [ 
    [0,1,0],
    [1,1,1],
    [0,0,0] ], 
    color: Cyan
};

const lPiece={
    form: [ 
    [1,0,0],
    [1,0,0],
    [1,1,0] ],
    color: OrangeRed
};

const jPiece={
    form: [ 
    [0,0,1],
    [0,0,1],
    [0,1,1] ],
    color: Blue
};

const zPiece={
    form: [ 
    [1,1,0],
    [0,1,1],
    [0,0,0] ], 
    color: MagentaRose
};

const sPiece={
    form: [ 
    [0,1,1],
    [1,1,0],
    [0,0,0] ],
    color: JungleGreen
};

const oPiece = {
    form: [[1,1,0],
        [1,1,0],
        [0,0,0]],
    color: Lemon
};

function drawGrid(){
    setup(width*cellSize,height*cellSize,"",true);
    _grid=new grid();
    engine.background.make_grid_byAmount(10,20);
    engine.background.draw_grid(1);
    framerate(fps);
    document.body.addEventListener("keydown",action);
}

function getnewPiece(){
    let piece=get_RandomInt(1,7);
    switch (piece){
        case 1:
            currentPiece=new pieces(iPiece.form,iPiece.color);
            break;
        case 2:
            currentPiece=new pieces(tPiece.form,tPiece.color);
           break;
        case 3:
            currentPiece=new pieces(lPiece.form,lPiece.color);
            break;
        case 4:
            currentPiece=new pieces(jPiece.form,jPiece.color);
           break;
        case 5:
            currentPiece=new pieces(zPiece.form,zPiece.color);
           break;
        case 6:
            currentPiece=new pieces(sPiece.form,sPiece.color);
           break;
        case 7:
            currentPiece=new pieces(oPiece.form,oPiece.color);
           break;
    } 
}

function draw(){
    clear();
    if(newPiece) getnewPiece();
    currentPiece.down();
    currentPiece.draw();
    if(!isGaming) {
        stop();
        log("Game has lost");
    }
}

function action(e){
    if(e.code=="Space") currentPiece.rotate();
    if(e.code=="ArrowRight") currentPiece.right();
    if(e.code=="ArrowLeft") currentPiece.left();
    if(e.code=="ArrowDown") currentPiece.down();
    if(e.code=="ArrowUp") currentPiece.rotate();
}


drawGrid();
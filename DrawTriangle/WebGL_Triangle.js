var VS_Source=
    'attribute vec4 a_Position;\n'+
    'uniform mat4 u_ModelMat;\n'+
    'attribute vec4 a_Color;\n'+
    'varying vec4 v_Color;\n'+
    'void main()\n'+
    '{\n'+
        'gl_Position=u_ModelMat*a_Position;\n'+
        'v_Color=a_Color;\n'+
    '}\n';

var FS_Source=
    '#ifdef GL_ES\n'+
    'precision mediump float;\n'+
    '#endif\n'+
    'varying vec4 v_Color;\n'+
    'void main()\n'+
    '{\n'+
    '   gl_FragColor=v_Color;\n'+
    '}\n';


var RotateSpeed = 45.0;
var lastFrameTime = Date.now();
var currentAngle = 0;

function Main(){
    var canvas = document.getElementById("webgl");
    var gl = getWebGLContext(canvas);
    if(!gl)
    {
        console.log("获取webgl绘图上下文失败！");
        return;
    }

    if(!initShaders(gl, VS_Source,FS_Source))
    {
        console.log("初始化着色器失败！");
        return;
    }

    gl.clearColor(0.0, 0.0, 0.0, 1);

    var n=InitVertexBuffers(gl);
    if(n<0)
    {
        console.log("顶点数小于0");
        return;
    }

    var modelMat = new Matrix4();
    var tick = function(){
        Rotate(modelMat, 0.0, 0.0, 1);
        Draw(gl, n, modelMat);
        requestAnimationFrame(tick);
    };
    tick();
}

/**
 * 创建顶点缓存
 * @param {*} gl 
 */
function InitVertexBuffers(gl)
{
    var vertices = new Float32Array([
        0.0, Math.sqrt(3)/3, 1.0, 0.0, 0.0,
        -0.5, -Math.sqrt(3)/6, 0.0, 1.0, 0.0,
        0.5, -Math.sqrt(3)/6, 0.0, 0.0, 1.0
    ]);
    var n=3;
    var elementSize = vertices.BYTES_PER_ELEMENT;
    var vertiexBUffer = gl.createBuffer();
    if(!vertiexBUffer)
    {
        console.log("创建顶点缓存失败！");
        return -1;
    }
    gl.bindBuffer(gl.ARRAY_BUFFER, vertiexBUffer);
    gl.bufferData(gl.ARRAY_BUFFER, vertices, gl.STATIC_DRAW);

    var a_Position = gl.getAttribLocation(gl.program, 'a_Position');
    gl.vertexAttribPointer(a_Position, 2, gl.FLOAT, false, elementSize*5, 0);
    gl.enableVertexAttribArray(a_Position);

    var a_Color=gl.getAttribLocation(gl.program, 'a_Color');
    gl.vertexAttribPointer(a_Color, 3, gl.FLOAT, false, elementSize*5, elementSize*2);
    gl.enableVertexAttribArray(a_Color);

    return n;
}

/**
 * 更新旋转矩阵
 */
function Rotate(modelMat, x, y, z)
{ 
    var thisFrameTime  =Date.now();
    var frameInterval = thisFrameTime - lastFrameTime;
    lastFrameTime = thisFrameTime;
    var targetAngle =currentAngle + RotateSpeed * frameInterval/1000;
    targetAngle %= 360;
    currentAngle = targetAngle;
    modelMat.setRotate(currentAngle, x, y, z);
}

/**
 * 绘制
 * @param {*} gl 
 * @param {*} count 
 * @param {*} modelMat 
 */
function Draw(gl, count, modelMat)
{
    var u_modelMat = gl.getUniformLocation(gl.program, "u_ModelMat");
    gl.uniformMatrix4fv(u_modelMat, false, modelMat.elements);

    gl.clear(gl.COLOR_BUFFER_BIT);
    gl.drawArrays(gl.TRIANGLES, 0, count);
}


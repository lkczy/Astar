var VS_Source=
    'uniform mat4 u_MVPMat;\n'+
    'attribute vec4 a_Position;\n'+
    'attribute vec2 a_TexCoord;\n'+
    'varying vec2 v_TexCoord;\n'+
    'void main()\n'+
    '{\n'+
        'gl_Position=u_MVPMat*a_Position;\n'+
        'v_TexCoord=a_TexCoord;\n'+
    '}\n';

var FS_Source=
    '#ifdef GL_ES\n'+
    'precision mediump float;\n'+
    '#endif\n'+
    'uniform sampler2D u_Sampler0;\n'+
    'varying vec2 v_TexCoord;\n'+
    'void main()\n'+
    '{\n'+
    '   gl_FragColor=texture2D(u_Sampler0,v_TexCoord);\n'+
    '}\n';

var modelMat = new Matrix4();
var viewMat = new Matrix4();
var projMat = new Matrix4();
var mvpMat = new Matrix4();
var currentTargetAngle = 0;
var RotateTargetSpeed = 30;
var lastFrameTime = Date.now();
var texCount = 1;
var gl;
var canvas;
var vertexCount;

function Main(){
    canvas = document.getElementById("webgl");
    gl = getWebGLContext(canvas);
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
    gl.enable(gl.DEPTH_TEST);
    gl.clearColor(0.0, 0.0, 0.0, 1);

    vertexCount = InitBuffers(gl);

    LoadImage(gl,"../resources/sky_cloud.jpg","u_Sampler0",0);
    gl.pixelStorei(gl.UNPACK_FLIP_Y_WEBGL, 1);
}


function tick ()
{
    var frameInterval = CalFrameInterval();
    currentTargetAngle = UpdateAngle(frameInterval, currentTargetAngle, RotateTargetSpeed);

    modelMat.setRotate(currentTargetAngle, 0, 1, 0);
    viewMat.setLookAt(0, 3, 5, 0, 0, 0, 0, 1, 0);
    projMat.setPerspective(45, canvas.width/canvas.height, 1, 100);
    mvpMat.set(projMat).multiply(viewMat).multiply(modelMat);
    Draw(gl, gl.TRIANGLES, mvpMat);

    requestAnimationFrame(tick);
};

/**
 * 创建缓存
 * @param {*} gl 
 */
function InitBuffers(gl)
{
    var vertices = new Float32Array([
        1.0, 1.0, 1.0, 0.0, 0.0,  -1.0, 1.0, 1.0, 1.0, 0.0,  -1.0,-1.0, 1.0, 1.0, 1.0,   1.0,-1.0, 1.0, 0.0, 1.0,  // front
        1.0, 1.0, 1.0, 0.0, 0.0,   1.0,-1.0, 1.0, 1.0, 0.0,   1.0,-1.0,-1.0, 1.0, 1.0,   1.0, 1.0,-1.0, 0.0, 1.0,  // right
        1.0, 1.0, 1.0, 0.0, 0.0,   1.0, 1.0,-1.0, 1.0, 0.0,  -1.0, 1.0,-1.0, 1.0, 1.0,  -1.0, 1.0, 1.0, 0.0, 1.0,  // up
        -1.0, 1.0, 1.0, 0.0, 0.0,  -1.0, 1.0,-1.0, 1.0, 0.0,  -1.0,-1.0,-1.0, 1.0, 1.0,  -1.0,-1.0, 1.0, 0.0, 1.0,  // left
        -1.0,-1.0,-1.0, 0.0, 0.0,   1.0,-1.0,-1.0, 1.0, 0.0,   1.0,-1.0, 1.0, 1.0, 1.0,  -1.0,-1.0, 1.0, 0.0, 1.0,  // down
        1.0,-1.0,-1.0, 0.0, 0.0,  -1.0,-1.0,-1.0, 1.0, 0.0,  -1.0, 1.0,-1.0, 1.0, 1.0,   1.0, 1.0,-1.0, 0.0, 1.0   // back
    ]);


    var indices = new Uint8Array([
        0, 1, 2,   0, 2, 3,    // front
        4, 5, 6,   4, 6, 7,    // right
        8, 9,10,   8,10,11,    // up
        12,13,14,  12,14,15,    // left
        16,17,18,  16,18,19,    // down
        20,21,22,  20,22,23     // back
    ])
    var elementSize = vertices.BYTES_PER_ELEMENT;

    //顶点缓存
    var vertiexBUffer = gl.createBuffer();
    if(!vertiexBUffer)
    {
        console.log("创建顶点缓存失败！");
        return -1;
    }
    gl.bindBuffer(gl.ARRAY_BUFFER, vertiexBUffer);
    gl.bufferData(gl.ARRAY_BUFFER, vertices, gl.STATIC_DRAW);

    var a_Position = gl.getAttribLocation(gl.program, 'a_Position');
    gl.vertexAttribPointer(a_Position, 3, gl.FLOAT, false, elementSize*5, 0);
    gl.enableVertexAttribArray(a_Position);

    var a_TexCoord=gl.getAttribLocation(gl.program, 'a_TexCoord');
    gl.vertexAttribPointer(a_TexCoord, 2, gl.FLOAT, false, elementSize*5, elementSize*3);
    gl.enableVertexAttribArray(a_TexCoord);

    //索引缓存
    var indexBuffer = gl.createBuffer();
    if(!indexBuffer)
    {
        console.log("创建索引缓存失败！");
        return -1;
    }
    gl.bindBuffer(gl.ELEMENT_ARRAY_BUFFER, indexBuffer);
    gl.bufferData(gl.ELEMENT_ARRAY_BUFFER, indices,gl.STATIC_DRAW);

    return indices.length;

}

function LoadImage(gl, url, u_SamplerStr, texUnit)
{ 
    var img = new Image();
    img.onload = function(){
        InitTexture(gl, img, u_SamplerStr, texUnit);
    };
    img.src = url;
}

function InitTexture(gl, img, u_SamplerStr, texUnit)
{
    var texture2D = gl.createTexture();
    var u_Sampler = gl.getUniformLocation(gl.program, u_SamplerStr);
    if(texUnit==0)
    {
        gl.activeTexture(gl.TEXTURE0);
    }
    else if(texUnit==1)
    {
        gl.activeTexture(gl.TEXTURE1);
    }
    gl.bindTexture(gl.TEXTURE_2D, texture2D);
    gl.texParameteri(gl.TEXTURE_2D,gl.TEXTURE_MIN_FILTER, gl.LINEAR);
    gl.texImage2D(gl.TEXTURE_2D,0,gl.RGBA,gl.RGBA,gl.UNSIGNED_BYTE,img);
    gl.uniform1i(u_Sampler, texUnit);
    texCount--;
    if(texCount<=0)
    {
        tick();
    }
}

/**
 * 计算每帧间隔时间
 */
function CalFrameInterval()
{
    var thisFrameTime  =Date.now();
    var frameInterval = thisFrameTime - lastFrameTime;
    lastFrameTime = thisFrameTime;
    return frameInterval;
}

/**
 * 更新旋转值
 */
function UpdateAngle(frameInterval, currentAngle, rotateSpeed)
{
    var targetAngle = currentAngle + rotateSpeed * frameInterval/1000;
    targetAngle %= 360;
    return targetAngle;
}


/**
 * 绘制
 * @param {*} gl 
 * @param {*} count 
 * @param {*} modelMat 
 */
function Draw(gl, model, mvpMat)
{
    var u_mvpMat = gl.getUniformLocation(gl.program, "u_MVPMat");
    gl.uniformMatrix4fv(u_mvpMat, false,  mvpMat.elements);

    gl.clear(gl.COLOR_BUFFER_BIT | gl.DEPTH_BUFFER_BIT);
    gl.drawElements(model, vertexCount, gl.UNSIGNED_BYTE, 0);
}

var TexVS_Source=
    'attribute vec4 a_Position;\n'+
    'attribute vec4 a_Normal;\n'+
    'attribute vec2 a_TexCoord;\n'+

    'uniform mat4 u_MVPMat;\n'+
    'uniform mat4 u_NormalMat;\n'+
    'uniform mat4 u_ModelMat;\n'+

    'varying vec2 v_TexCoord;\n'+
    'varying vec3 v_Normal;\n'+
    'varying vec3 v_Position;\n'+

    'void main()\n'+
    '{\n'+
        'gl_Position=u_MVPMat*a_Position;\n'+
        'v_TexCoord=a_TexCoord;\n'+
        'v_Normal=normalize(vec3(u_NormalMat*a_Normal));\n'+
        'v_Position=vec3(u_ModelMat*a_Position);\n'+
    '}\n';

var TexFS_Source=
    '#ifdef GL_ES\n'+
    'precision mediump float;\n'+
    '#endif\n'+

    'uniform sampler2D u_Sampler0;\n'+
    'uniform vec3 u_PointLightPos;\n'+
    'uniform vec3 u_PointLightColor;\n'+
    'uniform vec3 u_AmbientLightColor;\n'+

    'varying vec2 v_TexCoord;\n'+
    'varying vec3 v_Normal;\n'+
    'varying vec3 v_Position;\n'+

    'void main()\n'+
    '{\n'+
        'vec4 baseColor=texture2D(u_Sampler0,v_TexCoord);\n'+
        'vec3 LightDir=normalize(u_PointLightPos-v_Position);\n'+
        'float nDotL=max(0.0, dot(LightDir,v_Normal));\n'+
        'vec3 diffuse=u_PointLightColor*baseColor.rgb*nDotL;\n'+
        'vec3 ambient=u_AmbientLightColor*baseColor.rgb;\n'+
        'gl_FragColor=vec4(diffuse+ambient, baseColor.a);\n'+
    '}\n';

var TVS_Source=
    'attribute vec4 a_Position;\n'+
    'attribute vec4 a_Normal;\n'+

    'uniform mat4 u_MVPMat;\n'+
    'uniform mat4 u_NormalMat;\n'+
    'uniform mat4 u_ModelMat;\n'+

    'varying vec3 v_Normal;\n'+
    'varying vec3 v_Position;\n'+

    'void main()\n'+
    '{\n'+
        'gl_Position=u_MVPMat*a_Position;\n'+
        'v_Normal=normalize(vec3(u_NormalMat*a_Normal));\n'+
        'v_Position=vec3(u_ModelMat*a_Position);\n'+
    '}\n';
    

var TFS_Source=
    '#ifdef GL_ES\n'+
    'precision mediump float;\n'+
    '#endif\n'+

    'uniform vec3 u_PointLightPos;\n'+
    'uniform vec3 u_PointLightColor;\n'+
    'uniform vec3 u_AmbientLightColor;\n'+

    'varying vec3 v_Normal;\n'+
    'varying vec3 v_Position;\n'+

    'void main()\n'+
    '{\n'+
        'vec4 baseColor=vec4(1.0, 1.0, 1.0, 0.1);\n'+
        'vec3 LightDir=normalize(u_PointLightPos-v_Position);\n'+
        'float nDotL=max(0.0, dot(LightDir,v_Normal));\n'+
        'vec3 diffuse=u_PointLightColor*baseColor.rgb*nDotL;\n'+
        'vec3 ambient=u_AmbientLightColor*baseColor.rgb;\n'+
        'gl_FragColor=vec4(diffuse+ambient,baseColor.a);\n'+
    '}\n';


var vertices = new Float32Array([
    1.0, 1.0, 1.0,   -1.0, 1.0, 1.0,   -1.0,-1.0, 1.0,    1.0,-1.0, 1.0,  // front
    1.0, 1.0, 1.0,    1.0,-1.0, 1.0,    1.0,-1.0,-1.0,    1.0, 1.0,-1.0,  // right
    1.0, 1.0, 1.0,    1.0, 1.0,-1.0,   -1.0, 1.0,-1.0,   -1.0, 1.0, 1.0,   // up
    -1.0, 1.0, 1.0,   -1.0, 1.0,-1.0,   -1.0,-1.0,-1.0,   -1.0,-1.0, 1.0,  // left
    -1.0,-1.0,-1.0,    1.0,-1.0,-1.0,    1.0,-1.0, 1.0,   -1.0,-1.0, 1.0,   // down
    1.0,-1.0,-1.0,   -1.0,-1.0,-1.0,   -1.0, 1.0,-1.0,    1.0, 1.0,-1.0   // back
]);

var normals = new Float32Array([    
    0.0, 0.0, 1.0,   0.0, 0.0, 1.0,   0.0, 0.0, 1.0,   0.0, 0.0, 1.0,  // front
    1.0, 0.0, 0.0,   1.0, 0.0, 0.0,   1.0, 0.0, 0.0,   1.0, 0.0, 0.0,  // right
    0.0, 1.0, 0.0,   0.0, 1.0, 0.0,   0.0, 1.0, 0.0,   0.0, 1.0, 0.0,  // up
    -1.0, 0.0, 0.0,  -1.0, 0.0, 0.0,  -1.0, 0.0, 0.0,  -1.0, 0.0, 0.0,  // left
    0.0,-1.0, 0.0,   0.0,-1.0, 0.0,   0.0,-1.0, 0.0,   0.0,-1.0, 0.0,  // down
    0.0, 0.0,-1.0,   0.0, 0.0,-1.0,   0.0, 0.0,-1.0,   0.0, 0.0,-1.0   // back
]);

var indices = new Uint8Array([
    0, 1, 2,   0, 2, 3,    // front
    4, 5, 6,   4, 6, 7,    // right
    8, 9,10,   8,10,11,    // up
    12,13,14,  12,14,15,    // left
    16,17,18,  16,18,19,    // down
    20,21,22,  20,22,23     // back
]);

var texCoords = new Float32Array([
    1.0, 1.0,  0.0, 1.0,  0.0, 0.0, 1.0, 0.0,
    1.0, 1.0,  0.0, 1.0,  0.0, 0.0, 1.0, 0.0,
    1.0, 1.0,  0.0, 1.0,  0.0, 0.0, 1.0, 0.0,
    1.0, 1.0,  0.0, 1.0,  0.0, 0.0, 1.0, 0.0,
    1.0, 1.0,  0.0, 1.0,  0.0, 0.0, 1.0, 0.0,
    1.0, 1.0,  0.0, 1.0,  0.0, 0.0, 1.0, 0.0
]);

var verticesBuffer;
var normalsBuffer;
var texCoordsBuffer;
var indicesBuffer;
var texture;

var texProgram;
var tProgram;

var modelMat = new Matrix4();
var viewMat = new Matrix4();
var projMat = new Matrix4();
var mvpMat = new Matrix4();

var currentTargetAngle = 0;
var RotateTargetSpeed = 10;
var lastFrameTime = Date.now();

var vertexCount = indices.length;
var elementSize = vertices.BYTES_PER_ELEMENT;
var lightPos = new Float32Array([-5.0, 5.0, 5.0]);

var gl;
var canvas;

function Main(){
    canvas = document.getElementById("webgl");
    gl = getWebGLContext(canvas);
    if(!gl)
    {
        console.log("获取webgl绘图上下文失败！");
        return;
    }

    //创建shader程序
    texProgram = createProgram(gl, TexVS_Source, TexFS_Source);

    texProgram.a_Position = gl.getAttribLocation(texProgram, "a_Position");
    texProgram.a_Normal = gl.getAttribLocation(texProgram, "a_Normal");
    texProgram.a_TexCoord = gl.getAttribLocation(texProgram, "a_TexCoord");

    texProgram.u_MVPMat = gl.getUniformLocation(texProgram, "u_MVPMat");
    texProgram.u_NormalMat = gl.getUniformLocation(texProgram, "u_NormalMat");
    texProgram.u_ModelMat = gl.getUniformLocation(texProgram, "u_ModelMat");

    texProgram.u_Sampler0 = gl.getUniformLocation(texProgram, "u_Sampler0");
    texProgram.u_PointLightPos = gl.getUniformLocation(texProgram, "u_PointLightPos");
    texProgram.u_PointLightColor = gl.getUniformLocation(texProgram, "u_PointLightColor");
    texProgram.u_AmbientLightColor = gl.getUniformLocation(texProgram, "u_AmbientLightColor");


    tProgram = createProgram(gl, TVS_Source, TFS_Source);
    tProgram.a_Position = gl.getAttribLocation(tProgram, "a_Position");
    tProgram.a_Normal = gl.getAttribLocation(tProgram, "a_Normal");

    tProgram.u_MVPMat = gl.getUniformLocation(tProgram, "u_MVPMat");
    tProgram.u_NormalMat = gl.getUniformLocation(tProgram, "u_NormalMat");
    tProgram.u_ModelMat = gl.getUniformLocation(tProgram, "u_ModelMat");

    tProgram.u_PointLightPos = gl.getUniformLocation(tProgram, "u_PointLightPos");
    tProgram.u_PointLightColor = gl.getUniformLocation(tProgram, "u_PointLightColor");
    tProgram.u_AmbientLightColor = gl.getUniformLocation(tProgram, "u_AmbientLightColor");

    //创建buffer
    verticesBuffer = CreateArrayBuffer(vertices, 3, gl.FLOAT);
    normalsBuffer = CreateArrayBuffer(normals, 3, gl.FLOAT);
    texCoordsBuffer = CreateArrayBuffer(texCoords, 2, gl.FLOAT);
    indicesBuffer = CreateIndexBuffer(indices, gl.UNSIGNED_BYTE);

    //纹理
    texture = CreateTexture("../resources/sky_cloud.jpg","u_Sampler0");

    //View，Proj
    viewMat.setLookAt(10.0, 10.0, 13.0, 0.0, 0.0, 0.0, 0.0, 1.0, 0.0);
    projMat.setPerspective(30, canvas.width/canvas.height, 1, 100);

    gl.enable(gl.DEPTH_TEST);
    gl.enable(gl.BLEND);
    gl.blendFunc(gl.SRC_ALPHA, gl.ONE_MINUS_SRC_ALPHA)
    tick ();
}

/**
 * 创建ArrayBuffer
 * @param {*} data 
 * @param {*} pointSzie 
 * @param {*} type 
 */
function CreateArrayBuffer(data, pointSzie, type)
{
    var buffer = gl.createBuffer();
    gl.bindBuffer(gl.ARRAY_BUFFER, buffer);
    gl.bufferData(gl.ARRAY_BUFFER, data, gl.STATIC_DRAW);
    buffer.pointSzie = pointSzie;
    buffer.type = type;
    gl.bindBuffer(gl.ARRAY_BUFFER, null);
    return buffer;
}

/**
 * 创建索引buffer
 * @param {*} data 
 * @param {*} type 
 */
function CreateIndexBuffer(data, type)
{
    var buffer = gl.createBuffer();
    gl.bindBuffer(gl.ELEMENT_ARRAY_BUFFER, buffer);
    gl.bufferData(gl.ELEMENT_ARRAY_BUFFER, data, gl.STATIC_DRAW);
    buffer.type = type;
    gl.bindBuffer(gl.ELEMENT_ARRAY_BUFFER, null);
    return buffer;
}


function CreateTexture(url)
{
    var texture2D = gl.createTexture();
    var img = new Image();
    img.onload = function(){
        gl.pixelStorei(gl.UNPACK_FLIP_Y_WEBGL, 1);      
        gl.bindTexture(gl.TEXTURE_2D, texture2D);
        gl.texParameteri(gl.TEXTURE_2D,gl.TEXTURE_MIN_FILTER, gl.LINEAR);
        gl.texImage2D(gl.TEXTURE_2D,0,gl.RGBA,gl.RGBA,gl.UNSIGNED_BYTE,img);
    };
    img.src = url;
    return texture2D;
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
 * 设置顶点属性
 * @param {*} buffer 
 * @param {*} attribute 
 */
function InitAttribute(buffer, attribute)
{
    gl.bindBuffer(gl.ARRAY_BUFFER, buffer);
    gl.vertexAttribPointer(attribute, buffer.pointSzie, buffer.type,false, 0, 0);
    gl.enableVertexAttribArray(attribute);
}


function DrawCube(shader)
{
    //物体光照相关
    gl.uniform3fv(shader.u_PointLightPos, lightPos);
    gl.uniform3f(shader.u_PointLightColor, 1.0, 1.0, 1.0);
    gl.uniform3f(shader.u_AmbientLightColor, 0.2, 0.2, 0.2);

    mvpMat.set(projMat).multiply(viewMat).multiply(modelMat);
    gl.uniformMatrix4fv(shader.u_MVPMat, false,  mvpMat.elements);

    var normalMat = new Matrix4();
    normalMat.setInverseOf(modelMat);
    normalMat.transpose();
    
    gl.uniformMatrix4fv(shader.u_NormalMat, false,  normalMat.elements);

    gl.uniformMatrix4fv(shader.u_NormalMat, false,  modelMat.elements);

    gl.bindBuffer(gl.ELEMENT_ARRAY_BUFFER, indicesBuffer);
    gl.drawElements(gl.TRIANGLES, vertexCount, gl.UNSIGNED_BYTE, 0);
}


/**
 * 绘制纹理物体
 */
function DrawTex(shader)
{
    gl.useProgram(shader);

    InitAttribute(verticesBuffer, shader.a_Position);
    InitAttribute(normalsBuffer, shader.a_Normal);
    InitAttribute(texCoordsBuffer, shader.a_TexCoord);

    //纹理
    gl.activeTexture(gl.TEXTURE0);
    gl.bindTexture(gl.TEXTURE_2D, texture);
    gl.uniform1i(shader.u_Sampler0, 0);

    var frameInterval = CalFrameInterval();
    currentTargetAngle = UpdateAngle(frameInterval, currentTargetAngle, RotateTargetSpeed);
    modelMat.setRotate(currentTargetAngle, 0.0, 1.0, 0.0);

    DrawCube(shader);
}


/**
 * 绘制透明物体
 */
function DrawTran(shader)
{
	gl.useProgram(shader);
    InitAttribute(verticesBuffer, shader.a_Position);
    InitAttribute(normalsBuffer, shader.a_Normal);

    modelMat.setTranslate(1.0, 0, 3.0);
    DrawCube(shader);
}


function tick()
{
    gl.clearColor(0.0, 0.0, 0.0, 1.0);  
    gl.clear(gl.COLOR_BUFFER_BIT | gl.DEPTH_BUFFER_BIT);
    DrawTex(texProgram);
    gl.depthMask(false);
    DrawTran(tProgram);
    gl.depthMask(true);
    requestAnimationFrame(tick);
}
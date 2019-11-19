// HelloCube.js (c) 2012 matsuda
//顶点着色器程序
var VSHADER_SOURCE =
  'attribute vec4 a_Position;\n' +
  'uniform mat4 u_MvpMatrix;\n' +//=投影矩阵*视图矩阵*模型矩阵
  'void main() {\n' +
  '  gl_Position = u_MvpMatrix * a_Position;\n' +
  '}\n';

//片元着色器程序
var FSHADER_SOURCE =
  '#ifdef GL_ES\n' +
  'precision mediump float;\n' +
  '#endif\n' +
  'void main() {\n' +
  '  gl_FragColor = vec4(0.0,0.0,0.5,1.0);\n' +
  '}\n';

var rotateSpeed = 90.0;
var currentAngle = 0.0;
var lastTime = Date.now();
var n;

function main() {
  //获取<canvas>元素
  var canvas = document.getElementById('webgl');

  //获取WebGL上下文
  var gl = getWebGLContext(canvas);
  if (!gl) {
    console.log('Failed to get the rendering context for WebGL');
    return;
  }

  //初始化着色器
  if (!initShaders(gl, VSHADER_SOURCE, FSHADER_SOURCE)) {
    console.log('Failed to intialize shaders.');
    return;
  }

  //设置顶点信息
  n = initVertexBuffers(gl);
  if (n < 0) {
    console.log('Failed to set the vertex information');
    return;
  }

  //设置背景颜色和开启隐藏面消除
  gl.clearColor(0.5, 0.5, 0.5, 1.0);
  gl.enable(gl.DEPTH_TEST);

  //设置投影和视图矩阵
  var mvpMatrix = new Matrix4();
  var viewMatrix = new Matrix4();
  var projMatrix = new Matrix4();
  var modelMatrix = new Matrix4();

  projMatrix.setPerspective(30, 1, 1, 100);
  viewMatrix.lookAt(3, 3, 7, 0, 0, 0, 0, 1, 0);

  var tick = function () {
    var deltaTime = lastTimeFrame();
    currentAngle = updateRotateAngle(rotateSpeed, currentAngle, deltaTime);
    modelMatrix.setRotate(currentAngle, 0, 1, 0);
    modelMatrix.rotate(currentAngle,1,0,0);
    mvpMatrix.set(projMatrix).multiply(viewMatrix).multiply(modelMatrix);
    draw(gl, mvpMatrix);
    requestAnimationFrame(tick);
  };
  tick();

}

function initVertexBuffers(gl) {
  var vertex = new Float32Array([
    // 顶点坐标和颜色
    1.0,1.0,1.0,   -1.0,1.0,1.0,   -1.0,-1.0,1.0,   1.0,-1.0,1.0,//F
    1.0,1.0,1.0,   1.0,-1.0,1.0,   1.0,-1.0,-1.0,   1.0,1.0,-1.0,//R
    1.0,1.0,1.0,   1.0,1.0,-1.0,   -1.0,1.0,-1.0,   -1.0,1.0,1.0,//U
    -1.0,1.0,1.0,  -1.0,1.0,-1.0,  -1.0,-1.0,-1.0,  -1.0,-1.0,1.0,//L
    -1.0,-1.0,-1.0, 1.0,-1.0,-1.0, 1.0,-1.0,1.0,    -1.0,-1.0,1.0,//D
    1.0,-1.0,-1.0, -1.0,-1.0,-1.0, -1.0,1.0,-1.0,   1.0,1.0,-1.0//B
  ]);//6个数值一组，一共8组

  // 顶点的索引(绘制时立方体使用各个点的顺序)
  var indices = new Uint8Array([
    0,1,2,    0,2,3,// F
    4,5,6,    4,6,7,// R
    8,9,10,   8,10,11,// U
    12,13,14, 12,14,15,// L
    16,17,18, 16,18,19,// D
    20,21,22, 20,22,23// B
  ]);

  // 创建缓冲区对象
  var vertexBuffer = gl.createBuffer();
  var indexBuffer = gl.createBuffer();
  if (!vertexBuffer || !indexBuffer) {
    return -1;
  }

  // 将顶点坐标和颜色写入缓冲区对象
  gl.bindBuffer(gl.ARRAY_BUFFER, vertexBuffer);
  gl.bufferData(gl.ARRAY_BUFFER, vertex, gl.STATIC_DRAW);

  var FSIZE = vertex.BYTES_PER_ELEMENT;
  // 将缓冲区内顶点坐标数据分配给a_Position并开启之
  var a_Position = gl.getAttribLocation(gl.program, 'a_Position');
  if (a_Position < 0) {
    console.log('Failed to get the storage location of a_Position');
    return -1;
  }
  gl.vertexAttribPointer(a_Position, 3, gl.FLOAT, false, FSIZE * 3, 0);
  gl.enableVertexAttribArray(a_Position);

  // 将顶点索引数据写入缓冲区对象
  gl.bindBuffer(gl.ELEMENT_ARRAY_BUFFER, indexBuffer);
  gl.bufferData(gl.ELEMENT_ARRAY_BUFFER, indices, gl.STATIC_DRAW);

  return indices.length;//n=36
}

function lastTimeFrame() {
  var timeNow = Date.now();
  var elapsed = timeNow - lastTime;
  lastTime = timeNow;
  return elapsed;
}

function updateRotateAngle(rotatingSpeed, angle, time) {
  var newAngle = angle + (rotatingSpeed * time) / 1000.0;
  newAngle = newAngle % 360;
  return newAngle;
}

function draw(gl, mvpMatrix) {
  //获取u_MvpMatrix地址
  var u_MvpMatrix = gl.getUniformLocation(gl.program, 'u_MvpMatrix');
  if (!u_MvpMatrix) {
    console.log('Failed to get the storage location of u_MvpMatrix');
    return;
  }
  //传递模型、视图、投影矩阵到u_MvpMatrix
  gl.uniformMatrix4fv(u_MvpMatrix, false, mvpMatrix.elements);
  // 清空颜色和深度缓冲区
  gl.clear(gl.COLOR_BUFFER_BIT | gl.DEPTH_BUFFER_BIT);
  // 画出立方体
  gl.drawElements(gl.TRIANGLES, n, gl.UNSIGNED_BYTE, 0);
}
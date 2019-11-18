// HelloCube.js (c) 2012 matsuda
//顶点着色器程序
var VSHADER_SOURCE =
  'attribute vec4 a_Position;\n' +
  'attribute vec4 a_Color;\n' +
  'uniform mat4 u_MvpMatrix;\n' +//=投影矩阵*视图矩阵*模型矩阵
  'varying vec4 v_Color;\n' +
  'void main() {\n' +
  '  gl_Position = u_MvpMatrix * a_Position;\n' +
  '  v_Color = a_Color;\n' +
  '}\n';

//片元着色器程序
var FSHADER_SOURCE =
  '#ifdef GL_ES\n' +
  'precision mediump float;\n' +
  '#endif\n' +
  'varying vec4 v_Color;\n' +
  'void main() {\n' +
  '  gl_FragColor = v_Color;\n' +
  '}\n';

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
  var n = initVertexBuffers(gl);
  if (n < 0) {
    console.log('Failed to set the vertex information');
    return;
  }

  //设置背景颜色和开启隐藏面消除
  gl.clearColor(0.5, 0.5, 0.5, 1.0);
  gl.enable(gl.DEPTH_TEST);

  //获取u_MvpMatrix地址
  var u_MvpMatrix = gl.getUniformLocation(gl.program, 'u_MvpMatrix');
  if (!u_MvpMatrix) { 
    console.log('Failed to get the storage location of u_MvpMatrix');
    return;
  }

  //设置投影和视图矩阵
  var mvpMatrix = new Matrix4();
  mvpMatrix.setPerspective(30, 1, 1, 100);
  mvpMatrix.lookAt(3, 3, 7, 0, 0, 0, 0, 1, 0);

  //传递模型、视图、投影矩阵到u_MvpMatrix
  gl.uniformMatrix4fv(u_MvpMatrix, false, mvpMatrix.elements);

  // 清空颜色和深度缓冲区
  gl.clear(gl.COLOR_BUFFER_BIT | gl.DEPTH_BUFFER_BIT);

  // 画出立方体
  gl.drawElements(gl.TRIANGLES, n, gl.UNSIGNED_BYTE, 0);
}

function initVertexBuffers(gl) {
  var verticesColors = new Float32Array([
    // 顶点坐标和颜色
     1,  1,  1,    1.0,  0.0,  0.0,// v0 索引值0
    -1,  1,  1,    0.1,  0.2,  0.3,// v1 索引值1
    -1, -1,  1,    1.0,  0.0,  1.0,// v2 索引值3
     1, -1,  1,    1.0,  1.0,  0.0,// v3 索引值3
     1, -1, -1,    0.0,  1.0,  0.0,// v4 索引值4
     1,  1, -1,    0.0,  1.0,  1.0,// v5 索引值5
    -1,  1, -1,    0.0,  0.0,  1.0,// v6 索引值6
    -1, -1, -1,    1.0,  1.0,  1.0 // v7 索引值7
  ]);//6个数值一组，一共8组

  // 顶点的索引(绘制时立方体使用各个点的顺序)
  var indices = new Uint8Array([
    0, 1, 2,  0, 2, 3,// F
    0, 3, 4,  0, 4, 5,// R
    0, 5, 6,  0, 6, 1,// U
    1, 6, 7,  1, 7, 2,// L
    7, 4, 3,  7, 3, 2,// D
    4, 7, 6,  4, 6, 5 // B
 ]);

  // 创建缓冲区对象
  var vertexColorBuffer = gl.createBuffer();
  var indexBuffer = gl.createBuffer();
  if (!vertexColorBuffer || !indexBuffer) {
    return -1;
  }

  // 将顶点坐标和颜色写入缓冲区对象
  gl.bindBuffer(gl.ARRAY_BUFFER, vertexColorBuffer);
  gl.bufferData(gl.ARRAY_BUFFER, verticesColors, gl.STATIC_DRAW);

  var FSIZE = verticesColors.BYTES_PER_ELEMENT;
  // 将缓冲区内顶点坐标数据分配给a_Position并开启之
  var a_Position = gl.getAttribLocation(gl.program, 'a_Position');
  if(a_Position < 0) {
    console.log('Failed to get the storage location of a_Position');
    return -1;
  }
  gl.vertexAttribPointer(a_Position, 3, gl.FLOAT, false, FSIZE * 6, 0);
  gl.enableVertexAttribArray(a_Position);
  // 将缓冲区内顶点颜色数据分配给a_Color并开启之
  var a_Color = gl.getAttribLocation(gl.program, 'a_Color');
  if(a_Color < 0) {
    console.log('Failed to get the storage location of a_Color');
    return -1;
  }
  gl.vertexAttribPointer(a_Color, 3, gl.FLOAT, false, FSIZE * 6, FSIZE * 3);
  gl.enableVertexAttribArray(a_Color);

  // 将顶点索引数据写入缓冲区对象
  gl.bindBuffer(gl.ELEMENT_ARRAY_BUFFER, indexBuffer);
  gl.bufferData(gl.ELEMENT_ARRAY_BUFFER, indices, gl.STATIC_DRAW);

  return indices.length;//n=36
}

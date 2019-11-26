// HelloCube.js (c) 2012 matsuda
//������ɫ������
var VSHADER_SOURCE =
  'attribute vec4 a_Position;\n' +
  'uniform mat4 u_MvpMatrix;\n' +//=ͶӰ����*��ͼ����*ģ�;���
  'attribute vec4 a_Color;\n' + 
  'varying vec4 v_Color;\n' + 
  'void main() {\n' +
  '  gl_Position = u_MvpMatrix * a_Position;\n' +
  '  v_Color = a_Color;\n' + 
  '}\n';

//ƬԪ��ɫ������
var FSHADER_SOURCE =
  '#ifdef GL_ES\n' +
  'precision mediump float;\n' +
  '#endif\n' +
  'varying vec4 v_Color;\n' + 
  'void main() {\n' +
  '  gl_FragColor = v_Color;\n' +
  '}\n';

var rotateSpeed = 20.0;
var currentAngle = 0.0;
var lastTime = Date.now();
var n;
//����ͶӰ����ͼ����
var mvpMatrix = new Matrix4();
var viewMatrix = new Matrix4();
var projMatrix = new Matrix4();
var modelMatrix = new Matrix4();

function main() {
  //��ȡ<canvas>Ԫ��
  var canvas = document.getElementById('webgl');

  //��ȡWebGL������
  var gl = getWebGLContext(canvas);
  if (!gl) {
    console.log('Failed to get the rendering context for WebGL');
    return;
  }

  //��ʼ����ɫ��
  if (!initShaders(gl, VSHADER_SOURCE, FSHADER_SOURCE)) {
    console.log('Failed to intialize shaders.');
    return;
  }

  //���ö�����Ϣ
  n = initVertexBuffers(gl);
  if (n < 0) {
    console.log('Failed to set the vertex information');
    return;
  }

  //���ñ�����ɫ�Ϳ�������������
  gl.clearColor(0.0, 0.0, 0.0, 1.0);
  gl.enable(gl.DEPTH_TEST);
  // �������
  //gl.enable(gl.BLEND);
  // �趨���Ч��
  //gl.blendFunc(gl.SRC_ALPHA, gl.ONE_MINUS_SRC_ALPHA);
  // �ر���Ȳ���
  //gl.depthMask(false);

  projMatrix.setPerspective(30, 1, 1, 100);
  viewMatrix.lookAt(0, 25, 25, 0, 0, 0, 0, 1, 0);

  var tick = function () {
    var deltaTime = lastTimeFrame();
    currentAngle = updateRotateAngle(rotateSpeed, currentAngle, deltaTime);
    draw1(gl);
    requestAnimationFrame(tick);
  };
  tick();

}

function initVertexBuffers(gl) {
  var vertex = new Float32Array([
    // ��������
    1.0,1.0,1.0,   -1.0,1.0,1.0,   -1.0,-1.0,1.0,   1.0,-1.0,1.0,//F
    1.0,1.0,1.0,   1.0,-1.0,1.0,   1.0,-1.0,-1.0,   1.0,1.0,-1.0,//R
    1.0,1.0,1.0,   1.0,1.0,-1.0,   -1.0,1.0,-1.0,   -1.0,1.0,1.0,//U
    -1.0,1.0,1.0,  -1.0,1.0,-1.0,  -1.0,-1.0,-1.0,  -1.0,-1.0,1.0,//L
    -1.0,-1.0,-1.0, 1.0,-1.0,-1.0, 1.0,-1.0,1.0,    -1.0,-1.0,1.0,//D
    1.0,-1.0,-1.0, -1.0,-1.0,-1.0, -1.0,1.0,-1.0,   1.0,1.0,-1.0//B
  ]);

  //��ɫ
  var color = new Float32Array([
    0.0,0.0,1.0,  0.0,0.0,1.0,  0.0,0.0,1.0,  0.0,0.0,1.0,
    1.0,0.0,0.0,  1.0,0.0,0.0,  1.0,0.0,0.0,  1.0,0.0,0.0,
    1.0,1.0,0.0,  1.0,1.0,0.0,  1.0,1.0,0.0,  1.0,1.0,0.0,
    1.0,0.5,0.0,  1.0,0.5,0.0,  1.0,0.5,0.0,  1.0,0.5,0.0,
    1.0,1.0,1.0,  1.0,1.0,1.0,  1.0,1.0,1.0,  1.0,1.0,1.0,
    0.0,1.0,0.0,  0.0,1.0,0.0,  0.0,1.0,0.0,  0.0,1.0,0.0
  ]);


  // ���������(����ʱ������ʹ�ø������˳��)
  var indices = new Uint8Array([
    0,1,2,    0,2,3,// F
    4,5,6,    4,6,7,// R
    8,9,10,   8,10,11,// U
    12,13,14, 12,14,15,// L
    16,17,18, 16,18,19,// D
    20,21,22, 20,22,23// B
  ]);

  // ��������������
  var indexBuffer = gl.createBuffer();
  if (!indexBuffer) {
    return -1;
  }
  
  initArrayBuffer(gl,"a_Position",vertex,gl.FLOAT,3);
  initArrayBuffer(gl,'a_Color',color,gl.FLOAT,3);

  // ��������������д�뻺��������
  gl.bindBuffer(gl.ELEMENT_ARRAY_BUFFER, indexBuffer);
  gl.bufferData(gl.ELEMENT_ARRAY_BUFFER, indices, gl.STATIC_DRAW);

  return indices.length;//n=36
}

function initArrayBuffer(gl,attribute,data,type,num){
  var buffer = gl.createBuffer();
  if(!buffer){
    console.log('�޷�����������');
    return false;
  }
  //������д�뻺����
  gl.bindBuffer(gl.ARRAY_BUFFER,buffer);
  gl.bufferData(gl.ARRAY_BUFFER,data,gl.STATIC_DRAW);
  //��ȡ����attribute�Ĵ洢λ�ã����������󶨵�������
  var a_attribute = gl.getAttribLocation(gl.program,attribute);
  if(a_attribute<0){
    console.log('�޷���ȡ������'+attribute+'�洢λ��');
    return false;
  }
  gl.vertexAttribPointer(a_attribute,num,type,false,0,0);
  //����������
  gl.enableVertexAttribArray(a_attribute);
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

function draw1(gl) {
  modelMatrix.setRotate(currentAngle, 0, 1, 0);
  mvpMatrix.set(projMatrix).multiply(viewMatrix).multiply(modelMatrix);
  //��ȡu_MvpMatrix��ַ
  var u_MvpMatrix = gl.getUniformLocation(gl.program, 'u_MvpMatrix');
  if (!u_MvpMatrix) {
    console.log('Failed to get the storage location of u_MvpMatrix');
    return;
  }
  //����ģ�͡���ͼ��ͶӰ����u_MvpMatrix
  gl.uniformMatrix4fv(u_MvpMatrix, false, mvpMatrix.elements);
  // �����ɫ����Ȼ�����
  gl.clear(gl.COLOR_BUFFER_BIT | gl.DEPTH_BUFFER_BIT);
  // ����������
  gl.drawElements(gl.TRIANGLES, n, gl.UNSIGNED_BYTE, 0);
}
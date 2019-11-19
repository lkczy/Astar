// TexturedCube.js
//������ɫ������
var VSHADER_SOURCE =
  'uniform mat4 u_MvpMatrix;\n'+
  'attribute vec4 a_Position;\n'+
  'attribute vec2 a_TexCoord;\n'+
  'varying vec2 v_TexCoord;\n'+
  'void main()\n'+
  '{\n'+
    'gl_Position=u_MvpMatrix*a_Position;\n'+
    'v_TexCoord=a_TexCoord;\n'+
  '}\n';

//ƬԪ��ɫ������
var FSHADER_SOURCE =
  '#ifdef GL_ES\n' +
  'precision mediump float;\n' +
  '#endif\n' +
  'uniform sampler2D u_Sampler;\n'+
  'varying vec2 v_TexCoord;\n' + 
  'void main() \n' +
  '{\n'+
  ' gl_FragColor = texture2D(u_Sampler,v_TexCoord);\n' +
  '}\n';

var rotateSpeed = 90.0;
var currentAngle = 0.0;
var lastTime = Date.now();
var n;

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
  gl.clearColor(0.5, 0.5, 0.5, 1.0);
  gl.enable(gl.DEPTH_TEST);

  //��������
  if(!initTextures(gl,n)){
    console.log('Failed to set the position of the texture');
    return;
  }

  //����ͶӰ����ͼ����
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
    // �����������ͼ����
    1.0,1.0,1.0,0.0,0.0,    -1.0,1.0,1.0,1.0,0.0,   -1.0,-1.0,1.0,1.0,1.0,   1.0,-1.0,1.0,0.0,1.0,//F
    1.0,1.0,1.0,0.0,0.0,    1.0,-1.0,1.0,1.0,0.0,   1.0,-1.0,-1.0,1.0,1.0,   1.0,1.0,-1.0,0.0,1.0,//R
    1.0,1.0,1.0,0.0,0.0,    1.0,1.0,-1.0,1.0,0.0,   -1.0,1.0,-1.0,1.0,1.0,   -1.0,1.0,1.0,0.0,1.0,//U
    -1.0,1.0,1.0,0.0,0.0,   -1.0,1.0,-1.0,1.0,0.0, -1.0,-1.0,-1.0,1.0,1.0,  -1.0,-1.0,1.0,0.0,1.0,//L
    -1.0,-1.0,-1.0,0.0,0.0, 1.0,-1.0,-1.0,1.0,0.0,   1.0,-1.0,1.0,1.0,1.0,    -1.0,-1.0,1.0,0.0,1.0,//D
    1.0,-1.0,-1.0,0.0,0.0,  -1.0,-1.0,-1.0,1.0,0.0, -1.0,1.0,-1.0,1.0,1.0,   1.0,1.0,-1.0,0.0,1.0//B
  ]);//6����ֵһ�飬һ��8��

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
  var vertexBuffer = gl.createBuffer();
  var indexBuffer = gl.createBuffer();
  if (!vertexBuffer || !indexBuffer) {
    return -1;
  }

  // �������������ɫд�뻺��������
  gl.bindBuffer(gl.ARRAY_BUFFER, vertexBuffer);
  gl.bufferData(gl.ARRAY_BUFFER, vertex, gl.STATIC_DRAW);

  var FSIZE = vertex.BYTES_PER_ELEMENT;
  // ���������ڶ����������ݷ����a_Position������֮
  var a_Position = gl.getAttribLocation(gl.program, 'a_Position');
  if (a_Position < 0) {
    console.log('Failed to get the storage location of a_Position');
    return -1;
  }
  gl.vertexAttribPointer(a_Position, 3, gl.FLOAT, false, FSIZE * 5, 0);
  gl.enableVertexAttribArray(a_Position);

  var a_TexCoord = gl.getAttribLocation(gl.program,'a_TexCoord');
  gl.vertexAttribPointer(a_TexCoord,2,gl.FLOAT,false,FSIZE*5,FSIZE*3);
  gl.enableVertexAttribArray(a_TexCoord);

  // ��������������д�뻺��������
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

function initTextures(gl,n){
  var texture = gl.createTexture();//�����������
  if(!texture){
    console.log('Failed to create the texture object');
    return;
  }

  //��ȡu_Sampler
  var u_Sampler = gl.getUniformLocation(gl.program,'u_Sampler');
  if(!u_Sampler){
    console.log('Failed to get the storage location of u_Sampler');
    return false;
  }

  var image = new Image();//����һ��image����
  if(!image){
    console.log('Failed to create the image object');
    return false;
  }
  //ע��ͼ������¼�����Ӧ����
  image.onload = function(){loadTexture(gl,n,texture,u_Sampler,image);};
  //�������ʼ����ͼ��
  image.src='../resources/sky_cloud.jpg';

  return true;
}

function loadTexture(gl,n,texture,u_Sampler,image){
  gl.pixelStorei(gl.UNPACK_FLIP_Y_WEBGL, 1);//������ͼ�����y�ᷴת
  //����0������Ԫ
  gl.activeTexture(gl.TEXTURE0);
  //��target���������
  gl.bindTexture(gl.TEXTURE_2D, texture);

  //�����������
  gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MIN_FILTER, gl.LINEAR);
  //��������ͼ��
  gl.texImage2D(gl.TEXTURE_2D, 0, gl.RGB, gl.RGB, gl.UNSIGNED_BYTE, image);

  //��0�������ݸ���ɫ��
  gl.uniform1i(u_Sampler, 0);

  //gl.clear(gl.COLOR_BUFFER_BIT);   //��� <canvas>

  //gl.drawArrays(gl.TRIANGLE_STRIP, 0, n); // ���Ƴ�������
}
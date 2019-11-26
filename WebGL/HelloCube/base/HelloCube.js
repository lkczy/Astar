// HelloCube.js (c) 2012 matsuda
//������ɫ������
var VSHADER_SOURCE =
  'attribute vec4 a_Position;\n' +
  'attribute vec4 a_Color;\n' +
  'uniform mat4 u_MvpMatrix;\n' +//=ͶӰ����*��ͼ����*ģ�;���
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
  var n = initVertexBuffers(gl);
  if (n < 0) {
    console.log('Failed to set the vertex information');
    return;
  }

  //���ñ�����ɫ�Ϳ�������������
  gl.clearColor(0.5, 0.5, 0.5, 1.0);
  gl.enable(gl.DEPTH_TEST);

  //��ȡu_MvpMatrix��ַ
  var u_MvpMatrix = gl.getUniformLocation(gl.program, 'u_MvpMatrix');
  if (!u_MvpMatrix) { 
    console.log('Failed to get the storage location of u_MvpMatrix');
    return;
  }

  //����ͶӰ����ͼ����
  var mvpMatrix = new Matrix4();
  mvpMatrix.setPerspective(30, 1, 1, 100);
  mvpMatrix.lookAt(3, 3, 7, 0, 0, 0, 0, 1, 0);

  //����ģ�͡���ͼ��ͶӰ����u_MvpMatrix
  gl.uniformMatrix4fv(u_MvpMatrix, false, mvpMatrix.elements);

  // �����ɫ����Ȼ�����
  gl.clear(gl.COLOR_BUFFER_BIT | gl.DEPTH_BUFFER_BIT);

  // ����������
  gl.drawElements(gl.TRIANGLES, n, gl.UNSIGNED_BYTE, 0);
}

function initVertexBuffers(gl) {
  var verticesColors = new Float32Array([
    // �����������ɫ
     1,  1,  1,    1.0,  0.0,  0.0,// v0 ����ֵ0
    -1,  1,  1,    0.1,  0.2,  0.3,// v1 ����ֵ1
    -1, -1,  1,    1.0,  0.0,  1.0,// v2 ����ֵ3
     1, -1,  1,    1.0,  1.0,  0.0,// v3 ����ֵ3
     1, -1, -1,    0.0,  1.0,  0.0,// v4 ����ֵ4
     1,  1, -1,    0.0,  1.0,  1.0,// v5 ����ֵ5
    -1,  1, -1,    0.0,  0.0,  1.0,// v6 ����ֵ6
    -1, -1, -1,    1.0,  1.0,  1.0 // v7 ����ֵ7
  ]);//6����ֵһ�飬һ��8��

  // ���������(����ʱ������ʹ�ø������˳��)
  var indices = new Uint8Array([
    0, 1, 2,  0, 2, 3,// F
    0, 3, 4,  0, 4, 5,// R
    0, 5, 6,  0, 6, 1,// U
    1, 6, 7,  1, 7, 2,// L
    7, 4, 3,  7, 3, 2,// D
    4, 7, 6,  4, 6, 5 // B
 ]);

  // ��������������
  var vertexColorBuffer = gl.createBuffer();
  var indexBuffer = gl.createBuffer();
  if (!vertexColorBuffer || !indexBuffer) {
    return -1;
  }

  // �������������ɫд�뻺��������
  gl.bindBuffer(gl.ARRAY_BUFFER, vertexColorBuffer);
  gl.bufferData(gl.ARRAY_BUFFER, verticesColors, gl.STATIC_DRAW);

  var FSIZE = verticesColors.BYTES_PER_ELEMENT;
  // ���������ڶ����������ݷ����a_Position������֮
  var a_Position = gl.getAttribLocation(gl.program, 'a_Position');
  if(a_Position < 0) {
    console.log('Failed to get the storage location of a_Position');
    return -1;
  }
  gl.vertexAttribPointer(a_Position, 3, gl.FLOAT, false, FSIZE * 6, 0);
  gl.enableVertexAttribArray(a_Position);
  // ���������ڶ�����ɫ���ݷ����a_Color������֮
  var a_Color = gl.getAttribLocation(gl.program, 'a_Color');
  if(a_Color < 0) {
    console.log('Failed to get the storage location of a_Color');
    return -1;
  }
  gl.vertexAttribPointer(a_Color, 3, gl.FLOAT, false, FSIZE * 6, FSIZE * 3);
  gl.enableVertexAttribArray(a_Color);

  // ��������������д�뻺��������
  gl.bindBuffer(gl.ELEMENT_ARRAY_BUFFER, indexBuffer);
  gl.bufferData(gl.ELEMENT_ARRAY_BUFFER, indices, gl.STATIC_DRAW);

  return indices.length;//n=36
}

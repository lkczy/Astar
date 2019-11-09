// HelloCanvas.js (c) 2012 matsuda

//������ɫ������
var VSHADER_SOURCE =
    'void main(){\n' +
    'gl_Position = vec4(0.0,0.0,0.0,1.0);\n' +
    'gl_PointSize = 10.0;\n' +
    '}\n';

//ƬԪ��ɫ������
var FSHADER_SOURCE =
    'void main(){\n' +
    'gl_FragColor = vec4(1.0,0.0,0.0,1.0);\n' +
    '}\n';


function main() {
  // Retrieve <canvas> element
  var canvas = document.getElementById('webgl');

  // Get the rendering context for WebGL
  var gl = getWebGLContext(canvas);
  if (!gl) {
    console.log('Failed to get the rendering context for WebGL');
    return;
  }

   //��ʼ����ɫ��
    if (!initShaders(gl, VSHADER_SOURCE, FSHADER_SOURCE)) {
        console.log('Failed to initialize shaders.');
        return;
    }

 
  // Set clear color
  gl.clearColor(0.5, 0.5, 0.5, 1.0);

  // Clear <canvas>
    gl.clear(gl.COLOR_BUFFER_BIT);

  //����һ����
    gl.drawArrays(gl.POINTS, 0, 1);

}

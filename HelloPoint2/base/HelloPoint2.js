// HelloCanvas.js (c) 2012 matsuda
//顶点着色器程序
var VSHADER_SOURCE =
    'attribute vec4 a_Position;\n' +  
    'attribute float a_PointSize;\n' +
    'void main(){\n' +
    'gl_Position=a_Position;\n' +
    'gl_PointSize=a_PointSize;\n' +
    '}\n';

//片元着色器程序
var FSHADER_SOURCE =
    'void main(){\n' +
    'gl_FragColor = vec4(0.0,0.0,1.0,1.0);\n' +
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

   //初始化着色器
    if (!initShaders(gl, VSHADER_SOURCE, FSHADER_SOURCE)) {
        console.log('Failed to initialize shaders.');
        return;
    }

    //获取attribute变量的储存位置
    var a_Position = gl.getAttribLocation(gl.program, 'a_Position');
    if (a_Position < 0) {
        console.log('Failed to get the storage location of a_Position');
        return;
    }
    var a_PointSize = gl.getAttribLocation(gl.program, 'a_PointSize');

    //将顶点位置传输给attribute变量
    gl.vertexAttrib3f(a_Position, 0.0, 0.0, 0.0);
    gl.vertexAttrib1f(a_PointSize, 5.0);
    

  // Set clear color
  gl.clearColor(0.5, 0.5, 0.5, 1.0);

  // Clear <canvas>
    gl.clear(gl.COLOR_BUFFER_BIT);

  //绘制一个点
    gl.drawArrays(gl.POINTS, 0, 1);

}

// ClickedPoints.js
//������ɫ������
var VSHADER_SOURCE =
    'attribute vec4 a_Position;\n' +  
    'void main(){\n' +
    'gl_Position=a_Position;\n' +
    'gl_PointSize=10.0;\n' +
    '}\n';

//ƬԪ��ɫ������
var FSHADER_SOURCE =
    'precision mediump float;\n' +
    'uniform vec4 u_FragColor;\n'+
    'void main(){\n' +
    'gl_FragColor = u_FragColor;\n' +
    '}\n';


function main() {
    // ��ȡ<canvas>Ԫ��
    var canvas = document.getElementById('webgl');

    // ��ȡWebGL������
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

    //��ȡa_Position�����Ĵ���λ��
    var a_Position = gl.getAttribLocation(gl.program, 'a_Position');

    //��ȡu_FragColor�����Ĵ洢λ��
    var u_FragColor = gl.getUniformLocation(gl.program, 'u_FragColor');

    //ע��������¼���Ӧ����
    canvas.onmousedown = function (ev) { click(ev, gl, canvas, a_Position,u_FragColor); };

    // Set clear color
    gl.clearColor(0.5, 0.5, 0.5, 1.0);

    // ��� <canvas>
    gl.clear(gl.COLOR_BUFFER_BIT);
}
var g_points = [];//�����λ������
var g_colors = [];//�洢����ɫ������
function click(ev, gl, canvas, a_Position, u_FragColor) {
    var x = ev.clientX;//���������X����
    var y = ev.clientY;//���������Y����
    var rect = ev.target.getBoundingClientRect();

    x = ((x - rect.left) - canvas.height / 2) / (canvas.height / 2);
    y = (canvas.width / 2 - (y - rect.top)) / (canvas.width / 2);
    //�����괢�浽g_points������
    g_points.push([x,y]);
    //�������ɫ���浽g_colors������
    if (x >= 0.0 && y >= 0.0) {     //��һ����
        g_colors.push([1.0, 0.0, 0.0, 1.0]);//��ɫ
    } else if (x < 0.0 && y < 0.0) {    //��������
        g_colors.push([0.0, 1.0, 0.0, 1.0]);//��ɫ
    } else {
        g_colors.push([1.0, 1.0, 1.0, 1.0]);//��ɫ
    }

    // ��� <canvas>
    gl.clear(gl.COLOR_BUFFER_BIT);
        
    var len = g_points.length;
    for (var i = 0; i < len; i++) {
        var xy = g_points[i];
        var rgba = g_colors[i];
        //�����λ�ô��ݵ�����a_Position������
        gl.vertexAttrib3f(a_Position, xy[0], xy[1], 0.0);
        //�������ɫ���ݵ�����u_FragColor������
        gl.uniform4f(u_FragColor, rgba[0], rgba[1], rgba[2], rgba[3]);
        //����һ����
        gl.drawArrays(gl.POINTS, 0, 1);
    }    
}



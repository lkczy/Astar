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
    'void main(){\n' +
    'gl_FragColor = vec4(0.0,0.0,1.0,1.0);\n' +
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

    //��ȡattribute�����Ĵ���λ��
    var a_Position = gl.getAttribLocation(gl.program, 'a_Position');
    if (a_Position < 0) {
        console.log('Failed to get the storage location of a_Position');
        return;
    }

    //ע��������¼���Ӧ����
    canvas.onmousedown = function (ev) { click(ev, gl, canvas, a_Position); };

    //������λ�ô����attribute����
    gl.vertexAttrib3f(a_Position, 0.0, 0.0, 0.0);

    // Set clear color
    gl.clearColor(0.5, 0.5, 0.5, 1.0);

    // ��� <canvas>
    gl.clear(gl.COLOR_BUFFER_BIT);
}
    var g_points = [];//�����λ������
    function click(ev, gl, canvas, a_Position) {
        var x = ev.clientX;//���������X����
        var y = ev.clientY;//���������Y����
        var rect = ev.target.getBoundingClientRect();

        x = ((x - rect.left) - canvas.height / 2) / (canvas.height / 2);
        y = (canvas.width / 2 - (y - rect.top)) / (canvas.width / 2);
        //�����괢�浽g_points������
        g_points.push(x);
        g_points.push(y);

        // ��� <canvas>
        gl.clear(gl.COLOR_BUFFER_BIT);
        
        var len = g_points.length;
        for (var i = 0; i < len; i+=2) {
            //�����λ�ô��ݵ�����a_Position��
            gl.vertexAttrib3f(a_Position, g_points[i], g_points[i + 1], 0.0);
            //����һ����
            gl.drawArrays(gl.POINTS, 0, 1);
        }    
    }



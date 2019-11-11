// HelloTriangle.js
//������ɫ������
var VSHADER_SOURCE =
    'attribute vec4 a_Position;\n' +  
    'uniform vec4 u_Translation;\n'+
    'void main(){\n' +
    'gl_Position=a_Position+u_Translation;\n' +
    '}\n';

//ƬԪ��ɫ������
var FSHADER_SOURCE =
    'void main(){\n' +
    'gl_FragColor = vec4(0.0,0.0,1.0,1.0);\n' +
    '}\n';

//��x,y,z������ƽ�Ƶľ���
var Tx = 0.5, Ty = 0.5, Tz = 0.0;

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

    //���ö���λ��
    var n = initVertexBuffers(gl);
    if (n < 0) {
        console.log('Failed to set the position of the vertices');
        return;
    }

    //��ƽ�ƾ��봫���������ɫ��
    var u_Translation = gl.getUniformLocation(gl.program, 'u_Translation');
    gl.uniform4f(u_Translation, Tx, Ty, Tz, 0.0);

    // Set clear color
    gl.clearColor(0.5, 0.5, 0.5, 1.0);

    // ��� <canvas>
    gl.clear(gl.COLOR_BUFFER_BIT);

    //����������
    gl.drawArrays(gl.TRIANGLES, 0, n);//n is 3
}

function initVertexBuffers(gl) {
    var vertices = new Float32Array([0.0, 0.5, -0.5, -0.5, 0.5, -0.5]);
    var n = 3;//��ĸ���

    //��������������
    var vertexBuffer = gl.createBuffer();
    if (!vertexBuffer) {
        console.log('Failed to create the buffer object');
        return;
    }


    //������������󶨵�Ŀ��
    gl.bindBuffer(gl.ARRAY_BUFFER, vertexBuffer);
    //�򻺳���������д������
    gl.bufferData(gl.ARRAY_BUFFER, vertices, gl.STATIC_DRAW);
    //��ȡattribute�����Ĵ���λ��
    var a_Position = gl.getAttribLocation(gl.program, 'a_Position');
    if (a_Position < 0) {
        console.log('Failed to get the storage location of a_Position');
        return;
    }
    //����������������a_Position����
    gl.vertexAttribPointer(a_Position, 2, gl.FLOAT, false, 0, 0);

    //����a_Position�������������Ļ���������
    gl.enableVertexAttribArray(a_Position);

    return n;
}



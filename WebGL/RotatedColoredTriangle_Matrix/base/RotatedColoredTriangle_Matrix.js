// RotatedColoredTriangle_Matrix.js
//������ɫ������
var VSHADER_SOURCE =
    'attribute vec4 a_Position;\n' +  
    'uniform mat4 u_xformMatrix;\n'+
    'attribute vec4 a_Color;\n' +
    'varying vec4 v_Color;\n' +//varying����
    'void main(){\n' +
    'gl_Position = u_xformMatrix * a_Position;\n' +
    'v_Color=a_Color;\n'+
    '}\n';

//ƬԪ��ɫ������
var FSHADER_SOURCE =
    'precision mediump float;\n' +
    'varying vec4 v_Color;\n'+
    'void main(){\n' +
    'gl_FragColor = v_Color;\n' +
    '}\n';

//��ת�Ƕ�
var ANGLE = 90.0;

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

    //������ת����
    var radin = Math.PI * ANGLE / 180.0;//תΪ������
    var cosB = Math.cos(radin),sinB = Math.sin(radin);//��ת
    var Tx = 0.0, Ty = 0.0, Tz = 0;//ƽ��
    var Sx = 1.0, Sy = 1.0, Sz = 1.0;//����
    var xformMatrix = new Float32Array([
        Sx*cosB,     sinB, 0.0, 0.0,
          -sinB, Sy*-cosB, 0.0, 0.0,
            0.0,      0.0,  Sz, 0.0,
          Tx,          Ty,  Tz, 1.0
    ]);

    //����ת�������������ɫ��
    var u_xformMatrix = gl.getUniformLocation(gl.program, 'u_xformMatrix');
    if (u_xformMatrix < 0) {
        console.log('Failed to get the storage location of u_xformMatrix');
        return;
    }
    gl.uniformMatrix4fv(u_xformMatrix, false, xformMatrix);

    // Set clear color
    gl.clearColor(0.5, 0.5, 0.5, 1.0);

    // ��� <canvas>
    gl.clear(gl.COLOR_BUFFER_BIT);

    //����������
    gl.drawArrays(gl.TRIANGLES, 0, n);//n is 3
}

function initVertexBuffers(gl) {
    var verticesColors = new Float32Array([
        //��������͵����ɫ
        0.0,  0.5, 1.0, 0.0, 0.0,
       -0.5, -0.5, 0.0, 1.0, 0.0, 
        0.5, -0.5, 0.0, 0.0, 1.0
    ]);
    var n = 3;//��ĸ���

    //��������������
    var vertexBuffer = gl.createBuffer();
    var vertexColorBuffer = gl.createBuffer();

    //������������󶨵�Ŀ��
    gl.bindBuffer(gl.ARRAY_BUFFER, vertexBuffer);
    gl.bindBuffer(gl.ARRAY_BUFFER, vertexColorBuffer);
    //�򻺳���������д������
    gl.bufferData(gl.ARRAY_BUFFER, verticesColors, gl.STATIC_DRAW);

    var FSIZE = verticesColors.BYTES_PER_ELEMENT;
    //��ȡattribute�����Ĵ���λ��
    var a_Position = gl.getAttribLocation(gl.program, 'a_Position');
    if (a_Position < 0) {
        console.log('Failed to get the storage location of a_Position');
        return;
    }
    //����������������a_Position����
    gl.vertexAttribPointer(a_Position, 2, gl.FLOAT, false, FSIZE*5, 0);
    //����a_Position�������������Ļ���������
    gl.enableVertexAttribArray(a_Position);

    var a_Color = gl.getAttribLocation(gl.program, "a_Color");
    if (a_Color < 0) {
        console.log('Failed to get the storage location of a_Color');
        return;
    }
    gl.vertexAttribPointer(a_Color, 3, gl.FLOAT, false, FSIZE * 5, FSIZE * 2);
    gl.enableVertexAttribArray(a_Color);

    return n;
}



// MultiAttributeColorTriangle.js
//������ɫ������
var VSHADER_SOURCE =
    'attribute vec4 a_Position;\n' +  
    'attribute vec4 a_Color;\n' +
    'varying vec4 v_Color;\n' +//varying����
    'uniform float u_CosB,u_SinB;\n'+
    'void main(){\n' +
    'gl_Position.x=a_Position.x*u_CosB-a_Position.y*u_SinB;\n' +
    'gl_Position.y=a_Position.x*u_SinB+a_Position.y*u_CosB;\n' +
    'gl_Position.z=a_Position.z;\n' +
    'gl_Position.w=1.0;\n'+
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

    //����תͼ����������ݴ����������ɫ��
    var radin = Math.PI * ANGLE / 180.0;//תΪ������
    var cosB = Math.cos(radin);
    var sinB = Math.sin(radin);

    var u_CosB = gl.getUniformLocation(gl.program, 'u_CosB');
    var u_SinB = gl.getUniformLocation(gl.program, 'u_SinB');

    gl.uniform1f(u_CosB, cosB);
    gl.uniform1f(u_SinB, sinB);

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
        0.0, 0.5, 1.0, 0.0, 0.0,
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



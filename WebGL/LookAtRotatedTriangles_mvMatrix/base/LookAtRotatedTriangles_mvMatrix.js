// RotatedColoredTriangle_Matrix.js
//������ɫ������
var VSHADER_SOURCE =
    'attribute vec4 a_Position;\n' +  
    'attribute vec4 a_Color;\n' +
    'uniform mat4 u_ModelViewMatrix'
    'varying vec4 v_Color;\n' +//varying����
    'void main(){\n' +
    'gl_Position = u_ModelViewMatrix * a_Position;\n' +
    'v_Color=a_Color;\n'+
    '}\n';

//ƬԪ��ɫ������
var FSHADER_SOURCE =
    'precision mediump float;\n' +
    'varying vec4 v_Color;\n'+
    'void main(){\n' +
    'gl_FragColor = v_Color;\n' +
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

    //���ö���λ�ú���ɫ����ɫ����������ǰ��)
    var n = initVertexBuffers(gl);
    if (n < 0) {
        console.log('Failed to set the position of the vertices');
        return;
    }

    // Set clear color
    gl.clearColor(0.5, 0.5, 0.5, 1.0);

    // ��� <canvas>
    gl.clear(gl.COLOR_BUFFER_BIT);

    //��ȡu_ViewMatrix��u_ModelMatrix�Ĵ洢��ַ
    var u_ModelViewMatrix=gl.getUniformLocation(gl.program,'u_ModelViewMatrix')
    if(u_ModelViewMatrix<0){
        console.log('Failed to get the storage location of u_ViewMatrix');
        return;
    }

    //�����ӵ㡢���ߺ��Ϸ���
    var viewMatrix=new Matrix4();
    viewMatrix.setLookAt(0.25, 0.25, 0.25,  0,0,0, 0,1,0);

    //������ת����
    var modelMatrix=new Matrix4();
    modelMatrix.setRotate(-45,0,0,1);//Χ��z����ת

    //�����������
    var modelViewMatrix=viewMatrix.multiply(modelMatrix);

    //�����󴫸���Ӧ��uniform����
    gl.uniformMatrix4fv(u_ModelViewMatrix,false,modelViewMatrix.elements);

    //����������
    gl.drawArrays(gl.TRIANGLES, 0, n);//n is 3
}

function initVertexBuffers(gl) {
    var verticesColors = new Float32Array([
        //��������͵����ɫ
        0.0,0.5,-0.4,   0.4,1.0,0.4,//��ɫ�������������
        -0.5,-0.5,-0.4, 0.4,1.0,0.4,
        0.5,-0.5,-0.4,  0.4,1.0,0.4,

        0.5,0.4,-0.2,   1.0,1.0,0.4,//��ɫ���������м�
        -0.5,0.4,-0.2,  1.0,1.0,0.4,
        0.0,-0.6,-0.2,  1.0,1.0,0.4,

        0.0,0.5,0.0,    0.4,0.4,1.0,//��ɫ��������ǰ��
        -0.5,-0.5,0.0,  0.4,0.4,1.0,
        0.5,-0.5,0.0,   0.4,0.4,1.0
    ]);
    var n = 9;//��ĸ���

    //��������������
    var vertexBuffer = gl.createBuffer();
    var vertexColorBuffer = gl.createBuffer();

    //������������󶨵�Ŀ��
    gl.bindBuffer(gl.ARRAY_BUFFER, vertexBuffer);
    gl.bindBuffer(gl.ARRAY_BUFFER, vertexColorBuffer);
    //������д�뻺��������
    gl.bufferData(gl.ARRAY_BUFFER, verticesColors, gl.STATIC_DRAW);

    var FSIZE = verticesColors.BYTES_PER_ELEMENT;
    //��ȡattribute�����Ĵ���λ��
    var a_Position = gl.getAttribLocation(gl.program, 'a_Position');
    if (a_Position < 0) {
        console.log('Failed to get the storage location of a_Position');
        return;
    }
    //����������������a_Position����
    gl.vertexAttribPointer(a_Position, 3, gl.FLOAT, false, FSIZE * 6, 0);
    //����a_Position�������������Ļ���������
    gl.enableVertexAttribArray(a_Position);

    var a_Color = gl.getAttribLocation(gl.program, "a_Color");
    if (a_Color < 0) {
        console.log('Failed to get the storage location of a_Color');
        return;
    }
    gl.vertexAttribPointer(a_Color, 3, gl.FLOAT, false, FSIZE * 6, FSIZE * 3);
    gl.enableVertexAttribArray(a_Color);

    return n;
}



// HelloTriangle.js
//������ɫ������
var VSHADER_SOURCE =
    //x'= x cos b - y sin b
    //y'= x sin b - y cos b
    //z' = z
    'attribute vec4 a_Position;\n' +  
    'uniform float u_CosB, u_SinB;\n'+
    'void main(){\n' +
    'gl_Position.x=a_Position.x*u_CosB-a_Position.y*u_SinB;\n' +
    'gl_Position.y=a_Position.x*u_SinB+a_Position.y*u_CosB;\n' +
    'gl_Position.z=a_Position.z;\n' +
    'gl_Position.w=1.0;\n'+
    '}\n';

//ƬԪ��ɫ������
var FSHADER_SOURCE =
    'void main(){\n' +
    'gl_FragColor = vec4(0.0,0.0,1.0,1.0);\n' +
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
    var radian = Math.PI * ANGLE / 180.0;//תΪ������
    var cosB = Math.cos(radian);
    var sinB = Math.sin(radian);

    var u_CosB = gl.getUniformLocation(gl.program, 'u_CosB');
    if (u_CosB < 0) {
        console.log('Failed to get the storage location of u_CosB');
        return;
    }
    var u_SinB = gl.getUniformLocation(gl.program, 'u_SinB');
    if (u_SinB < 0) {
        console.log('Failed to get the storage location of u_SinB');
        return;
    }

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



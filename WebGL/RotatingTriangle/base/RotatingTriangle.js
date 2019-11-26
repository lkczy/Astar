// RotatedColoredTriangle_Matrix.js
//������ɫ������
var VSHADER_SOURCE =
    'attribute vec4 a_Position;\n' +  
    'uniform mat4 u_ModelMatrix;\n'+
    'attribute vec4 a_Color;\n' +
    'varying vec4 v_Color;\n' +//varying����
    'void main(){\n' +
    'gl_Position = u_ModelMatrix * a_Position;\n' +
    'v_Color=a_Color;\n'+
    '}\n';

//ƬԪ��ɫ������
var FSHADER_SOURCE =
    'precision mediump float;\n' +
    'varying vec4 v_Color;\n'+
    'void main(){\n' +
    'gl_FragColor = v_Color;\n' +
    '}\n';

//��ת�ٶȣ���/��)
var ANGLE_STEP = 5.0;

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

    //����<canvas>����ɫ
    gl.clearColor(0.5, 0.5, 0.5, 1.0);

    //��ȡu_ModelMatrix�����Ĵ���λ��
    var u_ModelMatrix = gl.getUniformLocation(gl.program, 'u_ModelMatrix');
    if (u_ModelMatrix < 0) {
        console.log('Failed to get the storage location of u_ModelMatrix');
        return;
    }

    //�����εĵ�ǰ��ת�Ƕ�
    var currentAngle = 0.0;
    //ģ�;���Matrix4����
    var modelMatrix = new Matrix4;

    //��ʼ����������
    var tick = function () {
        currentAngle = animate(currentAngle);//������ת��
        draw(gl, n, currentAngle, modelMatrix, u_ModelMatrix);//�����һ�������Σ�������һ��������
        requestAnimationFrame(tick);//�������������tick
    };
    tick();
}

function initVertexBuffers(gl) {
    var verticesColors = new Float32Array([
        //��������͵����ɫ
        0.0,  Math.sqrt(3)/3, 1.0, 0.0, 0.0,
       -0.5, -Math.sqrt(3)/6, 0.0, 1.0, 0.0, 
        0.5, -Math.sqrt(3)/6, 0.0, 0.0, 1.0
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

function draw(gl, n, currentAngle, modelMatrix, u_ModelMatrix) {
    //������ת����
    modelMatrix.setRotate(-currentAngle, 0, 0, 1);

    //����ת�������������ɫ��
    gl.uniformMatrix4fv(u_ModelMatrix, false, modelMatrix.elements);

    //���<canvas>
    gl.clear(gl.COLOR_BUFFER_BIT);

    //����������
    gl.drawArrays(gl.TRIANGLES, 0, n);
}

//��¼��һ�ε��ú�����ʱ��
var g_last = Date.now();
function animate(angle) {
    //��������ϴε��þ����˶���ʱ��
    var now = Date.now();
    var elapsed = now - g_last;//����
    g_last = now;
    //���ݾ����ϴε��õ�ʱ�䣬���µ�ǰ��ת�Ƕ�
    var newAngle = angle + (ANGLE_STEP * elapsed) / 1000.0;
    return newAngle %= 360;

}

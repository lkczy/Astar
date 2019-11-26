// TexturedQuad.js
//������ɫ������
var VSHADER_SOURCE =
    'attribute vec4 a_Position;\n' +  
    'attribute vec2 a_TexCoord;\n'+
    'varying vec2 v_TexCoord;\n'+
    'void main(){\n' +
    'gl_Position=a_Position;\n' +
    'v_TexCoord = a_TexCoord;\n'+
    '}\n';

//ƬԪ��ɫ������
    var FSHADER_SOURCE =
    'precision mediump float;\n' +
    'uniform sampler2D u_Sampler;\n' +
    'varying vec2 v_TexCoord;\n' +
    'void main(){\n' +
    'gl_FragColor = texture2D(u_Sampler,v_TexCoord);\n' +
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


    //���ö�����Ϣ
    var n = initVertexBuffers(gl);
    if (n < 0) {
        console.log('Failed to set the position of the vertices');
        return;
    }

    // Set clear color
    gl.clearColor(0.5, 0.5, 0.5, 1.0);

    //����������ʼ������
    if(!initTextures(gl,n)){
        console.log('Failed to set the position of the texture');
        return;
    }
}

function initVertexBuffers(gl) {
    var verticesTexCoords = new Float32Array([
        //�������꣬��������
        -0.5,  0.5,   0.0,2.0,
        -0.5, -0.5,   0.0,0.0,
         0.5,  0.5,   2.0,2.0,
         0.5, -0.5,   2.0,0.0
    ]);
    var n = 4;//������Ŀ

    //��������������
    var verticesTexCoordBuffer = gl.createBuffer();
    if (!verticesTexCoordBuffer) {
        console.log('Failed to create the buffer object');
        return;
    }

    //������������󶨵�Ŀ��
    gl.bindBuffer(gl.ARRAY_BUFFER, verticesTexCoordBuffer);
    //�򻺳���������д������
    gl.bufferData(gl.ARRAY_BUFFER, verticesTexCoords, gl.STATIC_DRAW);
    //��ȡattribute�����Ĵ���λ��

    var FSIZE = verticesTexCoords.BYTES_PER_ELEMENT;

    var a_Position = gl.getAttribLocation(gl.program, 'a_Position');
    if (a_Position < 0) {
        console.log('Failed to get the storage location of a_Position');
        return;
    }
    //����������������a_Position����
    gl.vertexAttribPointer(a_Position, 2, gl.FLOAT, false, FSIZE*4, 0);
    //����a_Position�������������Ļ���������
    gl.enableVertexAttribArray(a_Position);

    //��������������a_TexCoord������
    var a_TexCoord=gl.getAttribLocation(gl.program,'a_TexCoord');
    if(a_TexCoord<0){
        console.log('Failed to get the storage location of a_TexCoord');
        return;
    }
    gl.vertexAttribPointer(a_TexCoord,2,gl.FLOAT,false,FSIZE*4,FSIZE*2);
    gl.enableVertexAttribArray(a_TexCoord);

    return n;
}

function initTextures(gl,n){
    var texture =gl.createTexture();//�����������
    if(!texture){
        console.log('Failed to create the texture object');
        return;
    }

    //��ȡu_Sampler
    var u_Sampler=gl.getUniformLocation(gl.program,'u_Sampler');
    if(!u_Sampler){
        console.log('Failed to get the storage location of u_Sampler');
        return false;
    }

    var image = new Image();//����һ��image����
    if (!image) {
        console.log('Failed to create the image object');
        return false;
    }
    //ע��ͼ������¼�����Ӧ����
    image.onload=function(){loadTexture(gl,n,texture,u_Sampler,image);};
    //�������ʼ����ͼ��
    image.src='../resources/sky.jpg';

    return true;
}

function loadTexture(gl,n,texture,u_Sampler,image){
    gl.pixelStorei(gl.UNPACK_FLIP_Y_WEBGL, 1);//������ͼ�����y�ᷴת
    //����0������Ԫ
    gl.activeTexture(gl.TEXTURE0);
    //��target���������
    gl.bindTexture(gl.TEXTURE_2D, texture);

    //�����������
    gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MIN_FILTER, gl.LINEAR);
    //��������ͼ��
    gl.texImage2D(gl.TEXTURE_2D, 0, gl.RGB, gl.RGB, gl.UNSIGNED_BYTE, image);

    //��0�������ݸ���ɫ��
    gl.uniform1i(u_Sampler, 0);

    gl.clear(gl.COLOR_BUFFER_BIT);   //��� <canvas>

    gl.drawArrays(gl.TRIANGLE_STRIP, 0, n); // ���Ƴ�������
}



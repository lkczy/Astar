//drawRectangle
function main() {
    //��ȡ<canvas>Ԫ��
    var canvas = document.getElementById("example");
    if (!canvas) {
        console.log('Failed to retrieve the <canvas> element');
        return;
    }

    //��ȡ���ƶ�άͼ�εĻ�ͼ������
    var ctx = canvas.getContext("2d");
    
    //������ɫ����
    ctx.fillStyle = 'rgba(0,0,255,1.0)';
    ctx.fillRect(120, 10, 150, 150);
}
// Declarações dos elementos usando DOM (Document Object Model)
const videoElemento = document.getElementById("video");
const botaoScanner = document.getElementById("btn-texto");
const resultado = document.getElementById("saida");
const canvas = document.getElementById("canvas");



// Função assíncrona para habilitar a câmera
async function configuraCamera(){
// Tratamento de erros
    try{
        // Chama a API do navegador para solicitar acesso
        const midia = await navigator.mediaDevices.getUserMedia({
            // Habilita a câmera traseira
            video:{facingMode: "environment"},
            // O áudio não sera capturado
            audio: false
        })
        // Recebe a função midia para ser executada
        videoElemento.srcObject = midia;
        // Força a reprodução do vídeo
        videoElemento.play();
    }catch(erro){
        resultado.innerText="Erro ao acessar a câmera", erro;
    }
}

// Executando a função
configuraCamera()

// Função para capturar o texto da câmera
botaoScanner.onclick = async ()=>{
    botaoScanner.disabled = true // Habilitando a câmera
    resultado.innerText="Fazendo a leitura do texto... aguarde";

    // Define o canvas para iniciar a leitura
    const contexto = canvas.getContext("2d");


    // Ajusta o tamanho do canvas para o tamanho real do vídeo
    canvas.width = videoElemento.videoWidth;
    canvas.height = videoElemento.videoHeight;

    // Aplica o filtro para melhorar o OCR
    contexto.filter = "contrast(1.2) grayscale(1)";

    // Desenha o vídeo no canvas
    contexto.drawImage(videoElemento,0,0,canvas.width,canvas.height);

    try{
        const {data: { text }} = await Tesseract.recognize(
            canvas,
            'por'   // Define o idioma
        );
        // Remove os espaços em branco
        const textoFinal = text.trim();
        // Estrutura condicional ternária ? = if, : = else
        resultado.innerText = textoFinal.length > 0 ? textoFinal: "Não foi possível identificar o texto"
    }catch(erro){
        resultado.innerText = "Erro no processamento",erro;
    }
    finally{
        botaoScanner.disabled = false;  // Desabilita o botão para fazer nova captura
    }
}
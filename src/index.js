/// ------ CONFIGS INICIAIS  DO EXPresponseS ---------
import express from 'express'
import cors  from 'cors'
import bcrypt from 'bcrypt'

const app = express()

app.use(cors())

app.use(express.json())


//------------------------

let carros = []   //Criamos um array que armazenará os veículos
let pessoas = [] //Criamos um array que armazene as pessoas usuarias
let proximoId = 1  // Criamos uma variável que vai automatizar a criação dos ids
let proximoUserId = 1

/* 

  Dados do carro : modelo, marca, ano, cor e preço.

*/

//-------------------- CRIAR carro -------------------------

app.post('/carros',(request,response)=>{

    // Pegamos os dados no corpo da requestuisição
    const modeloDocarro = request.body.modeloDocarro
    const marcaCarro = request.body.marcaCarro
    const anoDoCarro = Number(request.body.anoDoCarro)
    const corDoCarro = request.body.corDoCarro
    const precoDoCarro = Number(request.body.precoDoCarro)

    // Verificamos se a pessoa passou o modelo do Carro. Caso não tenha passado, retorna uma responseposta
    if (!modeloDocarro) {
        response.status(400).send(JSON.stringify({
            Mensagem: 'Passe um modelo válido para registrar o seu carro'
        }))
    }

    // Verificamos se a pessoa passou a marca do Carro. Caso não tenha passado, retorna uma responseposta
    if (!marcaCarro) {
      response.status(400).send(JSON.stringify({
          Mensagem: 'Passe uma marca válida para registrar o seu carro '
      }))
    }

    // Verificamos se a pessoa passou a cor do Carro. Caso não tenha passado, retorna uma responseposta
    if (!corDoCarro) {
      response.status(400).send(JSON.stringify({
          Mensagem: 'Passe uma cor válida para registrar o seu carro '
      }))
    }

    // Verificamos se a pessoa passou o ano do Carro Caso não tenha passado, retorna uma responseposta
    if (!anoDoCarro) {
      response.status(400).send(JSON.stringify({
          Mensagem: 'Passe um ano válido para registrar o seu carro. O ano deve conter 4 digitos'
      }))
    }

    // Verificamos se a pessoa passou o preço da carro. Caso não tenha passado, retorna uma responseposta
    if(!precoDoCarro){
        response.status(400).send(JSON.stringify({
            Mensagem: 'Passe um preço válido para registrar o seu carro'
        }))
    }

    //Cria um novo carro com os valoresponse passados
    let novoCarro ={
        id: proximoId,
        modeloDocarro:modeloDocarro, 
        marcaCarro:marcaCarro,
        anoDoCarro:anoDoCarro,
        corDoCarro:corDoCarro,
        precoDoCarro:precoDoCarro,
    }

    //Colocamos essa nova carro dentro do array
    carros.push(novoCarro)

    // Adicionamos um ao Id, cada vez que cria um novo produto
    proximoId ++

    //Damos a responseposta para a pessoa usuária, usamos o status 201 pois é um recurso criado
    response.status(201).send(`
    Carro - ${novoCarro.modeloDocarro} criado com sucesso!
    Marca: ${novoCarro.marcaCarro}, 
    Ano do Carro : ${novoCarro.anoDoCarro},
    Cor do Carro :  ${novoCarro.corDoCarro},  
    Preço: ${novoCarro.precoDoCarro}, `
    )

})

//-------------------- LER CARRO -------------------------

app.get('/carros', (request, response) => {
    if (carros.length === 0) {
      // Se a lista de carros estiver vazia, retorna uma mensagem indicando isso.
      return response.status(400).send(JSON.stringify({
        Mensagem: 'Lista vazia, adicione carros para consultar',
      }))
    }
  
    // Cria um array de strings contendo as informações de cada carro, para assim conseguir manipular os dados 
    const dadosMapeados = carros.map((carro) => `Carro: ${carro.modeloDocarro} - Marca: ${carro.marcaCarro} -  Cor : ${carro.corDoCarro} - Preço: ${carro.precoDoCarro}`)
  
    // Envia uma responseposta de status 200 (OK) com a lista de informações dos carros. Captamos os dados que foram mapeados e tratados
    response.status(200).send({
      carros: dadosMapeados,
    })
})


//-------------------- FILTRAR CARRO ---------------------------

app.get ('/carros/:modeloDocarro',(request, response) => {
  //Pegamos o modelo do carro via parametro de requisicao
  const modeloDocarro= request.params.modeloDocarro

  //Verificamos se o carro que estamos passando via url , e comparamos os valores
  const carrosVerificados = carros.find(carro => carro.modeloDocarro === modeloDocarro ) 

  //Se não encontrar o dado do carro no banco retorna uma mensagem
  if(!carrosVerificados){
      response.status(404).json({
          sucess: false,
          message: "Modelo de carro não encontrado no banco"
      })
  }

  //Se encontrar o carro a aplicação retorna o carro que é condizente com o desejado.
  response.status(201).json({
      sucess: true,
      data: carros
  })

})

//-------------------- ATUALIZAR CARRO -------------------------

app.put('/carros/:idBuscado', (request, response) => {
    const idBuscado = Number(request.params.idBuscado);

    if (!idBuscado) {
        return response.status(400).send({ mensagem: 'Insira um ID válido' });
    }

    const carroAtualizado = carros.find(carro => carro.id === parseInt(idBuscado));

    if (!carroAtualizado) {
        return response.status(404).json({ success: false, message: "Carro não encontrado no banco" });
    }

    const novaCor = request.body.novaCor;
    const novoPreco = request.body.novoPreco;

    if (!novaCor && !novoPreco) {
        return response.status(400).send({ mensagem: 'Passe uma nova cor ou um novo preço válido para atualizar o seu carro' });
    }

    if (novaCor) {
        carroAtualizado.corDoCarro = novaCor;
    }

    if (novoPreco) {
        carroAtualizado.precoDoCarro = novoPreco;
    }

    response.status(200).send({ mensagem: 'Carro atualizado com sucesso!', carro: carroAtualizado });
});

//-------------------- REMOVER CARRO -------------------------

app.delete('/carros/:idBuscado',(request,response)=>{
    const idBuscado = Number(request.params.idBuscado)
  
    if(!idBuscado){
      return response
          .status(400)
          .send(JSON.stringify({ Mensagem: "Favor enviar um ID válido" }))
    }
  
    const posicaoCarroExcluido = carros.findIndex(carro => carro.id === idBuscado)
  
    if(posicaoCarroExcluido  === -1){
      return response
          .status(400)
          .send(JSON.stringify({ Mensagem: "Id não encontrado" }))
    }else{
      carros.splice(posicaoCarroExcluido, 1)
      response
      .status(200)
      .send(JSON.stringify({ Mensagem: "Carro excluído com sucesso" }))
    }
  
  })

//-------------------- CRIAR USUÁRIO -------------------------

app.post('/usuarios', async (request, response) => {

    const nomePessoa = request.body.nomePessoa;
    const emailPessoa = request.body.emailPessoa;
    const senhaPessoa = request.body.senhaPessoa;

    if(!nomePessoa){
        return response
          .status(400)
          .send(JSON.stringify({ Mensagem: "Favor cadastrar um nome válido" }))
    }

    if(!emailPessoa){
        return response
          .status(400)
          .send(JSON.stringify({ Mensagem: "Favor cadastrar um email válido" }))
    }

    if(!senhaPessoa){
        return response
          .status(400)
          .send(JSON.stringify({ Mensagem: "Favor cadastrar uma senha válida" }))
    }

    const senhaCriptografada = await bcrypt.hash(senhaPessoa, 10)

    let novoUsuario ={
        id: proximoUserId,
        nomePessoa: nomePessoa,
        emailPessoa: emailPessoa,
        senhaPessoa: senhaCriptografada,
    }

    pessoas.push(novoUsuario)

    proximoUserId ++

    response.status(201).send({ mensagem: 'Usuário criado com suceso!', pessoas })

})

//-------------------- LOGAR USUÁRIO -------------------------

app.post('/login', async (request, response) => {
    const email = request.body.email;
    const senha = request.body.senha;

    if (!email) {
        return response
            .status(400)
            .send(JSON.stringify({ Mensagem: "Favor inserir um email válido" }));
    }

    if (!senha) {
        return response
            .status(400)
            .send(JSON.stringify({ Mensagem: "Favor inserir uma senha válida" }));
    }

    const usuarioEncontrado = pessoas.find(usuario => usuario.emailPessoa === email);

    if (!usuarioEncontrado) {
        return response
            .status(404)
            .send(JSON.stringify({ Mensagem: "Usuário não encontrado" }));
    }

    const senhaMatch = await bcrypt.compare(senha, usuarioEncontrado.senhaPessoa);

    if (!senhaMatch) {
        return response
            .status(401)
            .send(JSON.stringify({ Mensagem: "Credenciais inválidas" }));
    }

    response.status(200).send(JSON.stringify({ Mensagem: `Login executado com sucesso. Bem-vindo!` }));
});

//-------------------- VERIFICAR API  -------------------------


app.listen(8080, () => console.log("Servidor iniciado na porta 8080"))
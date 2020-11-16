const { strict } = require('assert')
const { execFile } = require('child_process')
const fs = require('fs')
const { remote, ipcRenderer } = require('electron')
const path = require('path')
const spawn = require('child_process').spawnSync
const user = document.getElementById('user')
const hostName = document.getElementById('host')
const hd = document.getElementById('hd')
const crai = document.querySelector('#crai')
const comarca = document.getElementById('comarca')
const itens = { dados: [] }


/* Captura de informações do micro 

spawn('wscript.exe', [path.join(__dirname, 'scriptIvent.vbs')])


fs.readFile(path.join(__dirname, 'users.json'), 'utf-8', function (err, data) {
    if(err) throw err;
    const obj = JSON.parse(data)
    
    obj.usuarios.map(({usuario, host, hardDisk}) => addElement({usuario, host, hardDisk}))
    
});

function addElement({usuario, host, hardDisk}) {
    user.value = usuario
    hostName.value = host
    hd.value = hardDisk
} 

*/



function salvaDados(dados) {

    fs.readFile(path.join(__dirname, 'itens.json'), 'utf-8', function (err, data) {
        if (err) throw err;

        if (data !== "") {
            const obj = JSON.parse(data)
            obj.dados.push(dados)
            fs.writeFile(path.join(__dirname, 'itens.json'), JSON.stringify(obj, null, 4), 'utf-8', err => {
                if (err) throw err
            })
            showModal('modal-alert', 'Dados salvos com sucesso!', 'assets/ok.png')
        } else {
            itens.dados.push(dados)
            fs.appendFile(path.join(__dirname, 'itens.json'), JSON.stringify(itens, null, 4), 'utf-8', err => {
                if (err) throw err
            })

        }
    })
}

// Chamando segunda tela
function openModal() {
    ipcRenderer.send('showModal')
}


const craai = [
    AngraDosReis = {
        comarcas: ['Angra dos Reis - Sede', 'Mangaratiba', 'Paraty']
    },

    BarraDoPirai = {
        comarcas: ['Barra do Piraí - Sede', 'Engenheiro Paulo de Frontin', 'Mendes', 'Miguel Pereira',
            'Paty do Alferes', 'Piraí', 'Rio das Flores', 'Valença', 'Vassouras']
    },

    CaboFrio = {
        comarcas: ['Araruama', 'Armação dos Búzios', 'Arraial do Cabo', 'Saquarema',
            'Cabo Frio - Sede', 'Iguaba Grande', 'São Pedro da Aldeia']
    },

    Campos = {
        comarcas: ['Campos dos Goytacazes - Sede', 'São Fidélis', 'São Francisco do Itabapoana', 'São João da Barra']
    },

    Caxias = {
        comarcas: ['Belford Roxo', 'Duque de Caxias - Sede', 'Magé / Vila Inhomirim', 'São João de Meriti']
    },

    Itaperuna = {
        comarcas: ['Bom Jesus de Itabapoana', 'Cambuci', 'Italva / Cardoso Moreira', 'Itaocara', 'Itaperuna - Sede',
            'Laje do Muriaé', 'Miracema', 'Natividade', 'Porciúncula', 'Santo Antonio de Pádua']
    },

    Macaé = {
        comarcas: ['Casimiro de Abreu', 'Conceição de Macabu', 'Macaé - Sede',
            'Carapebus / Quissamã', 'Rio das Ostras', 'Silva Jardim']
    },

    Niterói = {
        comarcas: ['Maricá', 'Niterói - Sede']
    },

    Friburgo = {
        comarcas: ['Bom Jardim', 'Cachoeiras do Macacu', 'Cantagalo', 'Cordeiro', 'Duas Barras',
            'Nova Friburgo - Sede', 'Santa Maria Madalena', 'São Sebastião do Alto', 'Trajano de Moraes']
    },

    NovaIguacu = {
        comarcas: ['Itaguaí', 'Japeri', 'Nilópolis', 'Nova Iguaçu - Sede', 'Paracambi',
            'Queimados', 'Seropédica']
    },

    Petropolis = {
        comarcas: ['Paraíba do Sul', 'Petrópolis - Sede', 'São José do Vale do Rio Preto / Itaipava', 'Três Rios']
    },

    Rio = {
        comarcas: ['Bangu', 'Barra da Tijuca', 'Botafogo', 'Centro', 'Campo Grande', 'Ilha do Governador',
            'Jacarepaguá', 'Leblon', 'Leopoldina', 'Madureira', 'Méier', 'Olaria', 'Pavuna', 'Penha',
            'Santa Cruz', 'Sede']
    },

    SãoGoncalo = {
        comarcas: ['Itaboraí', 'Rio Bonito', 'São Gonçalo - Sede']
    },

    Teresopolis = {
        comarcas: ['Carmo', 'Guapimirim', 'Sapucaia', 'Sumidouro', 'Teresópolis - Sede']
    },

    VoltaRedonda = {
        comarcas: ['Barra Mansa', 'Itatiaia', 'Pinheiral', 'Porto Real / Quatis',
            'Resende', 'Rio Claro', 'Volta Redonda - Sede']
    }
]

function getCrai() {

    let craiSelected = crai.options[crai.selectedIndex].value
    return craiSelected

}

function resetListComarca() {

    let arrayComarca = []

    for (let item = 0; item < comarca.options.length; item++) {
        arrayComarca.push(comarca.options[item])
    }

    arrayComarca.forEach((el) => {
        comarca.removeChild(el)
    })
}

function setComarca() {

    let craiSelected = getCrai()
    let listComarca = craai[craiSelected].comarcas
    resetListComarca()

    for (let el in listComarca) {
        let option = document.createElement('option')
        option.innerHTML = listComarca[el]
        comarca.appendChild(option)
    }
}



function getInputs() {

    let crai = document.getElementById('crai').value
    const comarca = document.getElementById('comarca').value
    const inputs = document.querySelectorAll('input')
    const craiOpts = document.querySelectorAll('#crai > *')
    const craiList = []
    let id = 0

    // Criando array com os nomes dos craais
    for (let i in craiOpts) {
        if (craiOpts.hasOwnProperty(i)) {
            craiList.push(craiOpts[i].innerHTML)
        }
    }

    crai = parseInt(crai)
    const inputsValue = [craiList[crai], comarca]

    // Pegando todos os inputs
    for (let el in inputs) {
        if (inputs.hasOwnProperty(el)) {
            inputsValue.push(inputs[el].value)
        }
    }

    // Validando os inputs
    for (let el in inputsValue) {
        if (inputsValue[el] == null || inputsValue[el] == '') {
            showModal('modal-alert', 'Favor preencher todos os campos!', 'assets/erro.png')
            return
        }
    }


    fs.readFile(path.join(__dirname, 'itens.json'), 'utf-8', function (err, data) {
        if (err) throw err;

        if (data == '' || data == null || data == undefined) {

            let hd = parseInt(inputsValue[4])
            hd = hd.toLocaleString('pt-br')

            let ram = parseInt(inputsValue[6])
            ram = ram.toLocaleString('pt-br')

            const dados = {
                id: 1,
                crai: inputsValue[0],
                comarca: inputsValue[1],
                orgao: inputsValue[2],
                sistema: inputsValue[3],
                hd: hd,
                user: inputsValue[5],
                ram: ram,
                host: inputsValue[7],
                estab: inputsValue[8],
                leitor: inputsValue[9],
                leitor2: inputsValue[10],
                monitor: inputsValue[11],
                monitor2: inputsValue[12],
                impressora: inputsValue[13],
                impEtiqueta: inputsValue[14],
                impFiscal: inputsValue[15]
            }
            
            salvaDados(dados)

        } else {
            const obj = JSON.parse(data)
            id = obj.dados.length + 1

            let hd = parseInt(inputsValue[4])
            hd = hd.toLocaleString('pt-br')

            let ram = parseInt(inputsValue[6])
            ram = ram.toLocaleString('pt-br')

            const dados = {
                id: id,
                crai: inputsValue[0],
                comarca: inputsValue[1],
                orgao: inputsValue[2],
                sistema: inputsValue[3],
                hd: hd,
                user: inputsValue[5],
                ram: ram,
                host: inputsValue[7],
                estab: inputsValue[8],
                leitor: inputsValue[9],
                leitor2: inputsValue[10],
                monitor: inputsValue[11],
                monitor2: inputsValue[12],
                impressora: inputsValue[13],
                impEtiqueta: inputsValue[14],
                impFiscal: inputsValue[15]
            }

            salvaDados(dados)
        }

    })
}

// Modal reutilizável
function showModal(idModal, msg, src) {
    const modal = document.getElementById(idModal)
    const text = document.querySelector('.modal-text')
    const img = document.querySelector('img')
    modal.classList.add('show')
    text.textContent = msg
    img.src = src

    const close = document.querySelector('.close')
    close.addEventListener('click', () => {
        modal.classList.remove('show')
    })
}







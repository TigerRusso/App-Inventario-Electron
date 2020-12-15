const fs = require('fs');
const os = require('os');
const si = require('systeminformation')
const { remote, ipcRenderer } = require('electron')
const path = require('path')
const crai = document.querySelector('#crai')
const comarca = document.getElementById('comarca')
const itens = { dados: [] }





function minimizar() {
    const win = remote.getCurrentWindow()
    win.minimize()
}

function fechar() {
    const win = remote.getCurrentWindow()
    win.close()
}

// Teste Stream
/*
function goStream() {
    let data = '' 
    const readStream = fs.createReadStream(path.join(__dirname, 'itens.json')).setEncoding('utf-8')
    readStream.on('data', chunk => {
        data += chunk
    })

    readStream.on('end', () => {
        data = JSON.parse(data)
        console.log(data)
    })
} */

// Fim Teste Stream

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
            showModal('modal-alert', 'Dados salvos com sucesso!', 'assets/ok.png')
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

function getInfoSistem() {
    let sis = document.getElementById('sistema')
    let ram = document.getElementById('ram')
    let host = document.getElementById('host')
    let hd = document.getElementById('hd')
    let disk = []
    let hdisk = 0
    
    ram.value = Math.round((os.totalmem() / 1048576))
    host.value = os.hostname()
    si.osInfo().then(data => {        
        sis.value = `${data.distro} ${data.arch}`
    })
    
    si.blockDevices().then(data => {
        data.map(item => {
            if (item.physical == 'Local') {
                disk.push(parseInt(item.size))
            }
        })
        for (let i = 0; i < disk.length; i++) {
            hdisk += disk[i]
        }
        hd.value = Math.round(hdisk / 1048576)
    })
}

function getInputs() {

    let crai = document.getElementById('crai').value
    const comarca = document.getElementById('comarca').value
    const tipoUser = document.getElementById('tipo-user').value
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
    const inputsValue = [craiList[crai], comarca, tipoUser]

    // Pegando todos os inputs
    for (let el in inputs) {
        if (inputs.hasOwnProperty(el)) {
            inputsValue.push(inputs[el].value)
        }
    }
    console.log(inputsValue)
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

            let hd = parseInt(inputsValue[10])
            hd = hd.toLocaleString('pt-br')

            let ram = parseInt(inputsValue[11])
            ram = ram.toLocaleString('pt-br')

            //let sistema = `Windows ${os.arch}`
            //inputsValue[].innerHTML = sistema

            const dados = {
                id: 1,
                crai: inputsValue[0],
                comarca: inputsValue[1],
                endereco: inputsValue[3],
                orgao: inputsValue[4],
                user: inputsValue[5],  
                matricula: inputsValue[6],
                tipoUser: inputsValue[2],
                host: inputsValue[7], 
                modeloHost: inputsValue[8],
                sistema: inputsValue[9],
                hd: hd,
                ram: ram,   
                monitor: inputsValue[12],
                modeloMonitor: inputsValue[13],
                monitor2: inputsValue[14],  
                modeloMonitor2: inputsValue[15],        
                estab: inputsValue[16],
                modeloEstab: inputsValue[17],               
                impressora: inputsValue[18],
                modeloImpressora: inputsValue[19],                
                impEtiqueta: inputsValue[20],
                modeloImpEtiqueta: inputsValue[21],
                impFiscal: inputsValue[22],
                modeloImpFiscal: inputsValue[23],
                leitor: inputsValue[24],
                modeloLeitor: inputsValue[25],
                scanner: inputsValue[26],
                modeloScanner: inputsValue[27],
                periferico: inputsValue[28],
                modeloPeriferico: inputsValue[29],
                notas: inputsValue[30]
            }

            salvaDados(dados)

        } else {
            const obj = JSON.parse(data)
            id = obj.dados.length + 1

            let hd = parseInt(inputsValue[10])
            hd = hd.toLocaleString('pt-br')
            
            let ram = parseInt(inputsValue[11])
            ram = ram.toLocaleString('pt-br')

            //let sistema = `Windows ${os.arch}`
            //inputsValue[4].innerHTML = sistema

            const dados = {
                id: id,
                crai: inputsValue[0],
                comarca: inputsValue[1],
                endereco: inputsValue[3],
                orgao: inputsValue[4],
                user: inputsValue[5],  
                matricula: inputsValue[6],
                tipoUser: inputsValue[2],
                host: inputsValue[7], 
                modeloHost: inputsValue[8],
                sistema: inputsValue[9],
                hd: hd,
                ram: ram,   
                monitor: inputsValue[12],
                modeloMonitor: inputsValue[13],
                monitor2: inputsValue[14],  
                modeloMonitor2: inputsValue[15],        
                estab: inputsValue[16],
                modeloEstab: inputsValue[17],               
                impressora: inputsValue[18],
                modeloImpressora: inputsValue[19],                
                impEtiqueta: inputsValue[20],
                modeloImpEtiqueta: inputsValue[21],
                impFiscal: inputsValue[22],
                modeloImpFiscal: inputsValue[23],
                leitor: inputsValue[24],
                modeloLeitor: inputsValue[25],
                scanner: inputsValue[26],
                modeloScanner: inputsValue[27],
                periferico: inputsValue[28],
                modeloPeriferico: inputsValue[29],
                notas: inputsValue[30]
            }

            salvaDados(dados)
            
        }
       
    })
    
}

// Modal reutilizável
function showModal(idModal, msg, src) {
    const modal = document.getElementById(idModal)
    const text = document.querySelector('.modal-text')
    const img = document.getElementById('img')
    modal.classList.add('show')
    text.textContent = msg
    img.src = src

    const close = document.querySelector('.close')
    close.addEventListener('click', () => {
        modal.classList.remove('show')

        if (msg  == 'Dados salvos com sucesso!')
            document.location.reload(true)
    })
}








// Scrips da tela de listagem de itens

const fs = require('fs')
const path = require('path')
const { remote } = require('electron')
const dialog = remote.dialog

// polyfills required by exceljs
require('core-js/modules/es.promise')
require('core-js/modules/es.string.includes')
require('core-js/modules/es.object.assign')
require('core-js/modules/es.object.keys')
require('core-js/modules/es.symbol')
require('core-js/modules/es.symbol.async-iterator')
require('regenerator-runtime/runtime')
const excel = require('exceljs/dist/es5')


const body = document.getElementById('full-table')
body.onload = () => {
    listItens()
}

// Funções do frame app
function minimizar() {
    const win = remote.getCurrentWindow()
    win.minimize()
}

function maximizar() {
    const win = remote.getCurrentWindow()
    if (!win.isMaximized()) {
        win.maximize()
    } else {
        win.unmaximize()
    }
}

function fechar() {
    const win = remote.getCurrentWindow()
    win.close()
}

// Forçando barra de títulos fixada
const container = document.querySelector('.container-table')
container.addEventListener('scroll', () => {
    const barTitle = document.getElementById('bar-top-table-title')
    barTitle.style.left = `-${container.scrollLeft.toString()}px`
})


function listItens() {
    showLoad()
    const tbody = document.querySelector('tbody')    
    let data = ''

    const readStream = fs.createReadStream(path.join(__dirname, 'itens.json')).setEncoding('utf-8')
    readStream.on('data', chunk => {
        data += chunk
    })

    readStream.on('end', () => {

        data = JSON.parse(data)

        for (let i = 0; i < data.dados.length; i++) {
            const tr = document.createElement('tr')
            let cont = 0
            for (let key in data.dados[i]) {
                let td = document.createElement('td')
                td.textContent = data.dados[i][key]
                tr.appendChild(td)

                if (cont == 31) {
                    var btn = document.createElement('button')
                    var img = document.createElement('img')
                    img.src = 'assets/close-btn.png'
                    btn.appendChild(img)
                    btn.classList.add('btn-lixo')
                    let td = document.createElement('td')
                    td.appendChild(btn)
                    tr.appendChild(td)
                }
                cont++
            }
            tbody.appendChild(tr)            
            getID(btn)
        }
        closeLoad()
    })    
}

function deletaLinha(id) {
    
    let data = ''
    const readStream = fs.createReadStream(path.join(__dirname, 'itens.json')).setEncoding('utf-8')
    readStream.on('data', chunk => {
        data += chunk
    })

    readStream.on('end', () => {

        data = JSON.parse(data)

        for (let i = 0; i < data.dados.length; i++) {
            if (id == data.dados[i].id) {
                let index = parseInt(id)
                data.dados.splice((index - 1), 1)

                for (let i = 0; i < data.dados.length; i++) {
                    data.dados[i].id = i + 1
                }

                const writeStream = fs.createWriteStream(path.join(__dirname, 'itens.json'))
                writeStream.write(JSON.stringify(data, null, 4))
                writeStream.end()
                document.location.reload(true)

                return
            }
        }
    })
}

function getID(btn) {

    btn.addEventListener('click', el => {
        let linha = el.path[2]
        linha = linha.childNodes[0]
        let id = linha.innerHTML
        showModal2(id)
    })
}


//Modal pergunta se o usuário tem certeza da ação
function showModal() {
    const modal = document.getElementById("modal-alert")
    modal.classList.add('show')

    const not = document.getElementById('cancela')
    not.addEventListener('click', () => {
        modal.classList.remove('show')
    })
}

function showModal2(id) {
    const modal = document.getElementById("modal-alert2")
    modal.classList.add('show')
    const not = document.getElementById('not')
    not.addEventListener('click', () => {
        modal.classList.remove('show')
    })
    const ok = document.getElementById('ok')
    ok.addEventListener('click', () => {
        modal.classList.remove('show') 
        showLoad()
        deletaLinha(id)               
    })
}

// Show loading 
function showLoad() {
    const load = document.querySelector('.load')
    load.classList.add('show')
}

function closeLoad() {
    const load = document.querySelector('.load')
    load.classList.remove('show')
}


function excluirLista() {
    let data = ''

    const readStream = fs.createReadStream(path.join(__dirname, 'itens.json')).setEncoding('utf-8')
    readStream.on('data', chunk => {
        data += chunk
    })

    readStream.on('end', () => {

        data = JSON.parse(data)
        data.dados.splice(0, data.dados.length)

        const writeStream = fs.createWriteStream(path.join(__dirname, 'itens.json'))
        writeStream.write(JSON.stringify(data, null, 4))
        writeStream.end()
        document.location.reload(true)

    })
}

function exportarExcel() {

    fs.readFile(path.join(__dirname, 'itens.json'), 'utf-8', (err, data) => {
        if (err) throw err

        const obj = JSON.parse(data)
        const dados = obj.dados
        const workbook = new excel.Workbook()
        const worksheet = workbook.addWorksheet('Inventário')

        // Definindo os cabeçalhos do Excel
        worksheet.columns = [
            { header: 'CRAAI', key: 'crai' },
            { header: 'Comarca', key: 'comarca' },
            { header: 'Endereço', key: 'endereco' },
            { header: 'Órgão', key: 'orgao' },
            { header: 'Usuário', key: 'user' },
            { header: 'Matrícula', key: 'matricula' },
            { header: 'Perfil do Usuário', key: 'tipoUser' },
            { header: 'Patr. Micro', key: 'host' },
            { header: 'Modelo do Micro', key: 'modeloHost' },
            { header: 'Sistema Operacional', key: 'sistema' },
            { header: 'Disco Rígido (MB)', key: 'hd' },
            { header: 'Memória RAM (MB)', key: 'ram' },
            { header: 'Patr. Monitor', key: 'monitor' },
            { header: 'Modelo do Monitor', key: 'modeloMonitor' },
            { header: 'Patr. 2º Monitor', key: 'monitor2' },
            { header: 'Modelo do 2º Monitor', key: 'modeloMonitor2' },
            { header: 'Patr. Estabilizador', key: 'estab' },
            { header: 'Modelo do Estabilizador', key: 'modeloEstab' },
            { header: 'Patr. Impressora', key: 'impressora' },
            { header: 'Modelo da Impressora', key: 'modeloImpressora' },
            { header: 'Patr. Imp. Fiscal', key: 'impFiscal' },
            { header: 'Modelo da Imp. Fiscal', key: 'modeloImpFiscal' },
            { header: 'Patr. Imp. Térmica', key: 'impEtiqueta' },
            { header: 'Modelo da Imp. Térmica', key: 'modeloImpEtiqueta' },
            { header: 'Patr. Leitor', key: 'leitor' },
            { header: 'Modelo do Leitor', key: 'modeloLeitor' },
            { header: 'Scanner', key: 'scanner' },
            { header: 'Modelo do Scanner', key: 'modeloScanner' },
            { header: 'Patr. Outro Periférico', key: 'periferico' },
            { header: 'Modelo do Periférico', key: 'modeloPeriferico' },
            { header: 'Outras anotações', key: 'notas' }
        ]

        // Definindo largura das colunas de cabeçalho
        worksheet.columns.forEach(column => {
            column.width = column.header.length < 12 ? 15 : column.header.length
        })

        // Setando cabeçalho em negrito
        worksheet.getRow(1).font = { bold: true }

        // Populando as células
        dados.forEach((e, index) => {
            const rowIndex = index + 2
            worksheet.addRow({
                ...e
            })
        })

        // Salvando arquivo onde o usuário decidir
        dialog.showSaveDialog({
            filters: [{
                name: 'Arquivo XLSX',
                extensions: ['xlsx']
            }]
        }).then(result => {
            workbook.xlsx.writeFile(result.filePath)
        }).catch(err => {
            console.log(err)
        })
    })
}

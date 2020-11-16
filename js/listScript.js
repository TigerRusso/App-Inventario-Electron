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

function listItens() {

    const tbody = document.querySelector('tbody')
    let linhas = []

    fs.readFile(path.join(__dirname, 'itens.json'), 'utf-8', function (err, data) {
        if (err) throw err;

        const obj = JSON.parse(data)
        let qtdObjs = obj.dados

        for (let i = 0; i < qtdObjs.length; i++) {
            const tr = document.createElement('tr')
            let cont = 0
            for (let key in qtdObjs[i]) {
                let td = document.createElement('td')
                td.textContent = qtdObjs[i][key]
                tr.appendChild(td)

                if (cont == 16) {
                    var btn = document.createElement('button')
                    btn.textContent = 'x'
                    btn.classList.add('btn-lixo')
                    let td = document.createElement('td')
                    td.appendChild(btn)
                    tr.appendChild(td)
                }
                cont++
            }
            tbody.appendChild(tr)
            linhas.push(tr)
            getID(btn)
        }
    })
}

function deletaLinha(id) {
    fs.readFile(path.join(__dirname, 'itens.json'), 'utf-8', function (err, data) {
        if (err) throw err;

        const obj = JSON.parse(data)
        for (let i = 0; i < obj.dados.length; i++) {
            if (id == obj.dados[i].id) {
                let index = parseInt(id)

                obj.dados.splice((index - 1), 1)
                for (let i = 0; i < obj.dados.length; i++) {
                    obj.dados[i].id = i + 1
                }

                fs.writeFile(path.join(__dirname, 'itens.json'), JSON.stringify(obj, null, 4), 'utf-8', err => {
                    if (err) throw err
                })
                console.log(index)
                console.log(obj.dados)
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

        deletaLinha(id)
    })
}

function excluirLista() {
    fs.readFile(path.join(__dirname, 'itens.json'), 'utf-8', (err, data) => {
        if (err) throw err

        const obj = JSON.parse(data)
        obj.dados.splice(0, obj.dados.length)

        fs.writeFile(path.join(__dirname, 'itens.json'), JSON.stringify(obj, null, 4), 'utf-8', err => {
            if (err) throw err
        })

    })
}

function exportarExcel() {

    fs.readFile(path.join(__dirname, 'itens.json'), 'utf-8', (err, data) => {
        if (err) throw err

        const obj = JSON.parse(data)
        const dados = obj.dados
        const workbook = new excel.Workbook()
        const worksheet = workbook.addWorksheet('Inventário')

        // Definindo os cabeçalhos
        worksheet.columns = [
            { header: 'CRAAI', key: 'crai' },
            { header: 'Comarca', key: 'comarca' },
            { header: 'Órgão', key: 'orgao' },
            { header: 'Sistema Operacional', key: 'sistema' },
            { header: 'Disco Rígido (MB)', key: 'hd' },
            { header: 'Usuário', key: 'user' },
            { header: 'Memória RAM (MB)', key: 'ram' },
            { header: 'Patr. Micro', key: 'host' },
            { header: 'Patr. Estabilizador', key: 'estab' },
            { header: 'Patr. Leitor', key: 'leitor' },
            { header: 'Patr. 2º Leitor', key: 'leitor2' },
            { header: 'Patr. Monitor', key: 'monitor' },
            { header: 'Patr. 2º Monitor', key: 'monitor2' },
            { header: 'Patr. Impressora', key: 'impressora' },
            { header: 'Patr. Imp. Etiqueta', key: 'impEtiqueta' },
            { header: 'Patr. Imp. Fiscal', key: 'impFiscal' }
        ]

        // Definindo largura das colunas de cabeçalho
        worksheet.columns.forEach(column => {
            column.width = column.header.length < 12 ? 12 : column.header.length
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

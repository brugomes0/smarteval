import ExcelJS from 'exceljs'
import LL from '../i18n/i18n-svelte'

export async function generateInterdepartamentalExcel(username: string, title: string, ratingOptions: { numericValue: number, title: string }[], departments: any, totals: any) {
    // ----------------------------------------------------------------------------------
    // Create workbook
    // ----------------------------------------------------------------------------------
    const workbook = new ExcelJS.Workbook()
    let currentDate = new Date()

    workbook.creator = username
    workbook.created = currentDate
    workbook.modified = currentDate
    workbook.views = [{ x: 0, y: 0, width: 10000, height: 20000, firstSheet: 0, activeTab: 0, visibility: 'visible' }]

    // ----------------------------------------------------------------------------------
    // Create sheet of total average
    // ----------------------------------------------------------------------------------
    let worksheetNameLabel: string = ""
    let evaluationNameLabel: string = ""
    let averageLabel: string = ""
    let totalLabel: string = ""
    let scaleLabel: string = ""
    LL.subscribe(temp => {
        evaluationNameLabel = temp.EvaluationTypes.Interdepartmental()
        worksheetNameLabel = temp.Excel.Compilation()
        averageLabel = temp.Excel.Average()
        totalLabel = temp.Excel.Total()
        scaleLabel = temp.Excel.Scale()
    })

    let scale: string = stringifyRatingOptions(ratingOptions)

    const incomeSheet = workbook.addWorksheet(worksheetNameLabel, { 
        views: [{ state: 'frozen', xSplit: 1, ySplit: 8, showGridLines: false }]
    })

    incomeSheet.mergeCells('A1:A5')
    incomeSheet.getCell('A1').value = title + ` (${evaluationNameLabel})`
    incomeSheet.getCell('A1').font = { bold: true, name: 'Arial', size: 14 }
    incomeSheet.getCell('A1').alignment = { vertical: 'middle', horizontal: 'center', wrapText: true }
    incomeSheet.getColumn('A').width = 50
    incomeSheet.getRow(5).border = { bottom: { style: 'thick', color: { argb: 'FF0000' } } }

    incomeSheet.getCell('A6').value = `${scaleLabel}: ` + scale
    incomeSheet.getCell('A6').alignment = { vertical: 'middle', horizontal: 'center', wrapText: true }
    incomeSheet.getCell('A6').font = { name: 'Arial', size: 8 }
    incomeSheet.getRow(6).height = 50
    incomeSheet.getRow(7).height = 40
    incomeSheet.getRow(8).height = 30

    let startColumn = 2
    let indexColumn = startColumn
    let categories = departments[0].totals.categories

    categories.forEach((category: any) => {
        let startCellAddress = incomeSheet.getCell(7, indexColumn)
        let endCellAddress = incomeSheet.getCell(7, indexColumn + category.questions.length)
        incomeSheet.mergeCells(startCellAddress.address, endCellAddress.address)
        startCellAddress.value = `${category.title} (${category.percentage}%)`
        startCellAddress.fill = { type: 'pattern', pattern: 'solid', fgColor: { argb: 'FF4B4B4B' } }
        startCellAddress.font = { color: { argb: 'FFFFFFFF' }, bold: true, name: 'Arial', size: 11 }
        startCellAddress.alignment = { vertical: 'middle', horizontal: 'center', wrapText: true }
        startCellAddress.border = { left: { style: 'medium', color: { argb: 'FFFFFFFF'}} }

        category.questions.forEach((question: any, index: number) => {
            let cellAddress = incomeSheet.getCell(8, indexColumn + index)
            incomeSheet.getColumn(cellAddress.col).width = 30
            cellAddress.value = `${question.title} (${question.percentage}%)`
            cellAddress.fill = { type: 'pattern', pattern: 'solid', fgColor: { argb: 'FF4B4B4B' } }
            cellAddress.font = { color: { argb: 'FFFFFFFF' }, bold: true, name: 'Arial', size: 8 }
            cellAddress.alignment = { vertical: 'middle', horizontal: 'center', wrapText: true }
            cellAddress.border = { left: { style: 'medium', color: { argb: 'FFFFFFFF' }}, top: { style: 'medium', color: { argb: 'FFFFFFFF' }} }
        })

        let cellAddress = incomeSheet.getCell(8, indexColumn + category.questions.length)
        incomeSheet.getColumn(cellAddress.col).width = 10
        cellAddress.value = averageLabel
        cellAddress.fill = { type: 'pattern', pattern: 'solid', fgColor: { argb: 'FF4B4B4B' } }
        cellAddress.font = { color: { argb: 'FFFFFFFF' }, bold: true, name: 'Arial', size: 8 }
        cellAddress.alignment = { vertical: 'middle', horizontal: 'center', wrapText: true }
        cellAddress.border = { left: { style: 'medium', color: { argb: 'FFFFFFFF' }}, top: { style: 'medium', color: { argb: 'FFFFFFFF' }} }

        indexColumn += category.questions.length + 1
    })

    let totalSingleDepCellAddress = incomeSheet.getCell(8, indexColumn)
    incomeSheet.getColumn(totalSingleDepCellAddress.col).width = 10
    totalSingleDepCellAddress.value = totalLabel
    totalSingleDepCellAddress.fill = { type: 'pattern', pattern: 'solid', fgColor: { argb: 'FF4B4B4B' } }
    totalSingleDepCellAddress.font = { color: { argb: 'FFFFFFFF' }, bold: true, name: 'Arial', size: 8 }
    totalSingleDepCellAddress.alignment = { vertical: 'middle', horizontal: 'center', wrapText: true }
    totalSingleDepCellAddress.border = { left: { style: 'medium', color: { argb: 'FFFFFFFF' }}, top: { style: 'medium', color: { argb: 'FFFFFFFF' }} }

    let startRowDepartments = 9
    let auxRowDepartments = startRowDepartments
    departments.forEach((department: any) => {
        let auxColDepartments = 1
        let cellAddress = incomeSheet.getCell(auxRowDepartments, auxColDepartments)
        incomeSheet.getRow(auxRowDepartments).height = 30
        cellAddress.value = department.evaluatedDepartment
        cellAddress.fill = { type: 'pattern', pattern: 'solid', fgColor: { argb: 'FF4B4B4B' } }
        cellAddress.font = { color: { argb: 'FFFFFFFF' }, bold: true, name: 'Arial', size: 8 }
        cellAddress.alignment = { vertical: 'middle', horizontal: 'center', wrapText: true }
        cellAddress.border = { left: { style: 'medium', color: { argb: 'FFFFFFFF' }}, top: { style: 'medium', color: { argb: 'FFFFFFFF' }} }

        auxColDepartments++

        department.totals.categories.forEach((category: any) => {
            category.questions.forEach((question: any) => {
                let cellAddress = incomeSheet.getCell(auxRowDepartments, auxColDepartments)
                cellAddress.value = question.rating != 0.00 ? question.rating.toFixed(2) : '-'
                cellAddress.alignment = { vertical: 'middle', horizontal: 'center', wrapText: true }
                cellAddress.border = { bottom: { style: 'thin', color: { argb: '00000000'}}, right: { style: 'thin', color: { argb: '00000000'}} }
                cellAddress.font = { name: 'Arial', size: 10 }
                auxColDepartments++
            })

            let cellAddress = incomeSheet.getCell(auxRowDepartments, auxColDepartments)
            cellAddress.value = category.average.toFixed(2)
            cellAddress.alignment = { vertical: 'middle', horizontal: 'center', wrapText: true }
            cellAddress.border = { bottom: { style: 'thin', color: { argb: '00000000'}}, right: { style: 'thin', color: { argb: '00000000'}} }
            cellAddress.font = { name: 'Arial', size: 10 }
            auxColDepartments++
        })

        let totalCellAddress = incomeSheet.getCell(auxRowDepartments, auxColDepartments)
        totalCellAddress.value = department.totals.averageDepartment.toFixed(2)
        totalCellAddress.alignment = { vertical: 'middle', horizontal: 'center', wrapText: true }
        totalCellAddress.border = { bottom: { style: 'thin', color: { argb: '00000000'}}, right: { style: 'thin', color: { argb: '00000000'}} }
        totalCellAddress.font = { bold: true, name: 'Arial', size: 10 }

        auxRowDepartments++
    })

    let auxColDepartments = 1
    let cellAverageAddress = incomeSheet.getCell(auxRowDepartments, auxColDepartments)
    incomeSheet.getRow(auxRowDepartments).height = 20
    cellAverageAddress.value = averageLabel
    cellAverageAddress.alignment = { horizontal: 'right', vertical: 'middle', wrapText: true }
    cellAverageAddress.font = { bold: true, name: 'Arial', size: 8 }

    auxColDepartments++

    totals.categories.forEach((category: any) => {
        category.questions.forEach((question: any) => {
            let cellAddress = incomeSheet.getCell(auxRowDepartments, auxColDepartments)
            cellAddress.value = question.rating.toFixed(2)
            cellAddress.fill = { type: 'pattern', pattern: 'solid', fgColor: { argb: 'FF4B4B4B' } }
            cellAddress.font = { color: { argb: 'FFFFFFFF' }, bold: true, name: 'Arial', size: 10 }
            cellAddress.alignment = { vertical: 'middle', horizontal: 'center', wrapText: true }
            cellAddress.border = { left: { style: 'medium', color: { argb: 'FFFFFFFF' } }, top: { style: 'medium', color: { argb: 'FFFFFFFF' } } }
            auxColDepartments++
        })

        let avgCategoryCellAddress = incomeSheet.getCell(auxRowDepartments, auxColDepartments)
        avgCategoryCellAddress.value = category.average.toFixed(2)
        avgCategoryCellAddress.fill = { type: 'pattern', pattern: 'solid', fgColor: { argb: 'FF4B4B4B' } }
        avgCategoryCellAddress.font = { color: { argb: 'FFFFFFFF' }, bold: true, name: 'Arial', size: 10 }
        avgCategoryCellAddress.alignment = { vertical: 'middle', horizontal: 'center', wrapText: true }
        avgCategoryCellAddress.border = { left: { style: 'medium', color: { argb: 'FFFFFFFF' } }, top: { style: 'medium', color: { argb: 'FFFFFFFF' } } }
        auxColDepartments++
    })

    let totalEvalCellAddress = incomeSheet.getCell(auxRowDepartments, auxColDepartments)
    totalEvalCellAddress.value = totals.average.toFixed(2)
    totalEvalCellAddress.fill = { type: 'pattern', pattern: 'solid', fgColor: { argb: 'FF4B4B4B' } }
    totalEvalCellAddress.font = { color: { argb: 'FFFF0000' }, bold: true, name: 'Arial', size: 10 }
    totalEvalCellAddress.alignment = { vertical: 'middle', horizontal: 'center', wrapText: true }
    totalEvalCellAddress.border = { left: { style: 'medium', color: { argb: 'FFFFFFFF' } }, top: { style: 'medium', color: { argb: 'FFFFFFFF' } } }

    // ----------------------------------------------------------------------------------
    // Create sheets of each department
    // ----------------------------------------------------------------------------------
    departments.forEach((department: any) => {
        // Create worksheet
        let departmentSheet = workbook.addWorksheet(department.evaluatedDepartment, {
            views: [{ state: 'frozen', xSplit: 1, ySplit: 8, showGridLines: false }]
        })

        // Create title
        departmentSheet.mergeCells('A1:A5')
        departmentSheet.getCell('A1').value = title + ` (${evaluationNameLabel})`
        departmentSheet.getCell('A1').font = { bold: true, name: 'Arial', size: 14 }
        departmentSheet.getCell('A1').alignment = { vertical: 'middle', horizontal: 'center', wrapText: true }
        departmentSheet.getColumn('A').width = 50
        departmentSheet.getRow(5).border = { bottom: { style: 'thick', color: { argb: 'FF0000' } } }

        departmentSheet.getCell('A6').value = scale
        departmentSheet.getCell('A6').alignment = { vertical: 'middle', horizontal: 'center', wrapText: true }
        departmentSheet.getCell('A6').font = { name: 'Arial', size: 8 }
        departmentSheet.getRow(6).height = 50
        departmentSheet.getRow(7).height = 40
        departmentSheet.getRow(8).height = 30

        // Get categories and questions from evaluation
        let categories = department.evaluatorDepartments[0].categories

        // Create Questions columns
        let indexCatColumnDep = startColumn
        categories.forEach((category: any) => {
            // Write categories
            let startCellAddress = departmentSheet.getCell(7, indexCatColumnDep)
            let endCellAddress = departmentSheet.getCell(7, indexCatColumnDep + category.questions.length)
            departmentSheet.mergeCells(startCellAddress.address, endCellAddress.address)
            startCellAddress.value = `${category.title} (${category.percentage}%)`
            startCellAddress.fill = { type: 'pattern', pattern: 'solid', fgColor: { argb: 'FF4B4B4B' } }
            startCellAddress.font = { color: { argb: 'FFFFFFFF' }, bold: true, name: 'Arial', size: 11 }
            startCellAddress.alignment = { vertical: 'middle', horizontal: 'center', wrapText: true }
            startCellAddress.border = { left: { style: 'medium', color: { argb: 'FFFFFFFF'}} }

            // Write questions of each category
            category.questions.forEach((question: any, index: number) => {
                let cellAddress = departmentSheet.getCell(8, indexCatColumnDep + index)
                departmentSheet.getColumn(cellAddress.col).width = question.type == "Rating" ? 30 : 50
                departmentSheet.getCell(cellAddress.address).value = `${question.title} (${question.percentage}%)`
                departmentSheet.getCell(cellAddress.address).fill = { type: 'pattern', pattern: 'solid', fgColor: { argb: 'FF4B4B4B' } }
                departmentSheet.getCell(cellAddress.address).font = { color: { argb: 'FFFFFFFF' }, bold: true, name: 'Arial', size: 8 }
                departmentSheet.getCell(cellAddress.address).alignment = { vertical: 'middle', horizontal: 'center', wrapText: true }
                departmentSheet.getCell(cellAddress.address).border = { left: { style: 'medium', color: { argb: 'FFFFFFFF' }}, top: { style: 'medium', color: { argb: 'FFFFFFFF' }} }
            })

            // Write average of category
            let cellAddress = departmentSheet.getCell(8, indexCatColumnDep + category.questions.length)
            departmentSheet.getColumn(cellAddress.col).width = 10
            departmentSheet.getCell(cellAddress.address).value = averageLabel
            departmentSheet.getCell(cellAddress.address).fill = { type: 'pattern', pattern: 'solid', fgColor: { argb: 'FF4B4B4B' } }
            departmentSheet.getCell(cellAddress.address).font = { color: { argb: 'FFFFFFFF' }, bold: true, name: 'Arial', size: 8 }
            departmentSheet.getCell(cellAddress.address).alignment = { vertical: 'middle', horizontal: 'center', wrapText: true }
            departmentSheet.getCell(cellAddress.address).border = { left: { style: 'medium', color: { argb: 'FFFFFFFF' }}, top: { style: 'medium', color: { argb: 'FFFFFFFF' }} }

            indexCatColumnDep += category.questions.length + 1
        })

        // colum of total of each evaluator submission to evaluated
        let totalCellAddress = departmentSheet.getCell(8, indexCatColumnDep)
        departmentSheet.getColumn(totalCellAddress.col).width = 10
        departmentSheet.getCell(totalCellAddress.address).value = totalLabel
        departmentSheet.getCell(totalCellAddress.address).fill = { type: 'pattern', pattern: 'solid', fgColor: { argb: 'FF4B4B4B' } }
        departmentSheet.getCell(totalCellAddress.address).font = { color: { argb: 'FFFFFFFF' }, bold: true, name: 'Arial', size: 8 }
        departmentSheet.getCell(totalCellAddress.address).alignment = { vertical: 'middle', horizontal: 'center', wrapText: true }
        departmentSheet.getCell(totalCellAddress.address).border = { left: { style: 'medium', color: { argb: 'FFFFFFFF' }}, top: { style: 'medium', color: { argb: 'FFFFFFFF' }} }

        let startRowDepartments = 9
        let auxRowDepartments = startRowDepartments
        let startColDepartments = 1
        let auxColDepartments = startColDepartments
        department.evaluatorDepartments.forEach((evDepartment: any) => {
            let cellAddress = departmentSheet.getCell(auxRowDepartments, auxColDepartments)
            departmentSheet.getRow(auxRowDepartments).height = 30
            departmentSheet.getCell(cellAddress.address).value = evDepartment.evaluatorDepartment
            departmentSheet.getCell(cellAddress.address).fill = { type: 'pattern', pattern: 'solid', fgColor: { argb: 'FF4B4B4B' } }
            departmentSheet.getCell(cellAddress.address).font = { color: { argb: 'FFFFFFFF' }, bold: true, name: 'Arial', size: 8 }
            departmentSheet.getCell(cellAddress.address).alignment = { vertical: 'middle', horizontal: 'center', wrapText: true }
            departmentSheet.getCell(cellAddress.address).border = { left: { style: 'medium', color: { argb: 'FFFFFFFF' }}, top: { style: 'medium', color: { argb: 'FFFFFFFF' }} }

            auxColDepartments++

            evDepartment.categories.forEach((category: any) => {
                category.questions.forEach((question: any) => {
                    let cellAddress = departmentSheet.getCell(auxRowDepartments, auxColDepartments)
                    if (question.type === "Rating") {
                        cellAddress.value = question.rating ? question.rating.toFixed(2) : '-'
                        cellAddress.font = { name: 'Arial', size: 10 }
                    } else {
                        cellAddress.value = question.text
                        cellAddress.font = { name: 'Arial', size: 8 }
                    }
                    cellAddress.alignment = { vertical: 'middle', horizontal: 'center', wrapText: true }
                    cellAddress.border = { bottom: { style: 'thin', color: { argb: '00000000'}}, right: { style: 'thin', color: { argb: '00000000'}} }
                    auxColDepartments++
                })

                let cellAddress = departmentSheet.getCell(auxRowDepartments, auxColDepartments)
                cellAddress.value = category.average.toFixed(2)
                cellAddress.alignment = { vertical: 'middle', horizontal: 'center', wrapText: true }
                cellAddress.border = { bottom: { style: 'thin', color: { argb: '00000000'}}, right: { style: 'thin', color: { argb: '00000000'}} }
                cellAddress.font = { name: 'Arial', size: 10 }
                auxColDepartments++
            })

            let totalCellAddress = departmentSheet.getCell(auxRowDepartments, auxColDepartments)
            totalCellAddress.value = evDepartment.averageDepartment.toFixed(2)
            totalCellAddress.alignment = { vertical: 'middle', horizontal: 'center', wrapText: true }
            totalCellAddress.border = { bottom: { style: 'thin', color: { argb: '00000000'}}, right: { style: 'thin', color: { argb: '00000000'}} }
            totalCellAddress.font = { bold: true, name: 'Arial', size: 10 }

            auxRowDepartments++
            auxColDepartments = startColDepartments
        })

        auxColDepartments = 1
        let cellAverageAddress = departmentSheet.getCell(auxRowDepartments, auxColDepartments)
        departmentSheet.getRow(auxRowDepartments).height = 20
        cellAverageAddress.value = averageLabel
        cellAverageAddress.alignment = { horizontal: 'right', vertical: 'middle', wrapText: true }
        cellAverageAddress.font = { bold: true, name: 'Arial', size: 8 }

        auxColDepartments++

        department.totals.categories.forEach((category: any) => {
            category.questions.forEach((question: any) => {
                let cellAddress = departmentSheet.getCell(auxRowDepartments, auxColDepartments)
                cellAddress.value = question.rating.toFixed(2)
                cellAddress.fill = { type: 'pattern', pattern: 'solid', fgColor: { argb: 'FF4B4B4B' } }
                cellAddress.font = { color: { argb: 'FFFFFFFF' }, bold: true, name: 'Arial', size: 10 }
                cellAddress.alignment = { vertical: 'middle', horizontal: 'center', wrapText: true }
                cellAddress.border = { left: { style: 'medium', color: { argb: 'FFFFFFFF' }}, top: { style: 'medium', color: { argb: 'FFFFFFFF' }} }
                auxColDepartments++
            })

            let cellAddress = departmentSheet.getCell(auxRowDepartments, auxColDepartments)
            cellAddress.value = category.average.toFixed(2)
            cellAddress.fill = { type: 'pattern', pattern: 'solid', fgColor: { argb: 'FF4B4B4B' } }
            cellAddress.font = { color: { argb: 'FFFFFFFF' }, bold: true, name: 'Arial', size: 10 }
            cellAddress.alignment = { vertical: 'middle', horizontal: 'center', wrapText: true }
            cellAddress.border = { left: { style: 'medium', color: { argb: 'FFFFFFFF' }}, top: { style: 'medium', color: { argb: 'FFFFFFFF' }} }
            auxColDepartments++
        })

        let totalAllEvalCellAddress = departmentSheet.getCell(auxRowDepartments, auxColDepartments)
        totalAllEvalCellAddress.value = department.totals.averageDepartment.toFixed(2)
        totalAllEvalCellAddress.fill = { type: 'pattern', pattern: 'solid', fgColor: { argb: 'FF4B4B4B' } }
        totalAllEvalCellAddress.font = { color: { argb: 'FFFF0000' }, bold: true, name: 'Arial', size: 10 }
        totalAllEvalCellAddress.alignment = { vertical: 'middle', horizontal: 'center', wrapText: true }
        totalAllEvalCellAddress.border = { left: { style: 'medium', color: { argb: 'FFFFFFFF' }}, top: { style: 'medium', color: { argb: 'FFFFFFFF' }} }
    })

    // ----------------------------------------------------------------------------------
    // Create excel file
    // ----------------------------------------------------------------------------------
    try {
        const buffer = await workbook.xlsx.writeBuffer()
        const fileType = 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet;chartset=UTF-8'
        const EXCEL_EXTENSION = '.xlsx'
        const blob = new Blob([buffer], { type: fileType })

        // @ts-ignore
        if (navigator.msSaveBlog) {
            // @ts-ignore
            navigator.msSaveBlog(blob, `${title}` + EXCEL_EXTENSION)
        } else {
            const link = document.createElement('a')
            if (link.download !== undefined) {
                const url = URL.createObjectURL(blob)
                link.setAttribute('href', url)
                link.setAttribute('download', `${title.replace(' ', '_')}_Interdepartamental` + EXCEL_EXTENSION)
                link.style.visibility = 'hidden'
                document.body.appendChild(link)
                link.click()
                document.body.removeChild(link)
            }
        }
    } catch (ex) { console.error(ex) }
}

function stringifyRatingOptions(options: { numericValue: number, title: string }[]): string {
    let string: string = ""

    if (options.length == 0) return ""

    options.map(rto => { string += `${rto.numericValue} - ${rto.title};` })
    return string
}
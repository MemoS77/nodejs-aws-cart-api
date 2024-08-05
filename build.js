const archiver = require('archiver')
const fs = require('fs')
const path = require('path')

// Пути к папкам `dist` и `node_modules`
const distPath = path.resolve(__dirname, 'dist')
const nodeModulesPath = path.resolve(__dirname, 'node_modules')

// Путь к выходному ZIP-архиву
const outputZipPath = path.resolve(__dirname, 'lambda.zip')

// Создаем новый архив
const archive = archiver('zip', {
  zlib: { level: 9 }, // уровень сжатия
})

// Создаем поток для записи архива
const output = fs.createWriteStream(outputZipPath)

// Начинаем архивирование
archive.pipe(output)

archive.directory(distPath, false)

archive.directory(nodeModulesPath, 'node_modules')

// Заканчиваем архивирование
archive.finalize()

// Обработчики событий для отслеживания процесса архивирования
output.on('close', function () {
  console.log(`Successfully created ZIP archive at ${outputZipPath}`)
})

archive.on('error', function (err) {
  throw err
})
